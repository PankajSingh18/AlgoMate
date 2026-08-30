'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Footer from '@/app/components/footer';
import { AlertCircle, CheckCircle, Info, BookOpen, Layers, Award } from 'lucide-react';
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { generateInOrderSteps } from "@/features/algorithms/tree/inOrderLogic";
import { generatePreOrderSteps } from "@/features/algorithms/tree/preOrderLogic";
import { generateMorrisSteps } from "@/features/algorithms/tree/morrisLogic";
import { generateLevelOrderSteps } from "@/features/algorithms/tree/levelOrderLogic";
import { generatePostOrderSteps } from "@/features/algorithms/tree/postOrderLogic";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Complexity mapping
const complexityInfo = {
  'pre-order': {
    time: 'O(N)',
    timeDesc: 'Every node in the tree is visited exactly once.',
    space: 'O(H)',
    spaceDesc: 'H is the height of the tree. In the worst case (skewed tree), the call stack requires O(N) space, while in a balanced tree it takes O(log N).'
  },
  'in-order': {
    time: 'O(N)',
    timeDesc: 'Every node in the tree is visited exactly once.',
    space: 'O(H)',
    spaceDesc: 'H is the height of the tree. The call stack holds function calls up to the deepest leaf node.'
  },
  'post-order': {
    time: 'O(N)',
    timeDesc: 'Every node in the tree is visited exactly once.',
    space: 'O(H)',
    spaceDesc: 'H is the height of the tree. Space is required for recursion stack frames representing parents waiting to be visited.'
  },
  'level-order': {
    time: 'O(N)',
    timeDesc: 'Every node is dequeued and visited once.',
    space: 'O(W)',
    spaceDesc: 'W is the maximum width of the tree. In a complete binary tree, the last level contains N/2 nodes, requiring O(N) space in the queue.'
  },
  'morris': {
    time: 'O(N)',
    timeDesc: 'Each edge is traversed at most 3 times (finding predecessor, creating thread, removing thread). Thus, overall time remains O(N).',
    space: 'O(1)',
    spaceDesc: 'Extraordinary feature: Morris Traversal uses threaded binary trees to navigate without recursion stack or queues, achieving true constant auxiliary space!'
  }
};

// Pseudocode mapping
const pseudocode = {
  'pre-order': [
    'preOrder(node) {',
    '  if (node === null) return;',
    '  visit(node); // Process current node',
    '  preOrder(node.left); // Traverse left subtree',
    '  preOrder(node.right); // Traverse right subtree',
    '}'
  ],
  'in-order': [
    'inOrder(node) {',
    '  if (node === null) return;',
    '  inOrder(node.left); // Traverse left subtree',
    '  visit(node); // Process current node',
    '  inOrder(node.right); // Traverse right subtree',
    '}'
  ],
  'post-order': [
    'postOrder(node) {',
    '  if (node === null) return;',
    '  postOrder(node.left); // Traverse left subtree',
    '  postOrder(node.right); // Traverse right subtree',
    '  visit(node); // Process current node',
    '}'
  ],
  'level-order': [
    'levelOrder(root) {',
    '  if (root === null) return;',
    '  queue.enqueue(root);',
    '  while (!queue.isEmpty()) {',
    '    node = queue.dequeue(); visit(node);',
    '    if (node.left) queue.enqueue(node.left);',
    '    if (node.right) queue.enqueue(node.right);',
    '  }',
    '}'
  ],
  'morris': [
    'morrisInOrder(root) {',
    '  curr = root;',
    '  while (curr !== null) {',
    '    if (curr.left === null) {',
    '      visit(curr); curr = curr.right;',
    '    } else {',
    '      pred = findPredecessor(curr);',
    '      if (pred.right === null) {',
    '        pred.right = curr; // Create thread',
    '        curr = curr.left;',
    '      } else {',
    '        pred.right = null; // Clear thread',
    '        visit(curr); curr = curr.right;',
    '      }',
    '    }',
    '  }',
    '}'
  ]
};

