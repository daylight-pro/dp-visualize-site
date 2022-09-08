import * as React from "react";
import { Status } from "./types/type";
import { Box, IconButton, Slider, Grid, TextField } from "@mui/material";
import "./App.css";
import JsonUploadUI from "./components/JsonUploadUI";
import DpTable from "./components/DpTable";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function App() {
  const [data, setData] = React.useState<string[][][]>([[[]]]);
  const [status, setStatus] = React.useState<Status[][][]>([[[]]]);
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);
  const [step, setStep] = React.useState<number>(0);
  const [rows, setRows] = React.useState<number>(0);
  const [cols, setCols] = React.useState<number>(0);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let new_step = Number(event.target.value) as number;
    if (isNaN(new_step)) {
      setStep(0);
    } else {
      new_step = Math.min(new_step, data.length - 1);
      new_step = Math.max(new_step, 0);
      setStep(new_step);
    }
  };
  const handleSliderChange = (event: Event, new_value: number | number[]) => {
    let new_step = new_value as number;
    new_step = Math.min(new_step, data.length - 1);
    new_step = Math.max(new_step, 0);
    setStep(new_step);
  };
  const handleClick = (diff: number) => {
    let new_step = step + diff;
    new_step = Math.min(new_step, data.length - 1);
    new_step = Math.max(new_step, 0);
    setStep(new_step);
  };
  return (
    <div className="App">
      <Grid container direction="row" alignItems="center">
        <Grid item sx={{ mx: 3, width: "300pt" }}>
          <JsonUploadUI
            setRows={setRows}
            setCols={setCols}
            setData={setData}
            setStatus={setStatus}
            setErrorMessage={setErrorMessage}
          />
        </Grid>
        <Grid item sx={{ mx: 3, display: "inline" }}>
          <TextField
            value={step}
            onChange={handleChange}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              height: "20px",
              width: "10px",
              mx: 1,
            }}
          />
        </Grid>
        <Grid item sx={{ mx: 3, display: "inline", width: "300pt" }}>
          <Slider
            value={step}
            max={data.length - 1}
            onChange={handleSliderChange}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item>
          <IconButton onClick={() => handleClick(-1)}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton onClick={() => handleClick(1)}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box sx={{ width: "100%", overflow: "scroll", pb: 1 }}>
        <Box sx={{ color: "red" }}>
          {errorMessage.map((mes) => (
            <p>{mes}</p>
          ))}
        </Box>
        <DpTable
          rows={rows}
          cols={cols}
          data={data}
          status={status}
          step={step}
        />
      </Box>
    </div>
  );
}

export default App;
