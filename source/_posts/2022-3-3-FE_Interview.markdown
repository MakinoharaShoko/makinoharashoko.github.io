---
layout:     post
title:      前端面试知识点查缺补漏
intro:   ""
date:       2022-3-3 23:00:00
author:     "Makinohara"
catalog: true
tags:
    - 工程开发
---

# JS相关

## JS延迟加载

js 的加载、解析和执行会阻塞页面的渲染过程，因此我们希望 js 脚本能够尽可能的延迟加载，提高页面的渲染速度。

我了解到的几种方式是：

第一种方式是我们一般采用的是将 js 脚本放在文档的底部，来使 js 脚本尽可能的在最后来加载执行。

第二种方式是给 js 脚本添加 defer 属性，这个属性会让脚本的加载与文档的解析同步解析，然后在文档解析完成后再执行这个脚本文件，这样的话就能使页面的渲染不被阻塞。多个设置了 defer 属性的脚本按规范来说最后是顺序执行的，但是在一些浏览器中可能不是这样。

第三种方式是给 js 脚本添加 async 属性，这个属性会使脚本异步加载，不会阻塞页面的解析过程，但是当脚本加载完成后立即执行 js 脚本，这个时候如果文档没有解析完成的话同样会阻塞。多个 async 属性的脚本的执行顺序是不可预测的，一般不会按照代码的顺序依次执行。

第四种方式是动态创建 DOM 标签的方式，我们可以对文档的加载事件进行监听，当文档加载完成后再动态的创建 script 标签来引入 js 脚本。

## 事件循环

### 事件循环的基本原理

1. 从 **宏任务** 队列（例如 “script”）中出队（dequeue）并执行最早的任务。
2. 执行所有微任务：
   - 当微任务队列非空时：
     - 出队（dequeue）并执行最早的微任务。
3. 如果有变更，则将变更渲染出来。
4. 如果宏任务队列为空，则休眠直到出现宏任务。
5. 转到步骤 1。

安排（schedule）一个新的 **宏任务**：

- 使用零延迟的 `setTimeout(f)`。

它可被用于将繁重的计算任务拆分成多个部分，以使浏览器能够对用户事件作出反应，并在任务的各部分之间显示任务进度。

此外，也被用于在事件处理程序中，将一个行为（action）安排（schedule）在事件被完全处理（冒泡完成）后。

安排一个新的 **微任务**：

- 使用 `queueMicrotask(f)`。
- promise 处理程序也会通过微任务队列。

在微任务之间没有 UI 或网络事件的处理：它们一个立即接一个地执行。

所以，我们可以使用 `queueMicrotask` 来在保持环境状态一致的情况下，异步地执行一个函数。

#### 宏任务

- 当外部脚本 `<script src="...">` 加载完成时，任务就是执行它。
- 当用户移动鼠标时，任务就是派生出 `mousemove` 事件和执行处理程序。
- 当安排的（scheduled）`setTimeout` 时间到达时，任务就是执行其回调。

#### 微任务

每个宏任务之后，引擎会立即执行微任务队列中的所有任务，然后再执行其他的宏任务，或渲染，或进行其他任何操作。

## Promise 与 异步编程

### 手写Promise

没有实现链式调用

```js
class MyPromise {
    constructor(func) {
        this.status = 'PENDING'; // 初始化状态
        this.value = undefined; // 成功返回的值
        this.reason = undefined; //失败返回的值

        this.callbacks = [];//结束后的回调
        func(this.resolve.bind(this), this.reject.bind(this));//绑定this
    }

    resolve(value) {
        this.value = value;
        this.status = 'FULFILLED'; // 设置状态

        // 通知事件执行
        this.callbacks.forEach((cb) => this._handler(cb));
    }

    reject(reason) {
        this.reason = reason;
        this.status = 'REJECTED'; // 设置状态

        // 通知事件执行
        this.callbacks.forEach((cb) => this._handler(cb));
    }

    then(onFulfilled, onRejected) { //这个函数用于注册
        // 将需要执行的回调函数存储起来
        this.callbacks.push({
            onFulfilled,
            onRejected,
        });//保存参数
    }

    //用于执行回调函数
    _handler(callback) {
        const { onFulfilled, onRejected } = callback;//回调函数的两个参数

        if (this.status === 'FULFILLED' && onFulfilled) {
            // 传入存储的值
            onFulfilled(this.value);
        }

        if (this.status === 'REJECTED' && onRejected) {
            // 传入存储的错误信息
            onRejected(this.reason);
        }
    }
}

function test(success) {
    return new MyPromise((res, rej) => {
        setTimeout(() => {
            if (success) {
                res("willem");
            } else {
                rej('error');
            }
        }, 0);
    })
}

test(true).then((r, j) => {
    console.log(r);
})

test(false).then(null, j => {
    console.log(j);
})
```

### 手写 Promise.all Promise.race

#### Promise.all

```js
MyAll = function (iterator) {  
    let count = 0//用于计数，当等于len时就resolve
    let len = iterator.length
    let res = []//用于存放结果
    return new Promise((resolve,reject) => {
        for(let e of iterator){
            //Promise.resolve(value)方法返回一个以给定值解析后的Promise 对象。
            //如果这个值是一个 promise ，那么将返回这个 promise。
            Promise.resolve(e)//转化为Promise对象
            .then((data) => {
                res[count] = data;
                if(++count === len){
                    resolve(res)
                }
            })
            .catch(e => {
                reject(e)
            })
        }
    })
}
```

#### Promise.race

```js
MyRace = function (iterator) {  
    return new Promise((resolve,reject) => {
        for(let e of iterator){
            Promise.resolve(e)
            .then((data) => {
                    resolve(data)
            })
            .catch(e => {
                reject(e)
            })
        }
    })
}
```

### Async Await

#### Async

```
async function name([param[, param[, ... param]]]) {
    statements 
}
```

async函数一定会返回一个promise对象。如果一个async函数的返回值看起来不是promise，那么它将会被隐式地包装在一个promise中。

##### 示例

如下代码:

```
async function foo() {
   return 1
}
```

等价于:

```
function foo() {
   return Promise.resolve(1)
}
```

async函数的函数体可以被看作是由0个或者多个await表达式分割开来的。从第一行代码直到（并包括）第一个await表达式（如果有的话）都是同步运行的。这样的话，一个不含await表达式的async函数是会同步运行的。然而，如果函数体内有一个await表达式，async函数就一定会异步执行。

例如：

```
async function foo() {
   await 1
}
```

等价于

```
function foo() {
   return Promise.resolve(1).then(() => undefined)
}
```

#### Await

`[返回值] = await 表达式;`

