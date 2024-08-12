import { every, isEmpty, isEqual } from "lodash-es";
import toast from "react-hot-toast";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import { UserButton } from "@features/userButton";
import {
  FetchDepPayload,
  DepSchema,
  getDepApi,
} from "../api";
import { buttons } from "../utils";

type Bpm001ButtonsProps = {
  input: FetchDepPayload;
  depPayload: FetchDepPayload;
  handleDepPayloadChange: (data: FetchDepPayload) => void;
  handleSelectedChange: (row: DepSchema | null) => void;
};

export const Bpm001Buttons = ({
  input,
  depPayload,
  handleDepPayloadChange,
  handleSelectedChange,
}: Bpm001ButtonsProps) => {
  const { qry } = buttons;
  const { refetch, isFetching } = getDepApi.useFetchDep(depPayload);
  //#region 查詢部門
  const handleFetchDep = () => {
    if (every(input.depNo, (value) => isEmpty(value)) && every(input.depNameLike, (value) => isEmpty(value))) {
      toast.error("至少輸入一個查詢條件");
      return;
    }

    if (isEqual(input, depPayload)) {
      refetch();
    } else {
      handleDepPayloadChange(input);
    }
    handleSelectedChange(null);
  };
  //#endregion

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, md: 2 }}
      useFlexGap
      flexWrap="wrap"
      height="100%"
      alignItems="center"
    >
      <UserButton
        featureName={qry.featureName}
        variant="outlined"
        startIcon={<SearchIcon />}
        onClick={handleFetchDep}
        isLoading={isFetching}
      >
        {qry.label}
      </UserButton>
    </Stack>
  );
};
