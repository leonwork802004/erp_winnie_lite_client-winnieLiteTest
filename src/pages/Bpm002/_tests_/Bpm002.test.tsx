import { faker } from "@faker-js/faker";
import nock from "nock";
import {
  mockButtonRequest,
  render,
  screen,
  url,
  waitFor,
} from "@tests/test-utils";
import Bpm002 from "..";
import {
  ConnResSchema,
  FetchConnResponse,
  FetchSiteContentResponse,
  SiteContentSchema,
  clearCacheApi,
  getConnResApi,
} from "../api";
import { buttons } from "../utils";

const featureNames = Object.values(buttons).map((button) => button.featureName);
const labels = Object.values(buttons).map((button) => button.label);

//建立 站台連線假資料
const createData = (): ConnResSchema => {
  return {
    Name: faker.internet.domainName(),
    Url: faker.internet.url(),
    Code: faker.internet.httpStatusCode(),
    Content: faker.internet.domainWord(),
  };
};
const mockData = faker.helpers.multiple(createData, { count: 1 });
const mockRes: FetchConnResponse = {
  Code: "200",
  Msg: "OK",
  Data: mockData,
};

const baseMockRes = {
  Code: "200",
  Msg: "OK"
};

//建立 測試功能內容假資料
const createSiteContentData = (): SiteContentSchema => {
  return {
    OSName: faker.internet.domainName(),
    AppName: faker.internet.domainName(),
    Version: faker.system.semver(),
    AppPath: faker.internet.url(),
    LogPath: faker.internet.url(),
  };
};
const mockSiteContentRes: FetchSiteContentResponse = {
  Code: "200",
  Msg: "OK",
  Data: createSiteContentData(),
};

