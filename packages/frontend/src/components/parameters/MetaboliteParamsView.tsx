import { Card, CardContent, CardHeader, List, ListItem } from '@mui/material';
import { MetaboliteParametersInput } from '../../graphql/graphql';
import { getMetaboliteName } from '../../helpers/names';

export interface MetaboliteParamsViewProps {
  params: MetaboliteParametersInput;
}

export const MetaboliteParamsView: React.FC<MetaboliteParamsViewProps> = ({ params }) => {
  return (
    <Card variant="outlined">
      <CardHeader title="Metabolite Paramers" titleTypographyProps={{ variant: 'h3' }} />
      <CardContent>
        <List>
          <ListItem>Type: {getMetaboliteName(params.type)}</ListItem>
          <ListItem>Amount: {params.concentration} mmol/cm3</ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
