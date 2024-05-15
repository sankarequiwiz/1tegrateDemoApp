/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export type StepContextValueTypes = {
  onNext?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPrev?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const StepContext = React.createContext<StepContextValueTypes>(
  null as any
);

export const StepProvider = ({
  children,
  value,
}: {
  children?: React.ReactNode;
  value?: StepContextValueTypes;
}) => {
  return (
    <StepContext.Provider value={{ ...value }}>{children}</StepContext.Provider>
  );
};
