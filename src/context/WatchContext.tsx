/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export type WatchContextValues = {
   watchList: Array<any>
};

export const WatchContext = React.createContext<WatchContextValues>(null as any);

export const StepProvider = ({ children, value }: { children?: React.ReactNode, value?: WatchContextValues }) => {
      return (
            <WatchContext.Provider value={{ ...value, }}>
                  {children}
            </WatchContext.Provider>
      )
}