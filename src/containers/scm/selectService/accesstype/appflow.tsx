import { Button, ButtonProps, Flex, Tabs, Typography } from "antd"
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context";
import { MouseEvent, useMemo, useState } from "react";
import { ProviderIndicator } from "./providerIndicator";

import { useAppProvider } from "../../../../context/AppProvider";



export const APPKeyFlow = () => {

   const {
      selectedServiceConfig,
   } = useServiceConfigTypeProvider();

   const { setAccessPointModalOpen, setRedirectModalOpen } = useAppProvider()

   const [activeKey, setActiveKey] = useState<number>(0);
   const [loading] = useState<boolean>(false);

   const segments = selectedServiceConfig?.appConfig?.segments ?? [];

   const attentionInfos = useMemo(() => {
      const tempArr = [];
      segments?.forEach((i) => {
         const steps = i?.authorizationProcessConfig?.attentionInfo?.processSteps ?? [];
         tempArr.push(...steps);
      })
      return tempArr;
   }, [segments]);

   const onMoveWindow = () => {
      setActiveKey((prev) => {
         return prev + 1;
      })
   }

   const onBackWindow = () => {
      setActiveKey((prev) => prev - 1)
   }

   const onContinue = async () => {
      setAccessPointModalOpen(false);
      setRedirectModalOpen(true);
   }

   const tabItems: any = useMemo(() => {
      return attentionInfos?.map((item, index) => {
         return {
            label: '',
            key: index,
            children: (
               <Windows
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
                  onButtonProps={{
                     loading,
                     disabled: loading
                  }}
               />
            )
         }
      })
   }, [attentionInfos])

   const acceptanceData = { formUrl: "https://api.example.com/install", }

   return (
      <>
         <Tabs
            className="hide-header"
            items={tabItems}
            activeKey={activeKey as any}
         />
      </>
   )
}

type WindowsProps = {
   info: {
      "title": string,
      "subTitle": string,
      "description": string,
      "options": {
         "type": string,
         "name": string,
         "requiresUserConfirmation": boolean,
         "requiresCloseWindow": boolean
      }
   },
   onProceed: (e: MouseEvent<HTMLButtonElement>) => void
   onBack: (e: MouseEvent<HTMLButtonElement>) => void

   backButtonProps?: ButtonProps
   onButtonProps?: ButtonProps
}

export const Windows = (props: WindowsProps) => {

   const {
      onProceed,
      onBack,
      backButtonProps,
      onButtonProps
   } = props;

   const {
      selectedService
   } = useServiceConfigTypeProvider();

   const { info } = props;

   return (
      <Flex vertical gap={'large'}>
         <ProviderIndicator selectedService={selectedService} />
         <Flex vertical gap={'small'} align="center">
            <Typography.Title style={{ marginBottom: 0 }} level={4}>{info?.title}</Typography.Title>
            <Typography.Text>{info?.subTitle}</Typography.Text>
            <Typography.Text type="secondary">{info?.description}</Typography.Text>
         </Flex>
         <Flex vertical gap={'small'}>
            <Button type='primary' onClick={onProceed} {...onButtonProps} >{info?.options?.name}</Button>
            <Button type='default' onClick={onBack} {...backButtonProps} >Go back</Button>
         </Flex>
      </Flex>
   )
}
