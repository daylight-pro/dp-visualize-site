import * as React from "react";
import { JsonDataType, Status } from "../types/type";
import { green, red } from "@mui/material/colors";
import { Box, Button, CircularProgress } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
type JsonUploadUIPropsType = {
  setRows: React.Dispatch<React.SetStateAction<number>>;
  setCols: React.Dispatch<React.SetStateAction<number>>;
  setData: React.Dispatch<React.SetStateAction<string[][][]>>;
  setStatus: React.Dispatch<React.SetStateAction<Status[][][]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string[]>>;
};
export default function JsonUploadUI(props: JsonUploadUIPropsType) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
    ...(failed && {
      bgcolor: red[500],
      "&:hover": {
        bgcolor: red[700],
      },
    }),
  };

  const buildData = (obj: JsonDataType) => {
    console.log(obj);
    let data: string[][][] = [];
    let status: Status[][][] = [];
    let current_data: string[][] = [];
    let default_status: Status[][] = [];
    let errors: string[] = [];
    for (let i = 0; i < obj.rows; i++) {
      let current_row: string[] = [];
      let current_status_row: Status[] = [];
      for (let j = 0; j < obj.cols; j++) {
        current_row.push(obj.initial_value);
        current_status_row.push("Normal");
      }
      current_data.push(JSON.parse(JSON.stringify(current_row)));
      default_status.push(JSON.parse(JSON.stringify(current_status_row)));
    }
    let step_index = 0;
    for (const step of obj.steps) {
      let current_status: Status[][] = JSON.parse(
        JSON.stringify(default_status)
      );
      if (step !== null) {
        if (step.senders !== undefined) {
          for (const sender of step.senders) {
            if (
              sender.row < 0 ||
              sender.row >= obj.rows ||
              sender.col < 0 ||
              sender.col >= obj.cols
            ) {
              errors.push(
                "(ステップ" +
                  step_index +
                  ") 配列外の要素(" +
                  sender.row +
                  "," +
                  sender.col +
                  ")にアクセスしています。"
              );
              continue;
            }
            current_status[sender.row][sender.col] = "Send";
          }
        }
        if (step.recipients !== undefined) {
          for (const recipient of step.recipients) {
            if (
              recipient.row < 0 ||
              recipient.row >= obj.rows ||
              recipient.col < 0 ||
              recipient.col >= obj.cols
            ) {
              errors.push(
                "(ステップ" +
                  step_index +
                  ") 配列外の要素(" +
                  recipient.row +
                  "," +
                  recipient.col +
                  ")を変更しようとしています。"
              );
            } else {
              current_status[recipient.row][recipient.col] = "Recieve";
              current_data[recipient.row][recipient.col] = recipient.new_value;
            }
          }
        }
        if (step.error_messages !== undefined) {
          for (let error of step.error_messages) {
            errors.push(error);
          }
        }
      }
      data.push(JSON.parse(JSON.stringify(current_data)));
      status.push(JSON.parse(JSON.stringify(current_status)));
      step_index += 1;
    }
    props.setCols(obj.cols);
    props.setRows(obj.rows);
    props.setData(data);
    props.setStatus(status);
    props.setErrorMessage(errors.slice(0, Math.min(errors.length, 5)));
    setSuccess(true);
  };
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setFailed(false);
    const file: File | null =
      event.target.files !== null ? event.target.files[0] : null;
    if (file == null) {
      setLoading(false);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const file_content = reader.result;
      try {
        if (typeof file_content === "string")
          buildData(JSON.parse(file_content));
      } catch (e) {
        setFailed(true);
      }
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ m: 0, position: "relative", width: "100%" }}>
      <Button
        variant="contained"
        sx={buttonSx}
        disabled={loading}
        startIcon={
          success ? <CheckIcon /> : failed ? <BlockIcon /> : <UploadFileIcon />
        }
        component="label"
      >
        File Upload
        <input type="file" hidden onChange={changeHandler} />
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Box>
  );
}
