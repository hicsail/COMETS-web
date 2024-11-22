import { LayoutType, MetaboliteType, ModelName } from "../graphql/graphql";


export const getLayoutName = (type: LayoutType) => {
  switch (type) {
    case LayoutType.PetriCenter:
      return '3 cm Petri Dish (Center Colony)';
    case LayoutType.PetriRandom:
      return '3 cm Petri Dish (Random Lawn)';
    case LayoutType.TestTube:
      return 'Test Tube';
    default:
      throw Error(`Unknown layout type ${type}`);
  }
};

export const getMetaboliteName = (type: MetaboliteType) => {
  switch (type) {
    case MetaboliteType.Rich:
      return 'Rich';
    case MetaboliteType.Glucose:
      return 'Glucose';
    case MetaboliteType.Acetate:
      return 'Acetate';
    default:
      throw Error(`Unknown metabolite type: ${type}`);
  }
};

export const getModelName = (name: ModelName) => {
  switch (name) {
    case ModelName.EColi:
      return 'Escherichia coli Core';
    case ModelName.Nitrobacter:
      return 'Nitrobacter winogradskyi';
    case ModelName.Nitrosomonas:
      return 'Nitrosomonas europaea';
    default:
      throw new Error(`Unknown model name: ${name}`);
  }
};
