/**
 * @library - pk-ts-common
 * @file - common-operations.ts
 * @fileoverview - Library of `ES2022` TypeScript/JavaScript utility functions for use in both Node.js & browser environments.
 */
import urlStatus from 'url-status-code';
import JSON5 from 'json5';
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
 * Makes an array from arg, or returns empty array if arg is undefined/null
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
 * @param arg - argument to check
 * @param asNum boolean - if true, returns the numeric value
 * @return number or boolean true/false
 *
 */
export declare function isNumeric(arg: any, asNum?: boolean): number | boolean;
/**
 * Returns the numeric value, or boolean false
 */
export declare function asNumeric(arg: any): number | boolean;
/**
 * For TS Type Guards - predicate `is<Type>` functions
 */
/**
 * Checks if the argument is "Empty" - null, undefined, empty string, empty array, empty object
 * This is a tough call & really hard to get right...
 * @param arg - argument to test
 * @return boolean - true if empty, false if not empty
 */
export declare function isEmpty(arg: any): boolean;
export declare function isPropertyKey(key: unknown): key is PropertyKey;
/**
 * Trickier than isEmpty - tests only for null or undefined - 0, '', {}, [] should return true
 * IMPORTANT if testing if a param is not passed (null/undefined) or passed as 0
 */
export declare function isVoid(arg: unknown): arg is Void;
export declare function isString(value: unknown): value is string;
/**
 * Checks if the argument has values by reference (array, object, etc)
 * Arrays & Objects passed by referrence,
 * risk of unintended changes
 */
export declare function isByRef(arg: any): boolean;
/**
 * Checks if the argument is a "simple" JS type - boolean, number, string, bigint
 */
export declare function isSimpleType(arg: unknown): boolean;
export declare function isFunction(arg: unknown): arg is Function;
/**
 * Checks if the argument is a "primitive" JS type - boolean, number, string, bigint, null, undefined, ...
 */
export declare function isPrimitive(arg: unknown): arg is Primitive;
/**
 * Tests if the argument is a "simple" JS object - with just keys
 * & values, not based on other types or prototypes
 *
 * TODO: What about arrays?
 */
export declare function isSimpleObject(anobj: unknown): anobj is SimpleObject;
export declare function isGenObj(anobj: unknown): anobj is GenObj;
/**
 * Checks if the argument is an object -
 */
export declare function isObject(arg: any, alsoEmpty?: boolean, alsoFunction?: boolean): boolean;
/**
 * Checks if the keys of all objects in the argument are unique
 * @param ...args:object - objects to test
 * @return boolean - true if all objects have unique property names
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
 */
export declare function mkScalarArr(...args: any): Scalar[];
export { urlStatus, JSON5, };
/**
 * Check if running in commonJS or ESM Module env.
 * TOTALLY UNTESTED - CODE FROM BARD -in 2023
 * But it finally compiles in tsc for each target - commonjs & esm - try testing !!
 */
export declare function isESM(): boolean;
export declare function isCommonJS(): boolean;
/**
 * Returns stack trace as array
 * Error().stack returns a string. Convert to array
 * @param offset - optional - how many levels shift off
 * the top of the array
 * @retrun array stack
 */
export declare function getStack(offset?: number): any[];
/**
 * Parse the call stack
 */
export declare function stackParse(): any[];
/**
 *	Generates a timestamp string with basic info for console logging.
 * @param entry (any) - Optional parameter representing additional information to include in the timestamp. Default value is undefined
 * @param frameAfter (any) - Optional parameter specifying a function name or array of function names to skip when determining the stack frame. Default value is undefined.
 * @return String A formatted timestamp string including the specified entry, file name, function name, and line numberstring
 */
export declare function stamp(entry?: any, frameAfter?: any): string;
/**
 *  Retrieves the stack frame after a specified function.
 * @param fname (string|array) - The name of the function or an array of function names to skip when determining the stack frame. Default value is undefined.
 @param   forceFunction (boolean) - Optional parameter indicating whether to force the retrieval of a function name even if it matches one in the exclude list. Default value is false.

 @return Object - An object containing the file name, function name, and line number of the stack frame after the specified function.
 */
export declare function getFrameAfterFunction(fname?: any, forceFunction?: any): any;
/**
 * @deprecated - use _.pick instead
 * Return just the subset of the object, for keys specified in the "fields" array.
 * ACTUAALY - can be deep - BUT - consider using lodash `pick` & `omit` instead.
 * @param obj - src object
 * @param fields mixed array of string keys, or object with single key field with array of fields - called recursively
 * @return object - specified subset of object
 */
export declare function subObj(obj: GenericObject, fields: any[]): GenObj;
/**
 * Partitions GenObj by keys array - included & excluded
 * @param obj - src object
 * @param keys - string|string[] - keys to filter by in picked/omitted
 * Returns 2 objs - {picked, omitted}
 */
