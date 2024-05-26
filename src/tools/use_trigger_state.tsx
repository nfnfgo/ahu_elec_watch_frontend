'use client';

import {useState} from "react";
import {setDefault} from '@/tools/set_default';

export interface UseTriggerStateReturnProps {
  isTriggered: boolean;
  triggerState: (newState?: boolean) => void;
}

/**
 * Allow user to quickly create a state for trigger control
 */
export function useTriggerState(initialState: boolean): UseTriggerStateReturnProps {
  // store the trigger boolean state
  const [isTriggered, setIsTriggered] = useState(initialState);

  // trigger the boolean state
  function triggerState(newState?: boolean) {
    newState = setDefault(newState, !isTriggered);
    setIsTriggered(newState);
  }

  return ({
    isTriggered,
    triggerState,
  });
}