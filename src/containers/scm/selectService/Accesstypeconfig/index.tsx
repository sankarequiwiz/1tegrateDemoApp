import { Button, Flex, Form, Modal, ModalProps, Space, message } from 'antd';
import { MouseEvent, useContext, useMemo, useState } from 'react';
import { ServiceConfigTypeProvider, useServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { API_FLW_INTEGRATION_KEY_MAPPER, ServiceAccessTypeEnum } from '../constant';
import { APIKeyFlowIntegration } from './apikeyflow';
import { Payload } from '../types';
import API from '../../../../services';
import { AppContext } from '../../../../context/AppProvider';
import { useDeriveApiKeyFlowPayload } from '../../../../hooks/useDeriveIntegrationPayload';
import { parseError } from '../../../../utils/API/fetchInstance';

type AccessTypeConfigFormProps = {
} & ModalProps

type ModalFooterProps = {
   onTest?: (e: MouseEvent<HTMLDivElement>) => void
} & Pick<ModalProps, 'onOk' | 'onCancel' | 'okButtonProps'>

const ModalFooter = (props: ModalFooterProps) => {

   const { onOk, onCancel, okButtonProps, onTest } = props;

   return (
      <Flex justify='space-between'>
         <Space>
            <Button onClick={onCancel} danger>Close</Button>
         </Space>
         <Space>
            <Button onClick={onTest} >Test Integration</Button>
            <Button {...okButtonProps} onClick={onOk} type='primary'>Create</Button>
         </Space>
      </Flex>
   )
}

const ELEMENTS = {
   [ServiceAccessTypeEnum.APIKey]: {
      getElement: (props) => <APIKeyFlowIntegration {...props} />
   },
   [ServiceAccessTypeEnum.AppFlow]: {
      getElement: () => 'null'
   }
}

export const AccessTypeConfigForm = (props: AccessTypeConfigFormProps) => {

   const {
      onOk: onOkProp,
      open,
      onCancel: onCancelProp,
      ...rest
   } = props;

   if (!open) return null;

   const {
      selectedServiceConfig,
      selectedService: selected,
      ...restValue
   } = useServiceConfigTypeProvider();
   const [messageApi, contextHolder] = message.useMessage();

   const {
      type = null
   } = selectedServiceConfig;

   const {
      organization,
      setIntegration,
      setCurrentStep,
      current
   } = useContext(AppContext);

   const [form] = Form.useForm();
   const { derive } = useDeriveApiKeyFlowPayload()
   const [isCreating, setIsCreating] = useState<boolean>(false);

   const createIntegration = async (values) => {
      let { flowType, ...formData } = values;

      const payload = derive(formData);

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
                  type: flowType,
               },
               ...payload,
            },
         },
      };

      try {
         setIsCreating(true);
         const resp = await API.services.createIntegrations(formValues);
         const { data } = resp;
         setIntegration(data);
         setTimeout(() => {
            setCurrentStep(current + 1)
         }, 1000);
      } catch (error) {
         const { message } = parseError(error?.response?.data)
         messageApi.open({
            type: 'error',
            content: message,
         });
      } finally {
         setIsCreating(false);
      }
   }

   const onTest = async (values) => {
      let { flowType, ...formData } = values;
      const payload = derive(formData);
      try {
         const { data } = await API.services.testIntegrations({
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
                        flowType
                     ]
                  },
                  ...Object.entries(payload).map(([key, value]) => {
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
         });
         // setCheckData(checkDataa.data.data)
         if (data?.data.some((item) => item.type === "SUCCESS")) {
            // setIsIntValidated("success");
            messageApi.open({
               type: 'success',
               content: <>
                  <strong>Success!</strong> Your credentials have been successfully validated. You can now proceed with your next steps.
               </>
            });
         }
         else if (data.data.some((item) => item.type === "FAILURE")) {
            // setIsIntValidated("error");
            messageApi.open({
               type: 'error',
               content: <>
                  <strong>Oops!</strong> Your tokens are invalid. Please check the information and try again.
               </>
            });
         }
      } catch (error) {
         // setIsIntValidated("error")

         const { message } = parseError(error?.response?.data)
         messageApi.open({
            type: 'error',
            content: message,
         });
      }
   }

   const onOk = (e: MouseEvent<HTMLButtonElement>) => {
      typeof onOkProp === 'function' && onOkProp(e);

      form.validateFields().then((resp) => {
         if (type === ServiceAccessTypeEnum.APIKey) {
            createIntegration(resp)
         }

      }).catch(() => { })
   },
      onCancel = (e: MouseEvent<HTMLButtonElement>) => {
         typeof onCancelProp === 'function' && onCancelProp(e)
      };

   const resolveBody = useMemo(() => (
      ELEMENTS?.[type]?.getElement()
   ), [type]);

   return (
      <>
         {contextHolder}
         <Modal
            onCancel={onCancel}
            open={open}
            title={`${selectedServiceConfig?.label}`}
            {...rest}
            footer={(
               <ModalFooter
                  onOk={onOk}
                  okButtonProps={{ loading: isCreating }}
                  onCancel={onCancel}
                  onTest={() => {
                     form.validateFields().then(onTest).catch(() => { })
                  }}
               />
            )}
         >
            <ServiceConfigTypeProvider
               value={{
                  form,
                  selectedServiceConfig,
                  selectedService: selected,
                  ...restValue
               }}
            >
               {resolveBody}
            </ServiceConfigTypeProvider>
         </Modal>
      </>
   )
}