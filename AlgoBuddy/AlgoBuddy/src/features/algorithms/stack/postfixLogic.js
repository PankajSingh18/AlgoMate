/**
 * Pure generator function for converting an Infix expression to Postfix notation.
 * Yields state objects representing the conversion progress at each step.
 */

const precedence = { "^": 4, "*": 3, "/": 3, "+": 2, "-": 2 };

export function* postfixGenerator(infix) {
  let tempStack = [];
  let tempOutput = [];
  
  yield { stack:[], output:[], char:"", action:"Initialize", description:"Starting conversion process" };
  
  for (let i = 0; i < infix.length; i++) {
    const char = infix[i];
    
    if (/[a-zA-Z0-9]/.test(char)) {
      tempOutput.push(char);
      yield { stack:[...tempStack], output:[...tempOutput], char, action:"Add operand", description:`Added operand "${char}" to output` };
    } else if (char === "(") {
      tempStack.push(char);
      yield { stack:[...tempStack], output:[...tempOutput], char, action:"Push to stack", description:`Pushed "(" to stack` };
    } else if (char === ")") {
      while (tempStack.length && tempStack[tempStack.length - 1] !== "(") {
        const popped = tempStack.pop();
        tempOutput.push(popped);
        yield { stack:[...tempStack], output:[...tempOutput], char:popped, action:"Pop from stack", description:`Popped operator "${popped}" from stack` };
      }
      tempStack.pop(); // Remove "("
      yield { stack:[...tempStack], output:[...tempOutput], char:"(", action:"Remove from stack", description:'Removed "(" from stack' };
    } else {
      while (tempStack.length && tempStack[tempStack.length - 1] !== "(" && precedence[char] <= precedence[tempStack[tempStack.length - 1]]) {
        const popped = tempStack.pop();
        tempOutput.push(popped);
        yield { stack:[...tempStack], output:[...tempOutput], char:popped, action:"Pop higher precedence", description:`Popped higher precedence operator "${popped}"` };
      }
      tempStack.push(char);
      yield { stack:[...tempStack], output:[...tempOutput], char, action:"Push operator", description:`Pushed operator "${char}" to stack` };
    }
  }
  
  while (tempStack.length) {
    const popped = tempStack.pop();
    tempOutput.push(popped);
    yield { stack:[...tempStack], output:[...tempOutput], char:popped, action:"Pop remaining", description:`Popped remaining operator "${popped}"` };
  }
}
