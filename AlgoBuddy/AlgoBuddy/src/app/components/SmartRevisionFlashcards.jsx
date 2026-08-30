"use client";

import React, { useState, useEffect } from "react";

const flashcards = {
  Easy: [
    {
      topic: "Array",
      question: "What is an Array?",
      answer: "A collection of elements stored in contiguous memory.",
      explanation:
        "Arrays store elements sequentially in memory, allowing direct access using indexes in O(1) time."
    },
    {
      topic: "Stack",
      question: "Which principle does Stack follow?",
      answer: "LIFO (Last In First Out).",
      explanation:
        "The last element inserted into the stack is the first one removed."
    },
  ],

  Medium: [
    {
      topic: "Binary Search",
      question: "What is the time complexity of Binary Search?",
      answer: "O(log n)",
      explanation:
        "Binary Search repeatedly divides the search space into two halves."
    },
    {
      topic: "Merge Sort",
      question: "What is the average time complexity of Merge Sort?",
      answer: "O(n log n)",
      explanation:
        "Merge Sort uses divide and conquer and merges sorted subarrays."
    },
  ],

  Hard: [
    {
      topic: "AVL Tree",
      question: "What is the purpose of AVL Tree rotations?",
      answer: "To keep the tree balanced after insertions and deletions.",
      explanation:
        "Rotations maintain balance factors and keep operations O(log n)."
    },
    {
      topic: "Dynamic Programming",
      question: "What is memoization?",
      answer: "Storing results of expensive computations to avoid recalculation.",
      explanation:
        "Memoization saves previously computed results to avoid repeated work."
    },
  ],
};

export default function SmartRevisionFlashcards() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [monthlyScore, setMonthlyScore] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  const [easyCompleted, setEasyCompleted] = useState(0);
  const [mediumCompleted, setMediumCompleted] = useState(0);
  const [hardCompleted, setHardCompleted] = useState(0);
  const [streak, setStreak] = useState(1);
  const [history, setHistory] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [weakTopics, setWeakTopics] = useState([]);
  const [recommendedDifficulty, setRecommendedDifficulty] = useState("Easy");
  const [favorites, setFavorites] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [showSummary, setShowSummary] = useState(false);
  const [badges, setBadges] = useState([]);

  const toggleFavorite = () => {
  const currentCard = currentCards[index];

  const exists = favorites.find(
    (card) => card.question === currentCard.question
  );

  if (exists) {
    setFavorites(
      favorites.filter(
        (card) => card.question !== currentCard.question
      )
    );
  } else {
    setFavorites([...favorites, currentCard]);
  }
};

  const topics = [
  "All",
  "Array",
  "Stack",
  "Binary Search",
  "Merge Sort",
  "AVL Tree",
  "Dynamic Programming",
];

  let currentCards =
  selectedTopic === "All"
    ? flashcards[difficulty]
    : flashcards[difficulty].filter(
        (card) => card.topic === selectedTopic
      );

currentCards = currentCards.filter((card) =>
  card.topic.toLowerCase().includes(searchTerm.toLowerCase())
);

if (sortOption === "az") {
  currentCards = [...currentCards].sort((a, b) =>
    a.topic.localeCompare(b.topic)
  );
}

if (sortOption === "za") {
  currentCards = [...currentCards].sort((a, b) =>
    b.topic.localeCompare(a.topic)
  );
}

      const generateDailyChallenge = () => {
  const allCards = [
    ...flashcards.Easy,
    ...flashcards.Medium,
    ...flashcards.Hard,
  ];

  const randomCard =
    allCards[Math.floor(Math.random() * allCards.length)];

  setDailyChallenge(randomCard);
  setChallengeCompleted(false);
};

useEffect(() => {
  generateDailyChallenge();
}, []);

useEffect(() => {
  generateAIRecommendations();
}, [
  history,
  easyCompleted,
  mediumCompleted,
  hardCompleted,
]);

useEffect(() => {
  checkAchievements();
}, [
  streak,
  completedCards,
  hardCompleted,
]);

      if (currentCards.length === 0) {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Smart Revision Flashcards
      </h2>

      <p className="text-gray-400">
        No flashcards available for this topic.
      </p>
    </div>
  );
}

const difficultyPoints = {
  Easy: 5,
  Medium: 10,
  Hard: 20,
};

