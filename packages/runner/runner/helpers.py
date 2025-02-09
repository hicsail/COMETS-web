import cometspy as c
from argparse import ArgumentParser
from typing import Literal

from cometspy.model import cobra

# Model values
E_COLI = 'escherichia coli core'
NITROSOMONAS = 'nitrosomonas europaea'
NITROBACTER = 'nitrobacter winogradskyi'

# Metabolite types
RICH = 'rich'
GLUCOSE = 'glc__D_e'
ACETATE = 'ac_e'

# Support layouts
PETRI_CENTER = 'petri_center'
PETRI_RANDOM = 'petri_random'
TEST_TUBE = 'test_tube'
LayoutType = Literal[PETRI_CENTER, PETRI_RANDOM, TEST_TUBE]

# Layout Defaults
GRID_SIZE = 61
PETRI_DISH_DIAMETER = 3.0

# Helps convert the given model to the notebook to load
def load_model(model_type: str) -> cobra.Model:
    """
    Loads a model based on the type specified. Maps the model to a cobra model

    :param model_type: The type of model to load
    :returns: Cobra loaded model
    """
    if model_type == E_COLI:
        return cobra.io.load_model('textbook')
    elif model_type == NITROSOMONAS:
        return cobra.io.read_sbml_model('./iGC535_modified_cobra.xml')
    elif model_type == NITROBACTER:
        return cobra.io.read_sbml_model('./iFC579_modified_cobra.xml')
    else:
        raise ValueError(f'Unknown model type: {model_type}')


def get_metabolites(model: cobra.Model) -> list:
    """
    Gets the list of metabolites associated with a model. Performs some
    realtively gross dictionary conversion.

    :param model: The cobra model
    :returns: The list of metabolite names
    """
    return list(list(model.metabolites.__dict__.values())[0].keys())


def get_target_flux(experiment: c.comets, model_id: str) -> list[str]:
    """
    Gets the fluxes for a specific model

    :param experiment: The COMETS experiment
    :param model_id: The ID of the model to get fluxes for
    """
    # Get only the fluxes start start with "EX"
    filtered_flux = experiment.fluxes_by_species[model_id].filter(regex='^EX', axis=1)
    # Return just the column names
    return list(filtered_flux.columns)


