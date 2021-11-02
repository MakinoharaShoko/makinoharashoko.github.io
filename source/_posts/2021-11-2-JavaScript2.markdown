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

