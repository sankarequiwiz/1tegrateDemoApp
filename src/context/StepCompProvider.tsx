/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export type StepContextValueTypes = {
      current?: number
      setCurrentStep?: (newCurrent: number) => void;
      onNext?: (e: React.MouseEvent<HTMLButtonElement>) => void
      onPrev?: (e: React.MouseEvent<HTMLButtonElement>) => void
      onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void
};

export const StepContext = React.createContext<StepContextValueTypes>(null as any);

export const StepProvider = ({ children, value }: { children?: React.ReactNode, value?: StepContextValueTypes }) => {
      const [search, setSearch] = useSearchParams();

      const setCurrentStep = (newCurrent: number) => {
            setSearch((prev) => {
                  prev.set('current', newCurrent.toString())
                  return prev;
            })
      }

      return (
            <StepContext.Provider value={{ ...value, setCurrentStep, current: +search.get('current') }}>
                  {children}
            </StepContext.Provider>
      )
}