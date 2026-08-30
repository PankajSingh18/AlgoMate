'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Min Max Algorithm in JavaScript
function minimax(depth, nodeIndex, isMax, scores, h) {
  if (depth === h) return scores[nodeIndex];
  
  if (isMax) {
    return Math.max(
      minimax(depth + 1, nodeIndex * 2, false, scores, h),
      minimax(depth + 1, nodeIndex * 2 + 1, false, scores, h)
    );
  } else {
    return Math.min(
      minimax(depth + 1, nodeIndex * 2, true, scores, h),
      minimax(depth + 1, nodeIndex * 2 + 1, true, scores, h)
    );
  }
}
// Usage example
const scores = [3, 5, 2, 9, 12, 5, 23, 23];
const h = Math.log2(scores.length);
const result = minimax(0, 0, true, scores, h);
console.log("Optimal value is: " + result);`,

  python: `# Min Max Algorithm in Python
import math

def minimax(depth, nodeIndex, isMax, scores, h):
    if depth == h:
        return scores[nodeIndex]
    
    if isMax:
        return max(minimax(depth + 1, nodeIndex * 2, False, scores, h),
                   minimax(depth + 1, nodeIndex * 2 + 1, False, scores, h))
    else:
        return min(minimax(depth + 1, nodeIndex * 2, True, scores, h),
                   minimax(depth + 1, nodeIndex * 2 + 1, True, scores, h))

# Usage example
scores = [3, 5, 2, 9, 12, 5, 23, 23]
h = int(math.log2(len(scores)))
result = minimax(0, 0, True, scores, h)
print("Optimal value is:", result)`,

  java: `// Min Max Algorithm in Java
public class MinMax {
    static int minimax(int depth, int nodeIndex, boolean isMax, int[] scores, int h) {
        if (depth == h) return scores[nodeIndex];
        
        if (isMax) {
            return Math.max(
                minimax(depth + 1, nodeIndex * 2, false, scores, h),
                minimax(depth + 1, nodeIndex * 2 + 1, false, scores, h)
            );
        } else {
            return Math.min(
                minimax(depth + 1, nodeIndex * 2, true, scores, h),
                minimax(depth + 1, nodeIndex * 2 + 1, true, scores, h)
            );
        }
    }

    public static void main(String[] args) {
        int[] scores = {3, 5, 2, 9, 12, 5, 23, 23};
        int h = (int)(Math.log(scores.length) / Math.log(2));
        int result = minimax(0, 0, true, scores, h);
        System.out.println("Optimal value is: " + result);
    }
}`
};

export default function Code() {
  return <CodeBlock codeExamples={codeExamples} />;
}
