import { RowingSharp } from "@mui/icons-material";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
} from "@mui/material";
import { useEffect } from "react";
import { Status } from "../types/type";
import { green, red, yellow, grey } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { makeStyles, DefaultTheme } from "@mui/styles";
const styles = makeStyles(() => ({
  tableBorder: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    height: "20px",
  },
}));
type DpTableType = {
  rows: number;
  cols: number;
  data: string[][][];
  status: Status[][][];
  step: number;
};

export default function DpTable(props: DpTableType) {
  const classes = styles();
  const cellSendSx = {
    ...{
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    },
  };
  const cellChangeSx = {
    ...{
      bgcolor: red[500],
      "&:hover": {
        bgcolor: red[700],
      },
    },
  };
  const cellRecieveSx = {
    ...{
      bgcolor: yellow[500],
      "&:hover": {
        bgcolor: yellow[700],
      },
    },
  };
  const cellHeaderSx = {
    ...{
      bgcolor: grey[200],
      width: "50px !important",
      height: "20px !important",
    },
  };
  const drawRow = (row: number) => {
    return (
      <TableRow>
        <TableCell className={classes.tableBorder} sx={cellHeaderSx}>
          {row}
        </TableCell>
        {Array.from({ length: props.cols }, (v, k) => k).map((col) => {
          return (
            <TableCell
              sx={
                props.status[props.step][row][col] === "Send"
                  ? cellSendSx
                  : props.status[props.step][row][col] === "Recieve"
                  ? cellRecieveSx
                  : {}
              }
              className={classes.tableBorder}
            >
              <Grid container direction="row" alignItems="center">
                {props.status[props.step][row][col] === "Send" ? (
                  <Grid item>
                    <SearchIcon sx={{ pl: 0, height: "15px" }} />
                  </Grid>
                ) : props.status[props.step][row][col] === "Recieve" ? (
                  <Grid item>
                    <EditIcon sx={{ height: "15px" }} />
                  </Grid>
                ) : (
                  <Grid item></Grid>
                )}
                {props.data[props.step][row][col]}
              </Grid>
            </TableCell>
          );
        })}
      </TableRow>
    );
  };
  return (
    <TableContainer
      sx={{
        mr: 2,
        ml: 1,
        fontSize: "30pt",
        width: (props.cols + 1) * 120 + "px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {["Table"]
              .concat(Array.from({ length: props.cols }, (v, k) => String(k)))
              .map((val) => (
                <TableCell className={classes.tableBorder} sx={cellHeaderSx}>
                  {val}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: props.rows }, (v, k) => k).map((k) =>
            drawRow(k)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
