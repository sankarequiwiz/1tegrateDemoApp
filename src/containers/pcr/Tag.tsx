/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  List,
  ListProps,
  Space,
  Spin,
  message,
} from 'antd';
import React, { HTMLProps } from 'react';
import { AppContext } from '../../context/AppProvider';
import API from '../../services';

import { DownloadOutlined } from '@ant-design/icons';

export const Tag = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(() => {
  const { integration, selectedOrganization, selectedRepo,domain,selectedArtifact } =
    React.useContext(AppContext);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [tags, SetTags] = React.useState<Array<any>>();

  const getHeaders = () => {
    return { integrationId: integration?.id };
  };

  const getAllTags = async () => {
    try {
      const resp = await API.services.getAllTags(
        selectedOrganization,
        getHeaders(),
        selectedRepo,
        selectedArtifact,
        domain,
      );
      const { data } = resp.data;
      SetTags(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
console.log(selectedRepo,selectedArtifact)
  React.useEffect(() => {
    getAllTags();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Space
        direction="vertical"
        className="w-full"
        style={{ height: '100%', justifyContent: 'space-between' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <ListComp
            getHeaders={getHeaders}
            dataSource={tags}
            loading={loading}
          />
        </Space>
      </Space>
    </div>
  );
});

type ListTypes = {
  dataSource: Array<any>;
  getHeaders: () => { [key: string]: string };
} & ListProps<unknown>;

const ListComp = ({ dataSource, getHeaders, ...props }: ListTypes) => {
  const [downloading, setDownloading] = React.useState<boolean>(false);
  const { selectedOrganization, selectedRepo } = React.useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();

  const downloadHandler = async (id: string) => {
    setDownloading(true);
    try {
      await API.services.branchDownload(
        { repoId: selectedRepo, orgId: selectedOrganization, branch: id },
        getHeaders()
      );
      messageApi.success('Artifacts downloaded successfully.');
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to download the Artifacts.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Spin spinning={downloading} tip="Downloading...">
      {contextHolder}
      <List
        {...props}
        dataSource={dataSource}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Button
                onClick={() => downloadHandler(item?.id)}
                icon={<DownloadOutlined />}
                type="link"
                key={1}
              >
                Download
              </Button>,
            ]}
          >
            <List.Item.Meta title={<a>{item.name}</a>} description={item.url} />
          </List.Item>
        )}
      />
    </Spin>
  );
};
