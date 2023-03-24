import { filterInt, PkError, typeOf, JSON5 } from '../index.js';
import util from 'util';
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.breakLength = 200;
let tobj = { a: 8 };
let isDist = false;
let j5 = JSON5.stringify(tobj);
let to = typeOf(tobj);
let toJ = typeOf(JSON);
let toJ5 = typeOf(JSON5);
let arr1 = ['a', 'b', 'c'];
let arr2 = ['a', 'b'];
/*
let asub = isSubset(arr2, arr1);
let tagObj = new TagObj('myData', 'theTag');
*/
function toInt(arg) {
    if (filterInt(arg)) {
        return arg;
    }
    return parseInt(arg);
}
/**
 * Retuns a random integer
 * @param numeric to - max int to return
 * @param numberic from default 0 - optional starting/min number
 * @return int
 */
function randInt(to, from = 0) {
    // Convert args to ints if possible, else throw
    //@ts-ignore
    if (isNaN((to = parseInt(to)) || isNaN((from = parseInt(from))))) {
        throw new PkError(`Non-numeric arg to randInt():`, { to, from });
    }
    if (from === to) {
        return from;
    }
    if (from > to) {
        let tmp = from;
        from = to;
        to = tmp;
    }
    let bRand = from + Math.floor((Math.random() * ((to + 1) - from)));
    return bRand;
}
let rtsts = [[5], [2, 3], [99, 3], [3, 99], ['5', 93.4], ['15.3', 4]];
let res = rtsts.map((el) => {
    let rands = [];
    for (let i = 0; i < 8; i++) {
        //@ts-ignore
        rands.push(randInt(...el));
    }
    el.push(rands);
    return el;
});
console.log({ res });
//return this[Math.floor((Math.random()*this.length))];
// Testing ints
/*
function valIsNaN(arg: any) {
    return arg !== arg;
}

let tests = { int:5, True:true, False: false, str5:"5", str:"dog", float:2.3, floatStr:"4.7", null:null, emptyStr:'', };
//let (res = tests.map((el) => filterInt(el));
for (let key in tests) {
    let orig = tests[key];
    let fint = filterInt(orig);
    let pInt = parseInt(orig);
    let nanish = Number.isNaN(pInt);
    let vIsNaN = valIsNaN(pInt);
    tests[key] = { orig, fint, pInt, nanish, vIsNaN };
}
console.log({ tests });





console.log("Testing tests", { tobj, to, j5, jsondecycle, toJ5, toJ, asub, tagObj });

let anerr = new PkError('Some Err Msg', { dog: 3, cat: 'What?' }, 'something', 2, 8);

throw anerr;

let a1 = [1, 3, 5, 7];
let a2 = [1, 'toby', 9, 7];
let a3 = [5, 'toby', 'tomorrow', 7];
let u = uniqueVals(a1, a2, a3);
console.log({ u });

let tobj1 = {
    a: 1,
    b: { dog: 5, cat: 'acat', no:9,},
    c: [5, 7, 'tiger',],
};

let tobj2 = {
    a: 'oprim',
    b: { dog: 7, cat: 22, },
    c: [ 9, 22, 'lion', 5],
}

let dm = deepMeld(tobj1, tobj2);

console.log({ dm });
*/ 
//# sourceMappingURL=test.js.map