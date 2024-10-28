import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonSchema } from '@jsonforms/core';
import { Box } from '@mui/system';
import { ErrorObject } from 'ajv';

const schema: JsonSchema = {
  type: 'object',
  properties: {
    metaboliteParams: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          oneOf: [
            {
              const: 'glc__D_e',
              title: 'Glucose'
            },
            {
              const: 'ac_e',
              title: 'Acetate'
            },
            {
              const: 'rich',
              title: 'Rich'
            }
          ]
        },
        amount: {
          type: 'number',
        }
      },
      required: ['type', 'amount']
    },
    modelParams: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            oneOf: [
              {
                const: 'escherichia coli core',
                title: 'Escherichia coli Core'
              },
              {
                const: 'nitrosomonas europaea',
                title: 'Nitrosomonas europaea'
              },
              {
                const: 'nitrobacter winogradskyi',
                title: 'Nitrobacter winogradskyi'
              }
            ]
          },
          neutralDrift: {
            type: 'boolean',
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


export const ExperimentForm: React.FC = () => {
  const data = {
    globalParams: {
      timeStep: 0.1,
      logFreq: 20,
      defaultDiffConst: 0.000006,
      defaultVMax: 10,
      defaultKm: 0.00001,
      maxCycles: 2000
    }
  };

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    console.log(data);
    console.log(errors);
  };

  return (
    <Box sx={{ maxWidth: '75%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => handleChange(data, errors as any)}
      />
    </Box>
  );
};
