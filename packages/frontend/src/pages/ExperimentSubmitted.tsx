import { useState } from 'react';
import { Box, Button, Drawer, Grid, Typography } from '@mui/material';
import FooterStepper from '../components/FooterStepper';
import { Link } from 'react-router-dom';

export function ExperimentSubmittedPage() {
  const [activeStep, _setActiveStep] = useState(2);

  return (
    <>
      <Box
        component="main"
        sx={{
          position: 'relative',
          height: '100vh'
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
                paddingLeft: '2vw',
                paddingBottom: '10%'
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'black',
                  textAlign: 'left',
                  paddingBottom: '10%',
                  paddingTop: '5%'
                }}
              >
                EXPERIMENT SUBMITTED!
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  textAlign: 'left',
                  color: 'black',
                  paddingBottom: '10%'
                }}
              >
                Thank you for using the COMETS Layout Builder!
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  textAlign: 'left',
                  color: 'grey',
                  paddingBottom: '10%'
                }}
              >
                Your layout is now running. You will be sent an email with a link to the results of your layout once
                it’s done running.
              </Typography>

              <Button component={Link} to="https://www.runcomets.org/get-started" variant="contained" fullWidth>
                Download CometsPY
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Drawer
          variant="permanent"
          anchor="bottom"
          PaperProps={{
            sx: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'white',
              height: 100,
              width: '90vw',
              left: '15vw',
              zIndex: 99
            }
          }}
        >
          <FooterStepper activeStep={activeStep} />
        </Drawer>
      </Box>
    </>
  );
}
