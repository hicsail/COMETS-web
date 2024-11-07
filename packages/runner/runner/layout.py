from abc import ABC, abstractmethod


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
    def get_boundary(self) -> list[list[float]]:
        """
        Get the region of the grid where the simulation
        should not operate over
        """

class TestTubeMaker(LayoutMaker):
    def __init__(self):
        super().__init__()

    def get_initial_population(self) -> list[list[float]]:
        return [[0, 0, self.initial_pop_num]]

    def get_boundary(self) -> list[list[float]]:
        return []


class PetriDishCenter(LayoutMaker):
    def __init__(self, width: int, height: int, drop_radius: float, dish_radius: float):
        super().__init__()

        self.width = width
        self.height = height
        self.drop_radius = drop_radius
        self.dish_radius = dish_radius

    def get_initial_population(self) -> list[list[float]]:
        init_population = []

        center_x = self.width // 2
        center_y = self.height // 2

        for x in range(self.width):
            for y in range(self.height):
                if _in_circle(x, y, center_x, center_y, self.drop_radius):
                    init_population.append([x, y, 1e-6])

        return init_population


    def get_boundary(self) -> list[list[float]]:
        barrier = []

        center_x = self.width // 2
        center_y = self.height // 2

        for x in range(self.width):
            for y in range(self.height):
                if not _in_circle(x, y, center_x, center_y, self.dish_radius):
                    barrier.append((x,y))

        return barrier

