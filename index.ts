// 3 lines of magic we can ignore...!
import { Canvas } from './src/Canvas';
import { Color } from './src/Color';
import { Vec2 } from './src/Vec2';

// ------------------------------------------------------
// Click the blue circle to get a point!
// ------------------------------------------------------

const width = 500;
const height = 500;
const backgroundColor = new Color(.72, 0.85, 10);
const boardSquaresColor = new Color(.82, .9, 1);
const canvas = new Canvas(width, height);
const scoreboard = new Canvas(500, 100);
const circleRadius = 15;

function drawBaseCircles() {
  for (let i = 50; i < height; i +=50){
    for (let j = 50; j < width; j += 50){
      canvas.drawCircle(new Vec2(i, j), 15, new Color(1, .87, .64))
      canvas.drawCircle(new Vec2(i, j), 5, new Color(1, .89, .76))
    }
  }
} 

function updateScoreBoard() {
  scoreboard.clear(boardSquaresColor)
  scoreboard.drawText('Click on the random blue circle...',Color.fromHSV(.55, .3, .5), new Vec2(width/2, 20), 30, 'center');
  scoreboard.drawText('How fast can you get 50 hits?',Color.fromHSV(.55, .3, .5), new Vec2(width/2, 50), 20, 'center');
  scoreboard.drawText(`Seconds elapsed:  ${secondsPlayed}  Score:  ${hits}`, Color.fromHSV(.55, .3, .5), new Vec2(width/2, 80), 20, 'center');
}
function drawBoard(title: string) {
  canvas.clear(backgroundColor);
  for (let y = 0; y < height; y += 50) {
    for (let x = 0; x < width; x += 100) {
      let horizShift = 50 * ((y / 50) % 2);

      canvas.drawRect(
        new Vec2(x + horizShift, y),
        50,
        50,
        boardSquaresColor
      );
    }
  }
}

function drawRandomHighlightCircle() {
  let p = 1 + Math.floor(Math.random() * maxi);
  let q = 1 + Math.floor(Math.random() * maxj);
   let locationVec = new Vec2(p*50, q*50);
  canvas.drawCircle(locationVec, circleRadius, new Color(.29, .29, .55));
  canvas.drawCircle(locationVec, 5, new Color(.2, .2, .2));
  return locationVec;
}

drawBoard('Random Movement');
drawBaseCircles();

let hits = 0; 
let secondsPlayed = 0;
updateScoreBoard()

const blinkTime = 1;
const maxi = (height-50)/50;
const maxj = (width-50)/50;
let IntervalID = setInterval(() => {
  drawBaseCircles();
  let randomHighlightPoint = drawRandomHighlightCircle();
  secondsPlayed += 1;
  canvas.setClickHandler((clickPos) => {
    if (clickPos.distance(randomHighlightPoint)  <= circleRadius) {
      hits += 1;
     canvas.drawCircle(randomHighlightPoint, 12, new Color(1, .56, 0));
     canvas.drawCircle(randomHighlightPoint, 5, new Color(.2, .2, .2));
   
    }
  });

  updateScoreBoard();
  if (hits >= 50) {
     clearInterval(IntervalID);
     scoreboard.clear(boardSquaresColor);
     scoreboard.drawText(`Congrats!  You made ${hits} hits in ${secondsPlayed} seconds!`,Color.fromHSV(.55, .3, .5), new Vec2(width/2, 15), 25, 'center');
     scoreboard.drawText(`Seconds elapsed:  ${secondsPlayed}  Score:  ${hits}`, Color.fromHSV(.55, .3, .5), new Vec2(width/2, 45), 20, 'center');
   }
  },
 
  blinkTime * 1000);
