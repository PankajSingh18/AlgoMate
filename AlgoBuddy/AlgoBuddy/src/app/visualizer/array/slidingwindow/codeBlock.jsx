"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Fixed Window: Max Sum Subarray of Size K
function maxSum(arr, k) {
  let max_sum = 0, window_sum = 0;
  // Compute sum of first window
  for (let i = 0; i < k; i++) {
    window_sum += arr[i];
  }
  max_sum = window_sum;
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    window_sum += arr[i] - arr[i - k];
    max_sum = Math.max(max_sum, window_sum);
  }
  return max_sum;
}

// Variable Window: Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  let charSet = new Set();
  let left = 0, maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // If duplicate found, shrink window from left
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
  python: `# Fixed Window: Max Sum Subarray of Size K
def max_sum(arr, k):
    n = len(arr)
    if n < k: return -1
    
    # Compute sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
        
    return max_sum

# Variable Window: Longest Substring Without Repeating Characters
def length_of_longest_substring(s: str) -> int:
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        # If duplicate found, shrink window from left
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
        
    return max_length`,
  java: `import java.util.HashSet;

class SlidingWindow {
    // Fixed Window: Max Sum Subarray of Size K
    public int maxSum(int[] arr, int k) {
        int n = arr.length;
        if (n < k) return -1;
        
        int maxSum = 0, windowSum = 0;
        // Compute sum of first window
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        maxSum = windowSum;
        
        // Slide the window
        for (int i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }

    // Variable Window: Longest Substring Without Repeating Characters
    public int lengthOfLongestSubstring(String s) {
        HashSet<Character> set = new HashSet<>();
        int left = 0, maxLength = 0;
        
        for (int right = 0; right < s.length(); right++) {
            // If duplicate found, shrink window from left
            while (set.contains(s.charAt(right))) {
                set.remove(s.charAt(left));
                left++;
            }
            set.add(s.charAt(right));
            maxLength = Math.max(maxLength, right - left + 1);
        }
        return maxLength;
    }
}`,
  cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
#include <algorithm>
using namespace std;

// Fixed Window: Max Sum Subarray of Size K
int maxSum(vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;
    
    int max_sum = 0, window_sum = 0;
    // Compute sum of first window
    for (int i = 0; i < k; i++) {
        window_sum += arr[i];
    }
    max_sum = window_sum;
    
    // Slide the window
    for (int i = k; i < n; i++) {
        window_sum += arr[i] - arr[i - k];
        max_sum = max(max_sum, window_sum);
    }
    return max_sum;
}

// Variable Window: Longest Substring Without Repeating Characters
int lengthOfLongestSubstring(string s) {
    unordered_set<char> charSet;
    int left = 0, maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        // If duplicate found, shrink window from left
        while (charSet.count(s[right])) {
            charSet.erase(s[left]);
            left++;
        }
        charSet.insert(s[right]);
        maxLength = max(maxLength, right - left + 1);
    }
    return maxLength;
}`
};

const fileNames = {
  javascript: 'slidingWindow.js',
  python: 'sliding_window.py',
  java: 'SlidingWindow.java',
  cpp: 'sliding_window.cpp',
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