describe("<Bpm002 />", () => {
  beforeEach(() => {
    mockButtonRequest(featureNames);

    nock(url)
      .get("/BpmSite/ConnRes")
      .reply(200, mockRes)

      .put("/BpmSite/ClearAgentFlowCache")
      .query({ type: "ALL" })
      .reply(200, baseMockRes)

      .put("/BpmSite/ClearAgentFlowCache")
      .query({ type: "ARTIFACT" })
      .reply(200, baseMockRes)

      .put("/BpmSite/ClearAgentFlowCache")
      .query({ type: "PROCESS" })
      .reply(200, baseMockRes)

      .put("/BpmSite/ClearAgentFlowCache")
      .query({ type: "ORG" })
      .reply(200, baseMockRes)

      .put("/BpmSite/ClearTomcatCache")
      .reply(200, baseMockRes)

      .put("/BpmSite/ClearFormCache")
      .reply(200, baseMockRes)

      .put("/BpmSite/StopApp")
      .reply(200, baseMockRes)

      .get("/BpmSite/SiteContent")
      .reply(200, mockSiteContentRes)
  });

  test("測試 - 清空 AgentFlow Cache", async () => {
    const { user } = render(<Bpm002 />);

    const fetchClearAgentFlowCache = vi.spyOn(
      clearCacheApi,
      "useFetchClearAgentFlowCache"
    );
    const ClearAgentFlowCache_AllBtn = await screen.findByRole("button", {
      name: "清空 AgentFlow Cache(全部)",
    });
    const ClearAgentFlowCache_ArtifactBtn = await screen.findByRole("button", {
      name: "清空 AgentFlow Cache(ARTIFACT)",
    });
    const ClearAgentFlowCache_ProcessBtn = await screen.findByRole("button", {
      name: "清空 AgentFlow Cache(PROCESS)",
    });
    const ClearAgentFlowCache_ORGBtn = await screen.findByRole("button", {
      name: "清空 AgentFlow Cache(ORG)",
    });

    //測試api資料
    mockButtonRequest(Object.values(featureNames));
    nock(url).put("/BpmSite/ClearAgentFlowCache").reply(200);

    //點擊按鈕 function是否有被呼叫
    await user.click(ClearAgentFlowCache_AllBtn);
    expect(fetchClearAgentFlowCache).toHaveBeenCalled();
    expect(fetchClearAgentFlowCache).toHaveReturned();
    //點擊按鈕 function是否有被呼叫
    await user.click(ClearAgentFlowCache_ArtifactBtn);
    expect(fetchClearAgentFlowCache).toHaveBeenCalled();
    expect(fetchClearAgentFlowCache).toHaveReturned();
    //點擊按鈕 function是否有被呼叫
    await user.click(ClearAgentFlowCache_ProcessBtn);
    expect(fetchClearAgentFlowCache).toHaveBeenCalled();
    expect(fetchClearAgentFlowCache).toHaveReturned();
    //點擊按鈕 function是否有被呼叫
    await user.click(ClearAgentFlowCache_ORGBtn);
    expect(fetchClearAgentFlowCache).toHaveBeenCalled();
    expect(fetchClearAgentFlowCache).toHaveReturned();
  });

  test("測試 - 清空 Tomcat Cache", async () => {
    const { user } = render(<Bpm002 />);
    const fetchClearTomcatCache = vi.spyOn(
      clearCacheApi,
      "useFetchClearTomcatCache"
    );
    const ClearTomcatCacheBtn = await screen.findByRole("button", {
      name: "清空 Tomcat Cache",
    });

    //測試api資料
    mockButtonRequest(Object.values(featureNames));
    nock(url).put("/BpmSite/ClearTomcatCache").reply(200);

    //點擊按鈕 function是否有被呼叫
    await user.click(ClearTomcatCacheBtn);
    expect(fetchClearTomcatCache).toHaveBeenCalled();
    expect(fetchClearTomcatCache).toHaveReturned();
  });

  test("測試 - 清空 表單 Cache", async () => {
    const { user } = render(<Bpm002 />);
    const fetchClearFormCache = vi.spyOn(
      clearCacheApi,
      "useFetchClearFormCache"
    );
    const ClearFormCacheBtn = await screen.findByRole("button", {
      name: "清空 表單 Cache",
    });

    //測試api資料
    mockButtonRequest(Object.values(featureNames));
    nock(url).put("/BpmSite/ClearFormCache").reply(200);

    //點擊按鈕 function是否有被呼叫
    await user.click(ClearFormCacheBtn);
    expect(fetchClearFormCache).toHaveBeenCalled();
    expect(fetchClearFormCache).toHaveReturned();
  });

  test("測試 - 重啟站台", async () => {
    const { user } = render(<Bpm002 />);
    const fetchStopApp = vi.spyOn(clearCacheApi, "useFetchStopApp");
    const StopAppBtn = await screen.findByRole("button", { name: "重啟站台" });

    //測試api資料
    mockButtonRequest(Object.values(featureNames));
    nock(url).put("/BpmSite/StopApp").reply(200);

    //點擊按鈕 function是否有被呼叫
    await user.click(StopAppBtn);
    expect(fetchStopApp).toHaveBeenCalled();
    expect(fetchStopApp).toHaveReturned();
  });

  test("測試 - 取得測試功能內容", async () => {
    render(<Bpm002 />);

    //測試api資料
    mockButtonRequest(Object.values(featureNames));
    nock(url).get("/BpmSite/SiteContent").reply(200, mockSiteContentRes);

    //判斷是否有正確取到值
    const row = await screen.findAllByRole("table");
    await waitFor(() =>
      expect(row[0]).toHaveTextContent(`${mockSiteContentRes.Data.OSName}`)
    );
  });

  test("get 測試站台連線 data - success", async () => {
    const { user } = render(<Bpm002 />);
    const fetchConnRes = vi.spyOn(getConnResApi, "useFetchConnRes");
    const connResBtn = await screen.findByRole("button", {
      name: "測試站台連線",
    });

    //測試api資料
    mockButtonRequest(Object.values(featureNames));
    nock(url).get("/BpmSite/ConnRes").reply(200, mockRes);

    await user.click(connResBtn);

    //判斷是否有正確取到值
    expect(await screen.findByText(mockData[0].Content)).toBeInTheDocument();

    //點擊查詢按鈕 function是否有被呼叫
    await user.click(connResBtn);
    expect(fetchConnRes).toHaveBeenCalled();
    expect(fetchConnRes).toHaveReturned();
  });

  //檢查畫面元件是否存在
  test("ui exist", async () => {
    render(<Bpm002 />);
    labels.forEach(async (element) => {
      const button = await screen.findByRole("button", { name: element });
      expect(button).toBeInTheDocument();
    });
  });
});