"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHeaderString = exports.JSONStringify = exports.JSON5Stringify = exports.valWithType = exports.typeOfEach = exports.typeOf = exports.allProps = exports.isObject = exports.isSimpleObject = exports.isPrimitive = exports.isSimpleType = exports.trueVal = exports.isEmpty = exports.checkUrl3 = exports.checkUrlAxios = exports.checkUrl = exports.rewriteHttpsToHttp = exports.isCli = exports.intersect = exports.inArr1NinArr2 = exports.pkToDate = exports.asNumeric = exports.isNumeric = exports.jsonClone = exports.filterInt = exports.isPromise = exports.validateDateFnsDuration = exports.subObj = exports.getStack = void 0;
const urlStatus = require('url-status-code');
//import { JSON5 } from 'json5';
const JSON5 = require('json5');
//linked?
const _ = require("lodash");
const axios = require("axios");
const date_fns_1 = require("date-fns");
//const path = require("path/posix");
//const path = require("path/posix");
/** NODE SPECIFIC
*/
/**
 * Returns stack trace as array
 * Error().stack returns a string. Convert to array
 * @param offset - optional - how many levels shift off
 * the top of the array
 * @retrun array stack
 */
function getStack(offset = 0) {
    offset += 2;
    let stackStr = Error().stack;
    let stackArr = stackStr.split("at ");
    //console.log({ stackArr });
    stackArr = stackArr.slice(offset);
    let ret = [];
    for (let row of stackArr) {
        ret.push(row.trim());
    }
    return ret;
}
exports.getStack = getStack;
/**
 * Return just the subset of the object, for keys specified in the "fields" array.
 */
function subObj(obj, fields) {
    let ret = {};
    for (let field of fields) {
        ret[field] = obj[field];
    }
    return ret;
}
exports.subObj = subObj;
/** Takes a 'duration' object for date-fns/add and validate
 * it. Optionall, converts to negative (time/dates in past)
 * @param obj object - obj to test
 * @param boolean forceNegative - force to negative/past offest?
 * @return duration
 */
function validateDateFnsDuration(obj, forceNegative = false) {
    if (!isSimpleObject(obj) || isEmpty(obj)) {
        return false;
    }
    let dfnsKeys = [`years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`,];
    /*
    let objKeys = Object.keys(obj);
    let ret: any = {};
    */
    for (let key in obj) {
        if (!dfnsKeys.includes(key)) {
            return false;
        }
        if (forceNegative) {
            obj[key] = -Math.abs(obj[key]);
        }
        return obj;
    }
}
exports.validateDateFnsDuration = validateDateFnsDuration;
function isPromise(arg) {
    return !!arg && typeof arg === "object" && typeof arg.then === "function";
}
exports.isPromise = isPromise;
/** From Mozilla - a stricter int parser */
function filterInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value);
    }
    else {
        //return NaN
        return false;
    }
}
exports.filterInt = filterInt;
/*
export function getEspStack() {
  let stack = ESP.parse(new Error());
  return stack;
}
*/
/** Try to make simple copies of complex objects (like with cyclic references)
 * to be storable in MongoDB
 * Primitives will just be returned unchanged.
 */
function jsonClone(arg) {
    if (!arg || typeof arg !== "object" || isPrimitive(arg)) {
        return arg;
    }
    return JSON5.parse(JSON5Stringify(arg));
}
exports.jsonClone = jsonClone;
/**
 * Checks if the arg can be converted to a number
 * If not, returns boolean false
 * If is numeric:
 *   returns boolean true if asNum is false
 *   else returns the numeric value (which could be 0)
 * @param asNum boolean - if true,
 *
 */
function isNumeric(arg, asNum = false) {
    let num = Number(arg);
    if (num !== parseFloat(arg)) {
        return false;
    }
    if (asNum) {
        return num;
    }
    return true;
}
exports.isNumeric = isNumeric;
/**
 * Returns the numeric value, or boolean false
 */
function asNumeric(arg) {
    return isNumeric(arg, true);
}
exports.asNumeric = asNumeric;
/**
 * If arg can be in any way be interpreted as a date,
 * returns the JS Date object,
 * Valid arg values:
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
 */
