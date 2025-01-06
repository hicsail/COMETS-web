import { FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography, OutlinedInput } from '@mui/material';
import { SimulationRequest } from '../../graphql/graphql';
import { useState } from 'react';
import { BiomassView } from './Biomass';
import { FluxView } from './Flux';
import { MetaboliteView } from './Metabolite';

export interface LayoutVisualizationProps {
  request: SimulationRequest;
}

type LayoutViews = 'biomass' | 'metabolite' | 'flux';

export const LayoutVisualization: React.FC<LayoutVisualizationProps> = ({ request }) => {
  const [layoutView, setLayoutView] = useState<LayoutViews>('biomass');

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h2">Layout Visualizations</Typography>
        <FormControl>
          <InputLabel shrink={true}>View Type</InputLabel>
          <Select
            sx={{ maxWidth: 150 }}
            value={layoutView}
            notched={true}
            onChange={(event) => setLayoutView(event.target.value as LayoutViews)}
          >
            <MenuItem value={'biomass'}>Biomass</MenuItem>
            <MenuItem value={'metabolite'}>Metabolite</MenuItem>
            <MenuItem value={'flux'}>Flux</MenuItem>
          </Select>
        </FormControl>
        {layoutView == 'biomass' && <BiomassView biomassOutput={request.result!.biomass} />}
        {layoutView == 'metabolite' && <MetaboliteView metaboliteOutput={request.result!.metabolite} />}
        {layoutView == 'flux' && <FluxView fluxOutput={request.result!.flux} />}
      </Stack>
    </Paper>
  );
};
