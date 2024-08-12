import nock from "nock";
import { url, screen, render, mockButtonRequest } from "@tests/test-utils";
import { AddBtnPayload, AddBtnResponse } from "../api/type";
import { AddBtnDialog } from "../components";
import { buttons } from "../utils";

const pageMenu1 = {
    Id: 3,
    Title: "頁面1",
    Priority: 0,
    Status: 1,
    PageId: 1
}

const name = "Btn1";
const title = "按鈕1";

const param: AddBtnPayload = {
    Name: name,
    Title: title,
    Status: 0,
    PageId: 1
}

const response: AddBtnResponse = {
    Code: "200",
    Msg: "新增成功",
    Data: {
        BtnId: 1,
        PageBtnId: 1
    }
};

const featureNames = Object.values(buttons).map((button) => button.featureName);

describe("<AddBtnDialog />", async () => {
    beforeEach(() => {
        mockButtonRequest(Object.values(featureNames));
        nock(url)
            .post("/Button/Btn", param).reply(200, response);
    })
    test("open / close addBtn dialog, test default value,close dialog reset value", async () => {
        const { user } = render(<AddBtnDialog selectedMenuItem={pageMenu1} />)

        const addBtn = await screen.findByRole("button", { name: "新增按鈕" });
        user.click(addBtn);

        expect(await screen.findByRole("dialog", { name: "新增按鈕" })).toBeVisible();

        const nameTextBox = await screen.findByRole("textbox", { name: "按鈕關聯名稱" });
        const titleTextBox = await screen.findByRole("textbox", { name: "按鈕標題" });
        const statusComboBox = await screen.findByRole("combobox", { name: "啟用狀態" });
        const submitBtn = screen.getByRole("button", { name: "確定" });
        const cancelBtn = await screen.findByRole("button", { name: "取消" });

        //預設值
        expect(nameTextBox).toHaveValue("");
        expect(titleTextBox).toHaveValue("");
        expect(statusComboBox).toHaveTextContent("啟用");

        //點擊 確認
        user.click(submitBtn);
        //顯示錯誤訊息
        expect(await screen.findByText("請輸入按鈕關聯名稱")).toBeInTheDocument();
        expect(await screen.findByText("請輸入按鈕標題")).toBeInTheDocument();

        //填寫 按鈕關聯名稱
        user.type(nameTextBox, "123123");
        //點擊 確認
        user.click(submitBtn);
        //顯示錯誤訊息
        expect(await screen.findByText("請輸入按鈕標題")).toBeInTheDocument();

        //輸入表單內容
        user.type(nameTextBox, "123123");
        user.type(titleTextBox, "123123");
        user.click(statusComboBox);
        user.click(await screen.findByRole("option", { name: "停用" }));

        //點擊 取消
        await user.click(cancelBtn);
        //點擊 新增按鈕
        await user.click(addBtn);

        //確認恢復為預設值
        expect(nameTextBox).toHaveValue("");
        expect(titleTextBox).toHaveValue("");
    })

    test("click submit - update success", async () => {
        const { user } = render(<AddBtnDialog selectedMenuItem={pageMenu1} />)

        const addBtn = await screen.findByRole("button", { name: "新增按鈕" });
        user.click(addBtn);

        const nameTextBox = await screen.findByRole("textbox", { name: "按鈕關聯名稱" });
        const titleTextBox = await screen.findByRole("textbox", { name: "按鈕標題" });
        const statusComboBox = await screen.findByRole("combobox", { name: "啟用狀態" });
        const submitBtn = await screen.findByRole("button", { name: "確定" });

        //輸入表單內容
        await user.type(nameTextBox, name);
        await user.type(titleTextBox, title);
        await user.click(statusComboBox);
        await user.click(await screen.findByRole("option", { name: "停用" }));
        
        //點擊 確認
        await user.click(submitBtn);
        expect(await screen.findByText("新增成功")).toBeInTheDocument();
    })
})