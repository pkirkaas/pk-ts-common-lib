/**
 * Testing sublcasses, etc
 */
import { isSubclassOf, typeOfEach, } from '../index.js';
const A = class {
    dog;
    cat;
    whatever;
    constructor(extra) {
        this.dog = "Sarah";
        this.cat = "Donald";
        this.whatever = extra;
    }
};
class B extends A {
    tiger;
    constructor(extra, another) {
        super(extra);
        this.tiger = another;
    }
}
class C extends B {
    somec;
    constructor(newf) {
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
let csuba = isSubclassOf(C, A);
let csubab = isSubclassOf(C, A, 1);
let types = typeOfEach({ A, B, C, c, cConst, cPtype, cPC, cc, cd });
let cinsta = c instanceof A;
console.log({ types, csuba, csubab, cinsta, cc, cd });
//# sourceMappingURL=tstptypes.js.map