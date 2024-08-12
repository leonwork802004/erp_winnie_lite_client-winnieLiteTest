import { faker } from "@faker-js/faker";
import nock from "nock";
import { mockButtonRequest, url, render, screen, waitFor } from "@tests/test-utils";
import { UpdateBtnPayload, UpdateBtnResponse } from "../api/type";
import { EditBtnDialog } from "../components";
import { buttons } from "../utils";

const pageData = {
    Id: 3,
    Title: "頁面1",
    Priority: 0,
    Status: 1,
    PageId: 1
}

const name = "Btn1";
const title = "按鈕1";

const btnData = {
    PageBtnId: 1,
    Id: 1,
    Name: name,
    Title: title,
    CreatedAt: faker.date.anytime().toDateString(),
    Status: 1
}

const param: UpdateBtnPayload = {
    BtnId: 1,
    Title: "按鈕",
    Status: 0,
}

const response: UpdateBtnResponse = {
    Code: "200",
    Msg: "查詢成功",
    Data: {
        BtnId: 1
    }
};

const featureNames = Object.values(buttons).map((button) => button.featureName);

describe("<EditBtnDialog />", async () => {
    beforeEach(() => {
        mockButtonRequest(Object.values(featureNames));
        nock(url)
            .patch("/Button/Btn", { Title: param.Title, Status: param.Status })
            .query({ BtnId: param.BtnId })
            .reply(200, response);
    })

    test("selectedItem without selection, button style", async () => {
        const { user } = render(<EditBtnDialog selectedBtnItem={null} selectedMenuItem={pageData} onSelectItemChange={vi.fn()} setRowSelectionModel={vi.fn()} />)

        user.hover(screen.getByLabelText("請選擇要編輯的按鈕"));

        await waitFor(() => {
            expect(screen.getByRole("tooltip", { name: "請選擇要編輯的按鈕", hidden: false })).toBeVisible();
        });

        const editBtn = await screen.findByRole("button", { name: "編輯按鈕" });
        expect(editBtn).toBeDisabled();
    })

    test("open / close addBtn dialog, test default value,close dialog reset value", async () => {
        const { user } = render(<EditBtnDialog selectedBtnItem={btnData} selectedMenuItem={pageData} onSelectItemChange={vi.fn()} setRowSelectionModel={vi.fn()} />)

        const editBtn = await screen.findByRole("button", { name: "編輯按鈕" });
        user.click(editBtn);

        expect(await screen.findByRole("dialog", { name: `[編輯按鈕] ${btnData.Name}` })).toBeVisible();

        const titleTextBox = await screen.findByRole("textbox", { name: "按鈕標題" });
        const statusComboBox = await screen.findByRole("combobox", { name: "啟用狀態" });
        const cancelBtn = await screen.findByRole("button", { name: "取消" });

        //預設值
        expect(titleTextBox).toHaveValue(btnData.Title);
        expect(statusComboBox).toHaveTextContent("啟用");

        //點擊 取消
        user.click(cancelBtn);
        //點擊 編輯按鈕
        user.click(editBtn);

        //重新設定 預設值
        expect(titleTextBox).toHaveValue(btnData.Title);
        expect(statusComboBox).toHaveTextContent("啟用");
    })

    test("click submit - update success", async () => {
        const { user } = render(<EditBtnDialog selectedBtnItem={btnData} selectedMenuItem={pageData} onSelectItemChange={vi.fn()} setRowSelectionModel={vi.fn()} />)

        const addBtn = await screen.findByRole("button", { name: "編輯按鈕" });
        user.click(addBtn);

        const titleTextBox = await screen.findByRole("textbox", { name: "按鈕標題" });
        const statusComboBox = await screen.findByRole("combobox", { name: "啟用狀態" });
        const submitBtn = await screen.findByRole("button", { name: "確定" });

        //輸入按鈕標題
        await user.clear(titleTextBox);
        await user.type(titleTextBox, "按鈕");
        await user.click(statusComboBox);
        await user.click(await screen.findByRole("option", { name: "停用" }));

        //點擊 確認
        await user.click(submitBtn);
        expect(await screen.findByText("更新成功")).toBeInTheDocument();
    })

    test("click submit - update error", async () => {
        const { user } = render(<EditBtnDialog selectedBtnItem={btnData} selectedMenuItem={pageData} onSelectItemChange={vi.fn()} setRowSelectionModel={vi.fn()} />)

        const addBtn = await screen.findByRole("button", { name: "編輯按鈕" });
        user.click(addBtn);

        const titleTextBox = await screen.findByRole("textbox", { name: "按鈕標題" });
        const submitBtn = screen.getByRole("button", { name: "確定" });

        //清除按鈕標題
        user.clear(titleTextBox);
        //點擊 確認
        user.click(submitBtn);
        //顯示錯誤訊息
        expect(await screen.findByText("按鈕標題不可為空")).toBeInTheDocument();
    })
})