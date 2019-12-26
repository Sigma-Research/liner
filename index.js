const path = require('path');

//const jsonData = require("./test.json");
const jsonFile = process.argv.slice(2)[0];
const jsonData = require(path.resolve(jsonFile));

const liner = require('./liner');

let paperData = jsonData.data.paper_detail;
if (!paperData)
    paperData = jsonData.data.speak_paper;
if (!paperData)
    console.log('Error: data.paper_detail 和 data.speak_paper 子属性都未找到');

let ret = liner(paperData);

console.log(JSON.stringify(ret));
