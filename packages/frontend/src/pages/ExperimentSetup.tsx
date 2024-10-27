import {
  Drawer,
  Typography,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { MediaComponent } from "../components/MediaObject";
import { LayoutComponent } from "../components/LayoutObject";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { ModelComponent } from "../components/ModelObject";
import { SidebarCard } from "../components/SidebarObject";
import {
  MetabolicModel,
  Layout,
  Media,
  SummaryCard,
  GlobalParameters,
  cometsType,
} from "../types/ExperimentTypes";
import FooterStepper from "../components/FooterStepper";
import { Link } from "react-router-dom";

const mediaOptions: Media[] = [
  {
    name: "Minimal Core Glucose",
    desc: "Example Desc for core glucose",
    type: "media",
    mainMetabolites: "Glucose",
    min: 1,
    max: 3,
    params: {
      mediaConcentration: 0.0,
    },
  },
  {
    name: "Minimal Core Acetate",
    desc: "Example Desc for core acetate",
    type: "media",
    mainMetabolites: "Acetate",
    min: 1,
    max: 3,
    params: {
      mediaConcentration: 0.0,
    },
  },
  {
    name: "Rich Media",
    desc: "Example Desc for LB Rich",
    type: "media",
    mainMetabolites: "",
    min: 1,
    max: 3,
    params: {
      mediaConcentration: 0.0,
    },
  }
];

const layoutOptions: Layout[] = [
  {
    name: "9 cm Petri Dish (Center Colony)",
    desc: "Example description for center colony",
    type: "layout",
    min: 1,
    max: 12,
    params: {
      mediaVolume: 0.0,
    },
  },
  {
    name: "9 cm Petri Dish (Random Lawn)",
    desc: "Example description for random lawn",
    type: "layout",
    min: 1,
    max: 50,
    params: {
      mediaVolume: 0.0,
    },
  },
  {
    name: "Test Tube",
    desc: "Example description for test tube",
    type: "layout",
    min: 1,
    max: 50,
    params: {
      mediaVolume: 0.0,
    },
  }
];

interface _ModelOptions {
  [key: string]: MetabolicModel[];
}
const _modelOptions: _ModelOptions = {
  "Minimal Core Glucose" : [
    {
      name: "Escherichia coli Core",
      desc: "Example description for E. Coli Core model",
      type: "model",
      params: {
        demographicNoise: false,
        demographicNoiseAmplitude: 0.001,
        uptakeVMax: 10,
        uptakeKm: 10e-5,
        deathRate: 0.001,
        biomassLinearDiffusivity: 0.001,
        biomassNonlinearDiffusivity: 0.6,
      },
    },
  ],
  "Minimal Core Acetate" : [
    {
      name: "Escherichia coli Core",
      desc: "Example description for E. Coli Core model",
      type: "model",
      params: {
        demographicNoise: false,
        demographicNoiseAmplitude: 0.001,
        uptakeVMax: 10,
        uptakeKm: 10e-5,
        deathRate: 0.001,
        biomassLinearDiffusivity: 0.001,
        biomassNonlinearDiffusivity: 0.6,
      },
    },
  ],
  "Rich Media" : [
    {
      name: "Nitrobacter winogradskyi",
      desc: "Example description for Nitrobacter winogradskyi model",
      type: "model",
      params: {
        demographicNoise: false,
        demographicNoiseAmplitude: 0.001,
        uptakeVMax: 10,
        uptakeKm: 10e-5,
        deathRate: 0.001,
        biomassLinearDiffusivity: 0.001,
        biomassNonlinearDiffusivity: 0.6,
      },
    },
    {
      name: "Nitrosomonas europaea",
      desc: "Example description for Nitrosomonas europaea model",
      type: "model",
      params: {
        demographicNoise: false,
        demographicNoiseAmplitude: 0.001,
        uptakeVMax: 10,
        uptakeKm: 10e-5,
        deathRate: 0.001,
        biomassLinearDiffusivity: 0.001,
        biomassNonlinearDiffusivity: 0.6,
      },
    },
  ]
}

const modelOptions: MetabolicModel[] = [
  {
    name: "Escherichia coli Core",
    desc: "Example description for E. Coli Core model",
    type: "model",
    params: {
      demographicNoise: false,
      demographicNoiseAmplitude: 0.001,
      uptakeVMax: 10,
      uptakeKm: 10e-5,
      deathRate: 0.001,
      biomassLinearDiffusivity: 0.001,
      biomassNonlinearDiffusivity: 0.6,
    },
  },
];

type chosenOption = {
    models: {
      name: string,
      params: MetabolicModel["params"]
    }[],
    layout: {
      name: string,
      params: Layout["params"] | {}
    } | {},
    media: {
      name: string,
      params: Media["params"]
    } | {},
    global_parameters: GlobalParameters | {}
}


export function ExperimentSetupPage() {
  const [_layoutExpanded, setLayoutExpanded] = React.useState<string | false>(
    false,
  );
  const [mediaExpanded, setMediaExpanded] = React.useState<string | false>(
    false,
  );
  const [modelExpanded, setModelExpanded] = React.useState<string | false>(
    false,
  );
  const [_chosenOptions, _setChosenOptions] = useState<chosenOption>(
    {
      models: [],
      layout: {},
      media: {},
      global_parameters: {}

    }
  )
  const [globalParams, setGlobalParams] = useState<GlobalParameters>({
    name: "Global Parameters",
    desc: "Desc of global parameters",
    type: "global_parameters",
    params: {
      simulatedTime: 10,
      timeSteps: 100,
      nutrientDiffusivity: 6e-6,
      logFrequency: 20,
      vMax: 10,
      km: 0.00001
    },
  });
  const [sidebarItems, setSidebarItems] = useState<SummaryCard[]>([]);
  const [modelChoice, setModelChoice] = useState<MetabolicModel>(
    modelOptions[0]
  );
  const [layoutChoice, setLayoutChoice] = useState<Layout>(layoutOptions[0]);
  const [mediaChoice, setMediaChoice] = useState<Media>(mediaOptions[0]);
  const [textfieldError, setTextfieldError] = useState(false);
  const [isLayoutPicked, setIsLayoutPicked] = useState(false);
  const [isMediaPicked, setIsMediaPicked] = useState(false);
  const [isModelPicked, setIsModelPicked] = useState(false);
  const [continueDisabled, setContinueDisabled] = useState(false)
  const [isGlobalParametersPicked, setIsGlobalParametersPicked] = useState(false);
  const [numOfModel, setNumOfModel] = useState(0);
  const maxModel = 3;

  function checkRequirements(_sidebarItems:SummaryCard[]){
    let hasModel = false;
    let hasMedia = false;
    let hasLayout = false;
    let hasGlobalParams = false;
    _sidebarItems.forEach((item) => {
      if(item.type === 'Layout'){
        hasLayout = true;
      }else if(item.type === 'MetabolicModel'){
        hasModel = true;
      }else if(item.type === 'Media'){
        hasMedia = true;
      }else if(item.type === 'Global Parameters'){
        hasGlobalParams = true
      }
    })

    return hasModel && hasMedia && hasLayout && hasGlobalParams;
  }

  const handleDelete = (index: number) => {
    // Create a shallow copy of the sidebarItems array
    const updatedSidebarItems = [...sidebarItems];
    switch (updatedSidebarItems[index].type) {
      case "MetabolicModel":
        setNumOfModel((prevCount) => prevCount - 1);
        if (numOfModel <= 0) {
          setNumOfModel(0);
          setIsModelPicked(false);
        }
        break;
      case "Media":
        setIsMediaPicked(false);
        break;
      case "Layout":
        setIsLayoutPicked(false);
        break;
      case "Global Parameters":
        setIsGlobalParametersPicked(false);
        break;
    }
    // Remove the item at the specified index
    updatedSidebarItems.splice(index, 1);
    // Update the state with the modified array
    setContinueDisabled(checkRequirements(updatedSidebarItems))
    setSidebarItems(updatedSidebarItems);
  };

  const handleTextChange = (field: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      const updatedParams = {
        name: "Global Parameters",
        desc: "Desc of global parameters",
        type: "global_parameters",
        params: {
          ...globalParams["params"],
          [field]: field === 'nutrientDiffusivity' || field === 'km' ?  parseFloat(value) : parseInt(value),
        },
      };
      setGlobalParams(updatedParams);
      setTextfieldError(false);
    } else {
      setTextfieldError(true);
    }
  };
  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      if (panel === "layoutPanel") {
        setLayoutExpanded(isExpanded ? panel : false);
      } else if (panel === "mediaPanel") {
        setMediaExpanded(isExpanded ? panel : false);
      } else if (panel === "modelPanel") {
        setModelExpanded(isExpanded ? panel : false);
      }
    };

  const handleSubmit = (
    item: MetabolicModel | Media | Layout | GlobalParameters,
  ) => {
    if (item === null) {
      return;
    }
    // make a shallow copy to pass by value
    const i = { ...item };
    const sidebarItem: SummaryCard = {
      label: i.name,
      desc: i.desc,
      info: i,
      type: cometsType(item),
    };

    setContinueDisabled(checkRequirements([...sidebarItems, sidebarItem]))
    setSidebarItems([...sidebarItems, sidebarItem]);

    switch (cometsType(item)) {
      case "MetabolicModel":
        setNumOfModel((prevCount) => prevCount + 1);
        if (numOfModel > 0) {
          setIsModelPicked(true);

        }
        break;
      case "Media":
        setIsMediaPicked(true);
        break;
      case "Layout":
        setIsLayoutPicked(true);
        break;
      case "Global Parameters":
        setIsGlobalParametersPicked(true);
        break;
    }

  };

  return (
    <Box sx={{ paddingTop: 10, paddingLeft: 5 }}>
      <Box sx={{ width: "85vw", height: "10vh", marginBottom: 1 }}>
        <Typography
          variant="h2"
          fontWeight={"bold"}
          sx={{ justifyContent: "left", textAlign: "left", color: "black" }}
        >
          1. PREPARE YOUR EXPERIMENT
        </Typography>
        <Typography
          variant="h5"
          sx={{
            justifyContent: "left",
            textAlign: "left",
            paddingLeft: 1,
            color: "black",
          }}
        >
          Choose the model, layout, and media that you would like to simulate
        </Typography>
      </Box>
      <Grid
        container
        spacing={2}
        sx={{ minWidth: 900, width: 1500, maxWidth: "100%", paddingBottom: 30 }}
      >
        <Grid item xs={7}>
          <Box>
            <Link
              to= {continueDisabled ? '/summaryReview' : '#'}
              state={{data: sidebarItems}}
            >
              Click Here To Continue
            </Link>
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="layoutPanelbh-content"
              id="layoutPanelbh-header"
              sx={{ backgroundColor: "#CCCCFF", height: "5vh" }}
            >
              <Typography variant="h4">Choose layout</Typography>
              <Divider variant="fullWidth" />
            </AccordionSummary>
            <AccordionDetails>
              <LayoutComponent
                layoutOptions={layoutOptions}
                value={layoutChoice}
                onChange={setLayoutChoice}
              />
            </AccordionDetails>
            <Button
              sx={{ margin: 2, width: "90%", backgroundColor: "#CCCCFF" }}
              variant="outlined"
              onClick={() => handleSubmit(layoutChoice)}
              disabled={isLayoutPicked}
            >
              ADD LAYOUT
            </Button>
          </Accordion>

          <Accordion
            expanded={mediaExpanded === "mediaPanel"}
            onChange={handleAccordionChange("mediaPanel")}
            sx={{ marginTop: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="mediaPanelbh-content"
              id="mediaPanelbh-header"
              sx={{ backgroundColor: "#CCCCFF", height: "5vh" }}
            >
              <Typography variant="h4">Choose media</Typography>
              <Divider variant="fullWidth" />
            </AccordionSummary>
            <AccordionDetails>
              <MediaComponent
                mediaOptions={mediaOptions}
                value={mediaChoice}
                onChange={setMediaChoice}
              />
            </AccordionDetails>
            <Button
              sx={{ margin: 2, width: "90%", backgroundColor: "#CCCCFF" }}
              variant="outlined"
              onClick={() => handleSubmit(mediaChoice)}
              disabled={isMediaPicked}
            >
              ADD MEDIA
            </Button>
          </Accordion>

          <Accordion
            expanded={modelExpanded === "modelPanel"}
            onChange={handleAccordionChange("modelPanel")}
            sx={{ marginTop: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="modelPanelbh-content"
              id="modelPanelbh-header"
              sx={{ backgroundColor: "#CCCCFF", height: "5vh" }}
            >
              <Typography variant="h4">Choose organisms</Typography>
              <Divider variant="fullWidth" />
            </AccordionSummary>
            <AccordionDetails>
              <ModelComponent
                value={modelChoice}
                modelOptions={_modelOptions[mediaChoice.name]}
                modelLimit={3}
                onChange={setModelChoice}
              />
            </AccordionDetails>
            <Button
              sx={{ margin: 2, width: "90%", backgroundColor: "#CCCCFF"}}
              variant="outlined"
              onClick={() => handleSubmit(modelChoice)}
              disabled={numOfModel >= maxModel}
            >
              ADD MODEL
            </Button>
          </Accordion>
        </Grid>
        <Grid item xs={6}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            sx={{paddingRight: "2%", maxWidth: "80%" }}
          >
            <Box sx={{ width: "30%", alignSelf: "center", marginRight: 3 }}>
              <Typography textAlign={"left"} variant="h6" color="black">
                Simulated Time (hours)
              </Typography>
            </Box>
            <TextField
              label="Simulated Time"
              variant="filled"
              type="number"
              fullWidth
              value={globalParams.params.simulatedTime}
              onChange={(event) =>
                handleTextChange("simulatedTime", event.target.value)
              }
              error={textfieldError}
              helperText={textfieldError ? "Please input numbers only" : ""}
              sx={{
                height: "5vh",
              }}
              inputProps={{
                step: "0.000000001"
              }}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            sx={{paddingRight: "2%", maxWidth: "80%" }}
          >
            <Box sx={{ width: "30%", alignSelf: "center", marginRight: 3 }}>
              <Typography textAlign={"left"} variant="h6" color="black">
                No. of steps
              </Typography>
            </Box>
            <TextField
              label="Number of steps"
              variant="filled"
              type="number"
              fullWidth
              value={globalParams.params.timeSteps}
              onChange={(event) =>
                handleTextChange("timeSteps", event.target.value)
              }
              error={textfieldError}
              helperText={textfieldError ? "Please input numbers only" : ""}
              sx={{
                height: "5vh",
              }}
              inputProps={{
                step: "0.000000001"
              }}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            sx={{paddingRight: "2%", maxWidth: "80%" }}
          >
            <Box sx={{ width: "30%", alignSelf: "center", marginRight: 3 }}>
              <Typography textAlign={"left"} variant="h6" color="black">
                Save Frequency
              </Typography>
            </Box>
            <TextField
              label="Log Frequency"
              variant="filled"
              type="number"
              fullWidth
              value={globalParams.params.logFrequency}
              onChange={(event) =>
                handleTextChange("logFrequency", event.target.value)
              }
              error={textfieldError}
              helperText={textfieldError ? "Please input numbers only" : ""}
              sx={{
                height: "5vh",
              }}
              inputProps={{
                step: "0.000000001"
              }}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            sx={{paddingRight: "2%", maxWidth: "80%" }}
          >
            <Box sx={{ width: "30%", alignSelf: "center", marginRight: 3 }}>
              <Typography textAlign={"left"} variant="h6" color="black">
                Nutrient Diffusivity (cm<sup>2</sup>/s)
              </Typography>
            </Box>
            <TextField
              label="Nutrient Diffusivity"
              variant="filled"
              type="number"
              fullWidth
              value={globalParams.params.nutrientDiffusivity}
              onChange={(event) =>
                handleTextChange("nutrientDiffusivity", event.target.value)
              }
              error={textfieldError}
              helperText={textfieldError ? "Please input numbers only" : ""}
              sx={{
                height: "5vh",
              }}
              inputProps={{
                step: "0.000000001"
              }}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            sx={{paddingRight: "2%", maxWidth: "80%" }}
          >
            <Box sx={{ width: "30%", alignSelf: "center", marginRight: 3 }}>
              <Typography textAlign={"left"} variant="h6" color="black">
                V<sub>max</sub>
              </Typography>
            </Box>
            <TextField
              label="Vmax"
              variant="filled"
              type="number"
              fullWidth
              value={globalParams.params.vMax}
              onChange={(event) =>
                handleTextChange("vMax", event.target.value)
              }
              error={textfieldError}
              helperText={textfieldError ? "Please input numbers only" : ""}
              sx={{
                height: "5vh",
              }}
              inputProps={{
                step: "1"
              }}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            sx={{paddingRight: "2%", maxWidth: "80%" }}
          >
            <Box sx={{ width: "30%", alignSelf: "center", marginRight: 3 }}>
              <Typography textAlign={"left"} variant="h6" color="black">
                Km
              </Typography>
            </Box>
            <TextField
              label="km"
              variant="filled"
              type="number"
              fullWidth
              value={globalParams.params.km}
              onChange={(event) =>
                handleTextChange("km", event.target.value)
              }
              error={textfieldError}
              helperText={textfieldError ? "Please input numbers only" : ""}
              sx={{
                height: "5vh",
              }}
              inputProps={{
                step: "0.0000000001"
              }}
            />
          </Box>

          <Button
            sx={{ margin: 2, maxWidth: "80%", backgroundColor: "#CCCCFF"}}
            variant="outlined"
            onClick={() => handleSubmit(globalParams)}
            disabled={isGlobalParametersPicked}
          >
            ADD GLOBAL PARAMETERS
          </Button>
        </Grid>
      </Grid>
      {/* Cart drawer on the right */}
      <Drawer
        variant="permanent"
        anchor="right"
        PaperProps={{
          sx: {
            backgroundColor: "#e9ecef",
            width: 350,
            minWidth: "10%",
            height: "100%",
          },
        }}
      >
        <Typography
          variant="h6"
          color={"black"}
          marginTop={10}
          fontFamily={"sans-serif"}
          fontWeight={"bold"}
        >
          Experiment Selection
        </Typography>
        <Box sx={{ width: "100%" }} display={"flex"} flexDirection={"column"}>
          {sidebarItems.map((item, index) => (
            <Box
              display={"flex"}
              flexDirection={"row"}
              sx={{ paddingRight: "0.5vw" }}
              key={index}
            >
              <Button
                variant={"text"}
                startIcon={<DeleteIcon />}
                sx={{ width: "10%" }}
                onClick={() => handleDelete(index)}
              />
              <SidebarCard item={item} />
            </Box>
          ))}
        </Box>
      </Drawer>
      <Drawer
          variant="permanent"
          anchor="bottom"
          PaperProps={{
            sx: {
              display: 'flex',        // Enable flexbox
              justifyContent: 'center', // Center items horizontally
              alignItems: 'center',   // Center items vertically
              background: "white",
              height: 100,
              width: "64vw",
              left: '16vw',
              zIndex: 99,
            },
          }}
        >
          <FooterStepper activeStep={0} />
        </Drawer>
    </Box>
  );
}
