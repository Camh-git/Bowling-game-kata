import { ballResult, parseBallResult } from "./types/ballResult";
type frameScore = [ballResult, ballResult];

export function playBall(remainingPins: number): number {
  return Math.random() * (remainingPins + 1);
}
export interface playFrameTestingOverRide {
  //Allows you to overwrite the random numbers so that playFrame can be tested
  ballScores?: Array<number>;
}
export function playFrame(overRide: playFrameTestingOverRide): frameScore {
  //setup our frame and run the first round
  let frameResult: frameScore = [0, 0];
  let pinsRemaining = 10 - playBall(10);
  if (overRide.ballScores) {
    //using the testing override
    frameResult[0] = parseBallResult(overRide.ballScores[0]);
    pinsRemaining = 10 - overRide.ballScores[0];
  } else {
    //running normaly
    frameResult[0] = parseBallResult(10 - pinsRemaining);
  }
  console.log(`remaining pins: ${pinsRemaining}<<<<<<<<<<<<<<<<<<<<<<`);
  //play a second ball if you didn't get a strike
  if (pinsRemaining > 0) {
    if (overRide.ballScores) {
      //using the testing override
      pinsRemaining = pinsRemaining - overRide.ballScores[1];
    } else {
      pinsRemaining = pinsRemaining - playBall(pinsRemaining);
    }

    //check for spare
    if (typeof frameResult[0] == "number") {
      //This is just to make sure that TS knows frameResult[0] is an int when we try to do math with it
      if (pinsRemaining === 0) {
        frameResult[1] = "spare";
      } else {
        frameResult[1] = parseBallResult(10 - frameResult[0] - pinsRemaining);
      }
    } else {
      //set ball 2 to 0 if you got a strike
      frameResult[1] = 0;
    }
  }

  return frameResult;
}

export function calculateScore(frames: Array<frameScore>) {}
