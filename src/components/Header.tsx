import { AppstoreOutlined as AppSwitch } from '@ant-design/icons';
import { Alert, Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { AppContext } from '../context/AppProvider';
import { DomainTypes } from '../types/type';

const domain = [
      {
            label: 'Source control management (SCM)',
            key: 'SCM',
      },
      {
            label: 'Bug tracking system (BTS)',
            key: 'BTS',
      }
]

const warningMsg = 'Access key not configured yet!';

export const Header = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
      (props, ref) => {
            const { setDomain, domain: selectedDomain, accessKey, userName, organization } = React.useContext(AppContext)

            const items: MenuProps['items'] = domain.map(({ label, key }) => {
                  return {
                        label,
                        key,
                        onClick: () => setDomain(key as DomainTypes)
                  }
            });

            return (
                  <div {...props} ref={ref}>
                        {!accessKey && <Alert message={warningMsg} banner closable />}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.8rem 1rem', background: 'black' }}>
                              <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']} arrow={{ pointAtCenter: true }}>
                                    <Button size='small'>
                                          <AppSwitch />
                                          {selectedDomain}
                                    </Button>

                              </Dropdown>
                              <Space>
                                    <Avatar style={{ backgroundColor: 'orange', verticalAlign: 'middle' }} size="large" >
                                          {userName?.charAt(0)}
                                    </Avatar>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.2rem' }} >
                                          <Typography.Title level={5} style={{ color: 'white', margin: 0 }}>{userName}</Typography.Title>
                                          <Typography.Text style={{ color: 'white' }}>{organization}</Typography.Text>
                                    </div>
                              </Space>
                        </div>
                  </div>
            )
      })