import { typeOf, isEmpty, jsdc, JSON5 } from '..';
let tobj = { a: 8 };
let j5 = JSON5.stringify(tobj);
let to = typeOf(tobj);
let toJ = typeOf(JSON);
let toJ5 = typeOf(JSON5);
console.log("Testing tests", { tobj, to, j5, jsdc, toJ5, toJ });