export declare function partitionObj(obj: GenObj, keys?: string | string[]): {
    picked: GenObj;
    omitted: GenObj;
};
/**
 * Returns a new merged object, optionally filtered by keylist
 * Useful for merging default options with user-supplied options
 * If first arg is array, then it is assumed to be the keys to pick
 * @param args - src keys & objects
 * If first arg is array, then it is assumed to be the keys to pick
 *
 * @return object - specified subset of merged objects
 */
export declare function extractOpts(...args: any[]): any;
export declare const dfnsKeys: string[];
/** Takes a 'duration' object for date-fns/add and validate
 * it. Optionall, converts to negative (time/dates in past)
 * @param obj object - obj to test
 * //@param boolean forceNegative - force to negative/past offest?
 * @return duration
 */
export declare function validateDateFnsDuration(obj: any): false | SimpleObject;
/**
 * Returns true if arg str contains ANY of the substrings
 * @param str string - string to test
 * @param substrs string|string[] - substrings to test
 * @param tolower boolean - convert to lowercase?
 * @return boolean - true if str contains any of substrs
 */
export declare function strIncludesAny(str: string, substrx: Strings, tolower?: any): boolean;
/** Like strIncludesAny, but returns an array of the substrings found
 */
export declare function strIncludesWhich(str: string, substrs: any): any[];
/**
 * Checks if a given argument is a Promise.
 * @param arg - The argument to check.
 * @return - boolean true if arg is a Promise, else false
 */
export declare function isPromise(arg?: any): boolean;
/** From Mozilla - a stricter int parser */
export declare function filterInt(value: any): number | false;
/**
 * Takes a browser event & tries to get some info
 * Move this to browser library when the time comes
 */
export declare function eventInfo(ev: any): {};
/**
 * If arg can be in any way be interpreted as a date,
 * returns the JS Date object, optionally date-fns formatted string
 * @param arg - argument to convert to JS Date - null for now
 * @param fmt - string - a date-fns format or key to one of standard formats
 * NOTE: Unlike regulare JS :
 *
 * let dtE = new Date(); //Now
 * let dtN = new Date(null); //Start of epoch
 * Valid arg values:
 *    null - returns new Date() - now
 *    date-fns add option object: {years, months, days, hours, minutes, seconds} - returns offset from now
 *    new Date("2016-01-01")
 *   "2016-01-01"
 *    1650566202871
 *   "1650566202871"
 *   "2022-04-21T18:36:42.871Z"
 * Returns a valid JS Date object or false
 * -- Why not just 'new Date(arg)'??
 * Because: new Date(1650566202871) works
 * BUT new Date("1650566202871") DOESN'T - and sometimes
 * the DB returns a timestamp as a string...
 * @return JS Date or formatted string or false
 */
export declare function pkToDate(arg: any): false | Date;
/**
 * Converts a date to a Unix timestamp (seconds since the epoch) - NOT MILLISECONDS!
 * @param {Dateable} dt - dateable arg for pkToDate - defaults to now
 * @return number - unix timestamp in seconds
 *
 */
export declare function dateToTimestamp(dt: any): number;
/**
 * Object for date-fns formats, with simple keys
 */
export declare const dtFnsFormats: {
    html: string;
    sqldt: string;
    short: string;
    dt: string;
    dts: string;
    ts: string;
};
/**
 * Quick Format a date with single format code & date
 * @param fmt string - a key to pre-defined dtFnsFormats or dtfns format str
 * @param dt - datable or null for "now"
 * @return string|false - Formatted date string, or false if dt is invalid
 */
export declare function dtFmt(fmt?: string, dt?: any): string | false;
/**
 * Return elements in arr1 Not In arr2
 * @param arr1 - array of elements
 * @param arr2 - single element or array of elements
 */
export declare function inArr1NinArr2(arr1: any[], arr2: any): any[];
/**
 * Compare two arrays returning an object with counts of shared, only in arr1, only in arr2, etc
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
 */
export declare function intersect(a?: any[], b?: any[]): any[];
/**
 * Returns array with all strings in array converted to lower case
 */
export declare function arrayToLower(arr: any[]): any[];
/**
 * Compares arrays by VALUES - independant of order
 */
export declare function arraysEqual(a: any, b: any): boolean;
/**
 * Take any number of array args & returns array of all duplicates
 */
export declare function dupEntries(...args: any[]): any[];
/**
 * Inserts an element between each element of an array - like join() but for arrays
 *
 */
export declare function arrayJoin(arr: any[], sep: any): any[];
/**
 * Is 'a' a subset of 'b' ?
 */
export declare function isSubset(a: any, b: any): any;
/**
 * Takes an array and an element, returns a new array with
 * the element inserted between each element of the original array.
 */
export declare function insertBetween(arr: Array<any>, item: any): any[];
export declare function isCli(report?: boolean): boolean;
/**
 * Converts an https URL to an HTTP URL.
 */
export declare function rewriteHttpsToHttp(url: any): string;
/**
 * Check single url or array of urls for status
 * if single url, return true/false
 * if array, return array of failed urls
 * TODO!! Doesn't accout for network errors, exceptions, etc!!
 * SEE below checkUrl3
 */
export declare function checkUrl(url: any): Promise<boolean | any[]>;
/**
 * Tests a URL with Axios
 */
