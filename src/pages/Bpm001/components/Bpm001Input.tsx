import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { FetchDepPayload } from "../api";

type Bpm001InputProps = {
    input : FetchDepPayload;
    handleInputChange : (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

export const Bpm001Input = ({
    input,
    handleInputChange
}:Bpm001InputProps) => {
    const fields: { name: keyof FetchDepPayload; label: string }[] = [
        { name: "depNo", label: "部門代號(網家)" },
        { name: "depNameLike", label: "部門名稱" },
    ];

    return (
    <Stack spacing={{ xs: 1, md: 2 }} direction={{ xs: "row", md: "column" }}>
        {fields.map(({ name, label }) => (
        <TextField
            key={name}
            name={name}
            value={input[name]}
            onChange={handleInputChange}
            label={label}
            size="small"
        />
        ))}
    </Stack>
    );
};
