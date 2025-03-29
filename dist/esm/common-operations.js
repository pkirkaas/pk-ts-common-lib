/**
 * @library - pk-ts-common
 * @file - common-operations.ts
 * @fileoverview - Library of `ES2022` TypeScript/JavaScript utility functions for use in both Node.js & browser environments.
 */
// NPM Imports
import urlStatus from 'url-status-code';
import JSON5 from 'json5';
import path from 'path';
import 'zod-metadata/register';
import _ from "lodash";
//import { PkError, GenericObject, GenObj } from './index.js';
import { PkError, } from './index.js';
import { extend } from "./lib/json-decyle-3.js";
//@ts-ignore
extend(JSON5);
//@ts-ignore
extend(JSON);
import * as ESP from "error-stack-parser";
import axios from "axios";
import { isValid, add, } from "date-fns";
import { format, } from "date-fns/format";
/**
 * @aider
 * Ensures a value is an array, converting single items to arrays or handling null/undefined
 *
 * @template T - The type of elements in the array
 * @param {T | T[]} arg - A single item or array of items to ensure is an array
 * @returns {T[]} A new array containing the input item(s), or an empty array if input is null/undefined
 *
 * @description
 * This utility function guarantees that the return value is always an array by:
 * - Returning the original array if the input is already an array
 * - Converting a single item into a single-element array
 * - Returning an empty array if the input is null or undefined
 *
 * This is particularly useful for parameter handling when a function accepts
 * either a single value or an array of values.
 *
 * @example
 * // Array input remains unchanged
 * mkArray([1, 2, 3])  // Returns [1, 2, 3]
 *
 * // Single item is converted to array
 * mkArray(1)  // Returns [1]
 * mkArray("text")  // Returns ["text"]
 *
 * // Null/undefined values become empty array
 * mkArray(null)  // Returns []
 * mkArray(undefined)  // Returns []
 */
export function mkArray(arg) {
    return isVoid(arg) ? [] : (Array.isArray(arg) ? arg : [arg]);
}
/**
 * Checks if the arg can be converted to a number
 * If not, returns boolean false
 * If is numeric:
 *   returns boolean true if asNum is false
 *   else returns the numeric value (which could be 0)
 *
 * @aider
 * @param {any} arg - The value to check if it can be converted to a number
 * @param {boolean} [asNum=false] - If true, returns the numeric value instead of boolean true
 * @returns {number|boolean}
 *   - If arg is not numeric: false
 *   - If arg is numeric and asNum is false: true
 *   - If arg is numeric and asNum is true: the numeric value
 * @example
 * // Returns true
 * isNumeric("123")
 * // Returns 123
 * isNumeric("123", true)
 * // Returns false
 * isNumeric("abc")
 */
export function isNumeric(arg, asNum = false) {
    let num = Number(arg);
    if (num !== parseFloat(arg)) {
        return false;
    }
    if (asNum) {
        return num;
    }
    return true;
}
/**
 * Returns the numeric value, or boolean false
 *
 * @aider
 * @param {any} arg - The value to convert to a number
 * @returns {number|boolean} The numeric value if conversion is possible, otherwise false
 * @example
 * // Returns 123
 * asNumeric("123")
 * // Returns false
 * asNumeric("abc")
 */
export function asNumeric(arg) {
    return isNumeric(arg, true);
}
/**
 * For TS Type Guards - predicate `is<Type>` functions
 */
/**
 * Checks if the argument is "Empty" - null, undefined, empty string, empty array, empty object
 * This is a tough call & really hard to get right...
 *
 * @aider
 * @param {any} arg - The value to check for emptiness
 * @returns {boolean} True if the argument is considered empty, false otherwise
 * @description
 * Considers the following as empty:
 * - null or undefined
 * - Empty arrays (length === 0)
 * - Empty objects (no own properties)
 * - Falsy values (0, "", false)
 *
 * Functions are never considered empty.
 * Objects are considered empty if they have no keys and no non-built-in properties.
 * @example
 * // All return true
 * isEmpty(null)
 * isEmpty(undefined)
 * isEmpty([])
 * isEmpty({})
 * isEmpty("")
 *
 * // All return false
 * isEmpty(0)
 * isEmpty(false)
 * isEmpty({a: 1})
 * isEmpty([1])
 * isEmpty(() => {})
 */
export function isEmpty(arg) {
    if (!arg || (Array.isArray(arg) && !arg.length)) {
        return true;
    }
    let toarg = typeof arg;
    if (toarg === "object") {
        let props = getProps(arg);
        let keys = Object.keys(arg);
        let aninb = inArr1NinArr2(props, builtInProps);
        if (!keys.length && !aninb.length) {
            return true;
        }
    }
    if (toarg === 'function') {
        return false;
    }
    return false;
}
/**
 * @aider
 * Type guard that checks if a value is a valid JavaScript property key
 *
 * @param {unknown} key - The value to check
 * @returns {boolean} True if the value is a valid property key (string, symbol, or number)
 *
 * @description
 * Type guard function that checks if a value is a valid JavaScript property key.
 * In JavaScript, valid property keys are:
 * - Strings
 * - Symbols
 * - Numbers (which are converted to strings when used as property keys)
 *
 * This function is useful when working with dynamic property access or when
 * validating user input that will be used as an object key.
 *
 * @example
 * // All return true
 * isPropertyKey("name")
 * isPropertyKey(Symbol("id"))
 * isPropertyKey(42)
 *
 * // All return false
 * isPropertyKey(null)
 * isPropertyKey(undefined)
 * isPropertyKey({})
 * isPropertyKey([])
 * isPropertyKey(true)
 */
export function isPropertyKey(key) {
    return typeof key === 'string' || typeof key === 'symbol' || typeof key === 'number';
}
/*
export function isObjKey(arg: any): arg is ObjKey {
  return typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol';
}
  */
/**
 * @aider
 * Type guard that checks if a value is null or undefined
 *
 * @param {unknown} arg - The value to check
 * @returns {arg is Void} True if the value is null or undefined, false otherwise
 *
 * @description
 * Type guard function that strictly checks if a value is null or undefined.
 *
 * Unlike isEmpty() which considers empty strings, arrays, and objects as "empty",
 * this function only returns true for null and undefined values.
 *
 * This is particularly important when:
 * - Testing if a parameter was not passed (null/undefined) versus passed as falsy value (0, "", false)
 * - Implementing optional parameters with default values
 * - Checking for the existence of a property regardless of its value
 *
 * Note: The return type uses TypeScript's type predicate syntax (arg is Void)
 * which helps TypeScript understand the type narrowing.
 *
 * @example
 * // Returns true
 * isVoid(null)
 * isVoid(undefined)
 *
 * // Returns false (all these have values, even if "empty")
 * isVoid(0)
 * isVoid("")
 * isVoid([])
 * isVoid({})
 * isVoid(false)
 *
 * // TypeScript usage example
 * function processValue(value?: string) {
 *   if (isVoid(value)) {
 *     // Handle missing value case
 *   } else {
 *     // TypeScript knows value is string here
 *   }
 * }
 */
export function isVoid(arg) {
    return arg === undefined || arg === null;
}
/**
 * @aider
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a string, false otherwise
 * @description
 * Type guard function that checks if a value is a string.
 * @example
 * // Returns true
 * isString("hello")
 *
 * // Returns false
 * isString(123)
 * isString(null)
 * isString({})
 */
export function isString(value) {
    return typeof value === "string";
}
/**
 * Checks if the argument has values by reference (array, object, etc)
 * Arrays & Objects passed by referrence,
 * risk of unintended changes
 *
 * @aider
 * @param {any} arg - The value to check
 * @returns {boolean} True if the value is passed by reference (object, array, etc.), false otherwise
 * @description
 * Determines if a value is passed by reference rather than by value.
 * This is useful to identify values that could be unintentionally modified.
 * Uses the inverse of isPrimitive() to determine if a value is passed by reference.
 * @example
 * // Returns true
 * isByRef({})
 * isByRef([])
 * isByRef(new Date())
 *
 * // Returns false
 * isByRef(123)
 * isByRef("hello")
 * isByRef(null)
 */
export function isByRef(arg) {
    return !isPrimitive(arg);
}
/**
 * Checks if the argument is a "simple" JS type - boolean, number, string, bigint
 *
 * @aider
 * @param {unknown} arg - The value to check
 * @returns {boolean} True if the value is a simple type (boolean, number, string, or bigint)
 * @description
 * Determines if a value is one of JavaScript's simple primitive types.
 * Simple types are: boolean, number, string, and bigint.
 * This excludes objects, arrays, functions, null, undefined, and symbols.
 * @example
 * // Returns true
 * isSimpleType(true)
 * isSimpleType(123)
 * isSimpleType("hello")
 * isSimpleType(BigInt(123))
 *
 * // Returns false
 * isSimpleType({})
 * isSimpleType([])
 * isSimpleType(null)
 * isSimpleType(undefined)
 * isSimpleType(Symbol())
 */
export function isSimpleType(arg) {
    let simpletypes = ["boolean", "number", "bigint", "string"];
    let toarg = typeof arg;
    return simpletypes.includes(toarg);
}
/**
 * @aider
 * @param {unknown} arg - The value to check
 * @returns {boolean} True if the value is a function, false otherwise
 * @description
 * Type guard function that checks if a value is a function.
 * This includes regular functions, arrow functions, class methods, and class constructors.
 * @example
 * // Returns true
 * isFunction(function() {})
 * isFunction(() => {})
 * isFunction(Array.isArray)
 * isFunction(Date)
 *
 * // Returns false
 * isFunction({})
 * isFunction([])
 * isFunction("function")
 */
export function isFunction(arg) {
    return typeof arg === "function";
}
/**
 * Checks if the argument is a "primitive" JS type - boolean, number, string, bigint, null, undefined, ...
 *
 * @aider
 * @param {unknown} arg - The value to check
 * @returns {boolean} True if the value is a primitive type, false otherwise
 * @description
 * Type guard function that determines if a value is a JavaScript primitive.
 * Primitive values include: string, number, bigint, boolean, undefined, symbol, and null.
 * Non-primitive values (objects) include: Object, Array, Map, Set, Function, Date, RegExp, etc.
 *
 * This function uses the behavior that Object(x) returns a new object wrapper for primitive values,
 * but returns the object itself for non-primitive values. Therefore, x !== Object(x) is true only
 * for primitive values.
 * @example
 * // Returns true
 * isPrimitive("hello")
 * isPrimitive(123)
 * isPrimitive(true)
 * isPrimitive(null)
 * isPrimitive(undefined)
 *
 * // Returns false
 * isPrimitive({})
 * isPrimitive([])
 * isPrimitive(new Date())
 * isPrimitive(() => {})
 */
export function isPrimitive(arg) {
    return arg !== Object(arg);
}
/**
 * Tests if the argument is a "simple" JS object - with just keys
 * & values, not based on other types or prototypes
 *
 * TODO: What about arrays?
 *
 * @aider
 * @param {unknown} anobj - The value to check
 * @returns {boolean} True if the value is a simple object, false otherwise
 * @description
 * Type guard function that determines if a value is a "simple" JavaScript object.
 * A simple object is one created with object literal syntax {} or new Object(),
 * with Object.prototype as its prototype.
 *
 * This excludes:
 * - Arrays (different prototype)
 * - Null values
 * - Primitive values
 * - Class instances (different prototype)
 * - Built-in objects like Date, Map, Set, etc.
 *
 * The function works by comparing the object's prototype with the prototype of an empty object literal.
 * @example
 * // Returns true
 * isSimpleObject({})
 * isSimpleObject({a: 1, b: 2})
 * isSimpleObject(Object.create(Object.prototype))
 *
 * // Returns false
 * isSimpleObject([])
 * isSimpleObject(null)
 * isSimpleObject(new Date())
 * isSimpleObject(new Map())
 * isSimpleObject(Object.create(null))
 * isSimpleObject(123)
 * isSimpleObject("string")
 */
