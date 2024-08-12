import { faker } from "@faker-js/faker";
import { render, screen } from "@tests/test-utils";
import { TableColumn } from "..";
import { Table } from "../Table";

const createData = () => ({
  id: faker.string.uuid(),
  name: faker.internet.userName(),
  age: faker.number.int(100),
});

const mockData = faker.helpers.multiple(createData, {
  count: 2,
});
const mockColumns: TableColumn<any>[] = [
  { title: "ID", field: "id" },
  { title: "Name", field: "name" },
  { title: "Age", field: "age" },
];
const handleSelectedClick = vi.fn();

describe("<Table />", () => {
  test("render success and sort data success", async () => {
    const { user } = render(
      <Table
        data={mockData}
        columns={mockColumns}
        selected={null}
        onSelectedClick={handleSelectedClick}
      />
    );

    expect(
      screen.getByRole("columnheader", { name: "ID" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: mockData[0].name })
    ).toBeInTheDocument();

    // get 預設 row data
    const row = screen.getAllByRole("row");
    expect(row[1]).toHaveTextContent(`${mockData[0].age}`);
    expect(row[2]).toHaveTextContent(`${mockData[1].age}`);

    // 點選排序，資料順序改變
    await user.click(screen.getByRole("button", { name: "Age" }));

    const sortedData = mockData.slice().sort((a, b) => a.age - b.age);

    expect(row[1]).toHaveTextContent(`${sortedData[0].age}`);
    expect(row[2]).toHaveTextContent(`${sortedData[1].age}`);

    await user.click(screen.getByRole("button", { name: "Age" }));

    expect(row[1]).toHaveTextContent(`${sortedData[1].age}`);
    expect(row[2]).toHaveTextContent(`${sortedData[0].age}`);

    // 選取 row
    await user.click(row[1]);
    expect(handleSelectedClick).toHaveBeenCalledWith(sortedData[1]);
  });
});
