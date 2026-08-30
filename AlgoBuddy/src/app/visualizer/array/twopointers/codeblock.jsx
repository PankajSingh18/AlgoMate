"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// 1. Pair Sum — Opposite Direction
function pairSum(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [-1, -1]; // not found
}

// 2. Remove Duplicates — Same Direction (slow/fast)
function removeDuplicates(arr) {
  if (arr.length === 0) return 0;
  let slow = 0;

  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] !== arr[slow]) {
      slow++;
      arr[slow] = arr[fast];
    }
  }
  return slow + 1; // count of unique elements
}

// 3. Container With Most Water — Opposite Direction
function maxArea(arr) {
  let left = 0, right = arr.length - 1;
  let maxWater = 0;

  while (left < right) {
    const water = Math.min(arr[left], arr[right]) * (right - left);
    maxWater = Math.max(maxWater, water);
    if (arr[left] < arr[right]) left++;
    else right--;
  }
  return maxWater;
}

// 4. Three Sum — Fixed index + Opposite Direction
function threeSum(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // skip duplicates
    let left = i + 1, right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      if (sum === 0) {
        result.push([sorted[i], sorted[left], sorted[right]]);
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,

  python: `# 1. Pair Sum — Opposite Direction
def pair_sum(arr: list[int], target: int) -> list[int]:
    left, right = 0, len(arr) - 1

    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]  # not found

# 2. Remove Duplicates — Same Direction (slow/fast)
def remove_duplicates(arr: list[int]) -> int:
    if not arr:
        return 0
    slow = 0

    for fast in range(1, len(arr)):
        if arr[fast] != arr[slow]:
            slow += 1
            arr[slow] = arr[fast]
    return slow + 1

# 3. Container With Most Water — Opposite Direction
def max_area(arr: list[int]) -> int:
    left, right = 0, len(arr) - 1
    max_water = 0

    while left < right:
        water = min(arr[left], arr[right]) * (right - left)
        max_water = max(max_water, water)
        if arr[left] < arr[right]:
            left += 1
        else:
            right -= 1
    return max_water

# 4. Three Sum — Fixed index + Opposite Direction
def three_sum(arr: list[int]) -> list[list[int]]:
    arr.sort()
    result = []

    for i in range(len(arr) - 2):
        if i > 0 and arr[i] == arr[i - 1]:
            continue  # skip duplicates
        left, right = i + 1, len(arr) - 1

        while left < right:
            s = arr[i] + arr[left] + arr[right]
            if s == 0:
                result.append([arr[i], arr[left], arr[right]])
                left += 1; right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1
    return result`,

  java: `import java.util.*;

class TwoPointers {

    // 1. Pair Sum — Opposite Direction
    public int[] pairSum(int[] arr, int target) {
        int left = 0, right = arr.length - 1;

        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) return new int[]{left, right};
            else if (sum < target) left++;
            else right--;
        }
        return new int[]{-1, -1};
    }

    // 2. Remove Duplicates — Same Direction (slow/fast)
    public int removeDuplicates(int[] arr) {
        if (arr.length == 0) return 0;
        int slow = 0;

        for (int fast = 1; fast < arr.length; fast++) {
            if (arr[fast] != arr[slow]) {
                slow++;
                arr[slow] = arr[fast];
            }
        }
        return slow + 1;
    }

    // 3. Container With Most Water — Opposite Direction
    public int maxArea(int[] arr) {
        int left = 0, right = arr.length - 1;
        int maxWater = 0;

        while (left < right) {
            int water = Math.min(arr[left], arr[right]) * (right - left);
            maxWater = Math.max(maxWater, water);
            if (arr[left] < arr[right]) left++;
            else right--;
        }
        return maxWater;
    }

    // 4. Three Sum — Fixed index + Opposite Direction
    public List<List<Integer>> threeSum(int[] arr) {
        Arrays.sort(arr);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < arr.length - 2; i++) {
            if (i > 0 && arr[i] == arr[i - 1]) continue;
            int left = i + 1, right = arr.length - 1;

            while (left < right) {
                int sum = arr[i] + arr[left] + arr[right];
                if (sum == 0) {
                    result.add(Arrays.asList(arr[i], arr[left], arr[right]));
                    left++; right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return result;
    }
}`,

  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 1. Pair Sum — Opposite Direction
vector<int> pairSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {-1, -1};
}

// 2. Remove Duplicates — Same Direction (slow/fast)
int removeDuplicates(vector<int>& arr) {
    if (arr.empty()) return 0;
    int slow = 0;

    for (int fast = 1; fast < arr.size(); fast++) {
        if (arr[fast] != arr[slow]) {
            slow++;
            arr[slow] = arr[fast];
        }
    }
    return slow + 1;
}

// 3. Container With Most Water — Opposite Direction
int maxArea(vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    int maxWater = 0;

    while (left < right) {
        int water = min(arr[left], arr[right]) * (right - left);
        maxWater = max(maxWater, water);
        if (arr[left] < arr[right]) left++;
        else right--;
    }
    return maxWater;
}

// 4. Three Sum — Fixed index + Opposite Direction
vector<vector<int>> threeSum(vector<int>& arr) {
    sort(arr.begin(), arr.end());
    vector<vector<int>> result;

    for (int i = 0; i < (int)arr.size() - 2; i++) {
        if (i > 0 && arr[i] == arr[i - 1]) continue;
        int left = i + 1, right = arr.size() - 1;

        while (left < right) {
            int sum = arr[i] + arr[left] + arr[right];
            if (sum == 0) {
                result.push_back({arr[i], arr[left], arr[right]});
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}`
};

const fileNames = {
  javascript: "twoPointers.js",
  python: "two_pointers.py",
  java: "TwoPointers.java",
  cpp: "two_pointers.cpp",
};

const Code = () => {
  return (
    <div>
      <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
      />
    </div>
  );
};

export default Code;