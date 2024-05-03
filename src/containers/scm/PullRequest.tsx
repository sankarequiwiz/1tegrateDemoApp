import { Button, ButtonProps, Checkbox, List, ListProps, Space, Spin, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../components/footer';
import { AppContext } from '../../context/AppProvider';
import { PullRequestTypes } from './type';
import API from '../../services';

import mock from './pullreq.json';
import { DownloadOutlined } from '@ant-design/icons';

export const PullRequest = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ ...props }, ref) => {
      const { setCurrentStep, current } = React.useContext(AppContext);

      const [pullRequest] = React.useState<Array<PullRequestTypes>>(mock.data);

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
                  await API.services.getAllPullRequest({})
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
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Typography.Text strong >Select pull request</Typography.Text>
                              </div>
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
                  await API.services.downloadBranch({})
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
                                    actions={[<Button onClick={downloadHandler} icon={<DownloadOutlined />} loading={item?.isLoading} type='link' key={1}>Download</Button>]}
                              >
                                    <List.Item.Meta
                                          avatar={
                                                <Checkbox
                                                      checked={selectedPullReq === item.id}
                                                      value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                                />
                                          }
                                          title={<a >{item.name}</a>}
                                          description={item.html_url}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};