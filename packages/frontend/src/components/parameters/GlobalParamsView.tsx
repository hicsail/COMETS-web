import { GlobalParametersInput } from '../../graphql/graphql'

export interface GlobalParamsViewProps {
  params: GlobalParametersInput;
}

export const GlobalParamsView: React.FC<GlobalParamsViewProps> = ({ params }) => {
  return (
    <p>Hello World</p>
  );
};
