import { Stack, Typography, Grid2 } from '@mui/material';
import { useParams } from 'react-router';
import { useGetSimulationRequestQuery } from '../graphql/simulation';
import { LayoutVisualization } from '../components/results/Layout';
import { GraphVisualization } from '../components/results/Graphs';
import { ViewParameters } from '../components/parameters/ViewParameters';


export const Results: React.FC = () => {
  const { id } = useParams();
  const simulationRequestResponse = useGetSimulationRequestQuery({
    variables: { request: id!  }
  });
  const request = simulationRequestResponse.data?.getSimulationRequest;

  return (
    <>
      {request && (
        <Grid2 container spacing={4}>
          <Grid2 size={8}>
            <Stack spacing={2}>
              <Typography variant='h1'>Simulation Run Results</Typography>
              <LayoutVisualization request={request}/>
              <GraphVisualization request={request} />
            </Stack>
          </Grid2>
          <Grid2 size={4} sx={{ paddingTop: 3 }}>
            <ViewParameters params={request} />
          </Grid2>
        </Grid2>
      )}
    </>
  )
};
