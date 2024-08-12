import nock from "nock";
import { JwtAuthSchema } from "@appTypes/auth";
import { BaseResponse } from "@appTypes/baseResponse";
import axios from "@lib/axios";
import { url } from "@tests/test-utils";

const mockData: JwtAuthSchema = {
  AccessTokenExpires: "AccessTokenExpires",
  RefreshTokenExpires: "RefreshTokenExpires",
};

describe("Axios Interceptor Tests'", () => {
  beforeEach(() => {
    const currentTime = new Date();
    localStorage["AccessTokenExpires"] = new Date(
      currentTime.getTime() - 10 * 60 * 1000
    ).toISOString();
    localStorage["RefreshTokenExpires"] = new Date(
      currentTime.getTime() + 100 * 60 * 1000
    ).toISOString();
  });

  test("refresh token 1 time on multiple 401 response", async () => {
    const scope = nock(url)
      .get("/test")
      .reply(401)
      .get("/test2")
      .reply(401)
      .get("/test3")
      .reply(401)
      .get("/test")
      .reply(200, "test success")
      .get("/test2")
      .reply(200, "test2 success")
      .get("/test3")
      .reply(200, "test3 success");

    const refreshTokenScope = nock(url)
      .post("/auth/refreshToken")
      .reply(200, mockData);

    const data = await Promise.all([
      axios.get(`${url}/test`),
      axios.get(`${url}/test2`),
      axios.get(`${url}/test3`),
    ]);

    expect(data[0].data).toBe("test success");
    expect(data[1].data).toBe("test2 success");
    expect(data[2].data).toBe("test3 success");
    expect(refreshTokenScope.isDone()).toBeTruthy();
    expect(refreshTokenScope.pendingMocks()).toHaveLength(0);
    expect(scope.isDone()).toBeTruthy();
    expect(scope.pendingMocks()).toHaveLength(0);

    expect(localStorage["AccessTokenExpires"]).toBe("AccessTokenExpires");
    expect(localStorage["RefreshTokenExpires"]).toBe("RefreshTokenExpires");
  });

  test("handle refresh token failed with 400 error", async () => {
    const removeItem = vi.spyOn(localStorage, "removeItem");

    const scope = nock(url).get("/test").reply(401);
    const refreshTokenScope = nock(url).post("/auth/refreshToken").reply(400);

    await expect(axios.get(`${url}/test`)).rejects.toBeTruthy();

    expect(removeItem).toHaveBeenCalledTimes(2);
    expect(scope.isDone()).toBeTruthy();
    expect(scope.pendingMocks()).toHaveLength(0);
    expect(refreshTokenScope.isDone()).toBeTruthy();
    expect(refreshTokenScope.pendingMocks()).toHaveLength(0);
    expect(window.location.href).toBe(`${window.location.origin}/`);
  });

  test("handle refresh token failed with 401 error", async () => {
    const removeItem = vi.spyOn(localStorage, "removeItem");

    const refreshTokenScope = nock(url)
      .post("/auth/refreshToken")
      .reply(401, "test");
    const scope = nock(url).get("/test").reply(401);

    await expect(axios.get(`${url}/test`)).rejects.toBeTruthy();

    expect(removeItem).toHaveBeenCalledTimes(2);
    expect(scope.isDone()).toBeTruthy();
    expect(scope.pendingMocks()).toHaveLength(0);
    expect(refreshTokenScope.isDone()).toBeTruthy();
    expect(refreshTokenScope.pendingMocks()).toHaveLength(0);
    expect(window.location.href).toBe(`${window.location.origin}/`);
  });

  test("login with 401 error", async () => {
    const removeItem = vi.spyOn(localStorage, "removeItem");
    const mockRes: BaseResponse = { Code: "401", Msg: "帳號或密碼輸入錯誤" };

    const refreshTokenScope = nock(url)
      .post("/auth/refreshToken")
      .reply(401, "test");
    const scope = nock(url).get("/auth/login").reply(401, mockRes);

    await expect(axios.get(`${url}/auth/login`)).rejects.toBeTruthy();

    expect(removeItem).toHaveBeenCalledTimes(0);
    expect(scope.isDone()).toBeTruthy();
    expect(scope.pendingMocks()).toHaveLength(0);
    expect(refreshTokenScope.isDone()).toBeFalsy();
    expect(refreshTokenScope.pendingMocks()).toHaveLength(1);
  });
});

describe("Axios Interceptor Tests", () => {
  beforeEach(() => {
    const currentTime = new Date();
    localStorage["AccessTokenExpires"] = new Date(
      currentTime.getTime() - 10 * 60 * 1000
    ).toISOString();
  });

  test("no refresh when localStorage token missing", async () => {
    const removeItem = vi.spyOn(localStorage, "removeItem");
    const refreshTokenScope = nock(url)
      .post("/auth/refreshToken")
      .reply(200, mockData);
    const scope = nock(url).get("/test").reply(401);

    await expect(axios.get(`${url}/test`)).rejects.toThrow(
      "Access or refresh time not available."
    );

    expect(removeItem).toHaveBeenCalledTimes(2);
    expect(scope.isDone()).toBeTruthy();
    expect(scope.pendingMocks()).toHaveLength(0);
    expect(refreshTokenScope.isDone()).toBeFalsy();
    expect(refreshTokenScope.pendingMocks()).toHaveLength(1);
    expect(window.location.href).toBe(`${window.location.origin}/`);
  });
});
