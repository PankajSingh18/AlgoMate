"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Footer from "@/app/components/footer";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { generateDeleteSteps } from "@/features/algorithms/tree/bstDeleteLogic";
import { generateInOrderSteps } from "@/features/algorithms/tree/bstInOrderLogic";
import { generatePreOrderSteps } from "@/features/algorithms/tree/bstPreOrderLogic";
import { CustomInputPanel } from "@/app/visualizer/components/CustomInputPanel";
import {
  Info,
  Layers,
  BookOpen,
  Award,
  CheckCircle,
  AlertCircle
} from "lucide-react";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// functional BST insertion
const insertNodeFunctional = (node, value) => {
  if (!node) return new TreeNode(value);
  if (value < node.value) {
    return { ...node, left: insertNodeFunctional(node.left, value) };
  } else if (value > node.value) {
    return { ...node, right: insertNodeFunctional(node.right, value) };
  }
  return node;
};

// functional BST deletion
const deleteNodeFunctional = (node, value) => {
  if (!node) return null;
  if (value < node.value) {
    return { ...node, left: deleteNodeFunctional(node.left, value) };
  } else if (value > node.value) {
    return { ...node, right: deleteNodeFunctional(node.right, value) };
  } else {
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    let succ = node.right;
    while (succ.left) {
      succ = succ.left;
    }
    const updatedNode = { ...node, value: succ.value };
    updatedNode.right = deleteNodeFunctional(node.right, succ.value);
    return updatedNode;
  }
};

const hasDuplicate = (node, value) => {
  if (!node) return false;
  if (value === node.value) return true;
  if (value < node.value) return hasDuplicate(node.left, value);
  return hasDuplicate(node.right, value);
};

const pseudocode = {
  searching: [
    "Node search(Node root, int key) {",
    "  if (root == null || root.key == key)",
    "    return root;",
    "  if (key < root.key)",
    "    return search(root.left, key);",
    "  return search(root.right, key);",
    "}"
  ],
  insertion: [
    "Node insert(Node root, int key) {",
    "  if (root == null)",
    "    return new Node(key);",
    "  if (key < root.key)",
    "    root.left = insert(root.left, key);",
    "  else if (key > root.key)",
    "    root.right = insert(root.right, key);",
    "  return root;",
    "}"
  ],
  deletion: [
    "Node delete(Node root, int key) {",
    "  if (root == null) return null;",
    "  if (key < root.key) root.left = delete(root.left, key);",
    "  else if (key > root.key) root.right = delete(root.right, key);",
    "  else {",
    "    if (root.left == null) return root.right;",
    "    if (root.right == null) return root.left;",
    "    Node succ = getSuccessor(root.right);",
    "    root.key = succ.key;",
    "    root.right = delete(root.right, succ.key);",
    "  }",
    "  return root;",
    "}"
  ],
  "in-order": [
    "inOrder(node) {",
    "  if (node == null) return;",
    "  inOrder(node.left);",
    "  visit(node);",
    "  inOrder(node.right);",
    "}"
  ],
  "pre-order": [
    "preOrder(node) {",
    "  if (node == null) return;",
    "  visit(node);",
    "  preOrder(node.left);",
    "  preOrder(node.right);",
    "}"
  ],
  "post-order": [
    "postOrder(node) {",
    "  if (node == null) return;",
    "  postOrder(node.left);",
    "  postOrder(node.right);",
    "  visit(node);",
    "}"
  ]
};

const complexityInfo = {
  searching: {
    time: "O(h)",
    timeDesc: "Where h is the height of the tree. In a balanced BST, h = O(log N). In a skewed tree, it degrades to O(N).",
    space: "O(h)",
    spaceDesc: "Takes O(h) space due to recursion stack frames. Can be optimized to O(1) space if implemented iteratively."
  },
  insertion: {
    time: "O(h)",
    timeDesc: "Where h is the height of the tree. Traverses the depth of the tree to find the correct leaf node location.",
    space: "O(h)",
    spaceDesc: "Occupies O(h) recursion stack space. Storing/updating node pointers recursively consumes depth-related call stacks."
  },
  deletion: {
    time: "O(h)",
    timeDesc: "Where h is the height of the tree. Finding the successor or predecessor in Case 3 requires traversing the right child's left spine.",
    space: "O(h)",
    spaceDesc: "Recursively rebuilds subtrees from leaf to pivot point, requiring O(h) call stack memory."
  },
  "in-order": {
    time: "O(N)",
    timeDesc: "Every node in the tree is visited exactly once.",
    space: "O(H)",
    spaceDesc: "H is the height of the tree. The call stack grows with the depth of the recursion."
  },
  "pre-order": {
    time: "O(N)",
    timeDesc: "Every node in the tree is visited exactly once.",
    space: "O(H)",
    spaceDesc: "H is the height of the tree. The call stack grows with the depth of the recursion."
  },
  "post-order": {
    time: "O(N)",
    timeDesc: "Every node in the tree is visited exactly once.",
    space: "O(H)",
    spaceDesc: "H is the height of the tree. The call stack grows with the depth of the recursion."
  }
};

