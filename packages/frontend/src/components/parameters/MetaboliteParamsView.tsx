import { MetaboliteParametersInput } from "../../graphql/graphql"

export interface MetaboliteParamsViewProps {
  params: MetaboliteParametersInput;
}

export const MetaboliteParamsView: React.FC<MetaboliteParamsViewProps> = ({ params }) => {
  return (
    <p>Hello World</p>
  );
};
