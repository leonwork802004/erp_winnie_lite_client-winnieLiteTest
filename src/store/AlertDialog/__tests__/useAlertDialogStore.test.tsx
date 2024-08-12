import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useAlertDialogStore } from "..";

describe("useAlertDialogStore", () => {
  test("initialize with empty title, message, and action", () => {
    const { result } = renderHook(() => useAlertDialogStore());

    expect(result.current.title).toBe("");
    expect(result.current.message).toBe("");
    expect(result.current.action).toBeUndefined();
  });

  test("should set title, message, and action when showDialog is called", () => {
    const { result } = renderHook(() => useAlertDialogStore());

    const testTitle = "Test Title";
    const testMessage = "Test Message";
    const testAction = vi.fn();

    act(() => {
      result.current.showDialog({
        title: testTitle,
        message: testMessage,
        action: testAction,
      });
    });

    expect(result.current.title).toBe(testTitle);
    expect(result.current.message).toBe(testMessage);
    expect(result.current.action).toBe(testAction);
  });
});