export function isSimpleObject(anobj) {
    if (!anobj || typeof anobj !== "object") {
        return false;
    }
    return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
/**
 * @aider
 * @param {unknown} anobj - The value to check
 * @returns {boolean} True if the value is a generic object, false otherwise
 * @description
 * Type guard function that determines if a value is a generic object (GenObj).
 * This is an alias for isSimpleObject() with identical behavior.
 *
 * A generic object is one created with object literal syntax {} or new Object(),
 * with Object.prototype as its prototype.
 *
 * @see isSimpleObject
 * @example
 * // Returns true
 * isGenObj({})
 * isGenObj({a: 1, b: 2})
 *
 * // Returns false
 * isGenObj([])
 * isGenObj(null)
 * isGenObj(new Date())
 */
export function isGenObj(anobj) {
    if (!anobj || typeof anobj !== "object") {
        return false;
    }
    return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
/**
 * @aider
 * Checks if a value is an object with configurable handling of edge cases
 *
 * @param {any} arg - The value to check
 * @param {boolean} [alsoEmpty=false] - When true, empty objects will also return true
 * @param {boolean} [alsoFunction=true] - When true, functions are considered objects
 * @returns {boolean} True if the value is an object (based on parameters)
 *
 * @description
 * Determines if a value is an object, with configurable behavior for edge cases.
 *
 * This function is more flexible than isSimpleObject() as it can optionally:
 * - Include or exclude empty objects (controlled by alsoEmpty parameter)
 * - Include or exclude functions (controlled by alsoFunction parameter)
 *
 * It uses lodash's isObjectLike for the base check, which returns true for
 * objects that are not null and have typeof 'object'.
 *
 * @example
 * // Basic usage
 * isObject({})         // false (empty object, alsoEmpty=false)
 * isObject({a: 1})     // true
 * isObject([1, 2, 3])  // true (arrays are objects)
 *
 * // With alsoEmpty=true
 * isObject({}, true)   // true
 *
 * // With alsoFunction=false
 * isObject(function(){}, true, false)  // false
 * isObject(function(){})               // true (default alsoFunction=true)
 *
 * // Always false
 * isObject(null)       // false
 * isObject(undefined)  // false
 * isObject(123)        // false
 * isObject("string")   // false
 */
export function isObject(arg, alsoEmpty = false, alsoFunction = true) {
    if (!arg || isPrimitive(arg) || (isEmpty(arg) && !alsoEmpty)) {
        return false;
    }
    if (alsoFunction && (typeof arg === 'function')) {
        return true;
    }
    return _.isObjectLike(arg);
}
/**
 * @aider
 * Checks if multiple objects have completely unique key sets with no overlaps
 *
 * @param {...object[]} args - Objects to test for unique keys
 * @returns {boolean} True if all objects have unique property names (no overlapping keys)
 *
 * @description
 * Determines if multiple objects have completely unique sets of keys with no overlaps.
 * This is useful when merging objects to ensure no properties will be overwritten.
 *
 * The function checks each object's keys against all previously seen keys.
 * If any intersection is found, it returns false immediately.
 *
 * @example
 * // Returns true - no overlapping keys
 * uniqueKeys({a: 1, b: 2}, {c: 3, d: 4})
 * uniqueKeys({x: 1}, {y: 2}, {z: 3})
 *
 * // Returns false - overlapping keys
 * uniqueKeys({a: 1, b: 2}, {b: 3, c: 4})  // 'b' appears in both objects
 * uniqueKeys({x: 1}, {y: 2}, {x: 3})      // 'x' appears in multiple objects
 */
export function uniqueKeys(...args) {
    let allProps = [];
    for (let arg of args) {
        let props = Object.keys(arg);
        let inb = intersect(props, allProps);
        if (inb.length) {
            return false;
        }
        allProps = allProps.concat(props);
    }
    return true;
}
/** Object/function inspection functions - exported below, but summarized here:*/
/**
 * getProps(obj, wVal = false): any[] | GenObj
  array of all property names, or object { prop => value} (if wVal)
 *
 * allProps(obj: any, opt: string = 'tvp', depth = 6): GenObj | [] | string | boolean {
 *  info about obj props, as per opts & depth:
 * 'v' - the raw value
 * 'p' - a parsed, readable value
 * 't' - the value type
 *
 * allPropsWithTypes(obj: any, depth = 6) {
 * objInfo(arg: any, opt: string = 'tpv', depth = 6) - like allProps, but w. type of object itself.
 *
 * inspectFunction(afunc) - function details
 * getObjDets(obj): { toObj, pkToObj, props, prototype, } - like allProps plus w. type, prototype, etc
 *
 * Exported from node-lib:
 * objInspect(obj)
 */
/**
 * EXPERIMENTAL - takes all args, returns array of scalars
 *
 * @aider
 * @param {...any} args - Any number of arguments to convert to a flat array of scalars
 * @returns {Scalar[]} A flattened array of scalar values (strings and numbers)
 * @description
 * Converts any combination of arguments into a flat array of scalar values.
 * Scalar values are defined as strings or numbers (based on the Scalar type).
 *
 * This function:
 * 1. Takes any number of arguments
 * 2. Ensures each argument is an array
 * 3. Concatenates all arrays
 * 4. Deeply flattens the result
 * 5. Casts the result to Scalar[]
 *
 * Note: The function doesn't actually filter for scalar types - it just flattens
 * and casts the result, so non-scalar values may be included in the output.
 * @example
 * // Returns [1, 2, 3, 4, 5, 6]
 * mkScalarArr(1, [2, 3], [[4, 5], 6])
 *
 * // Returns ["a", "b", "c"]
 * mkScalarArr("a", ["b", "c"])
 */
export function mkScalarArr(...args) {
    let ret = [];
    for (let arg of args) {
        if (!Array.isArray(arg)) {
            arg = [arg];
        }
        ret = ret.concat(arg);
    }
    return ret.flat(99);
}
//export { urlStatus, JSON5, GenericObject, GenObj };
export { urlStatus, JSON5, };
/**
 * Check if running in commonJS or ESM Module env.
 * TOTALLY UNTESTED - CODE FROM BARD -in 2023
 * But it finally compiles in tsc for each target - commonjs & esm - try testing !!
 *
 * @aider
 * @returns {boolean} True if the code is running in an ESM environment, false otherwise
 * @description
 * Attempts to detect if the current JavaScript environment is using ES Modules.
 *
 * Note: This function is experimental and untested. It was generated by Bard in 2023
 * but compiles successfully for both CommonJS and ESM targets.
 *
 * The detection logic checks for:
 * - module object existence
 * - module.exports existence
 * - Symbol.toStringTag availability
 * - Symbol.toStringTag having the value 'Module'
 *
 * This may need refinement after testing in various environments.
 */
export function isESM() {
    return typeof module === 'object'
        && module.exports
        && typeof Symbol !== 'undefined'
        && String(Symbol.toStringTag) === 'Module';
}
/**
 * @aider
 * @returns {boolean} True if the code is running in a CommonJS environment, false otherwise
 * @description
 * Attempts to detect if the current JavaScript environment is using CommonJS modules.
 *
 * Note: This function is a companion to isESM() and may need testing in various environments.
 *
 * The detection logic checks for:
 * - module object existence
 * - module.exports being an object
 *
 * This should return true in Node.js environments using require/module.exports
 * and false in browser or ESM environments.
 */
export function isCommonJS() {
    return typeof module !== 'undefined'
        && typeof module.exports === 'object';
}
//Start  Stack examination section  
/**
 * Returns stack trace as array
 * Error().stack returns a string. Convert to array
 *
 * @aider
 * @param {number} [offset=0] - How many levels to shift off the top of the stack trace
 * @returns {string[]} Array of stack trace entries
 * @description
 * Captures the current stack trace and converts it to a more usable array format.
 *
 * The function:
 * 1. Creates a new Error to capture the stack trace
 * 2. Splits the stack string by "at " to separate each stack frame
 * 3. Removes a specified number of top frames (offset + 2)
 * 4. Trims whitespace from each remaining frame
 *
 * The default offset is adjusted by +2 internally to account for this function
 * and its immediate caller.
 * @example
 * // Returns something like:
 * // ["myFunction (file.js:10:5)", "processData (file.js:5:10)"]
 * getStack()
 *
 * // Skip the top frame
 * getStack(1)
 */
export function getStack(offset = 0) {
    offset += 2;
    let stackStr = Error().stack;
    let stackArr = stackStr.split("at ");
    stackArr = stackArr.slice(offset);
    let ret = [];
    for (let row of stackArr) {
        ret.push(row.trim());
    }
    return ret;
}
/**
 * Parse the call stack
 *
 * @aider
 * @returns {Array<{fileName: string, lineNumber: number, functionName: string}>} Array of parsed stack frame objects
 * @description
 * Parses the current call stack into a structured array of objects with detailed information.
 *
 * Uses the error-stack-parser library to extract detailed information from each stack frame.
 * For each frame, it extracts:
 * - fileName: Just the base name of the file (not the full path)
 * - lineNumber: The line number in the file
 * - functionName: The name of the function
 *
 * This provides more structured information than getStack() but requires the external dependency.
 * @example
 * // Returns something like:
 * // [
 * //   { fileName: "app.js", lineNumber: 10, functionName: "myFunction" },
 * //   { fileName: "utils.js", lineNumber: 5, functionName: "processData" }
 * // ]
 * stackParse()
 */
export function stackParse() {
    let stack = ESP.parse(new Error());
    let ret = [];
    for (let info of stack) {
        let res = {
            fileName: path.basename(info.fileName),
            lineNumber: info.lineNumber,
            functionName: info.functionName,
        };
        ret.push(res);
    }
    return ret;
}
/**
 * @aider
 * Generates a contextual timestamp string with debugging information for logging
 *
 * @param {any} [entry] - Optional information to include in the timestamp
 * @param {string|string[]} [frameAfter] - Optional function name(s) to skip when determining the stack frame
 * @returns {string} A formatted timestamp string with date, environment, file info, and optional entry ID
 *
 * @description
 * Creates a detailed timestamp string for logging purposes that includes:
 * - Current date and time formatted as "y-LL-dd H:m:s"
 * - Process environment value
 * - Source file information (filename, function name, line number)
 * - Optional ID from the entry parameter (if entry is an object with an id property)
 *
 * The function uses getFrameAfterFunction() to get contextual information about
 * where the stamp() function was called from, allowing you to see exactly where
 * in your code the log originated.
 *
 * @example
 * // Basic usage - returns something like:
 * // "2023-01-15 14:30:45-development:app.js:processData:25: "
 * stamp()
 *
 * // With an object that has an id
 * // Returns something like: "2023-01-15 14:30:45-development:app.js:processData:25: user123"
 * stamp({id: "user123"})
 *
 * // With a function to skip in the stack trace
 * // Useful when stamp() is called through helper functions
 * stamp(null, "helperFunction")
 */
export function stamp(entry, frameAfter) {
    let entId = "";
    //console.log({ entry });
    if (!isEmpty(entry) && typeof entry === "object") {
        if (entry.id) {
            entId = entry.id;
        }
    }
    let frame = getFrameAfterFunction(frameAfter, true);
    let src = "";
    if (frame) {
        src = `:${path.basename(frame.fileName)}:${frame.functionName}:${frame.lineNumber}:`;
    }
    let now = new Date();
    let pe = process.env.PROCESS_ENV;
    //@ts-ignore
    let ds = format(now, "y-LL-dd H:m:s");
    return `${ds}-${pe}${src}: ${entId} `;
}
/**
 * @aider
 * Analyzes the call stack to find the first frame after specified function(s)
 *
 * @param {string|string[]} [fname] - Function name(s) to skip when determining the stack frame
 * @param {boolean} [forceFunction] - Whether to force retrieval of a function name even if it matches one in the exclude list
 * @returns {Object|undefined} An object containing:
 *   - fileName: Name of the source file
 *   - functionName: Name of the calling function
 *   - lineNumber: Line number in the source file
 *   - or undefined if an error occurs
 *
 * @description
 * Analyzes the current call stack to find the first frame that doesn't match the specified functions to skip.
 * This is useful for logging and debugging to identify where a function was called from,
 * while skipping known utility functions that might be in the middle of the call chain.
 *
 * The function works by:
 * 1. Normalizing the fname parameter to an array
 * 2. Parsing the current stack trace
 * 3. Combining the specified functions to skip with a predefined list of utility functions
 * 4. Finding the first stack frame whose function name is not in the skip list
 * 5. Optionally forcing a valid function name if the found frame has none or is in the exclude list
 *
 * @example
 * // Skip 'helperFunction' in the stack trace
 * const frame = getFrameAfterFunction('helperFunction');
 * console.log(`Called from ${frame.functionName} in ${frame.fileName}:${frame.lineNumber}`);
 *
 * // Skip multiple functions
 * getFrameAfterFunction(['helperFunction', 'utilityFunction']);
 *
 * // Force a valid function name even if it's in the exclude list
 * getFrameAfterFunction('helperFunction', true);
 */
export function getFrameAfterFunction(fname, forceFunction) {
    if (fname && typeof fname === "string") {
        fname = [fname];
    }
    if (!Array.isArray(fname)) {
        fname = [];
    }
    let stack;
    try {
        stack = ESP.parse(new Error());
    }
    catch (err) {
        console.error("Error in ESP.parse/getFrameAfterFunction:");
        return;
    }
    let excludeFncs = [
        "errLog", "baseLog", "getFrameAfterFunction", "getFrameAfterFunction2", "consoleLog", "consoleError",
        "infoLog", "debugLog", "stamp", "fulfilled", "rejected", "processTicksAndRejections", "LogData.log",
        "LogData.out", "LogData.console", "LogData.errLog", "LogData.throw",
    ];
    let fnSkips = ["__awaiter", "undefined", undefined];
    let allSkips = fnSkips.concat(excludeFncs);
    let skips = excludeFncs.concat(fname);
    let lastFrame = stack.shift();
    let frame;
    let nextFrame;
    while ((frame = stack.shift())) {
        lastFrame = frame;
        if (!skips.includes(frame.functionName)) {
            break;
        }
    }
    let functionName = lastFrame.functionName;
    let exFns = skips.concat(fnSkips);
    if (!functionName || (exFns.includes(functionName) && forceFunction)) {
        while ((nextFrame = stack.shift())) {
            let tsFn = nextFrame.functionName;
            if (tsFn && !exFns.includes(tsFn)) {
                functionName = nextFrame.functionName;
                lastFrame.functionName = functionName;
                return lastFrame;
            }
        }
    }
    return lastFrame;
}
// END Stack analasys functions
/**
 * @deprecated - use _.pick instead
 * Return just the subset of the object, for keys specified in the "fields" array.
 * ACTUAALY - can be deep - BUT - consider using lodash `pick` & `omit` instead.
 *
 * @aider
 * @param {GenericObject} obj - Source object to extract fields from
 * @param {any[]} fields - Array of field names or nested field specifications
 * @returns {GenObj} A new object containing only the specified fields from the source object
 * @description
 * Creates a subset of an object by extracting only the specified fields.
 *
 * This function can handle both simple field names and nested field specifications:
 * - Simple field names are directly copied from the source object
 * - Nested field specifications are objects with a single key whose value is an array of fields
 *   to extract from the corresponding nested object
 *
 * Note: This function is deprecated in favor of lodash's _.pick function for simple cases.
 * However, this function supports recursive field selection which _.pick does not.
 *
 * @example
 * // Simple fields
 * subObj({a: 1, b: 2, c: 3}, ['a', 'c'])  // Returns {a: 1, c: 3}
 *
 * // Nested fields
 * subObj({
 *   name: 'John',
 *   age: 30,
 *   address: {street: 'Main St', city: 'Boston', zip: '02101'}
 * }, ['name', {address: ['street', 'city']}])
 * // Returns {name: 'John', address: {street: 'Main St', city: 'Boston'}}
 */
export function subObj(obj, fields) {
    let ret = {};
    for (let field of fields) {
        if (isObject(field)) {
            let key = Object.keys(field)[0];
            let keyFields = field[key];
            if (isPrimitive(keyFields)) {
                keyFields = [keyFields];
            }
            let objKeyVal = obj[key];
            let retKeyVal = subObj(objKeyVal, keyFields);
            ret[key] = subObj(objKeyVal, keyFields);
        }
        else {
            ret[field] = obj[field];
        }
    }
    return ret;
}
/**
 * @aider
 * Splits an object into two parts based on specified keys
 *
 * @param {GenObj} obj - Source object to partition
 * @param {string|string[]} [keys] - Key(s) to include in the picked object
 * @returns {{picked: GenObj, omitted: GenObj}} Object containing:
 *   - picked: Object with only the specified keys
 *   - omitted: Object with all remaining keys
 *
 * @description
 * Divides an object into two separate objects based on the specified keys:
 * - picked: Contains only the properties specified in the keys parameter
 * - omitted: Contains all properties except those specified in the keys parameter
 *
 * This function uses lodash's pick and omit functions to perform the partitioning.
 * If keys is a string, it's converted to a single-element array.
 *
 * @example
 * // Split object by multiple keys
 * partitionObj({a: 1, b: 2, c: 3, d: 4}, ['a', 'c'])
 * // Returns {picked: {a: 1, c: 3}, omitted: {b: 2, d: 4}}
 *
 * // Split object by a single key
 * partitionObj({a: 1, b: 2, c: 3, d: 4}, 'a')
 * // Returns {picked: {a: 1}, omitted: {b: 2, c: 3, d: 4}}
 *
 * // With no keys specified
 * partitionObj({a: 1, b: 2, c: 3, d: 4})
 * // Returns {picked: {}, omitted: {a: 1, b: 2, c: 3, d: 4}}
 */
export function partitionObj(obj, keys) {
    if (typeof keys === "string") {
        keys = [keys];
    }
    let picked = _.pick(obj, keys);
    let omitted = _.omit(obj, keys);
    return { picked, omitted };
}
/**
 * @aider
 * Merges multiple objects with optional key filtering
 *
 * @param {...any} args - First argument can be an array of keys to pick, remaining arguments are objects to merge
 * @returns {object} A new merged object, optionally filtered to only include specified keys
 *
 * @description
 * Creates a new object by deeply merging multiple source objects, with an optional filtering step.
 *
 * This function has two modes of operation:
 * 1. If the first argument is an array, it's treated as a list of keys to pick from the final merged object
 * 2. If all arguments are objects, they are simply merged together
 *
 * This is particularly useful for:
 * - Merging default options with user-supplied options
 * - Creating configuration objects with selective property inclusion
 * - Combining multiple partial objects into a complete object
 *
 * The function uses lodash's merge for deep merging and pick for filtering.
 *
 * @example
 * // Simple merge of objects
 * extractOpts({a: 1}, {b: 2}, {c: 3})
 * // Returns {a: 1, b: 2, c: 3}
 *
 * // Merge with overriding properties
 * extractOpts({a: 1, b: 2}, {b: 3, c: 4})
 * // Returns {a: 1, b: 3, c: 4}
 *
 * // Merge and filter by keys
 * extractOpts(['a', 'c'], {a: 1, b: 2}, {c: 3, d: 4})
 * // Returns {a: 1, c: 3}
 */
export function extractOpts(...args) {
    let keys = null;
    if (Array.isArray(args[0])) {
        keys = args.shift();
    }
    let merged = _.merge({}, ...args);
    if (keys) {
        merged = _.pick(merged, keys);
    }
    return merged;
}
export const dfnsKeys = [`years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`,];
/** Takes a 'duration' object for date-fns/add and validate
 * it. Optionall, converts to negative (time/dates in past)
 *
 * @aider
 * @param {any} obj - Object to validate as a date-fns duration object
 * @returns {object|false} The validated duration object if valid, false otherwise
 * @description
 * Validates if an object is a valid date-fns duration object.
 *
 * A valid duration object must:
 * 1. Be a simple object (not null, array, etc.)
 * 2. Not be empty
 * 3. Have at least one valid duration key (years, months, weeks, days, hours, minutes, seconds)
 * 4. Only contain valid duration keys
 *
 * This function is useful for validating user input before passing it to date-fns functions
 * like add() or sub().
 *
 * Note: The commented parameter forceNegative is not implemented in the current version.
 *
 * @example
 * // Returns the object (valid)
 * validateDateFnsDuration({days: 5, hours: 3})
 *
 * // Returns false (invalid)
 * validateDateFnsDuration({days: 5, invalidKey: 10})
 * validateDateFnsDuration({})
 * validateDateFnsDuration(null)
 */
export function validateDateFnsDuration(obj) {
    if (!isSimpleObject(obj) || isEmpty(obj)) {
        return false;
    }
    let keys = Object.keys(obj);
    if (!intersect(keys, dfnsKeys).length) {
        return false;
    }
    for (let key in obj) {
        if (!dfnsKeys.includes(key)) {
            return false;
        }
    }
    return obj;
}
/**
 * Returns true if arg str contains ANY of the substrings
 *
 * @aider
 * @param {string} str - String to search within
 * @param {string|string[]} substrx - Substring or array of substrings to search for
 * @param {boolean} [tolower] - If true, performs case-insensitive comparison by converting to lowercase
 * @returns {boolean} True if the string contains any of the specified substrings, false otherwise
 * @description
 * Checks if a string contains any of the specified substrings.
 *
 * The function:
 * 1. Ensures substrings are in an array format using mkArray
 * 2. Optionally converts both the main string and substrings to lowercase for case-insensitive matching
 * 3. Trims whitespace from both the main string and substrings
 * 4. Returns true as soon as any substring is found, or false if none are found
 *
 * @example
 * // Returns true
 * strIncludesAny("Hello world", "world")
 * strIncludesAny("Hello world", ["hello", "test"]) // with tolower=true
 *
 * // Returns false
 * strIncludesAny("Hello world", ["hello", "test"]) // without tolower
 * strIncludesAny("Hello world", ["foo", "bar"])
 */
export function strIncludesAny(str, substrx, tolower) {
    let substrs = mkArray(substrx);
    str = (tolower ? str.toLowerCase() : str).trim();
    /*
    if (!Array.isArray(substrs)) {
      substrs = [substrs];
    }
      */
    for (let substr of substrs) {
        substr = (tolower ? substr.toLowerCase() : substr).trim();
        if (str.includes(substr)) {
            return true;
        }
    }
    return false;
}
/** Like strIncludesAny, but returns an array of the substrings found
 *
 * @aider
 * @param {string} str - String to search within
 * @param {string|string[]} substrs - Substring or array of substrings to search for
 * @returns {string[]} Array of substrings that were found in the string
 * @description
 * Checks which of the specified substrings are contained in the given string.
 *
 * Unlike strIncludesAny which returns a boolean, this function returns an array
 * containing all the substrings that were found in the input string.
 *
 * The function:
 * 1. Ensures substrings are in an array format
 * 2. Checks each substring against the input string
 * 3. Collects all matching substrings in an array
 *
 * @example
 * // Returns ["world", "hello"]
 * strIncludesWhich("Hello world", ["world", "hello", "foo"])
 *
 * // Returns ["test"]
 * strIncludesWhich("This is a test", ["test", "foo", "bar"])
 *
 * // Returns []
 * strIncludesWhich("Hello world", ["foo", "bar"])
 */
export function strIncludesWhich(str, substrs) {
    let ret = [];
    if (!Array.isArray(substrs)) {
        substrs = [substrs];
    }
    for (let substr of substrs) {
        if (str.includes(substr)) {
            ret.push(substr);
        }
    }
    return ret;
}
/**
 * Checks if a given argument is a Promise.
 *
 * @aider
 * @param {any} [arg] - The argument to check
 * @returns {boolean} True if arg is a Promise, false otherwise
 * @description
 * Determines if a value is a Promise by checking if it:
 * 1. Is truthy (not null, undefined, false, 0, etc.)
 * 2. Is an object
 * 3. Has a "then" method
 *
 * This is a standard way to detect Promise-like objects (thenables).
 * @example
 * // Returns true
 * isPromise(Promise.resolve())
 * isPromise(new Promise(() => {}))
 * isPromise({then: function() {}})
 *
 * // Returns false
 * isPromise(null)
 * isPromise({})
 * isPromise("promise")
 */
export function isPromise(arg) {
    return !!arg && typeof arg === "object" && typeof arg.then === "function";
}
/** From Mozilla - a stricter int parser
 *
 * @aider
 * @param {any} value - The value to parse as an integer
 * @returns {number|boolean} The parsed integer if valid, false otherwise
 * @description
 * A stricter version of parseInt that only accepts proper integer strings.
 * Based on Mozilla's recommended integer parsing approach.
 *
 * Unlike parseInt, this function:
 * - Rejects strings with trailing non-numeric characters
 * - Returns false instead of NaN for invalid inputs
 * - Accepts "Infinity" as a valid input
 *
 * @example
 * // Returns 42
 * filterInt("42")
 *
 * // Returns -42
 * filterInt("-42")
 *
 * // Returns false (would be 42 with parseInt)
 * filterInt("42px")
 *
 * // Returns false
 * filterInt("abc")
 */
export function filterInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value);
    }
    else {
        //return NaN
        return false;
    }
}
/**
 * Takes a browser event & tries to get some info
 * Move this to browser library when the time comes
 *
 * @aider
 * @param {Event} ev - The browser event to extract information from
 * @returns {object} An object containing key properties from the event
 * @description
 * Extracts common properties from a browser Event object and returns them in a plain object.
 * Uses jsonClone to ensure the returned values are serializable.
 *
 * This function is useful for:
 * - Logging events
 * - Debugging event handlers
 * - Storing event information for later analysis
 *
 * Note: This function is intended to be moved to a browser-specific library in the future.
 * @example
 * // In a browser event handler:
 * element.addEventListener('click', (event) => {
 *   const info = eventInfo(event);
 *   console.log(info); // Logs event details
 * });
 */
