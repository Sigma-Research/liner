const path = require('path');
const liner = require('./liner');

//从测试文件中读取
// const jsonData = require("./test.json");
// const jsonData = require("./paper.json");

//从命令行读取
const jsonFile = process.argv.slice(2)[0];
const jsonData = require(path.resolve(jsonFile));

//找出 试卷对象
let paperData = jsonData.data ? jsonData.data.paper_detail : null;
if (!paperData)
    paperData = jsonData.data ? jsonData.data.speak_paper : null;
if (!paperData)
    paperData = jsonData;
if (paperData.config === undefined) {
    console.log('找不到 试卷对象子属性');
    return;
}
//线性化
let ret = liner(paperData);

console.log(JSON.stringify(ret));