function pkToDate(arg) {
    if (isNumeric(arg)) {
        arg = new Date(Number(arg));
    }
    else {
        arg = new Date(arg);
    }
    if ((arg instanceof Date) && (0, date_fns_1.isValid)(arg)) {
        return arg;
    }
    return false;
}
exports.pkToDate = pkToDate;
/**
 * Return elements in arr1 Not In arr2
 */
function inArr1NinArr2(arr1, arr2) {
    return arr1.filter((el) => !arr2.includes(el));
}
exports.inArr1NinArr2 = inArr1NinArr2;
/**
 * Uniqe intersection of two arrays
 */
function intersect(a, b) {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}
exports.intersect = intersect;
function isCli(report = false) {
    let runtime = process.env.RUNTIME;
    //let runtime = getRuntime();
    let lisCli = runtime === "cli";
    if (!lisCli && report) {
        console.error("WARNING - calling a CLI-ONLY function in a non-cli runtime:", { runtime });
    }
    console.log("In isCli; runtime:", { runtime, lisCli });
    return lisCli;
}
exports.isCli = isCli;
function rewriteHttpsToHttp(url) {
    let parts = url.split(":");
    if (parts[0] === "https") {
        parts[0] = "http";
    }
    let newUrl = `${parts[0]}:${parts[1]}`;
    return newUrl;
}
exports.rewriteHttpsToHttp = rewriteHttpsToHttp;
/**
 * check single url or array of urls
 * if single url, return true/false
 * if array, return array of failed urls
 * TODO!! Doesn't accout for network errors, exceptions, etc!!
 * SEE below checkUrl3
 */
