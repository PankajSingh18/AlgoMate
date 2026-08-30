import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const AlphaBetaPruningCode = () => {
  const codeSnippets = {
    javascript: `function alphaBeta(node, depth, alpha, beta, isMaximizingPlayer) {
  if (depth === 0 || node.isTerminal()) {
    return node.value;
  }

  if (isMaximizingPlayer) {
    let bestVal = -Infinity;
    for (let child of node.children) {
      bestVal = Math.max(bestVal, alphaBeta(child, depth - 1, alpha, beta, false));
      alpha = Math.max(alpha, bestVal);
      if (beta <= alpha) {
        break; // Beta cut-off
      }
    }
    return bestVal;
  } else {
    let bestVal = +Infinity;
    for (let child of node.children) {
      bestVal = Math.min(bestVal, alphaBeta(child, depth - 1, alpha, beta, true));
      beta = Math.min(beta, bestVal);
      if (beta <= alpha) {
        break; // Alpha cut-off
      }
    }
    return bestVal;
  }
}`,
    cpp: `int alphaBeta(Node* node, int depth, int alpha, int beta, bool isMaximizingPlayer) {
    if (depth == 0 || node->isTerminal()) {
        return node->value;
    }

    if (isMaximizingPlayer) {
        int bestVal = INT_MIN;
        for (Node* child : node->children) {
            bestVal = max(bestVal, alphaBeta(child, depth - 1, alpha, beta, false));
            alpha = max(alpha, bestVal);
            if (beta <= alpha) {
                break; // Beta cut-off
            }
        }
        return bestVal;
    } else {
        int bestVal = INT_MAX;
        for (Node* child : node->children) {
            bestVal = min(bestVal, alphaBeta(child, depth - 1, alpha, beta, true));
            beta = min(beta, bestVal);
            if (beta <= alpha) {
                break; // Alpha cut-off
            }
        }
        return bestVal;
    }
}`,
    python: `def alpha_beta(node, depth, alpha, beta, is_maximizing):
    if depth == 0 or node.is_terminal():
        return node.value

    if is_maximizing:
        best_val = float('-inf')
        for child in node.children:
            best_val = max(best_val, alpha_beta(child, depth - 1, alpha, beta, False))
            alpha = max(alpha, best_val)
            if beta <= alpha:
                break # Beta cut-off
        return best_val
    else:
        best_val = float('inf')
        for child in node.children:
            best_val = min(best_val, alpha_beta(child, depth - 1, alpha, beta, True))
            beta = min(beta, best_val)
            if beta <= alpha:
                break # Alpha cut-off
        return best_val`,
    java: `public int alphaBeta(Node node, int depth, int alpha, int beta, boolean isMaximizingPlayer) {
    if (depth == 0 || node.isTerminal()) {
        return node.value;
    }

    if (isMaximizingPlayer) {
        int bestVal = Integer.MIN_VALUE;
        for (Node child : node.children) {
            bestVal = Math.max(bestVal, alphaBeta(child, depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, bestVal);
            if (beta <= alpha) {
                break; // Beta cut-off
            }
        }
        return bestVal;
    } else {
        int bestVal = Integer.MAX_VALUE;
        for (Node child : node.children) {
            bestVal = Math.min(bestVal, alphaBeta(child, depth - 1, alpha, beta, true));
            beta = Math.min(beta, bestVal);
            if (beta <= alpha) {
                break; // Alpha cut-off
            }
        }
        return bestVal;
    }
}`,
  };

  return <CodeBlock codeExamples={codeSnippets} />;
};

export default AlphaBetaPruningCode;
