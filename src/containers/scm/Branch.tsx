import { ButtonProps, Space, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../components/footer';
import { AppContext } from '../../context/AppProvider';


export const Branch = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ ...props }, ref) => {
      const { setCurrentStep, current } = React.useContext(AppContext)

      const okButtonProps: ButtonProps = {
            children: 'Done',
            icon: null
      }

      const onCancel = () => {
            setCurrentStep(current - 1)
      }

      const onNext = () => {}

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Typography.Text strong >Select organization</Typography.Text>
                              </div>
                        </div>
                  </Space>
                  <Footer onCancel={onCancel} onSubmit={onNext} onOkProps={okButtonProps}  />
            </Space>
      )
})