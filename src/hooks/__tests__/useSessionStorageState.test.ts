import { renderHook, act } from "@testing-library/react";
import { useSessionStorageState } from "@hooks/useSessionStorageState";

const pathname = undefined;
const key = "testKey";
const initialValue = "initialValue";

const mockedUseLocation = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as any),
  useLocation: () => mockedUseLocation,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("should set initial value from sessionStorage", () => {
  sessionStorage[pathname + "-" + key] = JSON.stringify(initialValue);

  const { result } = renderHook(() =>
    useSessionStorageState(key, initialValue)
  );

  expect(result.current[0]).toBe(initialValue);
});

test("should update state and sessionStorage on change", async () => {
  const newValue = "newValue";

  const { result } = renderHook(() =>
    useSessionStorageState(key, initialValue)
  );

  expect(sessionStorage[pathname + "-" + key]).toBeUndefined();

  act(() => {
    result.current[1](newValue);
  });

  expect(result.current[0]).toBe(newValue);
});

test("should update 1 time in 500", async () => {
  vi.useFakeTimers();
  const setItem = vi.spyOn(sessionStorage, "setItem");

  const { result } = renderHook(() =>
    useSessionStorageState(key, initialValue)
  );

  expect(sessionStorage[pathname + "-" + key]).toBeUndefined();
  expect(setItem).toHaveBeenCalledTimes(0);

  // 不會觸發debounce
  act(() => {
    result.current[1]("123");
    vi.advanceTimersByTime(300);
  });
  expect(setItem).toHaveBeenCalledTimes(0);

  // 觸發debounce
  act(() => {
    result.current[1]("456");
    vi.advanceTimersByTime(600);
  });
  expect(setItem).toHaveBeenCalledTimes(1);

  // 觸發debounce
  act(() => {
    result.current[1]("789");
    vi.advanceTimersByTime(600);
  });
  expect(setItem).toHaveBeenCalledTimes(2);

  vi.useRealTimers();
});
