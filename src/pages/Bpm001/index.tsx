import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Item, Table } from "@components/Elements";
import { useSessionStorageState } from "@hooks/useSessionStorageState";
import { useTableSelected } from "@hooks/useTableSelected";
import { FetchDepPayload, DepSchema, getDepApi } from "./api";
import { Bpm001Input, Bpm001Buttons } from "./components";
import { depColumns } from "./utils";

const Bpm001 = () => {
  const initialInput: FetchDepPayload = {
    depNo: "",
    depNameLike: "",
    exclHist: 0,
  };

  //#region state
  const [input, setInput] = useSessionStorageState<FetchDepPayload>(
    "input",
    initialInput
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInput({ ...input, "exclHist": e.target.checked ? 1 : 0 });
  };

  const checkValue = (input.exclHist == 0 ? false : true);

  const [depPayload, setDepPayload] =
    useState<FetchDepPayload>(initialInput);
  const handleDepPayloadChange = (data: FetchDepPayload) => {
    setDepPayload(data);
  };

  const { selected, handleSelectedClick } =
    useTableSelected<DepSchema | null>();
  //#endregion

  const { data } = getDepApi.useFetchDep(depPayload);

  return (
    <Grid
      container
      spacing={{ xs: 1, md: 2 }}
      height="100%"
      direction={{ xs: "column", md: "row" }}
      p={2}
    >
      <Grid item md={2} xs="auto">
        <Item>
          <Bpm001Input
            input={input}
            handleInputChange={handleInputChange}
          />
          <FormControlLabel
            control={<Checkbox onChange={handleCheckChange} checked={checkValue} />}
            label={<Typography>排除歷史部門</Typography>}
          />
        </Item>
      </Grid>

      <Grid
        container
        item
        md
        xs
        direction="column"
        alignItems="stretch"
        spacing={{ xs: 1, md: 2 }}
      >
        <Grid item xs={1}>
          <Item>
            <Bpm001Buttons
              input={input}
              depPayload={depPayload}
              handleDepPayloadChange={handleDepPayloadChange}
              handleSelectedChange={handleSelectedClick}
            />
          </Item>
        </Grid>

        <Grid item xs >
          <Item>
            <Table<DepSchema>
              data={data?.Data}
              columns={depColumns}
              selected={selected}
              onSelectedClick={handleSelectedClick}
            />
          </Item>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Bpm001;
