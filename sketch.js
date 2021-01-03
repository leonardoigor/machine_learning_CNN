let video;
let videoShow;
let sizeVideo = 64
let ready = false
let pixelBrain
let label = ''
let percent = ''
let isTrained = false
let div;
let input
let predictButton
function setup () {
  createCanvas(400, 400);
  video = createCapture(VIDEO, function () { ready = true })
  videoShow = createCapture(VIDEO, function () { ready = true })
  video.size(sizeVideo, sizeVideo)
  video.hide()
  frameRate(60)
  let options = {
    inputs: [sizeVideo, sizeVideo, 4],
    task: 'imageClassification',
    // outputs: ['label'],
    debug: true,
  }
  pixelBrain = ml5.neuralNetwork(options)
  div = createDiv('').size(window.innerWidth, 80);
  divinput = createDiv('').size(window.innerWidth, 80);
  div.addClass('predict');
  divinput.addClass('input');
  div.hide()


  input = document.createElement('input')
  btn = document.createElement('button')
  predictButton = document.createElement('button')
  document.querySelector('.input').appendChild(input)
  document.querySelector('.input').appendChild(btn)
  document.querySelector('.input').appendChild(predictButton)
  input.placeholder = 'Digite o Nome da Predição'
  btn.innerHTML = 'Salvar'
  predictButton.innerHTML = 'Predict'




  btn.addEventListener('click', function () {
    label = input.value
    addExample();
  })

  predictButton.addEventListener('click', function () {
    ready = false
    pixelBrain.normalizeData()
    pixelBrain.train({ epochs: 50 }, finishedTraining);
  })

}

function draw () {
  background(0);

  // image(video, 0, 0, width, height)
  if (ready) {
    // Render the low-res image
    let w = width / sizeVideo;
    video.loadPixels();
    for (let x = 0; x < video.width; x++) {
      for (let y = 0; y < video.height; y++) {
        let index = (x + y * video.width) * 4;
        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        noStroke();
        fill(r, g, b);
        rect(x * w, y * w, w, w);
      }
    }
  }
  fill(0)
  if (isTrained) showText()
}
// text(`eu acho que é: ${label},   acerto ${(percent * 100).toFixed(0)}%`, 10, 10)
function showText () {
  div.html(`eu acho que é: ${label},   acerto ${(percent * 100).toFixed(0)}%`);
  div.show()

}
function addExample () {
  let inputs = { image: video };

  let target = { label };
  console.log('Adding example: ' + label);
  pixelBrain.addData(inputs, target);
}
// function keyPressed () {
//   if (key == 't') {
//     ready = false
//     pixelBrain.normalizeData()
//     pixelBrain.train({ epochs: 50 }, finishedTraining);
//   } else if (key == 's') {
//     pixelBrain.saveData();
//   } else {
//     addExample(key);
//   }
// }

function classifyVideo () {
  let inputs = { image: video };


  pixelBrain.classify(inputs, gotResults);
}


function gotResults (error, results) {
  if (error) {
    console.log(error);
    return;
  }
  label = results[0].label;
  percent = results[0].confidence
  classifyVideo();
}
function loaded () {
  pixelBrain.train({ epochs: 500 }, finishedTraining);
}

function finishedTraining () {
  console.log('training complete');
  isTrained = true
  ready = true
  classifyVideo();
}