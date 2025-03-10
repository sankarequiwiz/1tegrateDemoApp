import { Button, ButtonProps, Flex, Form, Input, ModalProps, Select, Space, Tabs, Typography } from "antd"
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { InputFieldType, ServiceAccessTypeEnum } from "../constant";
import { useApiKeyFlowPayload } from "../../../../hooks/useDeriveIntegrationPayload";
import { AttentionInfoWindows } from "./attentionInfo";
import { ProviderIndicator } from "./providerIndicator";
import { ServiceConfigType } from "../types";
import { useSelfManageWindow } from "../../../../hooks/useSelfManaged";

const INPUT_FIELD_MAPPERS = {
   [InputFieldType.List]: {
      getParseOption(arg: Record<string, any>) {
         const value = arg?.value?.possibleValues ?? [];
         return arg?.name?.possibleValues
            ?.map((label: string, index: number) => ({ label, value: value?.[index] }))
            ?.filter(({ value }) => value)
      },

      getField({ items = [], ...rest }: any) {
         const options = this.getParseOption(items?.[0]?.properties ?? [])
         return <Select {...rest} options={options} allowClear />
      },

      getValidations(validations: Array<{ [key: string]: any }>) {
         return validations?.map(({ required = false }) => ({
            required,
            message: '${name}'
         }))
      }
   },
   [InputFieldType.Text]: {
      getField: (props: any) => {
         return <Input {...props} allowClear />
      },

      getValidations(...args: Array<{ [key: string]: any }>) {
         const [validations] = args;
         return validations?.map(({ required = false }) => ({
            required,
            message: '${name} required'
         }))
      }
   }
}

const getConfigContainer = (type: ServiceAccessTypeEnum, accessPoint: ServiceConfigType) => {

   switch (type) {
      case ServiceAccessTypeEnum.APIKey:
         return accessPoint?.apiKey

      case ServiceAccessTypeEnum.CredentialFlow:
         return accessPoint?.credentialsDetails

      case ServiceAccessTypeEnum.OAuthPasswordFlow:
         return accessPoint?.oAuthPasswordDetails
      default:
         return null;
   }
}

export const APIKeyFlow = () => {

   const {
      selectedServiceConfig
   } = useServiceConfigTypeProvider();

   const attentionInfos = useMemo(() => {
      const configContainer = getConfigContainer(selectedServiceConfig?.type, selectedServiceConfig);
      return (
         configContainer?.
            authorizationProcessConfig?.
            attentionInfo?.
            processSteps ?? []
      )
   }, [selectedServiceConfig]);

   const [activeKey, setActiveKey] = useState(1);
   const [subKey, setSubKey] = useState(0)

   const onMoveWindow = () => {
      setSubKey((prev) => {
         return prev + 1;
      })
   };
   const onContinue = () => {
      setActiveKey(2)
   };

   const onBackWindow = () => { };

   const tabItems: any = useMemo(() => {
      return attentionInfos?.map((item, index) => {
         return {
            label: null,
            key: index,
            children: (
               <AttentionInfoWindows
                  info={item}
                  onProceed={() => {
                     if (index < attentionInfos?.length - 1) {
                        onMoveWindow()
                     } else {
                        // all looks good then go ahead and proceed with redirection process
                        onContinue()
                     }
                  }}
                  onBack={onBackWindow}
                  backButtonProps={{
                     style: {
                        display: index === 0 ? 'none' : 'block'
                     }
                  }}
               />
            )
         }
      })
   }, [attentionInfos])

   return (
      <Flex vertical gap={'small'}>
         <Tabs
            className="hide-header"
            animated
            activeKey={activeKey as any}
            items={[
               {
                  label: null,
                  key: 1,
                  children: (
                     <Tabs
                        activeKey={subKey as any}
                        animated
                        items={tabItems}
                     />
                  )
               },
               {
                  label: null,
                  key: 2,
                  children: (
                     <APIKeyFlowForm />
                  )
               }
            ] as any}
         />
      </Flex>
   )
}

