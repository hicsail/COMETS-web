import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useParams } from 'react-router';


export const Results: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <Typography variant='h1'>Simulation Run Results</Typography>
      <Stack>
        <Typography variant='h2'>Layout View</Typography>
      </Stack>
    </>
  )
};
