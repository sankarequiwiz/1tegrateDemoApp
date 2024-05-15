import React from 'react';
import { AppContext } from '../context/AppProvider';

export type UseLayoutTypes = {
  style: React.CSSProperties;
};

export const useLayout = (): UseLayoutTypes => {
  const { accessKey } = React.useContext(AppContext);

  const marginTop = accessKey ? '77px' : '113px';
  return {
    style: { marginTop, height: `calc(100vh - ${marginTop})` },
  };
};
