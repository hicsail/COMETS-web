import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { SummaryCard } from "../types/ExperimentTypes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
export interface SidebarcardProps {
  item: SummaryCard;
}

const textPairing: { [key: string]: string } = {
  mediaVolume: "Media Volume(ml)",
  mediaConcentration: "Media Concentration(mmol/cm3)",
  demographicNoise: "Demographic Noise",
  demographicNoiseAmplitude: "Demographic Noise Amplitude",
  uptakeVMax: "Uptake Vmax",
  uptakeKm: "Uptake Km",
  deathRate: "Death Rate",
  biomassLinearDiffusivity: "Biomass Linear Diffusivity",
  biomassNonlinearDiffusivity: "Biomass Non-Linear Diffusivity",
  simulatedTime: "Simulated Time",
  timeSteps: "No. of steps",
  nutrientDiffusivity: "Nutrient Diffusivity",
  logFrequency: "Save Frequency",
  vMax: "Vmax",
  km: "Km"
};

export const SidebarCard: FC<SidebarcardProps> = (props) => {
  return (
    <Box
      sx={{ width: "95%", marginLeft: 1, paddingBottom: "0.5vh" }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant="h6">{props.item.label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItemText>
              {Object.keys(props.item.info.params).map((key, index) => {
                let ret;
                if (typeof props.item.info.params[key] === "boolean") {
                  ret = (
                    <Typography textAlign={"left"} textOverflow={"wrap"} key={index}>
                      {textPairing[key]}: {String(props.item.info.params[key])}
                    </Typography>
                  );
                } else {
                  ret = (
                    <Typography textAlign={"left"} textOverflow={"wrap"} key={index}>
                      {textPairing[key]}: {props.item.info.params[key]}
                    </Typography>
                  );
                }
                return ret;
              })}
            </ListItemText>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
