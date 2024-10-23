import cometspy as c
import os
import cobra
import matplotlib.pyplot as plt


def main():
    # TODO: Change out to have environment set by Docker
    os.environ['COMETS_GLOP'] = './lib/comets_glop'

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
    layout.set_specific_metabolite('glc__D_e', 1000)
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

    experiment.run(False)

    fig, ax = plt.subplots()
    ax = experiment.total_biomass.plot(x='cycle', ax=ax)
    plt.savefig('example', format='png')
    plt.close(fig)


if __name__ == '__main__':
    main()
