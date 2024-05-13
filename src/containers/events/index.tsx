/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from 'react';
import './style.scss';
import { useLayout } from '../../hooks/useLayout';
import { EventList } from './eventList';
import { EventContent } from './eventContent';

const data = [
   {

      name: 'Github event 1',
      "payload": [
         {
            "provider": "github 2"
         },
         {
            "provider": "github 1"
         },
         {
            "provider": "github 1"
         },
         {
            "provider": "github 1"
         },
         {
            "provider": "github 1"
         }
      ]
   },
   {

      name: 'Gitlab event 2',
      "payload": [
         {
            "provider": "Gitlab 2"
         },
         {
            "provider": "Gitlab 1"
         },
         {
            "provider": "Gitlab 1"
         },
         {
            "provider": "Gitlab 1"
         },
         {
            "provider": "Gitlab 1"
         }
      ]
   },
   {
      name: 'Ado event 3',
      "payload": [
         {
            "provider": "Ado 2"
         },
         {
            "provider": "Ado 1"
         },
         {
            "provider": "Ado 1"
         },
         {
            "provider": "Ado 1"
         },
         {
            "provider": "Ado 1"
         }
      ]
   }
]

type EventContextType = {
   selected?: { [key: string]: any }
}
export const EventContext = React.createContext<EventContextType>(null);

export const Events = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const { style } = useLayout();
   const [selected, setSelected] = React.useState<{ [key: string]: unknown }>(undefined);

   React.useEffect(() => {
      if (data.length) setSelected(data[0])
   }, [])

   return (
      <EventContext.Provider value={{ selected }}>
         <div {...props} style={{ ...style }} className='event-list' ref={ref}>
            <div className='event-selector'>
               <EventList onSelect={setSelected} dataSource={data} />
            </div>
            <EventContent className='event-content' />
         </div>
      </EventContext.Provider>
   )
})