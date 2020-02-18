// eslint-disable-next-line
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import useCancelableThunkReducer from "../src/index";

const myMock = jest.fn();
const getStateMock = jest.fn(x => x);

const log = jest.fn()

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      myMock();
      return { count: state.count + 1 };
    default:
      return state;
  }
}

const incrementAsyncAction = () => async dispatch => {
  // dispatch action after 1 second
  setTimeout(() => {
    dispatch({ type: "increment" });
  }, 1000);
};

const incrementAsyncActionThunk = () => async (dispatch, getState) => {
  const state = getState();
  getStateMock(state);

  // dispatch action after 1 second
  setTimeout(() => {
    dispatch({ type: "increment" });
  }, 1000);
};

// eslint-disable-next-line react/prop-types
const Counter = ({ initialState, init, callback }) => {
  const [state, dispatch] = useCancelableThunkReducer(
    reducer,
    initialState,
    callback,
    init
  );
  return (
    <div>
      <p id="count">{state.count}</p>
      <button id="increment" onClick={() => dispatch({ type: "increment" })}>
        +
      </button>
      <button
        id="incrementAsync"
        onClick={() => incrementAsyncAction()(dispatch)}
      >
        + async
      </button>
      <button
        id="incrementAsyncThunk"
        onClick={() => dispatch(incrementAsyncActionThunk())}
      >
        + async thunk
      </button>
    </div>
  );
};

const setupWrapper = ({
  state = { count: 0 },
  init = undefined,
  callback = undefined
} = {}) => {
  const wrapper = mount(
    <Counter initialState={state} init={init} callback={callback} />
  );
  const count = wrapper.find("#count").first();
  const increment = wrapper.find("#increment").first();
  const incrementAsync = wrapper.find("#incrementAsync").first();
  const incrementAsyncThunk = wrapper.find("#incrementAsyncThunk").first();

  return {
    wrapper,
    count,
    increment,
    incrementAsync,
    incrementAsyncThunk
  };
};

jest.useFakeTimers();

describe("useCancelableThunkReducer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("dispatch actions", () => {
    const { wrapper, count, increment } = setupWrapper();
    expect(count.text()).toBe("0");
    increment.simulate("click", { button: 0 });
    wrapper.update();
    expect(count.text()).toBe("1");
  });

  it("cancel actions when unmounted", () => {
    const { wrapper, count, incrementAsync } = setupWrapper({
      callback: (action) => log("Canceled:", action.type)
    });

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(myMock.mock.calls.length).toBe(0);
    expect(count.text()).toBe("0");

    incrementAsync.simulate("click", { button: 0 });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    wrapper.update();
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(myMock.mock.calls.length).toBe(1);
    expect(count.text()).toBe("1");

    incrementAsync.simulate("click", { button: 0 });
    wrapper.unmount();
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(log).toHaveBeenCalledWith("Canceled:", "increment");

    // setTimeout called one more time,
    expect(setTimeout).toHaveBeenCalledTimes(3);
    // but dispatch was not called, as expected
    expect(myMock.mock.calls.length).toBe(1);
  });

  it("cancel thunk actions when unmounted", () => {
    const { wrapper, count, incrementAsyncThunk } = setupWrapper({
      callback: (action) => log("Canceled:", action.type)
    });

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(myMock.mock.calls.length).toBe(0);
    expect(count.text()).toBe("0");

    incrementAsyncThunk.simulate("click", { button: 0 });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    wrapper.update();
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(myMock.mock.calls.length).toBe(1);
    expect(count.text()).toBe("1");

    incrementAsyncThunk.simulate("click", { button: 0 });
    wrapper.unmount();
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(log).toHaveBeenCalledWith("Canceled:", "increment");

    // setTimeout called one more time,
    expect(setTimeout).toHaveBeenCalledTimes(3);
    // but dispatch was not called, as expected
    expect(myMock.mock.calls.length).toBe(1);
  });

  it("console.log on callback", () => {
    const { wrapper, incrementAsync } = setupWrapper({
      callback: (action) => log("Canceled:", action.type)
    });

    incrementAsync.simulate("click", { button: 0 });
    wrapper.unmount();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(log).toHaveBeenCalledWith("Canceled:", "increment");
  });

  it("pass right init function", () => {
    function init(initialCount) {
      myMock();
      return { count: initialCount };
    }

    const initialCount = 0;

    setupWrapper({ state: initialCount, init });
    expect(myMock.mock.calls.length).toBe(1);
  });

  it("dispatch thunks", () => {
    const { incrementAsyncThunk } = setupWrapper();
    incrementAsyncThunk.simulate("click", { button: 0 });
    expect(getStateMock.mock.calls.length).toBe(1);
    expect(getStateMock.mock.calls[0][0]).toStrictEqual({ count: 0 });
  });

  it("getState returns current state", () => {
    const { wrapper, incrementAsyncThunk } = setupWrapper();
    incrementAsyncThunk.simulate("click", { button: 0 });
    expect(getStateMock.mock.calls.length).toBe(1);
    expect(getStateMock.mock.calls[0][0]).toStrictEqual({ count: 0 });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    wrapper.update();
    incrementAsyncThunk.simulate("click", { button: 0 });
    expect(getStateMock.mock.calls.length).toBe(2);
    expect(getStateMock.mock.calls[1][0]).toStrictEqual({ count: 1 });
  });

  it("don't call a callback if it is undefined", () => {
    const wrapper = mount(<Counter initialState={{ count: 0 }} />);
    const incrementAsync = wrapper.find("#incrementAsync").first();
    incrementAsync.simulate("click", { button: 0 });
    wrapper.unmount();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(log).not.toHaveBeenCalled();
  });
});
