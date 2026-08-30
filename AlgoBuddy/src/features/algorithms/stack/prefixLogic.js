/**
 * Pure generator/function for converting Infix to Prefix.
 * Returns an array of frames representing the conversion state.
 */
export function generateInfixToPrefixSteps(infix) {
  if (!infix || !infix.trim()) {
    return { error: "Please enter an infix expression" };
  }

  const precedence = { "^": 4, "*": 3, "/": 3, "+": 2, "-": 2 };
  const conversionSteps = [];
  let tempStack = [];
  let tempOutput = [];

  /* 1. reverse */
  const reversed = infix.split("").reverse().join("");
  conversionSteps.push({
    stack: [],
    output: [],
    char: "",
    action: "Reverse infix",
    description: `Reversed: ${reversed}`,
  });

  /* 2. swap parentheses */
  const swapped = reversed.replace(/[()]/g, (c) => (c === "(" ? ")" : "("));
  conversionSteps.push({
    stack: [],
    output: [],
    char: "",
    action: "Swap parentheses",
    description: `Swapped: ${swapped}`,
  });

  /* 3. postfix on swapped */
  for (const ch of swapped) {
    if (/[a-zA-Z0-9]/.test(ch)) {
      tempOutput.push(ch);
      conversionSteps.push({
        stack: [...tempStack],
        output: [...tempOutput],
        char: ch,
        action: "Add operand",
        description: `Added operand "${ch}"`,
      });
    } else if (ch === "(") {
      tempStack.push(ch);
      conversionSteps.push({
        stack: [...tempStack],
        output: [...tempOutput],
        char: ch,
        action: "Push to stack",
        description: `Pushed "("`,
      });
    } else if (ch === ")") {
      while (tempStack.length && tempStack[tempStack.length - 1] !== "(") {
        const popped = tempStack.pop();
        tempOutput.push(popped);
        conversionSteps.push({
          stack: [...tempStack],
          output: [...tempOutput],
          char: popped,
          action: "Pop from stack",
          description: `Popped "${popped}"`,
        });
      }
      tempStack.pop(); // remove '('
      conversionSteps.push({
        stack: [...tempStack],
        output: [...tempOutput],
        char: "(",
        action: "Remove from stack",
        description: `Removed "("`,
      });
    } else {
      while (
        tempStack.length &&
        tempStack[tempStack.length - 1] !== "(" &&
        precedence[ch] <= precedence[tempStack[tempStack.length - 1]]
      ) {
        const popped = tempStack.pop();
        tempOutput.push(popped);
        conversionSteps.push({
          stack: [...tempStack],
          output: [...tempOutput],
          char: popped,
          action: "Pop higher precedence",
          description: `Popped higher precedence "${popped}"`,
        });
      }
      tempStack.push(ch);
      conversionSteps.push({
        stack: [...tempStack],
        output: [...tempOutput],
        char: ch,
        action: "Push operator",
        description: `Pushed "${ch}"`,
      });
    }
  }

  while (tempStack.length) {
    const popped = tempStack.pop();
    tempOutput.push(popped);
    conversionSteps.push({
      stack: [...tempStack],
      output: [...tempOutput],
      char: popped,
      action: "Pop remaining",
      description: `Popped remaining "${popped}"`,
    });
  }

  /* 4. reverse to get prefix */
  const prefixResult = tempOutput.reverse().join(" ");
  conversionSteps.push({
    stack: [],
    output: [...tempOutput],
    char: "",
    action: "Reverse postfix",
    description: `Reversed to get prefix: ${prefixResult}`,
  });

  return { steps: conversionSteps, prefixResult };
}
