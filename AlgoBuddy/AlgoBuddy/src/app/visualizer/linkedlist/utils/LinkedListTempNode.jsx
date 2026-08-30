export function LinkedListTempNode({ value, nextText = "NULL" }) {
  return (
    <div className="node absolute flex border border-gray-300">
      <div className="data-part rounded-l-lg bg-blue-500 p-4 text-white">
        {String(value ?? "")}
      </div>
      <div className="next-part rounded-r-lg bg-blue-300 p-4">
        {String(nextText ?? "")}
      </div>
    </div>
  );
}
