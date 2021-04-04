---
title: Redux中的一些概念
date: 2020-08-02
category: frontend
tags: ["redux"]

---

> 实习第一周，学习学习和学习。
> Redux涉及的概念比较多，初学者（比若我）容易摸不清概念之间的关系，所以记录一下。
> 
> TODO：
> * [ ] 核对文章中的代码
> * [ ] 补充React-Redux部分
> * [ ] 增加使用Immer重写Reducer的小节

## 概述

### What are Redux and State

> Redux is a state management library for JavaScript applications

简单来说，Redux是JS应用的一个<ruby>状态<rt>State</rt></ruby>管理库。

那么什么是「状态」呢？想象一个简单的场景：用户点击了一个按钮后出现了弹窗。在这个简单的场景中其实就涉及了状态的概念。用JS的对象来描述这个过程，在点击按钮前：
```js
const state = {
  buttonClicked: false,
  modalOpen: false
}
```
当用户点击按钮后：
```js
const state = {
  buttonClicked: true,
  modalOpen: true
}
```

在React中，状态被用来存储需要渲染的数据，比如从API获取到的响应等，使用`this.setState()`就能更新<ruby>本地组件<rt>local components</rt></ruby>的状态。

### What is Redux for

> Even an innocent SAP(Single Page App) could grow out of control without clear boundaries between every layer of the application.

状态在JavaScript中无处不在，即便是一个简单的单页面应用也可能有繁杂的状态。

在React中，同级组件之间的通信非常麻烦，常规的解决办法是使用多个<ruby>中间件<rt>middleware</rt></ruby>进行消息传递，一个组件状态改变后还需要将这个状态传递到所有依赖此状态的其他组件。

![-w500](https://pic.rhinoc.top/mweb/15963462054771.jpg)

Redux则给出了另一种解决方法，使用单一数据源Store来存储状态数据，所有的组件都可以读取Store或者通过Action修改Store。简而言之，通过Redux，我们可以将多个组件使用的状态拿出来，放入组件树之外的集中位置（顶层容器）。

## 基本概念

### Store

所有的<ruby>状态<rt>state</rt></ruby>都存放在Store对象中。

> Rule 1: 单一数据源
> 整个应用的state被存储在一棵object tree中，并且这个object tree只存在于唯一一个store中。

### Reducer

```js
// src/index.js
import { createStore } from "redux";
import rootReducer from "./reducers/index";

const store = createStore(rootReducer);
```
从上面的代码可以看出，`store`是`createStore`这个函数接收`rootReducer`返回的结果。其中，`createStore`来自引入的Redux库，那么`rootReducer`又是什么呢？

> A reducer is a function that receives the current `state` and an `action` object, decides how to update the state if necessary, and returns the new state.

`rootReducer`是一个reducer，而reducer是一个函数，它接受当前state和一个action，返回新的state。

![-w329](https://pic.rhinoc.top/mweb/15963494026489.jpg)

比如在本例中，`rootReducer`接受`state`后，根据`action.type`返回不同的`state`。

```js
// src/reducers/index.js
const initialState = {
  todos: []
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    default: return state
  }
};

export default rootReducer;
```

> Rule 2: State是只读的
> 唯一改变state的方法就是触发action。

你可能已经注意到，在`rootReducer`中，并没有出现常见的`this.setState()`方法。这是因为在Redux中，不允许直接修改state，只能表示想要修改的意图。

> Rule 3: 使用纯函数执行修改
> 一个纯函数对一个特定输入总是会返回同样的输出。

在Rule 2中我们知道，state不能被直接修改，所以reducer不能就地修改当前的state，必须先复制一份，返回新的对象作为state。这就要求reducer是个纯函数，也就解释了为什么代码中要使用看起来很复杂的`Object.assign()`。

### Action

那代码里面的`action`又是什么？

`action`本质上是JS中的对象，其必须包含`type`字段来表示执行动作的类型。除了`type`字段外Action对象的结构可以完全自定义，方便传入附加字段，在本例中就增加了一个`text`字段用来存储待办事项的名称。

当Action的结构过于复杂时，可以使用函数来创建Action：
```js
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}
```

### Dispatch

更新状态的唯一方法是调用`store.dispath()`并传递一个`action`对象。我们可以简单地将`dispatch`理解为触发事件，每当事件触发时，reducer监听到发生的`action`，就会更新`state`。

```js
function btnClick(text){
	dispath(addTodo(text));
}
```

## Redux Flow

* 初始化
  * `const store = createStore(rootReducer);`
  * `store`调用一次``rootReducer`，将预设的`initialState`作为当前`state`
  * 第一次渲染时，UI组件访问`store`并使用其中的数据渲染内容。同时，组件也<ruby>订阅<rt>subscribe</rt></ruby>了`store`这样在`store`更新时组件都能知道
* 变动
  * 发生了一些事情，例如用户点击了一个按钮
  * 按钮的handler调用`dispatch`，指派了一个`action`到`store`
  * `store`调用一次`rootReducer`得到新的`state`
  * `store`通知所有订阅了自己的UI组件告诉它们状态有更新
  * 每个UI组件检查这次更新是否与自己相关
  * 所有相关组件使用新的数据重新执行一次渲染

![](https://pic.rhinoc.top/mweb/image-20200802153658635.png)

## React-Redux

Redux是一个JS库，我们可以把它用在纯JS上，或者Angular，或者React。对于React来说，你需要使用`react-redux`将React组件与Redux Store绑定。

React-Redux提供`<Provider />`组件，被该组件包裹的内部组件都能访问到store。

通常，我们将整个`<App />`包裹在`<Provider />`中：
```js
<Provider store = { store }>
  <App />
</Provider>
```

然后使用`connect`方法生成一个连接到store的组件。
```js
// src/containers/AddTodo.js
import { connect } from "react-redux";
import { addTodo } from "./actions";
import { AddTodo } from "./components/AddTodo";

const mapStateToProps = (state, ownProps) => {
  return {
    todos: state.todos
  };
}

const mapDispatchToProps = { addTodo };

export default connect(mapStateToProps, mapDispatchToProps)(AddTodo);
```

`connect`函数接收两个可选参数：
* `mapStateToProps`: store中数据和组件属性的映射
* `mapDispatchToProps`: action和组件属性的映射

## 参考资料

* [React Redux Tutorial for Beginners: The Complete Guide (2020)](https://www.valentinog.com/blog/redux/)
* [Rudex中文文档](https://cn.redux.js.org/)




