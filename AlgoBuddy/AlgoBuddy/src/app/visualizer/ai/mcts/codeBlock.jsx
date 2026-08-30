'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Monte Carlo Tree Search (MCTS) - Core Logic (UCT)
function uct(node, parentVisits, C = 1.41) {
    if (node.visits === 0) return Infinity;
    return (node.wins / node.visits) + C * Math.sqrt(Math.log(parentVisits) / node.visits);
}

function select(node, C) {
    while (node.children.length > 0) {
        node = node.children.reduce((best, curr) => 
            uct(curr, node.visits, C) > uct(best, node.visits, C) ? curr : best
        );
    }
    return node;
}

function simulate(node) {
    // Perform a random playout from the current state
    let state = node.game_state;
    while (!state.is_terminal()) {
        const move = state.get_random_move();
        state = state.apply(move);
    }
    return state.get_result(); // 1 for win, 0 for loss
}

function backpropagate(path, result) {
    for (let node of path) {
        node.visits += 1;
        node.wins += result;
    }
}
`,

  python: `# Monte Carlo Tree Search (MCTS) - Core Logic (UCT)
import math

def uct(node, parent_visits, c=1.41):
    if node.visits == 0:
        return float('inf')
    return (node.wins / node.visits) + c * math.sqrt(math.log(parent_visits) / node.visits)

def select(node, c):
    while node.children:
        node = max(node.children, key=lambda n: uct(n, node.visits, c))
    return node

def simulate(node):
    # Perform a random playout from the current state
    state = node.game_state
    while not state.is_terminal():
        move = state.get_random_move()
        state = state.apply(move)
    return state.get_result()  # 1 for win, 0 for loss

def backpropagate(path, result):
    for node in path:
        node.visits += 1
        node.wins += result
`,

  java: `// Monte Carlo Tree Search (MCTS) - Core Logic (UCT)
class MCTS {
    public double getUCT(Node node, int parentVisits, double C) {
        if (node.getVisits() == 0) return Double.MAX_VALUE;
        return (node.getWins() / (double)node.getVisits()) 
               + C * Math.sqrt(Math.log(parentVisits) / node.getVisits());
    }

    public Node select(Node node, double C) {
        while (!node.getChildren().isEmpty()) {
            node = node.getChildren().stream()
                .max((n1, n2) -> Double.compare(getUCT(n1, node.getVisits(), C), 
                                                getUCT(n2, node.getVisits(), C)))
                .get();
        }
        return node;
    }

    public int simulate(Node node) {
        GameState state = node.getGameState();
        while (!state.isTerminal()) {
            state = state.apply(state.getRandomMove());
        }
        return state.getResult(); // 1 for win, 0 for loss
    }

    public void backpropagate(List<Node> path, int result) {
        for (Node n : path) {
            n.setVisits(n.getVisits() + 1);
            n.setWins(n.getWins() + result);
        }
    }
}
`,

  cpp: `// Monte Carlo Tree Search (MCTS) - Core Logic (UCT)
#include <cmath>
#include <algorithm>
#include <vector>

double uct(Node* node, int parent_visits, double C = 1.41) {
    if (node->visits == 0) return 1e18; // Infinity
    return (node->wins / (double)node->visits) + 
           C * std::sqrt(std::log(parent_visits) / node->visits);
}

Node* select(Node* node, double C) {
    while (!node->children.empty()) {
        node = *std::max_element(node->children.begin(), node->children.end(),
            [&](Node* a, Node* b) {
                return uct(a, node->visits, C) < uct(b, node->visits, C);
            });
    }
    return node;
}

int simulate(GameState state) {
    while (!state.is_terminal()) {
        state = state.apply(state.get_random_move());
    }
    return state.get_result(); // 1 for win, 0 for loss
}

void backpropagate(std::vector<Node*>& path, int result) {
    for (auto node : path) {
        node->visits += 1;
        node->wins += result;
    }
}
`,
};

const fileNames = {
  javascript: 'mcts.js',
  python: 'mcts.py',
  java: 'MCTS.java',
  cpp: 'mcts.cpp',
};

const MCTSCodeBlock = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default MCTSCodeBlock;

