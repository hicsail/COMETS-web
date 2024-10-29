import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useGetSimulationRequestQuery } from '../graphql/simulation';
import { LayoutVisualization } from '../components/results/Layout';
import { GraphVisualization } from '../components/results/Graphs';


export const Results: React.FC = () => {
  const { id } = useParams();
  const simulationRequestResponse = useGetSimulationRequestQuery({
    variables: { request: id!  }
  });
  const request = simulationRequestResponse.data?.getSimulationRequest;

  return (
    <>
      {request && (
        <Stack spacing={2}>
          <Typography variant='h1'>Simulation Run Results</Typography>
          <LayoutVisualization request={request}/>
          <GraphVisualization request={request} />
        </Stack>
      )}
    </>
  )
};
