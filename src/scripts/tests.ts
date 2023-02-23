import { typeOf, isEmpty, jsdc, JSON5 } from '..';
let tobj = { a: 8 };
let j5 = JSON5.stringify(tobj);
let to = typeOf(tobj);
console.log("Testing tests", { tobj, to, j5, jsdc });