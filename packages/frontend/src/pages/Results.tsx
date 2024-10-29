import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useParams } from 'react-router';
import { useGetSimulationRequestQuery } from '../graphql/simulation';
import { LayoutVisualization } from '../components/results/Layout';


export const Results: React.FC = () => {
  const { id } = useParams();
  const simulationRequestResponse = useGetSimulationRequestQuery({
    variables: { request: id!  }
  });
  const request = simulationRequestResponse.data?.getSimulationRequest;

  return (
    <>
      {request && (
        <>
          <Typography variant='h1'>Simulation Run Results</Typography>
          <Stack>
            <Typography variant='h2'>Layout View</Typography>
            <LayoutVisualization request={request}/>
          </Stack>
        </>
      )}
    </>
  )
};
