---
layout:     post
title:      "JavaScript语言学习"
intro:   ""
date:       2020-2-18 08:00:00
author:     "Makinohara"
featured_image: http://msfasr.com/img/py.jfif
catalog: true
tags:
    - 编程语言
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

### JS加载多个脚本的顺序设置

如果脚本无需等待页面解析，且无依赖独立运行，那么应使用 `async`。

如果脚本无需等待页面解析，且依赖于其它脚本，调用这些脚本时应使用 `defer`，将关联的脚本按所需顺序置于 HTML 中。

## JavaScript语句

if语句：同c++

while语句：同c++

for语句：同c++

#### do-while语句：

```javascript
var i = 0;
do{
    i += 2;
}while(i<10);

//主要体现在先执行再判断
```

#### for-in语句：

```javascript
for(var propName in window){
    document.write(propName);
}//返回顺序是不可预测的
```

#### 标签语句：

```javascript
start: print("start");//为语句加标签，方便跳转
```

带标签语句的break、continue：

```javascript
var num  = 0;
outermost:
for(;;){
    ......
    for(;;){
        ......
        break outermost;//跳出循环，同时跳出外部循环
    }
}

outermost:
for(;;){
    ......
    for(;;){
        ......
        continue outermost;//跳出内部循环，从outermost标签后的外部循环继续执行
    }
}
```

#### with语句实现的针对性编程：

```javascript
var qs = location.search.get();
var hostName = location.name();
var url = location.href;

//变为：

with(location){
    var qs = search.get();
    var hostname = name();
    var url = href;
}
```

switch语句参照c++，但是不要忘记了break，c++里面也不要忘记了！

## JavaScript 函数

```javascript
function Func1(){
    ......
    return 1+2;
}
```

## JS变量与对象

```JavaScript
//使用对象：
var person = new Object();
person.name = "aName";

//这样是无效的：
var name = "aName";
name.age = 37;//无用的写法
```

JavaScript 特色参数：

JavaScript不会在乎参数个数与传入的匹配问题，因为它们都被放在了arguments数组中，要访问这些参数，还可以通过访问arguments数组来实现，如：

arguments[0];

arguments.length:传入了多少个参数

在修改arguments[i]时，同时也会修改该参数的值，但是在函数内部修改参数值时，缺不会修改arguments[i]的值。

```javascript
function soAdd(a,b){
    arguments[1] += 2;//b的值被修改了。
    a += 3;//此时arguments[0]并没有被修改
    arguments[2] = 0;//无效的，因为只传入了两个参数。
}
```

JavaScript的参数传递都是按值传递，其传递原理为：

传递的值会被复制给一个局部变量，也就是arguments[]数组中的一个元素。

但是，在传递Object时，则会传递指向这个Object的相同引用。

```javascript
var person1 = new Object();
person1.name = "Jim";
var person2 = person1;//此时会指向同一个对象
```

解除占用的方式：

```javascript
person = null;
```

JavaScript中常用的定义一个对象的方式：

```javascript
var person = {
    name : "Jim" ;
    age : 29 ;
    working : true ;
}
```

数组：

```javascript
var colors = new Array(3);
var colors = {"red","blue","grown"};
value instanceof Array;//检测数组
//数组可以直接使用一些栈的方式：
colors.push("green");
colors.pop();
color.shift();//取得队列的头

list.sort();//排序
list.reverse();//反向排序
```



## JavaScript DOM编程

示例

```javascript
document.getElementById("demo").innerHTML = "Hello World!";
```

其余部分参考DOM文档

事件监听与处理

```javascript
const guessSubmit = document.querySelector('.guessSubmit');//选择一个页面元素
guessSubmit.addEventListener('click',checkGuess);//启动一个监听器并设置执行函数
```

## AJAX

XHR发送请求并处理：

```javascript
function getBook() {
    let getBookRequest = new XMLHttpRequest();
    let bookID = document.getElementById('ISBN').value;
    let sendUrl = "http://localhost:3000/bookInfo/" + bookID;
    getBookRequest.onreadystatechange=function()
    {
        if (getBookRequest.status === 200)//得到相应后的代码
        {
            document.getElementById("bookName").innerText=getBookRequest.responseText;
        }
    }
    getBookRequest.open("GET",sendUrl,true);
    getBookRequest.send();
}
```

