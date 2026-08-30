const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

test("trieLogic - insert, search, and prefix search", async () => {
  const logicUrl = pathToFileURL(
    path.join(
      __dirname,
      "..",
      "src/features/algorithms/tree/trieLogic.js",
    ),
  ).href;

  const { TrieNode, insertGenerator, searchGenerator, prefixSearchGenerator } = await import(logicUrl);

  const root = new TrieNode("", "root");

  // Verify initial insert generator steps
  const steps = [...insertGenerator(root, "cat", 0)];
  assert.ok(steps.length > 0, "Insert generator should produce steps");
  
  // Last step should have the final tree structure
  const finalStep = steps[steps.length - 1];
  assert.ok(finalStep.tree, "Final step should contain the updated tree");
  assert.equal(finalStep.newNodeIdCounter, 3, "newNodeIdCounter should be 3 for 'cat' starting at 0");

  const finalTree = finalStep.tree;
  assert.ok(finalTree.children["c"], "c should be present in children");
  assert.ok(finalTree.children["c"].children["a"], "a should be present under c");
  assert.ok(finalTree.children["c"].children["a"].children["t"], "t should be present under a");
  assert.equal(finalTree.children["c"].children["a"].children["t"].isEndOfWord, true, "t node should be end of word");

  // Verify search generator
  const searchSteps = [...searchGenerator(finalTree, "cat")];
  const lastSearchStep = searchSteps[searchSteps.length - 1];
  assert.ok(lastSearchStep.explanation.includes("exists in the Trie"), "Search for 'cat' should succeed");

  // Verify search for non-existent word
  const searchStepsFail = [...searchGenerator(finalTree, "dog")];
  const lastSearchStepFail = searchStepsFail[searchStepsFail.length - 1];
  assert.ok(lastSearchStepFail.explanation.includes("missing") || lastSearchStepFail.explanation.includes("failed"), "Search for 'dog' should fail");

  // Verify prefix search
  const prefixSteps = [...prefixSearchGenerator(finalTree, "ca")];
  const lastPrefixStep = prefixSteps[prefixSteps.length - 1];
  assert.ok(lastPrefixStep.explanation.includes("Prefix exists"), "Prefix search for 'ca' should succeed");
});