const traversalModes = ["in-order", "pre-order", "post-order"];

const quizzes = {
  searching: [
    {
      question: "What is the worst-case search time complexity in a skewed Binary Search Tree of N nodes?",
      options: ["O(log N)", "O(N)", "O(N log N)", "O(1)"],
      answer: 1,
      explanation: "In a skewed BST (where every node has only one child, forming a straight line), searching behaves like a linear search on a linked list, degrading to O(N) time."
    },
    {
      question: "Which child do we traverse to if the search key is less than the current node's key?",
      options: ["Right child", "Left child", "Inorder Successor", "Parent node"],
      answer: 1,
      explanation: "By definition, all keys in a node's left subtree are smaller than the node's key, and all keys in the right subtree are larger. So we traverse to the left child."
    }
  ],
  insertion: [
    {
      question: "Where are new nodes always inserted in a standard Binary Search Tree?",
      options: ["As a new root", "As a leaf node", "As an internal parent", "Replacing the predecessor"],
      answer: 1,
      explanation: "In a standard BST, insertions always result in creating a new leaf node at the bottom of the tree once a null reference is reached."
    },
    {
      question: "What happens if we try to insert a duplicate value that already exists in the BST?",
      options: ["It replaces the root", "It is placed in the left subtree", "It is usually ignored or increments a count", "It triggers a tree split"],
      answer: 2,
      explanation: "For visual and conceptual clarity, duplicate values are typically ignored or not allowed in standard BST animations to keep coordinates clean."
    }
  ],
  deletion: [
    {
      question: "How do we delete a node that has two children in a BST?",
      options: [
        "Delete it and let the children hang",
        "Replace it with either inorder successor or inorder predecessor, then delete that leaf",
        "Promote the left child to root immediately",
        "Delete both children recursively first"
      ],
      answer: 1,
      explanation: "To preserve BST properties, a node with two children is replaced by its inorder successor (min of right subtree) or inorder predecessor (max of left subtree). The successor's duplicate is then recursively deleted."
    },
    {
      question: "What is the inorder successor of a node in a BST?",
      options: [
        "The rightmost node in the left subtree",
        "The leftmost node in the right subtree",
        "The parent node",
        "The closest sibling leaf"
      ],
      answer: 1,
      explanation: "The inorder successor represents the smallest value that is larger than the target node's value. This is located by going to the right child and then following the left pointers to the very bottom."
    }
  ],
  "in-order": [
    {
      question: "What is the visiting order of In-Order traversal?",
      options: [
        "Root, Left, Right",
        "Left, Root, Right",
        "Left, Right, Root",
        "Right, Root, Left"
      ],
      answer: 1,
      explanation: "In-Order traversal first visits the left subtree, then the current node, then the right subtree."
    }
  ],
  "pre-order": [
    {
      question: "What is the visiting order of Pre-Order traversal?",
      options: [
        "Root, Left, Right",
        "Left, Root, Right",
        "Left, Right, Root",
        "Right, Root, Left"
      ],
      answer: 0,
      explanation: "Pre-Order traversal visits the current node before exploring its children."
    }
  ],
  "post-order": [
    {
      question: "What is the visiting order of Post-Order traversal?",
      options: [
        "Root, Left, Right",
        "Left, Root, Right",
        "Left, Right, Root",
        "Right, Root, Left"
      ],
      answer: 2,
      explanation: "Post-Order traversal visits both subtrees before processing the current node."
    }
  ]
};

