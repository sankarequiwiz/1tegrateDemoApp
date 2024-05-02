/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonProps, Card, Checkbox, Space, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';

import API from '../../../services/index'
import { OrganizationTypes } from './type';
import { List } from 'antd';

import mock from './mock.json';

export const SelectOrganization = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
      const { setCurrentStep, current } = React.useContext(AppContext);

      const [organization] = React.useState<Array<OrganizationTypes>>(mock.data as any);

      const onOkProps: ButtonProps = {}


      const getOrganization = async () => {
            try {
                  await API.services.getOrganization({});
            } catch (error) {
                  console.log(error);
            }
      }

      React.useEffect(() => {
            getOrganization()
      }, [])

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Typography.Text strong >Select organization</Typography.Text>
                              </div>
                        </div>
                        <List
                              dataSource={organization}
                              renderItem={(item) => (
                                    <List.Item
                                          actions={[<Button type='link' key={1}>Create Watch</Button>]}
                                    >
                                          <List.Item.Meta
                                                avatar={<Checkbox />}
                                                title={<a href="https://ant.design">{item.fullName}</a>}
                                                description={item.description}
                                          />
                                    </List.Item>
                              )}
                        />
                  </Space>
                  <Footer onCancel={() => setCurrentStep(current - 1)} onSubmit={() => setCurrentStep(current + 1)} onOkProps={onOkProps} />
            </Space>
      )
})