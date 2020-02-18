# use-cancelable-thunk-reducer

[![Codecov Coverage](https://img.shields.io/codecov/c/github/pedrobern/react-hook-use-cancelable-thunk-reducer/master.svg?style=flat-square)](https://codecov.io/gh/pedrobern/react-hook-use-cancelable-thunk-reducer/)
[![Build Status](https://travis-ci.com/pedrobern/react-hook-use-cancelable-thunk-reducer.svg?branch=master)](https://travis-ci.com/pedrobern/react-hook-use-cancelable-thunk-reducer)
[![dependencies](https://david-dm.org/pedrobern/react-hook-use-cancelable-thunk-reducer.svg)](https://github.com/pedrobern/react-hook-use-cancelable-thunk-reducer)

Custom implementation of react hook `useReducer` that will cancel all dispatched actions if the component is unmounted and allows to dispatch [thunk actions](https://github.com/reduxjs/redux-thunk) (that will be canceled either).

The thunk actions receive `(dispatch, getState)` args.

```javascript
const thunkAction = args => async (dispatch, getState) => {
  dispatch({type: ACTION_SENT});
  const state = getState();
  ...
}
```

## Installation

```
yarn add use-cancelable-thunk-reducer

npm i use-cancelable-thunk-reducer
```

## useCancelableThunkReducer

```javascript
import useCancelableThunkReducer from 'use-cancelable-thunk-reducer';

const [state, dispatch] = useCancelableThunkReducer(
  reducer,
  initialState,
  callback,
  init
);

```

### `reducer`

useReducer first argument.

### `initialState`
useReducer second argument.

### `callback`
default is `undefined`, if is a `function`, when some action is canceled it is called with the action argument: `callback(action)`.

### `init`
useReducer last argument.

## Example

The following example create a simple case when you would like to cancel a dispatch, by unmounting a component during a scheduled dispatch action.

Open on [codesanbox](https://codesandbox.io/s/use-cancelable-thunk-reducer-lirs9).

```javascript
import ReactDOM from "react-dom";
import React, { useState } from "react";
import useReducer from "use-cancelable-thunk-reducer";

const initialState = { count: 0 };
const time = 3;
const callback = action => console.log("Canceled:", action.type);

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      throw new Error();
  }
}

function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}

const incrementAsync = () => async (dispatch, getState) => {
  const state = getState();
  console.log("count is", state.count);
  console.log(
    "sleeping for 3 seconds... unmount the component to cancel this action."
  );
  await sleep(time);
  dispatch({ type: "increment" });
};

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState, callback);
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch(incrementAsync())}>
        increment in {time} seconds
      </button>
    </div>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <p>Mount the component, increment it and see your console.</p>
      <button onClick={() => setShow(!show)}>
        {show ? "unmount" : "mount"}
      </button>
      {show && <Counter />}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

```
