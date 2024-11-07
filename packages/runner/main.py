from dotenv import load_dotenv
import cometspy as c
import cobra
import matplotlib.pyplot as plt
from dotenv import load_dotenv
import os
import boto3
from pathlib import Path
from runner import savers
from runner import helpers
from runner import layout_maker
from pprint import pprint
import asyncio
from bullmq import Queue

# Load environment variables
load_dotenv()

# S3 Configuration
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('S3_SECRET_ACCESS_KEY'),
    endpoint_url=os.getenv('S3_ENDPOINT_URL'),
)

# Redis options for BullMQ Configuration
redis_options = {
    'host': os.environ['REDIS_HOST'],
    'port': os.environ['REDIS_PORT'],
    'password': os.environ['REDIS_PASSWORD']
}

# System Variables
OUTPUT_DIR = Path(os.getenv('OUTPUT_DIR', default='./sim_files/'))

# Visualization Settings
plt.switch_backend('Agg')
output_savers = [
    savers.BiomassSaver(),
    savers.FluxSaver(),
    savers.MetaboliteSaver(),
    savers.BiomassSeriesSaver(),
    savers.MetaboliteSeriesSaver()
]


async def main():
    ## Argument Parsing
    args = helpers.argument_handling()

    ## Get layout settings
    layout_builder = layout_maker.layout_factory(
        layout_type=args['layout']['layout_type'],
        width=args['layout']['width'],
        height=args['layout']['height'],
        drop_radius=args['layout']['drop_radius'],
        dish_radius=args['layout']['dish_radius'],
        num_innoculates=args['layout']['num_innoculates'])

    ## Model setup
    models = []
    for model_args in args['model']:
        # Select the correct model to load
        loaded_model = cobra.io.load_model(helpers.MODEL_TO_NOTEBOOK[model_args['model_name']])
        model = c.model(loaded_model)

        if model_args['model_neutral_drift'] == 'True':
            model.add_neutral_drift_parameter(model_args['model_neutral_drift_amp'])


        # model.add_nonlinear_diffusion_parameters(
        #     model_args['model_linear_diffusivity'], model_args['model_nonlinear_diffusivity'],
        #     1.0, 1.0, 0.0)
        ##### BEGIN TEST CODE
        model.add_nonlinear_diffusion_parameters(0.0, 6000e-6, 1.0, 1.0,0.00001)
        ##### END TEST CODE

        model.change_bounds('EX_glc__D_e', -1000, 1000)
        model.change_bounds('EX_ac_e', -1000, 1000)
        model.initial_pop = layout_builder.get_initial_population()
        models.append(model)

    ## Layout setup
    layout = c.layout()

    # Set metabolite
    layout.set_specific_metabolite(args['metabolite']['metabolite_type'], args['metabolite']['metabolite_amount'])
    layout.set_specific_metabolite('o2_e', 1000)
    layout.set_specific_metabolite('nh4_e', 1000)
    layout.set_specific_metabolite('h2o_e', 1000)
    layout.set_specific_metabolite('h_e', 1000)
    layout.set_specific_metabolite('pi_e', 1000)

    # Set size
    layout.grid = layout_builder.get_grid_size()
    layout.add_barriers(layout_builder.get_barrier())

    # Add models
    [layout.add_model(model) for model in models]

    ## Parameters setup
    params = c.params()

    # Core simulation parameters
    params.set_param('defaultVmax', args['global']['default_v_max'])
    params.set_param('defaultKm', args['global']['default_km'])
    params.set_param('maxCycles', args['global']['max_cycles'])
    params.set_param('timeStep', args['global']['time_step'])
    # params.set_param('spaceWidth', 1)
    # params.set_param('maxSpaceBiomass', 10)
    # params.set_param('minSpaceBiomass', 1e-11)
    ##### BEGIN TEST CODE
    params.set_param('spaceWidth', 0.05)
    params.set_param('maxSpaceBiomass', 100)
    params.set_param('minSpaceBiomass', 2.5e-11)
    ##### END TEST CODE

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
    save_config = savers.SaveConfig(
        s3_client=s3_client,
        output_folder=OUTPUT_DIR,
        s3_bucket=args['app']['s3_bucket'],
        s3_folder=args['app']['s3_folder'],
        do_upload=args['app']['s3_save'])
    output = dict()
    for saver in output_savers:
        output.update(saver.save(experiment, save_config))

    ## Notify of completion
    if args['app']['notify']:
        output['requestID'] = args['app']['id']
        queue = Queue(args['app']['queue'], redis_options)
        await queue.add('result', output)
    pprint(output)



if __name__ == '__main__':
    asyncio.run(main())
