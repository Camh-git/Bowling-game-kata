import {
  calculateScore,
  playFrame,
  playFrameTestingOverRide,
} from "../src/bowling";
import "jest";

describe("Test playing a frame", () => {
  let override: playFrameTestingOverRide = { ballScores: [10, 0] };
  test("Test high and low scores", () => {
    expect(playFrame(override)).toStrictEqual(["strike", 0]);
    override.ballScores = [2, 8];
    expect(playFrame(override)).toStrictEqual([2, "spare"]);
    override.ballScores = [0, 0];
    expect(playFrame(override)).toStrictEqual([0, 0]);
  });
  test("Test a variety of more normal scores", () => {
    override.ballScores = [1, 0];
    expect(playFrame(override)).toStrictEqual([1, 0]);
    override.ballScores = [0, 1];
    expect(playFrame(override)).toStrictEqual([0, 1]);
    override.ballScores = [4, 3];
    expect(playFrame(override)).toStrictEqual([4, 3]);
    override.ballScores = [2, 6];
    expect(playFrame(override)).toStrictEqual([2, 6]);
  });
});

describe("Test play frame edge cases", () => {
  let override: playFrameTestingOverRide = { ballScores: [0, 0] };
  test("Dont allow negatives (in either postion) ", () => {
    override.ballScores = [-1, 0];
    expect(playFrame(override)).toStrictEqual([0, 0]);
    override.ballScores = [0, -1];
    expect(playFrame(override)).toStrictEqual([0, 0]);
  });

  test("Dont allow values greater than 10", () => {
    override.ballScores = [11, 0];
    expect(playFrame(override)).toStrictEqual([0, 0]);
    override.ballScores = [0, 11];
    expect(playFrame(override)).toStrictEqual([0, 0]);
  });

  test("Don't allow characters", () => {
    //Taken care of by TS not allowing the override or playBall to accept strings
  });
});
