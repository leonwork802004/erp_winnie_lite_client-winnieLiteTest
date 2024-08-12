import { faker } from "@faker-js/faker";
import nock from "nock";
import { RootMenuSchema } from "@api/userRoot";
import { render, screen, url } from "@tests/test-utils";
import { Menu } from "..";

type Menu = {
  Id: number;
  Title: string;
  Priority: number;
  FeatureName?: string;
} & {
  Children?: Menu[];
};

const createData = (isChildren: boolean): Menu => {
  const commonData = {
    Id: faker.number.int(),
    Title: faker.lorem.sentence(1),
    Priority: faker.number.int(2),
  };

  if (isChildren) {
    return {
      ...commonData,
      Children: [createData(false)],
    };
  } else {
    return {
      ...commonData,
      FeatureName: faker.lorem.sentence(1),
    };
  }
};

const mockData: RootMenuSchema = {
  RootName: "WinnieWeb",
  Title: "維尼Web主節點",
  Id: 1,
  Children: [createData(true), createData(false)],
};

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as any),
  useNavigate: () => mockedUseNavigate,
}));

const close = vi.fn();

describe("<Menu />", () => {
  test("render logout when auth is true", async () => {
    vi.mock("@store/auth", () => ({
      ...vi.importActual("@store/auth"),
      useAuthStore: vi
        .fn()
        .mockImplementation(() => ({ auth: true, setAuth: vi.fn() })),
    }));

    nock(url).get("/menu/userRoot").reply(200, mockData);

    const { user } = render(<Menu isOpen={true} close={close} />);
    expect(screen.getByText("登出")).toBeInTheDocument();

    let closeTime = 0;
    if (mockData.Children) {
      expect(
        await screen.findByText(mockData.Children[0].Title)
      ).toBeInTheDocument();
      expect(
        await screen.findByText(mockData.Children[1].Title)
      ).toBeInTheDocument();

      // 有 children 展開選單
      await user.click(screen.getByText(mockData.Children[0].Title));
      if (mockData.Children[0].children) {
        expect(
          await screen.findByText(mockData.Children[0].children[0].Title)
        ).toBeInTheDocument();
      }

      // 沒有 children 導向 FeatureName
      await user.click(screen.getByText(mockData.Children[1].Title));
      expect(mockedUseNavigate).toHaveBeenCalledWith(
        mockData.Children[1].FeatureName
      );
      expect(close).toHaveBeenCalledTimes(closeTime + 1);
      closeTime = closeTime + 1;
    }

    const removeItem = vi.spyOn(localStorage, "removeItem");
    await user.click(screen.getByRole("button", { name: "登出" }));
    expect(removeItem).toHaveBeenCalledTimes(2);
    expect(close).toHaveBeenCalledTimes(closeTime + 1);
  });
});
