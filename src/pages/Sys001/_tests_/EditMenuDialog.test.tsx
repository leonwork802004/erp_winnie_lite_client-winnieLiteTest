import { faker } from "@faker-js/faker";
import nock from "nock"
import { screen, url, render, mockButtonRequest, waitFor } from "@tests/test-utils";
import { GetPageBtnPayload, MenuNodesSchema, PageBtnSchema } from "../api/type";
import { EditMenuDialog } from "../components";
import { buttons } from "../utils";

const mainTitle = "主節點1";
const firstTitle = "目錄節點1";
const secondTitle = "目錄節點2";
const page1Title = "頁面1";
const page2Title = "頁面2";

const pageMenu1 = {
    Id: 3,
    Title: page1Title,
    Priority: 0,
    Status: 1,
    PageId: faker.number.int()
}

const mockMenuData = {
    RootName: "WinnieWeb",
    Title: mainTitle,
    Id: 1,
    Priority: 99,
    Status: 1,
    Children: [
        {
            Id: 2,
            Title: firstTitle,
            Priority: 0,
            Status: 1,
            Children: [
                { pageMenu1 },
                {
                    Id: 4,
                    Title: page2Title,
                    Priority: 0,
                    Status: 0,
                    PageId: faker.number.int(),
                },
            ]
        },
        {
            Id: 5,
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

const param: GetPageBtnPayload = {
    pageId: pageMenu1.PageId
};

const mockBtnData: Array<PageBtnSchema> = [
    {
        PageBtnId: 1,
        Id: 1,
        Name: "Btn1",
        Title: "按鈕1",
        CreatedAt: faker.date.anytime().toDateString(),
        Status: 1
    },
    {
        PageBtnId: 2,
        Id: 2,
        Name: "Btn2",
        Title: "按鈕2",
        CreatedAt: faker.date.anytime().toDateString(),
        Status: 0
    },
];

//目錄節點 列表
const mockNodeData: Array<MenuNodesSchema> = [
    {
        Id: 1,
        Title: mainTitle,
        Status: 1
    },
    {
        Id: 2,
        Title: firstTitle,
        Status: 1
    },
    {
        Id: 5,
        Title: secondTitle,
        Status: 1
    },
];

const featureNames = Object.values(buttons).map((button) => button.featureName);

describe("<AddMenuDialog / >", async () => {
    beforeEach(() => {
        mockButtonRequest(Object.values(featureNames));
        nock(url)
            .get("/Menu/Trees")
            .reply(200, {
                ...mockRes,
                Data: [mockMenuData],
            })
            .get("/Button/PageBtns")
            .query(param)
            .reply(200, {
                ...mockRes,
                Data: mockBtnData,
            })
            .get("/Menu/MenuNodes")
            .reply(200, {
                ...mockRes,
                Data: mockNodeData,
            })
    })

    test("test edit menu for secondMenuNode", async () => {
        const { user } = render(<EditMenuDialog selectedMenuItem={mockMenuData.Children[0]} parentId={1} handleSelectedMenuChange={vi.fn()} handleSelectedItemChange={vi.fn()} />)

        const editBtn = await screen.findByRole("button", { name: "編輯目錄" });
        expect(editBtn).toBeInTheDocument();

        await user.click(editBtn);
        expect(await screen.findByRole("dialog", { name: `[編輯目錄] ${firstTitle}` })).toBeVisible();

        const setMainNode = await screen.findByRole("checkbox", { name: "設定為主節點" });
        const titleTextBox = await screen.findByRole("textbox", { name: "目錄標題" });
        const parentComboBox = await screen.findByRole("combobox", { name: "上層節點" });
        const submitBtn = screen.getByRole("button", { name: "確定" });
        const cancelBtn = screen.getByRole("button", { name: "取消" });

        //主節點
        expect(setMainNode).not.toBeChecked();
        //節點關聯名稱 
        expect(titleTextBox).toHaveValue(mockMenuData.Children[0].Title);
        //上層節點
        expect(parentComboBox).toHaveValue(mainTitle);

        await user.clear(titleTextBox);
        await user.click(submitBtn);
        expect(await screen.findByText("目錄標題不可為空")).toBeInTheDocument();

        await user.click(setMainNode);
        expect(parentComboBox).toBeDisabled();
        await user.click(submitBtn);
        expect(await screen.findByText("請輸入節點關聯名稱")).toBeInTheDocument();

        await user.click(setMainNode);
        await user.click(parentComboBox);
        await user.click(await screen.findByTestId("CloseIcon"));
        await user.click(submitBtn);
        expect(await screen.findByText("請選擇上層節點")).toBeInTheDocument();

        await user.click(cancelBtn);
        expect(await screen.findByRole("dialog", { name: `[編輯目錄] ${firstTitle}` })).not.toBeVisible();
    })

    test("test edit menu for page", async () => {
        const { user } = render(<EditMenuDialog selectedMenuItem={pageMenu1} parentId={2} handleSelectedMenuChange={vi.fn()} handleSelectedItemChange={vi.fn()} />)

        const editBtn = await screen.findByRole("button", { name: "編輯目錄" });
        expect(editBtn).not.toBeDisabled();

        await user.click(editBtn);
        expect(await screen.findByRole("dialog", { name: `[編輯目錄] ${pageMenu1.Title}` })).toBeVisible();

        const titleTextBox = await screen.findByRole("textbox", { name: "目錄標題" });
        const parentComboBox = await screen.findByRole("combobox", { name: "上層節點" });
        const submitBtn = screen.getByRole("button", { name: "確定" });
        const cancelBtn = screen.getByRole("button", { name: "取消" });

        //節點關聯名稱 
        expect(titleTextBox).toHaveValue(pageMenu1.Title);
        //上層節點
        expect(parentComboBox).toHaveValue(firstTitle);

        await user.clear(titleTextBox);
        await user.click(submitBtn);
        expect(await screen.findByText("目錄標題不可為空")).toBeInTheDocument();

        await user.click(parentComboBox);
        await user.click(await screen.findByTestId("CloseIcon"));
        await user.click(submitBtn);
        expect(await screen.findByText("請選擇上層節點")).toBeInTheDocument();

        await user.click(cancelBtn);
        expect(await screen.findByRole("dialog", { name: `[編輯目錄] ${pageMenu1.Title}` })).not.toBeVisible();
    })

    test("selectedItem without selection, button style", async () => {
        const { user } = render(<EditMenuDialog selectedMenuItem={null} parentId={undefined} handleSelectedMenuChange={vi.fn()} handleSelectedItemChange={vi.fn()} />)

        user.hover(screen.getByLabelText("請選擇要編輯的目錄"));

        await waitFor(() => {
            expect(screen.getByRole("tooltip", { name: "請選擇要編輯的目錄", hidden: false })).toBeVisible();
        });

        const editBtn = await screen.findByRole("button", { name: "編輯目錄" });
        expect(editBtn).toBeDisabled();
    })

    test("close dialog reset value", async () => {
        const { user } = render(<EditMenuDialog selectedMenuItem={pageMenu1} parentId={2} handleSelectedMenuChange={vi.fn()} handleSelectedItemChange={vi.fn()} />)

        const editBtn = await screen.findByRole("button", { name: "編輯目錄" });
        await user.click(editBtn);

        const titleTextBox = await screen.findByRole("textbox", { name: "目錄標題" });
        const parentComboBox = await screen.findByRole("combobox", { name: "上層節點" });
        const statusComboBox = await screen.findByRole("combobox", { name: "啟用狀態" });
        const cancelBtn = screen.getByRole("button", { name: "取消" });

        await user.clear(titleTextBox);
        await user.clear(parentComboBox);
        user.click(statusComboBox);
        user.click(await screen.findByRole("option", { name: "停用" }));
        await waitFor(() => {
            expect(statusComboBox).toHaveTextContent("停用");
        });

        //點擊 取消
        await user.click(cancelBtn);
        //點擊 編輯目錄
        await user.click(editBtn);

        //節點關聯名稱 
        expect(titleTextBox).toHaveValue(pageMenu1.Title);
        //上層節點
        expect(parentComboBox).toHaveValue(firstTitle);
    })
})