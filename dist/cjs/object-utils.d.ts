/**
 * Experimental implementation of specialized object utilities - like deep merge, with arrays combined
 * March 2023
 * Paul Kirkaas
 *
 */
import { Ajv } from 'ajv';
import { GenericObject } from './index.js';
export declare function deepMeld(...objs: any[]): GenericObject;
/**
 * JSON Schema validator
 * @param schemaObj - a JSON Schema?
 * @return ajv instance, compiled from JSON Schema object -
 * has validate method for data, and errors property
 * Throws exception if input JSON Schema object invalid schema
 */
export declare function ajvSchema(schemaObj: object, opts?: {}): Ajv;
//# sourceMappingURL=object-utils.d.ts.map