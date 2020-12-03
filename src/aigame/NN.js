const math = require("mathjs");

function zeroes(x, y) {
  let zeroed = [];
  for (let i = 0; i < y; i++) {
    let tempArray = [];
    for (let j = 0; j < x; j++) {
      tempArray.push(0);
    }
    zeroed.push(tempArray);
  }
  return zeroed;
}

function randomizeArray(x, y) {
  let output = zeroes(x, y);
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      output[i][j] = Math.random();
    }
  }
  return output;
}

function sigmoid(arr) {
  for (let i = 0; i < arr._data.length; i++) {
    for (let j = 0; j < arr._data[0].length; j++) {
      arr._data[i][j] = 1 / (1 + Math.pow(Math.E, -arr._data[i][j]));
    }
  }
  return arr;
}

function sigmoid_derivative(arr) {
  for (let i = 0; i < arr._data.length; i++) {
    for (let j = 0; j < arr._data[0].length; j++) {
      arr._data[i][j] = arr._data[i][j] * (1 - arr._data[i][j]);
    }
  }
  return arr;
}

function display(nn) {
  console.log("");

  console.log("SUMMARY: ----------------------------------------------");
  console.log("Input layer:", nn.input._data[0]);
  console.log("weights 1:", nn.weights1._data[0]);
  console.log("layer1: ", nn.layer1._data[0]);
  console.log("layer2: ", nn.layer2._data[0]);
  console.log("weights 2:", nn.weights2._data[0]);
  console.log("output?", nn.output._data[0]);
  console.log(
    "END SUMMARY: -----------------------------------------------------------"
  );
  console.log("");
}
class NeuralNetwork {
  constructor(x, y) {
    this.input = x;
    this.width = x._data.length;
    this.length = x._data[0].length;
    this.weights1 = math.matrix(randomizeArray(this.width, this.length));
    this.weights2 = math.matrix(randomizeArray(this.length, this.width));
    this.y = y;
    this.output = math.matrix(zeroes(this.length, this.width));
  }

  feedforward() {
    this.layer1 = sigmoid(math.multiply(this.input, this.weights1));
    console.log("🚀 ~ file: NN.js ~ line 140 ~ NeuralNetwork ~ feedforward ~ this.layer1", this.layer1)
    this.layer2 = sigmoid(math.multiply(this.layer1, this.weights2));
    return this.layer2;
  }

  train() {
    this.output = this.feedforward();
    this.backprop();
  }

  backprop() {
    // # application of the chain rule to find derivative of the loss function with respect to weights2 and weights1

    console.log("sigmoid derivative", sigmoid_derivative(this.output));

    let d_weights2 = math.multiply(
      math.transpose(this.layer1),
      math.multiply(
        math.multiply(2, math.subtract(this.y, this.output)),
        sigmoid_derivative(this.output)
      )
    );

    let d_weights1 = math.multiply(
      math.transpose(this.input),
      math.multiply(
        math.multiply(
          math.multiply(
            math.multiply(2, math.subtract(this.y, this.output)),
            sigmoid_derivative(this.output)
          ),
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
  let input = math.matrix([
    [0, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  let output = math.matrix([
    [1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  let brain = new NeuralNetwork(input, output);

  for (let loop = 0; loop < 1; loop++) {
    brain.train();
    if (loop % 1000 === 0) {
    
      console.log("Iteration ", loop);
      display(brain);
    }
  }
}

main();
