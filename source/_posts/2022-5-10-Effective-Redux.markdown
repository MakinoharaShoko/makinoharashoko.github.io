---
layout:     post
title:      Effective React Redux
intro:   ""
date:       2022-5-10 17:00:00
author:     "Mahiru"
catalog: true
tags:
    - 工程开发
---

## 高效使用 React + Redux

### 使用 redux-toolkit 完成 reducer 的创建和 action 的创建

```typescript
import {createSlice} from "@reduxjs/toolkit";

// 初始状态
const initialState = {
  count: 0
}

// 使用 createSlice 代替手动编写 reducer 和 action
const counterSlice = createSlice({
  // reducer 的名称
  name: 'counter',
  // 初始状态
  initialState,
  // reducer，由于使用了 createSlice，因此我们可以用修改可变值的方法来得到新状态。
  // 这是因为 createSlice 使用了 Immer 库来保证直接修改状态后得到的是一个全新的状态。
  reducers: {
    increment: state => {
      state.count++;
    }
  }
});

// 导出 actions
export const {increment} = counterSlice.actions;
// 导出 reducer
export default counterSlice.reducer;

```

### 使用 configureStore 来创建 store

```typescript
import {configureStore} from "@reduxjs/toolkit";
import counterReducer from "./counterReducer";

// 只需要传入一个对象，包括必要的属性（比如 reducer），就可以创建store 并自动配置 Redux DevTools
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  }
})

// 在 TS 中的类型声明
export type RootState = ReturnType<typeof store.getState>;

```

### 使用 react-redux 来使组件获得状态

#### 使用 Provider 向组件提供状态

```tsx
import './App.css'
import {Provider} from "react-redux";
import {TestReducer} from "./components/testReducer";
import {store} from './store';
import React from 'react';

function App() {
  // 使用 Provider 来提供 store，这样子组件都可以获取到状态
  return (
    <Provider store={store}>
      <div className="App">
        <TestReducer/>
      </div>
    </Provider>
  )
}

export default App

```

#### 使用 useSelector 来在组件中获取状态，使用 useDispatch 来在组件中发送 action

```tsx
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {increment} from "../store/counterReducer";


export const TestReducer = () => {
  // 使用 useSelector 来在 state 中找到当前组件需要使用的状态
  const count = useSelector((state: RootState) => state.counter.count);
  // 使用 useDispatch 来获得向 store 的 dispatch 函数
  const dispatch = useDispatch();
  return <div>
    <h1>TestReducer</h1>
    <p>count: {count}</p>
    {/*increase 是导出的 action creator，返回一个 action 对象*/}
    {/*调用 dispatch 方法传入 action 对象就可以发送 action 了*/}
    <button onClick={() => dispatch(increment())}>increment
    </button>
  </div>;
}

```

