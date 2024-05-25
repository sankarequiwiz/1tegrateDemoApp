import React, { HTMLProps } from "react";
import { Payload, ServiceTypes } from "./types";
import { Card, Form, Input, Radio, Space, Typography, message } from "antd";
import { AppContext } from "../../../context/AppProvider";
import API from '../../../services';
import FormItem from "antd/es/form/FormItem";

type fieldTypeConfigTypes = {
   type: string;
   label: string;
   name: string;
   required: boolean;
};

type FormAreaTypes = {
   selected: ServiceTypes;
};


export const FormArea = React.forwardRef<
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
