"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const hanoiCode = {
  javascript: `// Tower of Hanoi in JavaScript
function towerOfHanoi(n, fromPeg, toPeg, auxPeg) {
  if (n === 1) {
    console.log(\`Move disk 1 from \${fromPeg} to \${toPeg}\`);
    return;
  }
  
  // Move top n-1 disks from source to auxiliary peg
  towerOfHanoi(n - 1, fromPeg, auxPeg, toPeg);
  
  // Move the remaining largest disk from source to destination peg
  console.log(\`Move disk \${n} from \${fromPeg} to \${toPeg}\`);
  
  // Move the n-1 disks from auxiliary to destination peg
  towerOfHanoi(n - 1, auxPeg, toPeg, fromPeg);
}

// Example call:
// Solve for 3 disks from peg 'A' to peg 'C' using 'B'
towerOfHanoi(3, 'A', 'C', 'B');`,

  python: `# Tower of Hanoi in Python
def tower_of_hanoi(n, from_peg, to_peg, aux_peg):
    if n == 1:
        print(f"Move disk 1 from {from_peg} to {to_peg}")
        return
    
    # Move top n-1 disks from source to auxiliary peg
    tower_of_hanoi(n - 1, from_peg, aux_peg, to_peg)
    
    # Move the remaining largest disk from source to destination peg
    print(f"Move disk {n} from {from_peg} to {to_peg}")
    
    # Move the n-1 disks from auxiliary to destination peg
    tower_of_hanoi(n - 1, aux_peg, to_peg, from_peg)

# Example call:
# Solve for 3 disks from peg 'A' to peg 'C' using 'B'
tower_of_hanoi(3, 'A', 'C', 'B')`,

  java: `// Tower of Hanoi in Java
public class TowerOfHanoi {
    public static void solveHanoi(int n, char fromPeg, char toPeg, char auxPeg) {
        if (n == 1) {
            System.out.println("Move disk 1 from " + fromPeg + " to " + toPeg);
            return;
        }
        
        // Move top n-1 disks from source to auxiliary peg
        solveHanoi(n - 1, fromPeg, auxPeg, toPeg);
        
        // Move the remaining largest disk from source to destination peg
        System.out.println("Move disk " + n + " from " + fromPeg + " to " + toPeg);
        
        // Move the n-1 disks from auxiliary to destination peg
        solveHanoi(n - 1, auxPeg, toPeg, fromPeg);
    }

    public static void main(String[] args) {
        // Solve for 3 disks from peg 'A' to peg 'C' using 'B'
        solveHanoi(3, 'A', 'C', 'B');
    }
}`,

  cpp: `// Tower of Hanoi in C++
#include <iostream>

void solveHanoi(int n, char fromPeg, char toPeg, char auxPeg) {
    if (n == 1) {
        std::cout << "Move disk 1 from " << fromPeg << " to " << toPeg << std::endl;
        return;
    }
    
    // Move top n-1 disks from source to auxiliary peg
    solveHanoi(n - 1, fromPeg, auxPeg, toPeg);
    
    // Move the remaining largest disk from source to destination peg
    std::cout << "Move disk " << n << " from " << fromPeg << " to " << toPeg << std::endl;
    
    // Move the n-1 disks from auxiliary to destination peg
    solveHanoi(n - 1, auxPeg, toPeg, fromPeg);
}

int main() {
    // Solve for 3 disks from peg 'A' to peg 'C' using 'B'
    solveHanoi(3, 'A', 'C', 'B');
    return 0;
}`,
};

const fileNames = {
  javascript: "towerOfHanoi.js",
  python: "tower_of_hanoi.py",
  java: "TowerOfHanoi.java",
  cpp: "tower_of_hanoi.cpp",
};

const HanoiCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={hanoiCode}
    fileNames={fileNames}
  />
);

export default HanoiCode;
