from dotenv import load_dotenv
import cometspy as c
import cobra
import matplotlib.pyplot as plt
from dotenv import load_dotenv
import os
import boto3
from pathlib import Path
from argparse import ArgumentParser
from runner import savers
from runner import helpers
from runner.helpers import argument_handling

# Load environment variables
load_dotenv()

# S3 Configuration
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    endpoint_url=os.getenv('AWS_ENDPOINT_URL')
)

# System Variables
OUTPUT_DIR = Path(os.getenv('OUTPUT_DIR', default='./sim_files/'))

# Visualization Settings
plt.switch_backend('Agg')
save_config = savers.SaveConfig(s3_client, OUTPUT_DIR)
output_savers = [
    savers.BiomassSaver(),
    savers.FluxSaver(),
    savers.MetaboliteSaver(),
    savers.BiomassSeriesSaver(),
    savers.MetabolitSeriesSaver()
]


def main():
    ## Argument Parsing
    args = helpers.argument_handling()

    ## Model setup
    models = []
    for model_args in args['model']:
        # Select the correct model to load
        loaded_model = cobra.io.load_model(helpers.MODEL_TO_NOTEBOOK[model_args['model_name']])
        model = c.model(loaded_model)
        model.add_nonlinear_diffusion_parameters(
            model_args['model_linear_diffusivity'], model_args['model_nonlinear_diffusivity'],
            1.0, 1.0, 0.0)
        model.change_bounds('EX_glc__D_e', -1000, 1000)
        model.change_bounds('EX_ac_e', -1000, 1000)
        model.initial_pop = [[0, 0, 1e-6]]
        models.append(model)

    ## Layout setup
    layout = c.layout()

    # Set metabolite
    layout.set_specific_metabolite('glc__D_e', 0.011)
    layout.set_specific_metabolite('o2_e', 1000)
    layout.set_specific_metabolite('nh4_e', 1000)
    layout.set_specific_metabolite('h2o_e', 1000)
    layout.set_specific_metabolite('h_e', 1000)
    layout.set_specific_metabolite('pi_e', 1000)

    # Set size
    layout.grid = [1, 1]

    # Add model
    [layout.add_model(model) for model in models]

    ## Parameters setup
    params = c.params()

    # Core simulation parameters
    params.set_param('defaultVmax', args['global']['default_v_max'])
    params.set_param('defaultKm', args['global']['default_km'])
    params.set_param('maxCycles', args['global']['max_cycles'])
    params.set_param('timeStep', args['global']['time_step'])
    params.set_param('spaceWidth', 1)
    params.set_param('maxSpaceBiomass', 10)
    params.set_param('minSpaceBiomass', 1e-11)

    # Functional control
    params.set_param('BiomassLogRate', args['global']['log_freq'])
    params.set_param('MediaLogRate', args['global']['log_freq'])
    params.set_param('FluxLogRate', args['global']['log_freq'])
    params.set_param('ExchangeStyle','Monod Style')
    params.set_param('defaultDiffConst', args['global']['default_diff_const'])
    params.set_param('biomassMotionStyle', 'ConvNonlin Diffusion 2D')
    params.set_param('writeMediaLog', True)
    params.set_param('writeBiomassLog', True)
    params.set_param('writeFluxLog', True)
    params.set_param('writeTotalBiomassLog', True)
    params.set_param('comets_optimizer', 'GLOP')

    ## Create the experiment
    experiment = c.comets(layout, params, 'sim_files/')
    experiment.set_classpath('bin', './lib/comets_glop/bin/comets_scr.jar')

    ## Run the experiment
    experiment.run(False)

    ## Capture the output
    output = dict()
    for saver in output_savers:
        output.update(saver.save(experiment, save_config))
    print(output)


if __name__ == '__main__':
    main()
