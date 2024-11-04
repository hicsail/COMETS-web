import { ModelParametersInput } from '../../graphql/graphql'

export interface ModelParamsViewProps {
  params: ModelParametersInput[];
}

export const ModelParamsView: React.FC<ModelParamsViewProps> = ({ params }) => {
  return (
    <p>Hello World</p>
  );
};
