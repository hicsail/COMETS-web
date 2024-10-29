import { Select, MenuItem, Stack } from '@mui/material';
import { ResultOutput } from '../../graphql/graphql';
import { useState } from 'react';

export interface BiomassViewProps {
  biomassOutput: ResultOutput[];
}

export const BiomassView: React.FC<BiomassViewProps> = ({ biomassOutput }) => {
  const [model, setModel] = useState<string>(biomassOutput[0].key);
  const [targetView, setTargetView] = useState<string | null>(biomassOutput.length > 0 ?
    biomassOutput[0].url : null);

  const handleModelChange = (key: string) => {
    setModel(key);

    const targetModel = biomassOutput.find((result) => result.key == key);
    setTargetView(targetModel!.url);
  };


  return (
    <Stack spacing={2}>
      <Select
        label='Model'
        sx={{ width: 150 }}
        value={model}
        onChange={(event) => handleModelChange(event.target.value as string)}>
        {biomassOutput.map(biomass => (
          <MenuItem value={biomass.key} key={biomass.key}>{biomass.name}</MenuItem>
        ))}
      </Select>

      {targetView && <img src={targetView} />}
    </Stack>
  );
};
