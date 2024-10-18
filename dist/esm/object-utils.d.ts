import { GenericObject } from './index.js';
export declare function deepMeld(...objs: any[]): GenericObject;
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
export declare function ajvSchema(schemaObj: object, opts?: {}): import("ajv").ValidateFunction<unknown>;
//# sourceMappingURL=object-utils.d.ts.map