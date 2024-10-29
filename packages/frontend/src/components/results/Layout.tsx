import { MenuItem, Select } from '@mui/material';
import { SimulationRequest } from '../../graphql/graphql';
import { useEffect, useState } from 'react';

export interface LayoutVisualizationProps {
  request: SimulationRequest;
}

type LayoutViews = 'biomass' | 'metabolite' | 'flux';

export const LayoutVisualization: React.FC<LayoutVisualizationProps> = ({ request }) => {
  const [layoutView, setLayoutView] = useState<LayoutViews>('biomass');
  const [targetLayoutURL, setTargetLayoutURL] = useState<string>(request.result!['biomass'][0].url);

  useEffect(() => {
  }, [layoutView])


  return (
    <>
      <Select value={layoutView} onChange={(event) => setLayoutView(event.target.value as LayoutViews)}>
        <MenuItem value={'biomass'}>Biomass</MenuItem>
        <MenuItem value={'metabolite'}>Metabolite</MenuItem>
        <MenuItem value={'flux'}>Flux</MenuItem>
      </Select>
        {targetLayoutURL && <img src={targetLayoutURL} />}
    </>
  )
};
