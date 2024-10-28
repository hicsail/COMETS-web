import { SimulationRequest } from '../../graphql/graphql';

export interface LayoutVisualizationProps {
  request: SimulationRequest;
}

export const LayoutVisualization: React.FC<LayoutVisualizationProps> = ({ request }) => {
  return (
    <p>Hello World</p>
  )
};
