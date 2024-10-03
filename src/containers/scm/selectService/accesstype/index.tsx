import  { MouseEvent, useEffect, useState } from 'react';
import { Button, Card, Flex, Modal, ModalProps, Radio, Tabs, Typography } from 'antd';
import { ServiceConfigType, ServiceTypes } from '../types';
import services from '../../../../services';
import { ServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { ConfigWindows } from './configwindow';
import { ProviderIndicator } from './providerIndicator';
import { useAppProvider } from '../../../../context/AppProvider';
import { RedirectAcceptanceModal } from './redirectAcceptanceModal';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { ServiceAccessTypeStateEnum } from '../constant';


type ServiceAccessTypeFormProps = {
   selected?: ServiceTypes
} & ModalProps

type ModalHeaderProps = {
   onBack?: (e: MouseEvent<HTMLButtonElement>) => void
   onClose?: (e: MouseEvent<HTMLButtonElement>) => void
}

export const ModalHeader = (props: ModalHeaderProps) => {

   const { onBack, onClose } = props;

   return (
      <Flex style={{ width: '100%' }} justify='space-between'>
         <Button
            type='text'
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
         >Back</Button>
         <Button type='text'
            onClick={onClose}
            icon={<CloseOutlined width={'.8em'} style={{ scale: '.8' }} />}
         >
         </Button>
      </Flex>
   )
}

export const ServiceAccessTypeForm = (props: ServiceAccessTypeFormProps) => {

   const {
      selected: selectedService,
      onCancel: onCancelProp,
      open: openProp,
      ...rest } = props;

   const open = openProp;
   const { redirectModalOpen } = useAppProvider()

   const serviceId: string = selectedService?.id ?? null;
   const [accessPoints, setAccessPoints] = useState([]);
   const [selectedConfig, setSelectedConfig] = useState<ServiceConfigType>();
   const [selectedIndex, setSelectedIndex] = useState<number>();

   const [activeKey, setActiveKey] = useState('1');

   const onCancel = (e: MouseEvent<HTMLButtonElement>) => {
      if (typeof onCancelProp === 'function') onCancelProp(e);
      setActiveKey('1')
   }

   const getServiceAccessType = async () => {
      try {
         const resp = await services.services.getServiceAccessType(selectedService?.id);
         const { data } = resp?.data;
         setAccessPoints(data.filter(i=>i.state===ServiceAccessTypeStateEnum.Configured))
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
   }, resetTabKey = () => {
      setActiveKey('1')
   }

   const onBack = (e: MouseEvent<HTMLButtonElement>) => {
      if (activeKey === '1') {
         onCancel(e)
      } else {
         setActiveKey('1')
      }
   }

   useEffect(() => {
      serviceId && getServiceAccessType()
   }, [serviceId])

   return (
      <ServiceConfigTypeProvider
         value={{
            selectedService,
            selectedServiceConfig: selectedConfig,
         }}
      >
         <Modal
            {...rest}
            open={open}
            title={null}
            closeIcon={null}
            footer={false}
            closable={false}
            afterClose={resetTabKey}
         >
            <ModalHeader
               onBack={onBack}
               onClose={onCancel}
            />
            <Tabs
               activeKey={activeKey}
               className='hide-header'
               items={[
                  {
                     label: 'config-selection',
                     key: '1',
                     children: (
                        <Flex vertical gap={'small'}>
                           <Flex vertical justify='center' align='center' gap={'middle'}>
                              <ProviderIndicator selectedService={selectedService} />
                              <Flex vertical gap={'small'} style={{ width: '100%' }}>
                                 {accessPoints?.map((i, index) => {
                                    const { label, description } = i,
                                       isSelected = selectedIndex === index

                                    return (
                                       <Card
                                          key={index}
                                          size='small'
                                          className='selectable'
                                          onClick={() => onselect(i, index)}
                                       >
                                          <Flex align='start'>
                                             <Radio checked={isSelected} />
                                             <Flex vertical gap={'small'}>
                                                <Typography.Text strong>{label}</Typography.Text>
                                                {description ? (
                                                   <Typography.Text type='secondary'>{description}</Typography.Text>
                                                ) : null}
                                             </Flex>
                                          </Flex>
                                       </Card>
                                    )
                                 })}
                              </Flex>
                           </Flex>
                           <Flex justify='flex-end'>
                              <Button
                                 type='primary'
                                 onClick={onContinue}
                                 disabled={!selectedConfig}
                              >
                                 Continue
                              </Button>
                           </Flex>
                        </Flex>
                     )
                  },
                  {
                     label: 'config-windows',
                     key: '2',
                     destroyInactiveTabPane: true,
                     children: (
                        <ConfigWindows />
                     )
                  },
               ]}
            />
         </Modal>

         {redirectModalOpen ? (
            <RedirectAcceptanceModal
               open={redirectModalOpen}
            />
         ) : null}
      </ServiceConfigTypeProvider>
   )
}