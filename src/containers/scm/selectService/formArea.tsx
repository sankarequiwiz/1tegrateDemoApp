import React, { HTMLProps, useCallback } from "react";
import { Payload, ServiceTypes } from "./types";
import { Button, Card, Col, Form, Input, Radio, Row, Space, Typography, message, Select } from "antd";
import { AppContext } from "../../../context/AppProvider";
import API from '../../../services';
import FormItem from "antd/es/form/FormItem";
import { deploymentModel } from "../../../common/deploymentModal";


const { Option } = Select;

type fieldTypeConfigTypes = {
   type: string;
   label: string;
   name: string;
   required: boolean;
   property: string
};

type FormAreaTypes = {
   selected: ServiceTypes;
};

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
   },
   CLIENT_ID: {
      value: "clientId"
   },
   CLIENT_SECRET: {
      value: "clientSecret"
   },
   TENANT_ID: {
      value: "tenantId"
   },
   SERVICE_REGION: {
      value: "serviceRegion"
   },
   contentType:{
      value :"contentType"
   },
   version:{
      value:"version"
   },
   url:{
      value:"url"
   }


}

export const FormArea = React.forwardRef<
   HTMLDivElement,
   HTMLProps<HTMLDivElement> & FormAreaTypes
>(({ selected, ...props }, ref) => {
   const {
      organization,
      setIntegration,
      setCurrentStep,
      current,
      domain: type,
   } = React.useContext(AppContext);
   const [loading, setLoading] = React.useState<boolean>(false);

   const [messageApi, contextHolder] = message.useMessage();
   const [smData, setSmData] = React.useState([]);

   const [form] = Form.useForm();
   const integrationType = Form.useWatch('integrationType', form);

   const fields = React.useMemo(() => {
      if (selected) {
         return selected?.serviceProfile?.accessPointConfigs;
      }
      return [];
   }, [selected]);

   const flwType = React.useMemo(() => {
      if (fields.length === 1) {
         return fields[0]?.type
      }
      return 'not_set';
   }, [fields]);

   const getIsSelfManaged = useCallback(() => {
      return selected?.serviceProfile.deploymentModel?.type === deploymentModel.type.SELF_MANAGED;
   }, [selected])

   const getAllVersions = async () => {

      try {
         const smResp = await API.services.getSelfManaged(selected?.serviceProfile?.id);
         setSmData(smResp.data.data)

      } catch (error) {
         console.log(error)
      }
   }



   const onIntegrate = () => {
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

               let formValues: Payload = {
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
                           type: flwType,
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
                  setTimeout(() => {
                     setCurrentStep(current + 1)
                  }, 1000);
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

   React.useEffect(() => {
      if (getIsSelfManaged()) {
         getAllVersions()
      }
   }, [getIsSelfManaged()]);

   if (!selected) return null;


   console.log(smData, "smData is printing here")
   return (
      <div {...props} ref={ref}>
         <Form layout="vertical" form={form}>
            {contextHolder}
            <Row gutter={[20, 20]}>
               <Col span={24}>
                  <Card >
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
                                                {field.required && <span style={{ color: 'red' }}>*</span>}
                                                <span >
                                                   {field.name?.toString()}
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
                                                   placeholder={`${field.name?.toString()}`}
                                                />
                                             }
                                          </Form.Item>
                                          {getIsSelfManaged() && (
                                             <>
                                                <Form.Item name="version" label={<Typography.Text strong>Select version</Typography.Text>} rules={[{ required: true }]}>
                                                   <Select
                                                      placeholder="Select version"
                                                      allowClear
                                                   >
                                                      {
                                                         smData.map((item, id) => {
                                                            return <Option key={id} value={item.id}>
                                                               {item?.name}
                                                            </Option>
                                                         })
                                                      }

                                                   </Select>
                                                </Form.Item>
                                                <Form.Item name="contentType" label={<Typography.Text strong>Content type</Typography.Text>} rules={[{ required: true }]}>
                                                   <Select
                                                      placeholder="Select content type"
                                                      allowClear
                                                   >
                                                      <Option value={"application/json"}>
                                                         {"application/json"}
                                                      </Option>
                                                   </Select>
                                                </Form.Item>
                                                <Form.Item name="url" label={<Typography.Text strong>Endpoint Url</Typography.Text>} rules={[{ required: true }]}>
                                                   <Input

                                                      style={{ width: '35rem' }}
                                                      placeholder="Endpoint Url"
                                                   />
                                                </Form.Item>
                                             </>
                                          )}
                                       </div>
                                    );
                                 })}
                           </Space>
                        </Space>
                     </Space>
                  </Card>
               </Col>
               <Col style={{ display: 'flex', justifyContent: 'flex-end' }} span={24}>
                  <Button loading={loading} onClick={onIntegrate} type="primary">Next</Button>
               </Col>
            </Row>
         </Form>
      </div>
   );
});
