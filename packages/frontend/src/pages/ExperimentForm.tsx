import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonSchema, JsonSchema7 } from '@jsonforms/core';
import { Box, Stack, Button } from '@mui/material';
import { ErrorObject } from 'ajv';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LayoutType, MetaboliteType, ModelName } from '../graphql/graphql';
import { getLayoutName, getMetaboliteName, getModelName } from '../helpers/names';

const getSchema = (metaboliteType: MetaboliteType | null) => {
  // The models supported are based on the metabolite type
  let models = [
    {
      const: ModelName.EColi,
      title: getModelName(ModelName.EColi)
    }
  ];
  if (metaboliteType == MetaboliteType.Rich) {
    models = [
      {
        const: ModelName.Nitrosomonas,
        title: getModelName(ModelName.Nitrosomonas)
      },
      {
        const: ModelName.Nitrobacter,
        title: getModelName(ModelName.Nitrobacter)
      }
    ];
  }

  let metaboliteParams: JsonSchema7 = {
    type: 'object',
    title: 'Metabolite Parameters',
    properties: {
      type: {
        type: 'string',
        oneOf: [
          {
            const: MetaboliteType.Glucose,
            title: getMetaboliteName(MetaboliteType.Glucose)
          },
          {
            const: MetaboliteType.Acetate,
            title: getMetaboliteName(MetaboliteType.Acetate)
          },
          {
            const: MetaboliteType.Rich,
            title: getMetaboliteName(MetaboliteType.Rich)
          }
        ]
      }
    },
    required: ['type']
  }

  if (metaboliteType != MetaboliteType.Rich) {
    metaboliteParams!.properties!['concentration'] = {
      type: 'number',
      title: 'Concentration (M)'
    };
    metaboliteParams.required!.push('concentration');
  }

  const schema: JsonSchema7 = {
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
                const: LayoutType.PetriCenter,
                title: getLayoutName(LayoutType.PetriCenter)
              },
              {
                const: LayoutType.PetriRandom,
                title: getLayoutName(LayoutType.PetriRandom)
              },
              {
                const: LayoutType.TestTube,
                title: getLayoutName(LayoutType.TestTube)
              }
            ]
          },
          volume: {
            type: 'number',
            title: 'Volume (ml)'
          }
        },
        required: ['type', 'volume']
      },
      metaboliteParams: metaboliteParams,
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
              default: 0.001,
              title: 'Linear Diffusivity (cm^2/s)'
            },
            nonlinearDiffusivity: {
              type: 'number',
              default: 0.6,
              title: 'Nonlinear Diffusivity (cm^2/sg)'
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
            default: 0.1,
            title: 'Timestep (Hours/Cycle)'
          },
          logFreq: {
            type: 'number',
            default: 20
          },
          defaultDiffConst: {
            type: 'number',
            default: 0.000006,
            title: 'Nutrient Diffusivity (cm^2/s)'
          },
          defaultVMax: {
            type: 'number',
            default: 10,
            title: 'Default VMax (mmol/gh)'
          },
          defaultKm: {
            type: 'number',
            default: 0.00001,
            title: 'Default KM (M)'
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
