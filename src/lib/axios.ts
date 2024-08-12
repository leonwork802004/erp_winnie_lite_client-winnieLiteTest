import Axios, { AxiosRequestConfig } from "axios";
import { fetchRefreshToken } from "@api/refreshToken";

const baseURL = /true/.test(import.meta.env.VITE_USE_API_PROXY)
  ? "/api/v1"
  : `${import.meta.env.VITE_SERVER_URL}/api/v1`;

const axios = Axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

type RetryQueueItem = {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
};

// request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 排除 401 失敗且沒有回傳任何 data 的 api，目前除 token 過期的 api 外，其餘 401 失敗都會回傳 data
    if (
      error.response &&
      error.response.status === 401 &&
      !error.response.data
    ) {
      if (!isRefreshing) {
        const now = new Date();
        const accessTime = new Date(localStorage["AccessTokenExpires"]);
        const refreshTime = new Date(localStorage["RefreshTokenExpires"]);

        try {
          if (!(accessTime < now && now < refreshTime)) {
            throw new Error("Access or refresh time not available.");
          }

          isRefreshing = true;
          await fetchRefreshToken();

          // Retry all requests in the queue with the new token
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) =>
            axios.request(config).then(resolve).catch(reject)
          );

          // Clear the queue
          refreshAndRetryQueue.length = 0;

          return axios(originalRequest);
        } catch (refreshError) {
          //TODO:登出
          localStorage.removeItem("RefreshTokenExpires");
          localStorage.removeItem("AccessTokenExpires");
          window.location.href = "/";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Add the original request to the queue
      return new Promise<void>((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    return Promise.reject(error);
  }
);

export default axios;
