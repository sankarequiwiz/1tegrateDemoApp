import { ButtonProps, Space, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';

export const SelectOrganization = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
      const { setCurrentStep, current } = React.useContext(AppContext);

      const onOkProps: ButtonProps = {}

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <Typography.Text strong >Available services</Typography.Text>
                        </div>
                  </div>
                  <Footer onCancel={() => setCurrentStep(current - 1)} onSubmit={() => setCurrentStep(current + 1)} onOkProps={onOkProps} />
            </Space>
      )
})