/**
 * We don't have Pk-Ts-Node, so no external node packages - just native node
 */
import {
  haversine, pkToDate, dtFmt,

 } from '../index.js';

let args = [...process.argv];
args.shift();
args.shift();
let cmd = args.shift();
console.log({ cmd, args });

let fncs = {
  tstFmt(fmt="html")  {
    let fmtd = dtFmt(fmt, null);
    console.log(`The [${fmt}] formatted date: [${fmtd}]`);
    return fmtd;
  },
  tstTs(fmt="html")  {
    console.log("Testing differentiating between ms timestamps & Unix");
    let tsm = dtFmt('ms');
    let tss = dtFmt('s');
    let tssDate = pkToDate(tss);
    let tssDateShort = dtFmt('short',tss);
    let tsmDate = pkToDate(tsm);
    let tsmDateShort = dtFmt('short',tsm);
    console.log({tsm, tss, tssDate, tssDateShort, tsmDate, tsmDateShort,});
  },
  sayHello() {
    return "sayHello says Hello!";
  },
  bye(arg = "DEFAULT") {
    return `In 'bye' with arg: ${arg}`
  },
  tstHav() {
    let pt1 = { lat: 33.993772, lon: -118.463463, };
    let pt2 = { lat: 40.346233, lon: -120.352156, };
    let dist = haversine(pt1, pt2);
    return dist;

  }

};

let cmds = Object.keys(fncs);
if (!cmds.includes(cmd)) {
  console.log(`CMD [${cmd}] not found. Did you mean one of:`, cmds);
  process.exit();
}

let res = await fncs[cmd](...args);
console.log(`The Result of [${cmd}] with args:`, args, `was:`, res);