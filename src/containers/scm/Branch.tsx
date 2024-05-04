import { Button, ButtonProps, Checkbox, List, ListProps, Space, Spin } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../components/footer';
import { AppContext } from '../../context/AppProvider';
import { BranchTypes } from './type';
import API from '../../services';

import mock from './branc.json';
import { DownloadOutlined } from '@ant-design/icons';

export const Branch = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ ...props }, ref) => {
      const { setCurrentStep, current, integration, selectedOrganization } = React.useContext(AppContext);

      const [branches] = React.useState<Array<BranchTypes>>(mock.data);

      const okButtonProps: ButtonProps = {
            children: 'Done',
            icon: null
      }

      const onCancel = () => {
            setCurrentStep(current - 1)
      }

      const onNext = () => { }

      const getAllBranches = async () => {
            try {
                  await API.services.getAllBranches(selectedOrganization, { integrationId: integration?.id })
            } catch (error) {
                  console.log(error);
            }
      }

      React.useEffect(() => {
            getAllBranches();
      }, [])

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >

                        </div>
                        <ListComp dataSource={branches} />
                  </Space>
                  <Footer onCancel={onCancel} onSubmit={onNext} onOkProps={okButtonProps} />
            </Space>
      )
})

type ListTypes = {
      dataSource: Array<BranchTypes>
} & ListProps<unknown>

const ListComp = ({ dataSource, ...props }: ListTypes) => {
      const { setSelectedBranch, selectedBranch } = React.useContext(AppContext);
      const [downloading, setDownloading] = React.useState<boolean>(false)

      const handleSelect = (selected: string) => {
            setSelectedBranch(selected === selectedBranch ? '' : selected)
      }

      const downloadHandler = async () => {
            setDownloading(true);
            try {
                  await API.services.downloadCodeBase({})
            } catch (error) {
                  console.error(error)
            } finally {
                  setDownloading(false);
            }
      }

      return (
            <Spin spinning={downloading} tip='Downloading...'>
                  <List
                        {...props}
                        dataSource={dataSource}
                        renderItem={(item: BranchTypes) => (
                              <List.Item
                                    actions={[<Button onClick={downloadHandler} icon={<DownloadOutlined />} type='link' style={{ display: 'none' }} key={1}>Download</Button>]}
                              >
                                    <List.Item.Meta
                                          avatar={
                                                <Checkbox
                                                      checked={selectedBranch === item.id}
                                                      value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                                />
                                          }
                                          title={<a >{item.name}</a>}
                                          description={item.url}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};