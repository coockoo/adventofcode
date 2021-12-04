const sumOfItems = (array) => {
  return array.reduce((acc, i) => (acc += +i), 0);
};

module.exports.Reducer = {
  sumOfItems,
};
