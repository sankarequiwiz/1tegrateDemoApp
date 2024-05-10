/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonProps, Radio, List, ListProps, Space, Spin, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../components/footer';
import { AppContext } from '../../context/AppProvider';
import { CommitTypes } from './type';
import API from '../../services';


import { DownloadOutlined } from '@ant-design/icons';

export const Commits = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(() => {
      const { setCurrentStep, current, integration, selectedOrganization, selectedRepo } = React.useContext(AppContext);

      const [commits, setCommits] = React.useState<Array<CommitTypes>>([] as any);
      const [loading, setLoading] = React.useState<boolean>(false)


      const okButtonProps: ButtonProps = {
            children: 'Done',
            icon: null
      }

      const onCancel = () => {
            setCurrentStep(current - 1)
      }

      const onNext = () => {
            setCurrentStep(0)
        }

      const getAllCommit = async () => {
            try {
                  setLoading(true)
                  const resp = await API.services.getAllCommit({ integrationId: integration?.id }, selectedOrganization, selectedRepo);
                  const { data } = resp.data;
                  setCommits(data);
            } catch (error) {
                  console.log(error);
            }finally{
                  setLoading(false)
            }
      }

      React.useEffect(() => {
            getAllCommit();
      }, [])

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <Typography.Title level={4}>
                              Commits
                        </Typography.Title>
                        <ListComp dataSource={commits} loading={loading}/>
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
                        renderItem={(item: CommitTypes) => (
                              <List.Item
                                    actions={[<Button onClick={downloadHandler} icon={<DownloadOutlined />} type='link' key={1}>Download</Button>]}
                              >
                                    <List.Item.Meta
                                          // avatar={
                                          //       <Checkbox
                                          //             checked={selectedCommit === item.id}
                                          //             value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                          //       />
                                          // }
                                          title={<a >{item?.author?.login || item?.author?.type}</a>}
                                          description={item.url}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};