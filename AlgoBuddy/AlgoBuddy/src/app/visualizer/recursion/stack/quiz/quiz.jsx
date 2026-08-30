"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const CallStackQuiz = () => {
  const questions = [
    {
  question: "What is the primary purpose of the call stack?",
  options: [
    "To store arrays",
    "To manage function calls during program execution",
    "To sort data",
    "To store global variables"
  ],
  correctAnswer: 1,
  explanation:
    "The call stack manages active function calls and their execution order."
},
{
  question: "Which data structure is used to implement the call stack?",
  options: [
    "Queue",
    "Stack",
    "Linked List",
    "Heap"
  ],
  correctAnswer: 1,
  explanation:
    "The call stack follows the Last-In, First-Out (LIFO) principle."
},
{
  question: "What happens when a function is called?",
  options: [
    "A stack frame is pushed onto the call stack",
    "The stack is cleared",
    "The function is removed",
    "The heap is emptied"
  ],
  correctAnswer: 0,
  explanation:
    "Each function call creates a new stack frame that is pushed onto the call stack."
},
{
  question: "What happens when a function completes execution?",
  options: [
    "A new frame is created",
    "Its stack frame is popped from the call stack",
    "The stack doubles in size",
    "Nothing happens"
  ],
  correctAnswer: 1,
  explanation:
    "When a function returns, its stack frame is removed from the call stack."
},
{
  question: "What does LIFO stand for?",
  options: [
    "Last In, First Out",
    "Last Input, First Output",
    "Linear Input Function Output",
    "Low Input Fast Output"
  ],
  correctAnswer: 0,
  explanation:
    "Stacks operate on the Last-In, First-Out principle."
},
{
  question: "Which of the following can cause a Stack Overflow error?",
  options: [
    "Infinite recursion without a base case",
    "Sorting an array",
    "Binary Search",
    "Using a queue"
  ],
  correctAnswer: 0,
  explanation:
    "Without a base case, recursive calls continue until the call stack is exhausted."
},
{
  question: "What information is stored inside each stack frame?",
  options: [
    "Local variables and return address",
    "Only global variables",
    "Only arrays",
    "Database records"
  ],
  correctAnswer: 0,
  explanation:
    "Each stack frame stores local variables, parameters, and the return address."
},
{
  question: "Which recursive call returns first?",
  options: [
    "The first function call",
    "The deepest recursive call",
    "The root function",
    "All return together"
  ],
  correctAnswer: 1,
  explanation:
    "The deepest call finishes first because of the LIFO behavior of the call stack."
},
{
  question: "Why is the call stack important in recursion?",
  options: [
    "It keeps track of active recursive function calls",
    "It sorts recursive calls",
    "It reduces recursion depth",
    "It stores only output values"
  ],
  correctAnswer: 0,
  explanation:
    "The call stack manages every recursive call until it returns."
},
{
  question: "What is the maximum call stack depth determined by?",
  options: [
    "The recursion depth before reaching the base case",
    "The number of loops",
    "The array size only",
    "The number of variables"
  ],
  correctAnswer: 0,
  explanation:
    "The maximum stack depth equals the deepest level of active recursive calls."
},
{
  question: "Why is the return address stored in a stack frame?",
  options: [
    "To know where program execution should continue after the function returns",
    "To store the function parameters",
    "To save memory",
    "To sort the call stack"
  ],
  correctAnswer: 0,
  explanation:
    "The return address tells the program where execution should resume once the current function finishes."
},
{
  question: "Which operation occurs first when a recursive function is called?",
  options: [
    "The function immediately returns",
    "A new stack frame is pushed onto the call stack",
    "The stack is cleared",
    "The base case is skipped"
  ],
  correctAnswer: 1,
  explanation:
    "Every recursive function call creates a new stack frame before executing its statements."
},
{
  question: "How does the call stack behave during recursive function returns?",
  options: [
    "Frames are removed in the same order they were added",
    "Frames are removed in reverse order of their addition",
    "All frames are removed simultaneously",
    "Frames remain in memory permanently"
  ],
  correctAnswer: 1,
  explanation:
    "Since the call stack follows LIFO, the most recently added frame returns first."
},
{
  question: "Which of the following best describes stack unwinding?",
  options: [
    "Creating new recursive calls",
    "Removing stack frames as recursive calls return",
    "Sorting the stack frames",
    "Copying stack frames into the heap"
  ],
  correctAnswer: 1,
  explanation:
    "Stack unwinding is the process of popping stack frames after reaching the base case and returning from recursion."
},
{
  question: "What is the relationship between recursion depth and call stack size?",
  options: [
    "They are unrelated",
    "The call stack grows as recursion depth increases",
    "The call stack size always remains constant",
    "The call stack decreases before recursion starts"
  ],
  correctAnswer: 1,
  explanation:
    "Each recursive call adds a new stack frame, so deeper recursion results in a larger call stack."
},
  ];

  return (
    <QuizEngine
      title="Call Stack Visualization Quiz Challenge"
      questions={questions}
    />
  );
};

export default CallStackQuiz;