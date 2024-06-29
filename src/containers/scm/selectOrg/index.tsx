import React, { HTMLProps, useMemo } from 'react';

import {
  ButtonProps,
  Radio,
  ListProps,
  Space,
  Spin,
  message,
  Skeleton,
} from 'antd';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';

import API from '../../../services/index';
import { OrganizationTypes, Payload } from './type';
import { Errors, handleError } from '../../../utils/error';
import utils from '../../../utils';
import { List } from 'antd';

const errorObj = new Errors();

const SelectOrganization = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const {
    setCurrentStep,
    setSelectedOrganization,
    current,
    selectedOrganization,
    integration,
    domain } = React.useContext(AppContext);

  const [organization, setOrganization] = React.useState<
    Array<OrganizationTypes>
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const headers = {
    integrationId: integration?.id,
  };

  const getOrganization = async () => {
    try {
      setLoading(true);
      const resp = await API.services.getSCMOrganization(headers as any, domain.toLowerCase());
      const { data } = resp.data;
      setOrganization(data);
    } catch (error) {
      if (error?.response?.data && Array.isArray(error?.response?.data) && error?.response?.data.length) {
        const [{ errorCode }] = error?.response?.data;
        if (errorCode === errorObj.getOrg().getNotFoundCode) {
          setSelectedOrganization('default');
          setCurrentStep(current + 1);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (current === 1) getOrganization();
  }, [current]);

  const onOkProps: ButtonProps = {
    disabled: !selectedOrganization,
  };

  return (
    <Space
      direction="vertical"
      className="w-full"
      style={{ height: '100%', justifyContent: 'space-between' }}
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
        <ListComp dataSource={organization} loading={loading} />
      </Space>
      <Footer
        onCancel={() => setCurrentStep(current - 1)}
        onSubmit={() => setCurrentStep(current + 1)}
        onOkProps={onOkProps}
      />
    </Space>
  );
});

type ListTypes = {
  dataSource: Array<OrganizationTypes>;
} & ListProps<unknown>;

const ListComp = ({ dataSource, loading: loadingProps, ...props }: ListTypes) => {
  const {
    setSelectedOrganization,
    selectedOrganization,
    integration,
    domain,
  } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSelect = (selected: string) => {
    setSelectedOrganization(selectedOrganization === selected ? '' : selected);
  };

  const handleCreateWatch = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setLoading(true);
    const fullBodySelected = dataSource.find((item) => item.id === selectedOrganization);
    const payload: Payload = {
      name: `web-gateway-service-${fullBodySelected?.login}`,
      description: `Watch for ${fullBodySelected.login} repository`,
      type: 'Webhook',
      resource: {
        type: `${domain}_ORGANIZATION` as any,
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
      messageApi.error({ content: handleError(errorMessage, status) ?? 'Watch creation failed' });
    } finally {
      setLoading(false);
    }
  };


  const isWatchEnabled = useMemo(() => {
    const watch = new utils.watch.Watch(domain);
    return watch.isAvailable({ level: 'organization' })
  }, [domain]);

  return (
    <Spin spinning={loading} tip="Creating...">
      {contextHolder}
      {
        loadingProps ? <Skeleton /> : (
          <List
            {...props}
            dataSource={dataSource}
            renderItem={(item: OrganizationTypes) => {
              const isSelected = item.id === selectedOrganization;
              return (
                <List.Item
                  onClick={() => {
                    handleSelect(item.id);
                  }}
                  actions={[
                    (
                      (isWatchEnabled && isSelected) && <a
                        onClick={handleCreateWatch}
                        type="link"
                        key={1}
                      >
                        Create Watch
                      </a>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Radio checked={isSelected} value={item.id} />}
                    title={<a>{item?.login}</a>}
                    description={item?.description}
                  />
                </List.Item>
              );
            }}
          />
        )
      }
    </Spin>
  );
};

export { SelectOrganization };
