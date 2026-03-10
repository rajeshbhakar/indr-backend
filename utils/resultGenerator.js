function generateResult() {

  const number = Math.floor(Math.random() * 10);

  let color;

  if (number === 0 || number === 5) {
    color = "violet";
  } else if (number % 2 === 0) {
    color = "red";
  } else {
    color = "green";
  }

  return {
    number,
    color
  };
}

module.exports = generateResult;