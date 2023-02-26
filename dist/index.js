/** Init shared by MongoQP-api & MongoQP-client */
//export const axios = require('axios');
//export const axios = require('axios');
import axios from 'axios';
export * from 'axios';
import jsondecycle from 'json-decycle';
export * from 'json-decycle';
//export { jsondecycle };
//export const JSON5 = require('json5');
//export JSON5 from 'json5';
/*
import JSON5 from 'json5';
export JSON5;
*/
export { axios, jsondecycle };
//@ts-ignore
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
};
export * from './common-operations.js';
//# sourceMappingURL=index.js.map