import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Item, Table } from "@components/Elements";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { useTableSelected } from "@hooks/useTableSelected";
import { FetchWinnieUserPayload, WinnieUserSchema, unlockUserApi } from "./api";
import { WinnieUsr001Input, WinnieUsr001Buttons } from "./components";
import { userColumns } from "./utils";

const initialInput: FetchWinnieUserPayload = {
  acct: "",
  name: "",
  empNo: "",
  usrNo: "",
};

const WinnieUsr001 = () => {
  //#region state
  const [input, setInput] = useSessionStorageState<FetchWinnieUserPayload>(
    "input",
    initialInput
  );
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const [userPayload, setUserPayload] =
    useSessionStorageState<FetchWinnieUserPayload>("userPayload", initialInput);
  const handleUserPayloadChange = (data: FetchWinnieUserPayload) => {
    setUserPayload(data);
  };

  const { selected, handleSelectedClick } =
    useTableSelected<WinnieUserSchema | null>();
  //#endregion

  const { data } = unlockUserApi.useFetchWinnieUser(userPayload);

  return (
    <Grid
      container
      spacing={{ xs: 1, md: 2 }}
      direction={{ xs: "column", md: "row" }}
      p={2}
    >
      <Grid item md={2} xs="auto">
        <Item>
          <WinnieUsr001Input input={input} onInputChange={handleInputChange} />
        </Item>
      </Grid>

      <Grid item md xs>
        <Stack spacing={{ xs: 1, md: 2 }} height={"100%"}>
          <Item sx={{ height: "auto" }}>
            <WinnieUsr001Buttons
              input={input}
              userPayload={userPayload}
              selected={selected}
              onUserPayloadChange={handleUserPayloadChange}
              onSelectedChange={handleSelectedClick}
            />
          </Item>

          <Table<WinnieUserSchema>
            data={data?.Data}
            columns={userColumns}
            selected={selected}
            onSelectedClick={handleSelectedClick}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default WinnieUsr001;
