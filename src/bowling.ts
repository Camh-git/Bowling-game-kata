import { isNumberObject } from "util/types";
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
  //setup the  frame and run the first round
  let pinsRemaining = 10 - playBall(10);
  if (overRide.ballScores) {
    //using the testing override
    pinsRemaining = 10 - overRide.ballScores[0];
  }
  let frameResult: frameScore = [parseBallResult(10 - pinsRemaining), 0];

  //play a second ball if you didn't get a strike
  if (pinsRemaining > 0) {
    if (overRide.ballScores) {
      //using the testing override
      pinsRemaining = pinsRemaining - overRide.ballScores[1];
    } else {
      pinsRemaining = pinsRemaining - playBall(pinsRemaining);
    }

    //check for spare
    if (typeof frameResult[0] === "number") {
      //The if is just to make sure that TS knows frameResult[0] is a number when we try to do math with it
      if (pinsRemaining === 0) {
        frameResult[1] = "spare";
      } else {
        frameResult[1] = parseBallResult(10 - frameResult[0] - pinsRemaining);
      }
    }
  }

  //If the total of the 2 balls is greater than 10 return 0(this can't happen in production since playball is limited to the number of remaining pins)
  if (
    typeof frameResult[0] === "number" &&
    typeof frameResult[1] === "number" &&
    frameResult[0] + frameResult[1] > 10
  ) {
    (frameResult[0] = 0), (frameResult[1] = 0); //This should be [0],[1]=0 but the liner keeps breaking it
  }
  return frameResult;
}

export function calculateScore(frames: Array<frameScore>): number {
  let score: number = 0;
  frames.forEach((entry) => {
    if (entry[0] === "strike") {
      //dothing
    } else if (entry[1] === "spare") {
      //dothing
    } else if (typeof entry[0] === "number" && typeof entry[1] === "number") {
      score += entry[0] + entry[1];
    } else {
      //one of the passed frames was invalid
      return 0;
    }
  });
  return score;
}

//Running the game
const noOverride: playFrameTestingOverRide = {};

function autoPlay() {
  let frames: Array<frameScore> = [];
  for (let i = 0; i < 10; i++) {
    frames.push(playFrame(noOverride));
  }
  console.log(`Game over, score: ${calculateScore(frames)}`);
}
