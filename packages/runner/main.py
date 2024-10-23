from math import exp
from dotenv import load_dotenv
import cometspy as c
import cobra
import matplotlib.pyplot as plt
from argparse import ArgumentParser
from dotenv import load_dotenv
import os
import boto3
from pathlib import Path
import matplotlib

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


def save_biomass(experiment: c.comets, model_id: str) -> Path:
    # Output settings
    output_path = OUTPUT_DIR / f'biomass_{model_id}.png'
    image_index = [20, 40, 60, 80, 100]
    figsize = (20, 8)

    images = [experiment.get_biomass_image(model_id, index) for index in image_index]

    fig = plt.figure(constrained_layout=True, figsize=figsize)
    gs = fig.add_gridspec(2, 6, width_ratios=[1, 1, 1, 1, 1, 0.25])

    # Display the petri dish images on the first row
    for index, img in enumerate(images):
        # Display the subplot in the given row
        ax = fig.add_subplot(gs[0, index])
        # Title based on the timestep in hours
        ax.set_title(str(image_index[index] // 10) + 'h')
        # Add the image in
        cax = ax.imshow(img, cmap='viridis')
        ax.axis('off')

    ax = fig.add_subplot(gs[0, 5])

    ax.axis('off')
    ax.set_title('grams/pixel')
    fig.colorbar(cax, ax=ax)

    fig.savefig(output_path, format='png', bbox_inches='tight')

    return output_path


def save_flux(experiment: c.comets, model_id: str, flux_id: str) -> Path:
    # Output settings
    output_path = OUTPUT_DIR / f'flux_{model_id}_{flux_id}.png'
    image_index = [20, 40, 60, 80, 100]
    figsize = (20, 4)

    images = [experiment.get_flux_image(model_id, flux_id, index) for index in image_index]

    # Create the figure with the grid constraings
    fig = plt.figure(constrained_layout=True, figsize=figsize)
    gs = fig.add_gridspec(1, 6, width_ratios=[1, 1, 1, 1, 1, 0.25])


    # Display the petri dish images on the first row
    for index, img in enumerate(images):
        # Display the subplot in the given row
        ax = fig.add_subplot(gs[0, index])
        # Title based on the timestep in hours
        ax.set_title(str(image_index[index] // 10) + 'h')
        # Add the image in
        cax = ax.imshow(img, cmap='viridis')
        ax.axis('off')

    # Display the color bar on the side
    ax = fig.add_subplot(gs[0, 5])
    ax.axis('off')
    ax.set_title('mmol/gh')
    fig.colorbar(cax, ax=ax)

    fig.savefig(output_path, format='png', bbox_inches='tight')
    return output_path


def save_metabolite(experiment: c.comets, metabolite_id: str) -> Path:
    # Output settings
    output_path = OUTPUT_DIR / f'metabolite_{metabolite_id}.png'
    image_index = [20, 40, 60, 80, 100]
    figsize = (20, 8)

    images = [experiment.get_metabolite_image(metabolite_id, index) for index in image_index]

    # Create the figure with the grid constraings
    fig = plt.figure(constrained_layout=True, figsize=figsize)
    gs = fig.add_gridspec(2, 6, width_ratios=[1, 1, 1, 1, 1, 0.25])

    # Display the petri dish images on the first row
    for index, img in enumerate(images):
        # Display the subplot in the given row
        ax = fig.add_subplot(gs[0, index])
        # Title based on the timestep in hours
        ax.set_title(str(image_index[index] // 10) + 'h')
        # Add the image in
        cax = ax.imshow(img, cmap='viridis')
        ax.axis('off')

    # Display the color bar on the side
    ax = fig.add_subplot(gs[0, 5])
    ax.axis('off')
    ax.set_title('mmol/pixel')
    fig.colorbar(cax, ax=ax)

    fig.savefig(output_path, format='png', bbox_inches='tight')

    return output_path

def main():
    params = c.params()

    ## Model setup
    loaded_model = cobra.io.load_model('textbook')
    model = c.model(loaded_model)
    model.add_neutral_drift_parameter(0.001)
    model.neutral_drift_flag = False
    model.add_nonlinear_diffusion_parameters(0.001, 0.6, 1.0, 1.0, 0.0)
    model.change_bounds('EX_glc__D_e', -1000, 1000)
    model.change_bounds('EX_ac_e', -1000, 1000)

    ## Layout setup
    layout = c.layout()

    # Set metabolite
    layout.set_specific_metabolite('glc__D_e', 0.011)
    layout.set_specific_metabolite('o2_e', 1000)
    layout.set_specific_metabolite('nh4_e', 1000)
    layout.set_specific_metabolite('h2o_e', 1000)
    layout.set_specific_metabolite('h_e', 1000)
    layout.set_specific_metabolite('pi_e', 1000)
    layout.set_specific_metabolite('ac_e', 1000)

    # Set size
    layout.grid = [1, 1]

    # Add model
    model.initial_pop = [[0, 0, 1e-6]]
    layout.add_model(model)

    ## Parameters setup
    params.set_param('numRunThreads', 1)
    params.set_param('timeStep', 0.1)
    params.set_param('maxCycles', 100)
    params.set_param('spaceWidth',0.05)
    params.set_param('defaultVmax', 10)
    params.set_param('defaultKm', 0.0001)
    params.set_param('BiomassLogRate', 20)
    params.set_param('MediaLogRate', 20)
    params.set_param('FluxLogRate', 20)
    params.set_param('ExchangeStyle','Monod Style')
    params.set_param('defaultDiffConst', 0.000006)
    params.set_param('biomassMotionStyle', 'ConvNonlin Diffusion 2D')
    params.set_param('writeBiomassLog', True)
    params.set_param('writeTotalBiomassLog', True)
    params.set_param('writeFluxLog', True)
    params.set_param('writeMediaLog', True)
    params.set_param('comets_optimizer', 'GLOP')

    ## Create the experiment
    experiment = c.comets(layout, params, 'sim_files/')
    experiment.set_classpath('bin', './lib/comets_glop/bin/comets_scr.jar')

    ## Run the experiment
    experiment.run(False)

    ## Capture the output
    save_biomass(experiment, model.id)
    # TODO: Add Flux Saving
    # TODO: Add Metabolite Saving



if __name__ == '__main__':
    main()
