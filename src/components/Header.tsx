import { AppstoreOutlined as AppSwitch } from '@ant-design/icons';
import { Alert, Button, Dropdown, Layout, MenuProps } from 'antd';
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
            const { setDomain, domain: selectedDomain, accessKey } = React.useContext(AppContext)

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
                        <Layout.Header >
                              <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']} arrow={{ pointAtCenter: true }}>
                                    <Button size='small'>
                                          <AppSwitch />
                                          {selectedDomain}
                                    </Button>
                              </Dropdown>
                        </Layout.Header>
                  </div>
            )
      })