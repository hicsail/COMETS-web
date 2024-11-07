from abc import ABC, abstractmethod
import math
import random

from runner.helpers import PETRI_CENTER, PETRI_RANDOM, TEST_TUBE, LayoutType


def _in_circle(x: float, y: float, center_x: float, center_y: float, radius: float):
    return (x - center_x) ** 2 + (y - center_y) ** 2 < radius ** 2


class LayoutMaker(ABC):
    def __init__(self, initial_pop_num=1e-6):
        self.initial_pop_num = initial_pop_num

    @abstractmethod
    def get_initial_population(self) -> list[list[float]]:
        """
        Get the initial population for a given layout type
        """

    @abstractmethod
    def get_barrier(self) -> list[list[float]]:
        """
        Get the region of the grid where the simulation
        should not operate over
        """

    @abstractmethod
    def get_grid_size(self) -> list[int]:
        """
        Get the size the grid should be
        """

class TestTubeMaker(LayoutMaker):
    def __init__(self):
        super().__init__()

    def get_initial_population(self) -> list[list[float]]:
        return [[0, 0, self.initial_pop_num]]

    def get_barrier(self) -> list[list[float]]:
        return []

    def get_grid_size(self) -> list[int]:
        return [1, 1]


class PetriDishCenter(LayoutMaker):
    def __init__(self, width: int, height: int, drop_radius: float, dish_radius: float):
        super().__init__()

        self.width = width
        self.height = height
        self.drop_radius = drop_radius
        self.dish_radius = dish_radius

        self.center_x = self.width // 2
        self.center_y = self.height // 2

    def get_initial_population(self) -> list[list[float]]:
        init_population = []

        for x in range(self.width):
            for y in range(self.height):
                if _in_circle(x, y, self.center_x, self.center_y, self.drop_radius):
                    init_population.append([x, y, self.initial_pop_num])

        return init_population

    def get_barrier(self) -> list[list[float]]:
        barrier = []

        for x in range(self.width):
            for y in range(self.height):
                if not _in_circle(x, y, self.center_x, self.center_y, self.dish_radius):
                    barrier.append((x,y))

        return barrier

    def get_grid_size(self) -> list[int]:
        return [self.width, self.height]


class PetriDishRandom(LayoutMaker):
    def __init__(self, width: int, height: int, num_innoculates: int, dish_radius: float):
        super().__init__()

        self.width = width
        self.height = height
        self.num_innoculates = num_innoculates
        self.dish_radius = dish_radius

        self.center_x = self.width // 2
        self.center_y = self.height // 2

    def get_initial_population(self) -> list[list[float]]:
        # First double check that there is room for the number of innoculates
        max_positions = math.pi * self.dish_radius ** 2
        if max_positions > self.num_innoculates:
            raise ValueError('Not enough room for the number of innoculates requested')

        # Figure up the minimum and maximum places where the microbe can even be placed
        min_x = int(self.center_x - self.dish_radius)
        min_y = int(self.center_y - self.dish_radius)
        max_x = int(self.center_x + self.dish_radius)
        max_y = int(self.center_y + self.dish_radius)

        coordinates = set()
        init_population = []

        while len(coordinates) < self.num_innoculates:
            # Generate random coordinates
            x = random.randint(min_x, max_x)
            y = random.randint(min_y, max_y)

            # If we have already used this x,y coordinate, or if it lies outside the dish, ignore
            if (x, y) in coordinates or not _in_circle(x, y, self.center_x, self.center_y, self.dish_radius):
                continue

            coordinates.add((x, y))
            init_population.append([x, y, self.initial_pop_num])

        return init_population

    def get_barrier(self) -> list[list[float]]:
        barrier = []

        for x in range(self.width):
            for y in range(self.height):
                if not _in_circle(x, y, self.center_x, self.center_y, self.dish_radius):
                    barrier.append((x,y))

        return barrier

    def get_grid_size(self) -> list[int]:
        return [self.width, self.height]


def layout_factory(layout_type: LayoutType, width: int,
                   height: int, drop_radius: float, dish_radius: float, num_innoculates: int) -> LayoutMaker:
    if layout_type == PETRI_CENTER:
        return PetriDishCenter(width, height, drop_radius, dish_radius)
    elif layout_type == PETRI_RANDOM:
        return PetriDishRandom(width, height, num_innoculates, dish_radius)
    elif layout_type == TEST_TUBE:
        return TestTubeMaker()
    else:
        raise ValueError(f'Layout {layout_type} not supported')
