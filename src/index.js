import { useReducer, useEffect, useCallback } from "react";

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
      ? callback && (
        Object.prototype.toString.call(callback) === "[object Function]"
        || typeof callback === "function"
        || callback instanceof Function
      ) ? callback(action)
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

  const dispatchThunk = action => (typeof action === "function"
    ? action(dispatch, getState)
    : dispatch(action));

  return [state, dispatchThunk];
}
