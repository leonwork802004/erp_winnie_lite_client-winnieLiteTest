import nock from "nock";
import { useAuthStore } from "@store/auth";
import { render, screen, url, waitFor } from "@tests/test-utils";
import Login from "..";
import { MD5 } from "../utils/md5";

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as any),
  useNavigate: () => mockedUseNavigate,
}));

const mockLogin = () => {
  const { user } = render(<Login />);
  const option = screen.getByLabelText("登入方式") as HTMLInputElement;
  const acc = screen.getByLabelText("帳號") as HTMLInputElement;
  const pwd = screen.getByLabelText("密碼") as HTMLInputElement;
  const loginButton = screen.getByRole("button", { name: "登入" });
  return { user, option, acc, pwd, loginButton };
};

describe("<Login />", () => {
  test("submits the form and login success", async () => {
    const authSpy = vi.spyOn(useAuthStore.getState(), "setAuth");

    nock(url)
      .post("/auth/login/winnie", { Acc: "ACC", Pvvd: MD5("pwd") })
      .reply(200, { AccessTokenExpires: "123", RefreshTokenExpires: "456" });

    const { user, acc, pwd, loginButton } = mockLogin();

    await user.click(loginButton);
    expect(screen.getByText("請輸入帳號")).toBeInTheDocument();
    expect(screen.getByText("請輸入密碼")).toBeInTheDocument();

    await user.type(acc, "     ");
    await user.type(pwd, "pwd");
    await user.click(loginButton);
    expect(screen.getByText("帳號或密碼不可為空")).toBeInTheDocument();

    await user.clear(acc);
    await user.type(acc, "acc");
    await user.click(loginButton);

    await waitFor(() => {
      expect(localStorage["AccessTokenExpires"]).toBe("123");
    });
    expect(localStorage["RefreshTokenExpires"]).toBe("456");
    expect(authSpy).toHaveBeenCalledWith(true);
    expect(mockedUseNavigate).toBeCalledTimes(1);
    expect(mockedUseNavigate).toHaveBeenCalledWith("/", {
      replace: true,
    });
  });

  test("submits the form and login failure", async () => {
    nock(url)
      .post("/auth/login/winnie", { Acc: "ACC", Pvvd: MD5("pwd") })
      .reply(401, { Msg: "帳號或密碼錯誤" });

    const { user, acc, pwd, loginButton } = mockLogin();

    await user.type(acc, "acc");
    await user.type(pwd, "pwd");
    await user.click(loginButton);

    expect(await screen.findByText(/帳號或密碼錯誤/i)).toBeInTheDocument();
  });
});
