
//const urlStatus = require('url-status-code');
import  urlStatus  from 'url-status-code';
import  JSON5  from 'json5';
//const JSON5 = require('json5');
//linked?

//const _ = require("lodash");
import _  from "lodash";
import { v4 as uuidv4 } from "uuid";
import { PkError, GenericObject, GenObj } from './index.js';
//@ts-ignore
import jsondecycle from "json-decycle";
export { jsondecycle };
jsondecycle.extend(JSON5);

//import { default as JSON5 } from 'json5';
//import  JSON5  from 'json5';
import * as ESP from "error-stack-parser";
//const axios = require("axios");
//import { axios } from "Axios";
import  axios  from "axios";
import { format, isValid } from "date-fns";
export { urlStatus, JSON5, GenericObject, GenObj };
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
export function getStack(offset = 0) {
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

/**
 * Return just the subset of the object, for keys specified in the "fields" array.
 */
export function subObj(obj: GenericObject, fields: string[]) {
  let ret: GenObj = {};
  for (let field of fields) {
    ret[field] = obj[field];
  }
  return ret;
}

/** Takes a 'duration' object for date-fns/add and validate
 * it. Optionall, converts to negative (time/dates in past)
 * @param obj object - obj to test
 * @param boolean forceNegative - force to negative/past offest?
 * @return duration 
 */
export function validateDateFnsDuration(obj, forceNegative = false) {
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

/**
 * Returns true if arg str contains ANY of the what strings
 */
export function strIncludesAny(str: string, substrs: any) {
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


export function isPromise(arg?) {
  return !!arg && typeof arg === "object" && typeof arg.then === "function";
}
/** From Mozilla - a stricter int parser */
export function filterInt(value) {
  if (/^[-+]?(\d+|Infinity)$/.test(value)) {
    return Number(value);
  } else {
    //return NaN
    return false;
  }
}
/*
export function getEspStack() {
  let stack = ESP.parse(new Error());
  return stack;
}
*/

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
  return JSON5.parse(JSON5Stringify(arg));
}
/**
 * Checks if the arg can be converted to a number
 * If not, returns boolean false
 * If is numeric:
 *   returns boolean true if asNum is false
 *   else returns the numeric value (which could be 0)
 * @param asNum boolean - if true, 
 * 
 */

export function isNumeric(arg: any, asNum = false) {
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
 * returns the JS Date object,
 * NOTE: Unlike regulare JS :
 * 
 * let dtE = new Date(); //Now
 * let dtN = new Date(null); //Start of epoch
 * Valid arg values:
 *    null - returns new Date() - now
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
export function pkToDate(arg) {
  if (isNumeric(arg)) {
    arg = new Date(Number(arg));
  } else if (isEmpty(arg)) {
    arg = new Date();
  } else {
    arg = new Date(arg);
  }
  if ((arg instanceof Date) && isValid(arg)) {
    return arg;
  }
	return false;
}

/**
 * Quick Format a date with single format code & date
 * @param string fmt - one of an array
 * @param dt - datable or if null now  - but - if invalid, though returns false
 */
export function dtFmt(fmt?:any, dt?:any) {
  let fmts = {
    short:'dd-MMM-yy',
    dt: 'dd-MMM-yy KK:mm',
    dts: 'dd-MMM-yy KK:mm:ss',
    ts: 'KK:mm:ss',


  }
  let keys = Object.keys(fmts);
  if (!keys.includes(fmt)) {
    fmt = 'short';
  }
  dt = pkToDate(dt);
  if (dt === false) {
    return "FALSE";
  }
  let fullFmt = fmts[fmt];
  return format(dt, fullFmt);

}


//Array utilities


/**
 * Return elements in arr1 Not In arr2
 */
export function inArr1NinArr2(arr1: any[], arr2: any[]) {
  return arr1.filter((el) => !arr2.includes(el));
}

/**
 * Uniqe intersection of two arrays
 */
export function intersect(a?:any[], b?:any[]):any[] {
  var setB = new Set(b);
  return [...new Set(a)].filter(x => setB.has(x));
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
  a = [... new Set(a)];
  b = [... new Set(b)];
  return a.every((val) => b.includes(val));
}

export function isCli(report = false) {
  let runtime = process.env.RUNTIME;
  //let runtime = getRuntime();
  let lisCli = runtime === "cli";
  if (!lisCli && report) {
    console.error("WARNING - calling a CLI-ONLY function in a non-cli runtime:", { runtime });
  }
  console.log("In isCli; runtime:", { runtime, lisCli });
  return lisCli;
}

export function rewriteHttpsToHttp(url) {
  let parts = url.split(":");
  if (parts[0] === "https") {
    parts[0] = "http";
  }
  let newUrl = `${parts[0]}:${parts[1]}`;
  return newUrl;
}

/**
 * check single url or array of urls
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

  } else {
    let status = await urlStatus(url);
    if (status == 200) {
      return true;
    }
    return false;
  }
}


function mkUrl(url) {
	try {
		let urlObj = new URL(url);
		return urlObj;
	} catch (err) {
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
  } catch (err) {
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

export async function checkUrlAxios(tstUrl, full = false) {
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
  let fOpts: GenObj = {
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
  let resp: any;
  let lastErr: any;
  try {
    while (retries < maxRetries) {
      retries++;
      lastErr = null;
      //@ts-ignore
      try {
        resp = await axios(fOpts);
      } catch (err) {
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
      } else if (failCodes.includes(status)) {
        return false;
      } else if (retryCodes.includes(status)) {
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
    } else if (lastErr) { //Axios error!
      let toErr = typeOf(lastErr);
      let errKeys = Object.keys(lastErr);
      let sarg = { exception: { toErr, errKeys, lastErr, retries, tstUrl } };
      //lTool.snap({ err, retries, tstUrl });
      // console.log({ sarg });
      //lTool.snap(sarg);
      if (full) {
        return lastErr;
      }
      let ret: any;
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
  } catch (err) {
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
    let ret: any;
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
    //let toS = typeOf(status);
    //console.log(`checkUrl3 - toS: ${toS}; status:`, { status });
    if (status == 200) {
      return true;
    } else if (status > 300) {
      return false;
    }
    return status;
  } catch (err) {
    return { msg: `Exception for URL:`, url, err };

  }
}
//Returns false also for empty objects
export function isEmpty(arg) {
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

/**
 * returns arg, unless it is an empty object or array
 */
export function trueVal(arg) {
  if (!isEmpty(arg)) {
    return arg;
  }
}

/**
 * Arrays & Objects passed by referrence,
 * risk of unintended changes
 */
export function isByRef(arg: any):boolean {
  return !isPrimitive(arg);
}

export function isSimpleType(arg) {
  let simpletypes = ["boolean", "number", "bigint", "string"];
  let toarg = typeof arg;
  return simpletypes.includes(toarg);
}

export function isPrimitive(arg: any) {
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

export function isObject(arg, alsoEmpty = false) {
  if (!arg || isPrimitive(arg) || isEmpty(arg)) {
    return false;
  }
  return _.isObjectLike(arg);
}

/**
 * Try to get as many props from obj as possible
 */
export function allProps(obj: any) {
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

export function allPropsWithTypes(obj: any) {
  let props = allProps(obj);
  let ret: GenObj = {};
  for (let prop of props) {
    ret[prop] = typeOf(obj[prop]);
  }
  return ret;
}

/**
 * Take input arrays, merge, & return single array w. unique values
 */
export function uniqueVals(...arrs):any[] {
  let merged: any[] = [];
  for (let arr of arrs) {
    merged = [...merged, ...arr];
  }
  return Array.from(new Set(merged)); 
}

/* Use lodash isObject (excludes functions) or isObjectLike (includes functions)
export function isRealObject(anobj) {
  if (!anobj || typeof anobj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(anobj) === Object.getPrototypeOf({});
}
*/
//export function typeOf(anObj: any, level?: Number): String {
export function typeOf(anObj: any, opts?:any):String { //level?: Number): String {
  let level: any = null;
  let functionPrefix = 'function: ';
  let simplePrefix = 'simple ';
  if (isPrimitive(opts)) {
    level = opts;
  } else if (isSimpleObject(opts)) {
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
  } catch (err) {
    console.error("Error in typeOf:", err);
    return JSON.stringify({ err, anObj }, null, 2);
  }
}

/**
 * Replace w. below when finished.
 */
export function getRand(arr: any[]) {
  return arr[Math.floor((Math.random() * arr.length))];
}


/**
 * Gets cnt random unique elements of an array
 * Not the most efficient but it works
 * if cnt = 0, returns a single element, else an array of els
 */
export function getRandEls(arr: any[], cnt = null) {
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
*/

/**
 * Retuns a random integer
 * @param numeric to - max int to return
 * @param numberic from default 0 - optional starting/min number
 * @return int
 */
export function randInt(to:any, from:any = 0) {
	// Convert args to ints if possible, else throw
	//@ts-ignore
	if (isNaN((to = parseInt(to)) || isNaN((from = parseInt(from)))))  {
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
	let bRand = from + Math.floor((Math.random() * ((to + 1) - from)));
	return bRand;
}


/**
 * Lazy way to get type of multiple variables at once
 * @param simple object obj - collection of properties to type
 * @return object - keyed by the original keys, to type
 */
export function typeOfEach(obj) {
  if (!isSimpleObject(obj) || isEmpty(obj)) {
    console.error(`Bad obj param to typeOfEach - obj:`, { obj });
    return false;
  }
  let res: any = {};
  let keys = Object.keys(obj);
  for (let key of keys) {
    let val = obj[key];
    res[key] = typeOf(val);
  }
  return res;
}

export function valWithType(val: any): any {
  return { type: typeOf(val), val };
}

/** Safe stringify - try first, then acycling */
export function JSON5Stringify(arg) {
  try {
    return JSON5.stringify(arg, null, 2);
  } catch (e) {
    //@ts-ignore
    return JSON5.decycle(arg, null, 2);
  }
}

export function JSONStringify(arg) {
  /*
  if (arg === undefined) {
    return 'undefned';
  } else if (arg === null) {
    return 'null';
  }
  */
  try {
    return JSON.stringify(arg, null, 2);
  } catch (e) {
    //@ts-ignore
    return JSON.decycle(arg, null, 2);
  }
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