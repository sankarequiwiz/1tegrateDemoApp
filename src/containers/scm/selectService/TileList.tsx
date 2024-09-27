import React, { HTMLProps, useState } from 'react';
import { ServiceTypes } from './types';
import { ProviderCard } from './providerCard';
import { AppContext, useAppProvider } from '../../../context/AppProvider';
import { Col, Row } from 'antd';
import { ServiceAccessTypeForm } from './accesstype';

type TileListProps = {
   items?: Array<ServiceTypes>
   formContent?: React.JSX.Element | null | undefined | boolean
   onSelectTile?: (selectedIndex: number) => void;
   selectedIndex?: number
   selectedService: ServiceTypes
}

export const TileList = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & TileListProps>(
   (props, ref) => {
      const {
         items = [],
         onSelectTile,
         selectedIndex,
         formContent = null,
         selectedService,
         ...rest
      } = props;

      const { accessPointModalOpen, setAccessPointModalOpen } = useAppProvider()

      const {
         setSelectedService: setSelected,
         selectedService: selected
      } = React.useContext(AppContext);


      const selectHandler = (arg, index) => {
         setSelected(arg);
         if (typeof onSelectTile === 'function') {
            onSelectTile(index)
         }
         setAccessPointModalOpen(true)
      };

      const onCancel = () => {
         setAccessPointModalOpen(false);
      }

      return (
         <div {...rest} ref={ref}>
            <Row gutter={[20, 20]}>
               {items.map((item, index) => {
                  return (
                     <Col
                        span={4}
                        key={index}
                     >
                        <ProviderCard
                           style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
                           bordered
                           selected={selectedIndex === index}
                           rootClassName="card"
                           aria-selected={selected === item?.id}
                           onSelectProvider={() => {
                              selectHandler(item?.id, index)
                           }}
                           item={item}
                        />
                     </Col>
                  )
               })}
            </Row>
            <ServiceAccessTypeForm
               open={accessPointModalOpen}
               selected={selectedService}
               onCancel={onCancel}
            />
         </div>
      )
   })
