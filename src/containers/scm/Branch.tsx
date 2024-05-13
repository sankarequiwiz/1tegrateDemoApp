/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, List, ListProps, Space, Spin, Typography, message } from 'antd';
import React, { HTMLProps } from 'react';
import { AppContext } from '../../context/AppProvider';
import { BranchTypes } from './type';
import API from '../../services';


import { DownloadOutlined } from '@ant-design/icons';
import { Commits } from './Commit';
import { PullRequest } from './PullRequest';

export const Branch = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(() => {
      const { integration, selectedOrganization, selectedRepo } = React.useContext(AppContext);
      const [loading, setLoading] = React.useState<boolean>(false)

      const [branches, setRepos] = React.useState<Array<BranchTypes>>();

      const getHeaders = () => {
            return { integrationId: integration?.id };
      }

      const getAllBranches = async () => {
            try {
                  const resp = await API.services.getAllBranches(selectedOrganization, getHeaders(), selectedRepo)
                  const { data } = resp.data;
                  setRepos(data);
            } catch (error) {
                  console.log(error);
            } finally {
                  setLoading(false)
            }
      }

      React.useEffect(() => {
            getAllBranches();
      }, [])

      return (
            <div style={{ display: "flex", height: '100%', flexDirection: "column", gap: "1rem" }}>
                  <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                        <Space direction='vertical' style={{ width: '100%' }}>
                              <Typography.Title level={4}>
                                    Branch
                              </Typography.Title>
                              <ListComp getHeaders={getHeaders} dataSource={branches} loading={loading} />
                        </Space>
                        <div>
                              <PullRequest />
                        </div>
                        <div>
                              <Commits />
                        </div>
                  </Space>


            </div>
      )
})

type ListTypes = {
      dataSource: Array<BranchTypes>
      getHeaders: () => { [key: string]: string }
} & ListProps<unknown>

const ListComp = ({ dataSource, getHeaders, ...props }: ListTypes) => {
      const [downloading, setDownloading] = React.useState<boolean>(false)
      const { selectedOrganization, selectedRepo } = React.useContext(AppContext);
      const [messageApi, contextHolder] = message.useMessage();

      const downloadHandler = async (id: string) => {
            setDownloading(true);
            try {
                  await API.services.branchDownload({ repoId: selectedRepo, orgId: selectedOrganization, branch: id }, getHeaders())
                  messageApi.success('Branch download successfully');
            } catch (error) {
                  console.error(error)
                  messageApi.error('Failed to download');
            } finally {
                  setDownloading(false);
            }
      }

      return (
            <Spin spinning={downloading} tip='Downloading...'>
                  {contextHolder}
                  <List
                        {...props}
                        dataSource={dataSource}
                        renderItem={(item: BranchTypes) => (
                              <List.Item
                                    actions={[
                                          <Button
                                                onClick={() => downloadHandler(item?.id)} icon={<DownloadOutlined />} type='link' key={1}>Download</Button>
                                    ]}
                              >
                                    <List.Item.Meta
                                          title={<a >{item.name}</a>}
                                          description={item.url}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};