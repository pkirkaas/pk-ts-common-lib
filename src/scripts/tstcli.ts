/**
 * Not sure this should work...
 */

import {runCli, stdOut,} from 'pk-ts-node-lib';
import {toSnakeCase, JSON5Stringify, toCamelCase, camelCase, snakeCase, kebabCase, toCamel,  toSnake, toKebab, 
  kebabKeys, camelKeys, dotPathVal, allProps, allPropsWithTypes, objInfo, getObjDets, getProps,
  typeOf, inspectFunction, JSON5Parse,  JSON5, GenObj,
}from '../index.js';

let tstObj = {
  a: {
    b: { c: ['aV','bV','cV'], }
  },
  ameth(arg) {
    return arg;
  }, 
  c: { },
  y: "A dog",
};
export let tstFncs = {
  tstCycle() {
    console.log('tstCycle');
    let tstObj: GenObj = {
      a:"A dog",
      b: {
        c: ['aV','bV','cV'],
      }
    };
    tstObj.cycle = tstObj;
    let j5Str = JSON5Stringify(tstObj);
    let j5Obj = JSON5Parse(j5Str);
    //let parsed = j5Obj.cycle.a;
    let parsed = j5Obj.cycle.cycle.a;
    console.log(`tstCycle`, {tstObj, j5Str, j5Obj, parsed,});
  },

  tstAllProps() {
    //let res = allProps(tstObj,"tvp",3);
    let res = allProps(tstObj,"tv",3);
    console.log(`tstAllProps`, {res});
    stdOut(JSON5Stringify(res));
  },
  tstIntFnc() {
    let tstFnc = allProps;
    //let tstFnc = "A dog";
    //let tstFnc = {me:"A dog", days:7};

    //let intRes = intFnc(tstFnc);
    let intRes = inspectFunction(tstFnc);
    console.log(`tstIntFnc`, {intRes});
  },
  tstDPV() {
    let tstOb = {
      a: {
        b: {
          c: ['aV','bV','cV'],
        }
      },
      c: {
      },
    };

    let tsPA = ['a','b.c'];
    let dpV = dotPathVal(tstOb, tsPA);
    console.log(`tstDPV`,{dpV});
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
    let ops = {toCamel,  toSnake, toKebab, };
    let res = {};
    let resArr = [];
    for (let key in tstStrs) {
      let orig = tstStrs[key];
      let resObj = {orig}
      for (let opk in ops) {
        let op = ops[opk];
        resObj[opk]=op(orig);
      }
      resArr.push(resObj);
    }
    console.log("In tsta", resArr);
  },
  tstProps() {
    console.log("Testing new allProps");
    let pr = allProps(tstFncs,"tvp",4);
    console.log("In tstProps", pr);
  },
  tstb() {
    let keyTst = {
      kebObj: { 
        'a-k-key':"a-k-val",
        aCamelKey: "aCamelVal",
      },
      camelObj: {
        camelKeyInCamelObj:"some value",
        "kebab-key-in-camel": "Another other val",
        "weird > & key":"Some day soon...",
      },
    };
    let ops = {kebabKeys, camelKeys};
    let resArr = [];
    for (let key in keyTst) {
      let orig = keyTst[key];
      let resObj = {orig}
      for (let opk in ops) {
        let op = ops[opk];
        resObj[opk]=op(orig);
      }
      resArr.push(resObj);
    }
    console.log("In tstb w. runCLI", resArr);
  },
};

runCli(tstFncs);
//tstFncs.tstb();
//tstFncs.tstDPV();