export default function TreeBSTVisualizer({ initialMode }) {
  const [mode, setMode] = useState(initialMode);
  const [root, setRoot] = useState(null);
  const [targetTreeRoot, setTargetTreeRoot] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [activeOperationValue, setActiveOperationValue] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("Add nodes or select a mode to begin.");
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const { speed, setSpeed } = usePlayback(1);
  const timerRef = useRef(null);

  const resetPlayback = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setSteps([]);
    setMessage("Playback reset. Click Start to begin operations.");
  }, []);

  // Sync mode changes
  useEffect(() => {
    setMode(initialMode);
    resetPlayback();
  }, [initialMode, resetPlayback]);

  const handleInsert = (customValue) => {
    const val = customValue !== undefined ? customValue : parseInt(inputValue);
    if (isNaN(val) || val < 1 || val > 99) {
      setMessage("⚠️ Please enter a number between 1 and 99");
      return;
    }

    if (hasDuplicate(root, val)) {
      setMessage(`⚠️ Node ${val} already exists in the tree!`);
      return;
    }

    if (mode === "insertion") {
      resetPlayback();
      setActiveOperationValue(val);
      const newRoot = insertNodeFunctional(root, val);
      setTargetTreeRoot(newRoot);
      const preCalculated = generateInsertSteps(root, val);
      setSteps(preCalculated);
      setCurrentStepIdx(0);
      setIsAnimating(true);
      setInputValue("");
    } else {
      setRoot(prev => insertNodeFunctional(prev, val));
      setMessage(`Inserted Node ${val} into BST.`);
      setInputValue("");
    }
  };

  const handleSearch = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      setMessage("⚠️ Please enter a valid number");
      return;
    }
    if (!root) {
      setMessage("⚠️ Tree is empty! Insert nodes first.");
      return;
    }

    resetPlayback();
    setActiveOperationValue(val);
    const preCalculated = generateSearchSteps(root, val);
    setSteps(preCalculated);
    setCurrentStepIdx(0);
    setIsAnimating(true);
    setInputValue("");
  };

  const handleDelete = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      setMessage("⚠️ Please enter a valid number");
      return;
    }
    if (!root) {
      setMessage("⚠️ Tree is empty!");
      return;
    }

    if (!hasDuplicate(root, val)) {
      setMessage(`⚠️ Node ${val} does not exist in the tree!`);
      return;
    }

    resetPlayback();
    setActiveOperationValue(val);
    const newRoot = deleteNodeFunctional(root, val);
    setTargetTreeRoot(newRoot);
    const preCalculated = generateDeleteSteps(root, val);
    setSteps(preCalculated);
    setCurrentStepIdx(0);
    setIsAnimating(true);
    setInputValue("");
  };

  const generateRandomTree = useCallback(() => {
    resetPlayback();
    const trees = [
      [40, 20, 60, 10, 30, 50, 70],
      [50, 30, 70, 15, 35, 62, 85],
      [45, 25, 75, 12, 37, 60, 88]
    ];
    const sequence = trees[Math.floor(Math.random() * trees.length)];
    let newRoot = null;
    sequence.forEach(val => {
      newRoot = insertNodeFunctional(newRoot, val);
    });
    setRoot(newRoot);
    setTargetTreeRoot(newRoot);
    setMessage(`Generated beautiful BST with ${sequence.length} nodes.`);
  }, [resetPlayback]);

  const handleCustomTreeInput = useCallback((parsedArray) => {
    if (parsedArray === null) {
      generateRandomTree();
    } else {
      resetPlayback();
      let newRoot = null;
      parsedArray.forEach(val => {
        newRoot = insertNodeFunctional(newRoot, val);
      });
      setRoot(newRoot);
      setTargetTreeRoot(newRoot);
      setMessage(`Generated custom BST with ${parsedArray.length} nodes.`);
    }
  }, [generateRandomTree, resetPlayback]);













  const preCalculateSteps = () => {
    if (!root) return [];

    switch (mode) {
      case "searching":
        return generateSearchSteps(root, activeOperationValue ?? parseInt(inputValue));
      case "insertion":
        return inputValue ? generateInsertSteps(root, parseInt(inputValue)) : [];
      case "deletion":
        return generateDeleteSteps(root, activeOperationValue ?? parseInt(inputValue));
      case "in-order":
        return generateInOrderSteps(root);
      case "pre-order":
        return generatePreOrderSteps(root);
      case "post-order":
        return generatePostOrderSteps(root);
      default:
        return [];
    }
  };

  const startVisualizer = () => {
    if (!root && mode !== "insertion") {
      setMessage("⚠️ Please generate a random tree or enter an insert element first!");
      return;
    }

    if (traversalModes.includes(mode)) {
      if (steps.length === 0) {
        const preCalculated = preCalculateSteps();
        if (preCalculated.length === 0) {
          setMessage("⚠️ Please generate a random tree first!");
          return;
        }
        setSteps(preCalculated);
        setCurrentStepIdx(0);
        setIsAnimating(true);
        return;
      }
    }

    if (mode === "searching" || mode === "deletion") {
      if (inputValue) {
        mode === "searching" ? handleSearch() : handleDelete();
        return;
      }
      if (steps.length === 0) {
        setMessage("⚠️ Please enter a target value in the input box to visualize!");
        return;
      }
    }

    if (mode === "insertion" && inputValue) {
      handleInsert();
      return;
    }

    setIsAnimating(true);
    setQuizSubmitted(false);
    setSelectedOption(null);

    let nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };

  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;

    if (currentStepIdx >= steps.length) {
      setIsAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIdx];
    setMessage(currentStep.explanation);

    timerRef.current = setTimeout(() => {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setIsAnimating(false);
        // Permanently write to tree state if write operation completed successfully
        if (mode === "insertion" || mode === "deletion") {
          setRoot(targetTreeRoot);
          setMessage("Operation completed successfully!");
        } else {
          setMessage(currentStep.explanation);
        }
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnimating, currentStepIdx, steps, speed, targetTreeRoot, mode]);

  const pauseVisualizer = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const stepForward = () => {
    setIsAnimating(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      if (currentStepIdx === steps.length - 2 && (mode === "insertion" || mode === "deletion")) {
        setRoot(targetTreeRoot);
      }
    }
  };

  const stepBackward = () => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleResetTree = () => {
    setRoot(null);
    setTargetTreeRoot(null);
    resetPlayback();
    setMessage("Tree has been cleared. Add nodes or click Generate.");
  };

  const handleQuizAnswer = (idx) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const submitQuiz = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
  };

  const nextQuizQuestion = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    const questionsList = quizzes[mode];
    setQuizIdx(prev => (prev + 1) % questionsList.length);
  };

  const calculateCoordinates = (node, x = 400, y = 60, level = 0, nodesList = [], edgesList = []) => {
    if (!node) return { nodesList, edgesList };

    const nodeRadius = 24;
    const xOffset = 260 / Math.pow(2, level);
    const yOffset = 80;

    const currentStep = steps[currentStepIdx];
    const highlightedState = currentStep?.highlightedNodes?.[node.value] || null;

    nodesList.push({
      value: node.value,
      x,
      y,
      state: highlightedState,
      isVisited: currentStep?.visited?.includes(node.value) || false
    });

    if (node.left) {
      const leftX = x - xOffset;
      const leftY = y + yOffset;
      edgesList.push({
        x1: x,
        y1: y + nodeRadius,
        x2: leftX,
        y2: leftY - nodeRadius,
      });
      calculateCoordinates(node.left, leftX, leftY, level + 1, nodesList, edgesList);
    }

    if (node.right) {
      const rightX = x + xOffset;
      const rightY = y + yOffset;
      edgesList.push({
        x1: x,
        y1: y + nodeRadius,
        x2: rightX,
        y2: rightY - nodeRadius,
      });
      calculateCoordinates(node.right, rightX, rightY, level + 1, nodesList, edgesList);
    }

    return { nodesList, edgesList };
  };

  const buildTreeRenderData = () => {
    const currentStep = steps[currentStepIdx];
    const showInsertedNode = currentStep?.isNodeCreated || false;

    // Use the animated target tree only during write operations.
    const activeTree = (mode === "insertion" || mode === "deletion")
      ? ((mode === "insertion" && !showInsertedNode) ? root : targetTreeRoot || root)
      : root;

    if (!activeTree) return { renderNodes: [], renderEdges: [] };
    const { nodesList, edgesList } = calculateCoordinates(activeTree);
    return { renderNodes: nodesList, renderEdges: edgesList };
  };

  const { renderNodes, renderEdges } = buildTreeRenderData();

  const getSvgDimensions = () => {
    if (renderNodes.length === 0) return { width: 800, height: 400, viewBoxOffset: 0 };
    const xCoords = renderNodes.map(n => n.x);
    const yCoords = renderNodes.map(n => n.y);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const maxY = Math.max(...yCoords);

    const padding = 60;
    const computedWidth = maxX - minX + padding * 2;
    const computedHeight = maxY + padding * 1.5;

    return {
      width: Math.max(800, computedWidth),
      height: Math.max(380, computedHeight),
      viewBoxOffset: minX - padding
    };
  };

  const svgDimensions = getSvgDimensions();

  useEffect(() => {
    // Populate default beautiful tree on mount
    generateRandomTree();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [generateRandomTree]);

  const currentStep = steps[currentStepIdx] || null;
  const currentHighlightLine = currentStep ? currentStep.codeLine : -1;
  const activeComplexity = complexityInfo[mode];
  const activeQuizList = quizzes[mode];
  const activeQuestion = activeQuizList[quizIdx];
  const isTraversalMode = traversalModes.includes(mode);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col gap-8">
        <div className="w-full">
          <Breadcrumbs paths={createVisualizerPaths("Tree", "Binary Search Tree", mode.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "))} />
        </div>
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 px-3 py-1 rounded-full w-fit border border-indigo-100 dark:border-indigo-900/50">
              <Layers className="w-3.5 h-3.5" /> BST Interactive Operations
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-600 to-indigo-400 dark:from-white dark:via-indigo-200 dark:to-indigo-400 capitalize">
              {mode.replace("-", " ")}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Visualize binary search trees, node path traversals, element insertions, and structural node deletions.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-gray-100 dark:bg-slate-900/90 p-1.5 rounded-xl border border-gray-300 dark:border-slate-800">
            {["searching", "insertion", "deletion", "in-order", "pre-order", "post-order"].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setMode(tab);
                  resetPlayback();
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  mode === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-800/50"
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Tree Workspace & Control cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="bg-white dark:bg-[#111] backdrop-blur-xl border border-gray-200 dark:border-[#222] p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
              {/* Insert / Search / Delete input controls */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                <button
                  onClick={generateRandomTree}
                  disabled={isAnimating}
                  className="px-4 py-2 text-xs font-bold bg-gray-900 hover:bg-slate-800 dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a] text-white rounded-xl transition-all border border-gray-200 dark:border-[#333] disabled:opacity-40"
                >
                  🎲 Random BST
                </button>
                <div className="flex gap-1.5 flex-1 sm:flex-initial">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isTraversalMode ? "Traversal uses the current tree" : mode === "searching" ? "Find key (1-99)" : mode === "deletion" ? "Delete key" : "Insert key (1-99)"}
                    className="w-full sm:w-28 px-3 py-2 text-xs bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    disabled={isAnimating}
                    onKeyDown={(e) => e.key === "Enter" && (isTraversalMode ? startVisualizer() : mode === "searching" ? handleSearch() : mode === "deletion" ? handleDelete() : handleInsert())}
                  />
                  <button
                    onClick={() => (isTraversalMode ? startVisualizer() : mode === "searching" ? handleSearch() : mode === "deletion" ? handleDelete() : handleInsert())}
                    disabled={isAnimating}
                    className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:opacity-40 text-white rounded-xl transition-all font-semibold"
                  >
                    {isTraversalMode ? "Traverse" : mode === "searching" ? "Search" : mode === "deletion" ? "Delete" : "Insert"}
                  </button>
                </div>
              </div>

              {/* Playback Controls */}
              <PlaybackControls
                isPlaying={isAnimating}
                onPlayPause={isAnimating ? pauseVisualizer : startVisualizer}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onReset={resetPlayback}
                onClear={handleResetTree}
                clearLabel="Clear Tree"
                speed={speed}
                onSpeedChange={setSpeed}
                disabled={steps.length === 0 && !isAnimating}
                showPlayPause={true}
                progressText={`Step ${currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / ${steps.length || 0}`}
              />
            </div>

            {/* Explanation Area */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" /> Action Explanation
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-bold bg-gray-100 dark:bg-[#1a1a1a] px-2.5 py-0.5 rounded-full border border-gray-300 dark:border-[#333]">
                  Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
                </span>
              </div>
              <div
                className="text-[14px] leading-relaxed min-h-[24px] text-center text-slate-600 dark:text-slate-400"
              >
                {message}
              </div>
            </div>

            {/* Trees SVG Render Canvas */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[440px] items-center">
              
              {/* Dynamic Legend Labels */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-950/20"></span>
                  <span className="text-slate-600 dark:text-slate-400">Comparing (visiting)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-md shadow-purple-950/20"></span>
                  <span className="text-slate-600 dark:text-slate-400">Path Traversed</span>
                </div>
                {mode === "searching" && (
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-950/20"></span>
                    <span className="text-slate-600 dark:text-slate-400">Node Found!</span>
                  </div>
                )}
                {mode === "insertion" && (
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-950/20 animate-pulse"></span>
                    <span className="text-slate-600 dark:text-slate-400">Newly Placed Leaf</span>
                  </div>
                )}
                {mode === "deletion" && (
                  <>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-950/20"></span>
                      <span className="text-slate-600 dark:text-slate-400">Deleted (removal)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-md shadow-purple-950/20"></span>
                      <span className="text-slate-600 dark:text-slate-400">Inorder Successor</span>
                    </div>
                  </>
                )}
              </div>

              {renderNodes.length > 0 ? (
                <div className="overflow-auto w-full flex justify-center py-6">
                  <svg
                    width={svgDimensions.width}
                    height={svgDimensions.height}
                    viewBox={`${svgDimensions.viewBoxOffset} 0 ${svgDimensions.width} ${svgDimensions.height}`}
                    className="max-w-full h-auto transition-transform duration-300"
                  >
                    {/* Render Edges */}
                    {renderEdges.map((edge, idx) => (
                      <line
                        key={`edge-${idx}`}
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        className="stroke-slate-300 dark:stroke-slate-700"
                        strokeWidth="2.5"
                      />
                    ))}

                    {/* Render Nodes */}
                    {renderNodes.map((node, idx) => {
                      const isCurr = node.state === "visiting" || node.state === "visiting-succ";
                      const isFound = node.state === "found";
                      const isInserted = node.state === "inserted";
                      const isDeleted = node.state === "deleted";
                      const isPred = node.state === "predecessor";
                      const isVisited = node.isVisited;
                      const swapValues = currentStep?.swapValues || null;
                      const isSwapPhase = currentStep?.stepType === "swap-values" || currentStep?.stepType === "delete-successor";
                      const displayValue = swapValues && isSwapPhase
                        ? (node.value === swapValues.targetValue
                            ? swapValues.successorValue
                            : node.value === swapValues.successorValue
                              ? swapValues.targetValue
                              : node.value)
                        : node.value;

                      let fillHex = "#0f172a";
                      let strokeHex = "#334155";

                      if (isCurr) {
                        fillHex = "#10b981"; // emerald-500
                        strokeHex = "#34d399";
                      } else if (isFound) {
                        fillHex = "#f59e0b"; // amber-500
                        strokeHex = "#fbbf24";
                      } else if (isInserted) {
                        fillHex = "#10b981"; // emerald-500
                        strokeHex = "#34d399";
                      } else if (isDeleted) {
                        fillHex = "#ef4444"; // red-500
                        strokeHex = "#f87171";
                      } else if (isPred) {
                        fillHex = "#a855f7"; // purple-500
                        strokeHex = "#c084fc";
                      } else if (isVisited) {
                        fillHex = "#3b82f6"; // blue-500
                        strokeHex = "#60a5fa";
                      }

                      return (
                        <g key={`node-${idx}`} className="transition-all duration-300">
                          {/* Glow ring */}
                          {(isCurr || isFound || isPred || isInserted || isDeleted) && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="28"
                              fill="none"
                              stroke={strokeHex}
                              strokeWidth="1.5"
                              strokeDasharray="4,2"
                              className="animate-spin-slow opacity-60"
                            />
                          )}

                          {/* Node Circle */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="21"
                            fill={fillHex}
                            stroke={strokeHex}
                            strokeWidth="2.5"
                            className="transition-all duration-300 shadow-xl shadow-black"
                          />

                          {/* Node Value Label */}
                          <text
                            x={node.x}
                            y={node.y + 4.5}
                            textAnchor="middle"
                            className="fill-white dark:fill-slate-800"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {displayValue}
                          </text>

                          {/* Label labels */}
                          {isCurr && node.state === "visiting" && (
                            <g transform={`translate(${node.x - 22}, ${node.y - 35})`}>
                              <rect width="44" height="15" rx="4" className="fill-emerald-700 dark:fill-emerald-600 stroke stroke-emerald-400" strokeWidth="0.5" />
                              <text x="22" y="11" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">curr</text>
                            </g>
                          )}
                          {isPred && (
                            <g transform={`translate(${node.x - 22}, ${node.y - 35})`}>
                              <rect width="44" height="15" rx="4" className="fill-purple-800 dark:fill-purple-700 stroke stroke-purple-400" strokeWidth="0.5" />
                              <text x="22" y="11" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">succ</text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5 text-slate-500 py-12">
                  <AlertCircle className="w-10 h-10 text-slate-700" />
                  <span className="text-sm font-semibold">Workspace Empty</span>
                  <span className="text-xs max-w-xs text-center text-slate-600">Enter a value and click Insert, Search, or Delete to begin.</span>
                </div>
              )}
            </div>

            {/* Time / Space Complexity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Time Complexity</h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
                    {activeComplexity.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  {activeComplexity.timeDesc}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Space Complexity</h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-950/40 text-purple-400 border border-purple-900/50">
                    {activeComplexity.space}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  {activeComplexity.spaceDesc}
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: Pseudocode & Quizzes */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            
            {/* Pseudocode Highlighter Card */}
            <div className="bg-gray-50 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Pseudocode</h2>
              </div>
              <div className="flex flex-col gap-1 font-mono text-xs text-slate-700 dark:text-slate-400 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-[#333] overflow-x-auto leading-relaxed">
                {pseudocode[mode].map((line, idx) => {
                  const isHighlighted = idx === currentHighlightLine;
                  return (
                    <div
                      key={`code-${idx}`}
                      className={`flex gap-3 px-2 py-0.5 rounded transition-all ${
                        isHighlighted
                          ? "bg-indigo-600/25 text-indigo-200 font-semibold border-l-2 border-indigo-500 pl-1.5"
                          : ""
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 dark:text-slate-600 select-none w-4 text-right">{idx + 1}</span>
                      <pre className="flex-1 whitespace-pre">{line}</pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Input Panel for Tree */}
            <CustomInputPanel
              inputType="array"
              onApply={handleCustomTreeInput}
              currentData={[]}
            />

            {/* Quiz Challenge Card */}
            <div className="bg-gray-50 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Award className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Quiz Challenge</h2>
              </div>
              
              <div className="flex flex-col gap-3.5">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-200 dark:border-[#222]">
                  {activeQuestion.question}
                </div>

                {/* Option buttons */}
                <div className="flex flex-col gap-2">
                  {activeQuestion.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = oIdx === activeQuestion.answer;
                    
                    let btnColor = "bg-white hover:bg-gray-50 border-gray-200 text-slate-700 dark:bg-[#1a1a1a] dark:hover:bg-[#222] dark:border-[#333] dark:text-slate-400";
                    if (isSelected) {
                      btnColor = "bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-500 dark:text-indigo-300";
                    }
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnColor = "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-300";
                      } else if (isSelected) {
                        btnColor = "bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-950/40 dark:border-rose-500 dark:text-rose-300";
                      }
                    }

                    return (
                      <button
                        key={`opt-${oIdx}`}
                        onClick={() => handleQuizAnswer(oIdx)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-xl border transition-all flex items-center justify-between gap-2.5 ${btnColor}`}
                        disabled={quizSubmitted}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />}
                        {quizSubmitted && isSelected && !isCorrect && <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Submission Controls */}
                <div className="flex gap-2 justify-end mt-1.5">
                  {!quizSubmitted ? (
                    <button
                      onClick={submitQuiz}
                      disabled={selectedOption === null}
                      className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shadow shadow-indigo-950"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuizQuestion}
                      className="px-4 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all border border-gray-300 dark:border-slate-700"
                    >
                      Next Question
                    </button>
                  )}
                </div>

                {/* Quiz feedback explanation */}
                {quizSubmitted && (
                  <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#333] p-3.5 rounded-xl flex gap-2.5 items-start mt-1">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                      <span className="font-semibold text-indigo-300 block mb-0.5">
                        {selectedOption === activeQuestion.answer ? "🎉 Correct Answer!" : "❌ Incorrect Answer"}
                      </span>
                      {activeQuestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

