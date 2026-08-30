'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `function largestRectangleArea(heights) {
    let maxArea = 0;
    const stack = []; // Stores indices
    
    for (let i = 0; i <= heights.length; i++) {
        const h = (i === heights.length) ? 0 : heights[i];
        
        while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        
        stack.push(i);
    }
    
    return maxArea;
}`,
  python: `def largestRectangleArea(heights):
    stack = []
    max_area = 0
    
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            index, height = stack.pop()
            max_area = max(max_area, height * (i - index))
            start = index
        stack.append((start, h))
        
    for i, h in stack:
        max_area = max(max_area, h * (len(heights) - i))
        
    return max_area`,
  java: `class Solution {
    public int largestRectangleArea(int[] heights) {
        int maxArea = 0;
        Stack<Integer> stack = new Stack<>();
        
        for (int i = 0; i <= heights.length; i++) {
            int h = (i == heights.length) ? 0 : heights[i];
            
            while (!stack.isEmpty() && h < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            
            stack.push(i);
        }
        
        return maxArea;
    }
}`,
  c: `int largestRectangleArea(int* heights, int heightsSize) {
    int maxArea = 0;
    int* stack = (int*)malloc(sizeof(int) * (heightsSize + 1));
    int top = -1;
    
    for (int i = 0; i <= heightsSize; i++) {
        int h = (i == heightsSize) ? 0 : heights[i];
        
        while (top != -1 && h < heights[stack[top]]) {
            int height = heights[stack[top--]];
            int width = (top == -1) ? i : i - stack[top] - 1;
            int area = height * width;
            if (area > maxArea) {
                maxArea = area;
            }
        }
        
        stack[++top] = i;
    }
    
    free(stack);
    return maxArea;
}`
};

const fileNames = {
  javascript: 'largestRectangle.js',
  python: 'largest_rectangle.py',
  java: 'LargestRectangle.java',
  c: 'largest_rectangle.c'
};

const CodeBlock = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold dark:text-white mb-4">
      Largest Rectangle in Histogram Code
    </h2>
    <CodeBlockUI
      variant="macos"
      codeExamples={codeExamples}
      fileNames={fileNames}
    />
  </div>
);

export default CodeBlock;