// Quizzes data
const quizzes = {
  'pre-order': [
    {
      question: 'Which of the following describes the visiting order of Pre-Order traversal?',
      options: [
        'Root, Left Subtree, Right Subtree',
        'Left Subtree, Root, Right Subtree',
        'Left Subtree, Right Subtree, Root',
        'Root, Right Subtree, Left Subtree'
      ],
      answer: 0,
      explanation: 'Pre-Order traversal is so named because the Root node is visited PRE (before) its subtrees. So the order is Root -> Left -> Right.'
    },
    {
      question: 'Which of the following is a common application of Pre-Order traversal?',
      options: [
        'Getting sorted nodes of a BST',
        'Creating a copy or clone of a binary tree',
        'Deleting/destroying a tree to avoid memory leaks',
        'Finding the height of a tree'
      ],
      answer: 1,
      explanation: 'Pre-Order traversal is commonly used to create a copy or serialize a binary tree, because the root is created first, followed by its children recursively.'
    }
  ],
  'in-order': [
    {
      question: 'What is the special characteristic of In-Order traversal on a Binary Search Tree (BST)?',
      options: [
        'It visits the nodes in random order',
        'It visits the nodes in sorted ascending order',
        'It visits the nodes in sorted descending order',
        'It visits leaves first, then intermediate parent nodes'
      ],
      answer: 1,
      explanation: 'Because of the BST property (Left < Root < Right), an In-Order traversal (Left -> Root -> Right) always produces the values in sorted ascending order.'
    },
    {
      question: 'What is the auxiliary space complexity of standard In-Order traversal on a balanced binary tree?',
      options: [
        'O(1)',
        'O(log N) due to recursion stack height',
        'O(N) always',
        'O(N^2)'
      ],
      answer: 1,
      explanation: 'In a balanced binary tree, the height of the tree is log(N). Since the recursion call stack goes as deep as the height, the auxiliary space is O(log N).'
    }
  ],
  'post-order': [
    {
      question: 'What is the visiting order of Post-Order traversal?',
      options: [
        'Root, Left Subtree, Right Subtree',
        'Left Subtree, Root, Right Subtree',
        'Left Subtree, Right Subtree, Root',
        'Root, Right Subtree, Left Subtree'
      ],
      answer: 2,
      explanation: 'Post-Order traversal visits the Root node POST (after) its subtrees. So the order is Left -> Right -> Root.'
    },
    {
      question: 'Why is Post-Order traversal ideal for deleting or freeing memory of a binary tree?',
      options: [
        'It is faster than other traversals',
        'It processes the root before any of its descendants',
        'It processes children first, ensuring parents are deleted only after children are safe to delete',
        'It uses zero auxiliary memory space'
      ],
      answer: 2,
      explanation: 'Post-Order processes children before parent (Left -> Right -> Root). This ensures you delete child nodes first so you do not lose references to children before deleting their parent!'
    }
  ],
  'level-order': [
    {
      question: 'What data structure is standard for implementing Level-Order traversal iteratively?',
      options: [
        'Stack (LIFO)',
        'Queue (FIFO)',
        'Priority Queue',
        'Hash Map'
      ],
      answer: 1,
      explanation: 'A Queue (First-In-First-Out) is used to explore nodes level-by-level, ensuring nodes at level L are processed before any nodes at level L+1.'
    },
    {
      question: 'In the worst case (e.g. a complete binary tree), what is the maximum number of nodes inside the queue at any time?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N) (specifically, about N/2 at the leaf level)',
        'O(N log N)'
      ],
      answer: 2,
      explanation: 'In a complete binary tree, the leaf level contains roughly N/2 nodes. In Level-Order traversal, the queue will hold all nodes of the leaf level at the same time, making space complexity O(N).'
    }
  ],
  'morris': [
    {
      question: 'What is the main advantage of Morris Traversal over standard traversals?',
      options: [
        'It runs in O(log N) time complexity',
        'It performs the traversal with O(1) auxiliary space, requiring no recursion stack or queue',
        'It works on graphs without modification',
        'It avoids visiting left subtrees altogether'
      ],
      answer: 1,
      explanation: 'Morris Traversal uses the concept of threaded binary trees (temporary links from inorder predecessors back to current nodes) to traverse the tree without any recursion stack or auxiliary queues, achieving true O(1) space!'
    },
    {
      question: 'What does Morris Traversal do to a node\'s inorder predecessor when visiting for the first time?',
      options: [
        'Deletes the predecessor node',
        'Swaps it with the root node',
        'Sets its right child to point to the current node (creating a temporary thread)',
        'Sets its left child to point to the current node'
      ],
      answer: 2,
      explanation: 'Morris Traversal finds the inorder predecessor (rightmost node in left subtree) and sets its right child to point back to the current node. This thread is later removed when traversing that path a second time.'
    }
  ]
};

