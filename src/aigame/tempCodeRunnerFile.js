
  console.log("Input layer:", stringify(nn.input._data));
  //console.log("weights 1:", nn.weights1._data[0]);
  //console.log("layer1: ", nn.layer1._data[0]);
  //console.log("weights 2:", nn.weights2._data[0]);
  console.log("Target output:", stringify(nn.y._data));
  console.log("actual output:", stringify(nn.output._data));
  console.log(
    "END SUMMARY: -----------------------------------------------------------"
  );
  console.log("");
}

function scrubVisibleBoard(board, mask) {
  let newBoard = math.clone(board);
  let width = board._data.length;
  let length = board._data[0].length;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < length; j++) {
      if (mask[i][j] === 1) {
        if (newBoard._data[i][j] <= 4 || newBoard._data[i][j] === 8) {
          newBoard._data[i][j] = 1;
        }
        if (newBoard._data[i][j] === 7) newBoard._data[i][j] = 0;
      } else newBoard._data[i][j] = 0.5;
    }
  }

  //console.log("visibleBoard: ", newBoard._data);

  return newBoard;
}

function cloneValues(nn, input, expectedOutput) {
  let newNN = new NeuralNetwork(input, expectedOutput);
  newNN.weights1 = nn.weights1;
  newNN.weights2 = nn.weights2;
  newNN.layer1 == nn.layer1;

  display(nn);
  display(newNN);

  return newNN;
}

function scrubAnswerBoard(board) {
  let newBoard = math.clone(board);
  let width = board._data.length;
  let length = board._data[0].length;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < length; j++) {
      if (newBoard._data[i][j] <= 4 || newBoard._data[i][j] === 8) {
        newBoard._data[i][j] = 1;
      } else newBoard._data[i][j] = 0;
    }
  }

  //console.log("answerBoard: ", newBoard._data);
  return newBoard;
}

class NeuralNetwork {
  constructor(x, y) {
    this.input = x;
    this.xwidth = x._data.length;
    this.xlength = x._data[0].length;
    this.ylength = y._data.length;
    this.ywidth = y._data[0].length;
    this.weights1 = math.matrix(randomizeArray(this.xwidth, this.xlength));
    this.weights2 = math.matrix(randomizeArray(this.ywidth, this.ylength));
    this.y = y;
    this.output = math.matrix(zeroes(this.ywidth, this.ylength));
  }

  feedforward() {
    this.layer1 = sigmoid(math.multiply(this.input, this.weights1));
    this.output = sigmoid(math.multiply(this.layer1, this.weights2));
  }

  train() {
    this.feedforward();
    this.backprop();
  }

  backprop() {
    // # application of the chain rule to find derivative of the loss function with respect to weights2 and weights1
    let loss = double(math.subtract(this.y, this.output));
    let d_weights2 = math.multiply(
      math.transpose(this.layer1),
      times(loss, sigmoid_derivative(this.output))
    );

    let d_weights1 = math.multiply(
      math.transpose(this.input),
      times(
        math.multiply(
          times(loss, sigmoid_derivative(this.output)),
          math.transpose(this.weights2)
        ),
        sigmoid_derivative(this.layer1)
      )
    );
    // # update the weights with the derivative (slope) of the loss function
    this.weights1 = math.add(this.weights1, d_weights1);
    this.weights2 = math.add(this.weights2, d_weights2);
  }
}

function main() {
  let mask = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ];

  let board = math.matrix(game.generateBoard());
  let input = scrubVisibleBoard(board, mask);
  let output = scrubAnswerBoard(board);

  let brain = new NeuralNetwork(input, output);

  brain.feedforward();

  console.log("NN initialized:");
  display(brain);

  for (let loop = 0; loop < 50001; loop++) {
    board = math.matrix(game.generateBoard());
    input = scrubVisibleBoard(board, mask);
    output = scrubAnswerBoard(board);
    brain.input = input;
    brain.y = output;

    brain.train();
    if (loop % 5000 === 0) {
      console.log("Iteration: ", loop);
      display(brain);
    }
  }

  let newBoard = math.matrix(game.generateBoard());
  let visibleBoard = scrubVisibleBoard(newBoard, mask);
  let answerBoard = scrubAnswerBoard(newBoard);

  let newBrain = cloneValues(brain, visibleBoard, answerBoard);

  newBrain.train();

  console.log("****************NEWBRAIN*****************");
  display(newBrain);
}

main();
