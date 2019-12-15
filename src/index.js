import { useReducer, useEffect, useCallback } from "react";

export function useCancelableReducer(
  reducer,
  initialState,
  verbose = false,
  init = undefined
) {
  const should = { cancel: false };

  const [state, regularDispatch] = useReducer(reducer, initialState, init);

  const dispatch = useCallback(
    action => (should.cancel
      ? verbose
        ? console.log("Canceled: ", action.type)
        : null
      : regularDispatch(action)),
    [regularDispatch, verbose]
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
  verbose = false,
  init = undefined
) {
  const [state, dispatch] = useCancelableReducer(
    reducer,
    initialState,
    verbose,
    init
  );

  const getState = () => state;

  const dispatchThunk = action => (typeof action === "function"
    ? action(dispatch, getState)
    : dispatch(action));

  return [state, dispatchThunk];
}
