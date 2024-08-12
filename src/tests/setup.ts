import "@testing-library/jest-dom";
import nock from "nock";
import axios from "@lib/axios";
import { queryClient } from "@lib/tanstack";

axios.defaults.adapter = "http";
vi.mock("zustand"); // to make it works like `Jest` (auto-mocking)
nock.disableNetConnect();

beforeEach(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: createStorageMock(),
  });
  Object.defineProperty(window, "localStorage", { value: createStorageMock() });
});

afterEach(() => {
  nock.cleanAll();
  vi.clearAllMocks();
  vi.resetModules();
  queryClient.clear();
});

const createStorageMock = () => {
  let store = {} as Storage;

  return {
    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    removeItem(key: string) {
      delete store[key];
    },

    clear() {
      store = {} as Storage;
    },

    getAll() {
      return store;
    },
  };
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
