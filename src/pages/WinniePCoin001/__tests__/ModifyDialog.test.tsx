import nock from "nock";
import { BaseResponse } from "@appTypes/baseResponse";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import { GetPCoinActDataPayload } from "../api";
import { ModifyDialog } from "../components";
import { buttons } from "../utils";

const getDataPayload: GetPCoinActDataPayload = {
  begin: null,
  end: null,
  status: "",
  id: "",
};
const props = {
  ActId: "2",
  SendLimlt: 2000,
  IsSendLimlt: "Y",
  ActStatus: "1",
};

describe("<ModifyDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.modify]);
  });

  test("shows error message if ActId is undefined", async () => {
    const { user } = render(<ModifyDialog getDataPayload={getDataPayload} />);
    await user.click(await screen.findByRole("button"));
    expect(screen.getByText("請選擇要修改的資料")).toBeInTheDocument();
  });

  test("shows error message if activity status is invalid", async () => {
    const { user } = render(
      <ModifyDialog getDataPayload={getDataPayload} {...props} ActStatus="N" />
    );
    await user.click(await screen.findByRole("button"));
    expect(
      screen.getByText(
        "活動已結束或刪除或審核不通過或未及時生效，無法調整活動贈送點數限制"
      )
    ).toBeInTheDocument();
  });

  test("shows error message if send limit is not set", async () => {
    const { user } = render(
      <ModifyDialog
        getDataPayload={getDataPayload}
        {...props}
        IsSendLimlt="N"
      />
    );
    await user.click(await screen.findByRole("button"));
    expect(screen.getByText("此筆活動未設定贈點上限")).toBeInTheDocument();
  });

  test("updates adjusted send limit when status or q changes", async () => {
    const { user } = render(
      <ModifyDialog getDataPayload={getDataPayload} {...props} />
    );

    await user.click(await screen.findByRole("button"));
    await user.type(screen.getByLabelText("活動調整額度"), "2000");
    await user.tab();
    expect(
      (screen.getByLabelText("調整後點數限制") as HTMLInputElement).value
    ).toBe("4000");

    await user.click(screen.getByLabelText("減額"));
    expect(
      (screen.getByLabelText("調整後點數限制") as HTMLInputElement).value
    ).toBe("0");
  });

  test("shows error message if adjusted send limit is negative", async () => {
    const { user } = render(
      <ModifyDialog getDataPayload={getDataPayload} {...props} />
    );

    await user.click(await screen.findByRole("button"));
    await user.click(screen.getByLabelText("減額"));
    await user.type(screen.getByLabelText("活動調整額度"), "4000");
    await user.tab();
    expect(
      (screen.getByLabelText("調整後點數限制") as HTMLInputElement).value
    ).toBe("-2000");
    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(
      screen.getByText("減額值不可大於原贈送點數限制值")
    ).toBeInTheDocument();
  });

  test("submits form on confirm and calls mutate", async () => {
    const { user } = render(
      <ModifyDialog getDataPayload={getDataPayload} {...props} />
    );
    const mockRes: BaseResponse = {
      Code: "200",
      Msg: "修改成功",
    };
    nock(url)
      .patch("/PCoinAct/CoinLimit")
      .query({ id: props.ActId, q: "+2000" })
      .reply(200, mockRes);

    await user.click(await screen.findByRole("button"));
    await user.type(screen.getByLabelText("活動調整額度"), "2000");
    await user.tab();
    expect(
      (screen.getByLabelText("調整後點數限制") as HTMLInputElement).value
    ).toBe("4000");
    await user.click(screen.getByRole("button", { name: "確定" }));

    expect(await screen.findByText(mockRes.Msg)).toBeInTheDocument();
  });
});
