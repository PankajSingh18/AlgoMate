"use client";
import CodeBlock from "./CodeBlock";

const SharedCodeBlock = ({ title, codeExamples, color = "text-purple-500" }) => {
  return (
    <div className="mt-8 mb-8">
      <CodeBlock
        title={title}
        codeExamples={codeExamples}
        variant="macos"
      />
    </div>
  );
};

export default SharedCodeBlock;
