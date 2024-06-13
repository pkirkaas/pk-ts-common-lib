/**
 * Not sure this should work...
 */

//import {runCli} from 'pk-ts-node-lib';
import {toSnakeCase, toCamelCase, camelCase, snakeCase, kebabCase, toCamel,  toSnake, toKebab, 
  kebabKeys, camelKeys, dotPathVal,
}from '../index.js';

export let tstFncs = {
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
    console.log("In tstb", resArr);
  },
};

//runCli(tstFncs);
//tstFncs.tstb();
tstFncs.tstDPV();