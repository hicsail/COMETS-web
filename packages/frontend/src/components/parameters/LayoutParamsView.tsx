import { LayoutParametersInput } from '../../graphql/graphql'
import { Card, CardHeader, CardContent, List, ListItem } from '@mui/material';
import { getLayoutName } from '../../helpers/names';

export interface LayoutParamsViewProps {
  params: LayoutParametersInput;
}

export const LayoutParamsView: React.FC<LayoutParamsViewProps> = ({ params }) => {
  return (
    <Card>
      <CardHeader title='Global Parameters' titleTypographyProps={{ variant: 'h3' }} />
      <CardContent>
        <List>
          <ListItem>Type: {getLayoutName(params.type)}</ListItem>
          <ListItem>Volume: {params.volume} ml</ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
