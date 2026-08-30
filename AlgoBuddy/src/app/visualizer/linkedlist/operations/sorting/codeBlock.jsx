'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';
import CodeExamples from '@/app/visualizer/linkedlist/operations/sorting/data/codeExamples.json';

// ─── Code Examples ─────────────────────────────
const codeExamples = CodeExamples;

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript: 'linkedListSorting.js',
    python: 'linked_list_sorting.py',
    java: 'LinkedListSorting.java',
    c: 'linked_list_sorting.c',
    cpp: 'linked_list_sorting.cpp'
};

// ─── Component ─────────────────────────────
const LinkedListSortingCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default LinkedListSortingCode;   