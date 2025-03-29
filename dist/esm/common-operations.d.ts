/**
 * @library - pk-ts-common
 * @file - common-operations.ts
 * @fileoverview - Library of `ES2022` TypeScript/JavaScript utility functions for use in both Node.js & browser environments.
 */
import urlStatus from 'url-status-code';
import JSON5 from 'json5';
import 'zod-metadata/register';
declare global {
    interface JSON {
        decycle(object: any): any;
        retrocycle(object: any): any;
    }
    interface JSON5 {
        decycle(object: any): any;
        retrocycle(object: any): any;
    }
}
export type TypeArr<T> = T | T[];
export type OptArrStr = TypeArr<string>;
export type Strings = TypeArr<string>;
export type Falsy = false | 0 | "" | null | undefined;
export type GenericObject = {
    [key: PropertyKey]: any;
};
export type GenObj = GenericObject;
export type Scalar = string | number;
export type Scalars = TypeArr<Scalar>;
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
export declare function mkArray<T>(arg: T | T[]): T[];
export type Void = null | undefined;
export type SimpleValue = bigint | PropertyKey | boolean;
export type Primitive = SimpleValue | Void;
export type AnyObject = Record<PropertyKey, unknown>;
/**
 * Represents a plain JavaScript object (not an array, Map, Set, etc)
 * Must satisfy these conditions:
 * 1. Is a non-null object
 * 2. Has the same prototype as an empty object literal {}
 *
 * This type excludes:
 * - Arrays (different prototype)
 * - Date objects (different prototype)
 * - Map/Set (different prototype)
 * - Class instances (different prototype)
 */
