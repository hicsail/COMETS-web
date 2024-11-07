import cometspy as c
from argparse import ArgumentParser
from typing import Literal

# Model values
E_COLI = 'escherichia coli core'
NITROSOMONAS = 'nitrosomonas europaea'
NITROBACTER = 'nitrobacter winogradskyi'

# Support layouts
PETRI_CENTER = 'petri_center'
PETRI_RANDOM = 'petri_random'
TEST_TUBE = 'test_tube'
LayoutType = Literal[PETRI_CENTER, PETRI_RANDOM, TEST_TUBE]

# Helps convert the given model to the notebook to load
MODEL_TO_NOTEBOOK = {
    E_COLI: 'textbook',
    NITROSOMONAS: './iGC535_modified_cobra.xml',
    NITROBACTER: './iFC579_modified_cobra.xml',
}


def get_target_flux(experiment: c.comets, model_id: str) -> list[str]:
    # Get only the fluxes start start with "EX"
    filtered_flux = experiment.fluxes_by_species[model_id].filter(regex='^EX', axis=1)
    # Return just the column names
    return list(filtered_flux.columns)


def argument_handling() -> dict:
    argparser = ArgumentParser()

    # Application specific
    applevel_args = argparser.add_argument_group('app')
    applevel_args.add_argument('--s3-bucket',
                               type=str,
                               required=True)
    applevel_args.add_argument('--s3-folder',
                               type=str,
                               required=True)
    applevel_args.add_argument('--s3-save',
                               action='store_true',
                               default=False)
    applevel_args.add_argument('--queue',
                               type=str,
                               required=True)
    applevel_args.add_argument('--id',
                               type=str,
                               required=True)
    applevel_args.add_argument('--notify',
                               action='store_true',
                               default=False)

    # Metabolite settings
    metabolite_args = argparser.add_argument_group('metabolite')
    metabolite_args.add_argument('--metabolite-type',
                                 type=str,
                                 choices=['glc__D_e', 'ac_e', 'rich'],
                                 required=True)
    metabolite_args.add_argument('--metabolite-amount',
                                 type=float,
                                 required=True)
    # Layout settings
    layout_args = argparser.add_argument_group('layout')
    layout_args.add_argument('--layout-type',
                           type=str,
                           choices=[PETRI_CENTER, PETRI_RANDOM, TEST_TUBE])
    layout_args.add_argument('--width',
                             type=int,
                             default=61)
    layout_args.add_argument('--height',
                             type=int,
                             default=61)
    layout_args.add_argument('--drop-radius',
                             type=float,
                             default=5.0)
    layout_args.add_argument('--dish-radius',
                             type=float,
                             default=29.0)
    layout_args.add_argument('--num-innoculates',
                             type=int,
                             default=100)

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
