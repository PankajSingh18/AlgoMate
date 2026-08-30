'use client';
import { useState } from 'react';
import usePlayback from '@/app/hooks/usePlayback';
import LinearMemoryControls from '@/app/components/ui/LinearMemoryControls';
import { pushGenerator, popGenerator, peekGenerator } from '@/features/algorithms/stack/stackLogic';

const PushPop = ({
  stack,
  setStack,
  isAnimating,
  setIsAnimating,
  message,
  setMessage,
  operation,
  setOperation,
  extraActions,
  capacity,
  setCapacity,
  stackLimit,
  speed: parentSpeed,
  setSpeed: parentSetSpeed
}) => {
  const [inputValue, setInputValue] = useState('');
  const [capacityInput, setCapacityInput] = useState('');
  const localPlayback = usePlayback(1);
  const speed = parentSpeed !== undefined ? parentSpeed : localPlayback.speed;
  const setSpeed = parentSetSpeed !== undefined ? parentSetSpeed : localPlayback.setSpeed;

  const limit = capacity !== undefined && capacity !== null ? capacity : stackLimit;

  // Handle setting capacity
  const handleSetCapacity = () => {
    const size = parseInt(capacityInput, 10);
    if (isNaN(size) || size < 1 || size > 10) {
      setMessage('Please enter a valid capacity between 1 and 10.');
      return;
    }
    setCapacity(size);
    setCapacityInput('');
    setMessage(`Stack capacity set to ${size}. Ready for operations!`);
  };

  // Push operation
  const push = () => {
    const generator = pushGenerator(stack, inputValue, limit);
    let step = generator.next();

    if (step.value?.type === 'error') {
      setMessage(step.value.message);
      return;
    }

    if (step.value?.type === 'start') {
      setIsAnimating(true);
      setOperation(step.value.operation);

      setTimeout(() => {
        step = generator.next();
        if (step.value?.type === 'complete') {
          setStack(step.value.stack);
          setOperation(null);
          setMessage(step.value.message);
          setInputValue('');
          setIsAnimating(false);
        }
      }, 1000 / speed);
    }
  };

  // Pop operation
  const pop = () => {
    const generator = popGenerator(stack);
    let step = generator.next();

    if (step.value?.type === 'error') {
      setMessage(step.value.message);
      return;
    }

    if (step.value?.type === 'start') {
      setIsAnimating(true);
      setOperation(step.value.operation);
      
      setTimeout(() => {
        step = generator.next();
        if (step.value?.type === 'complete') {
          setStack(step.value.stack);
          setOperation(null);
          setMessage(step.value.message);
          setIsAnimating(false);
        }
      }, 1000 / speed);
    }
  };

  // Peek operation
  const peek = () => {
    const generator = peekGenerator(stack);
    let step = generator.next();

    if (step.value?.type === 'error') {
      setMessage(step.value.message);
      return;
    }

    if (step.value?.type === 'start') {
      setIsAnimating(true);
      setOperation(step.value.operation);
      
      setTimeout(() => {
        step = generator.next();
        if (step.value?.type === 'complete') {
          setOperation(null);
          setMessage(step.value.message);
          setIsAnimating(false);
        }
      }, 1000 / speed);
    }
  };

  // Handle capacity-not-set state
  if (capacity === null) {
    return (
      <LinearMemoryControls
        inputValue={capacityInput}
        setInputValue={setCapacityInput}
        placeholder="Enter capacity (1-10)..."
        isAnimating={isAnimating}
        operation={operation}
        message={message}
        speed={speed}
        onSpeedChange={setSpeed}
        actions={[
          { label: "Set Capacity", onClick: handleSetCapacity, variant: "primary", needsInput: true }
        ]}
      />
    );
  }

  const actions = [
    { label: "Push", onClick: push, variant: "primary", needsInput: true, disabled: limit && stack.length >= limit },
    { label: "Pop", onClick: pop, disabled: stack.length === 0, variant: "secondary" },
    { label: "Peek", onClick: peek, disabled: stack.length === 0, variant: "secondary" },
    { label: "Reset", onClick: () => { setStack([]); setMessage('Stack cleared'); }, variant: "outline" },
  ];

  // If stack is empty, allow user to change size (locking capacity once an element is pushed)
  if (stack.length === 0 && setCapacity) {
    actions.push({ label: "Change Size", onClick: () => { setCapacity(null); setMessage('Please enter a new stack capacity.'); }, variant: "secondary" });
  }

  if (extraActions) {
    actions.push(...extraActions);
  }

  return (
    <LinearMemoryControls
      inputValue={inputValue}
      setInputValue={setInputValue}
      isAnimating={isAnimating}
      operation={operation}
      message={message}
      speed={speed}
      onSpeedChange={setSpeed}
      actions={actions}
    />
  );
};

export default PushPop;