export declare function checkUrlAxios(tstUrl: any, full?: boolean): Promise<any>;
/**
 * Makes first character of string uppercase
 */
export declare function firstToUpper(str: string): string;
/**
 * Tri-state check - to account for failed checks -
 * @return boolean|other
 * If "true" - good URL
 * If "false" - 404 or something - but GOT A STATUS!
 * IF other - who knows? bad domain, invalid URL, network error,...
 *
 *
 */
export declare function checkUrl3(url: any): Promise<any>;
/**
 * returns arg, unless it is an empty object or array
 */
export declare function trueVal(arg: any): any;
/** Try to make simple copies of complex objects (like with cyclic references)
 * to be storable in MongoDB
 * Primitives will just be returned unchanged.
 */
export declare function jsonClone(arg: any): any;
/**
 * Return the constructor chain of an object
 */
export declare function getConstructorChain(obj: any): any[];
/**
 * Checks if arg is an instance of a class.
 * TODO: - have to do lots of testing of different args to
 * verify test conditions...
 * @return - false, or {constructor, className}
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
 * Experimenting with function overloading
 * changed defaults - opt from "tvp" to "tv", depth from 6 to 1
 */
export declare function allProps(obj: any, optArg?: string, depth?: number): GenObj | [] | string | boolean;
export declare function allProps(obj: any, optArg?: GenObj, depth?: number): GenObj | [] | string | boolean;
export declare function allPropsWithTypes(obj: any, depth?: number): string | boolean | GenericObject | [];
export declare function objInfo(arg: any, opt?: unknown, depth?: number): GenericObject;
/**
 * Returns the type of the argument. If it's an object, it returns the name of the constructor.
 */
export declare function typeOf(anObj: any, opts?: any): String;
/**
 * Lazy way to get type of multiple variables at once with typeOf
 * @param simple object obj - collection of properties to type
 * @return object - keyed by the original keys, to type
 */
export declare function typeOfEach(obj: any, wVal?: any): any;
/**
 * Takes any args & tries to analyze them
 */
export declare function dbgReport(...args: any[]): string;
export declare function valWithType(val: any): any;
/**
 * Returns true if arg is string & can be JSON parsed
 */
export declare function isJsonStr(arg: any): arg is string;
/**
 * Returns true if arg is string & can be JSON5 parseable
 */
export declare function isJson5Str(arg: any): arg is string;
export declare function JSONParse(str: string): any;
/**
 * Experiment with Use retrocycle to parse
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
/** Safe stringify -
 * Experiment with just decycle for all stringify
 */
export declare function JSON5Stringify(arg: any, space?: number): any;
export declare function JSONStringify(arg: any, space?: number): any;
/**
 * Returns a new object as deepMerge of arg objs, BUT with arrays concatenated
 * @param objs - unlimited number of input objects
 * @return object - a new object with the input objects merged,
 *   and arrays concatenated
 */
export declare function mergeAndConcat(...objs: any[]): GenObj;
/**
 * Take input arrays, merge, & return single array w. unique values
 */
export declare function uniqueVals(...arrs: any[]): any[];
/**
 * Return random element of array
 */
export declare function getRand(arr: any[]): any;
/**
 * Gets cnt random unique elements of an array
 * Not the most efficient but it works
 * if cnt = 0, returns a single element, else an array of els
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
 */
export declare function stripStray(str?: any): any;
/**
 * Escapes special regex characters from string for literal use in a regular expression
 */
export declare function escapeRegExp(astr: string): string;
export declare function taggedMatchRegex(openTag: string, closeTag?: string, multiline?: any): RegExp;
/**
 * Returns array of strings between openTag and closeTag - non-greedy
 * Escapes open & close tags
 * TODO: Add multiline match option
 * @param str - string to search
 * @param openTag:string - openTag
 * @param closeTag?:string - optional closeTag - if absent, just use openTag
 * @param multiline?:any - optional - if true, multiline match
 */
export declare function taggedMatches(str: string, openTag: string, closeTag?: string, multiline?: any): string[];
/**
 * Converts a string to camelCase
 */
export declare function toCamel(str: any): any;
/**
 * Converts a string to snake_case
 */
export declare function toSnake(str: any): any;
/**
 * Converts a string to kebab-case
 */
export declare function toKebab(str: any): any;
/**
 * Takes a JS object & returns new object w. keys either cammelCased (default) or
 * Returns new JS object w. all keys converted to kebab-case, or camelCase
 */
export declare function kebabKeys(obj: any): GenObj;
/**
 * Takes a flat object & returns new object w. keys camelCased
 * @param obj:GenObj
 * @return new GenObj w. keys appropriately cased.
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
 * @param point1 GenObj|Array - [lat,lon] or (preferably) {lat, lon}
 * @param point2 GenObj|Array - [lat,lon] or {lat, lon}
 * @return number - distance in meters
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
 * @param arrays[] - input arrays
 * @return array of all combinations
 */
export declare function cartesianProduct(...arrays: any[]): any;
//# sourceMappingURL=common-operations.d.ts.map