export const APIKeyFlowForm = () => {

   const {
      selectedService,
      selectedServiceConfig
   } = useServiceConfigTypeProvider();

   const [form] = Form.useForm()

   // const getIsSelfManaged = useCallback(() => {
   //    return selectedService?.serviceProfile.deploymentModel?.type === deploymentModel.type.SELF_MANAGED;
   // }, [selectedService])

   const fields = useMemo(() => {
      const stepConfigs = getConfigContainer(selectedServiceConfig?.type, selectedServiceConfig)
         ?.authorizationProcessConfig?.stepConfigs ?? []

      const flattedFieldTypeConfigs = [];

      stepConfigs?.forEach(({ fieldTypeConfigs }) => {
         flattedFieldTypeConfigs.push(...fieldTypeConfigs)
      })
      return flattedFieldTypeConfigs
   }, [selectedServiceConfig]);

   const flwType = useMemo(() => {
      return selectedServiceConfig?.type ?? 'not_set';
   }, [selectedServiceConfig?.type]);

   const {
      onCreateIntegration,
      onTestIntegration,
      isTesting,
      isCreating,
      messageInstance: [, contextHolder],
      formValidationState
   } = useApiKeyFlowPayload({
      selectedService,
      selectedServiceConfig
   }),
      { getIsSelfManaged} = useSelfManageWindow()

   const isSelfManaged = getIsSelfManaged(selectedService)

   const onOk = (_e: MouseEvent<HTMLButtonElement>) => {
      form.validateFields().then(onCreateIntegration).catch(() => { });
   },
      onCancel = (_e: MouseEvent<HTMLButtonElement>) => {
      };

   useEffect(() => {
      form.setFieldValue('flowType', flwType)
   }, [flwType]);

   return (
      <Flex>
         {contextHolder}
         <Form
            layout="vertical"
            form={form}
            style={{ width: '100%' }}
         >
            <Flex vertical gap={'middle'}>
               <ProviderIndicator title='Enter the details for authentication' selectedService={selectedService} />
               <Flex vertical gap={'small'}>
                  <Form.Item
                     name={'flowType'}
                     hidden
                     preserve
                  >
                     <Input value={flwType} />
                  </Form.Item>
                  {fields.map((field, index) => {

                     const { label, name, required, type, property } = field,
                        fieldType = type ?? InputFieldType.Text;

                     const fieldMapper = INPUT_FIELD_MAPPERS?.[fieldType],
                        validations = fieldMapper?.getValidations([{ required }])

                     return (
                        <Form.Item
                           key={index}
                           name={property}
                           label={<b>{label}</b>}
                           hasFeedback
                           rules={validations}
                           messageVariables={{ name: label || property }}
                           validateStatus={formValidationState}
                        >
                           {fieldMapper?.getField({
                              placeholder: `${(name ?? label)?.toString()}`,
                              ...field
                           })}
                        </Form.Item>
                     )
                  })}

                  {isSelfManaged ? (
                     <>
                        <Form.Item name="version" label={<Typography.Text strong>Please select your version</Typography.Text>} rules={[{ required: true }]}>
                           <Select
                              placeholder="Please select your version"
                              allowClear
                              options={selectedService?.versions.map(({ serviceProfileVersion }) => ({
                                 value: serviceProfileVersion?.id,
                                 label: serviceProfileVersion?.name,
                               }))}
                           />
                        </Form.Item>

                        <Form.Item name="url" label={<Typography.Text strong>Please enter your endpoint url</Typography.Text>} rules={[{ required: true }]}>
                           <Input
                              placeholder="Please enter your endpoint url"
                           />
                        </Form.Item>
                     </>
                  ) : null}
               </Flex>

               <ModalFooter
                  onOk={onOk}
                  okButtonProps={{ loading: isCreating }}
                  loadingButtonProps={{
                     loading: isTesting
                  }}
                  onCancel={onCancel}
                  onTest={() => {
                     form.validateFields().then(onTestIntegration).catch(() => { })
                  }}
               />
            </Flex>
         </Form>
      </Flex>
   )
}

const TEST_INTEGRATION_BTN_STYLE: React.CSSProperties = { fontSize: "14px", color: "#1677ff", backgroundColor: "#eff6ff" }
type ModalFooterProps = {
   onTest?: (e: MouseEvent<HTMLDivElement>) => void
   loadingButtonProps?: ButtonProps
} & Pick<ModalProps, 'onOk' | 'onCancel' | 'okButtonProps'>

const ModalFooter = (props: ModalFooterProps) => {

   const {
      onOk,
      okButtonProps,
      loadingButtonProps = {},
      onTest
   } = props;

   const { style: testIntegrationStyle = {} } = loadingButtonProps;

   return (
      <Flex justify='flex-end'>
         <Space>
            <Button
               onClick={onTest}
               {...loadingButtonProps}
               style={{ ...testIntegrationStyle, ...TEST_INTEGRATION_BTN_STYLE }}
            >
               Test Integration
            </Button>
            <Button
               {...okButtonProps}
               onClick={onOk}
               type='primary'
            >
               Create
            </Button>
         </Space>
      </Flex>
   )
}