export function eventInfo(ev) {
    let evProps = ['bubbles', 'cancelable', 'cancelBubble', 'composed', 'currentTarget',
        'defaultPrevented', 'eventPhase', 'explicitOriginalTarget', 'isTrusted',
        'originalTarget', 'returnValue', 'srcElement', 'target',
        'timeStamp', 'type',];
    let eventDets = {};
    for (let prop of evProps) {
        eventDets[prop] = jsonClone(ev[prop]);
    }
    return eventDets;
}
/**
 * If arg can be in any way be interpreted as a date,
 * returns the JS Date object, optionally date-fns formatted string
 *
 * @aider
 * @param {any} arg - Argument to convert to JS Date
 * @returns {Date|false} A valid JS Date object or false if conversion fails
 * @description
 * Flexibly converts various input formats to a JavaScript Date object.
 *
 * Unlike standard JS Date constructor behavior:
 * - null/empty values return current date (new Date())
 * - Numeric strings are properly converted to timestamps
 * - date-fns duration objects are treated as offsets from now
 *
 * Valid input formats include:
 * - null/undefined/empty: returns current date
 * - date-fns duration object: {days: 5, hours: 3} returns date offset from now
 * - Date object: returns the same Date
 * - ISO string: "2022-04-21T18:36:42.871Z"
 * - Simple date string: "2016-01-01"
 * - Timestamp - seconds/ms - (number or numeric string): 1650566202871 or "1650566202871"
 *     (ts in seconds usu. 10 digits, in ms, 13 digits
 *
 * The function validates the resulting Date object using date-fns isValid().
 * @example
 * // Returns current date
 * pkToDate(null)
 *
 * // Returns date 5 days from now
 * pkToDate({days: 5})
 *
 * // Returns specific date
 * pkToDate("2022-04-21")
 *
 * // Returns date from timestamp
 * pkToDate(1650566202871)
 * pkToDate("1650566202871")
 */
export function pkToDate(arg) {
    if (isNumeric(arg)) { // A timestamp - but ms or seconds?
        let ts = Number(arg);
        if (isNaN(ts) || !ts) { // Invalid timestamp
            throw new PkError(`Invalid ts arg to pkToDate:`, { arg, ts });
        }
        if (Math.abs(ts) < 1e10) { //Probably TS in seconds
            ts = ts * 1000;
        }
        arg = new Date(ts);
    }
    else if (isEmpty(arg)) {
        arg = new Date();
    }
    else if (validateDateFnsDuration(arg)) {
        arg = add(new Date(), arg);
    }
    else {
        arg = new Date(arg);
    }
    //@ts-ignore
    if ((arg instanceof Date) && isValid(arg)) {
        return arg;
    }
    return false;
}
/**
 * Converts a date to a Unix timestamp (seconds since the epoch) - NOT MILLISECONDS!
 *
 * @aider
 * @param {any} dt - Dateable argument for pkToDate - defaults to now
 * @returns {number} Unix timestamp in seconds (not milliseconds)
 * @description
 * Converts any value that pkToDate can handle into a Unix timestamp (seconds since epoch).
 *
 * This function:
 * 1. Uses pkToDate to convert the input to a JavaScript Date object
 * 2. Gets the millisecond timestamp using getTime()
 * 3. Converts milliseconds to seconds by dividing by 1000 and flooring
 *
 * If the input cannot be converted to a valid Date, the function throws a PkError.
 * @example
 * // Returns current timestamp in seconds
 * dateToTimestamp()
 *
 * // Returns timestamp for specific date
 * dateToTimestamp("2022-04-21")
 *
 * // Returns timestamp for date 5 days from now
 * dateToTimestamp({days: 5})
 *
 * @throws {PkError} If the input cannot be converted to a valid Date
 */
export function dateToTimestamp(dt) {
    dt = pkToDate(dt);
    if (!dt || !(dt instanceof Date)) { // Didn't get a JS Date
        throw new PkError(`Invalid date: ${dt}`);
    }
    let ms = dt.getTime();
    let ts = Math.floor(ms / 1000);
    return ts;
}
/**
 * Object for date-fns formats, with simple keys
 *
 * @aider
 * @type {Object<string, string>}
 * @description
 * A collection of commonly used date format patterns for use with date-fns format function.
 * Each key represents a semantic format name, and the value is the corresponding date-fns format string.
 *
 * Available formats:
 * - html: HTML5 date input format (yyyy-MM-dd)
 * - sqldt: SQL datetime format (yyyy-MM-dd HH:mm:ss)
 * - short: Short date format (dd-MMM-yy)
 * - dt: Date and time format (dd-MMM-yy KK:mm)
 * - dts: Date and time with seconds (dd-MMM-yy KK:mm:ss)
 * - ts: Time only format (KK:mm:ss)
 *
 * @example
 * // Using with date-fns format function
 * import { format } from 'date-fns';
 * format(new Date(), dtFnsFormats.short); // Returns "21-Apr-22"
 */
export const dtFnsFormats = {
    html: "yyyy-MM-dd",
    sqldt: "yyyy-MM-dd HH:mm:ss",
    short: 'dd-MMM-yy',
    dt: 'dd-MMM-yy KK:mm',
    dts: 'dd-MMM-yy KK:mm:ss',
    ts: 'KK:mm:ss',
    s: 't', //Unix timestamp in seconds
    ms: 'T', // Timestamp in milliseconds
};
/**
 * Quick Format a date with single format code & date
 *
 * @aider
 * @param {string} [fmt="short"] - A key to pre-defined dtFnsFormats or a date-fns format string
 * @param {any} [dt] - Dateable value or null for "now"
 * @returns {string|false} Formatted date string, or false if dt is invalid
 * @description
 * Provides a convenient way to format dates using either predefined format keys or custom format strings.
 *
 * The function:
 * 1. Checks if the format is a key in dtFnsFormats and uses the corresponding format if found
 * 2. Converts the input to a Date using pkToDate
 * 3. Formats the date using date-fns format function
 *
 * If the date cannot be converted to a valid Date, the function returns false.
 * @example
 * // Using predefined format
 * dtFmt("short")                // Returns current date as "21-Apr-22"
 * dtFmt("html", "2022-04-21")   // Returns "2022-04-21"
 *
 * // Using custom format
 * dtFmt("MMMM do, yyyy", "2022-04-21")  // Returns "April 21st, 2022"
 *
 * // Invalid date
 * dtFmt("short", "invalid-date")  // Returns false
 */
export function dtFmt(fmt = "short", dt) {
    if (fmt in dtFnsFormats) {
        fmt = dtFnsFormats[fmt];
    }
    dt = pkToDate(dt);
    if (dt === false) {
        return false;
    }
    //@ts-ignore
    return format(dt, fmt);
}
//Array utilities
/**
 * Return elements in arr1 Not In arr2
 *
 * @aider
 * @param {any[]} arr1 - Array of elements to check
 * @param {any|any[]} arr2 - Single element or array of elements to exclude
 * @returns {any[]} Array containing elements from arr1 that are not in arr2
 * @description
 * Creates a new array containing all elements from arr1 that do not exist in arr2.
 *
 * If arr2 is not an array, it's converted to a single-element array.
 * The function uses Array.filter() and Array.includes() for the comparison.
 *
 * @example
 * // Returns [1, 3]
 * inArr1NinArr2([1, 2, 3], [2, 4])
 *
 * // Returns [1, 3]
 * inArr1NinArr2([1, 2, 3], 2)
 */
export function inArr1NinArr2(arr1, arr2) {
    if (!Array.isArray(arr2)) {
        arr2 = [arr2];
    }
    return arr1.filter((el) => !arr2.includes(el));
}
/**
 * Compare two arrays returning an object with counts of shared, only in arr1, only in arr2, etc
 *
 * @aider
 * @param {[]} arr1 - First array to compare
 * @param {[]} arr2 - Second array to compare
 * @returns {Object} Detailed comparison object with arrays and counts
 * @description
 * Performs a comprehensive comparison between two arrays, returning an object with:
 * - The original arrays (arr1, arr2)
 * - The length of each array (arr1Cnt, arr2Cnt)
 * - Elements shared between both arrays (shared)
 * - Count of shared elements (sharedCnt)
 * - Elements only in arr1 (onlyArr1)
 * - Count of elements only in arr1 (onlyArr1Cnt)
 * - Elements only in arr2 (onlyArr2)
 * - Count of elements only in arr2 (onlyArr2Cnt)
 *
 * This function uses intersect() and inArr1NinArr2() internally.
 * @example
 * // Returns detailed comparison object
 * compareArrays([1, 2, 3], [2, 3, 4])
 * // {
 * //   arr1: [1, 2, 3], arr2: [2, 3, 4],
 * //   arr1Cnt: 3, arr2Cnt: 3,
 * //   shared: [2, 3], sharedCnt: 2,
 * //   onlyArr1: [1], onlyArr1Cnt: 1,
 * //   onlyArr2: [4], onlyArr2Cnt: 1
 * // }
 */
export function compareArrays(arr1, arr2) {
    let shared = intersect(arr1, arr2);
    let sharedCnt = shared.length;
    let onlyArr1 = inArr1NinArr2(arr1, arr2);
    let onlyArr1Cnt = onlyArr1.length;
    let onlyArr2 = inArr1NinArr2(arr2, arr1);
    let onlyArr2Cnt = onlyArr2.length;
    let arr1Cnt = arr1.length;
    let arr2Cnt = arr2.length;
    return { arr1, arr2, arr1Cnt, arr2Cnt, shared, sharedCnt, onlyArr1, onlyArr1Cnt, onlyArr2, onlyArr2Cnt };
}
/**
 * Unique intersection of two arrays
 * TODO: implement intersectAny & intersectAll for any number of arrays
 *
 * @aider
 * @param {any[]} [a] - First array
 * @param {any[]} [b] - Second array
 * @returns {any[]} Array containing elements that exist in both input arrays, with duplicates removed
 * @description
 * Finds the intersection of two arrays (elements that exist in both arrays),
 * while ensuring the result contains only unique values.
 *
 * The function:
 * 1. Converts the second array to a Set for efficient lookups
 * 2. Converts the first array to a Set to remove duplicates
 * 3. Filters the first array to only include elements that exist in the second array
 *
 * This implementation is efficient for large arrays as it uses Set operations.
 * @example
 * // Returns [2, 3]
 * intersect([1, 2, 2, 3], [2, 3, 4])
 *
 * // Returns [2]
 * intersect([1, 2, 3], [2, 2, 4])
 */
