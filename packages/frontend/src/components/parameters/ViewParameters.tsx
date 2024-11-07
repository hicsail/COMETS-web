import { Stack, Typography } from '@mui/material';
import { SimulationRequestInput } from '../../graphql/graphql';
import { MetaboliteParamsView } from './MetaboliteParamsView';
import { ModelParamsView } from './ModelParamsView';
import { GlobalParamsView } from './GlobalParamsView';

type Parameters = Omit<SimulationRequestInput, 'email'>;

interface ViewParametersProps {
  params: Parameters;
}

export const ViewParameters: React.FC<ViewParametersProps> = ({ params }) => {

  return (
    <Stack>
      <Typography variant='h2'>Parameters</Typography>
      <MetaboliteParamsView params={params.metaboliteParams} />
      <ModelParamsView params={params.modelParams} />
      <GlobalParamsView params={params.globalParams} />
    </Stack>
  );
};
