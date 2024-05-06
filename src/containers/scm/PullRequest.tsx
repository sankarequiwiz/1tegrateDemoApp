import { Button, ButtonProps, Checkbox, List, ListProps, Space, Spin } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../components/footer';
import { AppContext } from '../../context/AppProvider';
import { PullRequestTypes } from './type';
import API from '../../services';

import { DownloadOutlined } from '@ant-design/icons';

export const PullRequest = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ ...props }, ref) => {
      const { setCurrentStep, current, integration, selectedOrganization, selectedRepo } = React.useContext(AppContext);

      const [pullRequest, setPullRequest] = React.useState<Array<PullRequestTypes>>([]);

      const okButtonProps: ButtonProps = {
            children: 'Done',
            icon: null
      }

      const onCancel = () => {
            setCurrentStep(current - 1)
      }

      const onNext = () => { }

      const getAllPullRequest = async () => {
            try {
                  const resp = await API.services.getAllPullRequest({ integrationId: integration?.id }, selectedOrganization, selectedRepo);
                  const { data } = resp.data;
                  setPullRequest(data);
            } catch (error) {
                  console.log(error);
            }
      }

      React.useEffect(() => {
            getAllPullRequest();
      }, [])

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >

                        </div>
                        <ListComp dataSource={pullRequest} />
                  </Space>
                  <Footer onCancel={onCancel} onSubmit={onNext} onOkProps={okButtonProps} />
            </Space>
      )
})

type ListTypes = {
      dataSource: Array<PullRequestTypes>
} & ListProps<unknown>

const ListComp = ({ dataSource, ...props }: ListTypes) => {
      const { setSelectedPullReq, selectedPullReq } = React.useContext(AppContext);
      const [downloading, setDownloading] = React.useState<boolean>(false)

      const handleSelect = (selected: string) => {
            setSelectedPullReq(selected === selectedPullReq ? '' : selected)
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
                        renderItem={(item: PullRequestTypes) => (
                              <List.Item
                                    actions={[<Button style={{ display: 'none' }} onClick={downloadHandler} icon={<DownloadOutlined />} type='link' key={1}>Download</Button>]}
                              >
                                    <List.Item.Meta
                                          avatar={
                                                <Checkbox
                                                      checked={selectedPullReq === item?.id}
                                                      value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                                />
                                          }
                                          title={<a >{item?.name || item?.title}</a>}
                                          description={item?.html_url}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};