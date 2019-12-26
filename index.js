const path = require('path');
const liner = require('./liner');

//从测试文件中读取
//const jsonData = require("./test.json");

//从命令行读取
const jsonFile = process.argv.slice(2)[0];
const jsonData = require(path.resolve(jsonFile));

//找出 试卷对象
let paperData = jsonData.data.paper_detail;
if (!paperData)
    paperData = jsonData.data.speak_paper;
if (!paperData)
    console.log('Error: data.paper_detail 和 data.speak_paper 子属性都未找到');

//线性化
let ret = liner(paperData);

console.log(JSON.stringify(ret));