export function intersect(a, b) {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}
/**
 * Returns array with all strings in array converted to lower case
 *
 * @aider
 * @param {any[]} arr - Array containing elements to process
 * @returns {any[]} New array with all string elements converted to lowercase
 * @description
 * Creates a new array where all string elements from the input array are converted to lowercase.
 * Non-string elements are left unchanged.
 *
 * This function is useful for case-insensitive comparisons or normalization of string arrays.
 * @example
 * // Returns ["hello", "world", 123]
 * arrayToLower(["Hello", "WORLD", 123])
 *
 * // Returns ["a", "b", "c", null, undefined]
 * arrayToLower(["A", "B", "C", null, undefined])
 */
export function arrayToLower(arr) {
    return arr.map((e) => (typeof e === 'string') ? e.toLowerCase() : e);
}
/**
 * Compares arrays by VALUES - independant of order
 *
 * @aider
 * @param {any[]} a - First array to compare
 * @param {any[]} b - Second array to compare
 * @returns {boolean} True if arrays contain the same values regardless of order, false otherwise
 * @description
 * Determines if two arrays contain the same values, regardless of their order.
 *
 * The function works by:
 * 1. Sorting both arrays
 * 2. Converting them to JSON strings
 * 3. Comparing the resulting strings
 *
 * Note: This approach works well for arrays of primitive values, but may not work
 * correctly for arrays containing objects or nested arrays, as JSON.stringify
 * doesn't guarantee consistent ordering of object properties.
 * @example
 * // Returns true
 * arraysEqual([1, 2, 3], [3, 2, 1])
 *
 * // Returns false
 * arraysEqual([1, 2, 3], [1, 2, 4])
 */
export function arraysEqual(a, b) {
    return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}
/**
 * Take any number of array args & returns array of all duplicates
 *
 * @aider
 * @param {...any[]} args - Any number of arrays to check for duplicates
 * @returns {any[]} Array containing all duplicate elements found across all input arrays
 * @description
 * Identifies duplicate elements across any number of arrays.
 *
 * The function:
 * 1. Merges all input arrays into a single array
 * 2. Filters the merged array to only include elements that appear more than once
 *
 * Note: This returns all instances of duplicates after the first occurrence,
 * so an element that appears three times will appear twice in the result.
 * @example
 * // Returns [2, 3, 3]
 * dupEntries([1, 2, 3], [2, 3, 3, 4])
 *
 * // Returns [1, 2]
 * dupEntries([1, 1, 2], [2, 3])
 */
export function dupEntries(...args) {
    let merged = [].concat(...args);
    let dups = merged.filter((item, index) => merged.indexOf(item) !== index);
    return dups;
}
/**
 * Inserts an element between each element of an array - like join() but for arrays
 *
 * @aider
 * @param {any[]} arr - Array of elements
 * @param {any} sep - Separator element to insert between array elements
 * @returns {any[]} New array with separator inserted between original elements
 * @description
 * Creates a new array with the separator element inserted between each element of the original array.
 * This is similar to the string join() method, but works with arrays of any type.
 *
 * The function uses the interleave implementation which:
 * 1. Maps each element to a pair [element, separator]
 * 2. Flattens the resulting array
 * 3. Removes the trailing separator
 *
 * Note: The function contains an alternative implementation (magicArrayJoin) that is commented
 * but preserved for reference.
 * @example
 * // Returns [1, "x", 2, "x", 3]
 * arrayJoin([1, 2, 3], "x")
 *
 * // Returns ["a", 0, "b", 0, "c"]
 * arrayJoin(["a", "b", "c"], 0)
 */
export function arrayJoin(arr, sep) {
    // These both seem to work, but switch if problem discovered
    const magicArrayJoin = (array, el) => array.length ?
        array.slice(1).reduce((acc, cur) => acc.concat([el, cur]), [array[0]]) :
        [];
    function interleave(array, item) {
        return array
            .map(element => [element, item])
            .flat()
            .slice(0, -1);
    }
    return interleave(arr, sep);
}
/**
 * Is 'a' a subset of 'b' ?
 *
 * @aider
 * @param {any[]} a - Array to check if it's a subset
 * @param {any[]} b - Array to check against
 * @returns {boolean} True if every unique element in 'a' is also in 'b', false otherwise
 * @description
 * Determines if array 'a' is a subset of array 'b', after removing duplicates from both.
 *
 * The function:
 * 1. Converts both arrays to Sets to remove duplicates
 * 2. Checks if every element in the first Set exists in the second Set
 *
 * This is useful for checking if one collection is completely contained within another.
 * @example
 * // Returns true
 * isSubset([1, 2], [1, 2, 3, 4])
 *
 * // Returns true (duplicates are ignored)
 * isSubset([1, 1, 2], [1, 2, 3])
 *
 * // Returns false
 * isSubset([1, 2, 5], [1, 2, 3, 4])
 */
export function isSubset(a, b) {
    a = [...new Set(a)];
    b = [...new Set(b)];
    return a.every((val) => b.includes(val));
}
/**
 * Takes an array and an element, returns a new array with
 * the element inserted between each element of the original array.
 *
 * @aider
 * @param {Array<any>} arr - Original array
 * @param {any} item - Item to insert between array elements
 * @returns {Array<any>} New array with item inserted between original elements
 * @description
 * Creates a new array with the specified item inserted between each element of the original array.
 * This is similar to arrayJoin() but uses a different implementation with a for loop.
 *
 * The function:
 * 1. Creates a new empty result array
 * 2. Iterates through the original array
 * 3. Adds each original element to the result
 * 4. Adds the separator item after each element except the last one
 *
 * @example
 * // Returns [1, "x", 2, "x", 3]
 * insertBetween([1, 2, 3], "x")
 *
 * // Returns ["a", 0, "b", 0, "c"]
 * insertBetween(["a", "b", "c"], 0)
 */
export function insertBetween(arr, item) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i]);
        if (i < arr.length - 1) {
            result.push(item);
        }
    }
    return result;
}
//TODO - REDO! This sucks...
/**
 * @aider
 * @param {boolean} [report=false] - If true, logs a warning when not in CLI environment
 * @returns {boolean} True if running in a CLI environment, false otherwise
 * @description
 * Determines if the code is running in a CLI environment by checking the RUNTIME environment variable.
 *
 * If report is true and the environment is not CLI, a warning is logged to the console.
 *
 * Note: As indicated by the TODO comment, this function has known limitations and should be improved.
 * @example
 * // Basic usage
 * if (isCli()) {
 *   // Run CLI-specific code
 * }
 *
 * // With warning
 * isCli(true); // Will log warning if not in CLI environment
 */
export function isCli(report = false) {
    let runtime = process.env.RUNTIME;
    //let runtime = getRuntime();
    let lisCli = runtime === "cli";
    if (!lisCli && report) {
        console.error("WARNING - calling a CLI-ONLY function in a non-cli runtime:", { runtime });
    }
    return lisCli;
}
/**
 * Converts an https URL to an HTTP URL.
 *
 * @aider
 * @param {string} url - HTTPS URL to convert
 * @returns {string} Converted HTTP URL, or original URL if it wasn't HTTPS
 * @description
 * Converts an HTTPS URL to HTTP by replacing the protocol.
 *
 * The function:
 * 1. Splits the URL at the colon
 * 2. Replaces "https" with "http" if found
 * 3. Rejoins the parts to form the new URL
 *
 * Note: This function only changes the protocol and doesn't validate the URL structure.
 * @example
 * // Returns "http://example.com"
 * rewriteHttpsToHttp("https://example.com")
 *
 * // Returns "http://example.com:8080/path"
 * rewriteHttpsToHttp("https://example.com:8080/path")
 *
 * // Returns "http://example.com" (unchanged)
 * rewriteHttpsToHttp("http://example.com")
 */
export function rewriteHttpsToHttp(url) {
    let parts = url.split(":");
    if (parts[0] === "https") {
        parts[0] = "http";
    }
    let newUrl = `${parts[0]}:${parts[1]}`;
    return newUrl;
}
/**
 * Check single url or array of urls for status
 * if single url, return true/false
 * if array, return array of failed urls
 * TODO!! Doesn't accout for network errors, exceptions, etc!!
 * SEE below checkUrl3
 *
 * @aider
 * @param {string|string[]} url - URL or array of URLs to check
 * @returns {Promise<boolean|string[]>}
 *   - For single URL: true if status is 200, false otherwise
 *   - For array of URLs: true if all URLs return 200, otherwise array of failed URLs
 * @description
 * Checks if one or more URLs return a 200 status code.
 *
 * When given a single URL:
 * - Returns true if the URL returns status 200
 * - Returns false otherwise
 *
 * When given an array of URLs:
 * - Returns true if all URLs return status 200
 * - Returns array of failed URLs otherwise
 *
 * Note: As indicated by the TODO comment, this function doesn't properly handle network errors
 * or exceptions. For more robust URL checking, see checkUrl3().
 * @example
 * // Single URL
 * const result = await checkUrl("https://example.com");
 * // true if status is 200, false otherwise
 *
 * // Multiple URLs
 * const results = await checkUrl(["https://example.com", "https://invalid.example"]);
 * // true if all URLs return 200, otherwise array of failed URLs
 */
export async function checkUrl(url) {
    if (Array.isArray(url)) {
        let badUrls = [];
        for (let aurl of url) {
            let status = await urlStatus(aurl);
            if (status != 200) {
                badUrls.push(aurl);
            }
        }
        if (!badUrls.length) {
            return true;
        }
        return badUrls;
    }
    else {
        let status = await urlStatus(url);
        if (status == 200) {
            return true;
        }
        return false;
    }
}
/**
 * Returns a URL object from a URL string, else error code
 *
 * @aider
 * @param {string} url - URL string to convert to URL object
 * @returns {URL|string} URL object if valid, error code or error object otherwise
 * @description
 * Attempts to create a URL object from a URL string.
 *
 * If successful, returns the URL object.
 * If unsuccessful, returns the error code (if available) or the error object itself.
 *
 * This function provides a safe way to create URL objects without having to handle exceptions.
 * @example
 * // Returns URL object
 * mkUrl("https://example.com")
 *
 * // Returns error code or error object
 * mkUrl("invalid://url")
 */
function mkUrl(url) {
    try {
        let urlObj = new URL(url);
        return urlObj;
    }
    catch (err) {
        //console.error({ url, err });
        if ((typeof err === 'object') && (err.code)) {
            return err.code;
        }
        return err;
    }
}
//Same as above, but 
/**
 * @aider
 * @param {string} url - URL string to convert to URL object
 * @param {boolean} [full=false] - If true, returns the full error object on failure
 * @returns {URL|string|Error} URL object if valid, error code/object otherwise based on full parameter
 * @description
 * Similar to mkUrl(), but with an option to return the full error object.
 *
 * If successful, returns the URL object.
 * If unsuccessful:
 * - When full=true: returns the complete error object
 * - When full=false: returns the error code (if available) or the error object
 *
 * This function provides more flexibility in error handling compared to mkUrl().
 * @example
 * // Returns URL object
 * mkUrlObj("https://example.com")
 *
 * // Returns error code
 * mkUrlObj("invalid://url")
 *
 * // Returns full error object
 * mkUrlObj("invalid://url", true)
 */
function mkUrlObj(url, full = false) {
    try {
        let urlObj = new URL(url);
        return urlObj;
    }
    catch (err) {
        if (full) {
            return err;
        }
        //console.error({ url, err });
        if ((typeof err === 'object') && (err.code)) {
            return err.code;
        }
        return err;
    }
}
/**
 * Tests a URL with Axios
 */
export async function checkUrlAxios(tstUrl, full = false) {
    let failCodes = [404, 401, 403, 404]; // Return immediate false
    let retryCodes = [408, 429,]; // Try again
    let notAllowed = 405;
    let fOpts = {
        method: "HEAD",
        cache: "no-cache",
        headers: {
            Connection: 'close',
        },
        connection: "close",
    };
    let retries = 0;
    let maxRetries = 4;
    let timeout = 5;
    let urlObj = mkUrlObj(tstUrl, full);
    if (!(urlObj instanceof URL)) {
        if (full) {
            return urlObj;
        }
        return { err: tstUrl };
    }
    fOpts.url = tstUrl;
    let resps = [];
    let resp;
    let lastErr;
    try {
        while (retries < maxRetries) {
            retries++;
            lastErr = null;
            //@ts-ignore
            try {
                resp = await axios(fOpts);
            }
            catch (err) {
                lastErr = err;
                continue;
            }
            let status = resp.status;
            if (status === notAllowed) {
                fOpts.method = "GET";
                //@ts-ignore
                resp = await axios(fOpts);
                status = resp.status;
            }
            if (status === 200) {
                return true;
            }
            else if (failCodes.includes(status)) {
                return false;
            }
            else if (retryCodes.includes(status)) {
                continue;
            }
        } // Unknown reason for failure
        if (resp) {
            let respKeys = Object.keys(resp);
            let status = resp.status;
            let toResp = typeOf(resp);
            resp['retries'] = retries;
            let barg = { badresponse: { tstUrl, respKeys, status, toResp, resp } };
            //lTool.snap(barg);
            if (full) {
                return resp;
            }
            return `code: [${resp.code}]; url: [${tstUrl}], status: [${resp.status}], retries: [${retries}]`;
        }
        else if (lastErr) { //Axios error!
            let toErr = typeOf(lastErr);
            let errKeys = Object.keys(lastErr);
            let sarg = { exception: { toErr, errKeys, lastErr, retries, tstUrl } };
            //lTool.snap({ err, retries, tstUrl });
            // console.log({ sarg });
            //lTool.snap(sarg);
            if (full) {
                return lastErr;
            }
            let ret;
            if (typeof lastErr === 'object') {
                lastErr?.cause?.code;
            }
            if (!ret) {
                ret = lastErr;
            }
            return ret;
        }
        let ret = {
            unkown: { retries, tstUrl, msg: "No error and no response?" }
        };
        return ret;
    }
    catch (err) {
        console.error("WE SHOULDN'T BE HERE!!", err);
        let toErr = typeOf(err);
        let errKeys = Object.keys(err);
        let sarg = { UnexpecteException: { toErr, errKeys, err, retries, tstUrl } };
        if (full) {
            return err;
        }
        let ret;
        if (typeof err === 'object') {
            err?.cause?.code;
        }
        if (!ret) {
            ret = err;
        }
        return ret;
    }
}
/**
 * Makes first character of string uppercase
 *
 * @aider
 * @param {string} str - Input string
 * @returns {string} String with first character converted to uppercase
 * @description
 * Capitalizes the first character of a string while preserving the case of all other characters.
 *
 * This is useful for formatting names, titles, or sentences.
 * @example
 * // Returns "Hello world"
 * firstToUpper("hello world")
 *
 * // Returns "JavaScript"
 * firstToUpper("javaScript")
 */
