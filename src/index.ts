export class Game {
  private visits: VisitResult[] = [];
  private undidVisits: VisitResult[] = [];

  /**
   * Starts the game, player1 always starts
   * @param player1 the name of player1
   * @param player2 the name of player2
   */
  constructor(public player1: string, public player2: string) {}

  /**
   * Returns who the current player is
   */
  public get currentPlayer(): string {
    const lastVisit = this.visits.at(-1);
    if (!lastVisit) {
      // Player 1 always starts
      return this.player1;
    } else if (
      lastVisit.outcome === "pot" ||
      lastVisit.outcome === "foulContinue"
    ) {
      // If the player has pot a ball during the last visit
      // the same player continues to play
      return lastVisit.player;
    } else {
      // A miss or a foul means that it is the other player's turn
      return this.getOppositePlayer(lastVisit.player);
    }
  }

  private getOppositePlayer(player: string) {
    return player === this.player1 ? this.player2 : this.player1;
  }

  /**
   * Generic function to add one action taken during a game of snooker
   * @param visit the action that occured during the frame
   */
  private addVisit(visit: Partial<VisitResult>): void {
    this.visits = [
      ...this.visits,
      {
        outcome: "miss", // will always be overriden
        value: 0,
        player: this.currentPlayer,
        ...visit,
      },
    ];
    this.resetUndidVisits();
  }

  /**
   * Current player successfully potted a ball
   * @param ball the ball potted
   */
  public pot(ball: Ball): void {
    this.addVisit({
      outcome: "pot",
      value: ball,
    });
  }

  /**
   * Current player missed a ball
   */
  public miss(): void {
    this.addVisit({
      outcome: "miss",
    });
  }

  /**
   * Current player made a foul
   */
  public foul(): void {
    this.addVisit({
      outcome: "foul",
      value: FoulValue,
    });
  }

  /**
   * The opponent asks the player who made to foul to make another attempt
   */
  public foulReplay(): void {
    this.addVisit({
      outcome: "foulReplay",
    });
  }

  /**
   * The opponent decides to take the shot after a player has fouled
   */
  public foulContinue(): void {
    this.addVisit({
      outcome: "foulContinue",
    });
  }

  /**
   * A player decides to concede
   */
  public concede(player: string) {
    // TODO: Add a check that `player` matches the name of a player

    this.addVisit({
      outcome: "concede",
      player: player,
    });
  }

  /**
   * Undo the last action
   */
  public undo(): void {
    const [visitDeleted] = this.visits.splice(0, -1);
    if (visitDeleted) {
      this.undidVisits = [...this.undidVisits, visitDeleted];
    }
  }

  /**
   * Redo an action. The array of possible actions to replay are reset
   * every time a new "pot", "foul" or "miss" visit is played
   */
  public redo(): void {
    const [visitToAdd] = this.undidVisits.splice(0, -1);
    if (visitToAdd) {
      this.visits = [...this.visits, visitToAdd];
    }
  }

  private resetUndidVisits(): void {
    this.undidVisits = [];
  }

  /**
   * Gets the player's score
   * @param player the player name
   * @returns the player's score
   */
  public getScore(player: string): number {
    return this.visits.reduce((score: number, visit: VisitResult) => {
      const isOwnAction = visit.player === player && visit.outcome !== "foul";
      const opponentFoul = visit.player !== player && visit.outcome === "foul";
      if (isOwnAction || opponentFoul) {
        return score + visit.value;
      } else {
        return score;
      }
    }, 0);
  }

  /**
   * Calculates the break score for the current player
   * @returns the break
   */
  public getCurrentBreak(): number {
    let currentBreak = 0;
    for (let i = this.visits.length - 1; i >= 0; i--) {
      const visit = this.visits[i]!;
      if (visit.player !== this.currentPlayer || visit.outcome !== "pot") {
        return currentBreak;
      }

      currentBreak += visit.value;
    }
    return currentBreak;
  }

  /**
   * Determines the amount of red still possible to pot
   */
  public get redRemaining(): number {
    return (
      RedCount -
      this.visits.reduce((pottedRedCount, visit) => {
        return visit.value === Ball.Red ? pottedRedCount + 1 : pottedRedCount;
      }, 0)
    );
  }

  /**
   * Score difference between the two players.
   * A positive value means player1 is ahead of player2
   * A negative value means player2 is ahead of player1
   */
  public get scoreDifference(): number {
    return this.getScore(this.player1) - this.getScore(this.player2);
  }

  /**
   * Calculates the highest possible remaining score
   * @returns the highest possible remaining score
   */
  public get pointsRemaining(): number {
    if (this.redRemaining > 0) {
      return (
        this.redRemaining + this.redRemaining * Ball.Black + TotalColouredValues
      );
    } else {
      for (let i = this.visits.length - 1; i > 0; i--) {
        const visit = this.visits[i]!;
        const previousVisit = this.visits[i - 1]!;

        // if there are no more reds in play, make sure that the colour potted
        // was done as a consecutive shot to the last red being potted.
        // If that's the case, all colours are still in play
        if (
          previousVisit.value === Ball.Red &&
          previousVisit.player === visit.player
        ) {
          return TotalColouredValues;
        }

        // Otherwise we find the value of the last potted ball, and add all
        // remaining ball values up until 7 (the value of the black ball)
        if (visit.outcome === "pot") {
          let remaining = 0;
          for (let j = visit.value + 1; j <= Ball.Black; j++) {
            remaining += j;
          }
          return remaining;
        }
      }
    }

    return 0;
  }

  /**
   * Finds who the winner is, returns null if the frame is unsettled
   */
  public get winner(): string | null {
    const lastVisit = this.visits.at(-1);
    if (lastVisit?.outcome === "concede") {
      return this.getOppositePlayer(lastVisit.player);
    }
    if (this.pointsRemaining === 0) {
      return this.scoreDifference > 0 ? this.player1 : this.player2;
    }
    return null;
  }
}

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
