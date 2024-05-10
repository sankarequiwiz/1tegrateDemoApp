/* eslint-disable @typescript-eslint/no-explicit-any */
import { BellFilled } from '@ant-design/icons';
import { Badge, Button, ListProps, Popover, List as AntList, Typography, Space, Divider, Modal } from 'antd';
import React, { HTMLProps } from 'react';
import { socket } from '../config/socket';
import { WatchContext, WatchEvents } from '../context/WatchContext';

const { Item } = AntList;
type LisTypes = {
   listProps?: ListProps<unknown>
   onSelect?: (target: HTMLDivElement, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

type WatchDogTypes = {
   setCount?: React.Dispatch<React.SetStateAction<number>>
}

export const WatchDog = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & WatchDogTypes>(({ ...props }, ref) => {
   const [watchData] = React.useState<Array<{ [key: string]: any }>>(sampleData);
   const [modal, setModal] = React.useState<boolean>(false);
   const [selected, setSelected] = React.useState<string>(undefined);
   const { events } = React.useContext(WatchContext)

   const handleOpenModal = (newSelected: string) => {
      setSelected(newSelected);
      setModal(true);
   }

   const handleClose = () => {
      setSelected(undefined);
      setModal(false);
   }

   const onSelect = (target: HTMLDivElement) => {
      const node = target.getAttribute('listNode');
      handleOpenModal(node)
   }

   const listProps: ListProps<unknown> = {
      dataSource: events,
      style: { height: 100 }
   }

   return (
      <div {...props} ref={ref}>
         <List onSelect={(target) => onSelect(target)} listProps={listProps} />
         <Modal title={`Events for the ${selected}`} open={modal} onCancel={handleClose} >
            {selected && <CodeBlock selected={watchData.find((item) => item.name === selected) as any} />}
         </Modal>
      </div>
   )
})

type CodeBlockTypes = {
   selected?: { [key: string]: any }
}

export const CodeBlock = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & CodeBlockTypes>(({ selected, ...props }, ref) => {
   console.log(selected)
   return (
      <div {...props} ref={ref} >

      </div>
   )
})

export const Notification = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {

   const { setEvents, events } = React.useContext(WatchContext)

   React.useEffect(() => {
      socket.onConnect = () => {
         console.log('websocket connected!')
         socket.subscribe('/topic/events', (message) => {
            setEvents(JSON.parse(message?.body))
         })
      }

      socket.onWebSocketError = (error) => {
         console.error('Error with websocket', error);
      };

      socket.onStompError = (frame) => {
         console.error('Broker reported error: ' + frame.headers['message']);
      };

      socket.activate();
   }, [])

   return (
      <div {...props} ref={ref}>
         <Popover forceRender id='notification-container' placement="bottomRight" content={<WatchDog />} trigger={['click']} >
            <Badge size='small' count={events.length} offset={[10, 10]}>
               <Button size='small' shape='circle' icon={<BellFilled />} />
            </Badge>
         </Popover>
      </div>
   )
})

export const List = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & LisTypes>(
   ({ listProps, ...props }, ref) => {
      const { clearEvents } = React.useContext(WatchContext)

      // const handleEventSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, selected: unknown) => {
      //    const target = e.target as HTMLDivElement;
      //    target.setAttribute('listNode', selected.toString());
      //    onSelect && onSelect(target, e);
      // }

      return (
         <div {...props} ref={ref}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
               <Typography.Text strong>
                  {'Events'}
               </Typography.Text>
               <Space>
                  <Button size='small' onClick={clearEvents}>
                     Clear All Events
                  </Button>
                  <Button size='small' type='primary'>
                     View all
                  </Button>
               </Space>
            </Space>
            <Divider style={{ margin: '10px 0' }} />
            <AntList
               {...listProps}
               style={{ minWidth: '400px' }}
               loading={false}
               renderItem={(item: WatchEvents) => {
                  if (item.payload) {
                     return (
                        <Item
                           // onClick={(event) => handleEventSelect(event, item)}
                        >
                           <Item.Meta
                              avatar={<img alt='name' src='https://integrations.lambdatest.com/assets/images/integration-jira.svg' />}
                              title={<a>{item.name}</a>}
                              description={
                                 <Typography.Paragraph onClick={(e) => e.stopPropagation()} ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}>
                                    {`${JSON.stringify(item?.payload?.payload)}`}
                                 </Typography.Paragraph>
                              }
                           />
                        </Item>
                     )
                  }

               }}
            />
         </div>
      )
   })

const sampleData = [
   {
      name: 'Gitlab event',
   },
   {
      name: 'Github event',
   },
   {
      name: 'ADO event',
   }
]