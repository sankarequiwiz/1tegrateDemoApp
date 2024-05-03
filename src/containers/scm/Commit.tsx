import { Button, ButtonProps, Checkbox, List, ListProps, Space, Spin, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../components/footer';
import { AppContext } from '../../context/AppProvider';
import { CommitTypes } from './type';
import API from '../../services';

import mock from './commits.json';
import { DownloadOutlined } from '@ant-design/icons';

export const Commits = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ ...props }, ref) => {
      const { setCurrentStep, current } = React.useContext(AppContext);

      const [commits] = React.useState<Array<CommitTypes>>(mock.data);

      const okButtonProps: ButtonProps = {
            children: 'Done',
            icon: null
      }

      const onCancel = () => {
            setCurrentStep(current - 1)
      }

      const onNext = () => { }

      const getAllCommit = async () => {
            try {
                  await API.services.getAllCommit({})
            } catch (error) {
                  console.log(error);
            }
      }

      React.useEffect(() => {
            getAllCommit();
      }, [])

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Typography.Text strong >Select commit</Typography.Text>
                              </div>
                        </div>
                        <ListComp dataSource={commits} />
                  </Space>
                  <Footer onCancel={onCancel} onSubmit={onNext} onOkProps={okButtonProps} />
            </Space>
      )
})

type ListTypes = {
      dataSource: Array<CommitTypes>
} & ListProps<unknown>

const ListComp = ({ dataSource, ...props }: ListTypes) => {
      const { setSelectedCommit, selectedCommit } = React.useContext(AppContext);
      const [downloading, setDownloading] = React.useState<boolean>(false)

      const handleSelect = (selected: string) => {
            setSelectedCommit(selected === selectedCommit ? '' : selected)
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
                        renderItem={(item: CommitTypes) => (
                              <List.Item
                                    actions={[<Button onClick={downloadHandler} icon={<DownloadOutlined />} type='link' key={1}>Download</Button>]}
                              >
                                    <List.Item.Meta
                                          avatar={
                                                <Checkbox
                                                      checked={selectedCommit === item.id}
                                                      value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                                />
                                          }
                                          title={<a >{item.author.name}</a>}
                                          description={item.url}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};