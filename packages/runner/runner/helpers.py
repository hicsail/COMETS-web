import cometspy as c


def get_target_flux(experiment: c.comets, model_id: str) -> list[str]:
    # Get only the fluxes start start with "EX"
    filtered_flux = experiment.fluxes_by_species[model_id].filter(regex='^EX', axis=1)
    # Return just the column names
    return list(filtered_flux.columns)
