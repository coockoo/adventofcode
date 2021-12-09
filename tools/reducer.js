export const sumOfItems = (array) => {
  return array.reduce((acc, i) => (acc += +i), 0);
};

export const productOfItems = (array) => {
  return array.reduce((acc, i) => (acc *= +i), 1);
};

export const countBy = (array, field) => {
  return array.reduce((acc, item) => {
    const key = field ? item[field] : item;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += 1;
    return acc;
  }, {});
};
