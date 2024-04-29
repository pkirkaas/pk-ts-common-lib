/**
 * Testing sublcasses, etc
 */

import {getAncestorArr, getPrototypeChain, isSubclassOf, typeOf, isInstance, typeOfEach, } from '../index.js'; 

const A = class   {
  dog?: any;
  cat?: any;
  whatever?: any;

  constructor(extra?:any) {
    this.dog = "Sarah";
    this.cat = "Donald";
    this.whatever = extra;
  }
};

class B extends A {
  tiger?:any;
  constructor(extra?:any, another?:any) {
    super(extra);
    this.tiger = another;
  }
}

class C extends B {
  somec?:any;
  constructor(newf?:any) {
    super('happy', 'sad');
    this.somec = newf;
  }
}

let c = new C("Roger");

let cConst = c.constructor;
let cPtype = Object.getPrototypeOf(c);
let cPC = cPtype.constructor;

let cc = new cPC('rabbit');
// @ts-ignore
let cd = new cConst('Regular');
let csuba = isSubclassOf(C,A);
let csubab = isSubclassOf(C,A,1);

let types = typeOfEach({A,B,C,c, cConst, cPtype, cPC, cc, cd });

let cinsta = c instanceof A;

console.log({types, csuba, csubab, cinsta, cc, cd});
