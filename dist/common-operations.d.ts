import urlStatus from 'url-status-code';
import JSON5 from 'json5';
import { GenericObject, GenObj } from './index.js';
export { urlStatus, JSON5, GenericObject, GenObj };
/** NODE SPECIFIC
*/
/**
 * Returns stack trace as array
 * Error().stack returns a string. Convert to array
 * @param offset - optional - how many levels shift off
 * the top of the array
 * @retrun array stack
 */
export declare function getStack(offset?: number): any[];
/**
 * Return just the subset of the object, for keys specified in the "fields" array.
 */
export declare function subObj(obj: GenericObject, fields: string[]): GenObj;
/** Takes a 'duration' object for date-fns/add and validate
 * it. Optionall, converts to negative (time/dates in past)
 * @param obj object - obj to test
 * @param boolean forceNegative - force to negative/past offest?
 * @return duration
 */
export declare function validateDateFnsDuration(obj: any, forceNegative?: boolean): any;
/**
 * Returns true if arg str contains ANY of the what strings
 */
export declare function strIncludesAny(str: string, substrs: any): boolean;
export declare function isPromise(arg?: any): boolean;
/** From Mozilla - a stricter int parser */
export declare function filterInt(value: any): number | false;
/**
 * Takes a browser event & tries to get some info
 * Move this to browser library when the time comes
 */
export declare function eventInfo(ev: any): {};
export declare function JSON5Parse(str: string): any;
/** Try to make simple copies of complex objects (like with cyclic references)
 * to be storable in MongoDB
 * Primitives will just be returned unchanged.
 */
export declare function jsonClone(arg: any): any;
/**
 * Checks if the arg can be converted to a number
 * If not, returns boolean false
 * If is numeric:
 *   returns boolean true if asNum is false
 *   else returns the numeric value (which could be 0)
 * @param asNum boolean - if true,
 *
 */
export declare function isNumeric(arg: any, asNum?: boolean): number | boolean;
/**
 * Returns the numeric value, or boolean false
 */
export declare function asNumeric(arg: any): number | boolean;
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
export declare function pkToDate(arg: any): false | Date;
/**
 * Quick Format a date with single format code & date
 * @param string fmt - one of an array
 * @param dt - datable or if null now  - but - if invalid, though returns false
 */
export declare function dtFmt(fmt?: any, dt?: any): string;
/**
 * Return elements in arr1 Not In arr2
 */
export declare function inArr1NinArr2(arr1: any[], arr2: any[]): any[];
/**
 * Uniqe intersection of two arrays
 */
export declare function intersect(a?: any[], b?: any[]): any[];
/**
 * Compares arrays by VALUES - independant of order
 */
export declare function arraysEqual(a: any, b: any): boolean;
/**
 * Is 'a' a subset of 'b' ?
 */
export declare function isSubset(a: any, b: any): any;
export declare function isCli(report?: boolean): boolean;
export declare function rewriteHttpsToHttp(url: any): string;
/**
 * check single url or array of urls
 * if single url, return true/false
 * if array, return array of failed urls
 * TODO!! Doesn't accout for network errors, exceptions, etc!!
 * SEE below checkUrl3
 */
export declare function checkUrl(url: any): Promise<boolean | any[]>;
export declare function checkUrlAxios(tstUrl: any, full?: boolean): Promise<any>;
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
export declare function isEmpty(arg: any): boolean;
/**
 * returns arg, unless it is an empty object or array
 */
export declare function trueVal(arg: any): any;
/**
 * Arrays & Objects passed by referrence,
 * risk of unintended changes
 */
export declare function isByRef(arg: any): boolean;
export declare function isSimpleType(arg: any): boolean;
export declare function isPrimitive(arg: any): boolean;
/**
 * Tests if the argument is a "simple" JS object - with just keys
 * & values, not based on other types or prototypes
 */
export declare function isSimpleObject(anobj: any): boolean;
export declare function isObject(arg: any, alsoEmpty?: boolean): boolean;
/**
 * Try to get as many props from obj as possible
 */
export declare function allProps(obj: any): string[];
export declare function allPropsWithTypes(obj: any): GenObj;
export declare function objInfo(arg: any): {
    type: String;
    props: GenObj;
};
/**
 * Take input arrays, merge, & return single array w. unique values
 */
export declare function uniqueVals(...arrs: any[]): any[];
export declare function typeOf(anObj: any, opts?: any): String;
/**
 * Replace w. below when finished.
 */
export declare function getRand(arr: any[]): any;
/**
 * Gets cnt random unique elements of an array
 * Not the most efficient but it works
 * if cnt = 0, returns a single element, else an array of els
 */
export declare function getRandEls(arr: any[], cnt?: any): any;
/**
*/
/**
 * Retuns a random integer
 * @param numeric to - max int to return
 * @param numberic from default 0 - optional starting/min number
 * @return int
 */
export declare function randInt(to: any, from?: any): any;
/**
 * Lazy way to get type of multiple variables at once
 * @param simple object obj - collection of properties to type
 * @return object - keyed by the original keys, to type
 */
export declare function typeOfEach(obj: any): any;
export declare function valWithType(val: any): any;
/** Safe stringify - try first, then acycling */
export declare function JSON5Stringify(arg: any): any;
export declare function JSONStringify(arg: any): any;
/** Totally lifted from Axios - but they don't export it!
 * Takes an HTTP header string and objectifies it -
 * directives as keys
 * with values or undefined
 * @return object
 */
export declare function parseHeaderString(str: any): any;
//# sourceMappingURL=common-operations.d.ts.map