def argument_handling() -> dict:
    """
    Handles parsing the CLI arguments. Does some logic to group
    together associated parameters including the list of model parameters.

    :returns: The parsed and cleaned CLI arguments
    """
    argparser = ArgumentParser()

    # Application specific
    applevel_args = argparser.add_argument_group('app')
    applevel_args.add_argument('--s3-bucket',
                               type=str,
                               required=True,
                               help='Where to save the output')
    applevel_args.add_argument('--s3-folder',
                               type=str,
                               required=True,
                               help='Folder in bucket to save output')
    applevel_args.add_argument('--s3-save',
                               action='store_true',
                               default=False,
                               help='Flag to decide if the contents should be saved')
    applevel_args.add_argument('--queue',
                               type=str,
                               required=True,
                               help='BullMQ queue name to send results')
    applevel_args.add_argument('--id',
                               type=str,
                               required=True,
                               help='Identifier for the simulation')
    applevel_args.add_argument('--notify',
                               action='store_true',
                               default=False,
                               help='Flag for if the queue should be notified')

    # Metabolite settings
    metabolite_args = argparser.add_argument_group('metabolite')
    metabolite_args.add_argument('--metabolite-type',
                                 type=str,
                                 choices=[GLUCOSE, ACETATE, RICH],
                                 required=True)
    metabolite_args.add_argument('--metabolite-amount',
                                 type=float,
                                 required=True)
    # Layout settings
    layout_args = argparser.add_argument_group('layout')
    layout_args.add_argument('--layout-type',
                           type=str,
                           choices=[PETRI_CENTER, PETRI_RANDOM, TEST_TUBE])
    layout_args.add_argument('--space-width',
                             type=float,
                             required=True)
    layout_args.add_argument('--grid-size',
                             type=int,
                             required=True)
    layout_args.add_argument('--drop-radius',
                             type=float,
                             default=5.0)
    layout_args.add_argument('--num-innoculates',
                             type=int,
                             default=10)

    # Model settings
    model_args = argparser.add_argument_group('model')
    model_args.add_argument('--model-name',
                            type=str,
                            choices=[E_COLI, NITROSOMONAS, NITROBACTER],
                            action='append')
    model_args.add_argument('--model-neutral-drift',
                            type=str,
                            action='append')
    model_args.add_argument('--model-neutral-drift-amp',
                            type=float,
                            action='append')
    model_args.add_argument('--model-death-rate',
                            type=float,
                            action='append')
    model_args.add_argument('--model-linear-diffusivity',
                            type=float,
                            action='append')
    model_args.add_argument('--model-nonlinear-diffusivity',
                            type=float,
                            action='append')

    # Global settings
    global_args = argparser.add_argument_group('global')
    global_args.add_argument('--time-step',
                             type=float,
                             required=True)
    global_args.add_argument('--log-freq',
                             type=int,
                             required=True)
    global_args.add_argument('--default-diff-const',
                             type=float,
                             required=True)
    global_args.add_argument('--default-v-max',
                             type=int,
                             required=True)
    global_args.add_argument('--default-km',
                             type=float,
                             required=True)
    global_args.add_argument('--max-cycles',
                             type=int,
                             required=True)

    args = argparser.parse_args()

    # Divide up the args based on their groups
    arg_groups={}

    for group in argparser._action_groups:
        group_dict = {a.dest:getattr(args,a.dest,None) for a in group._group_actions}
        arg_groups[group.title] = group_dict

    # Check for the length of the model info
    if len(arg_groups['model']['model_name']) == 0:
        argparser.error('At least one model is required')

    # Make sure all the model arg lists are the same size
    arg_lengths = [len(arg_groups['model'][arg]) for arg in arg_groups['model']]
    if not all([length == arg_lengths[0] for length in arg_lengths]):
        argparser.error('Each model argument needs to be present for each model')

    # Create a list of dictionaries for the model parameters
    model_args = []
    for index in range(len(arg_groups['model']['model_name'])):
        model_args.append({
            'model_name': arg_groups['model']['model_name'][index],
            'model_neutral_drift': arg_groups['model']['model_neutral_drift'][index],
            'model_neutral_drift_amp': arg_groups['model']['model_neutral_drift_amp'][index],
            'model_death_rate': arg_groups['model']['model_death_rate'][index],
            'model_linear_diffusivity': arg_groups['model']['model_linear_diffusivity'][index],
            'model_nonlinear_diffusivity': arg_groups['model']['model_nonlinear_diffusivity'][index]
        })

    resulting_args = {
        'app': arg_groups['app'],
        'layout': arg_groups['layout'],
        'metabolite': arg_groups['metabolite'],
        'model': model_args,
        'global': arg_groups['global']
    }

    return resulting_args


def get_time_steps(experiment: c.comets, num_steps = 5) -> tuple[list[int], list[float]]:
    """
    Calculate the time steps for viewing the layout across the experiment.
    Balances the number of cycles and when the logs are captured.

    :param experiment: The COMETS parameters
    :param num_steps: The number of time steps to view
    :returns: Tuple, first element is the cycle number to get a view for,
              second element is the cycle number converted to an hour representation
    """

    max_cycles = experiment.parameters.get_param('maxCycles')
    log_freq = experiment.parameters.get_param('BiomassLogRate')
    time_convertion = experiment.parameters.get_param('timeStep')

    # First determine which cycles to sample
    cycle_step = max_cycles // num_steps
    # Next round down based on the log frequency
    cycle_step -= cycle_step % log_freq
    # Now produce two lists, the cycle id and the time in hours

    cycle_num = []
    time_hr = []
    for i in range(num_steps):
        cycle = cycle_step * (i + 1)
        cycle_num.append(cycle)
        time_hr.append(cycle * time_convertion)

    return cycle_num, time_hr
