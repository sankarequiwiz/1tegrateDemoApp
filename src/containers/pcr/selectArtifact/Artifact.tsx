/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonProps, Space, Radio, Spin, message, MenuProps, Dropdown } from 'antd';
import React, { HTMLProps, useMemo } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { List } from 'antd';

import { DownloadOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { Errors, handleError } from '../../../utils/error';
import utils from '../../../utils';

const errorObj = new Errors();
export const Artifact = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const {
    setCurrentStep,
    current,
    setSelectedArtifact,
    selectedArtifact,
    selectedRepo,
    selectedOrganization,
    integration,
    domain
  } = React.useContext(AppContext);
  const [Repositories, setRepos] = React.useState<Array<any>>([]);
  const [downloading, setDownloading] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const getHeaders = () => {
    return { integrationId: integration.id,};
  };
 
  const getRepos = async () => {
    try {
      setLoading(true);
      const resp = await API.services.getAllArtifact(
        selectedOrganization,
        getHeaders(),
        selectedRepo,
        domain
      );
      const { data } = resp.data;
      setRepos(data);
    } catch (error) {
      console.log(error);
      if (error?.response?.data && Array.isArray(error?.response?.data) && error?.response?.data.length) {
        const [{ errorCode }] = error?.response?.data;
        if (errorCode === errorObj.getOrg().getNotFoundCode) {
          setSelectedArtifact('default');
           setCurrentStep(current + 1);
        }
     }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (selected: string) => {
    setSelectedArtifact(selected === selectedArtifact ? '' : selected);
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
    const fullBodySelected = Repositories.find(
      (item) => item?.id?.toString() === selectedRepo
    );
    const payload: any = {
      name: `web-gateway-service-${fullBodySelected?.fullName}`,
      description: `Watch for ${fullBodySelected.description} repository`,
      type: 'Webhook',
      resource: {
        type: 'SCM_REPOSITORY',
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
      messageApi.success({ content: 'Bi-directional created successfully' });
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
      label: "Create Bi-directional",
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
                  onClick={() => handleSelect(item.id?.toString())}
                >
                  <List.Item.Meta
                    avatar={
                      <Radio
                        checked={isSelected}
                        value={item.id}
                      />
                    }
                    title={<a>{item?.name}</a>}
                    description={item?.id}
                  />
                </List.Item>
              );
            }}
          />
        </Space>
      </Spin>
      <Footer
        onCancel={() => setCurrentStep(current - (selectedRepo === 'default' && selectedOrganization === 'default'? 3 : selectedRepo === 'default'? 2:1))}
        onSubmit={() => setCurrentStep(current + 1)}
        onOkProps={onOkProps}
      />
    </Space>
  );
});
