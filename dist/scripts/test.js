import { typeOf, jsondecycle, JSON5, isSubset } from '../index.js';
let tobj = { a: 8 };
let isDist = false;
let j5 = JSON5.stringify(tobj);
let to = typeOf(tobj);
let toJ = typeOf(JSON);
let toJ5 = typeOf(JSON5);
let arr1 = ['a', 'b', 'c'];
let arr2 = ['a', 'b'];
let asub = isSubset(arr2, arr1);
console.log("Testing tests", { tobj, to, j5, jsondecycle, toJ5, toJ, asub });
//# sourceMappingURL=test.js.map