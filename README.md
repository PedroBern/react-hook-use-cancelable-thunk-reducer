# use-cancelable-thunk-reducer

[![Codecov Coverage](https://img.shields.io/codecov/c/github/pedrobern/react-hook-use-cancelable-thunk-reducer/master.svg?style=flat-square)](https://codecov.io/gh/pedrobern/react-hook-use-cancelable-thunk-reducer/)
[![Build Status](https://travis-ci.com/pedrobern/react-hook-use-cancelable-thunk-reducer.svg?branch=master)](https://travis-ci.com/pedrobern/react-hook-use-cancelable-thunk-reducer)
[![dependencies](https://david-dm.org/pedrobern/react-hook-use-cancelable-thunk-reducer.svg)](https://github.com/pedrobern/react-hook-use-cancelable-thunk-reducer)

Custom implementation of react hook `useReducer` that will cancel all dispatched actions if the component is unmounted and allows to dispatch [thunk actions](https://github.com/reduxjs/redux-thunk) (that will be canceled either).

<!-- ![demo-gif](https://github.com/pedrobern/react-tiger-transition/raw/master/demo.gif) -->
![demo-gif](/demo.gif)

Open on [codesanbox](https://codesandbox.io/s/use-cancelable-thunk-reducer-lirs9).

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

## Thunk action

The thunk actions receive `(dispatch, getState)` args.

```javascript
const thunkAction = args => async (dispatch, getState) => {
  dispatch({type: ACTION_SENT});
  const state = getState();
  ...
}
```
