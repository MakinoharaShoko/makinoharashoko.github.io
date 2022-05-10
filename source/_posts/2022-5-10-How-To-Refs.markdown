---
layout:     post
title:      在 TS 中使用 Refs
intro:   ""
date:       2022-5-10 17:30:00
author:     "Mahiru"
catalog: true
tags:
    - 工程开发
---

## 为什么要使用 Refs

当父组件想要获取子组件的实例或者父组件想要调取子组件的方法时，我们通常使用 Refs。

## React 官方关于使用 Refs 时机的说明

### 何时使用 Refs

下面是几个适合使用 refs 的情况：

- 管理焦点，文本选择或媒体播放。
- 触发强制动画。
- 集成第三方 DOM 库。

避免使用 refs 来做任何可以通过声明式实现来完成的事情。

举个例子，避免在 `Dialog` 组件里暴露 `open()` 和 `close()` 方法，最好传递 `isOpen` 属性。

### 勿过度使用 Refs

你可能首先会想到使用 refs 在你的 app 中“让事情发生”。如果是这种情况，请花一点时间，认真再考虑一下 state 属性应该被安排在哪个组件层中。通常你会想明白，让更高的组件层级拥有这个 state，是更恰当的。查看 [状态提升](https://zh-hans.reactjs.org/docs/lifting-state-up.html) 以获取更多有关示例。

## 在 TypeScript 中使用 Refs

### 子组件如何传递 Refs

```tsx
import {forwardRef, ReactNode, useImperativeHandle, useRef, useState} from "react";

// 传递的 Refs 的类型声明
export type TestRefRef = {
  increment: () => void;
};

// 子组件的传入参数
type TestRefProps = {
  children?: ReactNode | null;
};

// 使用 forwardRef 来进行 Ref 转发
export const TestRef = forwardRef<TestRefRef, TestRefProps>(
  (props, ref) => {
    const [count, setCount] = useState(0);
    // increment 是一个我们希望暴露出去的子组件函数，可以被父组件调用
    const increment = () => setCount(count + 1);
    // useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值
    useImperativeHandle(ref, () => ({
      // 将 increment 暴露出去
      increment
    }));
    return (<div>Test Ref：{count}</div>);
  }
);

```

### 父组件如何获得 Refs

```tsx
import './App.css'
import {TestRef, TestRefRef} from "./components/testRef";
import React from 'react';

function App() {
  // 在获取 ref 时，我们需要标注 ref 的类型（使用泛型），初始化值为 null。
  const ref = React.useRef<TestRefRef>(null);
  const logRef = () => {
    // 通过 ref.current 访问实例。
    console.log(ref.current); // {increment: ƒ}
    // 调用一个实例函数
    ref.current!.increment(); // 使用 ! 是一个断言，用于在 TS 中假定该属性存在。
  }
  return (
      <div className="App">
        {/* 获取子组件的 ref */}
        <TestRef ref={ref}/>
        <button onClick={logRef}>Log Ref and increase</button>
      </div>
  )
}

export default App

```

