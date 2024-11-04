import { useState, ChangeEvent, useEffect } from "react";
import {
  Button,
  Card,
  Drawer,
  Stack,
  TextField,
  Typography,
  Grid2
} from "@mui/material";
import FooterStepper from "../components/FooterStepper";
import { useLocation, useNavigate } from "react-router-dom";
import { useRequestSimulationMutation } from "../graphql/simulation";
import { ViewParameters } from "../components/parameters/ViewParameters";

export function SummaryReviewPage() {
  const [activeStep, _setActiveStep] = useState(1);
  const location = useLocation();
  const { data } = location.state;

  return (
    <>
      <Grid2 container direction='row' spacing={4}>
        <Grid2 size={8}>
          <InformationSection data={data} />
        </Grid2>
        <Grid2 size={4}>
          <ViewParameters params={data} />
        </Grid2>
      </Grid2>

      <Drawer
        variant="permanent"
        anchor="bottom"
        PaperProps={{
          sx: {
            display: "flex", // Enable flexbox
            justifyContent: "center", // Center items horizontally
            alignItems: "center", // Center items vertically
            background: "white",
            height: 100,
            width: "90vw",
            left: "15vw",
            zIndex: 99,
          },
        }}
      >
        <FooterStepper activeStep={activeStep} />
      </Drawer>
    </>
  );
}

interface InformationSectionProps {
  data: any;
}

const InformationSection: React.FC<InformationSectionProps> = ({ data }) => {
  const [email, setEmail] = useState('')
  const [textfieldError, setTextfieldError] = useState(false);
  const [requestSimulation, requestSimulationResults] = useRequestSimulationMutation();
  const navigate = useNavigate();

  const handleSubmit = (email: string) => {
    // The neutral drift field may not show up if the user has not selected it
    for (const model of data['modelParams']) {
      model['neutralDrift'] = !!model['neutralDrift'];
    }
    requestSimulation({
      variables: {
        request: {
          ...data,
          email
        }
      }
    });
  }

  useEffect(() => {
    if (requestSimulationResults.data) {
      navigate('/experimentSubmitted');
    }
  }, [requestSimulationResults]);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      if (/\S+@\S+\.\S+/.test(event.target.value)) {
        setEmail(event.target.value);
      } else {
        setTextfieldError(true);
      }
    }
  };

  return (
    <Stack spacing={2} direction="column">
      <Typography variant="h1">3. Review</Typography>

      <Typography variant="h3">
        Please review your selected simulation. Once you have confirmed
        the selection is correct, you can run your simulation by
        entering your email below.
      </Typography>

      <Typography variant="h3">
        We will notify you of your simulations results via email.
      </Typography>

      <Card
        sx={{
          width: "100%",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h6"
          sx={{
          }}
        >
          Continue with email
        </Typography>

        <TextField
          fullWidth
          label="Email address"
          variant="outlined"
          onChange={handleTextChange}
          helperText={
            textfieldError ? "Please input a valid email" : ""
          }
          sx={{
            mb: 2,
          }}
        />

        <Typography
          variant="body2"
          sx={{
            mb: 2
          }}
        >
          By continuing, you agree to the confirmation of the selected
          simulation to be processed.
        </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => handleSubmit(email)}
          >
            Continue
          </Button>
      </Card>
    </Stack>
  )
};
