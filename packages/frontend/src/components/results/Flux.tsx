import { FormControl, MenuItem, Select, Stack, InputLabel } from '@mui/material';
import { FluxOutput } from '../../graphql/graphql';
import { useState } from 'react';
import { ImageView } from './ImageView';

export interface FluxViewProps {
  fluxOutput: FluxOutput[];
}

export const FluxView: React.FC<FluxViewProps> = ({ fluxOutput }) => {
  const [modelKey, setModelKey] = useState<string>(fluxOutput[0].modelID);
  const [targetModel, setTargetModel] = useState<FluxOutput>(fluxOutput[0]);

  const [fluxKey, setFluxKey] = useState<string>(fluxOutput[0].flux[0].key);

  const [targetView, setTargetView] = useState<string>(fluxOutput[0].flux[0].url);

  const handleModelChange = (key: string) => {
    setModelKey(key);

    const targetModel = fluxOutput.find((value) => value.modelID == key);
    setTargetModel(targetModel!);
  };

  const handleFluxChange = (key: string) => {
    setFluxKey(key);

    const flux = targetModel.flux.find((flux) => flux.key == key);
    setTargetView(flux!.url);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <FormControl>
          <InputLabel>Model</InputLabel>
          <Select
            label="Model"
            sx={{ width: 150 }}
            value={modelKey}
            onChange={(event) => handleModelChange(event.target.value as string)}
            notched={true}
          >
            {fluxOutput.map((output) => (
              <MenuItem value={output.modelID} key={output.modelID}>
                {output.modelName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Flux</InputLabel>
          <Select
            label="Flux"
            sx={{ width: 150 }}
            value={fluxKey}
            onChange={(event) => handleFluxChange(event.target.value as string)}
            notched={true}
          >
            {targetModel.flux.map((flux) => (
              <MenuItem value={flux.key} key={flux.key}>
                {flux.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <ImageView src={targetView} />
    </Stack>
  );
};