const generateAIRecommendations = () => {
  const topicCounts = {};

  history.forEach((topic) => {
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });

  const weak = Object.keys(topicCounts)
    .sort((a, b) => topicCounts[a] - topicCounts[b])
    .slice(0, 3);

  setWeakTopics(weak);

  if (hardCompleted < 5) {
    setRecommendedDifficulty("Hard");
  } else if (mediumCompleted < 5) {
    setRecommendedDifficulty("Medium");
  } else {
    setRecommendedDifficulty("Easy");
  }
};

const checkAchievements = () => {
  const earnedBadges = [];

  if (streak >= 3) {
    earnedBadges.push("🔥 3-Day Revision Streak");
  }

  if (streak >= 7) {
    earnedBadges.push("🚀 7-Day Revision Streak");
  }

  if (streak >= 30) {
    earnedBadges.push("👑 30-Day Revision Master");
  }

  if (completedCards >= 100) {
    earnedBadges.push("🏆 100 Flashcards Completed");
  }

  if (hardCompleted >= 25) {
    earnedBadges.push("💎 Hard Difficulty Expert");
  }

  setBadges(earnedBadges);
};

const totalCards =
  flashcards.Easy.length +
  flashcards.Medium.length +
  flashcards.Hard.length;

const progressPercentage = Math.min(
  (completedCards / totalCards) * 100,
  100
);

  const nextCard = () => {
  const points = difficultyPoints[difficulty];

  const newTotal = totalScore + points;

  setTotalScore(newTotal);
  setWeeklyScore((prev) => prev + points);
  setMonthlyScore((prev) => prev + points);

  setCompletedCards((prev) => prev + 1);

if (difficulty === "Easy") {
  setEasyCompleted((prev) => prev + 1);
}

if (difficulty === "Medium") {
  setMediumCompleted((prev) => prev + 1);
}

if (difficulty === "Hard") {
  setHardCompleted((prev) => prev + 1);
}

setHistory((prev) => [
  ...prev,
  currentCards[index].topic,
]);

  if (newTotal > personalBest) {
    setPersonalBest(newTotal);
  }

  setIndex((index + 1) % currentCards.length);
  setShowAnswer(false);
};

  const previousCard = () => {
  setIndex((index - 1 + currentCards.length) % currentCards.length);
  setShowAnswer(false);
};

const attemptedQuestions =
  correctAnswers + incorrectAnswers;

const accuracy =
  attemptedQuestions === 0
    ? 0
    : (
        (correctAnswers / attemptedQuestions) *
        100
      ).toFixed(1);

const timeSpent = Math.floor(
  (Date.now() - sessionStartTime) / 1000
);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Smart Revision Flashcards
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-5">
  <div className="bg-slate-800 p-3 rounded">
    <p className="text-xs text-gray-400">Total Score</p>
    <p className="text-xl font-bold text-green-400">
      {totalScore}
    </p>
  </div>

  <div className="bg-slate-800 p-4 rounded-lg mb-5">
  <div className="flex justify-between items-center mb-3">
    <h3 className="font-bold text-lg">
      🎯 Daily Revision Challenge
    </h3>

    <button
      onClick={generateDailyChallenge}
      className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700"
    >
      New Challenge
    </button>
  </div>

  {dailyChallenge && (
    <>
      <p className="text-purple-300 mb-2">
        Topic: {dailyChallenge.topic}
      </p>

      <p className="mb-3">
        {dailyChallenge.question}
      </p>

      {!challengeCompleted ? (
        <button
          onClick={() => {
  setChallengeCompleted(true);

  setTotalScore((prev) => prev + 25);

  setWeeklyScore((prev) => prev + 25);

  setMonthlyScore((prev) => prev + 25);

  const updatedScore = totalScore + 25;

  if (updatedScore > personalBest) {
    setPersonalBest(updatedScore);
  }
}}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Complete Challenge
        </button>
      ) : (
        <div>
          <p className="text-green-400 font-semibold">
            ✓ Challenge Completed
          </p>

          <p className="text-yellow-400 mt-2">
            🏆 Daily Reward Earned
          </p>
        </div>
      )}
    </>
  )}
