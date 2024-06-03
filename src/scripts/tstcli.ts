/**
 * Not sure this should work...
 */

import {runCli} from 'pk-ts-node-lib';
import {toSnakeCase, toCamelCase, camelCase, snakeCase, kebabCase,
}from '../index.js';

export let tstFncs = {
  tsta() {
    let tstStrs = {
      pascal: "OrigPascalCased",
      snaked: "orig_snake_cased",
      kebabed: "orig-is-kebabed",
      camel: "origIsCamel",
    };
    //let ops = {toSnakeCase, toCamelCase}, ;
    let ops = {snakeCase, camelCase, kebabCase} ;
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
    console.log("In tstb");
  },
};

runCli(tstFncs);