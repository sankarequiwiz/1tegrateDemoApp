import React, { HTMLProps } from 'react';
import { ServiceTypes } from './types';
import { ProviderCard } from './providerCard';
import { AppContext } from '../../../context/AppProvider';
import GridExampleUsage from '../../../components/resposiveGrid';

type TileListProps = {
   items?: Array<ServiceTypes>
   formContent?: React.JSX.Element | null | undefined | boolean
   onSelectTile?: (selectedIndex: number) => void;
   selectedIndex?: number
}

export const TileList = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & TileListProps>(
   (props, ref) => {
      const {
         items = [],
         onSelectTile,
         selectedIndex,
         formContent = null,
         ...rest
      } = props;

      const {
         setSelectedService: setSelected,
         selectedService: selected,
      } = React.useContext(AppContext);


      const selectHandler = (arg, index) => {
         setSelected(arg);
         if (typeof onSelectTile === 'function') {
            onSelectTile(index)
         }
      };

      return (
         <div {...rest} ref={ref}>
            <GridExampleUsage
               selectedIndex={selectedIndex}
               detailedPanel={formContent}
               tiles={
                  items.map((item, index) => {
                     return (
                        <ProviderCard
                           key={index}
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
                     )
                  })
               }
            />
         </div>
      )
   })