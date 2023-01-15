import { Ball, Frame, RedCount, TotalColouredValues } from "./index";
import { potReds } from "./utils";

describe("Snooker frame", () => {
  let frame: Frame;
  const player1 = "player1";
  const player2 = "player2";

  beforeEach(() => {
    frame = new Frame(player1, player2);
  });

  describe("currentPlayer", () => {
    it("player1 always starts", () => {
      expect(frame.currentPlayer).toBe(player1);
    });

    it("player1 continues to play after a pot", () => {
      frame.pot(Ball.Red);
      expect(frame.currentPlayer).toBe(player1);
    });

    it("is player2 turn if player1 misses", () => {
      frame.miss();
      expect(frame.currentPlayer).toBe(player2);
    });

    it("is player2 turn if player1 makes a foul", () => {
      frame.foul();
      frame.foulContinue();
      expect(frame.currentPlayer).toBe(player2);
    });

    it("is player1 turns if player1 makes a foul and needs to replay", () => {
      frame.foul();
      frame.foulReplay();
      expect(frame.currentPlayer).toBe(player1);
    });
  });

  describe("foul", () => {
    it("gives your opponent 4 points", () => {
      frame.foul();
      expect(frame.getScore(player2)).toBe(4);
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
        frame.pot(Ball.Red);
        frame.pot(ball);
        expect(frame.getScore(player1)).toBe(ball + Ball.Red);
      } else {
        frame.pot(Ball.Red);
        expect(frame.getScore(player1)).toBe(Ball.Red);
      }
    });

    it.todo("checks you start your turn by potting a red");

    it.todo("forces you to alternate pottinh a red and a coloured ball");

    it.todo("does not let you pot a red after the 15th one has been potted");
  });

  describe("red remaining", () => {
    it("starts the frame with 15 red remaining", () => {
      expect(frame.redRemaining).toBe(15);
      potReds(frame, RedCount, expect);
      expect(frame.redRemaining).toBe(0);
    });
  });

  describe("remaining score", () => {
    it("knows there's 147 points", () => {
      expect(frame.pointsRemaining).toBe(147);
    });

    it.todo("decrements the remaining points");

    it("counts the remaining total after all reds have been potted", () => {
      potReds(frame, RedCount, expect);

      // Careful of the special case where there's no red remaining and the last
      // potted colour is black
      // it can either mean an end of frame, or that it's the colour potted right
      // after the last red has been potted
      expect(frame.pointsRemaining).toBe(TotalColouredValues); // currently fails and returns 0

      frame.pot(Ball.Yellow);
      expect(frame.pointsRemaining).toBe(TotalColouredValues - Ball.Yellow);
    });

    it.todo(
      "counts an extra black if the score is a tie when the last black is potted"
    );
  });

  describe("break", () => {
    it("counts the current break", () => {
      frame.pot(Ball.Red);
      frame.pot(Ball.Pink);
      frame.pot(Ball.Red);

      expect(frame.getCurrentBreak()).toBe(8);
    });

    it("resets the break when you foul", () => {
      frame.pot(Ball.Red);
      frame.foul();
      expect(frame.getCurrentBreak()).toBe(0);
    });

    it("resets the break when you miss", () => {
      frame.pot(Ball.Red);
      frame.foul();
      expect(frame.getCurrentBreak()).toBe(0);
    });
  });

  describe("end frame", () => {
    it.todo("finds the winner to be the last one to pot the black");

    it.todo("lets a player concede");

    it.todo("forces you to pot the balls in correct order to finish the frame");
  });

  describe("winner", () => {
    it.todo("player1 wins");

    it.todo("player1 wins but player2 pots the last ball");

    it.todo("player1 wins because player2 conceded");
  });
});