export function firstToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Tri-state check - to account for failed checks -
 * @return boolean|other
 * If "true" - good URL
 * If "false" - 404 or something - but GOT A STATUS!
 * IF other - who knows? bad domain, invalid URL, network error,...
 *
 * @aider
 * @param {string} url - URL to check
 * @returns {Promise<boolean|number|object>}
 *   - true if status is 200
 *   - false if status is an error code (>300)
 *   - status code if it's not 200 but also not an error
 *   - error object if an exception occurs
 * @description
 * Provides a more robust URL checking mechanism than checkUrl() by handling exceptions
 * and returning a tri-state result.
 *
 * The function:
 * 1. Attempts to get the status code of the URL
 * 2. Returns true for status 200
 * 3. Returns false for error status codes (>300)
 * 4. Returns the actual status code for other status codes
 * 5. Returns an error object if an exception occurs
 *
 * This function is more reliable than checkUrl() as it properly handles exceptions.
 * @example
 * // Returns true for valid URLs
 * await checkUrl3("https://example.com")
 *
 * // Returns false for URLs that return error codes
 * await checkUrl3("https://example.com/notfound")
 *
 * // Returns status code for redirects, etc.
 * await checkUrl3("https://example.com/redirect")
 *
 * // Returns error object for invalid URLs or network errors
 * await checkUrl3("invalid://url")
 */
export async function checkUrl3(url) {
    try {
        let status = await urlStatus(url);
        if (status == 200) {
            return true;
        }
        else if (status > 300) {
            return false;
        }
        return status;
    }
    catch (err) {
        return { msg: `Exception for URL:`, url, err };
    }
}
/**
 * returns arg, unless it is an empty object or array
 *
 * @aider
 * @param {any} arg - Value to check
 * @returns {any|undefined} Original value if not empty, undefined otherwise
 * @description
 * Returns the input value only if it's not considered "empty" according to isEmpty().
 * If the input is empty, the function returns undefined.
 *
 * This is useful for filtering out empty values in a concise way.
 * @example
 * // Returns {a: 1}
 * trueVal({a: 1})
 *
 * // Returns [1, 2, 3]
 * trueVal([1, 2, 3])
 *
 * // Returns undefined
 * trueVal({})
 * trueVal([])
 * trueVal(null)
 * trueVal(undefined)
 */
export function trueVal(arg) {
    if (!isEmpty(arg)) {
        return arg;
    }
}
// Start Object analysis fncs
/** Try to make simple copies of complex objects (like with cyclic references)
 * to be storable in MongoDB
 * Primitives will just be returned unchanged.
 *
 * @aider
 * @param {any} arg - Value to clone
 * @returns {any} Deep clone of the input value
 * @description
 * Creates a deep clone of complex objects, handling cyclic references.
 *
 * The function:
 * 1. Returns primitives and null/undefined values unchanged
 * 2. Converts DOM Elements to their HTML representation (in browser environments)
 * 3. Uses JSON5 stringify/parse with cycle handling for complex objects
 *
 * This is particularly useful for:
 * - Creating deep copies of objects
 * - Preparing objects with circular references for storage (e.g., in MongoDB)
 * - Safely cloning objects for immutable operations
 *
 * @example
 * // Simple values are returned unchanged
 * jsonClone(123) // Returns 123
 * jsonClone("hello") // Returns "hello"
 *
 * // Objects are deeply cloned
 * const obj = { a: 1, b: { c: 2 } };
 * const clone = jsonClone(obj);
 * // clone is a deep copy of obj
 *
 * // Handles circular references
 * const circular = { a: 1 };
 * circular.self = circular;
 * const safeClone = jsonClone(circular);
 * // safeClone contains the same structure with circular reference intact
 */
export function jsonClone(arg) {
    if (!arg || typeof arg !== "object" || isPrimitive(arg)) {
        return arg;
    }
    //@ts-ignore
    if ((typeof Element !== 'undefined') && (arg instanceof Element)) {
        //Not sure I want to do this - my JSON5Stringify might handle it - test in browser
        return arg.outerHTML;
    }
    return JSON5Parse(JSON5Stringify(arg));
}
/**
 * Return the constructor chain of an object
 *
 * @aider
 * @param {any} obj - Object to analyze
 * @returns {Array<{constructor: any, toConstructor: string}>} Array of constructor objects and their types
 * @description
 * Analyzes an object and returns its constructor inheritance chain.
 *
 * The function:
 * 1. Starts with the object's constructor
 * 2. Iteratively gets each constructor's constructor
 * 3. Collects each constructor and its type in an array
 * 4. Stops after 10 iterations or when reaching Function constructor
 *
 * This is useful for understanding the inheritance hierarchy of an object.
 *
 * Note: The function catches and logs any exceptions that occur during traversal.
 * @example
 * // For a Date object:
 * getConstructorChain(new Date())
 * // Returns something like:
 * // [
 * //   {constructor: ƒ Date(), toConstructor: "function: Date"},
 * //   {constructor: ƒ Object(), toConstructor: "function: Object"}
 * // ]
 */
export function getConstructorChain(obj) {
    let i = 0;
    let constructorChain = [];
    let constructor = obj;
    try {
        while (constructor = constructor.constructor) {
            let toConstructor = typeOf(constructor);
            if ((i++ > 10) || (toConstructor === 'function: Function')) {
                break;
            }
            constructorChain.push({ constructor, toConstructor });
        }
    }
    catch (e) {
        console.error(`Exception w. in getConstructorChain:`, { obj, e });
    }
    return constructorChain;
}
/**
 * Checks if arg is an instance of a class.
 * TODO: - have to do lots of testing of different args to
 * verify test conditions...
 *
 * @aider
 * @param {any} arg - Value to check
 * @returns {GenObj|false} Object with constructor and className if arg is a class instance, false otherwise
 * @description
 * Determines if a value is an instance of a class (not a primitive or empty object).
 *
 * If the value is a class instance, returns an object containing:
 * - constructor: The constructor function
 * - className: The name of the class
 *
 * Returns false for:
 * - Primitive values
 * - Non-object values
 * - Empty objects
 * - Objects without a constructor
 *
 * Note: As indicated by the TODO comment, this function may need additional testing
 * with various input types to verify its behavior.
 * @example
 * // Returns {constructor: ƒ Date(), className: "Date"}
 * isInstance(new Date())
 *
 * // Returns {constructor: ƒ Array(), className: "Array"}
 * isInstance([1, 2, 3])
 *
 * // Returns false
 * isInstance(123)
 * isInstance("string")
 * isInstance({})
 */
export function isInstance(arg) {
    if (isPrimitive(arg) || !isObject(arg) || isEmpty(arg)) {
        return false;
    }
    try {
        let constructor = arg?.constructor;
        if (constructor) {
            let className = constructor?.name;
            return { constructor, className };
        }
    }
    catch (e) {
        new PkError(`Exception:`, { e, arg });
    }
    return false;
}
/**
 * Hack for TypeScript - get the class of a class instance from its constructor,
 * but cast it to GenObj, so static references work.
 * Work in progress...
 * But also better to add a "class" getter property to the Base class
 */
export function getClass(instance) {
    let res = isInstance(instance);
    if (res) {
        return res.constructor;
    }
}
/**
 * Checks if an arg is an extended class or a function/top-level class
 * Appears to be no way to distinguish between a top-level class
 * and a function...
 */
export function isClassOrFunction(arg) {
    if ((typeof arg === 'function')) {
        try {
            let prototype = Object.getPrototypeOf(arg);
            return prototype;
        }
        catch (e) {
            new PkError(`Exception:`, { e, arg });
        }
    }
    return false;
}
/**
 * Check whether obj is a JS class or a class instance
 */
/*
export function isClassOrInstance(obj) {
  if (isInstance(obj)) {
    return true;
  }
  if (isClassOrFunction(obj)) {
    return true;
  }
  return false;
}
*/
/**
 * Returns the parent (ancestor) class stack of a class instance
 */
export function classStack(obj) {
    let tst = obj;
    let stack = [];
    let deref = 'prototypeConstructorName';
    if (!isInstance(obj)) {
        deref = 'prototypeName';
    }
    try {
        let pchain = getPrototypeChain(tst);
        stack = uniqueVals(pchain.map((e) => e[deref]));
        stack = stack.filter((e) => e !== '');
    }
    catch (e) {
        new PkError(`Exception:`, { obj, e, stack });
    }
    return stack;
}
/**
 * Returns the prototype chain of an object
 * This is very hacky - but can be helpful - to get the inheritance
 * chain of classes & instances of classes - lots of bad edge cases -
 * BE WARNED!
 */
export function getPrototypeChain(obj) {
    if (!obj) {
        return [];
    }
    let i = 0;
    let prototype = obj;
    let prototypeConstructor = prototype?.constructor;
    let prototypeConstructorName = prototype?.constructor?.name;
    let toPrototype = typeOf(prototype);
    let prototypeName = prototype?.name;
    let toPrototypeConstructor = typeOf(prototypeConstructor);
    let prototypeChain = [{ prototype, prototypeName, prototypeConstructorName, toPrototype, prototypeConstructor, toPrototypeConstructor, }];
    try {
        while (prototype = Object.getPrototypeOf(prototype)) {
            if ((i++ > 20) || _.isEqual(prototype, {})) {
                break;
            }
            toPrototype = typeOf(prototype);
            prototypeConstructorName = prototype?.constructor?.name;
            prototypeConstructor = prototype?.constructor;
            prototypeName = prototype?.name;
            toPrototypeConstructor = typeOf(prototypeConstructor);
            prototypeChain.push({ prototype, prototypeName, toPrototype, prototypeConstructorName, prototypeConstructor, toPrototypeConstructor, });
        }
    }
    catch (e) {
        console.error(`Exception w. in getPrototypeChain:`, { obj, e });
    }
    return prototypeChain;
}
/**
 * Uses prototype chain and returns array of ancestor class names
 * @param obj
 */
export function getAncestorArr(obj) {
    let ptChain = getPrototypeChain(obj);
    let ret = [];
    for (let pt of ptChain) {
        let pname = pt?.prototypeName;
        if (!pname) {
            break;
        }
        ret.push(pname);
    }
    return ret;
}
/** Takes an object & parent class & checks if it is a subclass
 * @param obj - a JS Class
 * @param parent - another JS class
 * @param alsoSelf = 0 - include if it is it's own class
 * @return boolean
 *
 */
export function isSubclassOf(sub, parent, alsoSelf = 1) {
    let ancestors = getAncestorArr(sub);
    if (!alsoSelf) {
        ancestors.shift();
    }
    let subName = sub?.name;
    let parentPrototype = Object.getPrototypeOf(parent);
    let parentPrototypeName = parentPrototype?.name;
    let parentName = parent?.name;
    if (ancestors.includes(parentName)) {
        return true;
    }
    return false;
}
/**
 * Returns details about an object - props, prototype, etc.
 */
export function getObjDets(obj) {
    if (!obj || isPrimitive(obj) || !isObject(obj)) {
        return false;
    }
    let toObj = typeof obj;
    let pkToObj = typeOf(obj);
    let props = allProps(obj, 'vtp');
    let prototype = Object.getPrototypeOf(obj);
    let ret = { toObj, pkToObj, props, prototype, };
    return ret;
}
/**
 * Built-in JS Classes
 * Not complete, but want to be careful...
 * Leave Math out - because it is not a class or constructor...
 */
export const jsBuiltInObjMap = {
    Object, Array, Date, Number, String, Function,
};
export const jsBuiltIns = Object.values(jsBuiltInObjMap);
export function getAllBuiltInProps() {
    let props = [];
    for (let builtIn of jsBuiltIns) {
        let biProps = getProps(builtIn);
        //@ts-ignore
        props = [...props, ...getProps(builtIn)];
    }
    props = uniqueVals(props);
    return props;
}
/**
 * As an exclude list for filtering out props from specific objects, but
 * HAVE TO BE CAREFUL! - Somethings we don't want to exclude, like constructor,
 * name, etc...
 * APPROXIMATELY:
 *  [ 'length', 'name', 'prototype', 'assign', 'getOwnPropertyDescriptor',
    'getOwnPropertyDescriptors', 'getOwnPropertyNames', 'getOwnPropertySymbols',
    'is', 'preventExtensions', 'seal', 'create', 'defineProperties', 'defineProperty', 'freeze', 'getPrototypeOf', 'setPrototypeOf', 'isExtensible', 'isFrozen', 'isSealed', 'keys', 'entries', 'fromEntries',
    'values', 'hasOwn', 'arguments', 'caller', 'constructor', 'apply',
    'bind', 'call', 'toString', '__defineGetter__', '__defineSetter__',
    'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf',
    'propertyIsEnumerable', 'valueOf', '__proto__', 'toLocaleString',
    'isArray', 'from', 'of', 'now', 'parse', 'UTC', 'isFinite', 'isInteger',
    'isNaN', 'isSafeInteger', 'parseFloat', 'parseInt', 'MAX_VALUE',
    'MIN_VALUE', 'NaN', 'NEGATIVE_INFINITY', 'POSITIVE_INFINITY', 'MAX_SAFE_INTEGER', 'MIN_SAFE_INTEGER', 'EPSILON', 'fromCharCode',
    'fromCodePoint', 'raw', ],
 */
export const builtInProps = getAllBuiltInProps();
/**
 * Is the argument parsable?
 * Any point to decompose this with allProps?
 */
export function isParsable(arg) {
    if (!arg || isEmpty(arg) || isPrimitive(arg) ||
        (arg === Object) || (arg === Array) || (arg === Function) ||
        (!isObject(arg) && (typeof arg !== 'function'))) {
        return false;
    }
    return true;
}
export function isParsed(arg) {
    if (!arg || isEmpty(arg) || isPrimitive(arg) ||
        (arg === Object) || (arg === Array) || (arg === Function) ||
        (!isObject(arg) && (typeof arg !== 'function'))) {
        return arg;
    }
    return false;
}
/**
 * Returns a version of the object with all properties as enumerable
 * @param GenObj - object to enumerate
 * @param int depth - how deep to recurse
 */
export function asEnumerable(obj, depth = 6) {
    if (!isObject(obj) || !depth) {
        return obj;
    }
    depth--;
    let allKeys = Object.getOwnPropertyNames(obj);
    let retObj = {};
    for (let key of allKeys) {
        let val;
        try {
            val = obj[key];
        }
        catch (e) {
            let toObj = typeOf(obj);
            val = `Exception in asEnumerable for objType [${toObj}], key [${key}], depth: [${depth}]`;
        }
        if (isObject(val)) {
            val = asEnumerable(val, depth);
        }
        retObj[key] = val;
    }
    return retObj;
}
/**
 * get property names from prototype tree. Even works for primitives,
 * If wVal: false (default) - return all keys
 * else - obj. with keys/values
 * but not for null - so catch the exception & return []
 */
export function getProps(obj, wVal = false) {
    if (!obj) {
        return [];
    }
    try {
        let tstObj = obj;
        let props = Object.getOwnPropertyNames(tstObj);
        while (tstObj = Object.getPrototypeOf(tstObj)) {
            let keys = Object.getOwnPropertyNames(tstObj);
            for (let key of keys) {
                props.push(key);
            }
        }
        props = uniqueVals(props);
        //  console.error(`in getProps; `, { obj, wVal, props });
        if (!wVal) {
            return props;
        }
        else {
            //     console.error(`WE DO HAVE wVal!! in getProps; `, { obj, wVal, props });
            let ret = {};
            for (let key of props) {
                try {
                    let val = obj[key];
                    if (!isPrimitive(val)) {
                        val = typeOf(val);
                    }
                    //ret[key] = obj[key];
                    ret[key] = val;
                }
                catch (e) {
                    ret[key] = e.message;
                }
            }
            //      console.error(`What's up? Have props - `, { ret, props });
            return ret;
        }
    }
    catch (e) {
        console.error(`GOSH! Exception in getProps!`, { obj, wVal, e });
        throw new PkError(`Exception in getProps-`, { obj, wVal, e });
    }
    return [];
}
/**
 * Weirdly, most built-ins have a name property, & are of type [Function:Date]
 * or whatever, but Math does NOT have a name property, and is of type "Object [Math]". So try to deal with that...
 */
