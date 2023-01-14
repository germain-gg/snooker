import { Ball, Game } from "./index";

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
});
