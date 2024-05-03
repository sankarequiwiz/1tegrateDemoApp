/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonProps, Checkbox, ListProps, Space, Spin, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';

import API from '../../../services/index'
import { OrganizationTypes, Payload } from './type';
import { List } from 'antd';

import mock from './mock.json';

export const SelectOrganization = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
      const { setCurrentStep, current, selectedOrganization } = React.useContext(AppContext);

      const [organization, setOrganization] = React.useState<Array<OrganizationTypes>>(mock.data);

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

      const onOkProps: ButtonProps = {
            disabled: !selectedOrganization
      }

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Typography.Text strong >Select organization</Typography.Text>
                              </div>
                        </div>
                        <ListComp dataSource={organization} setOrganization={setOrganization} />
                  </Space>
                  <Footer onCancel={() => setCurrentStep(current - 1)} onSubmit={() => setCurrentStep(current + 1)} onOkProps={onOkProps} />
            </Space>
      )
})

type ListTypes = {
      dataSource: Array<OrganizationTypes>
      setOrganization?: React.Dispatch<React.SetStateAction<Array<OrganizationTypes>>>
} & ListProps<unknown>

const ListComp = ({ dataSource, ...props }: ListTypes) => {
      const { setSelectedOrganization, selectedOrganization, integration } = React.useContext(AppContext);
      const [loading, setLoading] = React.useState<boolean>(false);

      const handleSelect = (selected: string) => {
            setSelectedOrganization(selectedOrganization === selected ? '' : selected)
      }

      const handleCreateWatch = async () => {
            setLoading(true);
            const fullBodySelected = dataSource.find((item) => item.id === selectedOrganization);
            const payload: Payload = {
                  "name": `web-gateway-service-${fullBodySelected?.login}`,
                  "description": `Watch for ${fullBodySelected.login} repository`,
                  "type": "HOOK",
                  "resource": {
                        "type": "ORGANIZATION",
                        "organization": {
                              "id": selectedOrganization
                        }
                  }
            }
            try {
                  await API.services.createWatch(payload, integration.id)
            } catch (error) {
                  console.log(error);
            } finally {
                  setLoading(false);
            }
      }

      return (
            <Spin spinning={loading} tip='Creating...'  >
                  <List
                        {...props}
                        dataSource={dataSource}
                        renderItem={(item: OrganizationTypes) => (
                              <List.Item
                                    actions={[<Button loading={item?.isLoading} onClick={handleCreateWatch} type='link' key={1}>Create Watch</Button>]}
                              >
                                    <List.Item.Meta
                                          avatar={
                                                <Checkbox
                                                      checked={selectedOrganization === item.id.toString()}
                                                      value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                                />
                                          }
                                          title={<a >{item.login}</a>}
                                          description={item.description}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};