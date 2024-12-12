import { GenObj } from './index.js';
export declare const axiosDefaults: {
    headers: {};
};
/**
Look into JST Auth Tokens:

"Authorization": `Bearer ${token}`,
*/
/**
 * Some settings to simplify creating axios settings
 */
export declare const axiosSettings: {
    /**
     * Just for Prisma/SQLite that don't support JSON data - automatically convert/parse
     * any data keys ending in '*JSON' from json string to JS object
     */
    keysFromJson: {
        transformResponse: (data: any) => any;
    };
    CORSJSON: {
        headers: {
            'Access-Control-Allow-Origin': string;
            'Content-Type': string;
            Accept: string;
        };
    };
};
export declare function createAxios(opts?: GenObj): import("axios").AxiosInstance;
/**
 * An axios error can have several forms/reasons (see: https://axios-http.com/docs/handling_errors)
 * with several handling cases. This simplifies & returns
 */
export declare function parseAxiosError(error: any): GenObj;
//# sourceMappingURL=axios-init.d.ts.map