export type SimpleObject = {
    [key: PropertyKey]: any;
} & {
    __proto__: {};
};
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
export declare function isNumeric(arg: any, asNum?: boolean): number | boolean;
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
export declare function asNumeric(arg: any): number | boolean;
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
export declare function isEmpty(arg: any): boolean;
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
export declare function isPropertyKey(key: unknown): key is PropertyKey;
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
export declare function isVoid(arg: unknown): arg is Void;
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
export declare function isString(value: unknown): value is string;
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
export declare function isByRef(arg: any): boolean;
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
export declare function isSimpleType(arg: unknown): boolean;
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
export declare function isFunction(arg: unknown): arg is Function;
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
export declare function isPrimitive(arg: unknown): arg is Primitive;
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
export declare function isSimpleObject(anobj: unknown): anobj is SimpleObject;
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
export declare function isGenObj(anobj: unknown): anobj is GenObj;
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
export declare function isObject(arg: any, alsoEmpty?: boolean, alsoFunction?: boolean): boolean;
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
export declare function uniqueKeys(...args: object[]): boolean;
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
export declare function mkScalarArr(...args: any): Scalar[];
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
export declare function isESM(): boolean;
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
export declare function isCommonJS(): boolean;
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
export declare function getStack(offset?: number): any[];
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
export declare function stackParse(): any[];
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
export declare function stamp(entry?: any, frameAfter?: any): string;
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
export declare function getFrameAfterFunction(fname?: any, forceFunction?: any): any;
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
export declare function subObj(obj: GenericObject, fields: any[]): GenObj;
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
export declare function partitionObj(obj: GenObj, keys?: string | string[]): {
    picked: GenObj;
    omitted: GenObj;
};
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
export declare function extractOpts(...args: any[]): any;
export declare const dfnsKeys: string[];
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
export declare function validateDateFnsDuration(obj: any): false | SimpleObject;
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
export declare function strIncludesAny(str: string, substrx: Strings, tolower?: any): boolean;
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
export declare function strIncludesWhich(str: string, substrs: any): any[];
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
export declare function isPromise(arg?: any): boolean;
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
export declare function filterInt(value: any): number | false;
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
export declare function eventInfo(ev: any): {};
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
export declare function pkToDate(arg: any): false | Date;
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
export declare function dateToTimestamp(dt: any): number;
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
export declare const dtFnsFormats: {
    html: string;
    sqldt: string;
    short: string;
    dt: string;
    dts: string;
    ts: string;
    s: string;
    ms: string;
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
export declare function dtFmt(fmt?: string, dt?: any): string | false;
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
export declare function inArr1NinArr2(arr1: any[], arr2: any): any[];
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
export declare function compareArrays(arr1: [], arr2: []): {
    arr1: [];
    arr2: [];
    arr1Cnt: 0;
    arr2Cnt: 0;
    shared: any[];
    sharedCnt: number;
    onlyArr1: any[];
    onlyArr1Cnt: number;
    onlyArr2: any[];
    onlyArr2Cnt: number;
};
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
export declare function intersect(a?: any[], b?: any[]): any[];
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
export declare function arrayToLower(arr: any[]): any[];
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
export declare function arraysEqual(a: any, b: any): boolean;
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
export declare function dupEntries(...args: any[]): any[];
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
export declare function arrayJoin(arr: any[], sep: any): any[];
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
export declare function isSubset(a: any, b: any): any;
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
export declare function insertBetween(arr: Array<any>, item: any): any[];
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
export declare function isCli(report?: boolean): boolean;
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
export declare function rewriteHttpsToHttp(url: any): string;
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
export declare function checkUrl(url: any): Promise<boolean | any[]>;
/**
 * Tests a URL with Axios
 */
export declare function checkUrlAxios(tstUrl: any, full?: boolean): Promise<any>;
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
export declare function firstToUpper(str: string): string;
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
export declare function checkUrl3(url: any): Promise<any>;
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
export declare function trueVal(arg: any): any;
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
export declare function jsonClone(arg: any): any;
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
export declare function getConstructorChain(obj: any): any[];
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
export declare function isInstance(arg: any): GenObj | false;
/**
 * Hack for TypeScript - get the class of a class instance from its constructor,
 * but cast it to GenObj, so static references work.
 * Work in progress...
 * But also better to add a "class" getter property to the Base class
 */
export declare function getClass(instance: GenObj): GenObj;
/**
 * Checks if an arg is an extended class or a function/top-level class
 * Appears to be no way to distinguish between a top-level class
 * and a function...
 */
export declare function isClassOrFunction(arg: any): any;
/**
 * Check whether obj is a JS class or a class instance
 */
/**
 * Returns the parent (ancestor) class stack of a class instance
 */
export declare function classStack(obj: any): any[];
/**
 * Returns the prototype chain of an object
 * This is very hacky - but can be helpful - to get the inheritance
 * chain of classes & instances of classes - lots of bad edge cases -
 * BE WARNED!
 */
export declare function getPrototypeChain(obj: any): any[];
/**
 * Uses prototype chain and returns array of ancestor class names
 * @param obj
 */
export declare function getAncestorArr(obj: any): string[];
/** Takes an object & parent class & checks if it is a subclass
 * @param obj - a JS Class
 * @param parent - another JS class
 * @param alsoSelf = 0 - include if it is it's own class
 * @return boolean
 *
 */
export declare function isSubclassOf(sub: any, parent: any, alsoSelf?: number): boolean;
/**
 * Returns details about an object - props, prototype, etc.
 */
export declare function getObjDets(obj: any): false | {
    toObj: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    pkToObj: String;
    props: string | boolean | GenericObject | [];
    prototype: any;
};
/**
 * Built-in JS Classes
 * Not complete, but want to be careful...
 * Leave Math out - because it is not a class or constructor...
 */
export declare const jsBuiltInObjMap: {
    Object: ObjectConstructor;
    Array: ArrayConstructor;
    Date: DateConstructor;
    Number: NumberConstructor;
    String: StringConstructor;
    Function: FunctionConstructor;
};
export declare const jsBuiltIns: (DateConstructor | NumberConstructor | StringConstructor | ObjectConstructor | ArrayConstructor | FunctionConstructor)[];
export declare function getAllBuiltInProps(): any[];
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
export declare const builtInProps: any[];
/**
 * Is the argument parsable?
 * Any point to decompose this with allProps?
 */
export declare function isParsable(arg: any): boolean;
export declare function isParsed(arg: any): any;
/**
 * Returns a version of the object with all properties as enumerable
 * @param GenObj - object to enumerate
 * @param int depth - how deep to recurse
 */
export declare function asEnumerable(obj: GenObj, depth?: number): GenObj;
/**
 * get property names from prototype tree. Even works for primitives,
 * If wVal: false (default) - return all keys
 * else - obj. with keys/values
 * but not for null - so catch the exception & return []
 */
export declare function getProps(obj: any, wVal?: boolean): any[] | GenObj;
/**
 * Weirdly, most built-ins have a name property, & are of type [Function:Date]
 * or whatever, but Math does NOT have a name property, and is of type "Object [Math]". So try to deal with that...
 */
export declare function builtInName(bi: any): string;
/**
 * Returns false if arg is NOT a built-in - like Object, Array, etc,
 * OR - the built-in Name as string.
 */
export declare function isBuiltIn(arg: any): string | false;
/**
 * Early version of analyzing functions
 */
export declare function inspectFunction(afnc: any): {
    fncType: String;
    jsToAfnc: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object";
    err: string;
    name?: undefined;
    body?: undefined;
    length?: undefined;
    props?: undefined;
} | {
    fncType: String;
    jsToAfnc: "function";
    name: any;
    body: any;
    length: any;
    props: GenericObject;
    err?: undefined;
};
export declare const keepProps: string[];
export declare function filterProps(props: any[]): any[];
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
export declare let defaultAllPropsOpts: {
    opt: string;
    filter: boolean;
    depth: number;
};
/**
 * @aider
 * Analyzes an object's properties with configurable output format and depth
 *
 * @overload
 * @param {any} obj - Object to analyze
 * @param {string} [optArg] - Option string controlling output format
 * @param {number} [depth] - How deep to recurse into nested objects
 * @returns {GenObj | [] | string | boolean} Object properties in requested format
 *
 * @overload
 * @param {any} obj - Object to analyze
 * @param {GenObj} [optArg] - Options object controlling output format
 * @param {number} [depth] - How deep to recurse into nested objects
 * @returns {GenObj | [] | string | boolean} Object properties in requested format
 *
 * @description
 * Analyzes an object's properties with configurable output format and recursion depth.
 *
 * The function accepts options either as a string or an object:
 * - If 'v' is included: Returns the raw property values
 * - If 't' is included: Returns the type of each property
 * - If 'p' is included: Returns parsed/readable values for complex properties
 * - If 'f' is included: Returns full property details without filtering
 *
 * If none of t,v,p are specified, returns just an array of property names.
 *
 * The depth parameter controls how deep to recurse into nested objects.
 */
export declare function allProps(obj: any, optArg?: string, depth?: number): GenObj | [] | string | boolean;
export declare function allProps(obj: any, optArg?: GenObj, depth?: number): GenObj | [] | string | boolean;
export declare function allPropsWithTypes(obj: any, depth?: number): string | boolean | GenericObject | [];
export declare function objInfo(arg: any, opt?: unknown, depth?: number): GenericObject;
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
export declare function typeOf(anObj: any, opts?: any): String;
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
export declare function typeOfEach(obj: any, wVal?: any): any;
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
export declare function dbgReport(...args: any[]): string;
export declare function valWithType(val: any): any;
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
export declare function isJsonStr(arg: any): arg is string;
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
export declare function isJson5Str(arg: any): arg is string;
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
export declare function JSONParse(str: string): any;
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
export declare function JSON5Parse(str: string): any;
/**
 * Takes a (possibly complex, deep) arg - primitive, object, array
 * @param any arg - Object, array or primitive
 * @param boolean toJson - false
 * Deep iterates for key names ending in '*JSON'
 * If toJson === true, converts value of key to a JSON string
 * If toJson === false, converts value of key from a JSON string
 * @return arg - converted
 */
export declare function keysToFromJson(arg: any, toJson?: boolean): any;
export declare function keysToJson(arg: any): any;
export declare function keysFromJson(arg: any): any;
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
export declare function JSON5Stringify(arg: any, space?: number): any;
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
export declare function JSONStringify(arg: any, space?: number): any;
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
export declare function mergeAndConcat(...objs: any[]): GenObj;
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
export declare function uniqueVals(...arrs: any[]): any[];
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
export declare function getRand(arr: any[]): any;
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
export declare function getRandElsArr(arr: any[], cnt?: any): any;
/**
 * Retuns subset of object or array values
 * @param objorarr - something with key/values
 * @param cnt - if null, a
 * @returns a single element if null, else an array of of cnt unique values from collection
 */
export declare function getRandEls(objorarr: GenObj | any[], cnt?: number | null): any;
/**
*/
/**
 * Retuns a random integer or array rand ints in range
 * @param numeric to - max int to return
 * @param numeric from default 0 - optional starting/min number
 * @param int?: cnt - if null/0 single int. Else, array of cnt ints.
 * @return int|int[] - if cnt<range, unique, afterwards, reuse
 */
export declare function randInt(to: any, from?: number, cnt?: number): Number | Array<number>;
/** Totally lifted from Axios - but they don't export it!
 * Takes an HTTP header string and objectifies it -
 * directives as keys
 * with values or undefined
 * @return object
 */
export declare function parseHeaderString(str: any): any;
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
export declare function stripStray(str?: any): any;
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
export declare function escapeRegExp(astr: string): string;
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
export declare function taggedMatchRegex(openTag: string, closeTag?: string, multiline?: any): RegExp;
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
export declare function taggedMatches(str: string, openTag: string, closeTag?: string, multiline?: any): string[];
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
export declare function toCamel(str: any): any;
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
export declare function toSnake(str: any): any;
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
export declare function toKebab(str: any): any;
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
export declare function kebabKeys(obj: any): GenObj;
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
export declare function camelKeys(obj: any): GenObj;
/** For attributes, etc, as valid JS variable.
 * BONUS: Strips any extraneous quotes, etc.
 * @return string - camelCased
 */
/**
 * @deprecated - prefer toCamel
 */
export declare function camelCase(str?: any): any;
/**
 * @deprecated - use camelCase instead
 */
export declare function toCamelCase(str?: any): any;
/**
 * @deprecated - use toSnake
 */
export declare function toSnakeCase(str?: any): any;
/**
 * @deprecated - use toKebab
 */
export declare function kebabCase(str?: any): any;
/**
 * @deprecated - use toSnake
 */
export declare function snakeCase(str?: any): any;
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
export declare function haversine(point1: GenObj | Array<number>, point2: GenObj | Array<number>): number | null;
/**
 * @deprecated - Not really - just a reminder to use isIterableTest for a while to check
 */
export declare function isIterable(arg: any): boolean;
/**
 * @deprecated - Not really - just a reminder to use isIterableTest for a while to check
 */
export declare function is_iterable(arg: any): boolean;
export declare function isIterableTest(arg: any): boolean;
/**
 *  Convert JS objects with . notation keys (default) ("console.color") into object with nested keys
 * @param obj - a JS object to navigate
 * @param splitter - default '.' - the character to split on
 */
export declare function dotNotationToObject(obj: any, splitter?: string): {};
/**
 * Returns object value from array of keys - maybe '.' separated
 * Tolerant - if not a valid path/value, return undefined
 * TODO: What if path component value exists, but not an object?
 * @param obj - a JS object to navigate
 * @param keyPaths string[] - array of key paths - nested arr, if '.' separated, decompose
 * @return - the target value
 */
export declare function dotPathVal(obj: any, ...keyPaths: any[]): any;
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
export declare function cartesianProduct(...arrays: any[]): any;
//# sourceMappingURL=common-operations.d.ts.map