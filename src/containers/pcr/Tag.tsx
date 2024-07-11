/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonProps, Space, Spin, message, MenuProps, Dropdown } from 'antd';
import React, { HTMLProps, useMemo } from 'react';
import { Footer } from '../../components/footer/index';
import { AppContext } from '../../context/AppProvider';
import API from '../../services/';
import { List } from 'antd';

import { DownloadOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { handleError } from '../../utils/error';
import utils from '../../utils';


export const Tag = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const { integration, selectedOrganization, selectedRepo, domain, selectedArtifact,setCurrentStep ,current} =
      React.useContext(AppContext);
  const [downloading, setDownloading] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  
    const [tags, SetTags] = React.useState<Array<any>>();

  const [messageApi, contextHolder] = message.useMessage();

  const getHeaders = () => {
    return { integrationId: integration.id,};
  };
 
  const getAllTags = async () => {
    try {
      setLoading(true);
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

  const handleCreateWatch = async () => {
    setLoading(true);
    const fullBodySelected = tags.find(
      (item) => item?.id?.toString() === selectedRepo
    );
    const payload: any = {
      name: `web-gateway-service-${fullBodySelected?.fullName}`,
      description: `Watch for ${fullBodySelected.description} repository`,
      type: 'Webhook',
      resource: {
        type: 'PCR_REPOSITORY',
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
      const errorMessage = error?.response?.data, status = error?.response?.status;
      messageApi.error({ content: handleError(errorMessage, status) });
    } finally {
      setLoading(false);
    }
  };

  const isWatchEnabled = useMemo(() => {
    const watch = new utils.watch.Watch(domain);
    return watch.isAvailable({ level: 'repository' })
  }, [domain]);

  const items: MenuProps['items'] = [
    {
      label: "Create Watch",
      key: '0',
      style: { display: isWatchEnabled ? 'block' : 'none' },
      icon: <EyeOutlined />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        handleCreateWatch()
      }
    },
    {
      label: 'Download',
      key: '1',
      icon: <DownloadOutlined />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        downloadHandler();
      }
    }
  ];

  React.useEffect(() => {
    getAllTags();
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
            dataSource={tags}
            loading={loading}
            renderItem={(item) => {
              const isSelected = selectedArtifact == item.id.toString();
              return (
                <List.Item
                  actions={[
                    isSelected && <Dropdown key={1} menu={{ items }} trigger={['click']}>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '.2rem', background: 'transparent', outline: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <EllipsisOutlined />
                      </button>
                    </Dropdown>
                  ]}
                >
                  <List.Item.Meta
                    title={<a>{item?.name}</a>}
                  />
                </List.Item>
              );
            }}
          />
        </Space>
      </Spin>
      <Footer
        onCancel={() => setCurrentStep(current - 1)}
        onSubmit={() => setCurrentStep(0)}
        onOkProps={onOkProps}
      />
    </Space>
  );
});
