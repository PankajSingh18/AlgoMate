const rabinKarpLogic = {
  name: "Rabin-Karp Algorithm",

  description:
    "The Rabin-Karp Algorithm is an efficient string matching algorithm that uses a rolling hash function to search for a pattern within a text. It compares hash values instead of comparing every character, making it efficient for multiple pattern searches.",

  category: "String",

  difficulty: "Medium",

  timeComplexity: {
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(n * m)",
  },

  spaceComplexity: "O(1)",

  steps: [
    "Compute the hash value of the pattern.",
    "Compute the hash value of the first text window.",
    "Compare both hash values.",
    "If hashes match, verify by comparing characters.",
    "Slide the window by one position.",
    "Update the rolling hash efficiently.",
    "Repeat until the end of the text.",
  ],

  pseudocode: [
    "Compute patternHash.",
    "Compute first windowHash.",
    "For each window in text:",
    "    If patternHash == windowHash:",
    "        Compare characters.",
    "        If matched, return index.",
    "    Update rolling hash.",
    "Return pattern not found.",
  ],

  applications: [
    "Pattern Matching",
    "Plagiarism Detection",
    "DNA Sequence Analysis",
    "Search Engines",
    "Virus Signature Detection",
    "Bioinformatics",
    "Text Editors",
  ],
};

export default rabinKarpLogic;
