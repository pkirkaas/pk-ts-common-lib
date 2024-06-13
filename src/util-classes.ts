/**
	* Experimental implementation of Various utility classes
	* March 2023
	* Paul Kirkaas 
*/

import { GenObj, GenericObject, jsonClone, isObject, isSimpleObject, isPrimitive, isEmpty, isSubset, arraysEqual, inArr1NinArr2, intersect, typeOf, JSON5Stringify, } from './index.js';

/**
 * Initial placeholder for generic error class with more details than "Error"
 * 
 */
export class PkError extends Error {
	details?: any;
	extra?: any;
	constructor(msg:string, ...params) { //, details?: any, ...extra ) {
		let opts: any = null;
		if (Array.isArray(params) && params.length) { 
			if (isObject(params[0]) && params[0].cause) {// Assume params[0] is JS Error opts
				opts = params.shift();
			}
			if (Array.isArray(params) && params.length) { // JSON Stringify remaining params & add to msg
				msg = `${msg}\n${JSON5Stringify(params)}`;
			}
		}
		// JS Error constructor only uses opts if is an object with key 'cause'
		super(msg, opts);
		if (params.length) {
			this.details = params[0];
			params.shift();
		}
		if (params.length) {
			this.extra = params;
		}
	}
}