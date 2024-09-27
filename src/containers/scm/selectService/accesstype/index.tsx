import React, { MouseEvent, useEffect, useState } from 'react';
import { Button, Card, Flex, Modal, ModalProps, Radio, Space, Tabs, Typography } from 'antd';
import { ServiceConfigType, ServiceTypes } from '../types';
import services from '../../../../services';
import { ServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { ConfigWindows } from './configwindow';


type ServiceAccessTypeFormProps = {
   selected?: ServiceTypes
} & ModalProps

const BACK_BTN_STYLE: React.CSSProperties = {
   padding: 0
}, SELECTABLE_CARD_STYLE: React.CSSProperties = {
   cursor: 'pointer'
}

export const ServiceAccessTypeForm = (props: ServiceAccessTypeFormProps) => {

   const {
      selected: selectedService,
      onCancel: onCancelProp,
      ...rest } = props;

   const serviceId: string = selectedService?.id ?? null;
   const [accessPoints, setAccessPoints] = useState([]);
   const [selectedConfig, setSelectedConfig] = useState<ServiceConfigType>();
   const [selectedIndex, setSelectedIndex] = useState<number>();

   const [activeKey, setActiveKey] = useState('1');

   const onCancel = (e: MouseEvent<HTMLButtonElement>) => {
      if (typeof onCancelProp === 'function') onCancelProp(e);
   }

   const getServiceAccessType = async () => {
      try {
         const { data } = await services.services.getServiceAccessType(selectedService?.id);
         setAccessPoints(data)
      } catch (error) {

      }
   }

   const onselect = (newSelected: ServiceConfigType, newSelectedIndex: number) => {
      if (selectedIndex === newSelectedIndex) {
         setSelectedConfig(null)
         setSelectedIndex(null)
      } else {
         setSelectedConfig(newSelected);
         setSelectedIndex(newSelectedIndex)
      }
   }

   const onContinue = () => {
      setActiveKey('2')
   }

   useEffect(() => {
      serviceId && getServiceAccessType()
   }, [serviceId])

   return (
      <ServiceConfigTypeProvider
         value={{
            selectedService,
            selectedServiceConfig: selectedConfig
         }}
      >
         <Modal
            {...rest}
            closeIcon={null}
            title={
               <Button onClick={onCancel} style={BACK_BTN_STYLE} type='link' >Back</Button>
            }
            footer={false}
         >
            <Tabs
               activeKey={activeKey}
               className='hide-header'
               items={[
                  {
                     label: 'config-selection',
                     key: '1',
                     children: (
                        <Flex vertical gap={'small'} align='end'>
                           <Flex vertical justify='center' align='center' gap={'middle'}>
                              <Space direction='vertical' align='center'>
                                 <Space>
                                    <img src={selectedService?.serviceProfile?.image?.small} alt='provider_logo' />
                                 </Space>
                                 <Typography.Title level={4}>How would you like to authenticate?</Typography.Title>
                              </Space>

                              <Flex vertical gap={'small'} >
                                 {accessPoints?.map((i, index) => {
                                    const { label, description } = i,
                                       isSelected = selectedIndex === index

                                    return (
                                       <Card
                                          size='small'
                                          style={SELECTABLE_CARD_STYLE}
                                          onClick={() => onselect(i, index)}
                                       >
                                          <Flex align='start'>
                                             <Radio checked={isSelected} />
                                             <Flex vertical gap={'small'}>
                                                <Typography.Text strong>{label}</Typography.Text>
                                                <Typography.Text type='secondary'>{description}</Typography.Text>
                                             </Flex>
                                          </Flex>
                                       </Card>
                                    )
                                 })}
                              </Flex>
                           </Flex>
                           <Flex>
                              <Button type='primary' onClick={onContinue} disabled={!selectedConfig} >Continue</Button>
                           </Flex>
                        </Flex>
                     )
                  },
                  {
                     label: 'config-windows',
                     key: '2',
                     children: (
                        <ConfigWindows />
                     )
                  },
               ]}
            />
         </Modal>
      </ServiceConfigTypeProvider>
   )
}