`await` 操作符用于等待一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象。它只能在异步函数 [`async function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 中使用。

await 表达式会暂停当前 [`async function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 的执行，等待 Promise 处理完成。若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 [`async function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)。

若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。

另外，如果 await 操作符后的表达式的值不是一个 Promise，则返回该值本身。

##### 示例

```js
function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function f1() {
  var x = await resolveAfter2Seconds(10);
  console.log(x); // 10
}
f1();
```

## JS 函数

### 详解 bind apply call

#### bind:绑定 this 指向

`function.bind(thisArg[, arg1[, arg2[, ...]]])`

**`bind()` **方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
const module = {
  x: 42,
  getX: function() {
    return this.x;
  }
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// expected output: undefined

const boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42
```

#### apply:	调用一个函数，接受参数数组

`func.apply(thisArg, [argsArray])`

```js
const func1 = (a)=>{
    console.log(`hello,${a}`);
}
//apply接受一个参数数组
func1.apply(null,['Mahiru'])
//如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
```

#### call：调用一个函数，接受参数

`function.call(thisArg, arg1, arg2, ...)`

```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}

console.log(new Food('cheese', 5).name);
// expected output: "cheese"

```

## 原型与原型链

![js__proto__](https://user-images.githubusercontent.com/30483415/156961492-e97cd912-074c-4b8e-b99f-70dbd2eff676.jpg)

## instanceof

**`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

手写 `instanceof`：

```js
function myInstanceof(obj, obj2) {
    let proto = obj.__proto__;
    let prototype = obj2.prototype;
    let queue = [proto];
    // 循环 obj 原型链进行获取 __proto__ 与 prototype 对比
    while(queue.length) {
        let temp = queue.shift();
        if(temp === null) return false;//找到原型链顶端，仍不是
        if(temp === prototype) return true;
        queue.push(temp.__proto__);
    }
}
```

## new

当执行：

```js
var o = new Foo();
```

JavaScript 实际上执行的是：

```js
var o = new Object();
o.__proto__ = Foo.prototype;
Foo.call(o);
```

```js
function myNew(F){
    let result = {};
    let arg = Array.prototype.slice.call(arguments, 1);
    // 将实例对象的 __proto__ 指向 F.prototype
    Object.setPrototypeOf(result, F.prototype);
    // this 指向实例对象
    F.apply(result, arg);
   return result;
}
```

## 展开运算符

`...`

#### 示例

```js
function sum(x, y, z) {
  return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers));
// expected output: 6
```

### 数组

```js
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1 = [...arr2, ...arr1]; // arr1 现在为 [3, 4, 5, 0, 1, 2]
```

### 对象

```js
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// 克隆后的对象: { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// 合并后的对象: { foo: "baz", x: 42, y: 13 }
```

## 剩余参数

**剩余参数**语法允许我们将一个不定数量的参数表示为一个数组。

```js
function(a, b, ...theArgs) {
  // ...
}
```

#### 示例

```js
function multiply(multiplier, ...theArgs) {
  return theArgs.map(function (element) {
    return multiplier * element;
  });
}

var arr = multiply(2, 1, 2, 3);
console.log(arr);  // [2, 4, 6]
```

## 对象的更多方法（待完善）

Object.assign

## 深拷贝

### JSON法

```js
var obj2 = JSON.parse(JSON.stringify(obj1));
```

### 递归拷贝

```js
function deepClone(initalObj, finalObj) {    
  var obj = finalObj || {};    
  for (var i in initalObj) {        
    var prop = initalObj[i];// 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
    if(prop === obj) {            
      continue;
    }        
    if (typeof prop === 'object') {
      obj[i] = (prop.constructor === Array) ? [] : {};            
      arguments.callee(prop, obj[i]);//调用自身，现在不建议用了
    } else {
      obj[i] = prop;
    }
  }    
  return obj;
}
```

### Object.create

```js
function deepClone(initalObj, finalObj) {    
  var obj = finalObj || {};    
  for (var i in initalObj) {        
    var prop = initalObj[i];        // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
    if(prop === obj) {            
      continue;
    }        
    if (typeof prop === 'object') {
      obj[i] = (prop.constructor === Array) ? [] : Object.create(prop);
    } else {
      obj[i] = prop;
    }
  }    
  return obj;
}
```

### lodash

```js
var loadash = require('lodash');
var obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
var obj2 = loadash.cloneDeep(obj1);
```

## 闭包与高阶函数

### 闭包

一个函数和对其周围状态（**lexical environment，词法环境**）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是**闭包**（**closure**）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

```js
function makeFunc() {
    var name = "Mozilla";
    function displayName() {
        alert(name);
    }
    return displayName;
}

var myFunc = makeFunc();
myFunc();
```

#### 高阶函数

JavaScript的函数其实都指向某个变量。既然变量可以指向函数，函数的参数能接收变量，那么一个函数就可以接收另一个函数作为参数，这种函数就称之为高阶函数。

- 节流: n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效
- 防抖: n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时

##### 节流

```javascript
function debounce(fn,delay){
    let timer = null //借助闭包
    return function() {
        if(timer){
            clearTimeout(timer) 
        }
        timer = setTimeout(fn,delay) // 简化写法
    }
}
```

##### 防抖

```javascript
function throttle(fn,delay){
    let valid = true
    return function() {
       if(!valid){
           //休息时间 暂不接客
           return false 
       }
       // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}
```

#### 柯里化与逆柯里化

##### 柯里化

```js
function curry(func) {

  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };

}
```

##### 逆柯里化

```js
function unCurrying(fn) {
  return function(tar, ...argu) {
    return fn.apply(tar, argu)
  }
}
```

### 内存泄漏


第一种情况是我们由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。

第二种情况是我们设置了 setInterval 定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留
在内存中，而无法被回收。

第三种情况是我们获取一个 DOM 元素的引用，而后面这个元素被删除，由于我们一直保留了对这个元素的引用，所以它也无法被回
收。

第四种情况是不合理的使用闭包，从而导致某些变量一直被留在内存当中。

## JS 事件模型

### 事件监听函数

```js
addEventListener(eventType, handler, useCapture)
```

### 事件对象常用属性

```
type用于获取事件类型

target获取事件目标

stopPropagation()阻止事件冒泡

preventDefault()阻止事件默认行为
```

### 事件阶段

捕获阶段 -> 目标阶段 -> 冒泡阶段

### 捕获阶段

事件从document一直向下传播到目标元素, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行。

如何将处于冒泡阶段的事件修改成捕获阶段呢？

```js
parent.addEventListener('click', () => {      
    console.log('parent 被点击了');   
}，true)    
child.addEventListener('click', (event) => {     
    console.log('child 被点击了');          
},true)
```

当处于冒泡阶段时，我们没有必要加第三个参数，因为 `addEventListener` 默认第三个参数为false（第三个参数存在），如果我们要事件处于捕获阶段的话，只要将第三个参数设成true就行。

### 目标阶段

事件到达目标元素, 触发目标元素的监听函数。

### 冒泡阶段

事件从目标元素冒泡到document, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行。

### 事件代理

事件在冒泡过程中会上传到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方式称为事件代理(Event delegation)。

### target currentTarget

[`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 接口的只读属性 `currentTarget` 表示的是当事件沿着 DOM 触发时事件的当前目标。它总是指向事件绑定的元素，而 [`Event.target`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target) 则是事件触发的元素。

## Map 与 WeakMap

`WeakMap` 对于值的引用都是不计入垃圾回收机制的，所以名字里面才会有一个"Weak"，表示这是弱引用（对对象的弱引用是指当该对象应该被 `GC` 回收时不会阻止 `GC` 的回收行为）。

`Map` 相对于 `WeakMap` ：

- `Map` 的键可以是任意类型，`WeakMap` 只接受对象作为键（null除外），不接受其他类型的值作为键
- `Map` 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键； `WeakMap` 的键是弱引用，键所指向的对象可以被垃圾回收，此时键是无效的
- `Map` 可以被遍历， `WeakMap` 不能被遍历

## 关于 Array

### Map Reduce

**1.reduce是一个累加方法，是对数组累积执行回调函数，返回最终计算结果。**

```js
array.reduce(function(total, currentValue, currentIndex, arr){
}, initialValue);

//total 必需。初始值, 或者计算结束后的返回值。
//currentValue  必需。当前元素
//currentIndex  可选。当前元素的索引
//arr   可选。当前元素所属的数组对象。
//initialValue可选。传递给函数的初始值
```

**2.map是遍历数组的每一项，并执行回调函数的操作，返回一个对每一项进行操作后的新数组。**

```js
array.map(function(currentValue,index,arr), thisValue)；
//currentValue  必须。当前元素的值
//index 可选。当前元素的索引值
//arr   可选。当前元素属于的数组对象
//thisValue可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。如果省略了 thisValue，或者传入 null、undefined，那么回调函数的 this 为全局对象。
```

**3.forEach和map用法一样,也是是遍历数组的每一项，并执行回调函数的操作，不过forEachf返回值是undefined，不可以链式调用。**

```js
array.forEach(function(currentValue, index, arr), thisValue)

//currentValue  必需。当前元素
//index 可选。当前元素的索引值。
//arr   可选。当前元素所属的数组对象。
//thisValue 可选。传递给函数的值一般用 "this" 值。如果这个参数为空， "undefined" 会传递给 "this" 值
```

## 代理与反射

# 代理和反射

> 代理是什么？

通过调用 `new Proxy()` ，你可以创建一个代理用来替代另一个对象（被称之为目目标对象） ，这个代理对目标对象进行了虚拟，因此该代理与该目标对象表面上可以被当作同一个对象来对待。

代理允许你拦截目标对象上的底层操作，而这本来是JS引擎的内部能力，拦截行为适用了一个能响应特定操作的函数（被称之为陷阱）；

> 反射是什么？

被`Reflect`对象所代表的反射接口，**是给底层操作提供默认行为的方法的集合，这些操作是能够被代理重写的**。每个代理陷阱都有一个对应的反射方法，每个方法都与对应的陷阱函数同名，并且接收的参数也与之一致。

> 创建一个简单的代理

使用Proxy构建可以创建一个简单的代理对象，需要传递两个参数：**目标对象以及一个处理器，后者是定义一个或多个陷阱函数的对象**。如果不定义陷阱函数，则依然使用目标对象的默认行为。

### 示例

#### 1、使用Set陷阱函数验证属性值

假如有这样一个场景，必须要求对象的属性值必须只能是数值，这就意味着该对象每个新增属性时都要被验证，并且在属性不为数值属性时就应该抛出错误。因此就需要使用`set`陷阱函数来重写`set`函数的默认行为，`set`陷阱函数接收四个参数：

1. trapTarget：代理的目标对象；
2. key：需要写入的属性的键；
3. value：被写入属性的值；
4. receiver：操作发生的对象（通常是代理对象）

`Reflect.set()`是`set`陷阱函数对应的反射方法，同时也是`set`操作的默认行为，`Reflect.set()`方法与`set`陷阱函数一样，能够接受四个参数。

针对上述场景，示例代码：

```js
//set陷阱函数
let target = {
	name:'target'
}
let proxy = new Proxy(target,{
	set(tarpTarget,key,value,receiver){

		if(!tarpTarget.hasOwnProperty(key)){
			if(isNaN(value)){
				throw new Error('property must be number');
			}
		}
		return Reflect.set(tarpTarget,key,value,receiver);
	}
});

proxy.msg='hello proxy'; //Uncaught Error: property must be number
```

通过set陷阱函数就可以检测设置属性时属性值的类型，当属性值不是数字时，就会抛出错误。

#### **2.使用get陷阱函数进行对象外形验证**

**对象外形（Object Shape）指的是对象已有的属性与方法的集合。**能够使用代理很方便进行对象外形验证。由于使用属性验证只需要在读取属性时被触发，因此只需要使用`get陷阱函数`。该函数接受三个参数：

1. trapTarget：代理的目标对象；
2. key：需要读取的属性的键；
3. receiver：操作发生的对象（通常是代理对象）；

相应的`Reflect.get()`方法同样拥有这三个参数。进行对象外形验证的示例代码：

```
//get陷阱函数

let target={
	name:'hello world'
}

let proxy = new Proxy(target,{
		get(tarpTarget,key,receiver){
			if(!(key in tarpTarget)){
				throw new Error('不存在该对象');
			}
			return Reflect.get(tarpTarget,key,receiver);
		}
	});
console.log(proxy.name); //hello world
console.log(proxy.age); // Uncaught Error: 不存在该对象
复制代码
```

使用`get陷阱函数`进行对象外形验证，由于`target`对象存在`name`属性，所以可以正常返回，当获取`age`属性时，由于该属性并不存在，所以会抛出错误。

#### **3.使用has陷阱函数隐藏属性**

`in`运算符用于判断指定对象中是否存在某个属性，如果对象的属性名与指定的字符串或符号值相匹配，那么`in`运算符就会返回`true`。无论该属性是对象自身的属性还是其原型的属性。

`has陷阱函数`会在使用`in`运算符的情况下被调用，控制in运算符返回不同的结果，`has陷阱函数`会传入两个参数：

1. trapTarget：代理的目标对象；
2. key：属性键；

`Reflect.has()`方法接收相同的参数，并向`in`运算符返回默认的响应结果，用于返回默认响应结果。

例如想要隐藏value属性：

```
//has陷阱函数
let target = {
	value:'hello world'
}

let proxy = new Proxy(target,{
	has(tarpTarget,key){
		if(Object.is(key,'value')){
			return false;
		}
		Reflect.has(tarpTarget,key);
	}
})

console.log('value' in proxy); //false
复制代码
```

使用`has陷阱函数`，能够控制`in`运算符的结果，`value`属性在`target对象`中存在，通过代理的`has陷阱函数`使得在检查`value`属性时返回`false`，达到隐藏属性的效果。

#### **4.使用deleteProperty陷阱函数避免属性被删除**

`deleteProperty` 陷阱函数会在使用`delete` 运算符删除对象属性时被调用，该方法接收两个参数：

1. trapTarget：代理的目标对象；
2. key：需要删除的键；

`Reflect.deleteProperty()` 方法也接受这两个参数，并提供了 `deleteProperty` 陷阱函数的默认实现。你可以结合 `Reflect.deleteProperty()`方法以及 `deleteProperty` 陷阱函数，来修改 `delete` 运算符的行为。例如，能确保 value 属性不被删除：

```
let target = {
	name: "target",
	value: 42
};
let proxy = new Proxy(target, {
	deleteProperty(trapTarget, key) {
		if (key === "value") {
			return false;
		} else {
			return Reflect.deleteProperty(trapTarget, key);
		}
	}
});
// 尝试删除 proxy.value
console.log("value" in proxy); // true
let result1 = delete proxy.value;
console.log(result1); // false
```

# CSS相关

## 重绘与回流

**回流必将引起重绘，重绘不一定会引起回流。**

### 回流

导致回流的一些操作

- 页面首次渲染
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变
- 元素内容变化（文字数量或图片大小等等）
- 元素字体大小变化
- 添加或者删除可见的DOM元素
- 激活CSS伪类（例如：:hover）
- 查询某些属性或调用某些方法

主要有下面几个API

> 盒子操作相关

- `elem.offsetLeft`, `elem.offsetTop`, `elem.offsetWidth`, `elem.offsetHeight`, `elem.offsetParent`
- `elem.clientLeft`, `elem.clientTop`, `elem.clientWidth`, `elem.clientHeight`
- `elem.getClientRects()`, `elem.getBoundingClientRect()`

> 滚动相关

- `elem.scrollBy()`, `elem.scrollTo()`
- `elem.scrollIntoView()`, `elem.scrollIntoViewIfNeeded()`
- `elem.scrollWidth`, `elem.scrollHeight`
- `elem.scrollLeft`, `elem.scrollTop`

### 重绘

当我们操作的节点上的元素并不导致元素位置发生变化时，比如`color`,`background-color`,`visibility(注意虽然节点隐藏了，但是元素还在，并且位置也不会发生变化)`

浏览器会将新的样式赋值给这些节点，我们称这个过程为重绘

### 如何避免

- 避免使用 `table` 布局。
- 尽可能在 `DOM` 树的最末端改变`class`。
- 避免设置多层内联样式。
- 将动画效果应用到`position`属性为`absolute`或`fixed`的元素上。
- 避免使用`CSS`表达式（例如：`calc()`）。
- 避免频繁操作样式，最好一次性重写`style`属性，或者将样式列表定义为`class`并一次性更改`class`属性。

-避免频繁操作`DOM`，创建一个`documentFragment`，在它上面应用所有`DOM`操作，最后再把它添加到文档中。

- 也可以先为元素设置`display: none`，操作结束后再把它显示出来。因为在`display`属性为`none`的元素上进行的`DOM`操作不会引发回流和重绘。
- 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
- 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。

## CSS 几种单位

### 绝对长度单位

一般来说，常用`px`

### 相对长度单位

| `em`   | 在 font-size 中使用是相对于父元素的字体大小，在其他属性中使用是相对于自身的字体大小，如 width |
| ------ | ------------------------------------------------------------ |
| `ex`   | 字符“x”的高度                                                |
| `ch`   | 数字“0”的宽度                                                |
| `rem`  | 根元素 `<html>` 的字体大小                                   |
| `lh`   | 元素的line-height                                            |
| `vw`   | 视窗宽度的1%                                                 |
| `vh`   | 视窗高度的1%                                                 |
| `vmin` | 视窗较小尺寸的1%                                             |
| `vmax` | 视图大尺寸的1%                                               |

## CSS 处理字符串

### text-overflow

`clip`

**此为默认值。**这个关键字的意思是"在内容区域的极限处截断文本"，因此在字符的中间可能会发生截断。如果你的目标浏览器支持 `text-overflow: ''`，为了能在两个字符过渡处截断，你可以使用一个空字符串值 (`''`) 作为 `text-overflow` 属性的值。

`ellipsis`

这个关键字的意思是“用一个省略号 (`'…'`, `U+2026 HORIZONTAL ELLIPSIS`)来表示被截断的文本”。这个省略号被添加在内容区域中，因此会减少显示的文本。如果空间太小到连省略号都容纳不下，那么这个省略号也会被截断。

`<string>`

[`<string>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/string)用来表示被截断的文本。字符串内容将被添加在内容区域中，所以会减少显示出的文本。如果空间太小到连省略号都容纳不下，那么这个字符串也会被截断。

### overflow-wrap

`normal`

行只能在正常的单词断点处中断。（例如两个单词之间的空格）。

`break-word`

表示如果行内没有多余的地方容纳该单词到结尾，则那些正常的不能被分割的单词会被强制分割换行。

### text-transform

`capitalize`

这个关键字强制每个单词的首字母转换为大写。其他的字符保留不变（它们写在元素里的文本保留原始大小写）。字母是Unicode字符集或者数字里定义的字符 ；因此单词开头的任何标点符号或者特殊符号将会被忽略。

Authors should not expect `capitalize` to follow language-specific titlecasing conventions (such as skipping articles in English).

`uppercase`

这个关键字强制所有字符被转换为大写。

`lowercase`

这个关键字强制所有字符被转换为小写。

`none`

这个关键字阻止所有字符的大小写被转换。

`full-width`

这个关键字强制字符 — 主要是表意字符和拉丁文字 — 书写进一个方形里，并允许它们按照一般的东亚文字（比如中文或日文）对齐。

## 水平垂直居中

### 水平居中

比较简单，可以用`flex`，可以用`text-align`

### 垂直居中

#### 单行内联(`inline-`)元素垂直居中

通过设置内联元素的高度(`height`)和行高(`line-height`)相等，从而使元素垂直居中。

**核心代码：**

```css
#v-box {
    height: 120px;
    line-height: 120px;
}
```

#### 利用flex布局（`flex`）

利用flex布局实现垂直居中，其中 `flex-direction: column` 定义主轴方向为纵向。因为flex布局是 `CSS3` 中定义，在较老的浏览器存在兼容性问题。

**核心代码：**

```css
.center-flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
```

## BFC IFC Flex

### BFC

`Block Formatting Context`，块级格式化上下文，一个独立的块级渲染区域，该区域拥有一套渲染规则来约束块级盒子的布局，且与区域外部无关。

#### BFC的应用

- 防止`margin`发生重叠
- 防止发生因浮动导致的高度塌陷

#### 怎么生成 BFC

- `float`的值不为`none`；
- `overflow`的值不为`visible`；
- `display`的值为`inline-block` `table-cell` `table-caption`；
- `position`的值为`absolute`或`fixed`；

### IFC

`IFC(Inline Formatting Contexts)`直译为"行内格式化上下文"，`IFC`的`line box`（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的 `padding/margin` 影响)

#### IFC有的特性

1. `IFC`中的`line box`一般左右都贴紧整个`IFC`，但是会因为`float`元素而扰乱。`float`元素会位于`IFC`与与`line box`之间，使得`line box`宽度缩短。
2. `IFC`中时不可能有块级元素的，当插入块级元素时（如`p`中插入`div`）会产生两个匿名块与`div`分隔开，即产生两个`IFC`，每个`IFC`对外表现为块级元素，与`div`垂直排列。

#### IFC的应用

1. 水平居中：当一个块要在环境中水平居中时，设置其为`inline-block`则会在外层产生`IFC`，通过`text-align`则可以使其水平居中。
2. 垂直居中：创建一个`IFC`，用其中一个元素撑开父元素的高度，然后设置其`vertical-align:middle`，其他行内元素则可以在此父元素下垂直居中。

### Flex

#### 容器

```
flex-direction //方向
flex-wrap //换行
flex-flow // 前两个属性的集合
justify-content  //主轴对齐方式
align-items //交叉轴对齐方式
align-content //多轴线对齐方式
```

#### 项目

```
order //顺序
flex-grow //放大比例，0为不放大
flex-shrink //缩小比例，默认1, 0为不缩小
flex-basis //分配前所占空间
flex // 上面3个属性的集合
align-self  //这个元素的对齐方式，覆盖容器的align-items
```

#### `flex:1` ？？？

可以使用一个，两个或三个值来指定 `flex`属性。

**单值语法**: 值必须为以下其中之一:

- 一个无单位**数**: 它会被当作`flex:<number> 1 0;` `<flex-shrink>`的值被假定为1，然后`<flex-basis>` 的值被假定为`0`。
- 一个有效的**宽度([`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width))**值: 它会被当作 `<flex-basis>的值。`
- 关键字`none`，`auto`或`initial`.

**双值语法**: 第一个值必须为一个无单位数，并且它会被当作 `<flex-grow>` 的值。第二个值必须为以下之一：

- 一个无单位数：它会被当作 `<flex-shrink>` 的值。
- 一个有效的宽度值: 它会被当作 `<flex-basis>` 的值。

**三值语法:**

- 第一个值必须为一个无单位数，并且它会被当作 `<flex-grow>` 的值。
- 第二个值必须为一个无单位数，并且它会被当作 `<flex-shrink>` 的值。
- 第三个值必须为一个有效的宽度值， 并且它会被当作 `<flex-basis>` 的值。

#### flex取值

- `initial`

  元素会根据自身宽高设置尺寸。它会缩短自身以适应 flex 容器，但不会伸长并吸收 flex 容器中的额外自由空间来适应 flex 容器 。相当于将属性设置为"`flex: 0 1 auto`"。

- `auto`

  元素会根据自身的宽度与高度来确定尺寸，但是会伸长并吸收 flex 容器中额外的自由空间，也会缩短自身来适应 flex 容器。这相当于将属性设置为 "`flex: 1 1 auto`".

- `none`

  元素会根据自身宽高来设置尺寸。它是完全非弹性的：既不会缩短，也不会伸长来适应 flex 容器。相当于将属性设置为"`flex: 0 0 auto`"。

# HTML相关

## `meta` 标签

#### [`charset`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-charset)

这个属性声明了文档的字符编码。如果使用了这个属性，其值必须是与 ASCII 大小写无关（ASCII case-insensitive）的"`utf-8`"。

#### [**`http-equiv`**](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-http-equiv)

属性定义了一个编译指示指令。这个属性叫做 `**http-equiv**(alent)` 是因为所有允许的值都是特定 HTTP 头部的名称，如下：

- `content-security-policy`
  它允许页面作者定义当前页的[内容策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)。 内容策略主要指定允许的服务器源和脚本端点，这有助于防止跨站点脚本攻击。

- `content-type`
  如果使用这个属性，其值必须是"`text/html; charset=utf-8`"。注意：该属性只能用于 [MIME type](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types) 为 `text/html` 的文档，不能用于 MIME 类型为 XML 的文档。

- `default-style`

  设置默认 [CSS 样式表](https://developer.mozilla.org/zh-CN/docs/Web/CSS)组的名称。

- `x-ua-compatible`
  如果指定，则 `content` 属性必须具有值 "`IE=edge`"。用户代理必须忽略此指示。

- `refresh`

  这个属性指定：

  - 如果 [`content`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-content) 只包含一个正整数，则为重新载入页面的时间间隔 (秒)；
  - 如果 [`content`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-content) 包含一个正整数，并且后面跟着字符串 '`;url=`' 和一个合法的 URL，则是重定向到指定链接的时间间隔 (秒)

#### meta 做 SEO

```
<title>Title of the page</title>
<meta name=”description” content=”Everything you need to know about meta tags for search engine optimization”>
<meta name=”keywords” content=”meta tags,search engine optimization” >
```



# 网络相关

## 从输入url到呈现网页

（1）首先会对 URL 进行解析，分析所需要使用的传输协议和请求的资源的路径。如果输入的 URL 中的协议或者主机名不合法，将会把地址栏中输入的内容传递给搜索引擎。如果没有问题，浏览器会检查 URL 中是否出现了非法字符，如果存在非法字符，则对非法字符进行转义后再进行下一过程。

（2）浏览器会判断所请求的资源是否在缓存里，如果请求的资源在缓存里并且没有失效，那么就直接使用，否则向服务器发起新的请求。

（3）下一步我们首先需要获取的是输入的 URL 中的域名的 IP 地址，首先会判断本地是否有该域名的 IP 地址的缓存，如果有则使用，如果没有则向本地 DNS 服务器发起请求。本地 DNS 服务器也会先检查是否存在缓存，如果没有就会先向根域名服务器发起请求，获得负责的顶级域名服务器的地址后，再向顶级域名服务器请求，然后获得负责的权威域名服务器的地址后，再向权威域名服务器发起请求，最终获得域名的 IP 地址后，本地 DNS 服务器再将这个 IP 地址返回给请求的用户。用户向本地 DNS 服务器发起请求属于递归请求，本地 DNS 服务器向各级域名服务器发起请求属于迭代请求。

（4）当浏览器得到 IP 地址后，数据传输还需要知道目的主机 MAC 地址，因为应用层下发数据给传输层，TCP 协议会指定源端口号和目的端口号，然后下发给网络层。网络层会将本机地址作为源地址，获取的 IP 地址作为目的地址。然后将下发给数据链路层，数据链路层的发送需要加入通信双方的 MAC 地址，我们本机的 MAC 地址作为源 MAC 地址，目的 MAC 地址需要分情况处理，通过将 IP 地址与我们本机的子网掩码相与，我们可以判断我们是否与请求主机在同一个子网里，如果在同一个子网里，我们可以使用 APR 协议获取到目的主机的 MAC 地址，如果我们不在一个子网里，那么我们的请求应该转发给我们的网关，由它代为转发，此时同样可以通过 ARP 协议来获取网关的 MAC 地址，此时目的主机的 MAC 地址应该为网关的地址。

（5）下面是 TCP 建立连接的三次握手的过程，首先客户端向服务器发送一个 SYN 连接请求报文段和一个随机序号，服务端接收到请求后向服务器端发送一个 SYN ACK报文段，确认连接请求，并且也向客户端发送一个随机序号。客户端接收服务器的确认应答后，进入连接建立的状态，同时向服务器也发送一个 ACK 确认报文段，服务器端接收到确认后，也进入连接建立状态，此时双方的连接就建立起来了。

（6）如果使用的是 HTTPS 协议，在通信前还存在 TLS 的一个四次握手的过程。首先由客户端向服务器端发送使用的协议的版本号、一个随机数和可以使用的加密方法。服务器端收到后，确认加密的方法，也向客户端发送一个随机数和自己的数字证书。客户端收到后，首先检查数字证书是否有效，如果有效，则再生成一个随机数，并使用证书中的公钥对随机数加密，然后发送给服务器端，并且还会提供一个前面所有内容的 hash 值供服务器端检验。服务器端接收后，使用自己的私钥对数据解密，同时向客户端发送一个前面所有内容的 hash 值供客户端检验。这个时候双方都有了三个随机数，按照之前所约定的加密方法，使用这三个随机数生成一把秘钥，以后双方通信前，就使用这个秘钥对数据进行加密后再传输。

（7）当页面请求发送到服务器端后，服务器端会返回一个 html 文件作为响应，浏览器接收到响应后，开始对 html 文件进行解析，开始页面的渲染过程。

（8）浏览器首先会根据 html 文件构建 DOM 树，根据解析到的 css 文件构建 CSSOM 树，如果遇到 script 标签，则判端是否含有 defer 或者 async 属性，要不然 script 的加载和执行会造成页面的渲染的阻塞。当 DOM 树和 CSSOM 树建立好后，根据它们来构建渲染树。渲染树构建好后，会根据渲染树来进行布局。布局完成后，最后使用浏览器的 UI 接口对页面进行绘制。这个时候整个页面就显示出来了。

（9）最后一步是 TCP 断开连接的四次挥手过程。

## HTTP协议

### HTTP 1.0/1.1/2.0/3.0

#### HTTP 1.0/1.1

HTTP 是超文本传输协议，它定义了客户端和服务器之间交换报文的格式和方式，默认使用 80 端口。它使用 TCP 作为传 输层协议，保证了数据传输的可靠性。

HTTP 是一个无状态的协议，HTTP 服务器不会保存关于客户的任何信息。

HTTP 有两种连接模式，一种是持续连接，一种非持续连接。非持续连接指的是服务器必须为每一个请求的对象建立和维护 一个全新的连接。持续连接下，TCP 连接默认不关闭，可以被多个请求复用。在 HTTP1.0 以前使用的非持续的连接，但是可以在请求时，加上 Connection: keep-alive 来要求服务器不要关闭 TCP 连接。HTTP1.1 以后默认采用的是持续的连接。目前对于同一个域，大多数浏览器支持 同时建立 6 个持久连接。

#### HTTP 请求报文

```
GET / HTTP/1.1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5)
Accept: */*
```

HTTP 请求报文的第一行叫做请求行，后面的行叫做首部行，首部行后还可以跟一个实体主体。请求首部之后有一个空行，这个空行不能省略，它用来划分首部与实体。

请求行包含三个字段：方法字段、URL 字段和 HTTP 版本字段。

方法字段可以取几种不同的值，一般有 GET、POST、HEAD、PUT 和 DELETE。一般 GET 方法只被用于向服务器获取数据。 POST 方法用于将实体提交到指定的资源，通常会造成服务器资源的修改。HEAD 方法与 GET 方法类似，但是在返回的响应 中，不包含请求对象。PUT 方法用于上传文件到服务器，DELETE 方法用于删除服务器上的对象，表达的是一种语义上的区别。

#### HTTP 响应报文

HTTP 响应报文的格式如下：

```
HTTP/1.0 200 OK
Content-Type: text/plain
Content-Length: 137582
Expires: Thu, 05 Dec 1997 16:00:00 GMT
Last-Modified: Wed, 5 August 1996 15:55:28 GMT
Server: Apache 0.84

<html>
  <body>Hello World</body>
</html>
```

HTTP 响应报文的第一行叫做状态行，后面的行是首部行，最后是实体主体。

状态行包含了三个字段：协议版本字段、状态码和相应的状态信息。

实体部分是报文的主要部分，它包含了所请求的对象。

##### 常见状态

200-请求成功、202-服务器端已经收到请求消息，但是尚未进行处理 301-永久移动、302-临时移动、304-所请求的资源未修改、 400-客户端请求的语法错误、404-请求的资源不存在 500-服务器内部错误。

一般 1XX 代表服务器接收到请求、2XX 代表成功、3XX 代表重定向、4XX 代表客户端错误、5XX 代表服务器端错误。

#### 首部行

首部可以分为四种首部，请求首部、响应首部、通用首部和实体首部。通用首部和实体首部在请求报文和响应报文中都可以设 置，区别在于请求首部和响应首部。

常见的请求首部有 Accept 可接收媒体资源的类型、Accept-Charset 可接收的字符集、Host 请求的主机名。

常见的响应首部有 ETag 资源的匹配信息，Location 客户端重定向的 URI。

常见的通用首部有 Cache-Control 控制缓存策略、Connection 管理持久连接。

常见的实体首部有 Content-Length 实体主体的大小、Expires 实体主体的过期时间、Last-Modified 资源的最后修改时间。

##### 常见的 Content-Type

- text/html ： HTML格式
- text/plain ：纯文本格式
- text/xml ： XML格式
- image/gif ：gif图片格式
- image/jpeg ：jpg图片格式
- image/png：png图片格式

- application/xml： XML数据格式
- application/json： JSON数据格式
- application/octet-stream ： 二进制流数据（如常见的文件下载）
- application/x-www-form-urlencoded ：form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）

- multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式

#### HTTP/1.1 协议缺点

HTTP/1.1 默认使用了持久连接，多个请求可以复用同一个 TCP 连接，但是在同一个 TCP 连接里面，数据请求的通信次序 是固定的。服务器只有处理完一个请求的响应后，才会进行下一个请求的处理，如果前面请求的响应特别慢的话，就会造成许多请求排队等待的情况，这种情况被称为“队头堵塞”。队头阻塞会导致持久连接在达到最大数量时，剩余的资源需要等待其他 资源请求完成后才能发起请求。

为了避免这个问题，一个是减少请求数，一个是同时打开多个持久连接。这就是我们对网站优化时，使用雪碧图、合并脚本的 原因。

### HTTP/2 协议

2009 年，谷歌公开了自行研发的 SPDY 协议，主要解决 HTTP/1.1 效率不高的问题。这个协议在 Chrome 浏览器上证明 可行以后，就被当作 HTTP/2 的基础，主要特性都在 HTTP/2 之中得到继承。2015 年，HTTP/2 发布。

HTTP/2 主要有以下新的特性：

#### 二进制协议

HTTP/2 是一个二进制协议。在 HTTP/1.1 版中，报文的头信息必须是文本（ASCII 编码），数据体可以是文本，也可以是 二进制。HTTP/2 则是一个彻底的二进制协议，头信息和数据体都是二进制，并且统称为"帧"，可以分为头信息帧和数据帧。 帧的概念是它实现多路复用的基础。

#### 多路复用

**HTTP/2 实现了多路复用，HTTP/2 仍然复用 TCP 连接，但是在一个连接里，客户端和服务器都可以同时发送多个请求或回 应，而且不用按照顺序一一发送，这样就避免了"队头堵塞"的问题。**

#### 数据流

HTTP/2 使用了数据流的概念，因为 HTTP/2 的数据包是不按顺序发送的，同一个连接里面连续的数据包，可能属于不同的 请求。因此，必须要对数据包做标记，指出它属于哪个请求。HTTP/2 将每个请求或回应的所有数据包，称为一个数据流。每个数据流都有一个独一无二的编号。数据包发送的时候，都必须标记数据流 ID ，用来区分它属于哪个数据流。

#### 头信息压缩

HTTP/2 实现了头信息压缩，由于 HTTP 1.1 协议不带有状态，每次请求都必须附上所有信息。所以，请求的很多字段都是 重复的，比如 Cookie 和 User Agent ，一模一样的内容，每次请求都必须附带，这会浪费很多带宽，也影响速度。

HTTP/2 对这一点做了优化，引入了头信息压缩机制。一方面，头信息使用 gzip 或 compress 压缩后再发送；另一方面， 客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，生成一个索引号，以后就不发送同样字段了，只发送索引号，这样就能提高速度了。

#### 服务器推送

HTTP/2 允许服务器未经请求，主动向客户端发送资源，这叫做服务器推送。使用服务器推送，提前给客户端推送必要的资源 ，这样就可以相对减少一些延迟时间。这里需要注意的是 http2 下服务器主动推送的是静态资源，和 WebSocket 以及使用 SSE 等方式向客户端发送即时数据的推送是不同的。

详细的资料可以参考： [《HTTP 协议入门》](http://www.ruanyifeng.com/blog/2016/08/http.html) [《HTTP/2 服务器推送（Server Push）教程》](http://www.ruanyifeng.com/blog/2018/03/http2_server_push.html)

#### HTTP/2 协议缺点

因为 HTTP/2 使用了多路复用，一般来说同一域名下只需要使用一个 TCP 连接。由于多个数据流使用同一个 TCP 连接，遵守同一个流量状态控制和拥塞控制。只要一个数据流遭遇到拥塞，剩下的数据流就没法发出去，这样就导致了后面的所有数据都 会被阻塞。HTTP/2 出现的这个问题是由于其使用 TCP 协议的问题，与它本身的实现其实并没有多大关系。

#### HTTP/3 协议

由于 TCP 本身存在的一些限制，Google 就开发了一个基于 UDP 协议的 QUIC 协议，并且使用在了 HTTP/3 上。 QUIC 协议在 UDP 协议上实现了多路复用、有序交付、重传等等功能

详细资料可以参考： [《如何看待 HTTP/3 ？》](https://www.zhihu.com/question/302412059)

### HTTPS 协议

#### HTTP 存在的问题

1. HTTP 报文使用明文方式发送，可能被第三方窃听。
2. HTTP 报文可能被第三方截取后修改通信内容，接收方没有办法发现报文内容的修改。
3. HTTP 还存在认证的问题，第三方可以冒充他人参与通信。

#### HTTPS 简介

HTTPS 指的是超文本传输安全协议，HTTPS 是基于 HTTP 协议的，不过它会使用 TLS/SSL 来对数据加密。使用 TLS/ SSL 协议，所有的信息都是加密的，第三方没有办法窃听。并且它提供了一种校验机制，信息一旦被篡改，通信的双方会立 刻发现。它还配备了身份证书，防止身份被冒充的情况出现。

#### TLS 握手过程

1. 第一步，客户端向服务器发起请求，请求中包含使用的协议版本号、生成的一个随机数、以及客户端支持的加密方法。
2. 第二步，服务器端接收到请求后，确认双方使用的加密方法、并给出服务器的证书、以及一个服务器生成的随机数。
3. 第三步，客户端确认服务器证书有效后，生成一个新的随机数，并使用数字证书中的公钥，加密这个随机数，然后发给服务器。并且还会提供一个前面所有内容的 hash 的值，用来供服务器检验。
4. 第四步，服务器使用自己的私钥，来解密客户端发送过来的随机数。并提供前面所有内容的 hash 值来供客户端检验。
5. 第五步，客户端和服务器端根据约定的加密方法使用前面的三个随机数，生成对话秘钥，以后的对话过程都使用这个秘钥 来加密信息。

#### 实现原理

TLS 的握手过程主要用到了三个方法来保证传输的安全。

首先是对称加密的方法，对称加密的方法是，双方使用同一个秘钥对数据进行加密和解密。但是对称加密的存在一个问题，就 是如何保证秘钥传输的安全性，因为秘钥还是会通过网络传输的，一旦秘钥被其他人获取到，那么整个加密过程就毫无作用了。 这就要用到非对称加密的方法。

非对称加密的方法是，我们拥有两个秘钥，一个是公钥，一个是私钥。公钥是公开的，私钥是保密的。用私钥加密的数据，只 有对应的公钥才能解密，用公钥加密的数据，只有对应的私钥才能解密。我们可以将公钥公布出去，任何想和我们通信的客户， 都可以使用我们提供的公钥对数据进行加密，这样我们就可以使用私钥进行解密，这样就能保证数据的安全了。但是非对称加 密有一个缺点就是加密的过程很慢，因此如果每次通信都使用非对称加密的方式的话，反而会造成等待时间过长的问题。

因此我们可以使用对称加密和非对称加密结合的方式，因为对称加密的方式的缺点是无法保证秘钥的安全传输，因此我们可以 非对称加密的方式来对对称加密的秘钥进行传输，然后以后的通信使用对称加密的方式来加密，这样就解决了两个方法各自存 在的问题。

但是现在的方法也不一定是安全的，因为我们没有办法确定我们得到的公钥就一定是安全的公钥。可能存在一个中间人，截取 了对方发给我们的公钥，然后将他自己的公钥发送给我们，当我们使用他的公钥加密后发送的信息，就可以被他用自己的私钥 解密。然后他伪装成我们以同样的方法向对方发送信息，这样我们的信息就被窃取了，然而我们自己还不知道。

为了解决这样的问题，我们可以使用数字证书的方式，首先我们使用一种 Hash 算法来对我们的公钥和其他信息进行加密生成 一个信息摘要，然后让有公信力的认证中心（简称 CA ）用它的私钥对消息摘要加密，形成签名。最后将原始的信息和签名合 在一起，称为数字证书。当接收方收到数字证书的时候，先根据原始信息使用同样的 Hash 算法生成一个摘要，然后使用公证 处的公钥来对数字证书中的摘要进行解密，最后将解密的摘要和我们生成的摘要进行对比，就能发现我们得到的信息是否被更改 了。这个方法最要的是认证中心的可靠性，一般浏览器里会内置一些顶层的认证中心的证书，相当于我们自动信任了他们，只有 这样我们才能保证数据的安全。

### DNS 协议

#### 概况

DNS 协议提供的是一种主机名到 IP 地址的转换服务，就是我们常说的域名系统。它是一个由分层的 DNS 服务器组成的分 布式数据库，是定义了主机如何查询这个分布式数据库的方式的应用层协议。DNS 协议运行在 UDP 协议之上，使用 53 号 端口。

#### 域名的层级结构

域名的层级结构可以如下

```
主机名.次级域名.顶级域名.根域名

# 即

host.sld.tld.root
```

根据域名的层级结构，管理不同层级域名的服务器，可以分为根域名服务器、顶级域名服务器和权威域名服务器。

#### 查询过程

DNS 的查询过程一般为，我们首先将 DNS 请求发送到本地 DNS 服务器，由本地 DNS 服务器来代为请求。

1. 从"根域名服务器"查到"顶级域名服务器"的 NS 记录和 A 记录（ IP 地址）。
2. 从"顶级域名服务器"查到"次级域名服务器"的 NS 记录和 A 记录（ IP 地址）。
3. 从"次级域名服务器"查出"主机名"的 IP 地址。

比如我们如果想要查询 [www.baidu.com](http://www.baidu.com/) 的 IP 地址，我们首先会将请求发送到本地的 DNS 服务器中，本地 DNS 服务 器会判断是否存在该域名的缓存，如果不存在，则向根域名服务器发送一个请求，根域名服务器返回负责 .com 的顶级域名 服务器的 IP 地址的列表。然后本地 DNS 服务器再向其中一个负责 .com 的顶级域名服务器发送一个请求，负责 .com 的顶级域名服务器返回负责 .baidu 的权威域名服务器的 IP 地址列表。然后本地 DNS 服务器再向其中一个权威域名服 务器发送一个请求，最后权威域名服务器返回一个对应的主机名的 IP 地址列表。

#### DNS 记录和报文

DNS 服务器中以资源记录的形式存储信息，每一个 DNS 响应报文一般包含多条资源记录。一条资源记录的具体的格式为

（Name，Value，Type，TTL）

其中 TTL 是资源记录的生存时间，它定义了资源记录能够被其他的 DNS 服务器缓存多长时间。

常用的一共有四种 Type 的值，分别是 A、NS、CNAME 和 MX ，不同 Type 的值，对应资源记录代表的意义不同。

1. 如果 Type = A，则 Name 是主机名，Value 是主机名对应的 IP 地址。因此一条记录为 A 的资源记录，提供了标 准的主机名到 IP 地址的映射。
2. 如果 Type = NS，则 Name 是个域名，Value 是负责该域名的 DNS 服务器的主机名。这个记录主要用于 DNS 链式 查询时，返回下一级需要查询的 DNS 服务器的信息。
3. 如果 Type = CNAME，则 Name 为别名，Value 为该主机的规范主机名。该条记录用于向查询的主机返回一个主机名 对应的规范主机名，从而告诉查询主机去查询这个主机名的 IP 地址。主机别名主要是为了通过给一些复杂的主机名提供 一个便于记忆的简单的别名。
4. 如果 Type = MX，则 Name 为一个邮件服务器的别名，Value 为邮件服务器的规范主机名。它的作用和 CNAME 是一 样的，都是为了解决规范主机名不利于记忆的缺点。

#### 递归查询和迭代查询

递归查询指的是查询请求发出后，域名服务器代为向下一级域名服务器发出请求，最后向用户返回查询的最终结果。使用递归 查询，用户只需要发出一次查询请求。

迭代查询指的是查询请求后，域名服务器返回单次查询的结果。下一级的查询由用户自己请求。使用迭代查询，用户需要发出 多次的查询请求。

一般我们向本地 DNS 服务器发送请求的方式就是递归查询，因为我们只需要发出一次请求，然后本地 DNS 服务器返回给我 们最终的请求结果。而本地 DNS 服务器向其他域名服务器请求的过程是迭代查询的过程，因为每一次域名服务器只返回单次 查询的结果，下一级的查询由本地 DNS 服务器自己进行。

#### DNS 缓存

DNS 缓存的原理非常简单，在一个请求链中，当某个 DNS 服务器接收到一个 DNS 回答后，它能够将回答中的信息缓存在本 地存储器中。返回的资源记录中的 TTL 代表了该条记录的缓存的时间。

#### DNS 实现负载平衡

DNS 可以用于在冗余的服务器上实现负载平衡。因为现在一般的大型网站使用多台服务器提供服务，因此一个域名可能会对应 多个服务器地址。当用户发起网站域名的 DNS 请求的时候，DNS 服务器返回这个域名所对应的服务器 IP 地址的集合，但在 每个回答中，会循环这些 IP 地址的顺序，用户一般会选择排在前面的地址发送请求。以此将用户的请求均衡的分配到各个不 同的服务器上，这样来实现负载均衡。

## TCP握手与挥手

### 握手

第一次握手，客户端向服务器发送一个 SYN 连接请求报文段，报文段的首部中 SYN 标志位置为 1，序号字段是一个任选的 随机数。它代表的是客户端数据的初始序号。

第二次握手，服务器端接收到客户端发送的 SYN 连接请求报文段后，服务器首先会为该连接分配 TCP 缓存和变量，然后向 客户端发送 SYN ACK 报文段，报文段的首部中 SYN 和 ACK 标志位都被置为 1，代表这是一个对 SYN 连接请求的确认， 同时序号字段是服务器端产生的一个任选的随机数，它代表的是服务器端数据的初始序号。确认号字段为客户端发送的序号加 一。

第三次握手，客户端接收到服务器的肯定应答后，它也会为这次 TCP 连接分配缓存和变量，同时向服务器端发送一个对服务 器端的报文段的确认。第三次握手可以在报文段中携带数据。

在我看来，TCP 三次握手的建立连接的过程就是相互确认**初始序号**的过程，告诉对方，什么样**序号**的报文段能够被正确接收。 第三次握手的作用是**客户端对服务器端的初始序号的确认**。如果只使用两次握手，那么服务器就没有办法知道自己的序号是否 已被确认。同时这样也是为了防止失效的请求报文段被服务器接收，而出现错误的情况。

### 挥手

因为 TCP 连接是全双工的，也就是说通信的双方都可以向对方发送和接收消息，所以断开连接需要双方的确认。

第一次挥手，客户端认为没有数据要再发送给服务器端，它就向服务器发送一个 FIN 报文段，申请断开客户端到服务器端的 连接。发送后客户端进入 FIN_WAIT_1 状态。

第二次挥手，服务器端接收到客户端释放连接的请求后，向客户端发送一个确认报文段，表示已经接收到了客户端释放连接的 请求，以后不再接收客户端发送过来的数据。但是因为连接是全双工的，所以此时，服务器端还可以向客户端发送数据。服务 器端进入 CLOSE_WAIT 状态。客户端收到确认后，进入 FIN_WAIT_2 状态。

第三次挥手，服务器端发送完所有数据后，向客户端发送 FIN 报文段，申请断开服务器端到客户端的连接。发送后进入 LAS T_ACK 状态。

第四次挥手，客户端接收到 FIN 请求后，向服务器端发送一个确认应答，并进入 TIME_WAIT 阶段。该阶段会持续一段时间， 这个时间为报文段在网络中的最大生存时间，如果该时间内服务端没有重发请求的话，客户端进入 CLOSED 的状态。如果收到 服务器的重发请求就重新发送确认报文段。服务器端收到客户端的确认报文段后就进入 CLOSED 状态，这样全双工的连接就被 释放了。

TCP 使用四次挥手的原因是因为 TCP 的连接是全双工的，所以需要双方分别释放到对方的连接，单独一方的连接释放，只代 表不能再向对方发送数据，连接处于的是半释放的状态。

最后一次挥手中，客户端会等待一段时间再关闭的原因，是为了防止发送给服务器的确认报文段丢失或者出错，从而导致服务器 端不能正常关闭。

## 缓存

### 强缓存

#### Expires

**Expires是HTTP 1.0提出的一个表示资源过期时间的header，它描述的是一个绝对时间，由服务器返回，用GMT格式的字符串表示**，如：`Expires:Thu, 31 Dec 2037 23:55:55 GMT` ，包含了Expires头标签的文件，就说明浏览器对于该文件缓存具有非常大的控制权。

例如，一个文件的Expires值是2020年的1月1日，那么就代表，在2020年1月1日之前，浏览器都可以直接使用该文件的本地缓存文件，而不必去服务器再次请求该文件，哪怕服务器文件发生了变化。

所以，**Expires是优化中最理想的情况，因为它根本不会产生请求**，所以后端也就无需考虑查询快慢。

##### 原理

1、浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，在response的header加上Expires的header。

2、浏览器在接收到这个资源后，会把这个资源连同所有response header一起缓存下来（所以缓存命中的请求返回的header并不是来自服务器，而是来自之前缓存的header）；

3、浏览器再请求这个资源时，**先从缓存中寻找，找到这个资源后，拿出它的Expires跟当前的请求时间比较**，如果请求时间在Expires指定的时间之前，就能命中缓存，否则就不行；

4、如果缓存没有命中，浏览器直接从服务器加载资源时，Expires Header在重新加载的时候会被更新；

#### Cache-Control

**Cache-Control，这是一个相对时间，在配置缓存的时候，以秒为单位，用数值表示**，如： `Cache-Control:max-age=315360000` 。

##### 原理

1、浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，在response的header加上Cache-Control的header。

2、浏览器在接收到这个资源后，会把这个资源连同所有response header一起缓存下来；

3、浏览器再请求这个资源时，**先从缓存中寻找，找到这个资源后，根据它第一次的请求时间和Cache-Control设定的有效期**，计算出一个资源过期时间，再拿这个过期时间跟当前的请求时间比较，如果请求时间在过期时间之前，就能命中缓存，否则就不行；

4、如果缓存没有命中，浏览器直接从服务器加载资源时，**Cache-Control Header在重新加载的时候会被更新**；

此外，还可以为 Cache-Control 指定 `public` 或 `private` 标记。**如果使用 private，则表示该资源仅仅属于发出请求的最终用户，这将禁止中间服务器（如代理服务器）缓存此类资源**。对于包含用户个人信息的文件（如一个包含用户名的 HTML 文档），可以设置 private，一方面由于这些缓存对其他用户来说没有任何意义，另一方面用户可能不希望相关文件储存在不受信任的服务器上。需要指出的是，private 并不会使得缓存更加安全，它同样会传给中间服务器（如果网站对于传输的安全性要求很高，应该使用传输层安全措施）。**对于 public，则允许所有服务器缓存该资源**。通常情况下，对于所有人都可以访问的资源（例如网站的 logo、图片、脚本等），**Cache-Control 默认设为 public 是合理的**。

这两个header可以只启用一个，也可以同时启用，**当response header中，Expires和Cache-Control同时存在时，Cache-Control优先级高于Expires**

### 协商缓存

当浏览器对某个资源的请求没有命中强缓存，**就会发一个请求到服务器，验证协商缓存是否命中，如果协商缓存命中，请求响应返回的http状态为304并且会显示一个Not Modified的字符串**。

#### Last-Modified If-Modified-Since

1、浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，**在response的header加上Last-Modified的header，这个header表示这个资源在服务器上的最后修改时间**

2、浏览器再次跟服务器请求这个资源时，**在request的header上加上If-Modified-Since的header**，这个header的值就是上一次请求时返回的Last-Modified的值。

3、服务器再次收到资源请求时，**根据浏览器传过来If-Modified-Since和资源在服务器上的最后修改时间判断资源是否有变化**，如果没有变化则返回304 Not Modified，但是不会返回资源内容；如果有变化，就正常返回资源内容。**当服务器返回304 Not Modified的响应时，response header中不会再添加Last-Modified的header**，因为既然资源没有变化，那么Last-Modified也就不会改变。

4、浏览器收到304的响应后，就会从缓存中加载资源。

5、如果协商缓存没有命中，浏览器直接从服务器加载资源时，**Last-Modified Header在重新加载的时候会被更新**，下次请求时，**If-Modified-Since会启用上次返回的Last-Modified值**。

#### ETag、If-None-Match

1、浏览器第一次跟服务器请求一个资源，**服务器在返回这个资源的同时，在response的header加上ETag的header**，这个header是服务器根据当前请求的资源生成的一个唯一标识，**这个唯一标识是一个字符串，只要资源有变化这个串就不同**，跟最后修改时间没有关系，所以能很好的补充Last-Modified的问题。

2、浏览器再次跟服务器请求这个资源时，**在request的header上加上If-None-Match的header**，这个header的值就是上一次请求时返回的ETag的值：

3、服务器再次收到资源请求时，**根据浏览器传过来If-None-Match和然后再根据资源生成一个新的ETag**，如果这两个值相同就说明资源没有变化，否则就是有变化；如果没有变化则返回304 Not Modified，但是不会返回资源内容；如果有变化，就正常返回资源内容。与Last-Modified不一样的是，当服务器返回304 Not Modified的响应时，**由于ETag重新生成过，response header中还会把这个ETag返回**，即使这个ETag跟之前的没有变化：

4、浏览器收到304的响应后，就会从缓存中加载资源。

Etag和Last-Modified非常相似，都是用来判断一个参数，从而决定是否启用缓存。**但是ETag相对于Last-Modified也有其优势，可以更加准确的判断文件内容是否被修改**，从而在实际操作中实用程度也更高。

协商缓存跟强缓存不一样，强缓存不发请求到服务器，**所以有时候资源更新了浏览器还不知道，但是协商缓存会发请求到服务器**，所以资源是否更新，服务器肯定知道。大部分web服务器都默认开启协商缓存，而且是同时启用【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】。

### 用户操作导致的缓存失效

当用户在按`F5`进行刷新的时候，会忽略Expires/Cache-Control的设置，会再次发送请求去服务器请求，而Last-Modified/Etag还是有效的，服务器会根据情况判断返回304还是200；
而当用户使用`Ctrl+F5`进行强制刷新的时候，只是所有的缓存机制都将失效，重新从服务器拉去资源。

## CDN

内容分发网络（Content Delivery Network，简称CDN）是建立并覆盖在承载网之上，由分布在不同区域的边缘节点服务器群组成的分布式网络。
CDN应用广泛，支持多种行业、多种场景内容加速，例如：图片小文件、大文件下载、视音频点播、直播流媒体、全站加速、安全加速。

### **CDN缓存策略**

CDN边缘节点缓存策略因服务商不同而不同，但一般都会遵循http标准协议，通过http响应头中的Cache-control: max-age的字段来设置CDN边缘节点数据缓存时间。

当客户端向CDN节点请求数据时，CDN节点会判断缓存数据是否过期，若缓存数据并没有过期，则直接将缓存数据返回给客户端；否则，CDN节点就会向源站发出回源请求，从源站拉取最新数据，更新本地缓存，并将最新数据返回给客户端。

CDN服务商一般会提供基于文件后缀、目录多个维度来指定CDN缓存时间，为用户提供更精细化的缓存管理。

CDN缓存时间会对“回源率”产生直接的影响。若CDN缓存时间较短，CDN边缘节点上的数据会经常失效，导致频繁回源，增加了源站的负载，同时也增大的访问延时；若CDN缓存时间太长，会带来数据更新时间慢的问题。开发者需要增对特定的业务，来做特定的数据缓存时间管理。

### **CDN缓存刷新**

CDN边缘节点对开发者是透明的，相比于浏览器Ctrl+F5的强制刷新来使浏览器本地缓存失效，开发者可以通过CDN服务商提供的“刷新缓存”接口来达到清理CDN边缘节点缓存的目的。这样开发者在更新数据后，可以使用“刷新缓存”功能来强制CDN节点上的数据缓存过期，保证客户端在访问时，拉取到最新的数据。

# 工程与应用相关

## 懒加载

首先将页面上的图片的 src 属性设为空字符串，而图片的真实路径则设置在data-original属性中， 当页面滚动的时候需要去监听scroll事件，在scroll事件的回调中，判断我们的懒加载的图片是否进入可视区域,如果图片在可视区内将图片的 src 属性设置为data-original 的值，这样就可以实现延迟加载。

先获取所有图片的 `dom`，通过 `document.body.clientHeight` 获取可视区高度，再使用 `element.getBoundingClientRect()` API 直接得到元素相对浏览的 top 值， 遍历每个图片判断当前图片是否到了可视区范围内。

```javascript
function lazyload() {
  let viewHeight = document.body.clientHeight //获取可视区高度
  let imgs = document.querySelectorAll('img[data-src]')
  imgs.forEach((item, index) => {
    if (item.dataset.src === '') return

    // 用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
    let rect = item.getBoundingClientRect()
    if (rect.bottom >= 0 && rect.top < viewHeight) {
      item.src = item.dataset.src
      item.removeAttribute('data-src')
    }
  })
}
```

最后给 window 绑定 `onscroll` 事件

```javascript
window.addEventListener('scroll', lazyload)
```

**注意运用节流。**

`IntersectionObserver` 是一个新的 API，可以自动"观察"元素是否可见，Chrome 51+ 已经支持。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。我们来看一下它的用法：

```javascript
var io = new IntersectionObserver(callback, option)

// 开始观察
io.observe(document.getElementById('example'))

// 停止观察
io.unobserve(element)

// 关闭观察器
io.disconnect()
```

### IntersectionObserver

`IntersectionObserver` 是浏览器原生提供的构造函数，接受两个参数：callback 是可见性变化时的回调函数，option 是配置对象（该参数可选）。

目标元素的可见性变化时，就会调用观察器的回调函数 callback。callback 一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

```javascript
var io = new IntersectionObserver((entries) => {
  console.log(entries)
})
```

callback 函数的参数`（entries）`是一个数组，每个成员都是一个 `IntersectionObserverEntry` 对象。举例来说，如果同时有两个被观察的对象的可见性发生变化，`entries` 数组就会有两个成员。

- time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
- target：被观察的目标元素，是一个 DOM 节点对象
- isIntersecting: 目标是否可见
- rootBounds：根元素的矩形区域的信息，`getBoundingClientRect()`方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回 null
- boundingClientRect：目标元素的矩形区域的信息
- intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
- intersectionRatio：目标元素的可见比例，即 `intersectionRect` 占 `boundingClientRect` 的比例，完全可见时为 1，完全不可见时小于等于 0

下面我们用 `IntersectionObserver` 实现图片懒加载

```javascript
const imgs = document.querySelectorAll('img[data-src]')
const config = {
  rootMargin: '0px',
  threshold: 0,
}
let observer = new IntersectionObserver((entries, self) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let img = entry.target
      let src = img.dataset.src
      if (src) {
        img.src = src
        img.removeAttribute('data-src')
      }
      // 解除观察
      self.unobserve(entry.target)
    }
  })
}, config)

imgs.forEach((image) => {
  observer.observe(image)
})
```

## 前端路由

### hash 模式

hash 就是指 url 后的 # 号以及后面的字符

由于 hash 值的变化不会导致浏览器像服务器发送请求，而且 hash 的改变会触发 hashchange 事件，浏览器的前进后退也能对其进行控制，所以在 H5 的 history 模式出现之前，基本都是使用 hash 模式来实现前端路由。

```js
window.location.hash = 'hash字符串'; // 用于设置 hash 值

let hash = window.location.hash; // 获取当前 hash 值

// 监听hash变化，点击浏览器的前进后退会触发
window.addEventListener('hashchange', function(event){ 
    let newURL = event.newURL; // hash 改变后的新 url
    let oldURL = event.oldURL; // hash 改变前的旧 url
},false)
```

### history模式

#### history api

```
history.pushState();         // 添加新的状态到历史状态栈
history.replaceState();      // 用新的状态代替当前状态
history.state                // 返回当前状态对象
```

history.pushState() 和 history.replaceState() 的区别在于：

- history.pushState() 在保留现有历史记录的同时，将 url 加入到历史记录中。
- history.replaceState() 会将历史记录中的当前页面历史替换为 url。

由于 history.pushState() 和 history.replaceState() 可以改变 url 同时，不会刷新页面，所以在 HTML5 中的 histroy 具备了实现前端路由的能力。

#### `window.location`

##### 常用API

[`Location.href`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/href)

包含整个URL的一个[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)

[`Location.protocol` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Location/protocol)

包含URL对应协议的一个[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)，最后有一个":"。

[`Location.host`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/host)

包含了域名的一个[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)，可能在该串最后带有一个":"并跟上URL的端口号。

[`Location.hostname`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/hostname)

包含URL域名的一个[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)。

[`Location.port` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Location/port)

包含端口号的一个[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)。

[`Location.pathname` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname)

包含URL中路径部分的一个[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)，开头有一个“`/"。`

## 前端安全问题以及解决方案

### XSS攻击

#### 存储型

存储型 XSS 的攻击步骤：

1. 攻击者将恶意代码提交到目标网站的数据库中。
2. 
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等。

#### 反射型

反射型 XSS 的攻击步骤：

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
2. 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

反射型 XSS 跟存储型 XSS 的区别是：存储型 XSS 的恶意代码存在数据库里，反射型 XSS 的恶意代码存在 URL 里。

反射型 XSS 漏洞常见于通过 URL 传递参数的功能，如网站搜索、跳转等。

由于需要用户主动打开恶意的 URL 才能生效，攻击者往往会结合多种手段诱导用户点击。

POST 的内容也可以触发反射型 XSS，只不过其触发条件比较苛刻（需要构造表单提交页面，并引导用户点击），所以非常少见。

#### DOM型

DOM 型 XSS 的攻击步骤：

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
2. 用户打开带有恶意代码的 URL。
3. 用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

DOM 型 XSS 跟前两种 XSS 的区别：DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

#### 防范方法

必要的输入过滤

改成纯前端渲染，把代码和数据分隔开。

对 HTML 做充分转义。（在输出时）

使用CSP

##### 预防DOM型

在涉及以下字符串拼接时注意：

```html
<!-- 内联事件监听器中包含恶意代码 -->
<img onclick="UNTRUSTED" onerror="UNTRUSTED" src="data:image/png,">

<!-- 链接内包含恶意代码 -->
<a href="UNTRUSTED">1</a>

<script>
// setTimeout()/setInterval() 中调用恶意代码
setTimeout("UNTRUSTED")
setInterval("UNTRUSTED")

// location 调用恶意代码
location.href = 'UNTRUSTED'

// eval() 中调用恶意代码
eval("UNTRUSTED")
</script>

```

在使用时避免在字符串中拼接不可信数据。

### CSRF 攻击

#### GET型

```html
 <img src="http://bank.example/withdraw?amount=10000&for=hacker" > 
```

通过一个HTTP请求

#### POST型

```html
 <form action="http://bank.example/withdraw" method=POST>
    <input type="hidden" name="account" value="xiaoming" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script> 

```

通过提交一个自动提交的表单

#### 链接型

```html
  <a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
  重磅消息！！
  <a/>

```

用户点击链接触发

#### 防范方法

##### 同源检测

使用Referer Header确定来源域名

根据HTTP协议，在HTTP头中有一个字段叫Referer，记录了该HTTP请求的来源地址。 对于Ajax请求，图片和script等资源请求，Referer为发起请求的页面地址。对于页面跳转，Referer为打开页面历史记录的前一个页面地址。因此我们使用Referer中链接的Origin部分可以得知请求的来源域名。

当Origin和Referer头文件不存在时该怎么办？如果Origin和Referer都不存在，建议直接进行阻止，特别是如果您没有使用随机CSRF Token（参考下方）作为第二次检查。

通过Header的验证，我们可以知道发起请求的来源域名，这些来源域名可能是网站本域，或者子域名，或者有授权的第三方域名，又或者来自不可信的未知域名。

我们已经知道了请求域名是否是来自不可信的域名，我们直接阻止掉这些的请求，就能防御CSRF攻击了吗？

且慢！当一个请求是页面请求（比如网站的主页），而来源是搜索引擎的链接（例如百度的搜索结果），也会被当成疑似CSRF攻击。所以在判断的时候需要过滤掉页面请求情况。

CSRF大多数情况下来自第三方域名，但并不能排除本域发起。如果攻击者有权限在本域发布评论（含链接、图片等，统称UGC），那么它可以直接在本域发起攻击，这种情况下同源策略无法达到防护的作用。

##### CSRF Token



##### 双重 token



##### Samesite cookie



### 点击劫持



