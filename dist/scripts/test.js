import { deepMeld, TagObj, typeOf, JSON5, isSubset } from '../index.js';
let tobj = { a: 8 };
let isDist = false;
let j5 = JSON5.stringify(tobj);
let to = typeOf(tobj);
let toJ = typeOf(JSON);
let toJ5 = typeOf(JSON5);
let arr1 = ['a', 'b', 'c'];
let arr2 = ['a', 'b'];
let asub = isSubset(arr2, arr1);
let tagObj = new TagObj('myData', 'theTag');
/*
console.log("Testing tests", { tobj, to, j5, jsondecycle, toJ5, toJ, asub, tagObj });

let anerr = new PkError('Some Err Msg', { dog: 3, cat: 'What?' }, 'something', 2, 8);

throw anerr;

let a1 = [1, 3, 5, 7];
let a2 = [1, 'toby', 9, 7];
let a3 = [5, 'toby', 'tomorrow', 7];
let u = uniqueVals(a1, a2, a3);
console.log({ u });
*/
let tobj1 = {
    a: 1,
    b: { dog: 5, cat: 'acat', no: 9, },
    c: [5, 7, 'tiger',],
};
let tobj2 = {
    a: 'oprim',
    b: { dog: 7, cat: 22, },
    c: [9, 22, 'lion', 5],
};
let dm = deepMeld(tobj1, tobj2);
console.log({ dm });
//# sourceMappingURL=test.js.map