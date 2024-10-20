/**
 * @library - pk-ts-common
 * @file - common-operations.ts
 * @fileoverview - Library of `ES2022` TypeScript/JavaScript utility functions for use in both Node.js & browser environments.
 */
import urlStatus from 'url-status-code';
import JSON5 from 'json5';
import path from 'path';
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
//export { urlStatus, JSON5, GenericObject, GenObj };
export { urlStatus, JSON5, };
/**
 * Check if running in commonJS or ESM Module env.
 * TOTALLY UNTESTED - CODE FROM BARD -in 2023
 * But it finally compiles in tsc for each target - commonjs & esm - try testing !!
 */
export function isESM() {
    return typeof module === 'object'
        && module.exports
        && typeof Symbol !== 'undefined'
        && String(Symbol.toStringTag) === 'Module';
}
export function isCommonJS() {
    return typeof module !== 'undefined'
        && typeof module.exports === 'object';
}
//Start  Stack examination section  
/**
 * Returns stack trace as array
 * Error().stack returns a string. Convert to array
 * @param offset - optional - how many levels shift off
 * the top of the array
 * @retrun array stack
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
 *	Generates a timestamp string with basic info for console logging.
 * @param entry (any) - Optional parameter representing additional information to include in the timestamp. Default value is undefined
 * @param frameAfter (any) - Optional parameter specifying a function name or array of function names to skip when determining the stack frame. Default value is undefined.
 * @return String A formatted timestamp string including the specified entry, file name, function name, and line numberstring
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
 *  Retrieves the stack frame after a specified function.
 * @param fname (string|array) - The name of the function or an array of function names to skip when determining the stack frame. Default value is undefined.
 @param   forceFunction (boolean) - Optional parameter indicating whether to force the retrieval of a function name even if it matches one in the exclude list. Default value is false.

 @return Object - An object containing the file name, function name, and line number of the stack frame after the specified function.
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
 * Return just the subset of the object, for keys specified in the "fields" array.
 * ACTUAALLY - can be deep -
 * @param obj - src object
 * @param fields mixed array of string keys, or object with single key field with array of fields - called recursively
 * @return object - specified subset of object
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
export const dfnsKeys = [`years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`,];
/** Takes a 'duration' object for date-fns/add and validate
 * it. Optionall, converts to negative (time/dates in past)
 * @param obj object - obj to test
 * //@param boolean forceNegative - force to negative/past offest?
 * @return duration
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
 * Returns true if arg str contains ANY of the what strings
 */
export function strIncludesAny(str, substrs) {
    if (!Array.isArray(substrs)) {
        substrs = [substrs];
    }
    for (let substr of substrs) {
        if (str.includes(substr)) {
            return true;
        }
    }
    return false;
}
/**
 * Checks if a given argument is a Promise.
 * @param arg - The argument to check.
 * @return - boolean true if arg is a Promise, else false
 */
export function isPromise(arg) {
    return !!arg && typeof arg === "object" && typeof arg.then === "function";
}
/** From Mozilla - a stricter int parser */
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
 */
