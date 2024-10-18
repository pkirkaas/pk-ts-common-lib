/**
 * Experimental implementation of specialized object utilities - like deep merge, with arrays combined
 * March 2023
 * Paul Kirkaas 
 * 
 */
import {Ajv,} from 'ajv'; //JSON Schema support
import draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json'  with { type: 'json' };

import { GenObj, uniqueVals, PkError, GenericObject, jsonClone, isObject, isSimpleObject, isPrimitive,  isEmpty, isSubset, arraysEqual, inArr1NinArr2, intersect, typeOf } from './index.js';

export function deepMeld(...objs): GenericObject {
	let melded: GenObj = {};
	for (let obj of objs) {
		if (!isObject(obj)) {
			let too = typeOf(obj);
			let msg = `Argument to deepMeld is not an object: Type: [${too}]`;
			throw new PkError(msg, { obj });
		}
		for (let key in obj) {
			let val = obj[key];
			if (!(key in melded) || isPrimitive(val)) {
				melded[key] = val;
				continue;
			}
			let mval = melded[key]; // How to meld depending on type
			if (Array.isArray(val) && Array.isArray(mval)) {
				melded[key] = uniqueVals(mval, val);
				continue;
			}
			if (isObject(val) && isObject(mval)) {
				melded[key] = deepMeld(mval, val);
				continue;
			}
			melded[key] =  val;
		}
	}

	return melded;
}

/**
 * JSON Schema validator
 * @param schemaObj - a JSON Schema?
 * @return function validate - a function to use the schema to validate data.
 * The `validate` function accepts data and returns true/false - if false, the
 * errors are in `validate.errors` property
 * 
 * // NO - ajv instance, compiled from JSON Schema object - 
 * has validate method for data, and errors property
 * Throws exception if input JSON Schema object invalid schema
 */
export function ajvSchema(schemaObj:object,opts={}) { //use compile
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strictSchema: true, // Set to true for stricter validation
    ...opts,
  });
  if (!schemaObj['$schema']) {
    ajv.addMetaSchema(draft7MetaSchema);
  }
  const isValidSchema = ajv.validateSchema(schemaObj);
  if (!isValidSchema) {
    throw new PkError(`Schema failed validation w. errors:`,ajv.errors);
  }
  let validate = ajv.compile(schemaObj);
  return validate;
  //return ajv;
}
