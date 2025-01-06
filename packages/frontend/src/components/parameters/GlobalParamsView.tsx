import { Card, CardContent, CardHeader, ListItem, List } from '@mui/material';
import { GlobalParametersInput } from '../../graphql/graphql';

export interface GlobalParamsViewProps {
  params: GlobalParametersInput;
}

export const GlobalParamsView: React.FC<GlobalParamsViewProps> = ({ params }) => {
  return (
    <Card>
      <CardHeader title="Global Parameters" titleTypographyProps={{ variant: 'h3' }} />
      <CardContent>
        <List>
          <ListItem>Time Step: {params.timeStep} (h/cycle)</ListItem>
          <ListItem>Log Frequency: {params.logFreq}</ListItem>
          <ListItem>Nutrient Diffusivity: {params.defaultDiffConst} (cm<sup>2</sup>/s)</ListItem>
          <ListItem>Default VMax: {params.defaultVMax} (mmol/gh)</ListItem>
          <ListItem>Default KM: {params.defaultKm} (M)</ListItem>
          <ListItem>Max Cycles: {params.maxCycles}</ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
