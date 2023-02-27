/** Init shared by MongoQP-api & MongoQP-client */
//export const axios = require('axios');
//export const axios = require('axios');
import axios from 'axios';
//export * from 'axios';
//import jsondecycle from 'json-decycle';
//export * from 'json-decycle';
//export { jsondecycle };
//export const JSON5 = require('json5');

//export JSON5 from 'json5';


/*
import JSON5 from 'json5';
export JSON5;
*/
//export { axios, jsondecycle };
//require("json-decycle").extend(JSON5);
 //const jsondecycle = require("json-decycle");
/*
import { extend } from "json-decycle";
extend(JSON5);
*/
export type OptArrStr = string | string[];
export type Falsy  = false | 0 | "" | null | undefined;
export type GenericObject  =  { [key: string]: any };
export type GenObj  =  { [key: string]: any };
declare global {
    interface Array<T> {
        readonly random: any;
    }
}
//@ts-ignore
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

export * from './common-operations.js';