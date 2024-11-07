import { Card, CardContent, CardHeader, ListItem, List } from '@mui/material';
import { GlobalParametersInput } from '../../graphql/graphql'

export interface GlobalParamsViewProps {
  params: GlobalParametersInput;
}

export const GlobalParamsView: React.FC<GlobalParamsViewProps> = ({ params }) => {
  return (
    <Card>
      <CardHeader title='Global Parameters' titleTypographyProps={{ variant: 'h3' }} />
      <CardContent>
        <List>
          <ListItem>Time Step: {params.timeStep}</ListItem>
          <ListItem>Log Frequency: {params.logFreq}</ListItem>
          <ListItem>Default Diff Const: {params.defaultDiffConst}</ListItem>
          <ListItem>Default VMax: {params.defaultVMax}</ListItem>
          <ListItem>Default KM: {params.defaultKm}</ListItem>
          <ListItem>Max Cycles: {params.maxCycles}</ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
