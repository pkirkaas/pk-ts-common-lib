"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
let tobj = { a: 8 };
let isDist = false;
let j5 = __1.JSON5.stringify(tobj);
let to = (0, __1.typeOf)(tobj);
let toJ = (0, __1.typeOf)(JSON);
let toJ5 = (0, __1.typeOf)(__1.JSON5);
console.log("Testing tests", { tobj, to, j5, jsondecycle: __1.jsondecycle, toJ5, toJ });
//# sourceMappingURL=tests.js.map