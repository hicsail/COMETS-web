import { MenuItem, Select, Stack } from "@mui/material";
import { FluxOutput, ResultOutput } from "../../graphql/graphql"
import { useState } from "react";

export interface FluxViewProps {
  fluxOutput: FluxOutput[];
}

export const FluxView: React.FC<FluxViewProps> = ({ fluxOutput }) => {
  const [modelKey, setModelKey] = useState<string>(fluxOutput[0].modelID);
  const [targetModel, setTargetModel] = useState<FluxOutput>(fluxOutput[0]);

  const [fluxKey, setFluxKey] = useState<string>(fluxOutput[0].flux[0].key);
  const [flux, setFlux] = useState<ResultOutput>(fluxOutput[0].flux[0]);

  const [targetView, setTargetView] = useState<string>(fluxOutput[0].flux[0].url);

  const handleModelChange = (key: string) => {
    setModelKey(key);

    const targetModel = fluxOutput.find((value) => value.modelID == key);
    setTargetModel(targetModel!);
  };

  const handleFluxChange = (key: string) => {

  };

  return (
    <Stack spacing={2}>
      <Stack direction='row' spacing={2}>
        <Select
          label='Model'
          sx={{ width: 150 }}
          value={modelKey}
          onChange={(event) => handleModelChange(event.target.value as string)}
        >
          {fluxOutput.map(output => (
            <MenuItem value={output.modelID} key={output.modelID}>{output.modelName}</MenuItem>
          ))}
        </Select>

        <Select
          label='Flux'
          sx={{ width: 150 }}
          value={fluxKey}
        >
          {targetModel.flux.map(flux => (
            <MenuItem value={flux.key} key={flux.key}>{flux.name}</MenuItem>
          ))}
        </Select>
      </Stack>
      <img src={targetView} />
    </Stack>
  )
};