import {
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { FC, useState, ChangeEvent } from "react";
import { Media } from "../types/ExperimentTypes";
import InfoIcon from "@mui/icons-material/Info";

interface MediaComponentProps {
  mediaOptions: Media[];
  value: Media;
  onChange: (arg0: Media) => void;
}

export const MediaComponent: FC<MediaComponentProps> = (props) => {
  const [selectedOption, setSelectedOption] = useState<Media | null>(
    props.mediaOptions[0],
  );
  const [mediaVol, setMediaVol] = useState("");
  const [textfieldError, setTextfieldError] = useState(false);
  const handleCheckboxChange = (option: Media) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
      props.onChange(option);
      // props.value = option;
    }
  };
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      if (/^\d*\.?\d*$/.test(event.target.value)) {
        setMediaVol(event.target.value);
        setTextfieldError(false);
        props.value.params.mediaConcentration = parseFloat(event.target.value);
      } else {
        setTextfieldError(true);
      }
    }
  };
  return (
      <Box component="form" noValidate autoComplete="off" width={"100%"}>
        <FormGroup>
          {props.mediaOptions.map((option, index) => {
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
                    label={`${props.value.mainMetabolites} concentration (mmol/cm3)`}
                    value={mediaVol}
                    onChange={handleTextChange}
                    
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
