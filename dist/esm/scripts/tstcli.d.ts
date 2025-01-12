/**
 * Not sure this should work...
 */
/**
 * Introspect a function
 */
export declare function intFnc(afnc: any): {
    toAfnc: String;
    jsToAfnc: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object";
    err: string;
    afncName?: undefined;
    afncStr?: undefined;
    afncLen?: undefined;
    afnDescs?: undefined;
} | {
    toAfnc: String;
    jsToAfnc: "function";
    afncName: any;
    afncStr: any;
    afncLen: any;
    afnDescs: {
        [x: string]: TypedPropertyDescriptor<any>;
    } & {
        [x: string]: PropertyDescriptor;
    };
    err?: undefined;
};
export declare let tstFncs: {
    tstIntFnc(): void;
    tstDPV(): void;
    tsta(): void;
    tstProps(): void;
    tstb(): void;
};
//# sourceMappingURL=tstcli.d.ts.map