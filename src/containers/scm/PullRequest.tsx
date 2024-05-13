/* eslint-disable @typescript-eslint/no-unused-vars */
import { List, ListProps, Space, Spin, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { AppContext } from '../../context/AppProvider';
import { PullRequestTypes } from './type';
import API from '../../services';

export const PullRequest = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(() => {
      const { integration, selectedOrganization, selectedRepo } = React.useContext(AppContext);

      const [pullRequest, setPullRequest] = React.useState<Array<PullRequestTypes>>([]);
      const [loading, setLoading] = React.useState<boolean>(false)

      const getHeaders = () => {
            return { integrationId: integration?.id };
      }

      const getAllPullRequest = async () => {
            try {
                  setLoading(true)
                  const resp = await API.services.getAllPullRequest(getHeaders(), selectedOrganization, selectedRepo);
                  const { data } = resp.data;
                  setPullRequest(data);
            } catch (error) {
                  console.log(error);
            } finally {
                  setLoading(false)
            }
      }

      React.useEffect(() => {
            getAllPullRequest();
      }, [])

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <Typography.Title level={4}>
                              Pull Request
                        </Typography.Title>
                        <ListComp dataSource={pullRequest} loading={loading} />
                  </Space>
            </Space>
      )
})

type ListTypes = {
      dataSource: Array<PullRequestTypes>
} & ListProps<unknown>

const ListComp = ({ dataSource, ...props }: ListTypes) => {
      const [downloading] = React.useState<boolean>(false)

      return (
            <Spin spinning={downloading} tip='Downloading...'>
                  <List
                        {...props}
                        dataSource={dataSource}
                        renderItem={(item: PullRequestTypes) => (
                              <List.Item
                                    // actions={[<Button onClick={downloadHandler} icon={<DownloadOutlined />} type='link' key={1}>Download</Button>]}
                              >
                                    <List.Item.Meta
                                          // avatar={
                                          //       <Checkbox
                                          //             checked={selectedPullReq === item?.id}
                                          //             value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                          //       />
                                          // }
                                          title={<a >{item?.name || item?.title}</a>}
                                          description={item?.htmlUrl || item?.htmlurl}
                                    />
                              </List.Item>
                        )}
                  />
            </Spin>
      )
};