export const complexityFunctions = {
  "O(1)": (n) => 1,

  "O(log n)": (n) => Math.log2(n),

  "O(n)": (n) => n,

  "O(n log n)": (n) => n * Math.log2(n),

  "O(n²)": (n) => n * n,

  "O(n³)": (n) => n * n * n,

  "O(2ⁿ)": (n) => Math.pow(2, n / 5),
};

export const generateComplexityData = (maxN = 100) => {
  const data = [];

  for (let n = 1; n <= maxN; n += 1) {
    data.push({
      n,
      "O(1)": complexityFunctions["O(1)"](n),
      "O(log n)": complexityFunctions["O(log n)"](n),
      "O(n)": complexityFunctions["O(n)"](n),
      "O(n log n)": complexityFunctions["O(n log n)"](n),
      "O(n²)": complexityFunctions["O(n²)"](n),
      "O(n³)": complexityFunctions["O(n³)"](n),
      "O(2ⁿ)": complexityFunctions["O(2ⁿ)"](n),
    });
  }

  return data;
};