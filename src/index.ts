import { Frame } from "./frame";

export { Frame };

export type Outcome =
  | "pot"
  | "miss"
  | "foul"
  | "foulReplay"
  | "foulContinue"
  | "concede";

export enum Ball {
  Red = 1,
  Yellow = 2,
  Green = 3,
  Brown = 4,
  Blue = 5,
  Pink = 6,
  Black = 7,
}

export const FoulValue = 4;
export const RedCount = 15;

export const TotalColouredValues =
  Ball.Yellow + Ball.Green + Ball.Brown + Ball.Blue + Ball.Pink + Ball.Black;

export interface VisitResult {
  player: string;
  outcome: Outcome;
  value: number;
}
