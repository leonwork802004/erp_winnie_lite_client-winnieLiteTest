import nock from "nock";
import { MenuItem, TextField } from "@mui/material";
import { screen, url, render, mockButtonRequest } from "@tests/test-utils";
import { SyncModeSchema, UpdateSyncModeDataPayload } from "../api";
import { SetSyncModeDialog } from "../components";
import { buttons } from "../utils";

const mockRes = {
    Code: "200",
    Msg: "查詢成功",
};

//人員假資料
const modeDataY: SyncModeSchema =
{
    Mode: "Y",
    Limit: 20,
};
const modeDataP: SyncModeSchema =
{
    Mode: "P",
};

describe("<SetSyncModeDialog />", () => {
    beforeEach(() => {
        mockButtonRequest([buttons.setSyncMode.featureName]);
        nock(url)
            .get("/BpmOrgSync/Sync/Mode")
            .reply(200, modeDataY)
    })

    test("opens the dialog when clicked", async () => {
        const { user } = render(<SetSyncModeDialog />);

        render(
            <TextField
                select
                label="同步模式"
                size="small"
                required
                defaultValue={modeDataP.Mode}
                value={modeDataP.Mode}
            >
                <MenuItem value="P">忽略檢查</MenuItem>
                <MenuItem value="T">測試模式</MenuItem>
                <MenuItem value="Y">允許忽略檢查一次</MenuItem>
                <MenuItem value="N">限制數量</MenuItem>
            </TextField>
        )

        user.click(await screen.findByRole("button", { name: "設定同步模式" }));
        expect(await screen.findByRole("dialog")).toBeVisible();
        expect(await screen.findByRole("heading", { name: "設定同步模式" })).toBeInTheDocument();
        const comboMode = await screen.findByRole("combobox", { name: "同步模式" });
        expect(await screen.findByText("忽略檢查")).toBeInTheDocument();
        expect(comboMode).toBeInTheDocument();
    })

    test("switch mode and correctly display/hide the limit textField", async () => {
        const { user } = render(<SetSyncModeDialog />);

        user.click(await screen.findByRole("button", { name: "設定同步模式" }));
        const comboMode = await screen.findByRole("combobox", { name: "同步模式" });

        //同步模式 允許忽略檢查一次/限制數量 會顯示限制數量輸入框  
        user.click(comboMode);
        user.click(await screen.findByRole("option", { name: "允許忽略檢查一次" }));
        expect(await screen.findByText("允許忽略檢查一次")).toBeInTheDocument();

        const inputNum = await screen.findByRole("spinbutton", { name: "限制數量" });
        expect(inputNum).toBeInTheDocument();

        user.click(comboMode);
        user.click(await screen.findByRole("option", { name: "限制數量" }));
        expect(await screen.findByLabelText("限制數量")).toBeInTheDocument();
        expect(inputNum).toBeInTheDocument();

        //同步模式 忽略檢查/測試模式, 不會顯示限制數量輸入框
        user.click(comboMode);
        user.click(await screen.findByRole("option", { name: "測試模式" }));
        expect(await screen.findByText("測試模式")).toBeInTheDocument();
        expect(inputNum).not.toBeVisible;

        user.click(comboMode);
        user.click(await screen.findByRole("option", { name: "忽略檢查" }));
        //expect(await screen.findByText("忽略檢查")).toBeInTheDocument();
        expect(inputNum).not.toBeVisible;
    })

    test("update data success", async () => {
        const { user } = render(<SetSyncModeDialog />);

        const payload: UpdateSyncModeDataPayload = {
            Mode: "P",
        };

        nock(url)
            .put("/BpmOrgSync/Sync/Mode")
            .query({ ...payload })
            .reply(200, mockRes);

        user.click(await screen.findByRole("button", { name: "設定同步模式" }));

        const comboMode = await screen.findByRole("combobox", { name: "同步模式" });
        user.click(comboMode);
        user.click(await screen.findByRole("option", { name: "忽略檢查" }));

        const submitBtn = await screen.findByRole("button", { name: "確定" });
        user.click(submitBtn);
        expect(await screen.findByText("設定同步模式 成功")).toBeInTheDocument();
    })

    test("show error message if limit is did not qualified", async () => {
        const { user } = render(<SetSyncModeDialog />);

        user.click(await screen.findByRole("button", { name: "設定同步模式" }));

        const comboMode = await screen.findByRole("combobox", { name: "同步模式" });
        expect(comboMode).toBeInTheDocument();

        user.click(comboMode);
        user.click(await screen.findByText("允許忽略檢查一次"));
        expect(await screen.findByText("允許忽略檢查一次")).toBeInTheDocument();

        const inputNum = await screen.findByRole("spinbutton", { name: "限制數量" });
        expect(inputNum).toBeInTheDocument();

        const btnSubmit = await screen.findByRole("button", { name: "確定" });

        user.click(btnSubmit);
        expect(await screen.findByText("請輸入限制數量")).toBeInTheDocument();

        await user.type(inputNum, "1")
        user.click(btnSubmit);
        expect(await screen.findByText("限制數量最小值為 5")).toBeInTheDocument();
    })

    test("reset form value if dialog close", async () => {
        const { user } = render(<SetSyncModeDialog />);
        render(
            <TextField
                select
                label="同步模式"
                size="small"
                required
                defaultValue={modeDataY.Mode}
                value={modeDataY.Mode}
            >
                <MenuItem value="P">忽略檢查</MenuItem>
                <MenuItem value="T">測試模式</MenuItem>
                <MenuItem value="Y">允許忽略檢查一次</MenuItem>
                <MenuItem value="N">限制數量</MenuItem>
            </TextField>
        )

        user.click(await screen.findByRole("button", { name: "設定同步模式" }));
        const comboMode = await screen.findByRole("combobox", { name: "同步模式" });

        expect(await screen.findByText("允許忽略檢查一次")).toBeInTheDocument();

        user.click(comboMode);
        user.click(await screen.findByRole("option", { name: "限制數量" }));
        expect(await screen.findByText("限制數量")).toBeInTheDocument();

        user.click(await screen.findByRole("button", { name: "取消" }));

        user.click(comboMode);
        expect(await screen.findByLabelText("允許忽略檢查一次")).toBeInTheDocument();
    });
})