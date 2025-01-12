/**
 * Not sure this should work...
 */
import { runCli } from 'pk-ts-node-lib';
import { toCamel, toSnake, toKebab, kebabKeys, camelKeys, dotPathVal, allProps, typeOf, inspectFunction, } from '../index.js';
/**
 * Introspect a function
 */
export function intFnc(afnc) {
    let jsToAfnc = typeof afnc;
    let toAfnc = typeOf(afnc);
    if (jsToAfnc !== 'function') {
        return {
            toAfnc, jsToAfnc,
            err: `Not a function: ${afnc}`,
        };
    }
    let afncName = afnc?.name;
    let afncStr = afnc?.toString();
    let afncLen = afnc?.length;
    let afnDescs = Object.getOwnPropertyDescriptors(afnc);
    //console.log(`Fnc Introspection:`, {toAfnc, jsToAfnc, afncName, afncStr, afncLen, afnDescs});
    return { toAfnc, jsToAfnc, afncName,
        afncStr,
        afncLen, afnDescs };
}
export let tstFncs = {
    tstIntFnc() {
        let tstFnc = allProps;
        //let tstFnc = "A dog";
        //let tstFnc = {me:"A dog", days:7};
        //let intRes = intFnc(tstFnc);
        let intRes = inspectFunction(tstFnc);
        console.log(`tstIntFnc`, { intRes });
    },
    tstDPV() {
        let tstOb = {
            a: {
                b: {
                    c: ['aV', 'bV', 'cV'],
                }
            },
            c: {},
        };
        let tsPA = ['a', 'b.c'];
        let dpV = dotPathVal(tstOb, tsPA);
        console.log(`tstDPV`, { dpV });
    },
    tsta() {
        let tstStrs = {
            // pascal: "OrigPascalCased",
            snaked: "orig_snake_cased",
            kebabed: "orig-is-kebabed",
            camel: "origIsCamel",
            weirdKey: "& : > table",
        };
        //let ops = {toSnakeCase, toCamelCase}, ;
        //let ops = {snakeCase, camelCase, kebabCase} ;
        let ops = { toCamel, toSnake, toKebab, };
        let res = {};
        let resArr = [];
        for (let key in tstStrs) {
            let orig = tstStrs[key];
            let resObj = { orig };
            for (let opk in ops) {
                let op = ops[opk];
                resObj[opk] = op(orig);
            }
            resArr.push(resObj);
        }
        console.log("In tsta", resArr);
    },
    tstProps() {
        console.log("Testing new allProps");
        let pr = allProps(tstFncs, "tvp", 4);
        console.log("In tstProps", pr);
    },
    tstb() {
        let keyTst = {
            kebObj: {
                'a-k-key': "a-k-val",
                aCamelKey: "aCamelVal",
            },
            camelObj: {
                camelKeyInCamelObj: "some value",
                "kebab-key-in-camel": "Another other val",
                "weird > & key": "Some day soon...",
            },
        };
        let ops = { kebabKeys, camelKeys };
        let resArr = [];
        for (let key in keyTst) {
            let orig = keyTst[key];
            let resObj = { orig };
            for (let opk in ops) {
                let op = ops[opk];
                resObj[opk] = op(orig);
            }
            resArr.push(resObj);
        }
        console.log("In tstb w. runCLI", resArr);
    },
};
runCli(tstFncs);
//tstFncs.tstb();
//tstFncs.tstDPV();
//# sourceMappingURL=tstcli.js.map