</div>

  <div className="bg-slate-800 p-3 rounded">
    <p className="text-xs text-gray-400">Weekly Score</p>
    <p className="text-xl font-bold text-blue-400">
      {weeklyScore}
    </p>
  </div>

  <div className="bg-slate-800 p-3 rounded">
    <p className="text-xs text-gray-400">Monthly Score</p>
    <p className="text-xl font-bold text-yellow-400">
      {monthlyScore}
    </p>
  </div>

  <div className="bg-slate-800 p-3 rounded">
    <p className="text-xs text-gray-400">Personal Best</p>
    <p className="text-xl font-bold text-purple-400">
      {personalBest}
    </p>
  </div>
  <div className="bg-slate-800 p-3 rounded">
  <p className="text-xs text-gray-400">
    Favorites
  </p>

  <p className="text-xl font-bold text-yellow-400">
    {favorites.length}
  </p>
</div>
</div>

      <div
        onClick={() => setShowAnswer(!showAnswer)}
        className={`
          bg-slate-800
          p-5
          rounded-lg
          min-h-[180px]
          cursor-pointer
          transition-all
          duration-500
          hover:scale-105
          flex
          flex-col
          justify-center
          items-center
          text-center
          ${showAnswer ? "scale-105 shadow-lg" : ""}
        `}
      >
  <div className="flex justify-between items-center w-full mb-3">
  <h3 className="text-lg font-bold">
    {currentCards[index].topic}
  </h3>

  <p className="text-xs text-gray-400">
    Card {index + 1} of {currentCards.length}
  </p>

  <button
    onClick={(e) => {
      e.stopPropagation();
      toggleFavorite();
    }}
    className="text-yellow-400 text-xl"
  >
    ⭐
  </button>
</div>

  {!showAnswer ? (
    <>
      <p className="text-lg">
        {currentCards[index].question}
      </p>

      <p className="mt-4 text-sm text-gray-400">
        Click card to reveal answer
      </p>
    </>
  ) : (
  <>
    <p className="text-green-400 text-lg font-semibold">
      {currentCards[index].answer}
    </p>

    <div className="mt-4 p-3 bg-slate-700 rounded-lg">
      <h4 className="font-semibold text-purple-300 mb-2">
        Detailed Explanation
      </h4>

      <p className="text-sm text-gray-200">
        {currentCards[index].explanation}
      </p>
    </div>

    <p className="mt-4 text-sm text-gray-400">
      Click card to see question
    </p>
  </>
)}
</div>

<div className="mt-5">
  <input
    type="text"
    placeholder="Search revision topics..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setIndex(0);
    }}
    className="w-full p-3 rounded bg-slate-800 border border-slate-700"
  />
</div>

<div className="mt-3">
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="w-full p-3 rounded bg-slate-800 border border-slate-700"
  >
    <option value="default">Default Order</option>
    <option value="az">A → Z Topics</option>
    <option value="za">Z → A Topics</option>
  </select>
</div>

<div className="mt-5">
  <h3 className="text-sm text-gray-400 mb-2">
    Select Topic
  </h3>

  <div className="flex flex-wrap gap-2">
    {topics.map((topic) => (
      <button
        key={topic}
        onClick={() => {
          setSelectedTopic(topic);
          setIndex(0);
          setShowAnswer(false);
        }}
        className={`px-3 py-2 rounded transition ${
          selectedTopic === topic
            ? "bg-purple-600 text-white"
            : "bg-slate-700 hover:bg-slate-600"
        }`}
      >
        {topic}
      </button>
    ))}
  </div>
</div>

      <div className="mt-5 flex gap-2">
        {["Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level);
              setIndex(0);
              setShowAnswer(false);
            }}
            className="px-3 py-2 bg-slate-700 rounded hover:bg-slate-600"
          >
            {level}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-green-400">
  Current Difficulty Reward: +{difficultyPoints[difficulty]} points
</p>

<div className="mt-5 bg-slate-800 p-4 rounded-lg">
  <h3 className="font-bold text-lg mb-3">
    Revision Analytics
  </h3>

  <p>Completed Cards: {completedCards}</p>

  <p>Easy Completed: {easyCompleted}</p>

  <p>Medium Completed: {mediumCompleted}</p>

  <p>Hard Completed: {hardCompleted}</p>

  <p>Daily Streak: 🔥 {streak} Days</p>
</div>

<div className="mt-5 bg-slate-800 p-4 rounded-lg">
  <h3 className="font-bold text-lg mb-3">
    🤖 AI Personalized Revision
  </h3>

  <p className="mb-2">
    Recommended Difficulty:
    <span className="ml-2 text-green-400 font-semibold">
      {recommendedDifficulty}
    </span>
  </p>

  <p className="mb-2">
    Topics Needing Revision:
  </p>

  <ul className="text-sm text-gray-300">
    {weakTopics.length > 0 ? (
      weakTopics.map((topic, idx) => (
        <li key={idx}>📌 {topic}</li>
      ))
    ) : (
      <li>No revision data yet.</li>
    )}
  </ul>

  <p className="mt-3 text-purple-400">
    AI Suggestion: Focus on weaker topics first.
  </p>
