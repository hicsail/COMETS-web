export type MetabolicModel = {
  name: string;
  desc: string;
  params: {
    [key: string]: boolean | number;
    demographicNoise: boolean;
    demographicNoiseAmplitude: number;
    uptakeVMax: number;
    uptakeKm: number;
    deathRate: number;
    biomassLinearDiffusivity: number;
    biomassNonlinearDiffusivity: number;
  };
};
