import { faker } from "@faker-js/faker";
import nock from "nock"
import { screen, url, render, mockButtonRequest } from "@tests/test-utils";
import { GetPageBtnPayload, MenuNodesSchema, PageBtnSchema } from "../api/type";
import { AddMenuDialog } from "../components";
import { buttons } from "../utils";

const mainTitle = "主節點1";
const firstTitle = "目錄節點1";
const secondTitle = "目錄節點2";
const page1Title = "頁面1";
const page2Title = "頁面2";

const pageMenu1 = {
    Id: faker.number.int(),
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
            Id: faker.number.int(),
            Title: firstTitle,
            Priority: 0,
            Status: 1,
            Children: [
                { pageMenu1 },
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

const mockNodeData: Array<MenuNodesSchema> = [
    {
        Id: faker.number.int(),
        Title: firstTitle,
        Status: 1
    },
    {
        Id: faker.number.int(),
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

    test("test the opening and closing functions of the pop-up window and the functions within the window", async () => {
        const { user } = render(<AddMenuDialog selectedMenuItem={pageMenu1} />)

        const addBtn = await screen.findByRole("button", { name: "新增目錄" });
        expect(addBtn).toBeInTheDocument();

        await user.click(addBtn);
        expect(await screen.findByRole("dialog", { name: "新增目錄" })).toBeVisible();

        const setMainNode = screen.getByRole("checkbox", { name: "設定為主節點" });
        const nodeNameTextBox = screen.getByRole("textbox", { name: "節點關聯名稱" });
        const parentComboBox = screen.getByRole("combobox", { name: "上層節點" });
        const submitBtn = screen.getByRole("button", { name: "確定" });
        const cancelBtn = screen.getByRole("button", { name: "取消" });
        
        //預設不會勾選 設定為主節點
        expect(setMainNode).not.toBeChecked();
        //預設 節點關聯名稱為 disable    
        expect(nodeNameTextBox).toBeDisabled();
        //預設 上層節點 不為 disable  
        expect(parentComboBox).not.toBeDisabled();

        await user.click(submitBtn);
        expect(await screen.findByText("請輸入目錄標題")).toBeInTheDocument();
        expect(await screen.findByText("請選擇上層節點")).toBeInTheDocument();

        //勾選 設定主節點
        await user.click(setMainNode);
        //節點關聯名稱 不為 disable
        expect(nodeNameTextBox).not.toBeDisabled();
        //上層節點為 disable
        expect(parentComboBox).toBeDisabled();
     
        await user.click(submitBtn);       
        expect(await screen.findByText("請輸入節點關聯名稱")).toBeInTheDocument();

        await user.click(cancelBtn);
        expect(await screen.findByRole("dialog", { name: "新增目錄" })).not.toBeVisible();
    })
})