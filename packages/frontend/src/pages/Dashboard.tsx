import { Box, Button, Grid, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NavLink } from 'react-router-dom';

export function DashboardPage() {
  return (
    <Box>
      <Box
        overflow={'clip'}
        component="img"
        src="../../dashboard.svg"
        alt="Dashboard Image"
        sx={{
          left: '18vw',
          width: '82vw',
          height: '30vh',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />

      <Grid
        container
        direction={'column'}
        overflow={'-moz-hidden-unscrollable'}
        sx={{
          width: '100%',
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: '1%'
        }}
      >
        <Grid item>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'left',
              fontFamily: 'Inter',
              color: 'black',
              fontWeight: '400',
              paddingRight: '15%'
            }}
          >
            Build and run microbial growth simulations in space and time
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            variant="h2"
            textOverflow={'initial'}
            sx={{
              textAlign: 'left',
              fontFamily: 'Open Sans',
              color: 'black',
              fontWeight: '700',
              paddingRight: '15%'
            }}
          >
            WELCOME TO COMETS LAYOUT BUILDER
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'left',
              fontFamily: 'Inter',
              color: 'black',
              fontWeight: '500',
              paddingRight: '15%',
              opacity: '45%'
            }}
          >
            Simulating the complex growth patterns of bacterial colonies takes a lot of computational power and time to
            complete, but COMETS Layout builder allows you to make lightweight simulations within the web application.
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'left',
              fontFamily: 'Inter',
              color: 'black',
              fontWeight: '500',
              paddingRight: '15%',
              opacity: '45%'
            }}
          >
            Just choose your Model, Setup, and Metabolites. Set your parameters. Then, you are done!
          </Typography>
        </Grid>

        <Grid item flexDirection={'column'}>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'left',
              fontFamily: 'Inter',
              color: 'black',
              fontWeight: '500',
              paddingRight: '5%',
              opacity: '45%'
            }}
          >
            To start your layout, click continue.
          </Typography>

          <NavLink to="/experimentSetup">
            <Button
              variant="contained"
              endIcon={<ChevronRightIcon />}
              sx={{
                height: '7.5vh',
                width: '25vw',
                alignContent: 'center'
              }}
            >
              CONTINUE TO LAYOUT BUILDER
            </Button>
          </NavLink>
        </Grid>
      </Grid>
    </Box>
  );
}
