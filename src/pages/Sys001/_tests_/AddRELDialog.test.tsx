import { faker } from "@faker-js/faker";
import nock from "nock"
import { screen, url, render, mockButtonRequest } from "@tests/test-utils";
import { AddPageBtnPayload, AddPageBtnResponse } from "../api/type";
import { AddRELDialog } from "../components";
import { buttons } from "../utils";

const mockBtnData = [
    {
        "Id": 1,
        "Name": "Sys001_Btn1",
        "Title": faker.animal.bear(),
        "CreatedAt": faker.date.anytime().toLocaleDateString(),
        "Status": 1
    },
    {
        "Id": 2,
        "Name": "Sys001_Btn2",
        "Title": faker.animal.bird(),
        "CreatedAt": faker.date.anytime().toLocaleDateString(),
        "Status": 1
    }
]

const pageMenu1 = {
    Id: 3,
    Title: "頁面1",
    Priority: 0,
    Status: 1,
    PageId: 3
}

const mockRes = {
    Code: "200",
    Msg: "查詢成功",
};

const response: AddPageBtnResponse = {
    Code: "200",
    Msg: "新增成功",
    Data: 1
};
const cmd: AddPageBtnPayload = {
    PageId: 3,
    BtnId: 1
};

const featureNames = Object.values(buttons).map((button) => button.featureName);

describe("<AddRELDialog />", async () => {
    beforeEach(() => {
        mockButtonRequest(Object.values(featureNames));
        nock(url)
            .get("/Button/NotRELBtns")
            .reply(200, {
                ...mockRes,
                Data: mockBtnData,
            })
            .post("/Button/PageBtn", cmd).reply(200, response);
    })
    test("test dialog", async () => {
        const { user, } = render(<AddRELDialog selectedMenuItem={pageMenu1} />)

        nock(url)
            .get("/Button/NotRELBtns")
            .reply(200, {
                ...mockRes,
                Data: mockBtnData,
            })
            .post("/Button/PageBtn", cmd).reply(200, response);

        const addBtn = await screen.findByRole("button", { name: "新增關聯按鈕" });

        user.click(addBtn);
        expect(await screen.findByRole("dialog", { name: `新增關聯按鈕` })).toBeVisible();

        const btnComboBox = await screen.findByRole("combobox", { name: "按鈕標題" });
        user.click(btnComboBox);
        user.click(await screen.findByText(`${mockBtnData[0].Title} (${mockBtnData[0].Name})`));

        const submitBtn = await screen.findByRole("button", { name: "確定" });
        await user.click(submitBtn);
        expect(await screen.findByText("新增成功")).toBeInTheDocument();

        user.click(addBtn);
        await user.click(submitBtn);
        expect(await screen.findByText("請選擇欲新增的關聯按鈕")).toBeInTheDocument();
    })
})