// Curated database for the progressive DSA roadmap.
// Structured strictly with: Beginner, Intermediate, and Advanced tiers for each topic.
// Maps directly to visualizer pages in lib/visualizerSections.js to provide unified visual learning.

export const practiceData = [
  {
    title: "Array",
    slug: "array",
    desc: "Contiguous collections of memory. Master array traversals, pointer techniques, searching, and sorting.",
    subsections: [
      {
        title: "Beginner",
        items: [
          {
            id: "linear-search",
            name: "Linear Search",
            difficulty: "Easy",
            companies: ["tcs", "infosys", "wipro", "accenture", "amazon", "google"],
            practiceUrl: "https://www.codechef.com/learn/course/searching-sorting/SORTSEARCH1/problems/SESO03",
            visualizerUrl: "/visualizer/array/linearsearch",
            theory: {
              summary: "A simple algorithm that checks every element in the array sequentially until the target is found.",
              steps: [
                "Start from the first element (index 0).",
                "Compare the current element with the target.",
                "If matched, return the current index.",
                "If not matched, move to the next index.",
                "If the end of the array is reached without matching, return -1."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Inefficient for large datasets. Avoid using on sorted arrays where Binary Search is available.",
              tip: "Linear Search serves as the baseline comparison for all searching optimization algorithms."
            }
          },
          {
            id: "binary-search",
            name: "Binary Search",
            difficulty: "Easy",
            companies: ["google", "microsoft", "amazon", "meta", "apple", "adobe", "qualcomm", "nvidia", "intel", "amd"],
            practiceUrl: "https://leetcode.com/problems/binary-search/",
            visualizerUrl: "/visualizer/array/binarysearch",
            theory: {
              summary: "An efficient algorithm that finds a target value within a sorted array by repeatedly dividing the search interval in half.",
              steps: [
                "Ensure the array is sorted.",
                "Set low pointer to index 0, and high pointer to last index.",
                "Calculate mid index as ⌊(low + high) / 2⌋.",
                "If array[mid] equals target, return mid.",
                "If array[mid] is less than target, discard left half by setting low = mid + 1.",
                "If array[mid] is greater than target, discard right half by setting high = mid - 1.",
                "Repeat until low pointer exceeds high pointer."
              ],
              complexity: { time: "O(log N)", space: "O(1)" },
              pitfalls: "Forgetting to sort the array beforehand, or causing integer overflow when calculating mid as (low + high) / 2 instead of low + (high - low) / 2.",
              tip: "Whenever a search problem has a sorted input or requires logarithmic time, think Binary Search."
            }
          }
        ]
      },
      {
        title: "Intermediate",
        items: [
          {
            id: "bubble-sort",
            name: "Bubble Sort",
            difficulty: "Easy",
            companies: ["tcs", "infosys", "wipro", "accenture"],
            practiceUrl: "https://leetcode.com/problems/sort-an-array/",
            visualizerUrl: "/visualizer/array/bubblesort",
            theory: {
              summary: "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
              steps: [
                "Start at index 0.",
                "Compare the element at index i with i + 1.",
                "If array[i] > array[i+1], swap them.",
                "Move index to next element and repeat until the end of the unsorted segment.",
                "With each pass, the largest unsorted element 'bubbles up' to its correct spot.",
                "Repeat for all elements."
              ],
              complexity: { time: "O(N²)", space: "O(1)" },
              pitfalls: "Poor average and worst-case performance. Do not use for large lists.",
              tip: "Bubble sort can be optimized by adding a 'swapped' flag. If a pass completes without any swaps, the array is sorted, and we can terminate early."
            }
          },
          {
            id: "merge-sort",
            name: "Merge Sort",
            difficulty: "Medium",
            companies: ["amazon", "microsoft", "adobe", "uber", "airbnb", "atlassian"],
            practiceUrl: "https://leetcode.com/problems/sort-an-array/",
            visualizerUrl: "/visualizer/array/mergesort",
            theory: {
              summary: "A divide-and-conquer sorting algorithm that splits the array in half, sorts each half recursively, and merges the sorted halves.",
              steps: [
                "If array size is 1 or 0, it is already sorted. Return it.",
                "Find the middle index of the array.",
                "Divide the array into left and right sub-arrays.",
                "Recursively call Merge Sort on left and right sub-arrays.",
                "Merge the two sorted halves back into a single sorted array using pointers."
              ],
              complexity: { time: "O(N log N)", space: "O(N)" },
              pitfalls: "Requires auxiliary linear memory space, making it less memory-efficient than in-place algorithms like Quick Sort.",
              tip: "Merge Sort is highly stable (preserves original order of duplicates) and is widely used for sorting Linked Lists due to constant space merging."
            }
          },
          {
            id: "maximum-subarray",
            name: "Maximum Subarray (Kadane's Algorithm)",
            difficulty: "Medium",
            companies: ["amazon", "microsoft", "google", "meta", "adobe", "flipkart", "swiggy", "zomato"],
            practiceUrl: "https://leetcode.com/problems/maximum-subarray/",
            visualizerUrl: "/visualizer/array/maxsubarray",
            theory: {
              summary: "Find the contiguous subarray within a one-dimensional array of numbers that has the largest sum, using Kadane's Algorithm for an optimal O(N) solution.",
              steps: [
                "Initialize currentSum = 0 and maxSum = -Infinity (or the first element).",
                "Traverse the array from left to right.",
                "At each element, add it to currentSum: currentSum = currentSum + array[i].",
                "Update maxSum = max(maxSum, currentSum) to record the best sum found so far.",
                "If currentSum becomes negative, reset it to 0, since a negative sum can never help a future subarray.",
                "After traversing the full array, maxSum holds the answer."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Resetting currentSum to 0 incorrectly when all elements are negative — in that case the answer is simply the largest (least negative) single element, not 0. Always initialize maxSum with the first element, not 0.",
              tip: "Kadane's Algorithm is a classic example of Dynamic Programming with O(1) space: it only needs the answer 'so far', not a full DP table. It's one of the most frequently asked array problems in interviews."
            }
          },
          {
            id: "two-sum",
            name: "Two Sum",
            difficulty: "Easy",
            companies: ["amazon", "google", "microsoft", "meta", "apple"],
            practiceUrl: "https://leetcode.com/problems/two-sum/",
            visualizerUrl: "/visualizer/array/twosum",
            theory: {
              summary: "Given an array of integers and a target value, find the indices of the two numbers that add up to the target, using a HashMap for an optimal one-pass solution.",
              steps: [
                "Create an empty HashMap to store value → index pairs.",
                "Traverse the array from left to right with index i.",
                "Calculate complement = target - array[i].",
                "Check if complement already exists in the HashMap.",
                "If it exists, return [HashMap[complement], i] as the answer.",
                "If not, insert array[i] → i into the HashMap and continue."
              ],
              complexity: { time: "O(N)", space: "O(N)" },
              pitfalls: "Using the Brute Force nested-loop approach (checking every pair) leads to O(N²) time, which is too slow for large inputs. Also, forgetting to check the HashMap before inserting the current element can cause matching an element with itself.",
              tip: "Two Sum is the most frequently asked entry-level problem in interviews. The HashMap trick of storing 'what we need' (the complement) is a pattern reused in many other array problems."
            }
          },
        ]
      },
      {
        title: "Advanced",
        items: [
          {
            id: "quick-sort",
            name: "Quick Sort",
            difficulty: "Medium",
            companies: ["google", "microsoft", "amazon", "apple", "qualcomm", "intel"],
            practiceUrl: "https://leetcode.com/problems/sort-an-array/",
            visualizerUrl: "/visualizer/array/quicksort",
            theory: {
              summary: "An efficient in-place sorting algorithm that uses a divide-and-conquer strategy to pick a pivot element and partition the array.",
              steps: [
                "Choose an element from the array as the pivot (often the last element).",
                "Partition the array: move all elements smaller than pivot to its left, and larger elements to its right.",
                "Recursively apply Quick Sort to the left and right sub-arrays."
              ],
              complexity: { time: "O(N log N) average", space: "O(log N) stack recursion" },
              pitfalls: "Can degrade to O(N²) worst-case time complexity if the pivot chosen is always the smallest or largest element.",
              tip: "Choose a random pivot element to significantly reduce worst-case risks to a negligible probability."
            }
          }
        ]
      }
    ]
  },
  {
    title: "Linked List",
    slug: "linked-list",
    desc: "Sequential node allocations chained via address pointer link references.",
    subsections: [
      {
        title: "Beginner",
        items: [
          {
            id: "middle-of-linked-list",
            name: "Middle of the Linked List",
            difficulty: "Easy",
            companies: ["amazon", "google"],
            practiceUrl: "https://leetcode.com/problems/middle-of-the-linked-list/",
            visualizerUrl: "/visualizer/linkedlist/operations/traversal",
            theory: {
              summary: "Find the middle node of a singly linked list.",
              steps: [
                "Initialize two pointers, slow and fast, pointing to the head.",
                "Move slow by one step and fast by two steps.",
                "When fast reaches the end, slow will be at the middle."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Not correctly handling the condition for even length lists.",
              tip: "The Tortoise and Hare algorithm is standard for finding the middle node."
            }
          },
          {
            id: "intersection-of-two-linked-lists",
            name: "Intersection of Two Linked Lists",
            difficulty: "Easy",
            companies: ["amazon", "google"],
            practiceUrl: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
            visualizerUrl: "/visualizer/linkedlist/operations/traversal",
            theory: {
              summary: "Find the node at which the intersection of two singly linked lists begins.",
              steps: [
                "Initialize two pointers, pA and pB, at the heads of the two lists.",
                "Traverse both lists. When pA reaches the end, redirect it to the head of list B.",
                "When pB reaches the end, redirect it to the head of list A.",
                "If they intersect, they will meet at the intersection node. Otherwise, they will meet at null."
              ],
              complexity: { time: "O(N+M)", space: "O(1)" },
              pitfalls: "Creating infinite loops if the redirect condition is not handled correctly.",
              tip: "By swapping heads, both pointers travel the exact same distance (lengthA + lengthB)."
            }
          },
          {
            id: "palindrome-linked-list",
            name: "Palindrome Linked List",
            difficulty: "Easy",
            companies: ["amazon", "google"],
            practiceUrl: "https://leetcode.com/problems/palindrome-linked-list/",
            visualizerUrl: "/visualizer/linkedlist/operations/reverse",
            theory: {
              summary: "Given the head of a singly linked list, return true if it is a palindrome.",
              steps: [
                "Find the middle of the linked list.",
                "Reverse the second half of the linked list.",
                "Compare the first half and the reversed second half.",
                "Restore the list (optional) and return the result."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Forgetting to handle odd vs even number of nodes when splitting the list.",
              tip: "Combine the 'Middle of Linked List' and 'Reverse Linked List' algorithms."
            }
          },
          {
            id: "list-traversal",
            name: "Singly Linked List Traversal",
            difficulty: "Easy",
            companies: ["amazon", "microsoft", "google", "adobe", "tcs", "accenture"],
            practiceUrl: "https://leetcode.com/problems/reverse-linked-list/",
            visualizerUrl: "/visualizer/linkedlist/operations/traversal",
            theory: {
              summary: "Traverse a singly linked list sequentially from the head node to the tail node to inspect or print values.",
              steps: [
                "Set a pointer curr = head.",
                "While curr is not null, visit/inspect curr.val.",
                "Advance curr to the next node: curr = curr.next."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Attempting to read properties of null (e.g. curr.next when curr is already null).",
              tip: "Always check if the list head is null before starting any linked list operations."
            }
          },

          
        ]
      },
      {
        title: "Intermediate",
        items: [
          {
            id: "remove-nth-node",
            name: "Remove Nth Node From End of List",
            difficulty: "Medium",
            companies: ["amazon", "microsoft"],
            practiceUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
            visualizerUrl: "/visualizer/linkedlist/operations/deletion",
            theory: {
              summary: "Remove the nth node from the end of the list and return its head.",
              steps: [
                "Use a dummy head pointing to the actual head to handle edge cases like removing the head.",
                "Use two pointers, fast and slow.",
                "Advance fast pointer by n+1 steps.",
                "Move both pointers one step at a time until fast reaches null.",
                "Slow pointer will now be just before the node to remove.",
                "Bypass the target node by setting slow.next = slow.next.next."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Failing to handle the case where the head itself needs to be removed.",
              tip: "A dummy head is standard practice when the head node might be modified or removed."
            }
          },
          {
            id: "lru-cache",
            name: "LRU Cache",
            difficulty: "Medium",
            companies: ["amazon", "google", "microsoft"],
            practiceUrl: "https://leetcode.com/problems/lru-cache/",
            visualizerUrl: "/visualizer/linkedlist/operations/traversal",
            theory: {
              summary: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
              steps: [
                "Use a hash map to store key-node pairs for O(1) access.",
                "Use a doubly linked list to maintain usage order (most recently used at head, least at tail).",
                "On get(), move the accessed node to the head.",
                "On put(), if capacity is reached, remove the tail node and delete from hash map."
              ],
              complexity: { time: "O(1) for get and put", space: "O(capacity)" },
              pitfalls: "Incorrectly updating the prev and next pointers in the doubly linked list.",
              tip: "Dummy head and tail nodes make adding and removing nodes much easier."
            }
          },
          {
            id: "copy-list-random-pointer",
            name: "Copy List with Random Pointer",
            difficulty: "Medium",
            companies: ["amazon", "microsoft"],
            practiceUrl: "https://leetcode.com/problems/copy-list-with-random-pointer/",
            visualizerUrl: "/visualizer/linkedlist/operations/traversal",
            theory: {
              summary: "Construct a deep copy of a linked list where nodes also have a random pointer.",
              steps: [
                "Iterate the list to create a copy of each node, interleaving them with the originals.",
                "Iterate again to assign the random pointers of the copied nodes.",
                "Iterate a third time to separate the original and copied lists."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Modifying the original list permanently without restoring it.",
              tip: "Interleaving the copied nodes saves O(N) space that a hash map would otherwise consume."
            }
          },
          {
            id: "add-two-numbers",
            name: "Add Two Numbers (LL)",
            difficulty: "Medium",
            companies: ["amazon", "google"],
            practiceUrl: "https://leetcode.com/problems/add-two-numbers/",
            visualizerUrl: "/visualizer/linkedlist/operations/traversal",
            theory: {
              summary: "Add two numbers represented by linked lists (digits stored in reverse order).",
              steps: [
                "Initialize a dummy head for the result list and a carry variable to 0.",
                "Traverse both lists, summing the values along with the carry.",
                "Create a new node with the sum % 10, and update carry to sum / 10.",
                "If carry remains after traversal, append a new node with its value."
              ],
              complexity: { time: "O(max(N,M))", space: "O(max(N,M))" },
              pitfalls: "Forgetting to add the final carry if it's non-zero at the end.",
              tip: "Use a dummy head to easily return the result list."
            }
          },
          {
            id: "sort-list",
            name: "Sort List (Merge Sort on LL)",
            difficulty: "Medium",
            companies: ["google", "microsoft"],
            practiceUrl: "https://leetcode.com/problems/sort-list/",
            visualizerUrl: "/visualizer/linkedlist/operations/merge",
            theory: {
              summary: "Sort a linked list in O(n log n) time and O(1) memory (using bottom-up merge sort).",
              steps: [
                "Find the middle of the list using slow and fast pointers.",
                "Recursively sort the left and right halves.",
                "Merge the two sorted halves back together."
              ],
              complexity: { time: "O(N log N)", space: "O(1) for bottom-up, O(log N) for top-down" },
              pitfalls: "Failing to break the link between the two halves before recursion.",
              tip: "Merge sort is the standard algorithm for sorting linked lists because it requires no random access."
            }
          },
          {
            id: "reverse-list",
            name: "Reverse Linked List",
            difficulty: "Easy",
            companies: ["amazon", "microsoft", "google", "adobe", "apple", "meta", "uber", "swiggy", "zomato"],
            practiceUrl: "https://leetcode.com/problems/reverse-linked-list/",
            visualizerUrl: "/visualizer/linkedlist/operations/reverse",
            theory: {
              summary: "Reverse the link directions in a singly linked list in-place so that the head becomes the tail.",
              steps: [
                "Initialize three pointers: prev = NULL, curr = head, next = NULL.",
                "Iterate through the list while curr is not NULL.",
                "Store the next node: next = curr.next.",
                "Reverse curr's pointer to face backward: curr.next = prev.",
                "Advance pointers: prev = curr, curr = next.",
                "After the loop, update head = prev and return it."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Losing reference to the rest of the list when reversing curr.next if you fail to store next first.",
              tip: "Pointer manipulation is best checked by physically drawing nodes and links on scratch paper."
            }
          },
          {
            id: "merge-lists",
            name: "Merge Two Sorted Lists",
            difficulty: "Easy",
            companies: ["amazon", "microsoft", "google", "meta", "adobe", "flipkart", "swiggy"],
            practiceUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
            visualizerUrl: "/visualizer/linkedlist/operations/merge",
            theory: {
              summary: "Combine two pre-sorted linked lists into a single sorted list by splicing their nodes.",
              steps: [
                "Create a dummy header node to start the merged list.",
                "Maintain a tail pointer pointing to the last node of the merged list.",
                "Compare elements at head of list1 and list2.",
                "Attach the smaller node to tail.next.",
                "Advance the pointer of the list that donated the node.",
                "Advance tail.",
                "If either list empties, attach the remainder of the other list directly."
              ],
              complexity: { time: "O(N + M)", space: "O(1)" },
              pitfalls: "Failing to handle empty lists as inputs or forgetting to advance list pointers, which creates infinite loops.",
              tip: "Using a dummy head node completely bypasses complex null pointer checks during initialization."
            }
          },
        ]
      },
      {
        title: "Advanced",
        items: [
          {
            id: "merge-k-sorted-lists",
            name: "Merge K Sorted Lists",
            difficulty: "Hard",
            companies: ["google", "amazon"],
            practiceUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
            visualizerUrl: "/visualizer/linkedlist/operations/merge",
            theory: {
              summary: "Merge an array of k sorted linked lists into one sorted linked list.",
              steps: [
                "Use a min-heap (priority queue) to keep track of the smallest current node among the k lists.",
                "Extract the minimum node, append it to the result list, and push its next node into the heap.",
                "Alternatively, repeatedly merge lists in pairs (Divide and Conquer)."
              ],
              complexity: { time: "O(N log K)", space: "O(K) for heap" },
              pitfalls: "Pushing null nodes into the priority queue, causing crashes.",
              tip: "Divide and Conquer merges pairs of lists until only one remains, achieving the same time complexity without a heap."
            }
          },
          {
            id: "list-cycle",
            name: "Linked List Cycle Detection",
            difficulty: "Easy",
            companies: ["amazon", "microsoft", "google", "meta", "apple", "atlassian", "swiggy", "zomato"],
            practiceUrl: "https://leetcode.com/problems/linked-list-cycle/",
            visualizerUrl: "/visualizer/linkedlist/operations/search",
            theory: {
              summary: "Detect if a linked list contains a loop or cycle using Floyd's Tortoise and Hare pointer algorithm.",
              steps: [
                "Initialize two pointers: slow = head, fast = head.",
                "Iterate through the list while fast and fast.next are not NULL.",
                "Advance slow by 1 node: slow = slow.next.",
                "Advance fast by 2 nodes: fast = fast.next.next.",
                "If slow and fast meet, a cycle is present. Return true.",
                "If loop terminates, no cycle exists. Return false."
              ],
              complexity: { time: "O(N)", space: "O(1)" },
              pitfalls: "Accessing fast.next.next when fast.next is NULL, causing a null pointer exception.",
              tip: "Floyd's algorithm works in constant space O(1) compared to O(N) auxiliary space hashing lookups."
            }
          }
        ]
      },

    ]
  },
  {
    title: "Stack & Queue",
    slug: "stack-queue",
    desc: "LIFO and FIFO collections. Master expression evaluation, min stacks, and deque designs.",
    subsections: [
      {
        title: "Beginner",
        items: [
          {
            id: "push-pop",
            name: "Stack Push & Pop",
            difficulty: "Easy",
            companies: ["amazon", "microsoft", "google", "razorpay", "phonepe"],
            practiceUrl: "https://leetcode.com/problems/min-stack/",
            visualizerUrl: "/visualizer/stack/push-pop",
            theory: {
              summary: "Fundamental LIFO stack operations: Push inserts elements at the top, and Pop retrieves/removes the top element.",
              steps: [
                "Push: Check if stack is full (overflow). Increment top pointer and insert element.",
                "Pop: Check if stack is empty (underflow). Retrieve element at top, decrement top pointer, and return element."
              ],
              complexity: { time: "O(1)", space: "O(1)" },
              pitfalls: "Invoking pop() on an empty stack (underflow) or pushing to a fixed-size stack when full (overflow).",
              tip: "In interviews, stacks are incredibly useful for balancing symbols, parsing expressions, and managing backtracking states."
            }
          },
          {
            id: "enqueue-dequeue",
            name: "Queue Enqueue & Dequeue",
            difficulty: "Easy",
            companies: ["amazon", "microsoft", "infosys", "wipro"],
            practiceUrl: "https://leetcode.com/problems/implement-queue-using-stacks/",
            visualizerUrl: "/visualizer/queue/operations/enqueue-dequeue",
            theory: {
              summary: "Fundamental FIFO queue operations: Enqueue inserts at the rear, and Dequeue removes from the front.",
              steps: [
                "Enqueue: Increment rear pointer and insert item at the rear index.",
                "Dequeue: Retrieve item from the front index and increment front pointer to delete it."
              ],
              complexity: { time: "O(1)", space: "O(1)" },
              pitfalls: "Index shifts in flat array queues leading to 'false overflow' where rear index hits end of array but empty space exists at front.",
              tip: "Use Circular Queues or dynamic Linked List nodes to prevent memory wastage in standard arrays."
            }
          }
        ]
      },
      {
        title: "Intermediate",
        items: [
          {
            id: "postfix-eval",
            name: "Evaluate Reverse Polish Notation",
            difficulty: "Medium",
            companies: ["google", "amazon", "microsoft", "netflix", "uber"],
            practiceUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
            visualizerUrl: "/visualizer/stack/polish/postfix",
            theory: {
              summary: "Using a stack to evaluate arithmetic expressions written in Reverse Polish Notation (RPN), where operators follow operands.",
              steps: [
                "Read the expression tokens from left to right.",
                "If the token is an operand (number), push it onto the stack.",
                "If the token is an operator (+, -, *, /), pop the top two values off the stack.",
                "Apply the operator (second popped operator first).",
                "Push the resulting value back onto the stack.",
                "After reading all tokens, the final result remains on the stack."
              ],
              complexity: { time: "O(N)", space: "O(N)" },
              pitfalls: "Getting the order of operands reversed during subtraction or division operations (e.g., a / b vs b / a).",
              tip: "Postfix notation completely eliminates the need for operator precedence rules and parentheses."
            }
          }
        ]
      },
      {
        title: "Advanced",
        items: [
          {
            id: "min-stack",
            name: "Min Stack",
            difficulty: "Medium",
            companies: ["amazon", "microsoft", "google", "meta", "apple", "adobe", "uber", "airbnb", "phonepe", "razorpay"],
            practiceUrl: "https://leetcode.com/problems/min-stack/",
            visualizerUrl: "/visualizer/stack/push-pop",
            theory: {
              summary: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.",
              steps: [
                "Maintain two standard stacks: primary stack and min stack.",
                "Push: Push the value onto primary stack. Push min(value, minStack.top()) onto min stack.",
                "Pop: Pop off both primary stack and min stack."
              ],
              complexity: { time: "O(1) all operations", space: "O(N)" },
              pitfalls: "Forgetting to sync push/pop operations between both stacks, leading to desynchronized minimums.",
              tip: "An elegant alternative is storing the difference values between the element and the current minimum in a single stack."
            }
          }
        ]
      }
    ]
  },
  {
    title: "Recursion",
    slug: "recursion",
    desc: "Understand base cases, recurrence states, call stack memory, and backtrack decision trees.",
    subsections: [
      {
        title: "Beginner",
        items: [
          {
            id: "basic-recursion",
            name: "Fibonacci Number",
            difficulty: "Easy",
            companies: ["google", "amazon", "microsoft", "apple", "tcs", "accenture"],
            practiceUrl: "https://leetcode.com/problems/fibonacci-number/",
            visualizerUrl: "/visualizer/recursion/basic-recursion",
            theory: {
              summary: "Find the N-th Fibonacci number recursively using standard base cases.",
              steps: [
                "Define base cases: F(0) = 0, F(1) = 1.",
                "Define recurrence: F(N) = F(N-1) + F(N-2).",
                "Return recursively calculated values."
              ],
              complexity: { time: "O(2^N) naive recursion", space: "O(N) recursion stack" },
              pitfalls: "Failing to optimize redundancy, leading to quadratic function frame load speeds.",
              tip: "Utilize memoization or linear loops to reduce Fibonacci execution checks from O(2^N) down to O(N)."
            }
          }
        ]
      },
      {
        title: "Intermediate",
        items: [
          {
            id: "recursive-binary-search",
            name: "Recursive Binary Search",
            difficulty: "Easy",
            companies: ["google", "amazon", "qualcomm", "intel", "amd"],
            practiceUrl: "https://leetcode.com/problems/binary-search/",
            visualizerUrl: "/visualizer/recursion/binary-search",
            theory: {
              summary: "Search a sorted array by evaluating the mid index recursively, passing mid pointers in function arguments.",
              steps: [
                "Base case: If low pointer > high pointer, return -1.",
                "Calculate mid index.",
                "If array[mid] == target, return mid.",
                "If array[mid] < target, recurse on right half: search(mid + 1, high).",
                "If array[mid] > target, recurse on left half: search(low, mid - 1)."
              ],
              complexity: { time: "O(log N)", space: "O(log N) stack frames" },
              pitfalls: "Failing to pass or return the results of sub-calls recursively back up to the caller.",
              tip: "Recursive binary search is elegant, but iterative binary search is more space-efficient (O(1) auxiliary space)."
            }
          },
          {
            id: "tower-of-hanoi",
            name: "Tower of Hanoi",
            difficulty: "Medium",
            companies: ["amazon", "microsoft", "google", "adobe", "oracle"],
            practiceUrl: "https://www.geeksforgeeks.org/problems/tower-of-hanoi-1587115621/1",
            visualizerUrl: "/visualizer/recursion/tower-of-hanoi",
            theory: {
              summary: "A classic mathematical puzzle where you must move N disks from a source peg to a destination peg using an auxiliary peg, following rules that no larger disk can be placed on top of a smaller one.",
              steps: [
                "Move top N-1 disks from Source to Auxiliary peg recursively.",
                "Move the remaining largest N-th disk from Source to Destination peg directly.",
                "Move the N-1 disks from Auxiliary to Destination peg recursively."
              ],
              complexity: { time: "O(2^N)", space: "O(N) stack frames" },
              pitfalls: "Forgetting that the number of moves grows exponentially as 2^N - 1, which causes time limit exceeded for larger N.",
              tip: "The recurrence relation is T(N) = 2T(N-1) + 1. Drawing the recursion tree helps visualize how the total moves double with each added disk."
            }
          }
        ]
      },
      {
        title: "Advanced",
        items: [
          {
            id: "backtracking",
            name: "N-Queens",
            difficulty: "Hard",
            companies: ["amazon", "google", "microsoft", "adobe", "meta", "airbnb", "atlassian", "swiggy", "zomato"],
            practiceUrl: "https://leetcode.com/problems/n-queens/",
            visualizerUrl: "/visualizer/recursion/backtracking",
            theory: {
              summary: "Place N chess queens on an N×N chessboard so that no two queens threaten each other using recursive backtracking.",
              steps: [
                "Start in the leftmost column.",
                "If all queens are placed, return true.",
                "Try all rows in the current column.",
                "For each row, if placement is safe, mark row/col and place queen.",
                "Recursively call placement on the next column.",
                "If sub-call fails, remove queen (backtrack) and try next row."
              ],
              complexity: { time: "O(N!)", space: "O(N)" },
              pitfalls: "Failing to reset safe arrays or coordinates after returning from sub-calls, poisoning adjacent search branches.",
              tip: "Use column/row/diagonal boolean sets to check placement safety in constant O(1) time."
            }
          }
        ]
      }
    ]
  },
  {
    title: "Tree",
    slug: "tree",
    desc: "Hierarchical parent-child node structures. BST operations, balanced traversals, and algorithms.",
    subsections: [
      {
        title: "Beginner",
        items: [
          {
            id: "inorder-traversal",
            name: "Binary Tree Inorder Traversal",
            difficulty: "Easy",
            companies: ["amazon", "microsoft", "google", "adobe", "flipkart", "meesho"],
            practiceUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
            visualizerUrl: "/visualizer/tree/traversing/in-order",
            theory: {
              summary: "A tree traversal method that visits nodes in the order: Left Subtree, Root, Right Subtree.",
              steps: [
                "Recursively traverse the left subtree.",
                "Visit/process the root node.",
                "Recursively traverse the right subtree."
              ],
              complexity: { time: "O(N)", space: "O(H) recursion depth" },
              pitfalls: "Writing recursion without checking if the current node is NULL first.",
              tip: "In a Binary Search Tree (BST), In-order traversal always visits nodes in ascending, sorted order."
            }
          }
        ]
      },
      {
        title: "Intermediate",
        items: [
          {
            id: "lca-tree",
            name: "Lowest Common Ancestor",
            difficulty: "Medium",
            companies: ["amazon", "microsoft", "meta", "google", "apple", "adobe", "atlassian", "swiggy", "uber"],
            practiceUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
            visualizerUrl: "/visualizer/tree/algorithms/lca",
            theory: {
              summary: "Find the deepest node in a tree that is a shared ancestor of two target nodes, p and q.",
              steps: [
                "If current node is NULL, return NULL.",
                "If current node matches p or q, return current.",
                "Recursively call LCA on left and right subtrees.",
                "If both left and right return non-NULL values, current is the LCA.",
                "If only one subtree returns a non-NULL value, return that value up."
              ],
              complexity: { time: "O(N)", space: "O(H)" },
              pitfalls: "Confusing LCA conditions for binary trees vs binary search trees (BSTs).",
              tip: "LCA is highly tested in advanced coding rounds. Practice both recursive and iterative approaches."
            }
          }
        ]
      },
      {
        title: "Advanced",
        items: [
          {
            id: "max-depth",
            name: "Maximum Depth of Binary Tree",
            difficulty: "Easy",
            companies: ["amazon", "google", "microsoft", "meta", "apple", "swiggy", "zomato", "phonepe"],
            practiceUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
            visualizerUrl: "/visualizer/tree/binaryTree/properties",
            theory: {
              summary: "Find the number of nodes along the longest path from the root node down to the farthest leaf node.",
              steps: [
                "Base case: If current node is NULL, return 0.",
                "Recursively compute depth of left subtree.",
                "Recursively compute depth of right subtree.",
                "Return max(leftDepth, rightDepth) + 1."
              ],
              complexity: { time: "O(N)", space: "O(H)" },
              pitfalls: "Forgetting to add 1 to the final return value to account for the current root node.",
              tip: "Maximum depth is the identical calculation as height of a tree node."
            }
          }
        ]
      }
    ]
  },
  {
    title: "Graph",
    slug: "graph",
    desc: "Network vertices and edges. Master graph traversals, shortest path calculations, and topological sorting.",
    subsections: [
      {
        title: "Beginner",
        items: [
          {
            id: "bfs-graph",
            name: "BFS Traversal",
            difficulty: "Medium",
            companies: ["amazon", "meta", "google", "microsoft", "uber", "flipkart", "swiggy", "zomato"],
            practiceUrl: "https://leetcode.com/problems/clone-graph/",
            visualizerUrl: "/visualizer/graph/bfs",
            theory: {
              summary: "Explore graph vertices level-by-level, visiting all immediate neighbors before expanding.",
              steps: [
                "Create an empty FIFO Queue and a 'visited' set.",
                "Enqueue the starting node and add it to 'visited'.",
                "While queue is not empty, dequeue current node and process it.",
                "For each unvisited neighbor of current, mark it visited and enqueue it."
              ],
              complexity: { time: "O(V + E)", space: "O(V)" },
              pitfalls: "Forgetting to mark nodes visited immediately on enqueue, causing duplicate node processing.",
              tip: "BFS always identifies shortest paths in unweighted networks."
            }
          }
        ]
      },
      {
        title: "Intermediate",
        items: [
          {
            id: "dfs-graph",
            name: "DFS Traversal",
            difficulty: "Medium",
            companies: ["amazon", "meta", "google", "microsoft", "uber", "flipkart", "swiggy", "zomato"],
            practiceUrl: "https://leetcode.com/problems/clone-graph/",
            visualizerUrl: "/visualizer/graph/dfs",
            theory: {
              summary: "Explore graph paths as deep as possible along each branch before backtracking.",
              steps: [
                "Define a recursive DFS function taking node and visited set.",
                "Mark current node as visited and process it.",
                "For each neighbor of current, if unvisited, recursively invoke DFS."
              ],
              complexity: { time: "O(V + E)", space: "O(V) call stack frames" },
              pitfalls: "Failing to pass the visited set, resulting in infinite recursion loops in cyclic graphs.",
              tip: "DFS is excellent for pathfinding, cycles detection, and topological sorting."
            }
          }
        ]
      },
      {
        title: "Advanced",
        items: [
          {
            id: "dijkstra-graph",
            name: "Dijkstra's Algorithm",
            difficulty: "Medium",
            companies: ["google", "amazon", "microsoft", "uber", "airbnb", "swiggy", "zomato"],
            practiceUrl: "https://leetcode.com/problems/network-delay-time/",
            visualizerUrl: "/visualizer/graph/dijkstra",
            theory: {
              summary: "A greedy algorithm that finds the shortest path from a single source node to all other nodes in a weighted graph.",
              steps: [
                "Initialize distance array with Infinity, source distance = 0.",
                "Create a min-priority queue storing [node, distance].",
                "Insert [source, 0] into priority queue.",
                "While priority queue is not empty, pop node with smallest distance, u.",
                "For each weighted neighbor v of u, check if dist[u] + weight < dist[v].",
                "If true (relaxation), update dist[v] = dist[u] + weight and push [v, dist[v]] to priority queue."
              ],
              complexity: { time: "O((V + E) log V)", space: "O(V)" },
              pitfalls: "Attempting to run Dijkstra on a graph with negative edge weights.",
              tip: "Use the Bellman-Ford algorithm if the graph contains negative weights."
            }
          }
        ]
      }
    ]
  },
  {
    title: "Dynamic Programming",
    slug: "dp",
    desc: "Optimize recursive decisions by caching subproblems (memoization) or solving bottom-up (tabulation).",
    subsections: [
      {
        title: "Beginner",
        items: [
          {
            id: "climbing-stairs",
            name: "Climbing Stairs",
            difficulty: "Easy",
            companies: ["google", "microsoft", "amazon", "adobe", "apple", "flipkart", "meesho", "phonepe", "razorpay"],
            practiceUrl: "https://leetcode.com/problems/climbing-stairs/",
            visualizerUrl: null,
            theory: {
              summary: "Calculate how many distinct ways you can climb N stairs when you can take either 1 or 2 steps at a time.",
              steps: [
                "Identify subproblem: To reach step N, you must come from N-1 or N-2.",
                "Recurrence relation: ways(N) = ways(N-1) + ways(N-2).",
                "Initialize base states: ways(1) = 1, ways(2) = 2.",
                "Iteratively build states bottom-up."
              ],
              complexity: { time: "O(N)", space: "O(1) with pointer storage optimizations" },
              pitfalls: "Using naive recursion without caching, causing O(2^N) exponential timeouts.",
              tip: "Climbing Stairs is mathematically equivalent to the Fibonacci sequence!"
            }
          }
        ]
      },
      {
        title: "Intermediate",
        items: [
          {
            id: "coin-change",
            name: "Coin Change",
            difficulty: "Medium",
            companies: ["google", "microsoft", "amazon", "adobe", "netflix", "uber", "airbnb", "atlassian", "salesforce", "flipkart"],
            practiceUrl: "https://leetcode.com/problems/coin-change/",
            visualizerUrl: null,
            theory: {
              summary: "Find the minimum number of coins needed to sum to a target amount using an infinite supply of coin denominations.",
              steps: [
                "Initialize DP array size (amount + 1) with Infinity, DP[0] = 0.",
                "For each amount i from 1 to target, try all coins.",
                "If coin <= i, DP[i] = min(DP[i], DP[i - coin] + 1)."
              ],
              complexity: { time: "O(amount * number of coins)", space: "O(amount)" },
              pitfalls: "Failing to check if amount can be reached (returning -1 instead of Infinity).",
              tip: "This is a classic variation of the Knapsack optimization problem."
            }
          }
        ]
      },
      {
        title: "Advanced",
        items: [
          {
            id: "lcs-dp",
            name: "Longest Common Subsequence",
            difficulty: "Medium",
            companies: ["google", "microsoft", "amazon", "meta", "adobe", "apple", "qualcomm", "nvidia"],
            practiceUrl: "https://leetcode.com/problems/longest-common-subsequence/",
            visualizerUrl: null,
            theory: {
              summary: "Find the length of the longest subsequence common to two text strings, recursively comparing matching characters.",
              steps: [
                "Create a 2D grid DP of dimensions (len1+1) × (len2+1) initialized with 0.",
                "If characters match: DP[i][j] = DP[i-1][j-1] + 1.",
                "If mismatch: DP[i][j] = max(DP[i-1][j], DP[i][j-1])."
              ],
              complexity: { time: "O(N * M)", space: "O(N * M)" },
              pitfalls: "Miscounting index bounds (always use 1-based indexing in DP grid for simple empty string edge cases).",
              tip: "LCS is the algorithmic foundation for file comparison tools (like `git diff`) and DNA alignments."
            }
          }
        ]
      }
    ]
  }
];
