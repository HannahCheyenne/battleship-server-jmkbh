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
  return 1 / (1 + Math.pow(Math.E, -t));
}

class NeuralNetwork {
  constructor(x, y) {
    this.input = x;
    this.width = x._data.length;
    this.length = x._data[0].length;
    this.weights1 = math.matrix(randomizeArray(this.width, this.length));
    this.weights2 = math.matrix(randomizeArray(1, this.width));
    this.y = y;
    this.output = math.matrix(zeroes(this.length, this.width));
  }

  feedforward() {
    this.layer1 = math.multiply(this.input, this.weights1);
    this.output = math.multiply(this.layer1, this.weights2);
  }

  backprop() {
    // # application of the chain rule to find derivative of the loss function with respect to weights2 and weights1
    d_weights2 = np.dot(
      this.layer1.T,
      2 * (this.y - this.output) * sigmoid_derivative(this.output)
    );
    d_weights1 = np.dot(
      this.input.T,
      np.dot(
        2 * (this.y - this.output) * sigmoid_derivative(this.output),
        this.weights2.T
      ) * sigmoid_derivative(this.layer1)
    );

    // # update the weights with the derivative (slope) of the loss function
    this.weights1 += d_weights1;
    this.weights2 += d_weights2;
  }
}

function main() {
  let input = math.matrix([
    [1, 2],
    [3, 4],
    [6, 6],
  ]);
  let output = [
    [1, 1],
    [2, 2],
    [3, 3],
  ];
  let brain = new NeuralNetwork(input, output);

  console.log("");
  console.log(
    "SUMMARY: -----------------------------------------------------------"
  );
  console.log("Input layer:", brain.input._data);
  console.log("weights 1:", brain.weights1._data);
  console.log("weights 2:", brain.weights2._data);
  console.log("y:", brain.input._data);
  console.log("output?", brain.output._data);
  console.log(
    "END SUMMARY: ------------------------------------------------------------"
  );

  brain.feedforward();

  console.log("");
  console.log(
    "SUMMARY after feed forward: ----------------------------------------------"
  );
  console.log("Input layer:", brain.input._data);
  console.log("weights 1:", brain.weights1._data);
  console.log("weights 2:", brain.weights2._data);
  console.log("y:", brain.input._data);
  console.log("output?", brain.output._data);
  console.log("layer1: ", brain.layer1._data);
  console.log(
    "END SUMMARY: -----------------------------------------------------------"
  );

  console.log("");
}

main();