export function asNumeric(arg) {
    return isNumeric(arg, true);
}
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
export function pkToDate(arg) {
    if (isNumeric(arg)) {
        arg = new Date(Number(arg));
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
 * Object for date-fns formats, with simple keys
 */
export const dtFnsFormats = {
    html: "yyyy-MM-dd",
    sqldt: "yyyy-MM-dd HH:mm:ss",
    short: 'dd-MMM-yy',
    dt: 'dd-MMM-yy KK:mm',
    dts: 'dd-MMM-yy KK:mm:ss',
    ts: 'KK:mm:ss',
};
/**
 * Quick Format a date with single format code & date
 * @param fmt string - a key to pre-defined dtFnsFormats or dtfns format str
 * @param dt - datable or null for "now"
 * @return string|false - Formatted date string, or false if dt is invalid
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
 */
export function inArr1NinArr2(arr1, arr2) {
    return arr1.filter((el) => !arr2.includes(el));
}
/**
 * Uniqe intersection of two arrays
 */
export function intersect(a, b) {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}
/**
 * Returns array with all strings in array converted to lower case
 */
export function arrayToLower(arr) {
    return arr.map((e) => (typeof e === 'string') ? e.toLowerCase() : e);
}
/**
 * Compares arrays by VALUES - independant of order
 */
export function arraysEqual(a, b) {
    return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}
/**
 * Is 'a' a subset of 'b' ?
 */
export function isSubset(a, b) {
    a = [...new Set(a)];
    b = [...new Set(b)];
    return a.every((val) => b.includes(val));
}
/**
 * Takes an array and an element, returns a new array with
 * the element inserted between each element of the original array.
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
 *
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
 * Checks if the argument is "Empty" - null, undefined, empty string, empty array, empty object
 * This is a tough call & really hard to get right...
 * @param arg - argument to test
 * @return boolean - true if empty, false if not empty
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
 * returns arg, unless it is an empty object or array
 */
export function trueVal(arg) {
    if (!isEmpty(arg)) {
        return arg;
    }
}
/**
 * Checks if the argument has values by reference (array, object, etc)
 * Arrays & Objects passed by referrence,
 * risk of unintended changes
 */
export function isByRef(arg) {
    return !isPrimitive(arg);
}
/**
 * Checks if the argument is a "simple" JS type - boolean, number, string, bigint
 */
export function isSimpleType(arg) {
    let simpletypes = ["boolean", "number", "bigint", "string"];
    let toarg = typeof arg;
    return simpletypes.includes(toarg);
}
/**
 * Checks if the argument is a "primitive" JS type - boolean, number, string, bigint, null, undefined, ...
 */
export function isPrimitive(arg) {
    return arg !== Object(arg);
}
/**
 * Tests if the argument is a "simple" JS object - with just keys
 * & values, not based on other types or prototypes
 */
export function isSimpleObject(anobj) {
    if (!anobj || typeof anobj !== "object") {
        return false;
    }
    return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
/**
 * Checks if the argument is an object -
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
// Start Object analysis fncs
/** Try to make simple copies of complex objects (like with cyclic references)
 * to be storable in MongoDB
 * Primitives will just be returned unchanged.
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
 * @return - false, or {constructor, className}
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
 * If 'p' - a parsed, readable value
 * If 't' - the value type

 * If none of t,v, or p  just array of props

 * If at least one of t,v,p, abject {prop:{value,type,parsed}

 * If f - FULL property details. Default: filter out uninteresting props
 *
 * @param int depth - how many levels should it go?
 */
export function allProps(obj, opt = 'tvp', depth = 6) {
    //export function allProps(obj: any, { dets = 'p', filter = true }: { dets?: string, filter?: boolean } = {}) {
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
        let filter = !opts.includes('f');
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
export function allPropsP(obj, opts = {}) {
    let opt = opts.opt || 'tvp';
    let depth = opts.depth || 3;
    return allProps(obj, opt, depth);
}
export function allPropsWithTypes(obj, depth = 6) {
    return allProps(obj, 't', depth);
}
export function objInfo(arg, opt = 'tpv', depth = 6) {
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
 * Returns the type of the argument. If it's an object, it returns the name of the constructor.
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
 * Lazy way to get type of multiple variables at once with typeOf
 * @param simple object obj - collection of properties to type
 * @return object - keyed by the original keys, to type
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
export function valWithType(val) {
    return { type: typeOf(val), val };
}
/**
 * Returns true if arg is string & can be JSON parsed
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
 * Returns true if arg is string & can be JSON5 parseable
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
export function JSONParse(str) {
    return JSON.retrocycle(str);
}
/**
 * Experiment with Use retrocycle to parse
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
/** Safe stringify -
 * Experiment with just decycle for all stringify
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
 * @param objs - unlimited number of input objects
 * @return object - a new object with the input objects merged,
 *   and arrays concatenated
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
 */
export function uniqueVals(...arrs) {
    let merged = [];
    for (let arr of arrs) {
        merged = [...merged, ...arr];
    }
    return Array.from(new Set(merged));
}
/**
 * Return random element of array
 */
export function getRand(arr) {
    return arr[Math.floor((Math.random() * arr.length))];
}
/**
 * Gets cnt random unique elements of an array
 * Not the most efficient but it works
 * if cnt = 0, returns a single element, else an array of els
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
 */
export function stripStray(str) {
    if (!str || typeof str !== 'string') {
        return null;
    }
    str = str.replaceAll(/['" ]/g, '');
    return str;
}
/**
 * Converts a string to camelCase
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
 */
export function kebabKeys(obj) {
    return recursiveKeyConversion(obj, toKebab);
}
/**
 * Takes a flat object & returns new object w. keys camelCased
 * @param obj:GenObj
 * @return new GenObj w. keys appropriately cased.
 */
export function camelKeys(obj) {
    return recursiveKeyConversion(obj, toCamel);
}
/**
 * Takes a JS object & returns new object w. keys converted, as defined by converstionFunction
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
 * @param point1 GenObj|Array - [lat,lon] or (preferably) {lat, lon}
 * @param point2 GenObj|Array - [lat,lon] or {lat, lon}
 * @return number - distance in meters
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
 * @param arrays[] - input arrays
 * @return array of all combinations
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