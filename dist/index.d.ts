/** Init shared by MongoQP-api & MongoQP-client */
export declare const axios: any;
export declare const JSON5: any;
export declare const jsondecycle: any;
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
export * from './common-operations';
//# sourceMappingURL=index.d.ts.map