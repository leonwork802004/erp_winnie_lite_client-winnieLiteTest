import { UserButton } from "@features/userButton";
import {
    ConnResSchema,
    getConnResApi,
} from "../api";
import { buttons } from "../utils";

type ConnResButtonProps = {
    handleSelectedChange: (row: ConnResSchema | null) => void;
};

//#region 取得站台測試功能內容
export const ConnResButton = ({
    handleSelectedChange,
}: ConnResButtonProps) => {
    const { qryConnRes } = buttons;
    const { refetch, isFetching } = getConnResApi.useFetchConnRes();
    const handleFetchConnRes = () => {
        refetch();
        handleSelectedChange(null);
    };

    return (
        <><UserButton sx={{ marginBottom: 2 }}
            featureName={qryConnRes.featureName}
            variant="outlined"
            isLoading={isFetching}
            onClick={handleFetchConnRes}
        >
            {qryConnRes.label}
        </UserButton></>
    );
};