async function checkUrl(url) {
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
exports.checkUrl = checkUrl;
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
async function checkUrlAxios(tstUrl, full = false) {
    //let lTool = new LogTool({context: 'checkUrlStatus'});
    //  let lTool = LogTool.getLog('chkStatA', { context: 'checkUrlAxios' });
    let failCodes = [404, 401, 403, 404]; // Return immediate false
    let retryCodes = [408, 429,]; // Try again
    let notAllowed = 405;
    /*
    let fOpts:GenObj = {
      method: "HEAD",
      cache: "no-cache",
      headers: {
      },
      connection: "close",
    };
    */
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
        //lTool.snap(ret);
        return ret;
        //console.log({ resp, respKeys });
        //console.log({  toResp, status, respKeys });
    }
    catch (err) {
        console.error("WE SHOULDN'T BE HERE!!", err);
        let toErr = typeOf(err);
        let errKeys = Object.keys(err);
        let sarg = { UnexpecteException: { toErr, errKeys, err, retries, tstUrl } };
        //lTool.snap({ err, retries, tstUrl });
        // console.log({ sarg });
        //lTool.snap(sarg);
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
exports.checkUrlAxios = checkUrlAxios;
/*
//Deprecated!
async function checkUrlStatus(tstUrl) {
  let fOpts = {
    method: "HEAD",
    cache: "no-cache",
    headers: {
    },
    connection: "close",
  };
  let url = mkUrl(tstUrl);
  if (!(url instanceof URL)) {
    return { err: tstUrl };
  }
  //let href = url.href;
  try {
    let resp = await fetch(tstUrl, fOpts);

    //console.log("Fetch success resp:", { resp, tstUrl });
    let status = resp.status;
    if (status === 200) {
      return true;
    } else if (status > 400) {
      return false;
    } else {
      return `code: [${resp.code}]; status: [${resp.status}]`;
    }
  } catch (err) {
    //console.log("Fetch err:", { tstUrl, err });
    return err.cause.code;
    let ekeys = Object.keys(err);
    //return err.code;
    return ekeys;
  }
}
*/
/**
 * Tri-state check - to account for failed checks -
 * @return boolean|other
 * If "true" - good URL
 * If "false" - 404 or something - but GOT A STATUS!
 * IF other - who knows? bad domain, invalid URL, network error,...
 *
 *
 */
async function checkUrl3(url) {
    try {
        let status = await urlStatus(url);
        //let toS = typeOf(status);
        //console.log(`checkUrl3 - toS: ${toS}; status:`, { status });
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
exports.checkUrl3 = checkUrl3;
//Returns false also for empty objects
function isEmpty(arg) {
    if (!arg || (Array.isArray(arg) && !arg.length)) {
        return true;
    }
    if (typeof arg === "object") {
        if (!Object.keys(arg).length) {
            return true;
        }
    }
    return false;
}
exports.isEmpty = isEmpty;
/**
 * returns arg, unless it is an empty object or array
 */
function trueVal(arg) {
    if (!isEmpty(arg)) {
        return arg;
    }
}
exports.trueVal = trueVal;
function isSimpleType(arg) {
    let simpletypes = ["boolean", "number", "bigint", "string"];
    let toarg = typeof arg;
    return simpletypes.includes(toarg);
}
exports.isSimpleType = isSimpleType;
function isPrimitive(arg) {
    return arg !== Object(arg);
}
exports.isPrimitive = isPrimitive;
/**
 * Tests if the argument is a "simple" JS object - with just keys
 * & values, not based on other types or prototypes
 */
function isSimpleObject(anobj) {
    if (!anobj || typeof anobj !== "object") {
        return false;
    }
    return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
exports.isSimpleObject = isSimpleObject;
function isObject(arg, alsoEmpty = false) {
    if (!arg || isPrimitive(arg) || isEmpty(arg)) {
        return false;
    }
    return _.isObjectLike(arg);
}
exports.isObject = isObject;
function allProps(obj) {
    if (!isObject(obj)) {
        return [];
    }
    let allProps = new Set(Object.getOwnPropertyNames(obj));
    while (obj = Object.getPrototypeOf(obj)) {
        let keys = Object.getOwnPropertyNames(obj);
        for (let key of keys) {
            allProps.add(key);
        }
    }
    let unique = Array.from(allProps);
    return unique;
}
exports.allProps = allProps;
/* Use lodash isObject (excludes functions) or isObjectLike (includes functions)
export function isRealObject(anobj) {
  if (!anobj || typeof anobj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
*/
//export function typeOf(anObj: any, level?: Number): String {
function typeOf(anObj, opts) {
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
            let name = anObj.name;
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
            //let ret = "Type: Simple Object";
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
        let ret = `${anObj.constructor.name}`;
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
exports.typeOf = typeOf;
/**
 * Lazy way to get type of multiple variables at once
 * @param simple object obj - collection of properties to type
 * @return object - keyed by the original keys, to type
 */
function typeOfEach(obj) {
    if (!isSimpleObject(obj) || isEmpty(obj)) {
        console.error(`Bad obj param to typeOfEach - obj:`, { obj });
        return false;
    }
    let res = {};
    let keys = Object.keys(obj);
    for (let key of keys) {
        let val = obj[key];
        res[key] = typeOf(val);
    }
    return res;
}
exports.typeOfEach = typeOfEach;
function valWithType(val) {
    return { type: typeOf(val), val };
}
exports.valWithType = valWithType;
/** Safe stringify - try first, then acycling */
function JSON5Stringify(arg) {
    try {
        return JSON5.stringify(arg, null, 2);
    }
    catch (e) {
        //@ts-ignore
        return JSON5.decycle(arg, null, 2);
    }
}
exports.JSON5Stringify = JSON5Stringify;
function JSONStringify(arg) {
    /*
    if (arg === undefined) {
      return 'undefned';
    } else if (arg === null) {
      return 'null';
    }
    */
    try {
        return JSON.stringify(arg, null, 2);
    }
    catch (e) {
        //@ts-ignore
        return JSON.decycle(arg, null, 2);
    }
}
exports.JSONStringify = JSONStringify;
/** Totally lifted from Axios - but they don't export it!
 * Takes an HTTP header string and objectifies it -
 * directives as keys
 * with values or undefined
 * @return object
 */
function parseHeaderString(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while ((match = tokensRE.exec(str))) {
        tokens[match[1]] = match[2];
    }
    return tokens;
}
exports.parseHeaderString = parseHeaderString;
//# sourceMappingURL=common-operations.js.map