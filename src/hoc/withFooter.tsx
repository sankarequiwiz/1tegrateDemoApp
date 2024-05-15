import React from 'react';
import { Footer } from '../components/footer';

export const withFooter = (children: React.ReactElement) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {React.cloneElement(children, { style: { flex: 1 } })}
      <Footer />
    </div>
  );
};
