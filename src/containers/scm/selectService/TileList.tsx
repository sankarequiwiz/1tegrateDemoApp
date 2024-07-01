import React, { HTMLProps, useState } from 'react';
import { ServiceTypes } from './types';
import { ProviderCard } from './providerCard';
import { AppContext } from '../../../context/AppProvider';
import GridExampleUsage from '../../../components/resposiveGrid';

type TileListProps = {
   items?: Array<ServiceTypes>
   formContent?: React.JSX.Element | null | undefined | boolean
}

export const TileList = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & TileListProps>(
   (props, ref) => {
      const { items = [], formContent = null } = props;

      const {
         setSelectedService: setSelected,
         selectedService: selected,
      } = React.useContext(AppContext);

      const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

      const selectHandler = (arg, index) => {
         setSelected(arg);
         setSelectedIndex(index)
      };

      return (
         <div {...props} ref={ref}>
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
                           rootClassName="card"
                           aria-selected={selected === item?.id}
                           onSelect={() => selectHandler(item?.id, index)}
                           item={item}
                        />
                     )
                  })
               }
            />
         </div>
      )
   })