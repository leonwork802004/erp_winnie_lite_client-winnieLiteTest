import { render, screen } from "@tests/test-utils";
import { Perm002Filter } from "../components";

const input = {
  auth: " ",
  status: " ",
};
const handleInputChange = vi.fn();

test("change option success", async () => {
  const { user } = render(
    <Perm002Filter input={input} onInputChange={handleInputChange} />
  );
  expect(screen.getByLabelText("狀態")).toBeInTheDocument();
  expect(screen.getByLabelText("權限類型")).toBeInTheDocument();
  expect(screen.getAllByText("全部")).toHaveLength(2);

  const status = screen.getByLabelText("狀態");

  await user.click(status);
  expect(screen.getByRole("option", { name: "全部" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "停用" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "啟用" })).toBeInTheDocument();

  await user.click(screen.getByRole("option", { name: "停用" }));
  expect(handleInputChange).toHaveBeenCalledTimes(1);
});
