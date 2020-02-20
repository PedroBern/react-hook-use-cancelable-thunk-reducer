import { useReducer, useEffect, useCallback } from "react";

const isFunction = f => (
  Object.prototype.toString.call(f) === "[object Function]"
  || typeof f === "function"
  || f instanceof Function
);

export function useCancelableReducer(
  reducer,
  initialState,
  callback = undefined,
  init = undefined
) {
  const should = { cancel: false };

  const [state, regularDispatch] = useReducer(reducer, initialState, init);

  const dispatch = useCallback(
    action => (should.cancel
      ? callback && isFunction(callback)
        ? callback(action)
        : null
      : regularDispatch(action)),
    [regularDispatch, callback]
  );

  useEffect(
    () => () => {
      should.cancel = true;
    },
    []
  );

  return [state, dispatch];
}

export default function useCancelableThunkReducer(
  reducer,
  initialState,
  callback = undefined,
  init = undefined
) {
  const [state, dispatch] = useCancelableReducer(
    reducer,
    initialState,
    callback,
    init
  );

  const getState = () => ({ ...state });

  const dispatchThunk = action => (isFunction(action)
    ? action(dispatch, getState)
    : dispatch(action));

  return [state, dispatchThunk];
}
