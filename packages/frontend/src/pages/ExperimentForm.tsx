import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonSchema } from '@jsonforms/core';
import { Box, Stack, Button } from '@mui/material';
import { ErrorObject } from 'ajv';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MetaboliteType } from '../graphql/graphql';

const getSchema = (metaboliteType: MetaboliteType | null) => {
  // The models supported are based on the metabolite type
  let models = [
    {
      const: 'E_COLI',
      title: 'Escherichia coli Core'
    }
  ];
  if (metaboliteType == MetaboliteType.Rich) {
    models = [
      {
        const: 'NITROSOMONAS',
        title: 'Nitrosomonas europaea'
      },
      {
        const: 'NITROBACTER',
        title: 'Nitrobacter winogradskyi'
      }
    ];
  }

  const schema: JsonSchema = {
    type: 'object',
    properties: {
      layoutParams: {
        type: 'object',
        title: 'Layout Parameters',
        properties: {
          type: {
            type: 'string',
            oneOf: [
              {
                const: 'PETRI_CENTER',
                title: '3 cm Petri Dish (Center Colony)'
              },
              {
                const: 'PETRI_RANDOM',
                title: '3 cm Petri Dish (Random Lawn)'
              },
              {
                const: 'TEST_TUBE',
                title: 'Test Tube'
              }
            ]
          },
          volume: {
            type: 'number'
          }
        },
        required: ['type', 'volume']
      },
      metaboliteParams: {
        type: 'object',
        title: 'Metabolite Parameters',
        properties: {
          type: {
            type: 'string',
            oneOf: [
              {
                const: 'GLUCOSE',
                title: 'Glucose'
              },
              {
                const: 'ACETATE',
                title: 'Acetate'
              },
              {
                const: 'RICH',
                title: 'Rich'
              }
            ]
          },
          concentration: {
            type: 'number'
          }
        },
        required: ['type', 'concentration']
      },
      modelParams: {
        type: 'array',
        title: 'Model Parameters',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              oneOf: models
            },
            neutralDrift: {
              type: 'boolean'
            },
            neutralDriftAmp: {
              type: 'number',
              default: 0.001
            },
            deathRate: {
              type: 'number',
              default: 0.001
            },
            linearDiffusivity: {
              type: 'number',
              default: 0.001
            },
            nonlinearDiffusivity: {
              type: 'number',
              default: 0.6
            }
          },
          required: ['name', 'neutralDriftAmp', 'deathRate', 'linearDiffusivity', 'nonlinearDiffusivity']
        }
      },
      globalParams: {
        type: 'object',
        title: 'Global Parameters',
        properties: {
          timeStep: {
            type: 'number',
            default: 0.1
          },
          logFreq: {
            type: 'number',
            default: 20
          },
          defaultDiffConst: {
            type: 'number',
            default: 0.000006
          },
          defaultVMax: {
            type: 'number',
            default: 10
          },
          defaultKm: {
            type: 'number',
            default: 0.00001
          },
          maxCycles: {
            type: 'number',
            default: 2000
          }
        }
      }
    },
    required: ['metaboliteParams', 'modelParams', 'globalParams']
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/layoutParams'
      },
      {
        type: 'Control',
        scope: '#/properties/metaboliteParams'
      },
      {
        type: 'Group',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/modelParams'
          }
        ]
      },
      {
        type: 'Control',
        scope: '#/properties/globalParams'
      }
    ]
  };

  return { schema, uischema };
};

const defaults = {
  metaboliteParams: {
    type: 'GLUCOSE'
  },
  globalParams: {
    timeStep: 0.1,
    logFreq: 20,
    defaultDiffConst: 0.000006,
    defaultVMax: 10,
    defaultKm: 0.00001,
    maxCycles: 2000
  }
};

export const ExperimentForm: React.FC = () => {
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [data, setData] = useState<any>(defaults);
  const navigate = useNavigate();

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);
    setHasErrors(!!errors && errors.length > 0);
  };

  const handleSubmit = () => {
    navigate('/summaryReview', { state: { data } });
  };

  const { schema, uischema } = getSchema(data.metaboliteParams?.type);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Stack direction="column" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => handleChange(data, errors as any)}
        />
        <Button variant="contained" sx={{ maxWidth: 100 }} disabled={hasErrors} onClick={() => handleSubmit()}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};
