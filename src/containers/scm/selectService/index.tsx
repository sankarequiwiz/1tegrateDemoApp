/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from 'react';
import API from '../../../services';
import { ButtonProps, Card, Col, Form, Input, Radio, RadioChangeEvent, Row, Skeleton, Space, Typography, message } from 'antd';
import './style.scss';

// mock
import mock from './mock.json';
import { AppContext } from '../../../context/AppProvider';
import { Footer } from '../../../components/footer';
import { StepContext } from '../../../context/StepCompProvider';
import { Payload, ServiceProfileDataTypes } from './types';
import services from '../../../services';

type VoidFunction = () => void

export const SelectService = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
      const [services, setServices] = React.useState<Array<ServiceProfileDataTypes>>([]);
      const [loading, setLoading] = React.useState<boolean>(false);
      const [selected, setSelected] = React.useState<ServiceProfileDataTypes>(undefined);
      const childRef = React.useRef<{ onIntegrate: (callBack: VoidFunction) => void }>();

      const { setCurrentStep, current } = React.useContext(StepContext);

      const getServices = async () => {
            setLoading(true);
            try {
                  const resp = await API.services.getServices({})
                  console.log(resp);
            } catch (error) {
                  console.log(error);
            } finally {
                  setServices(mock.data as any);
                  setLoading(false);
            }
      }

      const selectHandler = (selected) => {
            setSelected(selected)
      }

      const handleNext = () => {
            childRef.current.onIntegrate(() => {
                  setCurrentStep(current + 1)
            })
      }

      React.useEffect(() => {
            getServices()
      }, [])

      const onOkProps: ButtonProps = {
            disabled: !selected?.id
      };

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <Typography.Text strong >Available services</Typography.Text>
                              {
                                    loading && <Skeleton />
                              }
                              {
                                    !loading && <Row className='w-full' gutter={[20, 20]}>
                                          {
                                                Array.isArray(services) && services.map((item, index) => {
                                                      return (
                                                            <Col className='w-full' span={6} key={index}>
                                                                  <Card
                                                                        bordered
                                                                        rootClassName='card'
                                                                        aria-selected={selected?.id === item.id}
                                                                        onClick={() => selectHandler(item)}
                                                                  >
                                                                        <Space align='start'>
                                                                              <img alt='services_images' src={item.image.original} />
                                                                              <Space direction='vertical'>
                                                                                    {
                                                                                          item.name && (
                                                                                                <Typography.Text strong>{item.name}</Typography.Text>
                                                                                          )
                                                                                    }
                                                                                    {
                                                                                          item.description && (
                                                                                                <Typography.Text type='secondary'>{item.description}</Typography.Text>
                                                                                          )
                                                                                    }
                                                                              </Space>
                                                                        </Space>
                                                                  </Card>
                                                            </Col>
                                                      )
                                                })
                                          }
                                    </Row>
                              }
                              <FormArea ref={childRef as any} selected={selected as any} />
                        </div>
                  </div>
                  <Footer onSubmit={handleNext} onOkProps={onOkProps} />
            </Space>
      )
})

type fieldTypeConfigTypes = {
      type: string,
      label: string,
      name: string,
      required: boolean
}

type FormAreaTypes = {
      selected: ServiceProfileDataTypes
}

const FormArea = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & FormAreaTypes>(
      ({ selected, ...props }, ref) => {
            const { organization, setIntegration } = React.useContext(AppContext);

            const [integrationType, setIntegrationType] = React.useState<'APIKEY_FLW' | 'EMAIL' | ''>();
            const [messageApi, contextHolder] = message.useMessage();

            const [form] = Form.useForm();

            const fields = React.useMemo(() => {
                  if (selected) {
                        return selected.accessPointConfigs
                  }
                  return [];
            }, [selected]);

            const handleSelectIntegrateType = (event: RadioChangeEvent) => {
                  setIntegrationType(event.target.value);
            }

            const onIntegrate = (callback) => {
                  if (organization) {
                        form.validateFields().then(async (resp) => {
                              const formValues: Payload = {
                                    name: resp.name,
                                    subOrganization: {
                                          name: organization,
                                    },
                                    target: {
                                          accessPoint: {
                                                type: 'SP',
                                                serviceProfile: {
                                                      id: selected?.id
                                                }
                                          },
                                          accessPointConfig: {
                                                type: integrationType
                                          },
                                          emailAddress: '',
                                          apiKey: resp[fieldConfigs[0].name]
                                    }
                              };


                              try {
                                    const resp = await services.services.createIntegrations(formValues);
                                    const { data } = resp;
                                    setIntegration(data as any)
                                    messageApi.open({
                                          type: 'success',
                                          content: `Integration created successfully for ${organization}`,
                                    });
                                    setTimeout(callback, 1000)
                              } catch (error) {
                                    console.log(error);
                              }

                        }).catch(() => { })
                  } else {
                        messageApi.open({
                              type: 'error',
                              content: `Please enter the organization name before creating integration`,
                        });
                  }
            }

            React.useImperativeHandle(ref, (): any => {
                  return { onIntegrate }
            });

            const fieldConfigs: Array<fieldTypeConfigTypes> = React.useMemo(() => {
                  const fieldConfig = fields.find((item) => item.type === integrationType)
                  if (fieldConfig) {
                        return fieldConfig.fieldTypeConfigs;
                  }
                  return undefined;
            }, [integrationType, fields])

            React.useEffect(() => {
                  setIntegrationType('');
            }, [selected])

            if (!selected) return null;

            return (
                  <div {...props} ref={ref}>
                        {contextHolder}
                        <Card title={`Enter details for the ${selected.name}`}>
                              <Space direction='vertical' style={{ margin: '.5rem 0' }}>
                                    <Space direction='vertical'>
                                          <div >
                                                <Typography.Text strong>
                                                      Select the integration type
                                                </Typography.Text>
                                          </div>
                                          <Radio.Group onChange={handleSelectIntegrateType} value={integrationType}>
                                                <Space direction="vertical">
                                                      {
                                                            fields.map((field, index) => {
                                                                  return (
                                                                        <Radio value={field.type} key={index}>{field.label}</Radio>
                                                                  )
                                                            })
                                                      }
                                                </Space>
                                          </Radio.Group>
                                    </Space>
                                    <Space direction='vertical' className='w-full'>
                                          <Form layout='vertical' form={form}>
                                                <div >
                                                      <div style={{ margin: '.5rem 0' }}>
                                                            <Typography.Text strong>
                                                                  Integration name
                                                            </Typography.Text>
                                                      </div>
                                                      <Form.Item name={'name'} rules={[{ required: true }]} >
                                                            {
                                                                  <Input placeholder={'Enter integration name'} />
                                                            }
                                                      </Form.Item>
                                                </div>
                                                {
                                                      fieldConfigs && fieldConfigs.map(({ ...field }, index) => {
                                                            return (
                                                                  <div key={index}>
                                                                        <div style={{ margin: '.5rem 0' }}>
                                                                              <Typography.Text strong>
                                                                                    {field?.label}
                                                                              </Typography.Text>
                                                                        </div>
                                                                        <Form.Item key={index} name={field.name} rules={[{ required: field.required }]} >
                                                                              {
                                                                                    <Input placeholder={field.name} />
                                                                              }
                                                                        </Form.Item>
                                                                  </div>
                                                            )
                                                      })
                                                }
                                          </Form>
                                    </Space>
                              </Space>
                        </Card>
                  </div>
            )
      })