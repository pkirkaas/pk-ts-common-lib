

import {getAncestorArr, getPrototypeChain, isSubclassOf, typeOf, } from '../index.js'; 

const A = class   {
  constructor(extra) {
    this.dog = "Sarah";
    this.cat = "Donald";
    this.whatever = extra;
  }
};