---
layout:     post
title:      "JavaScript高级程序设计"
intro:   ""
date:       2021-11-2 08:00:00
author:     "Makinohara"
featured_image: http://msfasr.com/img/py.jfif
catalog: true
tags:
    - 编程语言
---



> 为系统学习 JavaScript ，重写有关 JavaScript 的笔记，使用教材《JavaScript高级程序设计》第四版。

# 基础概念

## 1、DOM & BOM

DOM通过创建表示文档的树，让开发者可以随心所欲地控制网页的内容和结构。使用DOM API， 可以轻松地删除、添加、替换、修改节点。

总体来说，BOM 主要针对浏览器窗口和子窗口（frame），不过人们通常会把任何特定于浏览器的 扩展都归在BOM的范畴内。比如，下面就是这样一些扩展：

 弹出新浏览器窗口的能力；

 移动、缩放和关闭浏览器窗口的能力；

 navigator 对象，提供关于浏览器的详尽信息；
 location 对象，提供浏览器加载页面的详尽信息；

 screen 对象，提供关于用户屏幕分辨率的详尽信息；

 performance 对象，提供浏览器内存占用、导航行为和时间统计的详尽信息；

 对 cookie的支持；
 其他自定义对象，如 XMLHttpRequest 和 IE的 ActiveXObject。

## 2、加载方式

### 1、行内

```
<script> 
function sayHi() { 
	console.log("Hi!");
}
</script>
```

### 2、外部文件

```
<script src="example.js"></script>
```

### 3、加载位置

推荐加载在 body 内容的最后，这样就会在渲染界面后加载JavaScript

```
<!DOCTYPE html> 
<html>
	<head>
		<title>Example HTML Page</title> 
	</head> 
	<body> 
	<!-- 这里是页面内容 -->
	<script src="example1.js"></script> 
	<script src="example2.js"></script> 
	</body>
</html>
```

推迟到解析到结束标签 \</html> 执行（只对外部脚本文件才有效）：

```
<script defer src="example1.js"></script>
```

# 语言基础

### 变量声明提升

var 提升，let不提升

```
console.log(name);//undefined
var name = 'Matt';

console.log(age);//ReferenceError,暂时性死区
let age = 26;
```

let：声明范围是块作用域，所以不会造成循环定义的迭代变量渗透到外部。

const声明：限制不能修改其值或引用的对象，但是可以修改该对象的内部属性。

**尽可能使用let、const，避免使用var，const优先**

### 变量类型

```
Undefined
Null//typeof Null ==='object'
Boolean
Number
String
Symbol
(Object)
```

undefined 是一个特殊值，在if判断为假

null：可以看做是空对象指针

### 数值

特殊：NaN:not a number

#### 转换函数：

```
Number()
parseInt()
parseFloat()
```

### 字符串

字符串的特点：不可变，如果要修改只能销毁原有的字符串。

转换函数：

```
toString()
String()
String(null) === 'null'
String(undefined) === 'undefined'
```

#### 模板字面量

模板字面量可用于字符串插值：

```
let value1 = 233;
let value2 = 'sec'
let str1 = `now is ${value1} ${value2}.`
```

模板字面量可以跨行定义字符串

```
let str2 = `the
Kamome's humble abode`
```

原始字符串：

```
String.raw`\u00a9`
```

### Symbol

TODO:写关于symbol的笔记

### Object

Object 的属性和方法

```
constructor:创建
hasOwnProperty(propertyName):判断当前对象是否存在给定属性
isPrototypeOf:
propertyIsEnumerable(propertyName):判断给定的属性是否可用
toLocaleString():返回对象的字符串表示（反映本地化执行环境）
toString:返回对象的字符串表示
valueOf():返回对应的字符串
```

# 异步编程

## Promise

### Promise的基本使用

```
let myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("成功!"); //代码正常执行！
    }, 250);
});
```

### 函数返回Promise

```
function getUserInfo() {
	//获取个人信息
	return new Promise((resolve, reject) => {
		dbo.collection('users').find({ eid: userEID }).toArray((err, result) => {
			if (err) throw err;
            returnMessage['userInfo'] = result;
            resolve();
        })
    })
}
```

### Promise.all的使用

```
//执行查询
Promise.all([getUserInfo(), getMessage(), getFriendReq(), getFriendList()]).then(() => { closeAndSend() })
```

# 函数

### 函数的几种描述：

```
function func1(){
	return 1;
}

let func2 = function(){
	return 1;
}

let func3 = () => {
	return 1;
}

//立即执行的函数
(()=>1)();
```

箭头函数(Lambda)

```
(param1, param2, …, paramN) => { statements }
(param1, param2, …, paramN) => expression
//相当于：(param1, param2, …, paramN) =>{ return expression; }

// 当只有一个参数时，圆括号是可选的：
(singleParam) => { statements }
singleParam => { statements }

// 没有参数的函数应该写成一对圆括号。
() => { statements }
```

