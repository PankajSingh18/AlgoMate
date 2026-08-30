export function* mergeListsGenerator(list1, list2) {
  if (list1.length === 0 || list2.length === 0) {
    yield { type: 'error', message: 'Both lists must be generated.' };
    return;
  }

  yield { 
      phase: 'start', 
      list1Index: -1, 
      list2Index: -1, 
      mergedList: [], 
      explanation: 'Starting merge operation.' 
  };

  const sortedList1 = [...list1].sort((a, b) => a.value - b.value);
  const sortedList2 = [...list2].sort((a, b) => a.value - b.value);

  yield {
      phase: 'sorted',
      list1Index: 0,
      list2Index: 0,
      mergedList: [],
      list1: sortedList1,
      list2: sortedList2,
      explanation: 'Both lists have been sorted in ascending order for the merge operation.'
  }

  let i = 0;
  let j = 0;
  const result = [];

  while (i < sortedList1.length || j < sortedList2.length) {
    const val1 = i < sortedList1.length ? sortedList1[i].value : Infinity;
    const val2 = j < sortedList2.length ? sortedList2[j].value : Infinity;
    
    // Yield the current pointers for highlighting
    yield { 
        phase: 'compare', 
        list1Index: i < sortedList1.length ? i : -1, 
        list2Index: j < sortedList2.length ? j : -1,
        mergedList: [...result],
        list1: sortedList1,
        list2: sortedList2,
        explanation: `Comparing ${val1 !== Infinity ? val1 : 'End of List 1'} and ${val2 !== Infinity ? val2 : 'End of List 2'}.`
    };

    let nextNode;
    let source;

    if (
      j >= sortedList2.length ||
      (i < sortedList1.length && sortedList1[i].value <= sortedList2[j].value)
    ) {
      nextNode = { ...sortedList1[i], source: "list1", next: "NULL" };
      source = 'list1';
      i++;
    } else {
      nextNode = { ...sortedList2[j], source: "list2", next: "NULL" };
      source = 'list2';
      j++;
    }

    if (result.length > 0) {
        result[result.length - 1].next = nextNode.address;
    }
    result.push(nextNode);

    // Yield the node that was added to the merged list
    yield {
      phase: 'add',
      list1Index: i < sortedList1.length ? i : -1, 
      list2Index: j < sortedList2.length ? j : -1,
      mergedList: [...result],
      list1: sortedList1,
      list2: sortedList2,
      explanation: `Added ${nextNode.value} from ${source === 'list1' ? 'List 1' : 'List 2'} to the merged list.`
    };
  }

  yield { 
      phase: 'complete', 
      list1Index: -1, 
      list2Index: -1,
      mergedList: result, 
      list1: sortedList1,
      list2: sortedList2,
      explanation: 'Merge operation complete!' 
  };
}
