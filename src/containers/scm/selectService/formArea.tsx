import React, { HTMLProps, cloneElement, useCallback } from "react";
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
   dataType?: {
      type: "LIST",
      values: {
         code: string,
         description: string
      }[]
   }
};

type FormAreaTypes = {
   selected: ServiceTypes;
};

const integrationPayloadKey = {
   API_KEY: {
      value: 'apiKey',
      getBaseValues() {
         return this.value
      }
   },
   USERNAME: {
      value: 'username',
      getBaseValues() {
         return this.value
      }
   },
   PASSWORD: {
      value: 'password',
      getBaseValues() {
         return this.value
      }
   },
   DOMAIN: {
      value: 'domain',
      getBaseValues() {
         return this.value
      }
   },
   CLIENT_ID: {
      value: "clientId",
      getBaseValues() {
         return this.value
      }
   },
   CLIENT_SECRET: {
      value: "clientSecret",
      getBaseValues() {
         return this.value
      }
   },
   TENANT_ID: {
      value: "tenantId",
      getBaseValues() {
         return this.value
      }
   },
   SERVICE_REGION: {
      value: "serviceRegion",
      getBaseValues(code) {
         return { code }
      }
   },
   ACCOUNT_ID: {
      value: "accountId",
      getBaseValues() {
         return this.value
      }
   },
   contentType: {
      value: "contentType",
      getBaseValues() {
         return this.value
      }
   },
   version: {
      value: "version",
      getBaseValues() {
         return this.value
      }
   },
   url: {
      value: "url",
      getBaseValues() {
         return this.value
      }
   },
   API_ID: {
      value: "apiId",
      getBaseValues() {
         return this.value
      }
   },
   CODE: {
      value: "code",
      getBaseValues() {
         return this.value
      }
   },
}

const components = {
   LIST: {
      getComp() {
         return <Select />
      }
   }
}

const parseSelectOptions = (arg = []) => {
   return arg.map(({ code: value = null, description: label = null }) => (
      { value, label }
   ))
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
   const [isIntValidated, setIsIntValidated]=React.useState<"" | "error" | "warning" | "success" | "validating">("")
   const[checkData,setCheckData]=React.useState([])
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
   // console.log(flwType,"ftestIntegrations")

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

                  const baseValue = integrationPayloadKey?.[key];

                  if (typeof baseValue?.getBaseValues(value) === 'object') {
                     resp[baseValue?.['value'] ?? key] = baseValue?.getBaseValues(value);
                  } else {
                     resp[integrationPayloadKey?.[key]?.['value'] ?? key] = value;
                  }
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

   const checkIntegrate= async()=>{
      if (organization) {
         form
            .validateFields()
            .then(async (resp) => {
               
               Object.entries(resp).map(([key, value]) => {

                  delete resp[key];
                  if (!integrationPayloadKey?.[key]) {
                     alert(`${key} is not configured in mapper`)
                  }

                  const baseValue = integrationPayloadKey?.[key];

                  if (typeof baseValue?.getBaseValues(value) === 'object') {
                     resp[baseValue?.['value'] ?? key] = baseValue?.getBaseValues(value);
                  } else {
                     resp[integrationPayloadKey?.[key]?.['value'] ?? key] = value;
                  }
               })
               const payload = {
                  criteria: {
                       and: [
                            {
                                 property: "/target/accessPoint/serviceProfile/id",
                                 operator: "=",
                                 values: [
                                      selected?.serviceProfile.id
                                 ]
                            },
                            {
                                 property: "/target/accessPoint/accessPointConfig/type",
                                 operator: "=",
                                 values: [
                                    flwType
                                 ]
                            },
                            ...Object.entries(resp).map(([key,value]) => {
                                 return {
                                      property: `/target/accessPoint/${key}`,
                                      operator: "=",
                                      values: [
                                       value
                                      ]
                                 }
                            })
                       ]
                  }
             }
               try {
                  const checkDataa=await API.services.testIntegrations(payload);
                  setCheckData(checkDataa.data.data)
                  if (checkDataa.data.data.some((item) => item.type === "SUCCESS")) {
                     setIsIntValidated("success");
                     messageApi.open({
                         type: 'success',
                         content: <>
                         <strong>Success!</strong> Your credentials have been successfully validated. You can now proceed with your next steps.
                     </>
                     });
                 } 
                 // Check if any item has type "FAILURE"
                 else if (checkDataa.data.data.some((item) => item.type === "FAILURE")) {
                     setIsIntValidated("error");
                     messageApi.open({
                         type: 'error',
                         content: <>
                         <strong>"Oops!</strong> There was an issue validating your credentials. Please check your information and try again.
                     </>
                     });
                     console.log("console check error");
                 }
               } catch (error) {
                  setIsIntValidated("error")
                  messageApi.open({
                     type: 'error',
                     content: error,
                  });
               } 
            })    
      } 
   }

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

   React.useEffect(()=>{
      checkIntegrate()
   },[])
   React.useEffect(() => {
      form.resetFields();
   }, [selected]);

   React.useEffect(() => {
      if (getIsSelfManaged()) {
         getAllVersions()
      }
   }, [getIsSelfManaged()]);

   if (!selected) return null;
   console.log(checkData.map((item)=>item.type),"checkData")
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

                                    const comp = components?.[field?.dataType?.type]?.getComp() ?? <Input />;

                                    let inputProps = {};

                                    if (field?.dataType?.type === 'LIST') {
                                       inputProps = { ...inputProps, options: parseSelectOptions(field?.dataType?.values) }
                                    }

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
                                             rules={[{ required: field.required, message: <Typography.Text style={{color:"red"}}>{field.name?.toString()}</Typography.Text>}]}
                                             hasFeedback 
                                             validateStatus={isIntValidated}
                                             
                                          >
                                             {cloneElement(comp, {
                                                style: { width: '35rem' },
                                                placeholder: `${field.name?.toString()}`,
                                                ...inputProps
                                             })}
                                          </Form.Item>
                                       </div>
                                    );
                                 })}
                              {getIsSelfManaged() && (
                                 <>
                                    <Form.Item name="version" label={<Typography.Text strong>Please select your version</Typography.Text>} rules={[{ required: true }]}>
                                       <Select
                                          placeholder="Please select your version"
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

                                    <Form.Item name="url" label={<Typography.Text strong>Please enter your endpoint url</Typography.Text>} rules={[{ required: true }]}>
                                       <Input
                                          style={{ width: '35rem' }}
                                          placeholder="Please enter your endpoint url"
                                       />
                                    </Form.Item>
                                 </>
                              )}
                           </Space>
                        </Space>
                     </Space>
                  </Card>
               </Col>
               <Col style={{ display: 'flex', justifyContent: 'flex-end', gap: "1rem" }} span={24}>
                  <Button  onClick={checkIntegrate} style={{fontSize:"14px",color:"#1677ff",backgroundColor:"#eff6ff"}}>Test Integration</Button>
                  <Button loading={loading} onClick={onIntegrate} type="primary" style={{fontSize:"14px"}}>Next</Button>
               </Col>
            </Row>
         </Form>
      </div>
   );
});
