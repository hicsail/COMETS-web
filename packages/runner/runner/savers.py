import cometspy as c
from pathlib import Path
from dataclasses import dataclass

@dataclass
class SaveConfig:




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

def save_total_biomass_series(experiment: c.comets) -> Path:
    # Output settings
    output_path = OUTPUT_DIR / f'biomass_timeseries.png'

    _, ax = plt.subplots()
    ax = experiment.total_biomass.plot(x='cycle', ax=ax)
    ax.set_ylabel('Biomass (gr.)')

    plt.savefig(output_path, format='png', bbox_inches='tight')

    return output_path

def save_metabolite_timeseries(experiment: c.comets) -> Path:
    # Output settings
    output_path = OUTPUT_DIR / f'metabolite_timeseries.png'

    _, ax = plt.subplots()
    ax = experiment.get_metabolite_time_series().plot(x='cycle', ax=ax)
    ax.set_ylabel('Metabolite time series (gr.)')

    plt.savefig(output_path, format='png', bbox_inches='tight')

    return output_path
