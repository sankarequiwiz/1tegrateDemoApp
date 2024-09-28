import { MouseEvent } from 'react';
import { useServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { ProviderIndicator } from './providerIndicator';
import { Button, ButtonProps, Flex, Typography } from 'antd';


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

export const AttentionInfoWindows = (props: WindowsProps) => {

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
