import { Card, CardContent, CardHeader, List, ListItem, Paper } from '@mui/material';
import { ModelParametersInput } from '../../graphql/graphql'

export interface ModelParamsViewProps {
  params: ModelParametersInput[];
}

export const ModelParamsView: React.FC<ModelParamsViewProps> = ({ params }) => {
  return (
    <Card>
      <CardHeader title='Model Parameters' titleTypographyProps={{ variant: 'h3' }} />
      <CardContent>
        {params.map(model => <SingleModelParamsView params={model} key={model.name} />)}
      </CardContent>
    </Card>
  );
};

const SingleModelParamsView: React.FC<{ params: ModelParametersInput }> = ({ params }) => {
  return (
    <Paper elevation={2}>
      <List>
        <ListItem>Name: {params.name}</ListItem>
        <ListItem>Neutral Drift: {params.neutralDrift}</ListItem>
        <ListItem>Neutral Drift Amp: {params.neutralDriftAmp}</ListItem>
        <ListItem>Death Rate: {params.deathRate}</ListItem>
        <ListItem>Linear Diffusivity: {params.linearDiffusivity}</ListItem>
        <ListItem>Nonlinear Diffusivity: {params.nonlinearDiffusivity}</ListItem>
      </List>
    </Paper>
  )
};
