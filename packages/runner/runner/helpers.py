import cometspy as c
from argparse import ArgumentParser, Namespace


def get_target_flux(experiment: c.comets, model_id: str) -> list[str]:
    # Get only the fluxes start start with "EX"
    filtered_flux = experiment.fluxes_by_species[model_id].filter(regex='^EX', axis=1)
    # Return just the column names
    return list(filtered_flux.columns)


def argument_handling() -> Namespace:
    argparser = ArgumentParser()

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
                           choices=['petri_center', 'petri_random', 'test_tube'])

    # Model settings
    model_args = argparser.add_argument_group('model')
    model_args.add_argument('--model-name',
                            type=str,
                            choices=['escherichia coli core', 'nitrosomonas europaea', 'nitrobacter winogradskyi'],
                            action='append')
    model_args.add_argument('--model-neutral-drift',
                            type=bool,
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

    args = argparser.parse_args()

    # Check for the length of the model info
    if len(args.model_name) == 0:
        argparser.error('At least one model is required')

    print(args)
    return args
