import { Ball, Game, RedCount, TotalColouredValues } from "./index";
import { potReds } from "./utils";

describe("Snooker game", () => {
  let game: Game;
  const player1 = "player1";
  const player2 = "player2";

  beforeEach(() => {
    game = new Game(player1, player2);
  });

  describe("currentPlayer", () => {
    it("player1 always starts", () => {
      expect(game.currentPlayer).toBe(player1);
    });

    it("player1 continues to play after a pot", () => {
      game.pot(Ball.Red);
      expect(game.currentPlayer).toBe(player1);
    });

    it("is player2 turn if player1 misses", () => {
      game.miss();
      expect(game.currentPlayer).toBe(player2);
    });

    it("is player2 turn if player1 makes a foul", () => {
      game.foul();
      expect(game.currentPlayer).toBe(player2);
    });

    it.todo("is player1 turns if player1 makes a foul and needs to replay");
  });

  describe("foul", () => {
    it("gives your opponent 4 points", () => {
      game.foul();
      expect(game.getScore(player2)).toBe(4);
    });

    it.todo("your oppononent can ask you to attempt again up to 3 times");
  });

  describe("pot", () => {
    it.each([
      Ball.Red,
      Ball.Yellow,
      Ball.Green,
      Ball.Brown,
      Ball.Blue,
      Ball.Pink,
      Ball.Black,
    ])("increments the score by %s", (ball: Ball) => {
      if (ball > Ball.Red) {
        game.pot(Ball.Red);
        game.pot(ball);
        expect(game.getScore(player1)).toBe(ball + Ball.Red);
      } else {
        game.pot(Ball.Red);
        expect(game.getScore(player1)).toBe(Ball.Red);
      }
    });

    it.todo("checks you start your turn by potting a red");

    it.todo("forces you to alternate pottinh a red and a coloured ball");

    it.todo("does not let you pot a red after the 15th one has been potted");
  });

  describe("red remaining", () => {
    it("starts the game with 15 red remaining", () => {
      expect(game.redRemaining).toBe(15);
      potReds(game, RedCount, expect);
      expect(game.redRemaining).toBe(0);
    });
  });

  describe("color remaining", () => {
    it.todo(
      "tracks the remaining coloured balls once all the red have been potted"
    );
  });

  describe("remaining score", () => {
    it("knows there's 147 points", () => {
      expect(game.pointsRemaining).toBe(147);
    });

    it.todo("decrements the remaining points");

    it("counts the remaining total after all reds have been potted", () => {
      potReds(game, RedCount, expect);

      // Careful of the special case where there's no red remaining and the last
      // potted colour is black
      // it can either mean an end of game, or that it's the colour potted right
      // after the last red has been potted
      expect(game.pointsRemaining).toBe(TotalColouredValues); // currently fails and returns 0

      game.pot(Ball.Yellow);
      expect(game.pointsRemaining).toBe(TotalColouredValues - Ball.Yellow);
    });
  });

  describe("break", () => {
    it("counts the current break", () => {
      game.pot(Ball.Red);
      game.pot(Ball.Pink);
      game.pot(Ball.Red);

      expect(game.getCurrentBreak()).toBe(8);
    });

    it.skip("resets the break when you foul", () => {
      game.pot(Ball.Red);
      game.foul();
      expect(game.getCurrentBreak()).toBe(0);
    });

    it.skip("resets the break when you miss", () => {
      game.pot(Ball.Red);
      game.foul();
      expect(game.getCurrentBreak()).toBe(0);
    });
  });

  describe("end game", () => {
    it.todo("finds the winner to be the last one to pot the black");

    it.todo("lets a player concede");

    it.todo("forces you to pot the balls in correct order to finish the game");
  });
});
