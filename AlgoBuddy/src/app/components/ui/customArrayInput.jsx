"use client";
import { CustomInputPanel } from "@/app/visualizer/components/CustomInputPanel";

const CustomArrayInput = ({ 
  onUseCustomArray = (numbers) => console.log("Received:", numbers),
  disabled = false, 
  className = "",
  currentArray = []
}) => {
  return (
    <div className={className}>
      <CustomInputPanel
        inputType="array"
        onApply={(parsed) => {
          if (parsed === null) {
            // Reset: generate a fresh random array of size 5 to 9
            const size = Math.floor(Math.random() * 5) + 5;
            const randomArr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
            onUseCustomArray(randomArr);
          } else {
            onUseCustomArray(parsed);
          }
        }}
        currentData={currentArray}
      />
    </div>
  );
};

export default CustomArrayInput;