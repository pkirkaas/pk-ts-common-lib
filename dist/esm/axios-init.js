/**
 * Create new Axios instance, configured
 */
import axios from 'axios';
import { keysFromJson, } from './index.js';
export const axiosDefaults = {
    headers: {},
};
/**
Look into JST Auth Tokens:

"Authorization": `Bearer ${token}`,
*/
/**
 * Some settings to simplify creating axios settings
 */
export const axiosSettings = {
    /**
     * Just for Prisma/SQLite that don't support JSON data - automatically convert/parse
     * any data keys ending in '*JSON' from json string to JS object
     */
    keysFromJson: {
        transformResponse: (data) => {
            return keysFromJson(data);
        }
    },
    //CORS & JSON
    CORSJSON: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    },
    /*
    unsafe: { // Don't be picky about https during development
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    },
    */
};
export function createAxios(opts = {}) {
    let config = {};
    return axios.create(config);
}
/**
 * An axios error can have several forms/reasons (see: https://axios-http.com/docs/handling_errors)
 * with several handling cases. This simplifies & returns
 */
export function parseAxiosError(error) {
    let err = { config: error.config,
        message: error.message,
    };
    if (error.response) {
        let resp = error.response;
        err.data = resp.data;
        err.status = resp.status;
        err.headers = resp.headers;
    }
    else if (error.request) {
        err.request = error.request;
    }
    else {
        err.other = "General Axios Error";
    }
    return err;
}
//# sourceMappingURL=axios-init.js.map