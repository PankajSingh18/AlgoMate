export function generateSteps(n) {
  const steps = [];

  function factorial(num) {
    steps.push({ type: "call", fn: `factorial(${num})`, arg: num });

    if (num <= 1) {
      steps.push({ type: "return", fn: `factorial(${num})`, returnValue: 1 });
      return 1;
    }

    const subResult = factorial(num - 1);
    const result = num * subResult;
    steps.push({ type: "return", fn: `factorial(${num})`, returnValue: result });
    return result;
  }

  factorial(n);
  return steps;
}