export function builtInName(bi) {
    let biName = bi.name ?? bi.toString();
    if ((typeof biName !== 'string') || !biName) {
        throw new PkError(`Weird - no name to be made for BI:`, { bi });
    }
    return biName;
}
/**
 * Returns false if arg is NOT a built-in - like Object, Array, etc,
 * OR - the built-in Name as string.
 */
export function isBuiltIn(arg) {
    try { //For null, whatever odd..
        if (jsBuiltIns.includes(arg)) {
            //return arg.name ?? arg.toString();
            return builtInName(arg);
        }
    }
    catch (e) {
        new PkError(`Exception in isBuiltin for arg:`, { arg, e });
    }
    return false;
}
/**
 * Early version of analyzing functions
 */
export function inspectFunction(afnc) {
    let jsToAfnc = typeof afnc;
    let fncType = typeOf(afnc);
    if (jsToAfnc !== 'function') {
        return {
            fncType, jsToAfnc,
            err: `Not a function: ${afnc}`,
        };
    }
    let name = afnc?.name;
    let body = afnc?.toString();
    let length = afnc?.length;
    let afnDescs = Object.getOwnPropertyDescriptors(afnc);
    let props = {};
    for (let key of Object.keys(afnDescs)) {
        props[key] = afnDescs[key]?.value;
    }
    //console.log(`Fnc Introspection:`, {toAfnc, jsToAfnc, afncName, afncStr, afncLen, afnDescs});
    return { fncType, jsToAfnc, name,
        body,
        length, props };
}
//skipProps - maybe stuff like 'caller', 'callee', 'arguments'?
export const keepProps = ['constructor', 'prototype', 'name', 'class',
    'type', 'super', 'length',];
export function filterProps(props) {
    props = inArr1NinArr2(props, builtInProps);
    props = props.filter((e) => !(e.startsWith('call$')));
    return props;
}
/**
 * Inspect an object to get as many props as possible,
 * optionally with values, types, or both - optionally filterd
 * by props
 * @param obj - what to test
 * // @param depth number - what to return
 * //0: just array of prop keys
 * //1: object of keys=>value
 * //2: object of keys => {type, value}
 * @param string opt any or all of: v|t|p|f
 * If 'v' - the raw value
 * If 'p' - a parsed, readable value //Not happy with implementation of parsable
 * If 't' - the value type
 * TODO - add some kind of `function` inspection

 * If none of t,v, or p  just array of props

 * If at least one of t,v,p, abject {prop:{value,type,parsed}

 * If f - FULL property details. Default: filter out uninteresting props
 *
 * @param int depth - how many levels should it go?
 */
/**
 * Default props/opts for all obj prop inspection utils
 */
export let defaultAllPropsOpts = {
    opt: 'tv',
    filter: true,
    depth: 1,
};
export function allProps(obj, optArg, depth) {
    let allPropsOpts = { ...defaultAllPropsOpts, };
    if (isString(optArg)) {
        allPropsOpts.opt = optArg;
        //} else if (isObject(optArg)) {
    }
    else if (typeof optArg === 'object') {
        allPropsOpts = { ...allPropsOpts, ...optArg };
    }
    if (isVoid(depth)) {
        depth = allPropsOpts.depth;
    }
    let opt = allPropsOpts.opt;
    //export function allProps(obj: any, { opt = 'p', filter = true }: { opt?: string, filter?: boolean } = {}) {
    try {
        if (!isObject(obj)) {
            return typeOf(obj);
        }
        if (depth-- < 0) {
            return 'END';
        }
        /*
        if (!isParsable(obj)) {
          return false;
        }
        */
        //let opts = opt.split('');
        let opts = [...opt];
        let filter = !opts.includes('f'); //TODO: Incompatible with optArg as obj w. filter prop
        let res = isParsed(obj);
        if (res) {
            return {
                val: res, type: typeOf(res), parsed: res,
            };
        }
        let tstKeys = [];
        for (let prop of keepProps) {
            let val;
            try {
                val = obj[prop];
                if (val === undefined) {
                    continue;
                }
                tstKeys.push(prop);
            }
            catch (e) {
                // Don't need to catch it
                //console.error(`error in probeProps with prop [${prop}]`, e, obj);
            }
        }
        let objProps = getProps(obj);
        if (filter) {
            objProps = filterProps(objProps);
        }
        let unique = uniqueVals(objProps, tstKeys);
        if (isEmpty(intersect(opts, ['t', 'v', 'p',]))) { //Just the array of props
            return unique;
        } //We want more...
        let retObj = {};
        //TODO: Weird - if we have a prop that is a function, we don't get its value - not even empty?
        for (let prop of unique) {
            let ret = {};
            let val;
            try {
                val = obj[prop];
            }
            catch (e) {
                retObj[prop] = { error: `allProps`, depth, prop, opt };
                continue;
            }
            if (['prototype', 'constructor'].includes(prop)) {
                let bi;
                if (bi = isBuiltIn(val)) {
                    ret.val = bi;
                    retObj[prop] = ret;
                    continue;
                }
            }
            if (opts.includes('v')) {
                ret.val = val;
            }
            if (opts.includes('t')) {
                ret.type = typeOf(val);
            }
            if (opts.includes('p') && isParsable(val)) {
                ret.parsed = allProps(val, opt, depth);
            }
            retObj[prop] = ret;
        }
        return retObj;
    }
    catch (e) {
        return `Exception in allProps at depth [${depth}] w. msg: [${e}]`;
    }
}
// Just making an easier call to allProps...
/*
export function allPropsP(obj: any, opts: GenObj = {}) {
  //let opt = opts.opt || 'tvp';
  //let depth = opts.depth || 3;
  return allProps(obj, opts,);
}
  */
export function allPropsWithTypes(obj, depth = 1) {
    return allProps(obj, 't', depth);
}
//export function objInfo(arg: any, opt: string = 'tpv', depth = 6) {
export function objInfo(arg, opt, depth) {
    let toArg = typeOf(arg);
    let info = { type: toArg };
    if (!isObject(arg)) {
        console.error(`in objInfo - arg not object?`, { arg, toArg });
        return info;
    }
    try {
        let objProps = {};
        //SHOULD CHANGE BELOW TO isParsed()...
        if (isParsable(arg)) {
            let instance = isInstance(arg);
            let inheritance = classStack(arg);
            if (instance) {
                info.instance = instance;
            }
            if (inheritance && Array.isArray(inheritance) && inheritance.length) {
                info.inheritance = inheritance;
            }
            //objProps = allPropsWithTypes(arg);
            objProps = allProps(arg, opt, depth);
            if (objProps) {
                info.props = objProps;
            }
        }
        else {
            info.val = arg;
            info.parsed = arg;
        }
    }
    catch (e) {
        console.error(`Exception in objInfo for`, { e, arg, opt, info });
    }
    return info;
}
/* Use lodash isObject (excludes functions) or isObjectLike (includes functions)
export function isRealObject(anobj) {
  if (!anobj || typeof anobj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
*/
/**
 * @aider
 * Determines the detailed type of any JavaScript value
 *
 * @param {any} anObj - The value to analyze
 * @param {any} [opts] - Options for controlling output format
 * @returns {String} A string describing the type of the value
 *
 * @description
 * Returns a detailed type description of any JavaScript value.
 *
 * For objects, it returns the constructor name rather than just "object".
 * For functions, it returns "function: [name]" with the function name.
 * For simple objects (created with {} literal), it returns "simple Object".
 *
 * The opts parameter can be:
 * - A number (level): Controls how much detail to include
 * - An object with properties:
 *   - level: Controls detail level
 *   - justType: If true, removes prefix strings like "function: " and "simple "
 *
 * @example
 * typeOf(123)           // "number"
 * typeOf("hello")       // "string"
 * typeOf(new Date())    // "Date"
 * typeOf([])            // "Array"
 * typeOf({})            // "simple Object"
 * typeOf(function foo(){}) // "function: foo"
 *
 * // With options
 * typeOf({}, {level: 1})  // "simple Object\nKeys: []"
 * typeOf(new Date(), {justType: true})  // "Date" (without prefixes)
 */
export function typeOf(anObj, opts) {
    let level = null;
    let functionPrefix = 'function: ';
    let simplePrefix = 'simple ';
    if (isPrimitive(opts)) {
        level = opts;
    }
    else if (isSimpleObject(opts)) {
        level = opts.level;
        if (opts.justType) {
            simplePrefix = functionPrefix = '';
        }
    }
    try {
        if (anObj === null) {
            return "null";
        }
        let to = typeof anObj;
        if (to === "function") {
            let keys = Object.keys(anObj);
            let name = anObj?.name;
            if (!name) {
                name = 'function';
            }
            //      console.log("Function Keys:", keys);
            return `${functionPrefix}${name}`;
        }
        if (to !== "object") {
            return to;
        }
        if (isSimpleObject(anObj)) {
            let ret = `${simplePrefix}Object`;
            if (level) {
                let keys = Object.keys(anObj);
                ret += `\nKeys: ${JSON.stringify(keys)}`;
            }
            return ret;
        }
        if (!anObj) {
            return 'undefined?';
        }
        let ret = `${anObj?.constructor?.name}`;
        if (level) {
            let keys = Object.keys(anObj);
            console.error({ keys });
            ret += `\nKeys: ${JSON.stringify(keys)}`;
        }
        return ret;
    }
    catch (err) {
        console.error("Error in typeOf:", err);
        return JSON.stringify({ err, anObj }, null, 2);
    }
}
/**
 * @aider
 * Gets types of multiple values in a single operation
 *
 * @param {GenObj} obj - Object containing values to analyze
 * @param {boolean} [wVal=false] - Whether to include the original values in the result
 * @returns {object|false} Object with same keys as input, but values replaced with their types (and optionally original values)
 *
 * @description
 * A convenient way to get the types of multiple variables at once.
 *
 * For each property in the input object, the function:
 * - If wVal is false: Replaces the value with its type (using typeOf)
 * - If wVal is true: Replaces the value with an object containing both type and original value
 *
 * Returns false if the input is not a simple object or is empty.
 *
 * @example
 * // Basic usage
 * typeOfEach({name: "John", age: 30, items: [1, 2, 3]})
 * // Returns {name: "string", age: "number", items: "Array"}
 *
 * // With values included
 * typeOfEach({name: "John", age: 30}, true)
 * // Returns {name: {type: "string", val: "John"}, age: {type: "number", val: 30}}
 */
export function typeOfEach(obj, wVal = false) {
    if (!isSimpleObject(obj) || isEmpty(obj)) {
        console.error(`Bad obj param to typeOfEach - obj:`, { obj });
        return false;
    }
    let res = {};
    let keys = Object.keys(obj);
    for (let key of keys) {
        let val = obj[key];
        if (wVal) {
            res[key] = { type: typeOf(val), val };
        }
        else {
            res[key] = typeOf(val);
        }
    }
    return res;
}
/**
 * @aider
 * Creates a detailed debug report of any number of arguments
 *
 * @param {...any} args - Any values to analyze and report on
 * @returns {string} A formatted string containing detailed information about each argument
 *
 * @description
 * Generates a comprehensive debug report for any number of arguments.
 *
 * For each argument:
 * - Primitive values are included directly
 * - Objects are analyzed to show their type and structure
 * - For simple objects, includes the type of each property
 *
 * The function returns a single string with all information formatted for readability,
 * making it ideal for logging or debugging complex data structures.
 *
 * @example
 * // Basic usage with mixed types
 * dbgReport("User data:", {name: "John", age: 30}, [1, 2, 3], new Date())
 * // Returns a formatted string with details about each argument
 *
 * // Analyzing a complex object
 * const user = {name: "John", profile: {id: 123, roles: ["admin", "user"]}};
 * dbgReport("User:", user)
 * // Returns detailed breakdown of the user object structure
 */
export function dbgReport(...args) {
    let retArr = [];
    let idx = 0;
    for (let repArg of args) {
        idx++;
        if (isPrimitive(repArg)) {
            retArr.push(repArg);
            continue;
        }
        //let ret:GenObj = {};
        let ret = {
            repArg,
            idx,
            toArg: typeOf(repArg),
        };
        if (isSimpleObject(repArg)) {
            ret.toEach = typeOfEach(repArg);
        }
        retArr.push(`\n${JSON5Stringify(ret)}\n`);
    }
    return retArr.join(':\n');
}
export function valWithType(val) {
    return { type: typeOf(val), val };
}
/**
 * @aider
 * Type guard that checks if a value is a valid JSON string
 *
 * @param {any} arg - Value to check
 * @returns {arg is string} True if arg is a string that can be parsed as JSON, false otherwise
 *
 * @description
 * Type guard function that determines if a value is a string that can be successfully parsed as JSON.
 *
 * The function:
 * 1. Checks if the input is a string
 * 2. Attempts to parse it with JSON.parse()
 * 3. Returns true if parsing succeeds, false otherwise
 *
 * This is useful for:
 * - Safely identifying JSON strings before attempting to parse them
 * - Validating user input or API responses
 * - Type narrowing in TypeScript
 *
 * Note: The return type uses TypeScript's type predicate syntax (arg is string)
 * which helps TypeScript understand the type narrowing.
 *
 * @example
 * // Returns true
 * isJsonStr('{"name":"John","age":30}')
 * isJsonStr('[1,2,3]')
 *
 * // Returns false
 * isJsonStr('Not JSON')
 * isJsonStr(123)
 * isJsonStr(null)
 * isJsonStr({name: "John"}) // Object, not a JSON string
 *
 * // TypeScript type narrowing
 * function processInput(input: any) {
 *   if (isJsonStr(input)) {
 *     // TypeScript knows input is a string here
 *     const data = JSON.parse(input);
 *     // ...
 *   }
 * }
 */
