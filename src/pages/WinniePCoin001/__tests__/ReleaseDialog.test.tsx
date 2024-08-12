import nock from "nock";
import { BaseResponse } from "@appTypes/baseResponse";
import { mockButtonRequest, render, screen, url } from "@tests/test-utils";
import { GetActReleasersResponse, GetPCoinActDataPayload } from "../api";
import { ReleaseDialog } from "../components";
import { buttons } from "../utils";

const getDataPayload: GetPCoinActDataPayload = {
  begin: null,
  end: null,
  status: "",
  id: "",
};
const props = {
  ActId: "2",
  ActStatus: "-1",
};

describe("<ReleaseDialog />", () => {
  beforeEach(() => {
    mockButtonRequest([buttons.release]);
  });

  test("shows error message if ActId is undefined", async () => {
    const { user } = render(<ReleaseDialog getDataPayload={getDataPayload} />);
    await user.click(await screen.findByRole("button"));
    expect(screen.getByText("請選擇要放行的資料")).toBeInTheDocument();
  });

  test("shows error message if activity status is invalid", async () => {
    const { user } = render(
      <ReleaseDialog getDataPayload={getDataPayload} {...props} ActStatus="N" />
    );
    await user.click(await screen.findByRole("button"));
    expect(
      screen.getByText("活動狀態不為待審核，活動無法強制放行")
    ).toBeInTheDocument();
  });

  test("submits form on confirm and calls mutate", async () => {
    const { user } = render(
      <ReleaseDialog getDataPayload={getDataPayload} {...props} />
    );
    const releasers = ["維尼", "小熊維尼"];
    const mockReleasersRes: GetActReleasersResponse = {
      Code: "200",
      Msg: "",
      Data: releasers,
    };
    const mockRes: BaseResponse = {
      Code: "200",
      Msg: "放行成功",
    };
    nock(url)
      .get("/PCoinAct/ActReleasers")
      .reply(200, mockReleasersRes)
      .patch("/PCoinAct/ReleaseAct", { helpReleaser: releasers[0] })
      .query({ id: props.ActId })
      .reply(200, mockRes);

    await user.click(await screen.findByRole("button"));
    await user.click(await screen.findByLabelText("放行人"));
    await user.click(screen.getAllByRole("option")[0]);
    await user.click(screen.getByRole("button", { name: "確定" }));
    expect(await screen.findByText(mockRes.Msg)).toBeInTheDocument();
  });
});
