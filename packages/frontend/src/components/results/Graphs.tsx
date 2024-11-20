import { Paper, Stack, Typography, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { SimulationRequest } from '../../graphql/graphql';
import { useState } from 'react';
import { ImageView } from './ImageView';

export interface GraphVisualizationProps {
  request: SimulationRequest;
}

type GraphViews = 'biomass' | 'metabolite';

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({ request }) => {
  const [graphView, setGraphView] = useState<GraphViews>('biomass');

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h2">Graphs</Typography>
        <FormControl>
          <InputLabel>Graph Type</InputLabel>
          <Select
            value={graphView}
            onChange={(event) => setGraphView(event.target.value as GraphViews)}
            notched={true}
            sx={{ width: 150 }}
          >
            <MenuItem value={'biomass'}>Biomass</MenuItem>
            <MenuItem value={'metabolite'}>Metabolite</MenuItem>
          </Select>
        </FormControl>
        {graphView == 'biomass' && <ImageView src={request.result!.biomassSeries.url} />}
        {graphView == 'metabolite' && <ImageView src={request.result!.metaboliteSeries.url} />}
      </Stack>
    </Paper>
  );
};
