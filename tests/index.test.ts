import {
  calculateScore,
  playFrame,
  frameScore,
  autoPlay,
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
    override.ballScores = [5, 3];
    expect(playFrame(override)).toStrictEqual([5, 3]);
    override.ballScores = [2, 2];
    expect(playFrame(override)).toStrictEqual([2, 2]);
    override.ballScores = [7, 1];
    expect(playFrame(override)).toStrictEqual([7, 1]);
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

  test("Dont allow values that total to greater than 10", () => {
    override.ballScores = [11, 0];
    expect(playFrame(override)).toStrictEqual([0, 0]);
    override.ballScores = [0, 11];
    expect(playFrame(override)).toStrictEqual([0, 0]);
    override.ballScores = [5, 6];
    expect(playFrame(override)).toStrictEqual([0, 0]);
  });

  //Blocking character input is taken care of by TS not allowing the override or playBall to accept strings
});

describe("Test calculating the score", () => {
  let testResults: Array<frameScore> = [
    [1, 2],
    [2, 7],
    [3, 6],
    [4, 2],
    [5, 3],
    [6, 2],
    [7, 2],
    [8, 1],
    [9, 0],
    [0, 5],
  ];
  //default total: 75
  test("Check a set of scores with no spares or strikes", () => {
    expect(calculateScore(testResults)).toBe(75);
    (testResults[0][1] = 7), (testResults[3][1] = 7);
    expect(calculateScore(testResults)).toBe(85);
    testResults[0][1] = 3;
    expect(calculateScore(testResults)).toBe(81);
    (testResults[0][1] = 2), (testResults[3][1] = 2);
  });
  test("Check strikes", () => {
    //first make sure that testResults is back to default
    testResults[0] = [1, 2];
    expect(calculateScore(testResults)).toBe(75);
    testResults[0] = ["strike", 0];
    expect(calculateScore(testResults)).toBe(91); //75 + the 7 we added to frame 1 + the 9 we scored in frame 2(strike bonus)
    testResults[1] = [2, 2];
    expect(calculateScore(testResults)).toBe(81); //75 + the 7 we added to frame 1 + strike bonus of 4 - the 5 we took from frame 2
    testResults[1] = [5, 3];
    expect(calculateScore(testResults)).toBe(89); //75 + the 7 we added to frame 1 + strike bonus of 8  - the 1 we took from frame 2
    //return the array to the default
    testResults[0] = [1, 2];
    testResults[0] = [2, 7];
  });
  test("Check spares", () => {
    //first make sure that testResults is back to default
    testResults[0] = [1, 2];
    expect(calculateScore(testResults)).toBe(75);
    testResults[0] = [5, "spare"];
    expect(calculateScore(testResults)).toBe(84); //75 + the 7 we added to frame 1 + the 2 from frame 2 ball 1
    testResults[1] = [7, 2];
    expect(calculateScore(testResults)).toBe(89); //75 + the 7 we added to frame 1 + the 7 from frame 2 ball 1
    //return the array to the default
    testResults[0] = [1, 2];
    testResults[1] = [2, 7];
  });
  test("Test games ending in spares and strikes", () => {
    //first make sure that testResults is back to default
    testResults[0] = [1, 2];
    expect(calculateScore(testResults)).toBe(75);
    testResults[9] = ["strike", 0];
    expect(calculateScore(testResults)).toBe(90); //70 from the first 9 frames + 10 from final frame + 5 from our overwritten extra ball + 5 from strike bonus
    //get a strike with the bonus ball
    expect(calculateScore(testResults)).toBe(90); //70 from the first 9 frames + 20 from final frame(w/strike) (15 from our stike on second ball + 5 from 3rd ball)
    //Get a strike with all 3 bonus balls
    expect(calculateScore(testResults)).toBe(100); //70 from the first 9 frames + 30 for our 3 strikes on the last frame
    testResults[9] = [5, "spare"];
    expect(calculateScore(testResults)).toBe(80); //75 + 5 from bonus ball
  });
});

describe("Test calculate score edge cases", () => {
  //ensure that it only runs with exactly 10 frames
  //return 0 if any of the frame has a total greater than 10, or a ball less than 0
  //strike and spare in same frame
});

describe("Test autoplay and running a full game", () => {
  const result = autoPlay();
});
