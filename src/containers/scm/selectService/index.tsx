/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from 'react';
import API from '../../../services';
import { ButtonProps, Card, Col, Form, Input, Radio, Row, Skeleton, Space, Typography, message } from 'antd';
import './style.scss';

// mock
import mock from './mock.json';
import { AppContext } from '../../../context/AppProvider';
import { Footer } from '../../../components/footer';
import { Payload, ServiceTypes } from './types';
import services from '../../../services';
import FormItem from 'antd/es/form/FormItem';

type VoidFunction = () => void

export const SelectService = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
      const [services, setServices] = React.useState<Array<ServiceTypes>>([]);
      const [loading, setLoading] = React.useState<boolean>(false);
      const childRef = React.useRef<{ onIntegrate: (callBack: VoidFunction) => void }>();

      const { setCurrentStep, current, setSelectedService: setSelected, selectedService: selected } = React.useContext(AppContext);

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
            disabled: !selected
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
                                                            <Col className='w-full' span={24} md={12} xl={10}  xxl={6} key={index}>
                                                                  <Card
                                                                        bordered
                                                                        rootClassName='card'
                                                                        aria-selected={selected === item.id}
                                                                        onClick={() => selectHandler(item.id)}
                                                                  >
                                                                        <Space align='start'>
                                                                              <img alt='services_images' src={item.serviceProfile.image.original} />
                                                                              <Space direction='vertical'>
                                                                                    {
                                                                                          item.serviceProfile.name && (
                                                                                                <Typography.Text strong>{item.serviceProfile.name}</Typography.Text>
                                                                                          )
                                                                                    }
                                                                                    {
                                                                                          item.serviceProfile.description && (
                                                                                                <Typography.Text type='secondary'>{item.serviceProfile.description}</Typography.Text>
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
                              <FormArea
                                    ref={childRef as any}
                                    selected={services.find((item) => item.id === selected) as any}
                              />
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
      selected: ServiceTypes
}

const FormArea = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & FormAreaTypes>(
      ({ selected, ...props }, ref) => {
            const { organization, setIntegration } = React.useContext(AppContext);

            const [messageApi, contextHolder] = message.useMessage();

            const [form] = Form.useForm();
            const integrationType  = Form.useWatch('integrationType', form)

            const fields = React.useMemo(() => {
                  if (selected) {
                        return selected.serviceProfile.accessPointConfigs
                  }
                  return [];
            }, [selected]);

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
                                                type: resp.integrationType
                                          },
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
                  form.resetFields();
            }, [selected])

            if (!selected) return null;

            return (
                  <div {...props} ref={ref}>
                        <Form layout='vertical' form={form}>
                              {contextHolder}
                              <Card title={`Enter details for the ${selected.serviceProfile.name}`}>
                                    <Space direction='vertical' >
                                          <Space direction='vertical'>
                                                <div >
                                                      <Typography.Text strong>
                                                            Select the integration type
                                                      </Typography.Text>
                                                </div>
                                                <FormItem name={'integrationType'} rules={[{ required: true }]}>
                                                      <Radio.Group >
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
                                                </FormItem>
                                          </Space>
                                          <Space direction='vertical' className='w-full'>
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
                                          </Space>
                                    </Space>
                              </Card>
                        </Form>
                  </div>
            )
      })