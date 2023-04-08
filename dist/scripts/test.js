import { PkError, isEmpty, allProps, classStack, getAllBuiltInProps, getPrototypeChain, getObjDets } from '../index.js';
import util from 'util';
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.breakLength = 200;
console.log('In test.ts...');
let tstArr = ['dog', 'cat', 'horse', 'donky', 7, 12, { some: 'obj' }, 'today'];
class Organ {
    age;
    constructor(age) {
        this.age = age;
    }
}
;
class Animal extends Organ {
    nick;
    constructor(age, nick) {
        super(age);
        this.nick = nick;
    }
}
;
class Mammal extends Animal {
}
class Dog extends Mammal {
    breed;
    owner;
    constructor(age, nick, breed, owner) {
        super(age, nick);
        this.breed = breed;
        this.owner = owner;
    }
}
function tstFnNames(arg) {
    console.log({ arg });
}
let aDog = new Dog(22, 'buck', 'mutt', 'daddy');
function tstProps() {
    let biProps = getAllBuiltInProps();
    console.log({ biProps });
}
function tstPropsx() {
    let anErr = new PkError('tstErr');
    let bres = {
        inspP: allProps(anErr, 'dv'),
        anErr: getObjDets(anErr),
        PkError: getObjDets(PkError),
        isEmpty: getObjDets(isEmpty),
        emptyObj: getObjDets({}),
        emptyArr: getObjDets([]),
        string: getObjDets(' '),
        aDogPChain: getPrototypeChain(aDog),
        //anErrPChain: getPrototypeChain(anErr),
        aDogCS: classStack(aDog),
        //DogPChain: getPrototypeChain(Dog),
        DogCS: classStack(Dog),
        //	aDogCChain: getConstructorChain(aDog),
    };
    /*
    let res = {
        anErr: { props: allProps(anErr), type: typeof anErr },
        PkErrorClass: { props: allProps(PkError), type: typeof PkError },
        //emptyObj: allProps({}),
        simpleObj: allProps({ d: 'cat' }),
        emptyArr: allProps([]),
        //smallArr: allProps([1, 2, 3]),
        isEmptyFnc: allProps(isEmpty),
        //null:allProps(null),
    }
    */
    console.log({ bres });
}
;
tstProps();
/*
let tstDtArgs = { null: null, str1: '2023-12-01' };
let res: GenObj = {};
for (let key in tstDtArgs) {
     let orig = tstDtArgs[key];
     let pkTDRes
    res[key] = {
        orig,
        pkTDRes: pkToDate(orig),
        dtFmtShort: dtFmt('short', orig),
        dtFmtDT: dtFmt('dt', orig),
        dtFmtDTs: dtFmt('dts', orig),
        dtFmtTs: dtFmt('ts', orig),
    }
}
let dtE = new Date();
let dtN = new Date(null);
console.log('todate res:', { res, dtE, dtN });
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
*/
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