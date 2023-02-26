/** Init shared by MongoQP-api & MongoQP-client */
import axios from 'axios';
export * from 'axios';
import jsondecycle from 'json-decycle';
export * from 'json-decycle';
export { axios, jsondecycle };
export type OptArrStr = string | string[];
export type Falsy = false | 0 | "" | null | undefined;
export type GenericObject = {
    [key: string]: any;
};
export type GenObj = {
    [key: string]: any;
};
declare global {
    interface Array<T> {
        readonly random: any;
    }
}
export * from './common-operations.js';
//# sourceMappingURL=index.d.ts.map