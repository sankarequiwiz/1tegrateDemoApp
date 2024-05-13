/* eslint-disable @typescript-eslint/no-explicit-any */
import { List, ListProps, Typography } from "antd";
import { EventContext } from ".";
import React from "react";
import { EventMessageIcon } from "../../components/Events";

type EventListTypes = ListProps<{ name: string, payload: { [key: string]: any } }> & {
   onSelect?: (selected: { [key: string]: unknown }, index: number) => void;
}

export const EventList = (({ onSelect, ...props }: EventListTypes) => {
   const { selected } = React.useContext(EventContext)

   const getStringed = (payload) => {
      return JSON.stringify(payload)
   };
   return (
      <List
         {...props}
         renderItem={(item, index: number) => {
            const { payload } = item;
            const stringed = getStringed(payload);
            return (
               <List.Item aria-selected={index === selected?.index} onClick={() => onSelect(item, index)} key={item?.name}>
                  <List.Item.Meta
                     avatar={<EventMessageIcon />}
                     title={<a>{payload?.name}</a>}
                     description={
                        <Typography.Paragraph
                           ellipsis={{ expandable: true, symbol: 'more' }}
                        >
                           {stringed}
                        </Typography.Paragraph>
                     }
                  />
               </List.Item>
            )
         }}
      />
   )
})