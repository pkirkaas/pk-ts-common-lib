"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
let tobj = { a: 8 };
let j5 = __1.JSON5.stringify(tobj);
let to = (0, __1.typeOf)(tobj);
console.log("Testing tests", { tobj, to, j5, jsdc: __1.jsdc });
//# sourceMappingURL=tests.js.map