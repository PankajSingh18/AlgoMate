import React from "react";

const CountingSortCodeBlock = () => {
  const code = {
    javascript: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  const output = new Array(arr.length);

  arr.forEach((value) => {
    count[value] += 1;
  });

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    const value = arr[i];
    output[count[value] - 1] = value;
    count[value] -= 1;
  }

  return output;
}
`,
    python: `def counting_sort(arr):
    if not arr:
        return []

    maximum = max(arr)
    count = [0] * (maximum + 1)
    output = [0] * len(arr)

    for value in arr:
        count[value] += 1

    for i in range(1, len(count)):
        count[i] += count[i - 1]

    for value in reversed(arr):
        output[count[value] - 1] = value
        count[value] -= 1

    return output
`,
    java: `public static int[] countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().orElse(0);
    int[] count = new int[max + 1];
    int[] output = new int[arr.length];

    for (int value : arr) {
        count[value]++;
    }

    for (int i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    for (int i = arr.length - 1; i >= 0; i--) {
        int value = arr[i];
        output[count[value] - 1] = value;
        count[value]--;
    }

    return output;
}
`,
  };

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Counting Sort Code Example</h2>
      <div className="space-y-6">
        {Object.entries(code).map(([lang, snippet]) => (
          <div key={lang}>
            <h3 className="text-lg font-medium mb-2 capitalize">{lang}</h3>
            <pre className="rounded-lg bg-[#f5f7ff] dark:bg-[#111827] p-4 overflow-x-auto text-xs sm:text-sm text-[#0f172a] dark:text-[#e5e7eb]">
              <code>{snippet}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountingSortCodeBlock;
