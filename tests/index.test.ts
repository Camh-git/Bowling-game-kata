import {
  calculateScore,
  playFrame,
  frameScore,
  autoPlay,
  playFrameTestingOverRide,
} from "../src/bowling";
import "jest";

describe("Test playing a frame", () => {
  let frameOverride: playFrameTestingOverRide = { scores: [10, 0] };
  let ballOverRide: number = 99;
  test("Test high and low scores", () => {
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual(["strike", 0]);
    frameOverride.scores = [2, 8];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([2, "spare"]);
    frameOverride.scores = [0, 0];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([0, 0]);
  });
  test("Test a variety of more normal scores", () => {
    frameOverride.scores = [1, 0];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([1, 0]);
    frameOverride.scores = [0, 1];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([0, 1]);
    frameOverride.scores = [4, 3];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([4, 3]);
    frameOverride.scores = [2, 6];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([2, 6]);
    frameOverride.scores = [5, 3];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([5, 3]);
    frameOverride.scores = [2, 2];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([2, 2]);
    frameOverride.scores = [7, 1];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([7, 1]);
  });
});

describe("Test play frame edge cases", () => {
  let frameOverride: playFrameTestingOverRide = { scores: [0, 0] };
  let ballOverRide: number = 99;
  test("Dont allow negatives (in either postion) ", () => {
    frameOverride.scores = [-1, 0];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([0, 0]);
    frameOverride.scores = [0, -1];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([0, 0]);
  });

  test("Dont allow values that total to greater than 10", () => {
    frameOverride.scores = [11, 0];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([0, 0]);
    frameOverride.scores = [0, 11];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([0, 0]);
    frameOverride.scores = [5, 6];
    expect(playFrame(frameOverride, ballOverRide)).toStrictEqual([0, 0]);
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
  let frameOverRide: playFrameTestingOverRide = { scores: [10, 0] };
  let ballOverRide: Array<number> = [99]; //TODO: change this array back into a single num if you choose not to use this approach
  //default total: 75
  test("Check a set of scores with no spares or strikes", () => {
    expect(calculateScore(testResults, ballOverRide)).toBe(75);
    (testResults[0][1] = 7), (testResults[3][1] = 7);
    expect(calculateScore(testResults, ballOverRide)).toBe(85);
    testResults[0][1] = 3;
    expect(calculateScore(testResults, ballOverRide)).toBe(81);
    (testResults[0][1] = 2), (testResults[3][1] = 2);
  });
  test("Check strikes", () => {
    //first make sure that testResults is back to default
    expect(calculateScore(testResults, ballOverRide)).toBe(75);
    testResults[0] = ["strike", 0];
    expect(calculateScore(testResults, ballOverRide)).toBe(91); //75 + the 7 we added to frame 1 + the 9 we scored in frame 2(strike bonus)
    testResults[1] = [2, 2];
    expect(calculateScore(testResults, ballOverRide)).toBe(81); //75 + the 7 we added to frame 1 + strike bonus of 4 - the 5 we took from frame 2
    testResults[1] = [5, 3];
    expect(calculateScore(testResults, ballOverRide)).toBe(89); //75 + the 7 we added to frame 1 + strike bonus of 8  - the 1 we took from frame 2
    //return the array to the default
    testResults[0] = [1, 2];
    testResults[0] = [2, 7];
  });
  test("Check spares", () => {
    //first make sure that testResults is back to default
    expect(calculateScore(testResults, ballOverRide)).toBe(75);
    testResults[0] = [5, "spare"];
    expect(calculateScore(testResults, ballOverRide)).toBe(84); //75 + the 7 we added to frame 1 + the 2 from frame 2 ball 1
    testResults[1] = [7, 2];
    expect(calculateScore(testResults, ballOverRide)).toBe(89); //75 + the 7 we added to frame 1 + the 7 from frame 2 ball 1
    //return the array to the default
    testResults[0] = [1, 2];
    testResults[1] = [2, 7];
  });
  test("Test games ending in strikes", () => {
    //first make sure that testResults is back to default
    expect(calculateScore(testResults, ballOverRide)).toBe(75);
    testResults[9] = ["strike", 0];
    ballOverRide = [2, 3];
    expect(calculateScore(testResults, ballOverRide)).toBe(90); //70 from the first 9 frames + 10 from the final frame + 10 from strike bonus
    //get a strike with the bonus ball
    ballOverRide = [10, 5];
    expect(calculateScore(testResults, ballOverRide)).toBe(110); //70 from the first 9 frames + 10 from final frame + 30 from strike bonus
    //return the array to the default
    testResults[9] = [0, 5];
  });
  test("Test games ending in spares", () => {
    //first make sure that testResults is back to default
    expect(calculateScore(testResults, ballOverRide)).toBe(75);
    testResults[9] = [5, "spare"];
    expect(calculateScore(testResults, [5])).toBe(85); //75 + 5 from bonus ball override + the 5 we added to frame 9
    expect(calculateScore(testResults, [9])).toBe(89); //75 + 9 from bonus ball override + the 5 we added to frame 9
    //return the array to the default
    testResults[9] = [0, 5];
  });
});

describe("Test calculate score edge cases", () => {
  //ensure that it only runs with exactly 10 frames
  //return 0 if any of the frames has a total greater than 10, or a ball less than 0
  //strike and spare in same frame
});

describe("Test autoplay and running a full game", () => {
  const result = autoPlay();
});
