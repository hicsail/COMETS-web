import { MetabolicModel } from "./Model";
import { Layout } from "./Layout";
import { Media } from "./Media";

export type SummaryCard = {
  label: string;
  desc: string;
  info: MetabolicModel | Layout | Media;
};

export interface SummaryCardArray extends Array<SummaryCard> {
  push(item: SummaryCard): number;
  push(...item: SummaryCard[]): number;
}
