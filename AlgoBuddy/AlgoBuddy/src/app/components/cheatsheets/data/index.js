import { sortingCheatsheets } from "./sorting";
import { searchingCheatsheets } from "./searching";
import { treesCheatsheets } from "./trees";
import { graphsCheatsheets } from "./graphs";
import { linkedListCheatsheets } from "./linkedlist";
import { stackCheatsheets } from "./stack";
import { queueCheatsheets } from "./queue";
import { hashMapCheatsheets } from "./hashmap";
import { recursionCheatsheets } from "./recursion";

export const allCheatsheets = [
  ...sortingCheatsheets,
  ...searchingCheatsheets,
  ...treesCheatsheets,
  ...graphsCheatsheets,
  ...linkedListCheatsheets,
  ...stackCheatsheets,
  ...queueCheatsheets,
  ...hashMapCheatsheets,
  ...recursionCheatsheets,
];

export const categories = [
  { id: "sorting", name: "Sorting", description: "Comparison and non-comparison based sorting algorithms", icon: "sort-asc" },
  { id: "searching", name: "Searching", description: "Linear and logarithmic search algorithms", icon: "search" },
  { id: "trees", name: "Trees", description: "Tree data structures and operations", icon: "tree" },
  { id: "graphs", name: "Graphs", description: "Graph traversal and path-finding algorithms", icon: "share" },
  { id: "linked-list", name: "Linked Lists", description: "Singly and doubly linked list implementations", icon: "list" },
  { id: "stack", name: "Stacks", description: "LIFO data structure and its applications", icon: "layers" },
  { id: "queue", name: "Queues", description: "FIFO data structure and its variants", icon: "list-ordered" },
  { id: "hashmap", name: "Hash Maps", description: "Key-value storage and hash-based lookups", icon: "table" },
  { id: "recursion", name: "Recursion", description: "Recursive problem-solving patterns", icon: "repeat" },
];

export function getCheatsheetById(id) {
  return allCheatsheets.find((c) => c.id === id);
}

export function getCheatsheetsByCategory(categoryId) {
  return allCheatsheets.filter((c) => c.category === categoryId);
}