export default function TreeTraversalVisualizer({ initialMode = 'in-order' }) {
  const [mode, setMode] = useState(initialMode);
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Tree is empty');

  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Pre-calculate steps when tree or mode changes
  const steps = useMemo(() => {
    if (!root) return [];
    switch (mode) {
      case 'pre-order': return generatePreOrderSteps(root);
      case 'in-order': return generateInOrderSteps(root);
      case 'post-order': return generatePostOrderSteps(root);
      case 'level-order': return generateLevelOrderSteps(root);
      case 'morris': return generateMorrisSteps(root);
      default: return [];
    }
  }, [root, mode]);

  const onStep = useCallback((step, idx) => {
    if (idx === -1) {
      setMessage('Playback reset. Click Start Traversal to begin.');
      return;
    }
    if (idx >= steps.length - 1) {
      setMessage(`Traversal Finished! Visited Order: [${step.visited.join(', ')}]`);
      return;
    }
    setMessage(step.explanation);
  }, [steps]);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 1 });

  const startPlayback = useCallback(() => {
    if (!root) {
      setMessage('⚠️ Please insert a node or generate a random tree first!');
      return;
    }
    setQuizSubmitted(false);
    setSelectedOption(null);
    if (engine.currentStep >= steps.length - 1) {
      engine.reset();
    }
    setTimeout(() => engine.play(), 0);
  }, [root, steps, engine]);

  useEffect(() => {
    setMode(initialMode);
    engine.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMode]);

  // Pure functional BST insertion
  const insertNode = (node, value) => {
    if (!node) return new TreeNode(value);
    if (value < node.value) {
      return { ...node, left: insertNode(node.left, value) };
    } else if (value > node.value) {
      return { ...node, right: insertNode(node.right, value) };
    }
    return node; // No duplicates allowed for visual clarity
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('⚠️ Please enter a valid number');
      return;
    }
    if (value < 1 || value > 999) {
      setMessage('⚠️ Please enter a number between 1 and 999');
      return;
    }

    setRoot(prev => {
      const newRoot = insertNode(prev, value);
      setMessage(`Inserted node ${value}`);
      return newRoot;
    });
    setInputValue('');
    engine.reset();
  };

  const generateRandomTree = () => {
    engine.reset();
    // Predefined sequences that create highly balanced, beautiful trees
    const trees = [
      [50, 30, 70, 20, 40, 60, 80],
      [45, 25, 65, 15, 35, 55, 75],
      [55, 35, 75, 25, 45, 65, 85, 15, 95],
      [50, 25, 75, 12, 37, 62, 87],
      [40, 20, 60, 10, 30, 50, 70, 5, 15, 25]
    ];
    const sequence = trees[Math.floor(Math.random() * trees.length)];
    
    let newRoot = null;
    sequence.forEach(val => {
      newRoot = insertNode(newRoot, val);
    });
    
    setRoot(newRoot);
    setMessage(`Generated beautiful BST with ${sequence.length} nodes.`);
  };

  // Load a default tree on mount if empty
  useEffect(() => {
    if (!root) {
      generateRandomTree();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-calculate steps based on current tree and traversal mode
  const preCalculateSteps = () => {
    if (!root) return [];
    
    switch (mode) {
      case 'pre-order':
        return generatePreOrderSteps(root);
      case 'in-order':
        return generateInOrderSteps(root);
      case 'post-order':
        return generatePostOrderSteps(root);
      case 'level-order':
        return generateLevelOrderSteps(root);
      case 'morris':
        return generateMorrisSteps(root);
      default:
        return [];
    }
  };



  useVisualizerKeyboard({
    onTogglePlayPause: engine.isPlaying ? engine.pause : startPlayback,
    onReset: engine.reset,
    onSpeedChange: (s) => engine.setSpeed(s * 500),
    speed: engine.speed / 500,
    sorting: engine.isPlaying,
    sorted: false,
    enabled: true,
  });

  const handleResetTree = () => {
    setRoot(null);
    engine.reset();
    setMessage('Tree has been cleared. Add nodes or click Generate.');
  };

  // Quiz behaviors
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

  const nodeRadius = 24;

  const renderData = useMemo(() => {
    if (!root) return { renderNodes: [], renderEdges: [] };

    const calculateCoordinates = (node, x = 400, y = 60, level = 0, nodesList = [], edgesList = []) => {
      if (!node) return;

      const xOffset = 260 / Math.pow(2, level);
      const yOffset = 80;
      const currentStep = steps[engine.currentStep];
      const highlightedState = currentStep?.highlightedNodes?.[node.value] || null;

      nodesList.push({
        value: node.value, x, y,
        state: highlightedState,
        isVisited: currentStep?.visited?.includes(node.value) || false,
      });

      if (node.left) {
        const leftX = x - xOffset;
        const leftY = y + yOffset;
        edgesList.push({ x1: x, y1: y + nodeRadius, x2: leftX, y2: leftY - nodeRadius, isMorrisThread: false });
        calculateCoordinates(node.left, leftX, leftY, level + 1, nodesList, edgesList);
      }

      if (node.right) {
        const rightX = x + xOffset;
        const rightY = y + yOffset;
        edgesList.push({ x1: x, y1: y + nodeRadius, x2: rightX, y2: rightY - nodeRadius, isMorrisThread: false });
        calculateCoordinates(node.right, rightX, rightY, level + 1, nodesList, edgesList);
      }
    };

    const nodesList = [];
    const edgesList = [];
    calculateCoordinates(root, 400, 60, 0, nodesList, edgesList);

    const currentStep = steps[engine.currentStep];
    if (currentStep?.threads?.length > 0) {
      currentStep.threads.forEach(thread => {
        const fromNode = nodesList.find(n => n.value === thread.from);
        const toNode = nodesList.find(n => n.value === thread.to);
        if (fromNode && toNode) {
          edgesList.push({ x1: fromNode.x, y1: fromNode.y, x2: toNode.x, y2: toNode.y, isMorrisThread: true });
        }
      });
    }

    return { renderNodes: nodesList, renderEdges: edgesList };
  }, [root, steps, engine.currentStep, nodeRadius]);

  const { renderNodes, renderEdges } = renderData;

  const svgDimensions = useMemo(() => {
    if (renderNodes.length === 0) return { width: 800, height: 400 };
    const xCoords = renderNodes.map(n => n.x);
    const yCoords = renderNodes.map(n => n.y);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const maxY = Math.max(...yCoords);
    const padding = 60;
    return {
      width: Math.max(800, maxX - minX + padding * 2),
      height: Math.max(380, maxY + padding * 1.5),
      viewBoxOffset: minX - padding,
    };
  }, [renderNodes]);

  const drawMorrisCurve = (x1, y1, x2, y2) => {
    const cx = (x1 + x2) / 2 + 35;
    const cy = (y1 + y2) / 2 - 30;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  const currentStep = steps[engine.currentStep] || null;
  const currentHighlightLine = currentStep ? currentStep.codeLine : -1;
  const activeComplexity = complexityInfo[mode];
  const activeQuizList = quizzes[mode];
  const activeQuestion = activeQuizList[quizIdx];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col gap-8">

        <div className="w-full">
          <Breadcrumbs paths={createVisualizerPaths("Tree", "Traversal", mode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-') + " Traversal")} />
        </div>

        {/* Title Block */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 px-3 py-1 rounded-full w-fit border border-indigo-100 dark:border-indigo-900/50">
              <Layers className="w-3.5 h-3.5" /> Binary Tree Algorithms
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-600 to-indigo-400 dark:from-white dark:via-indigo-200 dark:to-indigo-400 capitalize">
              {mode.replace('-', ' ')} Traversal
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Visualize recursive call stacks, queue progressions, and constant space threaded Morris algorithms.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-gray-100 dark:bg-slate-900/90 p-1.5 rounded-xl border border-gray-300 dark:border-slate-800">
            {['pre-order', 'in-order', 'post-order', 'level-order', 'morris'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setMode(tab);
                  engine.reset();
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  mode === tab 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-800/50'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Tree Workspace & Controls */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Control Bar Card */}
            <div className="bg-white dark:bg-[#111] backdrop-blur-xl border border-gray-200 dark:border-[#222] p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
              <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                  <button
                    onClick={generateRandomTree}
                    disabled={engine.isPlaying}
                    className="px-4 py-2 text-xs font-bold bg-gray-900 hover:bg-slate-800 dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a] text-white rounded-xl transition-all border border-gray-200 dark:border-[#333] disabled:opacity-40"
                  >
                    🎲 Random Balanced Tree
                  </button>
                  <div className="flex gap-1.5 flex-1 sm:flex-initial">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Value (1-99)"
                      className="w-full sm:w-28 px-3 py-2 text-xs bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      disabled={engine.isPlaying}
                      onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                    />
                    <button
                      onClick={handleInsert}
                      disabled={engine.isPlaying}
                      className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all"
                    >
                      Insert
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
                  <PlaybackControls
                    isPlaying={engine.isPlaying}
                    onPlayPause={engine.isPlaying ? engine.pause : startPlayback}
                    onStepForward={engine.stepForward}
                    onStepBackward={engine.stepBackward}
                    onReset={engine.reset}
                    speed={engine.speed / 500}
                    onSpeedChange={(s) => engine.setSpeed(s * 500)}
                    disabled={steps.length === 0}
                    showPlayPause={true}
                  />

                  <button
                    onClick={handleResetTree}
                    className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:text-rose-500 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 rounded-xl transition-all border border-rose-200 dark:border-rose-900/30 ml-2"
                  >
                    Clear Tree
                  </button>
                </div>
            </div>

            {/* Explanation / Progress Bar */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" /> Current Step Activity
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-bold bg-gray-100 dark:bg-[#1a1a1a] px-2.5 py-0.5 rounded-full border border-gray-300 dark:border-[#333]">
                    Step {engine.currentStep + 1} / {steps.length || 0}
                </span>
              </div>
              <div className="text-sm font-medium text-slate-700 dark:text-indigo-200/90 leading-relaxed min-h-[40px]">
                {message}
              </div>
            </div>

            {/* Tree SVG Visualization Area */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[440px] items-center">
              
              {/* Dynamic Overlay labels */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-950/20"></span>
                  <span className="text-slate-600 dark:text-slate-400">Current Node (curr)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-950/20"></span>
                  <span className="text-slate-600 dark:text-slate-400">Visited Node</span>
                </div>
                {mode === 'morris' && (
                  <>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-md shadow-purple-950/20"></span>
                      <span className="text-slate-600 dark:text-slate-400">Predecessor (pred)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1 rounded-lg">
                      <span className="w-6 border-t-2 border-dashed border-purple-500"></span>
                      <span className="text-slate-600 dark:text-slate-400">Temporary Thread Link</span>
                    </div>
                  </>
                )}
              </div>

              {/* Main SVG Render */}
              {renderNodes.length > 0 ? (
                <div className="overflow-auto w-full flex justify-center py-6">
                  <svg
                    width={svgDimensions.width}
                    height={svgDimensions.height}
                    viewBox={`${svgDimensions.viewBoxOffset} 0 ${svgDimensions.width} ${svgDimensions.height}`}
                    className="max-w-full h-auto transition-transform duration-300"
                  >
                    <defs>
                      <marker id="arrow-morris" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-purple-400 dark:fill-purple-400" />
                      </marker>
                    </defs>

                    {/* Render Edges / Thread lines */}
                    {renderEdges.map((edge, idx) => {
                      if (edge.isMorrisThread) {
                        return (
                          <path
                            key={`thread-${idx}`}
                            d={drawMorrisCurve(edge.x1, edge.y1, edge.x2, edge.y2)}
                            fill="none"
                            className="stroke-purple-400 dark:stroke-purple-400"
                            strokeWidth="2.5"
                            strokeDasharray="6,4"
                            markerEnd="url(#arrow-morris)"
                            className="animate-pulse"
                          />
                        );
                      }
                      return (
                        <line
                          key={`edge-${idx}`}
                          x1={edge.x1}
                          y1={edge.y1}
                          x2={edge.x2}
                          y2={edge.y2}
                          className="stroke-slate-300 dark:stroke-slate-700"
                          strokeWidth="2.5"
                        />
                      );
                    })}

                    {/* Render Nodes */}
                    {renderNodes.map((node, idx) => {
                      const isCurr = node.state === 'visiting';
                      const isPred = node.state === 'predecessor';
                      const isActive = node.state === 'active';
                      const isVisited = node.isVisited;

                      let nodeColor = 'bg-slate-900 border-slate-700 text-slate-300';
                      let fillHex = '#0f172a';
                      let strokeHex = '#334155';

                      if (isCurr) {
                        fillHex = '#10b981'; // emerald-500
                        strokeHex = '#34d399';
                      } else if (isPred) {
                        fillHex = '#a855f7'; // purple-500
                        strokeHex = '#c084fc';
                      } else if (isVisited) {
                        fillHex = '#f59e0b'; // amber-500
                        strokeHex = '#fbbf24';
                      } else if (isActive) {
                        fillHex = '#3b82f6'; // blue-500
                        strokeHex = '#60a5fa';
                      }

                      return (
                        <g key={`node-${idx}`} className="transition-all duration-300">
                          {/* Outer glow ring for curr or predecessor */}
                          {(isCurr || isPred) && (
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
                          
                          {/* Main node circle */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="21"
                            fill={fillHex}
                            stroke={strokeHex}
                            strokeWidth="2.5"
                            className="transition-all duration-300 shadow-xl shadow-black"
                          />

                          {/* Inner text node label */}
                          <text
                            x={node.x}
                            y={node.y + 4.5}
                            textAnchor="middle"
                            className="fill-white dark:fill-slate-800"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {node.value}
                          </text>

                          {/* Extra pointers labels inside SVGs */}
                          {isCurr && (
                            <g transform={`translate(${node.x - 22}, ${node.y - 35})`}>
                              <rect width="44" height="15" rx="4" className="fill-emerald-700 dark:fill-emerald-600 stroke stroke-emerald-400" strokeWidth="0.5" />
                              <text x="22" y="11" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">curr</text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5 text-slate-400 dark:text-slate-500 py-12">
                  <AlertCircle className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Workspace Empty</span>
                  <span className="text-xs max-w-xs text-center text-slate-500 dark:text-slate-400">Please generate a random tree or insert custom node elements.</span>
                </div>
              )}

              {/* BFS Queue or Stack Visualization strip */}
              {currentStep && (
                <div className="w-full mt-4 border-t border-gray-200 dark:border-[#333] pt-4 flex flex-col gap-2 bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-[#222]">
                  {mode === 'level-order' && (
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider w-16">FIFO Queue:</div>
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {currentStep.queue && currentStep.queue.length > 0 ? (
                          currentStep.queue.map((val, qidx) => (
                            <div
                              key={`q-${qidx}`}
                              className={`px-3 py-1 text-xs font-bold rounded-lg border flex items-center justify-center min-w-8 ${
                                qidx === 0
                                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                                  : 'bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {val}
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-650 dark:text-slate-400 text-xs italic">Queue is empty</div>
                        )}
                      </div>
                    </div>
                  )}

                  {(mode === 'pre-order' || mode === 'in-order' || mode === 'post-order') && (
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider w-16">Call Stack:</div>
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {currentStep.stack && currentStep.stack.length > 0 ? (
                          currentStep.stack.map((val, sidx) => (
                            <div
                              key={`s-${sidx}`}
                              className="px-3 py-1 text-xs font-bold rounded-lg border bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20"
                            >
                              {val}
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-650 dark:text-slate-400 text-xs italic">Recursion stack empty (at root level)</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Active Traversal Result Path Output */}
                  <div className="flex items-center gap-3 mt-1.5 border-t border-gray-200 dark:border-slate-900 pt-2">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider w-16">Result Path:</div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {currentStep.visited && currentStep.visited.length > 0 ? (
                        currentStep.visited.map((val, pidx) => (
                          <React.Fragment key={`p-${pidx}`}>
                            <div className="px-2.5 py-0.5 text-xs font-bold rounded bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow shadow-amber-950/10">
                              {val}
                            </div>
                            {pidx < currentStep.visited.length - 1 && (
                              <span className="text-slate-400 dark:text-slate-700 text-xs font-bold">→</span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <div className="text-slate-650 dark:text-slate-400 text-xs italic">No nodes visited yet. Click Play.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Complexity Information Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Time Complexity Card */}
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

              {/* Space Complexity Card */}
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

          {/* RIGHT: Code Block & Quiz Modules */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            
            {/* Interactive Code Highlighter Card */}
            <div className="bg-gray-50 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Pseudocode</h2>
              </div>
              <div className="flex flex-col gap-1 font-mono text-xs text-slate-700 dark:text-slate-400 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-[#333] overflow-x-auto leading-relaxed">
                {pseudocode[mode].map((line, idx) => {
                  const isHighlighted = idx === currentHighlightLine;
                  return (
                    <div
                      key={`code-${idx}`}
                      className={`flex gap-3 px-2 py-0.5 rounded transition-all ${
                        isHighlighted 
                          ? 'bg-indigo-600/25 text-indigo-200 font-semibold border-l-2 border-indigo-500 pl-1.5'
                          : ''
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 dark:text-slate-700 select-none w-4 text-right">{idx + 1}</span>
                      <pre className="flex-1 whitespace-pre">{line}</pre>
                    </div>
                  );
                })}
              </div>
            </div>

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

                {/* Option list */}
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
                        {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {quizSubmitted && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
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
                        {selectedOption === activeQuestion.answer ? '🎉 Correct Answer!' : '❌ Incorrect Answer'}
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

