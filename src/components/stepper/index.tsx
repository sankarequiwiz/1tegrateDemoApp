import React, { HTMLProps } from 'react';
import { Steps, StepsProps, StepProps, Layout } from 'antd';
import './style.scss';
import { StepContext } from '../../context/StepCompProvider';

export type StepperItemsTypes = StepProps & {
      container?: React.ReactElement;
};

export type StepperProps = {
      /* name of the steps, should be unique */
      name: string
      items: StepperItemsTypes[]
} & Omit<StepsProps, 'children'>;

export const Stepper = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & StepperProps>(
      ({ name, direction, items = [], ...props }, ref) => {
            const { current } = React.useContext(StepContext)
            return (
                        <Layout id='stepper' aria-label={name} {...props} ref={ref}>
                              <Steps items={items} current={current} direction={direction} />
                              <div className='w-full'>{items[current].container as React.ReactElement}</div>
                        </Layout>
            );
      })

Stepper.defaultProps = {
      direction: 'vertical',
}