</div>

<div className="mt-5 bg-slate-800 p-4 rounded-lg">
  <h3 className="font-bold text-lg mb-3">
    🏅 Achievement Badges
  </h3>

  {badges.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, idx) => (
        <span
          key={idx}
          className="px-3 py-2 bg-yellow-600 rounded-full text-sm"
        >
          {badge}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-gray-400">
      No badges earned yet.
    </p>
  )}
</div>

<div className="mt-4">
  <div className="flex justify-between text-sm mb-1">
    <span>Overall Progress</span>
    <span>{progressPercentage.toFixed(0)}%</span>
  </div>

  <div className="w-full bg-slate-700 rounded-full h-3">
    <div
      className="bg-green-500 h-3 rounded-full transition-all"
      style={{
        width: `${progressPercentage}%`,
      }}
    />
  </div>
</div>

<div className="mt-4">
  <h3 className="font-semibold mb-2">
    Revision History
  </h3>

  <ul className="text-sm text-gray-300">
    {history.slice(-5).map((item, idx) => (
      <li key={idx}>• {item}</li>
    ))}
  </ul>
</div>

<div className="mt-5 bg-slate-800 p-4 rounded-lg">
  <h3 className="font-semibold mb-3">
    Recently Revised Topics
  </h3>

  {[...new Set(history)]
    .slice(-5)
    .map((topic, idx) => (
      <p key={idx}>🔹 {topic}</p>
    ))}
</div>

<div className="mt-5 bg-slate-800 p-4 rounded-lg">
  <h3 className="font-bold text-lg mb-3">
    ⭐ Favorite Flashcards
  </h3>

  {favorites.length === 0 ? (
    <p className="text-gray-400">
      No bookmarked flashcards yet.
    </p>
  ) : (
    favorites.map((card, idx) => (
      <div
        key={idx}
        className="mb-3 p-3 bg-slate-700 rounded"
      >
        <p className="text-purple-300 font-semibold">
          {card.topic}
        </p>

        <p className="text-white">
          {card.question}
        </p>
      </div>
    ))
  )}
</div>

<div className="mt-5 flex gap-3">
  <button
    onClick={() => {
      setCorrectAnswers((prev) => prev + 1);
      nextCard();
    }}
    className="w-1/2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
  >
    ✅ Correct
  </button>

  <button
    onClick={() => {
      setIncorrectAnswers((prev) => prev + 1);
      nextCard();
    }}
    className="w-1/2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
  >
    ❌ Incorrect
  </button>
</div>

<div className="mt-5 flex gap-3">
  <button
    onClick={previousCard}
    className="w-1/2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
  >
    Previous
  </button>

  <button
    onClick={nextCard}
    className="w-1/2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
  >
    Next
  </button>
</div>
<button
  onClick={() => setShowSummary(true)}
  className="mt-4 w-full px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
>
  📊 View Session Report
</button>

{showSummary && (
  <div className="mt-6 bg-slate-800 p-5 rounded-lg">
    <h3 className="text-xl font-bold mb-4">
      📊 Revision Session Summary
    </h3>

    <p>
      Questions Attempted: {attemptedQuestions}
    </p>

    <p>
      Correct Answers: {correctAnswers}
    </p>

    <p>
      Incorrect Answers: {incorrectAnswers}
    </p>

    <p>
      Accuracy: {accuracy}%
    </p>

    <p>
      Time Spent: {timeSpent} seconds
    </p>

    <p className="mt-3 text-yellow-400">
      Suggested Improvement Areas:
    </p>

    <ul className="text-sm text-gray-300">
      {weakTopics.length > 0 ? (
        weakTopics.map((topic, idx) => (
          <li key={idx}>📌 {topic}</li>
        ))
      ) : (
        <li>No weak topics detected.</li>
      )}
    </ul>
  </div>
)}

      <div className="mt-4 text-sm text-gray-400">
        Progress: {index + 1}/{currentCards.length} cards completed
        {" • "}
        {Math.round(((index + 1) / currentCards.length) * 100)}%
      </div>
    </div>
  );
}
