import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { ResultOutput } from '../../graphql/graphql';
import { useState } from 'react';
import { ImageView } from './ImageView';

export interface MetaboliteViewProps {
  metaboliteOutput: ResultOutput[];
}

export const MetaboliteView: React.FC<MetaboliteViewProps> = ({ metaboliteOutput }) => {
  const [metabolite, setMetabolite] = useState<string>(metaboliteOutput[0].key);
  const [targetView, setTargetView] = useState<string>(metaboliteOutput[0].url);

  const handleMetaboliteChange = (key: string) => {
    setMetabolite(key);

    const targetMetabolite = metaboliteOutput.find((metabolite) => metabolite.key == key);
    setTargetView(targetMetabolite!.url);
  };

  return (
    <Stack spacing={2}>
      <FormControl>
        <InputLabel shrink={true}>Metabolite</InputLabel>
        <Select
          label="Model"
          sx={{ width: 150 }}
          onChange={(event) => handleMetaboliteChange(event.target.value as string)}
          notched={true}
          value={metabolite}
        >
          {metaboliteOutput.map((metabolite) => (
            <MenuItem value={metabolite.key} key={metabolite.key}>
              {metabolite.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ImageView src={targetView} />
    </Stack>
  );
};
