import cometspy as c
from pathlib import Path
from dataclasses import dataclass
from abc import ABC, abstractmethod
import matplotlib.pyplot as plt
import typing

from runner import helpers

@dataclass
class SaveConfig:
    """ Information needed for saving the results """
    s3_client: typing.Any
    output_folder: Path
    s3_bucket: str
    s3_folder: str
    do_upload: bool
    is_rich: bool


class Saver(ABC):
    """
    Interface that all data savers implement
    """
    def upload_file(self, config: SaveConfig, key: str, filename: Path) -> None:
        """
        Handles uploading the file (if saving is set) to the S3 bucket

        :param config: The save settings
        :param key: Will be the key in the S3 bucket
        :param filename: Where the file is located on the local system
        """
        if config.do_upload:
            config.s3_client.upload_file(filename, config.s3_bucket, key)

    @abstractmethod
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        """
        Handles saving a component of the comets experiment
        """

class BiomassSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        """
        Generates biomass figures for each model at a fixed time step.
        Each model results in one image with a fixed number of sampled
        visualizations.

        :param experiment: The ran COMETS experiment
        :param config: The save configurations
        :returns: Where the saved biomass figures are located in S3
        """
        output = dict()
        output['biomass'] = []

        for model in experiment.layout.models:
            # Output settings
            filename = f'biomass_{model.id}.png'
            output_path = config.output_folder / filename
            bucket_location = f'{config.s3_folder}/{filename}'
            image_index, time_hr = helpers.get_time_steps(experiment)
            figsize = (20, 8)

            images = [experiment.get_biomass_image(model.id, index) for index in image_index]

            fig = plt.figure(constrained_layout=True, figsize=figsize)
            gs = fig.add_gridspec(2, 6, width_ratios=[1, 1, 1, 1, 1, 0.25])

            # Display the petri dish images on the first row
            for index, img in enumerate(images):
                # Display the subplot in the given row
                ax = fig.add_subplot(gs[0, index])
                # Title based on the timestep in hours
                ax.set_title(str(round(time_hr[index])) + 'h')
                # Add the image in
                cax = ax.imshow(img, cmap='viridis')
                ax.axis('off')

            ax = fig.add_subplot(gs[0, 5])

            ax.axis('off')
            ax.set_title('grams/pixel')
            fig.colorbar(cax, ax=ax)

            # Save the file and upload
            fig.savefig(output_path, format='png', bbox_inches='tight')
            self.upload_file(config, bucket_location, output_path)

            output['biomass'].append({
                'key': model.id,
                'name': model.id,
                'location': bucket_location
            })
            plt.close(fig)

        return output


class FluxSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        """
        Generates flux figures for each model and for each flux at
        a fixed time step. Each model cooresponds to a series of
        flux figures.

        :param experiment: The ran COMETS experiment
        :param config: The save configurations
        :returns: Where the flux figures are stored in S3
        """
        output = dict()
        output['flux'] = []

        # Go through all the included models
        for model_index, model in enumerate(experiment.layout.models):
            # Make a list for each flux
            output['flux'].append({
                'modelID': model.id,
                'modelName': model.id,
                'flux': []
            })
            fluxes = helpers.get_target_flux(experiment, model.id)

            # Go through each flux on the model
            for flux in fluxes:
                # Output settings
                filename = f'flux_{model.id}_{flux}.png'
                output_path = config.output_folder / filename
                bucket_location = f'{config.s3_folder}/{filename}'
                image_index, time_hr = helpers.get_time_steps(experiment)
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
                    ax.set_title(str(round(time_hr[index])) + 'h')
                    # Add the image in
                    cax = ax.imshow(img, cmap='viridis')
                    ax.axis('off')

                # Display the color bar on the side
                ax = fig.add_subplot(gs[0, 5])
                ax.axis('off')
                ax.set_title('mmol/gh')
                fig.colorbar(cax, ax=ax)

                # Save the file and upload
                fig.savefig(output_path, format='png', bbox_inches='tight')
                self.upload_file(config, bucket_location, output_path)

                output['flux'][model_index]['flux'].append({
                    'key': flux,
                    'name': flux,
                    'location': bucket_location
                })
                plt.close(fig)
        return output


class MetaboliteSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        """
        Generates the metabolite figures for the given experiment.

        :param experiment: The ran COMETS experiment
        :param config: The save configurations
        :returns: Where the metabolite figures are saved in S3
        """
        output = dict()
        output['metabolite'] = []

        for metabolite in experiment.layout.media.metabolite:
            # Output settings
            filename = f'metabolite_{metabolite}.png'
            output_path = config.output_folder / filename
            bucket_location = f'{config.s3_folder}/{filename}'
            image_index, time_hr = helpers.get_time_steps(experiment)
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
                ax.set_title(str(round(time_hr[index])) + 'h')
                # Add the image in
                cax = ax.imshow(img, cmap='viridis')
                ax.axis('off')

            # Display the color bar on the side
            ax = fig.add_subplot(gs[0, 5])
            ax.axis('off')
            ax.set_title('mmol/pixel')
            fig.colorbar(cax, ax=ax)

            # Save the file and upload
            fig.savefig(output_path, format='png', bbox_inches='tight')
            self.upload_file(config, bucket_location, output_path)

            output['metabolite'].append({
                'key': metabolite,
                'name': metabolite,
                'location': bucket_location
            })
            plt.close(fig)

        return output


class BiomassSeriesSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        """
        Generates the time series biomass graph.

        :param experiment: The ran COMETS experiment
        :param config: The save configuration
        :returns: Where the biomass graph was saved in S3
        """
        # Output settings
        filename = 'biomass_timeseries.png'
        output_path = config.output_folder / filename
        bucket_location = f'{config.s3_folder}/{filename}'

        pld = experiment.total_biomass.mul(experiment.parameters.get_param('timeStep'))
        ax = pld.plot(x = 'cycle')
        ax.set_ylabel('Biomass (g)')
        ax.set_xlabel('Time (h)')

        # Save the file and upload
        plt.savefig(output_path, format='png', bbox_inches='tight')
        self.upload_file(config, bucket_location, output_path)

        plt.close()

        output = dict()
        output['biomassSeries'] = {
            'name': 'Biomass Series',
            'key': 'Biomass Series',
            'location': bucket_location
        }

        return output


class MetaboliteSeriesSaver(Saver):
    def save(self, experiment: c.comets, config: SaveConfig) -> dict:
        """
        Generats the time series metabolite graph.

        :param experiment: The ran COMETS experiment
        :param config: The save configuration
        :retunrs: Where the metabolite graph is saved in S3
        """
        # Output settings
        filename = 'metabolite_timeseries.png'
        output_path = config.output_folder / filename
        bucket_location = f'{config.s3_folder}/{filename}'

        # Determine the threshold based on type
        threshold = 900
        if config.is_rich:
            threshold = 5_000

        # Get the time series media data and convert time to hours
        media = experiment.get_metabolite_time_series(upper_threshold=threshold)
        media['cycle'] = media['cycle'] * experiment.parameters.get_param('timeStep')

        # Plot the media time series
        fig, ax = plt.subplots()
        ax = media.plot(x='cycle', ax=ax)
        ax.set_ylabel('Concentration (mmol)')
        ax.set_xlabel('Time (h)')

        plt.savefig(output_path, format='png', bbox_inches='tight')
        self.upload_file(config, bucket_location, output_path)

        output = dict()
        output['metaboliteSeries'] = {
            'key': 'Metabolite Series',
            'name': 'Metabolite Series',
            'location': bucket_location
        }
        plt.close(fig)

        return output
