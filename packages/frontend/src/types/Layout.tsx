export type Layout = {
  name: string;
  desc: string;
  min: number;
  max: number;
  params: {
    [key: string]: number;
    mediaVolume: number;
  };
};
