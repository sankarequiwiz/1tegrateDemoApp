import { Button, Flex, Modal, Space, Tabs, Typography } from 'antd';
import { useServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { useMemo, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const AppFlowConfig = () => {

   const { selectedServiceConfig } = useServiceConfigTypeProvider();

   const {
      appConfig
   } = selectedServiceConfig;

   const segments = useMemo(() => {
      return appConfig?.segments ?? [];
   }, [appConfig])

   return (
      <Flex style={{padding: '1rem 0'}}>
         <Tabs
            className='hide-header'
            type='card'
            items={
               segments?.map((item) => {
                  const { label, key } = item;
                  return {
                     label,
                     key,
                     children: <SegmentWindow segment={item} />
                  }
               })
            }
         />
      </Flex>
   )
}

type SegmentWindowProps = {
   segment: Record<string, any>
}

const SegmentWindow = (props: SegmentWindowProps) => {

   const { segment = {} } = props;

   const { authorizationProcessConfig } = segment;
   const [stepIndex, setStepIndex] = useState(0);

   const processSteps = authorizationProcessConfig?.attentionInfo?.processSteps ?? [];
   console.log(processSteps)

   return (
      <Flex>
         <Tabs
            type='card'
            className='hide-header'
            items={
               processSteps?.map((item, index) => {
                  const { title: label } = item;
                  return {
                     label,
                     key: index,
                     children: (
                        <ProcessStepWindow item={item} />
                     )
                  }
               })
            }
         />
      </Flex>
   )
}

type ProcessStepWindowProps = {
   item: Record<string, any>
}

const ProcessStepWindow = (props: ProcessStepWindowProps) => {

   const {
      title,
      subTitle,
      description,
      options = {}
   } = props?.item;

   const [modal, contextHolder] = Modal.useModal();

   const confirm = () => {
     modal.confirm({
       title: 'Confirmation',
       icon: <ExclamationCircleOutlined />,
       content: 'Bla bla ...',
       okText: 'Ok',
       onOk: () => {

       }
     });
   };

   return (
      <Flex vertical gap={'large'}>
         <Flex vertical gap={'small'}>
            <Typography.Text strong>{title}</Typography.Text>
            <Typography.Text type='secondary'>{subTitle}</Typography.Text>
            <Typography.Paragraph>{description}</Typography.Paragraph>
         </Flex>
         <Flex justify='flex-end'>
            <Space>
               {options?.requiresCloseWindow ? (
                   <Button type='text' >{'Close'}</Button>
               ): null}
               <Button
                type='primary'
                onClick={confirm}
               >{options?.name}</Button>
            </Space>
         </Flex>
         {contextHolder}
      </Flex>
   )
}