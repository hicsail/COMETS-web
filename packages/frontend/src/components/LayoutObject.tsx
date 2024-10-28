import {
  Box,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FC, useState, ChangeEvent } from "react";
import { Layout } from "../types/ExperimentTypes";
import InfoIcon from "@mui/icons-material/Info";
interface LayoutComponentProps {
  layoutOptions: Layout[];
  value: Layout;
  onChange: (arg0: Layout) => void;
}

export const LayoutComponent: FC<LayoutComponentProps> = (props) => {
  const [selectedOption, setSelectedOption] = useState<Layout | null>();
  const [mediaVol, setMediaVol] = useState("");
  const [textfieldError, setTextfieldError] = useState(false);
  const handleCheckboxChange = (option: Layout) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
      props.onChange(option);
    }
  };
  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    _min: number,
    _max: number,
  ) => {
    if (event.target) {
      if (/^\d*\.?\d*$/.test(event.target.value)) {
        // const vol = parseInt(event.target.value);
        // if(vol >= min && vol <= max){
        setMediaVol(event.target.value);
        setTextfieldError(false);
        props.value.params.mediaVolume = parseFloat(event.target.value);

        // }else{
        //   setTextfieldError(true);
        // }
      } else {
        setTextfieldError(true);
      }
    }
  };
  return (
      <Box component="form" noValidate autoComplete="off" width={"100%"}>
        <FormGroup>
          {props.layoutOptions.map((option, index) => {
            return (
              <Box key={index} display={"flex"} flexDirection={'column'}>
                <FormControlLabel
                  sx={{ marginTop: 2 }}
                  key={index}
                  label={option.name}
                  control={
                    <>
                      <Tooltip title={option.desc}>
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(option.desc);
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                      <Checkbox
                        value={props.value}
                        onChange={() => handleCheckboxChange(option)}
                        checked={selectedOption === option}
                      />
                    </>
                  }
                />
                {selectedOption === option && (
                  <TextField
                    variant="filled"
                    label="Volume of media (ml)"
                    value={mediaVol}
                    onChange={(e) =>
                      handleTextChange(e, option.min, option.max)
                    }
                    error={textfieldError}
                    helperText={
                      textfieldError ? "Please input numbers only" : ""
                    }
                  />
                )}
                <Divider />
              </Box>
            );
          })}
        </FormGroup>
      </Box>
  );
};
