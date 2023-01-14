import { Ball, Game } from ".";

export function potReds(game: Game, ballsToPot: number, expect: jest.Expect) {
  for (let i = 0; i < ballsToPot; i++) {
    game.pot(Ball.Red);
    game.pot(Ball.Black);
  }

  expect(game.getScore(game.currentPlayer)).toBe(
    ballsToPot * Ball.Red + ballsToPot * Ball.Black
  );
}
