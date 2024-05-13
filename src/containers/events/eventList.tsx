/* eslint-disable @typescript-eslint/no-explicit-any */
import { List, ListProps, Typography } from "antd";

type EventListTypes = ListProps<{ name: string, payload: Array<any> }> & {
   onSelect?: (selected: { [key: string]: unknown }) => void;
}

export const EventList = (({ onSelect, ...props }: EventListTypes) => {

   const getStringed = (payload) => {
      return JSON.stringify(payload)
   };
   return (
      <List
         {...props}
         renderItem={(item) => {
            const { payload } = item;
            const stringed = getStringed(payload);
            return (
               <List.Item onClick={() => onSelect(item)} key={item?.name}>
                  <List.Item.Meta
                     title={<a>{item?.name}</a>}
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