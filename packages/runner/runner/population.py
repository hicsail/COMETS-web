from runner.helpers import PETRI_CENTER, PETRI_RANDOM, TEST_TUBE, LayoutType
import random


_DEFAULT_DROP_RADIUS = 5
_DEFAULT_NUM_INNOCULATES = 100


def _get_population_center(center_x: int,
                           center_y: int,
                           radius: int,
                           max_x: int,
                           max_y: int,
                           min_x: int,
                           min_y: int,
                           initial_pop: float) -> list[list[float]]:
    """
    Get an initial population value about the center of a region with a given radius
    """
    initial_populations = []
    # Loop over all x,y values around a center circle
    for x in range(center_x - radius, center_x + radius + 1):
        for y in range(center_y - radius, center_y + radius + 1):
            # Make sure the x and y values are within range
            if (min_x <= x <= max_x) and (min_y <= y <= max_y):
                # Apply equation of a circle to see if the given x,y value lies in the circle
                circle_eq = (x - center_x) ** 2 + (y - center_y) ** 2
                if circle_eq <= radius ** 2:
                    initial_populations.append([x, y, initial_pop])
    return initial_populations


def _get_random_population(max_x: int,
                           max_y: int,
                           min_x: int,
                           min_y: int,
                           num_innoculates: int,
                           initial_pop: float
                           ) -> list[list[float]]:
    """
    Random generate locations to drop num_innoculates number of initial populations
    """
    # First double check that there is room for the number of innoculates
    max_positions = (max_x - min_x) * (max_y - min_y)
    if max_positions > num_innoculates:
        raise ValueError('Not enough room for the number of innoculates requested')

    # Keep track of coordinates provides
    coordinates = set()
    initial_populations = []

    while len(coordinates) < num_innoculates:
        # Generate some random coordinates
        x = random.randint(min_x, max_x)
        y = random.randint(min_y, max_y)

        # If the x, y combination already present, continue
        if (x, y) in coordinates:
            continue

        coordinates.add((x, y))
        initial_populations.append([x, y, initial_pop])

    return initial_populations


def get_initial_population(layout_type: LayoutType, max_x: int, max_y: int, initial_pop: float) -> list[list[float]]:
    if layout_type == PETRI_CENTER:
        return _get_population_center(center_x=max_x // 2,
                                      center_y=max_y // 2,
                                      radius=_DEFAULT_DROP_RADIUS,
                                      max_x=max_x,
                                      max_y=max_y,
                                      min_x=0,
                                      min_y=0,
                                      initial_pop=initial_pop)
    elif layout_type == PETRI_RANDOM:
        return _get_random_population(max_x=max_x,
                                      max_y=max_y,
                                      min_x=0,
                                      min_y=0,
                                      num_innoculates=_DEFAULT_NUM_INNOCULATES,
                                      initial_pop=initial_pop)
    elif layout_type == TEST_TUBE:
        return [[0, 0, initial_pop]]
    raise ValueError(f'Layout {layout_type} not supported')
