import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { SqlSearchData } from "../api";

type SqlInputProps = {
  sqlSyntax: string;
  currentSql: SqlSearchData;
  onSqlSyntaxChange: (syntax: string) => void;
  updateSqlArray: (
    ...updates: {
      property: string;
      data: any;
    }[]
  ) => void;
};

export const SqlInput = ({
  sqlSyntax,
  currentSql: { syntaxIndex, syntaxArray },
  onSqlSyntaxChange,
  updateSqlArray,
}: SqlInputProps) => {
  // 切換語法前後按鈕
  const handleSyntaxChange = (step: number) => {
    const newIndex = syntaxIndex + step;
    onSqlSyntaxChange(syntaxArray[newIndex]);
    updateSqlArray({ property: "syntaxIndex", data: newIndex });
  };

  const isUndo = syntaxIndex > 0;
  const isRedo = syntaxIndex < syntaxArray.length - 1;

  return (
    <Grid item xs={4.5}>
      <Stack direction="row" height="100%">
        <TextField
          fullWidth
          multiline
          sx={{
            height: "100%",
            "& .MuiOutlinedInput-root": {
              padding: "0 8px",
              height: "100%",
            },
            "& textarea": {
              height: "100%!important",
              overflow: "auto!important",
            },
          }}
          value={sqlSyntax}
          onChange={(e) => onSqlSyntaxChange(e.target.value)}
        />
        <Stack justifyContent="center">
          <IconButton
            color="primary"
            onClick={() => isUndo && handleSyntaxChange(-1)}
            disabled={!isUndo}
          >
            <UndoRoundedIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => isRedo && handleSyntaxChange(1)}
            disabled={!isRedo}
          >
            <RedoRoundedIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Grid>
  );
};
