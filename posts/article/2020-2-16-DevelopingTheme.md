---
layout:     post
title:      "开发自己的Hexo主题"
intro:   ""
date:       2020-2-16 13:13:00
author:     "Makinohara"
catalog: true
tags:
    - 工程开发
---



# 开发属于自己的博客主题

之前写博客一直都是用的别人的主题,用久了难免会觉得有些不爽......毕竟主题不是自己的,怎么用都感到有什么地方不满意.再加上我一直有一个想法,就是把 Mac OS 的一些效果尝试在 Web 上实现,于是便开始着手学习 Web 开发的相关知识,开始打造属于自己的 Hexo 主题.

## 前置知识学习

要想开发主题就得先学习前置知识,属于前端的三大基本技能就是 Html CSS JavaScript. 一开始看这些知识的时候我感到非常痛苦,因为 Html 标签和 CSS 样式指令有点难背,所以磨了不少时间在上面,按照日记上的记录应该是2月6日到2月8日,在这期间我只是学了一点浅薄的知识,但还是没有搞懂CSS盒模型啥的,造出来的网页也是一塌糊涂.

## 在开发中学习

后来我就琢磨,既然这些样式这么难背,还不如直接开始制作页面,等到需要用什么的时候再 Google. 于是从2月9号开始就直接利用现成的一点技能赶鸭子上架似的开始做主题了.在此期间 Chrome 标签页基本上都是开了15个朝上,开了若干窗口用来查询 CSS , JavaScript 等样式及指令. 在这个阶段我还没有做博客内容注入,只是搭建了一个框架,在这段时间我没有考虑其他的东西,重点是放在设计样式和优化排版上面. 做这些事情大概花了我3天时间,也就是2月9日至11日.

## 注入博客内容:与EJS鏖战

待到网站基本框架搭出来后,就要开始注入内容了,注入内容的方式我计划直接参考别人的博客,看看他们是怎么注入内容的.

不过待到我打开别人的主题文件的时候,我发现事情没那么简单.他们的网页是用一种从未见过的格式------ EJS 写的.此种格式可以自动填充内容,并在网页中嵌入简化的 JavaScript 脚本.此时我的 JavaScript 学习还停留在只会写几个函数,改几个 CSS 样式的水平,想要做内容根本就是不可能. 没办法,只好读文档,读别人的网页代码,看别人写的脚本,然后照葫芦画瓢地往自己的网页里面套......这样的过程大概又持续了2天,也就是2月12日至13日.

## 样式修改与犯强迫症

在内容注入成功后,最初的样式大概是这样的:

![1版样式1](/img/1版主页.png)

![1版样式2](/img/1版样式.png)

虽说有了一丢丢扁平化设计的雏形,但总体来看还是不堪入眼:大色块造成的视觉冲击会给人在浏览时带来心塞的感觉,于是又修改了两天样式,参考了无数的优秀主题和网站,当然最大的参考还是 Mac OS 的样式(我在虚拟机里装了一个 Mac OS 10.15 Catalina 以作参考),然后又上[日本传统色](https://nipponcolors.com/)网站找配色方案,最终终于修改成了现在的样式(截图我就不放了,因为现在使用的就是这样的样式).

当然,这个样式还不是最终的样式,如果我有了什么能把这个网站变得更好看的构想,便会着手修改样式.

## 未完成的想法

一开始我做这个主题时,是想把这个主题制作成一个可高度定制的,可在浏览器端修改样式的交互式网页.不过由于这些功能的实现需要 JavaScript 脚本作为支持,所以目前还没有付诸实践.原来想把这个网页的动画做得像 Mac OS 一样流畅,但由于 CSS3 的动画还没有学,所以只好先作罢.接下来就是要去深入学习 JavaScript, CSS3 , 继续完善这个主题,使之运行起来如 Mac OS 一般流畅自然.

还有一个巨大的问题:这个主题目前还没有做手机端适配,打算待到前端技术深入了解后,再处理手机端适配一事.

PS:不得不说,苹果的设计师还是有水平的.虽然 Mac OS 难用,但它好看啊!

