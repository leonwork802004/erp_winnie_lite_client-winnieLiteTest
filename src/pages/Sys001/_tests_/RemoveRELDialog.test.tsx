import { faker } from "@faker-js/faker";
import nock from "nock";
import { url, screen, render, mockButtonRequest, waitFor } from "@tests/test-utils";
import { DeletePageBtnPayload } from "../api/type";
import { RemoveRELDialog } from "../components";
import { buttons } from "../utils";

const pageMenu1 = {
    Id: 3,
    Title: "頁面1",
    Priority: 0,
    Status: 1,
    PageId: faker.number.int()
}

const pageBtnSchema = {
    PageBtnId: 1,
    Id: 1,
    Name: "Name1",
    Title: "Title1",
    CreatedAt: faker.date.anytime().toLocaleDateString(),
    Status: 1
}

const mockRes = {
    Code: "200",
    Msg: "移除成功",
};

const param: DeletePageBtnPayload = {
    PageBtnId: 1
}

const featureNames = Object.values(buttons).map((button) => button.featureName);

describe("<RemoveRELDialog />", async () => {
    beforeEach(() => {
        mockButtonRequest(Object.values(featureNames));
        nock(url)
            .delete("/Button/PageBtn")
            .query(param)
            .reply(200, mockRes);
    })
    test("selectedItem without selection, button style, and submit", async () => {
        const { user } = render(<RemoveRELDialog selectedBtnItem={null} selectedMenuItem={pageMenu1} />)

        user.hover(screen.getByLabelText("請選擇要移除的按鈕"));

        await waitFor(() => {
            expect(screen.getByRole("tooltip", { name: "請選擇要移除的按鈕", hidden: false })).toBeVisible();
        });

        const removeBtn = await screen.findByRole("button", { name: "移除關聯按鈕" });
        expect(removeBtn).toBeDisabled();
    })

    test("Success remove selectedItem data", async () => {
        const { user } = render(<RemoveRELDialog selectedBtnItem={pageBtnSchema} selectedMenuItem={pageMenu1} />)

        const removeBtn = await screen.findByRole("button", { name: "移除關聯按鈕" });
        user.click(removeBtn);

        expect(await screen.findByRole("dialog", { name: "是否移除按鈕關聯?" })).toBeVisible();
        expect(await screen.findByText(`移除 ${pageBtnSchema.Title} 頁面關聯`)).toBeInTheDocument();

        const submitBtn = screen.getByRole("button", { name: "確定" });

        await user.click(submitBtn);
        expect(await screen.findByText("移除成功")).toBeInTheDocument();
    })
})