import { faker } from "@faker-js/faker";
import nock from "nock";
import { screen, url, render } from "@tests/test-utils";
import Sys001 from "..";

const mainTitle = "主節點1";
const firstTitle = "目錄節點1";
const secondTitle = "目錄節點2";
const page1Title = "頁面1";
const page2Title = "頁面2";

const mockData = {
    RootName: "WinnieWeb",
    Title: mainTitle,
    Id: 1,
    Priority: 99,
    Status: 1,
    Children: [
        {
            Id: faker.number.int(),
            Title: firstTitle,
            Priority: 0,
            Status: 1,
            Children: [
                {
                    Id: faker.number.int(),
                    Title: page1Title,
                    Priority: 0,
                    Status: 1,
                    PageId: faker.number.int(),
                },
                {
                    Id: faker.number.int(),
                    Title: page2Title,
                    Priority: 0,
                    Status: 0,
                    PageId: faker.number.int(),
                },
            ]
        },
        {
            Id: faker.number.int(),
            Title: secondTitle,
            Priority: 0,
            Status: 1,
        }
    ]
};

const mockRes = {
    Code: "200",
    Msg: "查詢成功",
};

describe("<Sys001 />", () => {
    beforeEach(() => {
        nock(url)
            .get("/Menu/Trees")
            .reply(200, {
                ...mockRes,
                Data: [mockData],
            })
    })
    test("get MenuTree Data Success and expand TreeItem", async () => {
        const { user } = render(<Sys001 />);

        expect(await screen.findByRole("treeitem", { name: mockData.Title })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "頁面關聯按鈕" })).toBeInTheDocument();  

        expect(await screen.findByText(mainTitle)).toBeInTheDocument();
        expect(await screen.findByText(firstTitle)).toBeInTheDocument();
        expect(await screen.findByText(secondTitle)).toBeInTheDocument();

        //展開目錄節點
        await user.click(screen.getByTestId("TreeViewExpandIconIcon"));
        expect(await screen.findByText(page1Title)).toBeInTheDocument();
        expect(await screen.findByText(page2Title)).toBeInTheDocument();

        //確認頁面是否有顯示icon 因為有2個頁面 icon數量會是2
        const count_Icon = await screen.findAllByTestId('WysiwygOutlinedIcon');
        expect(count_Icon).toHaveLength(2);

        //若目錄為停用 則會字體顏色為灰色
        expect(await screen.findByText(page2Title)).toHaveStyle(`color: rgb(189, 189, 189)`);

    });
});