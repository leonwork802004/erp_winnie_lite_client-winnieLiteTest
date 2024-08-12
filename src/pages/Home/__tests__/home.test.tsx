import { faker } from "@faker-js/faker";
import nock from "nock";
import { render, screen, url } from "@tests/test-utils";
import Home from "..";
import { UserInfoSchema } from "../api";

describe("<Home />", () => {
  test("render success", async () => {
    const mockData: UserInfoSchema = {
      UserId: faker.number.int(),
      Name: faker.person.fullName(),
      StaffNo: faker.string.numeric(6),
      Status: 1,
      CreatedAt: faker.date.anytime().toString(),
    };
    nock(url).get("/user/info").reply(200, mockData);

    render(<Home />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    expect(await screen.findByText(/Welcome/i)).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(mockData.Name, "i"))
    ).toBeInTheDocument();
  });
});
