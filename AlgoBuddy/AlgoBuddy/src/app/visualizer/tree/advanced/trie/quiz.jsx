"use client";
import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const quizzes = {
  insertion: [
    {
      question: "What is the time complexity of inserting a word of length L into a Trie?",
      options: ["O(L)", "O(1)", "O(N * L)", "O(log N)"],
      answer: 0,
      explanation: "We traverse the Trie down one level for each character in the word. Thus, for a word of length L, the time complexity is exactly O(L)."
    },
    {
      question: "What does the 'isEndOfWord' flag signify in a TrieNode?",
      options: [
        "That the node has no children",
        "That a valid inserted word terminates at this exact node",
        "That the node is a leaf node",
        "That the Trie is full"
      ],
      answer: 1,
      explanation: "A node might have children but still be the end of a word (e.g., if 'app' and 'apple' are both inserted, the second 'p' isEndOfWord but still has child 'l')."
    }
  ],
  searching: [
    {
      question: "If we search for 'cat' and reach the node for 't', but its 'isEndOfWord' is false, what does it mean?",
      options: [
        "The word 'cat' exists in the Trie",
        "The word 'cat' does not exist, but is a prefix for another word like 'category'",
        "The Trie is broken",
        "We should search the children of 't' for 'cat'"
      ],
      answer: 1,
      explanation: "If isEndOfWord is false, it means 'cat' was never inserted as a full word, but its characters exist because a longer word starting with 'cat' was inserted."
    }
  ],
  "prefix-search": [
    {
      question: "How does StartsWith (Prefix Search) differ from regular Search in a Trie?",
      options: [
        "Prefix Search is slower than regular Search",
        "Prefix Search checks the isEndOfWord flag, Search does not",
        "Prefix Search does NOT check the isEndOfWord flag on the final node",
        "Prefix Search iterates backwards"
      ],
      answer: 2,
      explanation: "For StartsWith, we only care that a path exists for the prefix characters. It does not matter if the final node is marked as the end of a word."
    }
  ]
};

const Quiz = ({ mode }) => {
  const activeQuizList = quizzes[mode] || quizzes.insertion;
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeQuestion = activeQuizList[quizIdx];

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
    setQuizIdx((prev) => (prev + 1) % activeQuizList.length);
  };

  return (
    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Knowledge Check
        </h3>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          Question {quizIdx + 1} of {activeQuizList.length}
        </span>
      </div>

      <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 mb-6 leading-relaxed">
        {activeQuestion.question}
      </p>

      <div className="flex flex-col gap-3">
        {activeQuestion.options.map((option, idx) => {
          let optionStyle = "border-gray-200 dark:border-[#333] hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-[#1a1a1a]";
          let textStyle = "text-slate-700 dark:text-slate-300";
          let icon = null;

          if (quizSubmitted) {
            if (idx === activeQuestion.answer) {
              optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
              textStyle = "text-emerald-800 dark:text-emerald-400 font-medium";
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            } else if (selectedOption === idx) {
              optionStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/30";
              textStyle = "text-rose-800 dark:text-rose-400";
              icon = <XCircle className="w-5 h-5 text-rose-500" />;
            } else {
              optionStyle = "border-gray-100 dark:border-[#222] opacity-50";
            }
          } else if (selectedOption === idx) {
            optionStyle = "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 ring-1 ring-indigo-500";
            textStyle = "text-indigo-800 dark:text-indigo-300 font-medium";
          }

          return (
            <button
              key={idx}
              onClick={() => handleQuizAnswer(idx)}
              disabled={quizSubmitted}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${optionStyle}`}
            >
              <span className={textStyle}>{option}</span>
              {icon}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex-1">
          {quizSubmitted && (
            <p className={`text-sm p-4 rounded-xl font-medium ${
              selectedOption === activeQuestion.answer
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50"
            }`}>
              <strong className="block mb-1">Explanation:</strong>
              {activeQuestion.explanation}
            </p>
          )}
        </div>
        <div className="ml-6 shrink-0">
          {!quizSubmitted ? (
            <button
              onClick={submitQuiz}
              disabled={selectedOption === null}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={nextQuizQuestion}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-gray-100 dark:text-slate-900 text-white text-sm font-bold rounded-xl transition-all"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