export function isJsonStr(arg) {
    if (typeof arg !== 'string') {
        return false;
    }
    try {
        JSON.parse(arg);
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * @aider
 * Type guard that checks if a value is a valid JSON5 string
 *
 * @param {any} arg - Value to check
 * @returns {arg is string} True if arg is a string that can be parsed as JSON5, false otherwise
 *
 * @description
 * Type guard function that determines if a value is a string that can be successfully parsed as JSON5.
 *
 * JSON5 is an extension of JSON that allows:
 * - Comments
 * - Trailing commas
 * - Unquoted property names
 * - Single-quoted strings
 * - Multi-line strings
 *
 * The function:
 * 1. Checks if the input is a string
 * 2. Attempts to parse it with JSON5.retrocycle()
 * 3. Returns true if parsing succeeds, false otherwise
 *
 * This is useful for validating configuration files or other data that uses the more
 * flexible JSON5 format.
 *
 * Note: The return type uses TypeScript's type predicate syntax (arg is string)
 * which helps TypeScript understand the type narrowing.
 *
 * @example
 * // All return true
 * isJson5Str('{"name":"John","age":30}')
 * isJson5Str('{name:"John",age:30}') // Valid JSON5, not valid JSON
 * isJson5Str('[1,2,3,]') // Trailing comma is valid in JSON5
 * isJson5Str('// Comment\n{name:"John"}') // Comments are valid in JSON5
 *
 * // All return false
 * isJson5Str('Not JSON5')
 * isJson5Str(123)
 * isJson5Str(null)
 * isJson5Str({name: "John"}) // Object, not a JSON5 string
 */
export function isJson5Str(arg) {
    if (typeof arg !== 'string') {
        return false;
    }
    try {
        //@ts-ignore
        JSON5.retrocycle(arg);
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * @aider
 * @param {string} str - JSON string to parse
 * @returns {any} Parsed JavaScript object with circular references restored
 * @description
 * Parses a JSON string and restores any circular references using JSON.retrocycle.
 *
 * This function is a wrapper around JSON.retrocycle that provides a more
 * intuitive name for the operation of parsing JSON with circular reference handling.
 *
 * Note: This assumes that JSON.retrocycle has been properly extended onto the
 * native JSON object.
 * @example
 * // Parse a JSON string with circular references
 * const obj = JSONParse('{"a":{"$ref":"$"}}');
 * // obj is now {a: obj} with the circular reference restored
 */
export function JSONParse(str) {
    return JSON.retrocycle(str);
}
/**
 * @aider
 * Parses a JSON5 string with support for circular references
 *
 * @param {string} str - JSON5 string to parse
 * @returns {any} Parsed JavaScript object with circular references restored
 *
 * @description
 * Parses a JSON5 string and restores any circular references using JSON5.retrocycle.
 *
 * JSON5 is an extension of JSON that allows:
 * - Comments
 * - Trailing commas
 * - Unquoted property names
 * - Single-quoted strings
 * - Multi-line strings
 * - And more
 *
 * This function is particularly useful when:
 * - Parsing configuration files with comments
 * - Working with data that contains circular references
 * - Handling more relaxed JSON syntax from various sources
 *
 * The function uses the retrocycle extension to properly reconstruct circular
 * references that were serialized with the decycle function.
 *
 * @example
 * // Basic JSON5 parsing
 * const config = JSON5Parse(`{
 *   // Server configuration
 *   host: 'localhost',
 *   port: 8080,
 * }`);
 *
 * // Parsing with circular references
 * const obj = JSON5Parse('{a: {$ref: "$"}}');
 * // obj is now {a: obj} with the circular reference restored
 */
export function JSON5Parse(str) {
    //try {
    //return JSON5.parse(str);
    //@ts-ignore
    return JSON5.retrocycle(str);
    //} catch (e) {
    //   let eInfo = objInfo(e);
    //   return {
    //     json5ParseError: e,
    //     eInfo,
    //     origStr: str,
    //   }
    // }
}
/**
 * Takes a (possibly complex, deep) arg - primitive, object, array
 * @param any arg - Object, array or primitive
 * @param boolean toJson - false
 * Deep iterates for key names ending in '*JSON'
 * If toJson === true, converts value of key to a JSON string
 * If toJson === false, converts value of key from a JSON string
 * @return arg - converted
 */
export function keysToFromJson(arg, toJson = false) {
    if (Array.isArray(arg)) {
        for (let idx = 0; idx < arg.length; idx++) {
            arg[idx] = keysToFromJson(arg[idx], toJson);
        }
    }
    else if (isSimpleObject(arg)) {
        let keys = Object.keys(arg);
        for (let key of keys) {
            if (key.endsWith('JSON')) {
                if (toJson) {
                    if (!isJsonStr(arg[key])) {
                        arg[key] = JSON.stringify(arg[key]);
                    }
                }
                else if (!toJson) { // Parse
                    if (isJsonStr(arg[key])) {
                        arg[key] = JSON.parse(arg[key]);
                    }
                }
            }
            else {
                arg[key] = keysToFromJson(arg[key], toJson);
            }
        }
    }
    return arg;
}
export function keysToJson(arg) {
    return keysToFromJson(arg, true);
}
export function keysFromJson(arg) {
    return keysToFromJson(arg, false);
}
/**
 * @aider
 * Converts a JavaScript value to a JSON5 string with circular reference handling
 *
 * @param {any} arg - Value to stringify
 * @param {number} [space=2] - Number of spaces to use for indentation
 * @returns {string} JSON5 string representation of the value with circular references handled
 *
 * @description
 * Converts a JavaScript value to a JSON5 string, properly handling circular references.
 *
 * This function uses JSON5.decycle to handle circular references in the object
 * before stringification. The resulting string can be parsed back using JSON5Parse.
 *
 * JSON5 format advantages over standard JSON:
 * - Supports comments
 * - Allows trailing commas
 * - Accepts unquoted property names
 * - Permits single-quoted strings
 * - Handles multi-line strings
 *
 * The space parameter controls the indentation of the output string for readability.
 *
 * @example
 * // Basic usage
 * const obj = { a: 1, b: "text" };
 * JSON5Stringify(obj);
 * // Returns '{\n  a: 1,\n  b: "text"\n}'
 *
 * // With circular reference
 * const circular = { a: 1 };
 * circular.self = circular;
 * JSON5Stringify(circular);
 * // Returns string with $ref for the circular reference
 *
 * // With custom spacing (compact output)
 * JSON5Stringify(obj, 0);
 * // Returns '{a:1,b:"text"}'
 */
export function JSON5Stringify(arg, space = 2) {
    //try {
    //return JSON5.stringify(arg, null, 2);
    //@ts-ignore
    //return JSON5.decycle(arg, null, 2);
    return JSON5.decycle(arg, space);
    //} catch (e) {
    //@ts-ignore
    //return JSON5.decycle(arg, null, 2);
    //}
}
/**
 * @aider
 * @param {any} arg - Value to stringify
 * @param {number} [space=2] - Number of spaces to use for indentation
 * @returns {string} JSON string representation of the value with circular references handled
 * @description
 * Converts a JavaScript value to a JSON string, handling circular references.
 *
 * This function uses JSON.decycle to handle circular references in the object
 * before stringification. The resulting string can be parsed back using JSONParse.
 *
 * The space parameter controls the indentation of the output string for readability.
 *
 * Note: The commented code shows alternative implementations and special case
 * handling that were considered.
 * @example
 * // Basic usage
 * const obj = { a: 1, b: "text" };
 * JSONStringify(obj); // Returns '{\n  "a": 1,\n  "b": "text"\n}'
 *
 * // With circular reference
 * const circular = { a: 1 };
 * circular.self = circular;
 * JSONStringify(circular); // Returns string with $ref for the circular reference
 *
 * // With custom spacing
 * JSONStringify(obj, 0); // Returns '{"a":1,"b":"text"}'
 */
export function JSONStringify(arg, space = 2) {
    /*
    if (arg === undefined) {
      return 'undefned';
    } else if (arg === null) {
      return 'null';
    }
    */
    //  try {
    //   return JSON.stringify(arg, null, 2);
    // } catch (e) {
    //@ts-ignore
    //return JSON.decycle(arg, null, 2);
    return JSON.decycle(arg, space);
    //}
}
//////////////////// END Object analysis functions   
/**
 * Returns a new object as deepMerge of arg objs, BUT with arrays concatenated
 *
 * @aider
 * @param {...any} objs - Objects to merge
 * @returns {GenObj} New object with all input objects merged and arrays concatenated
 * @description
 * Performs a deep merge of multiple objects, with special handling for arrays.
 *
 * Unlike standard object merging (like Object.assign or _.merge) which would
 * overwrite arrays, this function concatenates arrays when they are encountered
 * at the same path in different objects.
 *
 * The function:
 * 1. Uses lodash's mergeWith to perform the deep merge
 * 2. Provides a customizer function that concatenates arrays
 * 3. Starts with an empty object {} to avoid modifying any input objects
 *
 * This is useful when you want to combine configuration objects that contain arrays
 * of items that should be combined rather than replaced.
 * @example
 * // Returns { a: 1, b: 2, c: [1, 2, 3, 4] }
 * mergeAndConcat(
 *   { a: 1, c: [1, 2] },
 *   { b: 2, c: [3, 4] }
 * )
 *
 * // Returns { a: { b: [1, 2, 3], c: 4 } }
 * mergeAndConcat(
 *   { a: { b: [1, 2] } },
 *   { a: { b: [3], c: 4 } }
 * )
 */
export function mergeAndConcat(...objs) {
    let customizer = function (objValue, srcValue) {
        if (_.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    };
    return _.mergeWith({}, ...objs, customizer);
}
/**
 * Take input arrays, merge, & return single array w. unique values
 *
 * @aider
 * @param {...any[]} arrs - Arrays to merge and deduplicate
 * @returns {any[]} Array containing all unique values from the input arrays
 * @description
 * Combines multiple arrays and removes duplicate values.
 *
 * The function:
 * 1. Concatenates all input arrays into a single array
 * 2. Converts the array to a Set to remove duplicates
 * 3. Converts the Set back to an array
 *
 * This is useful for merging multiple collections while ensuring uniqueness.
 *
 * Note: The commented code shows an alternative implementation that was considered.
 * @example
 * // Returns [1, 2, 3, 4, 5]
 * uniqueVals([1, 2, 3], [3, 4, 5], [1, 5])
 *
 * // Returns ["a", "b", "c"]
 * uniqueVals(["a", "b"], ["b", "c"])
 *
 * // Works with mixed types
 * // Returns [1, "a", true, null]
 * uniqueVals([1, "a"], ["a", true, null])
 */
export function uniqueVals(...arrs) {
    /*
    let merged: any[] = [];
    for (let arr of arrs) {
      merged = [...merged, ...arr];
    }
      */
    let merged = [].concat(...arrs);
    return Array.from(new Set(merged));
}
/**
 * Return random element of array
 *
 * @aider
 * @param {any[]} arr - Array to select from
 * @returns {any} Randomly selected element from the array
 * @description
 * Selects and returns a random element from the provided array.
 *
 * The function uses Math.random() to generate a random index within
 * the bounds of the array length.
 * @example
 * // Returns a random element
 * getRand([1, 2, 3, 4, 5])
 *
 * // Returns a random string
 * getRand(["apple", "banana", "cherry"])
 */
export function getRand(arr) {
    return arr[Math.floor((Math.random() * arr.length))];
}
/**
 * Gets cnt random unique elements of an array
 * Not the most efficient but it works
 * if cnt = 0, returns a single element, else an array of els
 *
 * @aider
 * @param {any[]} arr - Array to select from
 * @param {number} [cnt=null] - Number of elements to select
 * @returns {any|any[]} Single random element if cnt is null/0, otherwise array of random elements
 * @throws {PkError} If arr is not an array or is empty
 * @description
 * Selects random unique elements from an array.
 *
 * The function:
 * 1. If cnt is null/0, returns a single random element
 * 2. If cnt > 0, returns an array of cnt unique random elements
 * 3. Limits cnt to the array length to avoid infinite loops
 *
 * The implementation uses array indices to select random elements,
 * ensuring uniqueness by tracking selected indices.
 *
 * Note: As the comment indicates, this is not the most efficient implementation
 * but it works reliably.
 * @example
 * // Returns a single random element
 * getRandElsArr([1, 2, 3, 4, 5])
 * getRandElsArr([1, 2, 3, 4, 5], 0)
 *
 * // Returns array of 3 unique random elements
 * getRandElsArr([1, 2, 3, 4, 5], 3)
 *
 * // Returns array of all elements in random order (when cnt >= arr.length)
 * getRandElsArr([1, 2, 3], 5) // Returns 3 elements
 */
export function getRandElsArr(arr, cnt = null) {
    if (!Array.isArray(arr) || !arr.length) {
        throw new PkError(`Invalid array arg to getRandEls:`, { arr });
    }
    cnt = Math.min(cnt, arr.length);
    if (!cnt) {
        return arr[Math.floor((Math.random() * arr.length))];
    }
    let arrKeys = Object.keys(arr).map((el) => parseInt(el));
    let keyLen = arrKeys.length;
    cnt = Math.min(cnt, keyLen);
    let subKeys = [];
    let num = 0;
    while (true) {
        let tstKey = getRand(arrKeys);
        if (subKeys.includes(tstKey)) {
            continue;
        }
        subKeys.push(tstKey);
        if (subKeys.length >= cnt) {
            break;
        }
    }
    let ret = subKeys.map((key) => arr[key]);
    let retLen = ret.length;
    return ret;
}
/**
 * Retuns subset of object or array values
 * @param objorarr - something with key/values
 * @param cnt - if null, a
 * @returns a single element if null, else an array of of cnt unique values from collection
 */
export function getRandEls(objorarr, cnt = null) {
    if ((!Array.isArray(objorarr) || !objorarr.length) && !isSimpleObject(objorarr)) {
        throw new PkError(`Invalid array arg to getRandEls:`, { objorarr });
    }
    let arrKeys = Object.keys(objorarr); //.map((el) => parseInt(el));
    if (!cnt) {
        let tstKey = getRand(arrKeys);
        //return objorarr[Math.floor((Math.random() * arrKeys.length))];
        return objorarr[tstKey];
    }
    cnt = Math.min(cnt, arrKeys.length);
    //let arrKeys = Object.keys(arr).map((el) => parseInt(el));
    let keyLen = arrKeys.length;
    cnt = Math.min(cnt, keyLen);
    let subKeys = [];
    let num = 0;
    while (true) {
        let tstKey = getRand(arrKeys);
        if (subKeys.includes(tstKey)) {
            continue;
        }
        subKeys.push(tstKey);
        if (subKeys.length >= cnt) {
            break;
        }
    }
    let ret = subKeys.map((key) => objorarr[key]);
    let retLen = ret.length;
    return ret;
}
/**
*/
/**
 * Retuns a random integer or array rand ints in range
 * @param numeric to - max int to return
 * @param numeric from default 0 - optional starting/min number
 * @param int?: cnt - if null/0 single int. Else, array of cnt ints.
 * @return int|int[] - if cnt<range, unique, afterwards, reuse
 */
export function randInt(to, from = 0, cnt) {
    // Convert args to ints if possible, else throw
    //@ts-ignore
    if (isNaN((to = parseInt(to)) || isNaN((from = parseInt(from))))) {
        throw new PkError(`Non-numeric arg to randInt():`, { to, from });
    }
    if (from === to) {
        return from;
    }
    if (from > to) {
        let tmp = from;
        from = to;
        to = tmp;
    }
    if (!cnt) {
        let bRand = from + Math.floor((Math.random() * ((to + 1) - from)));
        return bRand;
    }
    let range = to - from;
    let ret = [];
    while (ret.length < cnt) {
        let tst = randInt(to, from);
        if (ret.length < cnt) {
            if (ret.includes(tst)) {
                continue;
            }
            ret.push(tst);
        }
    }
    return ret;
}
/** Totally lifted from Axios - but they don't export it!
 * Takes an HTTP header string and objectifies it -
 * directives as keys
 * with values or undefined
 * @return object
 */
export function parseHeaderString(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while ((match = tokensRE.exec(str))) {
        tokens[match[1]] = match[2];
    }
    return tokens;
}
/**
 * Remove all quotes, spaces, etc from a string
 * stupid name - but just removes all quotes, spaces, etc
 * from a string.
 *
 * @aider
 * @param {any} [str] - String to process
 * @returns {string|null} String with quotes and spaces removed, or null if input is not a string
 * @description
 * Removes all single quotes, double quotes, and spaces from a string.
 *
 * Returns null if the input is not a string or is empty/null/undefined.
 *
 * Note: As indicated by the comment, the function name is not ideal but describes
 * its purpose of "stripping stray" characters.
 * @example
 * // Returns "HelloWorld"
 * stripStray("'Hello' \"World\"")
 *
 * // Returns "NoSpacesOrQuotes"
 * stripStray("No Spaces Or 'Quotes'")
 *
 * // Returns null
 * stripStray(null)
 * stripStray(123)
 */
export function stripStray(str) {
    if (!str || typeof str !== 'string') {
        return null;
    }
    str = str.replaceAll(/['" ]/g, '');
    return str;
}
/**
 * Escapes special regex characters from string for literal use in a regular expression
 *
 * @aider
 * @param {string} astr - String to escape
 * @returns {string} String with all special regex characters escaped
 * @description
 * Escapes special characters in a string so it can be used as a literal string
 * within a regular expression.
 *
 * The function escapes: . * + ? ^ $ { } ( ) | [ ] \
 *
 * This is useful when building regular expressions dynamically and you need
 * to include user input or other strings that might contain special regex characters.
 * @example
 * // Returns "\\d\\+\\.\\*"
 * escapeRegExp("\\d+.*")
 *
 * // Returns "\\(Hello\\)"
 * escapeRegExp("(Hello)")
 *
 * // Returns "example\\.com"
 * escapeRegExp("example.com")
 */
export function escapeRegExp(astr) {
    return astr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
/**
 * @aider
 * @param {string} openTag - Opening tag to match
 * @param {string} [closeTag] - Closing tag to match (defaults to openTag if not provided)
 * @param {boolean} [multiline] - Whether to enable multiline matching
 * @returns {RegExp} Regular expression that matches content between tags
 * @description
 * Creates a regular expression that matches content between specified opening and closing tags.
 *
 * The function:
 * 1. Escapes special regex characters in the tags
 * 2. Creates a non-greedy pattern to match content between tags
 * 3. Optionally enables multiline matching with the 's' flag
 *
 * This is a helper function used by taggedMatches() and can be used directly
 * when more control over regex matching is needed.
 *
 * Note: The function includes a commented alternative pattern for handling nested tags.
 * @example
 * // Returns /\{\{(.*?)\}\}/g
 * taggedMatchRegex("{{", "}}")
 *
 * // Returns /#(.*?)#/g
 * taggedMatchRegex("#")
 *
 * // Returns /<tag>(.*?)<\/tag>/gs
 * taggedMatchRegex("<tag>", "</tag>", true)
 */
export function taggedMatchRegex(openTag, closeTag, multiline) {
    closeTag = closeTag || openTag;
    let escOpenTag = escapeRegExp(openTag);
    let escCloseTag = escapeRegExp(closeTag);
    let opts = multiline ? 'gs' : 'g';
    // Conflicting non-greedy regexes - test both
    // Seems to work - but try 2 if problems
    let regexPattern = `${escOpenTag}(.*?)${escCloseTag}`;
    // This is to allow nested tags
    //let regexPattern = `${escOpenTag}((?:(?!${escOpenTag}|${escCloseTag}).)*?)${escCloseTag}`;  
    let regex = new RegExp(regexPattern, opts);
    return regex;
}
/**
 * Returns array of strings between openTag and closeTag - non-greedy
 * Escapes open & close tags
 * TODO: Add multiline match option
 *
 * @aider
 * @param {string} str - String to search
 * @param {string} openTag - Opening tag to match
 * @param {string} [closeTag] - Closing tag to match (defaults to openTag if not provided)
 * @param {boolean} [multiline] - Whether to enable multiline matching
 * @returns {string[]} Array of strings found between tags, with whitespace trimmed
 * @description
 * Extracts all substrings that appear between specified opening and closing tags.
 *
 * The function:
 * 1. Creates a regex using taggedMatchRegex()
 * 2. Finds all matches in the input string
 * 3. Extracts the content between tags (capture group 1)
 * 4. Trims whitespace from each match
 *
 * This is useful for parsing template strings, extracting variables, or
 * processing any text with tag-delimited sections.
 *
 * Note: The TODO comment indicates that multiline matching is planned but may
 * not be fully implemented yet.
 * @example
 * // Returns ["content1", "content2"]
 * taggedMatches("{{content1}} other text {{content2}}", "{{", "}}")
 *
 * // Returns ["variable"]
 * taggedMatches("This is a ${variable} in a string", "${", "}")
 *
 * // Returns ["tag1", "tag2"]
 * taggedMatches("#tag1 #tag2", "#")
 */
export function taggedMatches(str, openTag, closeTag, multiline) {
    let regex = taggedMatchRegex(openTag, closeTag, multiline);
    //let regex2 = new RegExp(regexPattern2, opts);
    let matches = [...str.matchAll(regex)].map(match => match[1]);
    matches = matches.map((match) => match.trim()); // Trim whitespace
    //  let matches2 = [...str.matchAll(regex2)].map(match => match[1]);
    // return {matches1, matches2};
    return matches;
}
/**
 * Converts a string to camelCase
 *
 * @aider
 * @param {string} str - String to convert
 * @returns {string} String converted to camelCase
 * @throws {Error} If input is not a string
 * @description
 * Converts a string to camelCase format by:
 * 1. Trimming whitespace
 * 2. Replacing underscores and hyphens followed by a character with the uppercase version of that character
 *
 * This function handles both kebab-case and snake_case inputs.
 * @example
 * // Returns "helloWorld"
 * toCamel("hello_world")
 *
 * // Returns "helloWorld"
 * toCamel("hello-world")
 *
 * // Returns "helloWorld"
 * toCamel(" hello_world ")
 */
export function toCamel(str) {
    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }
    //str = stripStray(str);
    str = str.trim();
    return str.replace(/[_-](\w)/g, (_, group1) => group1.toUpperCase());
}
/**
 * Converts a string to snake_case
 *
 * @aider
 * @param {string} str - String to convert
 * @returns {string} String converted to snake_case
 * @throws {Error} If input is not a string
 * @description
 * Converts a string to snake_case format by:
 * 1. Trimming whitespace
 * 2. Replacing uppercase letters with a hyphen followed by the lowercase version
 * 3. Replacing all hyphens with underscores
 *
 * This function handles camelCase inputs by inserting underscores before capital letters.
 * @example
 * // Returns "hello_world"
 * toSnake("helloWorld")
 *
 * // Returns "hello_world"
 * toSnake("HelloWorld")
 *
 * // Returns "hello_world"
 * toSnake(" helloWorld ")
 */
export function toSnake(str) {
    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }
    str = str.trim();
    return str.replace(/([A-Z])/g, (_, group1) => `-${group1.toLowerCase()}`).replace(/-/g, '_');
}
/**
 * Converts a string to kebab-case
 *
 * @aider
 * @param {string} str - String to convert
 * @returns {string} String converted to kebab-case
 * @throws {Error} If input is not a string
 * @description
 * Converts a string to kebab-case format by:
 * 1. Trimming whitespace
 * 2. Replacing uppercase letters with a hyphen followed by the lowercase version
 * 3. Replacing all underscores with hyphens
 *
 * This function handles both camelCase and snake_case inputs.
 * @example
 * // Returns "hello-world"
 * toKebab("helloWorld")
 *
 * // Returns "hello-world"
 * toKebab("hello_world")
 *
 * // Returns "hello-world"
 * toKebab(" HelloWorld ")
 */
export function toKebab(str) {
    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }
    str = str.trim();
    return str.replace(/([A-Z])/g, (_, group1) => `-${group1.toLowerCase()}`).replace(/_/g, '-');
}
/**
 * Takes a JS object & returns new object w. keys either cammelCased (default) or
 * Returns new JS object w. all keys converted to kebab-case, or camelCase
 *
 * @aider
 * @param {any} obj - Object whose keys should be converted
 * @returns {GenObj} New object with all keys converted to kebab-case
 * @description
 * Creates a new object with the same structure as the input object,
 * but with all keys converted to kebab-case format.
 *
 * This function recursively processes nested objects and arrays.
 * It uses the toKebab() function for the actual string conversion.
 * @example
 * // Returns { "hello-world": { "nested-key": "value" } }
 * kebabKeys({ helloWorld: { nestedKey: "value" } })
 *
 * // Returns { "first-name": "John", "last-name": "Doe" }
 * kebabKeys({ firstName: "John", lastName: "Doe" })
 */
export function kebabKeys(obj) {
    return recursiveKeyConversion(obj, toKebab);
}
/**
 * Takes a flat object & returns new object w. keys camelCased
 *
 * @aider
 * @param {GenObj} obj - Object whose keys should be converted
 * @returns {GenObj} New object with all keys converted to camelCase
 * @description
 * Creates a new object with the same structure as the input object,
 * but with all keys converted to camelCase format.
 *
 * This function recursively processes nested objects and arrays.
 * It uses the toCamel() function for the actual string conversion.
 * @example
 * // Returns { helloWorld: { nestedKey: "value" } }
 * camelKeys({ "hello-world": { "nested_key": "value" } })
 *
 * // Returns { firstName: "John", lastName: "Doe" }
 * camelKeys({ "first_name": "John", "last-name": "Doe" })
 */
export function camelKeys(obj) {
    return recursiveKeyConversion(obj, toCamel);
}
/**
 * Takes a JS object & returns new object w. keys converted, as defined by converstionFunction
 *
 * @aider
 * @param {any} obj - Object whose keys should be converted
 * @param {Function} conversionFunction - Function that converts a string to the desired format
 * @returns {GenObj} New object with all keys converted according to the conversion function
 * @description
 * Helper function that recursively converts all keys in an object using the provided conversion function.
 *
 * The function:
 * 1. Returns non-object values unchanged
 * 2. Recursively processes arrays by mapping each element
 * 3. Creates a new object with converted keys
 * 4. Recursively converts values that are objects
 *
 * This is used internally by camelKeys() and kebabKeys() but can be used directly
 * with custom conversion functions.
 * @example
 * // With a custom conversion function
 * recursiveKeyConversion(
 *   { "some_key": 1, "nested": { "another_key": 2 } },
 *   key => key.toUpperCase()
 * )
 * // Returns { "SOME_KEY": 1, "NESTED": { "ANOTHER_KEY": 2 } }
 */
function recursiveKeyConversion(obj, conversionFunction) {
    if (typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => recursiveKeyConversion(item, conversionFunction));
    }
    const newObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = conversionFunction(key);
            newObj[newKey] = recursiveKeyConversion(obj[key], conversionFunction);
        }
    }
    return newObj;
}
//TODO - These are NOT ALL CORRECT - this is improved but not fully debugged - 
/** For attributes, etc, as valid JS variable.
 * BONUS: Strips any extraneous quotes, etc.
 * @return string - camelCased
 */
/**
 * @deprecated - prefer toCamel
 */
export function camelCase(str) {
    return toCamel(str);
}
/**
 * @deprecated - use camelCase instead
 */
export function toCamelCase(str) {
    return toCamel(str);
}
//WRONG - actually converts to Kebab - keep because used elsewhere, but replaced by toSnake, toKebab, etc
/**
 * @deprecated - use toSnake
 */
export function toSnakeCase(str) {
    return toSnake(str);
}
/**
 * @deprecated - use toKebab
 */
export function kebabCase(str) {
    return toKebab(str);
}
/**
 * @deprecated - use toSnake
 */
export function snakeCase(str) {
    return toSnake(str);
}
/**
 * Returns the geographic distance between two points of lon/lat in meters
 * IMPORTANT! Standard is [longitude, latitude]!!!
 *
 * @aider
 * @param {GenObj|Array<number>} point1 - First point as [longitude, latitude] array or {lat, lon} object
 * @param {GenObj|Array<number>} point2 - Second point as [longitude, latitude] array or {lat, lon} object
 * @returns {number|null} Distance between points in meters
 * @throws {PkError} If points are in invalid format
 * @description
 * Calculates the great-circle distance between two geographic points using the Haversine formula.
 *
 * The function accepts points in two formats:
 * 1. Array format: [longitude, latitude] (note the order!)
 * 2. Object format: {lat: latitude, lon: longitude} (preferred)
 *
 * The Haversine formula determines the shortest distance between two points on a sphere,
 * accounting for the Earth's curvature.
 *
 * Note: The function emphasizes that when using array format, the standard is [longitude, latitude],
 * which is different from some APIs that use [latitude, longitude].
 * @example
 * // Using object format (preferred)
 * haversine({lat: 52.5200, lon: 13.4050}, {lat: 48.8566, lon: 2.3522})
 * // Returns distance in meters between Berlin and Paris
 *
 * // Using array format [longitude, latitude]
 * haversine([13.4050, 52.5200], [2.3522, 48.8566])
 * // Returns the same distance
 */
export function haversine(point1, point2) {
    let lat1, lat2, lon1, lon2;
    if (Array.isArray(point1)) {
        lon1 = point1[0];
        lat1 = point1[1];
    }
    else if (isObject(point1)) {
        lat1 = point1.lat;
        lon1 = point1.lon;
    }
    else {
        throw new PkError(`Invalid point1 arg to haversine:`, { point1 });
    }
    if (Array.isArray(point2)) {
        lon2 = point2[0];
        lat2 = point2[1];
    }
    else if (isObject(point2)) {
        lat2 = point2.lat;
        lon2 = point2.lon;
    }
    else {
        throw new PkError(`Invalid point2 arg to haversine:`, { point2 });
    }
    const EARTH_RADIUS = 6371;
    const R = EARTH_RADIUS; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in m
}
// Also untested - two versions to test if iterable
// Two isIterable suggestions - 
// USE isIterableTest for a while to compare!
/**
 * @deprecated - Not really - just a reminder to use isIterableTest for a while to check
 */
export function isIterable(arg) {
    if (arg === null || arg === undefined) {
        return false;
    }
    return typeof arg[Symbol.iterator] === 'function';
}
/**
 * @deprecated - Not really - just a reminder to use isIterableTest for a while to check
 */
export function is_iterable(arg) {
    return (Reflect.has(arg, Symbol.iterator)) &&
        (typeof (arg[Symbol.iterator]) === "function");
}
export function isIterableTest(arg) {
    let r1 = is_iterable(arg);
    let r2 = isIterable(arg);
    if (r1 !== r2) {
        throw new Error(`isIterableTest failed with different results`);
    }
    return r1;
}
/**
 *  Convert JS objects with . notation keys (default) ("console.color") into object with nested keys
 * @param obj - a JS object to navigate
 * @param splitter - default '.' - the character to split on
 */
export function dotNotationToObject(obj, splitter = '.') {
    const result = {};
    for (const key in obj) {
        const path = key.split(splitter);
        let current = result;
        for (let i = 0; i < path.length - 1; i++) {
            const prop = path[i];
            current[prop] = current[prop] || {};
            current = current[prop];
        }
        current[path[path.length - 1]] = obj[key];
    }
    return result;
}
/**
 * Returns object value from array of keys - maybe '.' separated
 * Tolerant - if not a valid path/value, return undefined
 * TODO: What if path component value exists, but not an object?
 * @param obj - a JS object to navigate
 * @param keyPaths string[] - array of key paths - nested arr, if '.' separated, decompose
 * @return - the target value
 */
export function dotPathVal(obj, ...keyPaths) {
    if (!isSimpleObject(obj)) {
        return null;
    }
    let fPaths = keyPaths.flat(Infinity);
    let ffPaths = [];
    for (let fPath of fPaths) {
        let fpArr = fPath.split('.');
        ffPaths = ffPaths.concat(fpArr);
    }
    let tmpVal = obj;
    for (let key of ffPaths) {
        if (!tmpVal || isEmpty(tmpVal) || !isSimpleObject(tmpVal)) {
            return;
        }
        tmpVal = tmpVal[key];
    }
    return tmpVal;
}
/**
 * Return array of all possible combination of input arrays
 *
 * @aider
 * @param {...any[]} arrays - Input arrays to combine
 * @returns {Array<any[]>} Array of all possible combinations
 * @description
 * Calculates the Cartesian product of any number of input arrays.
 *
 * The Cartesian product represents all possible combinations where each combination
 * contains exactly one element from each input array.
 *
 * The function:
 * 1. Starts with an array containing an empty array [[]]
 * 2. For each input array, creates new combinations by appending each element
 *    to each existing combination
 * 3. Handles empty input arrays by not modifying the accumulated results
 *
 * This implementation uses reduce() and flatMap() for a concise functional approach.
 * @example
 * // Returns [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 * cartesianProduct([1, 2], ['a', 'b'])
 *
 * // Returns [[1, 'a', true], [1, 'a', false], [1, 'b', true], [1, 'b', false],
 * //           [2, 'a', true], [2, 'a', false], [2, 'b', true], [2, 'b', false]]
 * cartesianProduct([1, 2], ['a', 'b'], [true, false])
 *
 * // Returns [[1], [2]] (when one array is empty)
 * cartesianProduct([1, 2], [])
 */
export function cartesianProduct(...arrays) {
    // Initialize with an empty array within an array
    return arrays.reduce((acc, array) => {
        // If array is empty, just return the accumulated results so far
        if (array.length === 0)
            return acc;
        // Accumulate combinations of current result and new array
        return acc.flatMap(accElem => array.map(elem => [...accElem, elem]));
    }, [[]]);
}
//# sourceMappingURL=common-operations.js.map