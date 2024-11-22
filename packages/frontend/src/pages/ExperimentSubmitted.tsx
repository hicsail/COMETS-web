import { useState } from 'react';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import FooterStepper from '../components/FooterStepper';

export function ExperimentSubmittedPage() {
  const [activeStep, _setActiveStep] = useState(2);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-left', alignItems: 'left', width: '100%' }}>
        <Stack spacing={5} sx={{ alignItems: 'left', justifyContent: 'left' }}>
          <Typography variant="h1">EXPERIMENT SUBMITTED!</Typography>

          <Typography variant="h2">Thank you for using the COMETS Layout Builder!</Typography>

          <Typography variant="h3">
            Your layout is now running. You will be sent an email with a link to the results of your layout once it’s
            done running.
          </Typography>
        </Stack>

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
