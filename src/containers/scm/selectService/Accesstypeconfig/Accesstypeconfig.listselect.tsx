import { Button, Card, Col, Flex, Radio, Row, Space, Typography } from 'antd';
import serviceAccessTypeConfig from '../mocks/services.accesstype.json';
import { MouseEvent, useState } from 'react';
import { ServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { ServiceConfigType, ServiceTypes } from '../types';
import { AccessTypeConfigForm } from '.';

{/* <FormArea
                        ref={childRef as any}
                        selected={services.find((item) => item?.id === selected) as any}
                      /> */}

const CARD_STYLE: React.CSSProperties = {
   cursor: 'pointer',
   width: 'full'
}

type AccessTypeConfigListSelectProps = {
   selectedService?: ServiceTypes
}

export const AccessTypeConfigListSelect = (props: AccessTypeConfigListSelectProps) => {

   const { selectedService } = props;

   const [selectedServiceConfig, setSelectedServiceConfig] = useState<ServiceConfigType>();
   const [selectedIndex, setSelectedIndex] = useState<number>();

   const [open, setOpen] = useState<boolean>(false);

   const onselect = (selected: ServiceConfigType, index: number) => {

      if (selectedIndex === index) {
         setSelectedIndex(null);
         setSelectedServiceConfig(null)
      } else {
         setSelectedServiceConfig(selected);
         setSelectedIndex(index);
      }
   }

   const onOpen = () => {
      setOpen(true);
   }, onCancel = () => {
      setOpen(false);
   }

   return (
      <ServiceConfigTypeProvider
         value={{ selectedServiceConfig, selectedService }}
      >
         <Flex vertical gap={'small'}>
            <Typography.Title level={4}>Select the config type to create integration</Typography.Title>
            <Row gutter={[20, 20]} style={{ width: 'full' }}>
               {serviceAccessTypeConfig.map((item, i) => {
                  const { label, description } = item;

                  const selected = i === selectedIndex;

                  return (
                     <Col key={i}>
                        <Card
                           onClick={() => onselect(item, i)}
                           style={CARD_STYLE}
                        >
                           <Flex gap={'small'} align='flex-start'>
                              <Radio checked={selected} />
                              <Flex vertical gap={'small'} align='flex-start' justify='flex-start'>
                                 {label ? (
                                    <Typography.Title level={5} style={{ marginBottom: 0 }}>{label}</Typography.Title>
                                 ) : null}
                                 {description ? (
                                    <Typography.Text ellipsis>{description}</Typography.Text>
                                 ) : null}
                              </Flex>
                           </Flex>
                        </Card>
                     </Col>
                  )
               })}
            </Row>
            <Flex align='center' justify='flex-end'>
               <Space>
                  <Button
                     disabled={!selectedIndex?.toString()}
                     type='primary'
                     onClick={onOpen}
                  >
                     Proceed
                  </Button>
               </Space>
            </Flex>
         </Flex>
         <AccessTypeConfigForm
            open={open}
            onCancel={onCancel}

         />
      </ServiceConfigTypeProvider>
   )
}