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
  let newArr = math.clone(arr)
  for (let i = 0; i < newArr._data.length; i++) {
    for (let j = 0; j < newArr._data[0].length; j++) {
      newArr._data[i][j] = 1 / (1 + Math.exp(-arr._data[i][j] / 10));
    }
  }
  return newArr;
}

function sigmoid_derivative(arr) {

  let newArr = math.clone(arr)
  for (let i = 0; i < newArr._data.length; i++) {
    for (let j = 0; j < newArr._data[0].length; j++) {
      newArr._data[i][j] = arr._data[i][j] * (1 - arr._data[i][j]);
    }
  }
  return newArr;
}

function double(arr) {
  for (let i = 0; i < arr._data.length; i++) {
    for (let j = 0; j < arr._data[0].length; j++) {
      arr._data[i][j] *= 2;
    }
  }
  return arr;
}

function times(arr1, arr2) {
  let newArr = math.clone(arr1);
  for (let i = 0; i < newArr._data.length; i++) {
    for (let j = 0; j < newArr._data[0].length; j++) {
      newArr._data[i][j] = arr1._data[i][j] * arr2._data[i][j];
    }
  }
  return newArr;
}

function display(nn) {
  console.log("");

  console.log("SUMMARY: ----------------------------------------------");
  console.log("Input layer:", nn.input._data);
  console.log("weights 1:", nn.weights1._data[0]);
  console.log("layer1: ", nn.layer1._data[0]);
  console.log("weights 2:", nn.weights2._data[0]);
  console.log("Target output:", nn.y._data);
  console.log("actual output:", nn.output._data);
  console.log(
    "END SUMMARY: -----------------------------------------------------------"
  );
  console.log("");
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
    this.output = math.matrix(zeroes(this.length, 1));
  }

  feedforward() {
    this.layer1 = sigmoid(math.multiply(this.input, this.weights1));
    this.output = sigmoid(math.multiply(this.layer1, this.weights2));
    //return this.layer2;
  }

  train() {
    //this.output =
    this.feedforward();
    this.backprop();
  }

  backprop() {
    // # application of the chain rule to find derivative of the loss function with respect to weights2 and weights1
    let loss = double(math.subtract(this.y, this.output));
    console.log("🚀 ~  y", this.y._data);
    console.log("🚀 ~  output", this.output._data);
    
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
            console.log("🚀 ~  output", this.output._data);
  }
}


function main() {
  let input = math.matrix([
    [0, 1, 1],
    [1, 1, 1],
    [0, 0, 1],
  ]);
  let output = math.matrix([
    [1, 0, 0],
    [0, 0, 0],
    [1, 1, 0],
  ]);

  let brain = new NeuralNetwork(input, output);

  brain.feedforward();

  console.log("NN initialized:");
  display(brain);

  for (let loop = 0; loop < 601; loop++) {
    brain.train();
    if (loop % 5 === 0) {
      console.log("Iteration: ", loop);
      console.log("brain: ", brain.output._data);
      display(brain);
    }
  }
}

main();
