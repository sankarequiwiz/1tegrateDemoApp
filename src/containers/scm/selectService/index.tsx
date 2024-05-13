/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from 'react';
import API from '../../../services';
import { ButtonProps, Card, Col, Form, Input, Radio, Row, Skeleton, Space, Typography, message } from 'antd';
import './style.scss';

import { AppContext } from '../../../context/AppProvider';
import { Footer } from '../../../components/footer';
import { Payload, ServiceTypes } from './types';
import services from '../../../services';
import FormItem from 'antd/es/form/FormItem';

type VoidFunction = () => void;

export const SelectService = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
      const [services, setServices] = React.useState<Array<ServiceTypes>>([]);
      const [loading, setLoading] = React.useState<boolean>(false);
      const childRef = React.useRef<{ onIntegrate: (callBack: VoidFunction) => void, loading: boolean }>();

      const { setCurrentStep, current, setSelectedService: setSelected, selectedService: selected, accessKey: key, domain } = React.useContext(AppContext);

      const getServices = async () => {
            setLoading(true);
            const headers = { key }
            try {
                  const resp = await API.services.getServices({ type: domain, state: 'ACTIVE' }, headers);
                  if (resp && resp.data.data) {
                        setServices(resp.data.data);
                  }
            } catch (error) {
                  console.log(error);
            } finally {
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
            disabled: !selected,
            loading: childRef.current?.loading
      };

      const getLogo = React.useCallback((name: string) => {
            name = name?.toLowerCase();
            if (name.startsWith('github')) {
                  return (<svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" className="octicon octicon-mark-github v-align-middle color-fg-default">
                        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                  </svg>
                  )
            } else if (name.startsWith('gitlab')) {
                  return (<svg width="31" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="tanukiHomeDesktop" data-v-52cd803a=""><title id="tanukiHomeDesktop">GitLab home page</title><path d="M31.4618 12.7787L31.417 12.6641L27.0667 1.31308C26.9783 1.09046 26.8218 0.90145 26.6197 0.773028C26.416 0.644476 26.1775 0.582308 25.937 0.595107C25.6965 0.607906 25.4659 0.695039 25.277 0.844481C25.0899 0.994513 24.955 1.1998 24.8915 1.43106L21.9503 10.4324H10.0509L7.10976 1.43106C7.04625 1.1998 6.91133 0.994513 6.72425 0.844481C6.53618 0.694035 6.30572 0.606246 6.06523 0.593431C5.82473 0.580616 5.58625 0.64342 5.38326 0.773028C5.18023 0.900924 5.02312 1.09005 4.9346 1.31308L0.579314 12.679L0.534448 12.792C-0.0907536 14.429 -0.167604 16.2247 0.315452 17.9091C0.798508 19.5935 1.81536 21.0756 3.21309 22.1324L3.22971 22.144L3.26793 22.1739L9.90306 27.1407L13.1832 29.625L15.1773 31.1354C15.4115 31.3124 15.6971 31.4082 15.9907 31.4082C16.2842 31.4082 16.5698 31.3124 16.8041 31.1354L18.7981 29.625L22.0799 27.1407L28.7533 22.144L28.7715 22.1307C30.174 21.0749 31.1949 19.5916 31.6802 17.9045C32.1656 16.2175 32.0889 14.4184 31.4618 12.7787Z" fill="#E24329"></path><path d="M31.462 12.7787L31.4172 12.6641C29.2955 13.1013 27.2962 14.0005 25.5614 15.2978L16.0083 22.5378C19.2652 25.0005 22.1001 27.1407 22.1001 27.1407L28.7734 22.144L28.7917 22.1307C30.1907 21.0723 31.2076 19.5877 31.6893 17.9009C32.171 16.214 32.0912 14.4163 31.462 12.7787Z" fill="#FC6D26"></path><path d="M9.9082 27.1407L13.1834 29.625L15.1774 31.1354C15.4117 31.3124 15.6972 31.4082 15.9908 31.4082C16.2844 31.4082 16.57 31.3124 16.8042 31.1354L18.7982 29.625L22.0801 27.1407C22.0801 27.1407 19.2452 25.0005 15.9883 22.5378L9.9082 27.1407Z" fill="#FCA326"></path><path d="M6.43513 15.3045C4.70076 14.0067 2.70123 13.108 0.579333 12.6724L0.534467 12.7854C-0.0923403 14.4232 -0.170036 16.2203 0.313079 17.9061C0.796194 19.5919 1.81396 21.0751 3.21311 22.1324L3.22973 22.144L3.26795 22.1739L9.90307 27.1407L16.0081 22.5378L6.43513 15.3045Z" fill="#FC6D26"></path></svg>
                  )
            } else if (name.startsWith('bitbucket')) {
                  return (<img width="34" height="32" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OncSEQCPit3dLLOLGlf-9lntTMTyxvnCsQ&s" alt="Bit Bucket" />
                  )
            } else if (name.startsWith('ado')) {
                  return (<svg fill="none" width="34" height="34" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="12" x2="12" y1="20.9438" y2="3.03371"><stop offset="0" stopColor="#0078d4" /><stop offset=".16" stopColor="#1380da" /><stop offset=".53" stopColor="#3c91e5" /><stop offset=".82" stopColor="#559cec" /><stop offset="1" stopColor="#5ea0ef" /></linearGradient><path d="m21 6.3708v10.9439l-4.5 3.6853-6.975-2.5393v2.5169l-3.94874-5.1574 11.50874.8989v-9.85392zm-3.8362.55055-6.4576-3.92135v2.57305l-5.9287 1.74157-1.7775 2.28091v5.17977l2.5425 1.1236v-6.64045z" fill="url(#a)" /></svg>
                  )
            }
      }, [])


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
                                                            <Col className='w-full' span={24} md={12} xl={10} xxl={6} key={index}>
                                                                  <Card
                                                                        bordered
                                                                        rootClassName='card'
                                                                        aria-selected={selected === item?.id}
                                                                        onClick={() => selectHandler(item?.id)}
                                                                  >
                                                                        <Space align='start'>
                                                                              {getLogo(item?.serviceProfile?.name)}
                                                                              <Space direction='vertical'>
                                                                                    {
                                                                                          item?.serviceProfile?.name && (
                                                                                                <Typography.Text strong>{item?.serviceProfile?.name}</Typography.Text>
                                                                                          )
                                                                                    }
                                                                                    {
                                                                                          item?.serviceProfile?.description && (
                                                                                                <Typography.Text type='secondary'>{item?.serviceProfile?.description}</Typography.Text>
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
                                    selected={services.find((item) => item?.id === selected) as any}
                              />
                        </div>
                  </div>
                  <Footer hideBackButton onSubmit={handleNext} onOkProps={onOkProps} />
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
            const [loading, setLoading] = React.useState<boolean>(false);

            const [messageApi, contextHolder] = message.useMessage();

            const [form] = Form.useForm();
            const integrationType = Form.useWatch('integrationType', form)

            const fields = React.useMemo(() => {
                  if (selected) {
                        return selected?.serviceProfile?.accessPointConfigs
                  }
                  return [];
            }, [selected]);

            const onIntegrate = (callback) => {
                  if (organization) {
                        form.validateFields().then(async (resp) => {
                              const key = resp[fieldConfigs[0].name];
                              const formValues: Payload = {
                                    name: ``,
                                    subOrganization: { name: organization },
                                    target: {
                                          accessPoint: {
                                                type: 'SP',
                                                serviceProfile: {
                                                      id: selected?.serviceProfile.id
                                                },
                                                accessPointConfig: {
                                                      type: resp.integrationType || 'APIKEY_FLW'
                                                },
                                                apiKey: key
                                          }
                                    }
                              };
                              setLoading(true);
                              try {
                                    const resp = await services.services.createIntegrations(formValues);
                                    const { data } = resp;
                                    setIntegration(data)
                                    setTimeout(callback, 1000)
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

                        }).catch(() => { })
                  } else {
                        messageApi.open({
                              type: 'error',
                              content: `Please enter the organization name before creating integration`,
                        });
                  }
            }

            React.useImperativeHandle(ref, (): any => {
                  return { onIntegrate, loading }
            });

            const fieldConfigs: Array<fieldTypeConfigTypes> = React.useMemo(() => {
                  if (!fields) return undefined;
                  if (fields.length === 1) {
                        const [field] = fields;
                        return field.fieldTypeConfigs;
                  } else {
                        const fieldConfig = fields.find((item) => item.type === integrationType)
                        if (fieldConfig) {
                              return fieldConfig.fieldTypeConfigs;
                        }
                        return undefined;
                  }
            }, [integrationType, fields])

            React.useEffect(() => {
                  form.resetFields();
            }, [selected])

            if (!selected) return null;

            return (
                  <div {...props} ref={ref}>
                        <Form layout='vertical' form={form}>
                              {contextHolder}
                              <Card>
                                    <Space direction='vertical' >
                                          {
                                                fields?.length > 1 && <Space direction='vertical'>
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
                                                                                          <Radio value={field.type} key={index}>{field?.label}</Radio>
                                                                                    )
                                                                              })
                                                                        }
                                                                  </Space>
                                                            </Radio.Group>
                                                      </FormItem>
                                                </Space>
                                          }
                                          <Space direction='vertical' className='w-full'>
                                                {
                                                      fieldConfigs && fieldConfigs.map(({ ...field }, index) => {
                                                            return (
                                                                  <div key={index}>
                                                                        <div style={{ margin: '.5rem 0' }}>
                                                                              <Typography.Text strong>
                                                                               <span style={{color:"red"}}>*</span> Please enter your personal access token :
                                                                              </Typography.Text>
                                                                        </div>
                                                                        <Form.Item key={index} name={field.name} rules={[{ required: field.required }]} >
                                                                              {
                                                                                    <Input style={{ width: '35rem' }} placeholder={"Enter your personal access token"} />
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