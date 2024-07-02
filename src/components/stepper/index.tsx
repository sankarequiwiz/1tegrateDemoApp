import React, { HTMLProps } from 'react';
import { Steps, StepsProps, StepProps, Layout } from 'antd';
import './style.scss';
import { AppContext } from '../../context/AppProvider';
import { useLayout } from '../../hooks/useLayout';

export type StepperItemsTypes = StepProps & {
  container?: React.ReactElement;
};

export type StepperProps = {
  /* name of the steps, should be unique */
  name: string;
  items: StepperItemsTypes[];
} & Omit<StepsProps, 'children'>;

export const Stepper = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & StepperProps
>(({ name, direction, items = [], ...props }, ref) => {
  const { current } = React.useContext(AppContext);
  const { style } = useLayout();
console.log(current,items)
  return (
    <Layout id="stepper" aria-label={name} style={style} {...props} ref={ref}>
      <Steps
        items={items}
        current={current}
        direction={direction}
        style={{
          background: 'rgb(243 244 246)',
          padding: '1rem',
          position: 'fixed',
          top: style?.marginTop,
          left: '0',
          bottom: '0',
        }}
      />
      <div id="app" style={{ marginLeft: 260 }} className="w-full">
        {items[current].container as React.ReactElement}
        
      </div>
    </Layout>
  );
});

Stepper.defaultProps = {
  direction: 'vertical',
};
