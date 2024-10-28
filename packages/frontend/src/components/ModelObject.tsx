import {
  Box,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  Typography
} from "@mui/material";
import { FC, useState } from "react";
import { MetabolicModel } from "../types/ExperimentTypes";
import InfoIcon from "@mui/icons-material/Info";

interface ModelComponentProps {
  modelOptions: MetabolicModel[];
  value: MetabolicModel;
  modelLimit: number;
  onChange: (arg0: MetabolicModel) => void;
}

const defaultParams: MetabolicModel["params"] = {
  demographicNoise: false,
  demographicNoiseAmplitude: 0.001,
  uptakeVMax: 10,
  uptakeKm: 10e-5,
  deathRate: 0.001,
  biomassLinearDiffusivity: 0.001,
  biomassNonlinearDiffusivity: 0.6,
};

export const ModelComponent: FC<ModelComponentProps> = (props) => {
  console.log(props.modelOptions)
  const [selectedOption, setSelectedOption] = useState<MetabolicModel | null>();
  const [modelParams, setModelParams] =
    useState<MetabolicModel["params"]>(defaultParams);
  const [textfieldError, setTextfieldError] = useState(false);
  const handleCheckboxChange = (option: MetabolicModel) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
      props.onChange(option);
    }
  };
  const handleTextChange = (field: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setModelParams({ ...modelParams, [field]: parseFloat(value) });
      props.value.params = { ...modelParams, [field]: parseFloat(value) };
      setTextfieldError(false);
    } else {
      setTextfieldError(true);
    }
  };

  const handleRadioChange = (value: boolean) => {
    setModelParams({ ...modelParams, demographicNoise: value });
  };

  return (
      <Box component="form" noValidate autoComplete="off" width={"100%"}>
        <FormGroup>
          {props.modelOptions.map((option, index) => {
            return (
              <Box key={index} display={"flex"} flexDirection={'column'}>
                <FormControlLabel
                  sx={{ marginTop: 2 }}
                  key={index}
                  label={<Typography sx={{fontStyle:'italic'}}>{option.name}</Typography>}
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
                        value={selectedOption}
                        onChange={() => handleCheckboxChange(option)}
                        checked={selectedOption === option}
                      />
                    </>
                  }
                />
                {selectedOption === option && (
                  <>
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      <Grid
                        item
                        xs={6}
                        justifySelf={"flex-start"}
                        alignSelf={"center"}
                      >
                        <FormLabel>Demographic Noise</FormLabel>
                      </Grid>

                      <Grid item xs={6}>
                        <RadioGroup>
                          <FormControlLabel
                            key={index + 1}
                            label="Yes"
                            control={
                              <Radio
                                checked={modelParams.demographicNoise}
                                onChange={() => handleRadioChange(true)}
                                value={true}
                                name="demoNoise-radio-button-yes"
                                inputProps={{ "aria-label": "Yes" }}
                              />
                            }
                          />
                          <FormControlLabel
                            key={index + 2}
                            label="No"
                            control={
                              <Radio
                                checked={!modelParams.demographicNoise}
                                onChange={() => handleRadioChange(false)}
                                value={false}
                                name="demoNoise-radio-button-no"
                                inputProps={{ "aria-label": "No" }}
                              />
                            }
                          />
                        </RadioGroup>
                      </Grid>
                    </Grid>

                    <TextField
                      variant="filled"
                      label="Demographic Noise Amplitude"
                      type="number"
                      disabled={!modelParams.demographicNoise}
                      value={modelParams.demographicNoiseAmplitude}
                      onChange={(event) =>
                        handleTextChange(
                          "demographicNoiseAmplitude",
                          event.target.value,
                        )
                      }
                      error={textfieldError}
                      helperText={
                        textfieldError ? "Please input numbers only" : ""
                      }
                      sx={{ marginTop: 2 }}
                      inputProps={{
                        step: "0.000000001"
                      }}
                    />
                    <TextField
                      variant="filled"
                      label="Death Rate"
                      type="number"
                      value={modelParams.deathRate}
                      onChange={(event) =>
                        handleTextChange("deathRate", event.target.value)
                      }
                      error={textfieldError}
                      helperText={
                        textfieldError ? "Please input numbers only" : ""
                      }
                      sx={{ marginTop: 2 }}
                      inputProps={{
                        step: "0.000000001"
                      }}
                    />
                    <TextField
                      variant="filled"
                      label="Biomass Linear Diffusivity"
                      type="number"
                      value={modelParams.biomassLinearDiffusivity}
                      onChange={(event) =>
                        handleTextChange(
                          "biomassLinearDiffusivity",
                          event.target.value,
                        )
                      }
                      error={textfieldError}
                      helperText={
                        textfieldError ? "Please input numbers only" : ""
                      }
                      sx={{ marginTop: 2 }}
                      inputProps={{
                        step: "0.000000001"
                      }}
                    />
                    <TextField
                      variant="filled"
                      label="Biomass Non-Linear Diffusivity"
                      type="number"
                      value={modelParams.biomassNonlinearDiffusivity}
                      onChange={(event) =>
                        handleTextChange(
                          "biomassNonlinearDiffusivity",
                          event.target.value,
                        )
                      }
                      error={textfieldError}
                      helperText={
                        textfieldError ? "Please input numbers only" : ""
                      }
                      sx={{ marginTop: 2 }}
                      inputProps={{
                        step: "0.000000001"
                      }}
                    />
                    {/* <Button
                      sx={{ marginTop: 2 }}
                      variant="outlined"
                      disabled={props.value.length >= props.modelLimit}
                      onClick={() => handleAddModel(modelParams, option)}
                    >
                      ADD MODEL
                    </Button> */}
                  </>
                )}
                <Divider />
              </Box>
            );
          })}
        </FormGroup>
      </Box>
  );
};
