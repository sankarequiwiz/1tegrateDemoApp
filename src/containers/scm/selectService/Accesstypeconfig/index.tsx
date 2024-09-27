import { Button, ButtonProps, Flex, Form, Modal, ModalProps, Space, Typography, message } from 'antd';
import { MouseEvent, useContext, useMemo, useState } from 'react';
import { ServiceAccessTypeEnum } from '../constant';
import { APIKeyFlowIntegration } from './apikeyflow';
import { Payload } from '../types';
import API from '../../../../services';
import { AppContext } from '../../../../context/AppProvider';
import { useApiKeyFlowPayload } from '../../../../hooks/useDeriveIntegrationPayload';
import { FormValidationState, ServiceConfigTypeProvider, useServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { parseError } from '../../../../utils/API/fetchInstance';
import { AppFlowConfig } from './appflow';

type AccessTypeConfigFormProps = {
} & ModalProps

type ModalFooterProps = {
   onTest?: (e: MouseEvent<HTMLDivElement>) => void
   loadingButtonProps?: ButtonProps
} & Pick<ModalProps, 'onOk' | 'onCancel' | 'okButtonProps'>

const TEST_INTEGRATION_BTN_STYLE: React.CSSProperties = { fontSize: "14px", color: "#1677ff", backgroundColor: "#eff6ff" }

const ModalFooter = (props: ModalFooterProps) => {

   const {
      onOk,
      onCancel,
      okButtonProps,
      loadingButtonProps = {},
      onTest
   } = props;

   const { style: testIntegrationStyle = {} } = loadingButtonProps;

   return (
      <Flex justify='space-between'>
         <Space>
            <Button onClick={onCancel} danger>Close</Button>
         </Space>
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

   const {
      type = null
   } = selectedServiceConfig;

   const [form] = Form.useForm();

   const {
      onCreateIntegration,
      onTestIntegration,
      isTesting,
      isCreating,
      isIntValidated,
      messageInstance: [, contextHolder]
   } = useApiKeyFlowPayload({
      selectedService: selected,
      selectedServiceConfig
   });

   const onOk = (e: MouseEvent<HTMLButtonElement>) => {
      typeof onOkProp === 'function' && onOkProp(e);

      if (type === ServiceAccessTypeEnum.APIKey) {
         form.validateFields().then(onCreateIntegration).catch(() => { });
      } else {

      }
   },
      onCancel = (e: MouseEvent<HTMLButtonElement>) => {
         typeof onCancelProp === 'function' && onCancelProp(e)
      };

   const resolveBody = useMemo(() => {
      switch (type) {
         case ServiceAccessTypeEnum.APIKey:
            return (
               <APIKeyFlowIntegration />
            );
         case ServiceAccessTypeEnum.AppFlow:
            return (
               <AppFlowConfig />
            )
         default:
            return null;
      }
   }, [type]);

   const isAppFlow = useMemo(() => (
      selectedServiceConfig?.type === ServiceAccessTypeEnum.AppFlow
   ), [selectedServiceConfig])

   return (
      <>
         {contextHolder}
         <Modal
            onCancel={onCancel}
            open={open}
            title={(
               <Typography.Title level={4}>
                  {`${selectedServiceConfig?.label}`}
               </Typography.Title>
            )}
            {...rest}
            footer={(
               !isAppFlow ? (
                  <ModalFooter
                     onOk={onOk}
                     okButtonProps={{ loading: isCreating }}
                     loadingButtonProps={{
                        style: {
                           display: isAppFlow ? 'none' : 'block'
                        },
                        loading: isTesting
                     }}
                     onCancel={onCancel}
                     onTest={() => {
                        form.validateFields().then(onTestIntegration).catch(() => { })
                     }}
                  />
               ) : false
            )}
         >
            <ServiceConfigTypeProvider
               value={{
                  form,
                  selectedServiceConfig,
                  selectedService: selected,
                  formValidationState: isIntValidated,
                  ...restValue
               }}
            >
               {resolveBody}
            </ServiceConfigTypeProvider>
         </Modal>
      </>
   )
}