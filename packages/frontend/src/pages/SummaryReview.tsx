import { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Drawer,
  Grid,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import FooterStepper from "../components/FooterStepper";
import { useLocation } from "react-router-dom";
import { useRequestSimulationMutation } from "../graphql/simulation";


const bodyTheme = createTheme({
  typography: {
    h1: {
      fontSize: 50,
      fontWeight: 700,
    },
    h2: {
      fontSize: 40,
    },
    h3: {
      fontSize: 18,
    },
  },
});

export function SummaryReviewPage() {
  const [activeStep, _setActiveStep] = useState(1);
  const [email, setEmail] = useState('')
  const [textfieldError, setTextfieldError] = useState(false);
  const location = useLocation();
  console.log(location);
  const { data } = location.state;
  const [requestSimulation, requestSimulationResults] = useRequestSimulationMutation();

  const handleSubmit = (email: string) => {
    console.log(data);
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
    console.log(requestSimulationResults);
  }, [requestSimulation]);

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
    <ThemeProvider theme={bodyTheme}>
      <Box
        component="main"
        sx={{
          position: "relative",
          height: "100vh",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid
              container
              spacing={2}
              direction="column"
              alignItems="left"
              style={{
                paddingLeft: "2vw",
                paddingBottom: "10%",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: "black",
                  textAlign: "left",
                  paddingBottom: "10%",
                  paddingTop: "5%",
                }}
              >
                3. Review
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  textAlign: "left",
                  color: "grey",
                  paddingBottom: "10%",
                }}
              >
                Please review your selected simulation. Once you have confirmed
                the selection is correct, you can run your simulation by
                entering your email below.
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  textAlign: "left",
                  color: "grey",
                  paddingBottom: "10%",
                }}
              >
                We will notify you of your simulations results via email.
              </Typography>

              <Card
                sx={{
                  width: "100%",
                  p: 2,
                  boxSizing: "border-box",
                  borderRadius: "16px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    textAlign: "left",
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
                    mb: 2,
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

              <Box
                sx={{
                  paddingTop: "5%",
                }}
              >
                <Button variant="contained" fullWidth>
                  Download CometsPY
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Typography
              sx={{
                color: "black",
                fontSize: "26px",
              }}
            ></Typography>

          </Grid>
        </Grid>

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
      </Box>
    </ThemeProvider>
  );
}
