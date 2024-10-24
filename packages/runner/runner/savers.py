import cometspy as c
from pathlib import Path
from dataclasses import dataclass
from abc import ABC, abstractmethod
import matplotlib.pyplot as plt
import typing

from runner import helpers

@dataclass
class SaveConfig:
    s3_client: typing.Any
    output_folder: Path


class Saver(ABC):
    @abstractmethod
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        """
        Handles saving a component of the comets experiment
        """

class BiomassSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        output = dict()
        output['biomass'] = dict()

        for model in experiment.layout.models:
            # Output settings
            output_path = config.output_folder / f'biomass_{model.id}.png'
            image_index = [20, 40, 60, 80, 100]
            figsize = (20, 8)

            images = [experiment.get_biomass_image(model.id, index) for index in image_index]

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

            output['biomass'][model.id] = {
                'name': model.id,
                'path': output_path
            }
            plt.close(fig)

        return output


class FluxSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        output = dict()
        output['flux'] = dict()

        # Go through all the included models
        for model in experiment.layout.models:
            # Make a dictionary to store each flux value
            output['flux'][model.id] = dict()
            fluxes = helpers.get_target_flux(experiment, model.id)

            # Go through each flux on the model
            for flux in fluxes:
                # Output settings
                output_path = config.output_folder / f'flux_{model.id}_{flux}.png'
                image_index = [20, 40, 60, 80, 100]
                figsize = (20, 4)

                images = [experiment.get_flux_image(model.id, flux, index) for index in image_index]

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

                output['flux'][model.id][flux] = {
                    'name': flux,
                    'path': output_path
                }
                plt.close(fig)
        return output


class MetaboliteSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        output = dict()
        output['metabolite'] = dict()

        for metabolite in experiment.layout.media.metabolite:
            # Output settings
            output_path = config.output_folder / f'metabolite_{metabolite}.png'
            image_index = [20, 40, 60, 80, 100]
            figsize = (20, 8)

            images = [experiment.get_metabolite_image(metabolite, index) for index in image_index]

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

            output['metabolite'][metabolite] = {
                'name': metabolite,
                'path': output_path
            }
            plt.close(fig)

        return output


class BiomassSeriesSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        # Output settings
        output_path = config.output_folder / f'biomass_timeseries.png'

        pld = experiment.total_biomass.mul(experiment.parameters.get_param('timeStep'))
        ax = pld.plot(x = 'cycle')
        ax.set_ylabel('Biomass (g)')
        ax.set_xlabel('Time (h)')

        plt.savefig(output_path, format='png', bbox_inches='tight')

        plt.close()

        output = dict()
        output['biomass_series'] = {
            'name': 'Biomass Series',
            'path': output_path
        }

        return output


class MetabolitSeriesSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:

        # Output settings
        output_path = config.output_folder / f'metabolite_timeseries.png'

        media = experiment.media.copy()
        media['time'] = media['cycle'] * experiment.parameters.get_param('timeStep')
        media = media[media.conc_mmol<900]

        fig, ax = plt.subplots()
        media.groupby('metabolite').plot(x='time', ax =ax, y='conc_mmol')
        ax.legend(('acetate','CO2', 'formate', 'glucose'))
        ax.set_ylabel("Concentration (mmol)")
        ax.set_xlabel("Time (h)")

        plt.savefig(output_path, format='png', bbox_inches='tight')

        output = dict()
        output['metabolite_series'] = {
            'name': 'Metabolit Series',
            'path': output_path
        }
        plt.close(fig)

        return output
