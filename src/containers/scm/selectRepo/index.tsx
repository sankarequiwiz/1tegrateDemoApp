/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonProps, Space, Button, Radio, Spin, message } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { Payload, ReposTypes } from './type';
import { List } from 'antd';

import { DownloadOutlined } from '@ant-design/icons';

export const SelectRepo = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const {
    setCurrentStep,
    current,
    setSelectedRepo,
    selectedRepo,
    selectedOrganization,
    integration,
  } = React.useContext(AppContext);
  const [Repositories, setRepos] = React.useState<Array<ReposTypes>>([]);
  const [downloading, setDownloading] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const getHeaders = () => {
    return { integrationId: integration.id };
  };
  const getRepos = async () => {
    try {
      setLoading(true);
      const resp = await API.services.getRepo(
        selectedOrganization,
        getHeaders()
      );
      const { data } = resp.data;
      setRepos(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (selected: string) => {
    setSelectedRepo(selected === selectedRepo ? '' : selected);
  };
  const downloadHandler = async () => {
    setDownloading(true);
    try {
      await API.services.repositoryDownload(
        {
          orgId: selectedOrganization,
          repoId: selectedRepo,
        },
        getHeaders()
      );
      messageApi.success('Repository downloaded successfully.');
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to download the repository');
    } finally {
      setDownloading(false);
    }
  };

  const handleCreateWatch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLoading(true);
    const fullBodySelected = Repositories.find(
      (item) => item?.id?.toString() === selectedRepo
    );
    const payload: Payload = {
      name: `web-gateway-service-${fullBodySelected?.fullName}`,
      description: `Watch for ${fullBodySelected.description} repository`,
      type: 'HOOK',
      resource: {
        type: 'REPOSITORY',
        repository: {
          id: selectedRepo,
        },
        organization: {
          id: selectedOrganization,
        },
      },
    };
    try {
      await API.services.createWatch(payload, integration.id);
      messageApi.success({ content: 'Watch created successfully' });
    } catch (error) {
      console.log(error);
      messageApi.error({ content: 'Failed to create watch.' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getRepos();
  }, []);

  const onOkProps: ButtonProps = {
    disabled: !selectedRepo,
  };

  return (
    <Space
      direction="vertical"
      className="w-full"
      style={{ height: '100%', justifyContent: 'space-between', flex: 1 }}
    >
      {contextHolder}
      <Spin
        spinning={downloading}
        tip="Downloading..."
        style={{ height: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div {...props} ref={ref} id="service_profile" style={{ flex: 1 }}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            ></div>
          </div>
          <List
            dataSource={Repositories}
            loading={loading}
            renderItem={(item) => {
              const isSelected = selectedRepo == item.id.toString();
              return (
                <List.Item
                  actions={[
                    isSelected && (
                      <Button type="link" key={1} onClick={handleCreateWatch}>
                        Create Watch
                      </Button>
                    ),
                    <Button
                      type="link"
                      onClick={downloadHandler}
                      icon={<DownloadOutlined />}
                      key={2}
                      style={{ display: isSelected ? 'block' : 'none' }}
                    >
                      Download
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Radio
                        checked={isSelected}
                        value={item.id}
                        onChange={(e) => handleSelect(e.target.value)}
                      />
                    }
                    title={<a>{item?.fullName}</a>}
                    description={item?.description}
                  />
                </List.Item>
              );
            }}
          />
        </Space>
      </Spin>
      <Footer
        onCancel={() => setCurrentStep(current - 1)}
        onSubmit={() => setCurrentStep(current + 1)}
        onOkProps={onOkProps}
      />
    </Space>
  );
});
