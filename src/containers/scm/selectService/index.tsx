/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from 'react';
import API from '../../../services';
import {
  ButtonProps,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Skeleton,
  Space,
  Typography,
  message,
} from 'antd';
import './style.scss';

import { AppContext } from '../../../context/AppProvider';
import { Footer } from '../../../components/footer';
import { Payload, ServiceTypes } from './types';
import FormItem from 'antd/es/form/FormItem';

import Event from '../../../utils/Events/index';
import { EventTypes } from '../../../utils/Events/types';
import { Gitlab } from '../../../components/icons/providers/gitlab';
import { Github } from '../../../components/icons/providers/github';
import { Servicenow } from '../../../components/icons/providers/servicenow';
import { Bitbucket } from '../../../components/icons/providers/bitbucket';
import { ADO } from '../../../components/icons/providers/ado';
import { Jira } from '../../../components/icons/providers/jira';

type VoidFunction = () => void;

export const SelectService = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const [services, setServices] = React.useState<Array<ServiceTypes>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const childRef = React.useRef<{
    onIntegrate: (callBack: VoidFunction) => void;
    loading: boolean;
  }>();

  const {
    setCurrentStep,
    current,
    setSelectedService: setSelected,
    selectedService: selected,
    accessKey: key,
    domain,
  } = React.useContext(AppContext);

  const getServices = async () => {
    setLoading(true);
    const headers = { key };
    try {
      const resp = await API.services.getServices(
        { type: domain, state: 'ACTIVE' },
        headers
      );
      if (resp && resp.data.data) {
        setServices(resp.data.data);
      }
    } catch (error) {
      console.log(error);
      setServices([])
    } finally {
      setLoading(false);
    }
  };

  const selectHandler = (selected) => {
    setSelected(selected);
  };

  const handleNext = () => {
    childRef.current.onIntegrate(() => {
      setCurrentStep(current + 1)
    });
  };

  React.useEffect(() => {
    getServices();
  }, [domain]);

  React.useEffect(() => {
    /* events */
    Event.customREventList.forEach((event: EventTypes) => {
      Event.on(event, getServices);
    })

    return () => {
      Event.customREventList.forEach((event: EventTypes) => {
        Event.off(event, getServices);
      })
    };
  }, []);

  const onOkProps: ButtonProps = {
    disabled: !selected,
    loading: childRef.current?.loading,
  };

  const iconLayout: React.SVGProps<SVGSVGElement> = {
    width: 50,
    height: 50
  }

  const getLogo = React.useCallback((name: string) => {
    name = name?.toLowerCase();
    if (name.startsWith('github')) {
      return <Github {...iconLayout} />;
    } else if (name.startsWith('jira')) {
      return <Jira {...iconLayout} />
    } else if (name.startsWith('servicenow')) {
      return <Servicenow {...iconLayout} />
    }
    else if (name.startsWith('gitlab')) {
      return <Gitlab {...iconLayout} />;
    } else if (name.startsWith('bitbucket')) {
      return <Bitbucket {...iconLayout} />;
    } else if (name.startsWith('ado')) {
      return <ADO {...iconLayout} />;
    }
  }, []);

  return (
    <Space
      direction="vertical"
      className="w-full"
      style={{ height: '100%', justifyContent: 'space-between' }}
    >
      <div {...props} ref={ref} id="service_profile" style={{ flex: 1 }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Typography.Title level={5}>Available services</Typography.Title>
          {loading && <Skeleton />}
          {!loading && (
            <Row className="w-full" gutter={[20, 20]}>
              {Array.isArray(services) &&
                services.map((item, index) => {
                  return (
                    <Col
                      className="w-full"
                      span={24}
                      md={12}
                      xl={10}
                      xxl={6}
                      key={index}
                    >
                      <Card
                        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
                        bordered
                        rootClassName="card"
                        aria-selected={selected === item?.id}
                        onClick={() => selectHandler(item?.id)}
                      >
                        <Space align="center" size={15}>
                          {getLogo(item?.serviceProfile?.name)}
                          <Space direction="vertical">
                            {item?.serviceProfile?.name && (
                              <Typography.Text strong>
                                {item?.serviceProfile?.name}
                              </Typography.Text>
                            )}
                          </Space>
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          )}
          <FormArea
            ref={childRef as any}
            selected={services.find((item) => item?.id === selected) as any}
          />
        </div>
      </div>
      <Footer hideBackButton onSubmit={handleNext} onOkProps={onOkProps} />
    </Space>
  );
});

type fieldTypeConfigTypes = {
  type: string;
  label: string;
  name: string;
  required: boolean;
};

type FormAreaTypes = {
  selected: ServiceTypes;
};

const FormArea = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & FormAreaTypes
>(({ selected, ...props }, ref) => {
  const { organization, setIntegration, domain: type } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const integrationType = Form.useWatch('integrationType', form);

  const fields = React.useMemo(() => {
    if (selected) {
      return selected?.serviceProfile?.accessPointConfigs;
    }
    return [];
  }, [selected]);

  const integrationPayloadKey = {
    API_KEY: {
      value: 'apiKey'
    },
    USERNAME: {
      value: 'username'
    },
    PASSWORD: {
      value: 'password'
    },
    DOMAIN: {
      value: 'domain'
    }
  }

  const onIntegrate = (callback) => {
    if (organization) {
      form
        .validateFields()
        .then(async (resp) => {
          Object.entries(resp).map(([key, value]) => {
            delete resp[key];
            if (!integrationPayloadKey?.[key]) {
              alert(`${key} is not configured in mapper`)
            }
            resp[integrationPayloadKey?.[key]?.['value'] ?? key] = value;
          })

          const formValues: Payload = {
            name: `${selected?.serviceProfile?.name} integration`,
            type,
            subOrganization: { name: organization },
            target: {
              accessPoint: {
                type: 'SP',
                serviceProfile: {
                  id: selected?.serviceProfile.id,
                },
                accessPointConfig: {
                  type: resp.integrationType || 'APIKEY_FLW',
                },
                ...resp,
              },
            },
          };
          setLoading(true);
          try {
            const resp = await API.services.createIntegrations(formValues);
            const { data } = resp;
            setIntegration(data);
            setTimeout(callback, 1000);
          } catch (error) {
            let errorMessage: string = 'Something went wrong';
            if (error.response.status === 400) {
              const data = error.response.data;
              if (data && Array.isArray(data) && data.length) {
                errorMessage = data[0]?.errorMessage;
              } else {
                errorMessage = data.error;
              }
            }
            messageApi.open({
              type: 'error',
              content: errorMessage,
            });
          } finally {
            setLoading(false);
          }
        })
        .catch(() => { });
    } else {
      messageApi.open({
        type: 'error',
        content: `Please enter the organization name before creating integration`,
      });
    }
  };

  React.useImperativeHandle(ref, (): any => {
    return { onIntegrate, loading };
  });

  const fieldConfigs: Array<fieldTypeConfigTypes> = React.useMemo(() => {
    if (!fields) return undefined;
    if (fields.length === 1) {
      const [field] = fields;
      return field.fieldTypeConfigs;
    } else {
      const fieldConfig = fields.find((item) => item.type === integrationType);
      if (fieldConfig) {
        return fieldConfig.fieldTypeConfigs;
      }
      return undefined;
    }
  }, [integrationType, fields]);

  React.useEffect(() => {
    form.resetFields();
  }, [selected]);

  if (!selected) return null;

  return (
    <div {...props} ref={ref}>
      <Form layout="vertical" form={form}>
        {contextHolder}
        <Card>
          <Space direction='vertical'>
            <Typography.Title level={5}>
              {`Configure ${selected?.serviceProfile?.name} services`}
            </Typography.Title>

            <Space direction="vertical">
              {fields?.length > 1 && (
                <Space direction="vertical">
                  <div>
                    <Typography.Text strong>
                      Select the integration type
                    </Typography.Text>
                  </div>
                  <FormItem name={'integrationType'} rules={[{ required: true }]}>
                    <Radio.Group>
                      <Space direction="vertical">
                        {fields.map((field, index) => {
                          return (
                            <Radio value={field.type} key={index}>
                              {field?.label}
                            </Radio>
                          );
                        })}
                      </Space>
                    </Radio.Group>
                  </FormItem>
                </Space>
              )}
              <Space direction="vertical" className="w-full">
                {fieldConfigs &&
                  fieldConfigs.map(({ ...field }, index) => {
                    return (
                      <div key={index}>
                        <div style={{ margin: '.5rem 0' }}>
                          <Typography.Text strong>
                            <span style={{ color: 'red' }}>*</span>
                            <span >
                              {`Please enter your ${field.type?.toString()?.toLowerCase()}`}
                            </span>
                          </Typography.Text>
                        </div>
                        <Form.Item
                          key={index}
                          name={field.type}
                          rules={[{ required: field.required }]}
                        >
                          {
                            <Input
                              style={{ width: '35rem' }}
                              placeholder={`Enter your ${field.type?.toString()?.toLowerCase()}`}
                            />
                          }
                        </Form.Item>
                      </div>
                    );
                  })}
              </Space>
            </Space>
          </Space>
        </Card>
      </Form>
    </div>
  );
});
