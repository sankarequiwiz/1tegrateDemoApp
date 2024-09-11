import React from 'react';

export type UseLayoutTypes = {
  style: React.CSSProperties;
};

export const useLayout = (): UseLayoutTypes => {

  const marginTop = '77px';
  return {
    style: { marginTop, height: `calc(100vh - ${marginTop})` },
  };
};
