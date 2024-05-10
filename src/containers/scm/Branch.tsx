/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, List, ListProps, Space, Spin, Typography } from 'antd';
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


      const getAllBranches = async () => {
            try {
                  setLoading(true)
                  const resp = await API.services.getAllBranches(selectedOrganization, { integrationId: integration?.id }, selectedRepo)
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
                              <ListComp dataSource={branches} loading={loading} />
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
                                    actions={[<Button onClick={downloadHandler} icon={<DownloadOutlined />} type='link' key={1}>Download</Button>]}
                              >
                                    <List.Item.Meta
                                          // avatar={
                                          //       <Checkbox
                                          //             checked={selectedBranch === item.id}
                                          //             value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                          //       />
                                          // }
                                          title={<a >{item.name}</a>}
                                          description={item.url}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};