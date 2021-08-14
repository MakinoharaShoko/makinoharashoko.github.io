---
layout:     post
title:      "JavaScript语言学习"
intro:   ""
date:       2020-2-18 08:00:00
author:     "Makinohara"
featured_image: http://msfasr.com/img/py.jfif
catalog: true
tags:
    - 学习笔记
    - Web Developing
---



# JavaScript语言基础

## JavaScript基本知识

### 字符串

JavaScript同时支持单引号与双引号作为字符串起始。

```
document.getElementById("demo").innerHTML = 'Hello JavaScript';
```

### JavaScript改变网页中的结构

示例：

```
document.getElementById("demo").style.fontSize = "25px";//改变CSS样式
document.getElementById("demo").style.display="block";//改变元素显示	
```

### 在HTML中引入js

```
<script>
document.getElementById("demo").innerHTML = "我的第一段 JavaScript";
</script>
<script src="myScript.js"></script>//外部调用
```

### JS函数与调用

JavaScript *函数*是一种 JavaScript 代码块，它可以在调用时被执行。

例如，当发生*事件*时调用函数，比如当用户点击按钮时。

### JS输出

按以下几种方式：

- 使用 window.alert() 写入警告框
- 使用 document.write() 写入 HTML 输出
- 使用 innerHTML 写入 HTML 元素
- 使用 console.log() 写入浏览器控制台

### JS数据类型

JavaScript变量可以保存多种数据类型的

```
var length = 7;                             // 数字
var lastName = "Gates";                      // 字符串
var cars = ["Porsche", "Volvo", "BMW"];         // 数组
var x = {firstName:"Bill", lastName:"Gates"};    // 对象 
```

### JS函数

```
function myFunction(p1, p2) {
    return p1 * p2;              // 该函数返回 p1 和 p2 的乘积
}
```

JSON

```
{
"employees":[									//数组
    {"firstName":"Bill", "lastName":"Gates"}, 	//对象
    {"firstName":"Steve", "lastName":"Jobs"},	//"变量":"值"
    {"firstName":"Alan", "lastName":"Turing"}   //使用逗号作为分隔符
]
}
```

## JavaScript DOM编程

示例

```
document.getElementById("demo").innerHTML = "Hello World!";
```

其余部分参考DOM文档