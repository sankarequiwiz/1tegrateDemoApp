/* eslint-disable @typescript-eslint/no-explicit-any */
import { BellFilled } from '@ant-design/icons';
import { Badge, Button, ListProps, Popover, List as AntList, Typography, Space, Divider, Modal } from 'antd';
import React, { HTMLProps } from 'react';

import { socket } from '../config/socket';

const { Item } = AntList;
type LisTypes = {
   listProps?: ListProps<unknown>
   onSelect?: (target: HTMLDivElement, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const List = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & LisTypes>(
   ({ listProps, onSelect, ...props }, ref) => {

      const handleEventSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, selected: unknown) => {
         const target = e.target as HTMLDivElement;
         target.setAttribute('listNode', selected.toString());
         onSelect && onSelect(target, e);
      }

      return (
         <div {...props} ref={ref}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
               <Typography.Text strong>
                  {'Events'}
               </Typography.Text>
               <Button size='small'>
                  View all
               </Button>
            </Space>
            <Divider style={{ margin: '10px 0' }} />
            <AntList
               {...listProps}
               style={{ minWidth: '400px' }}
               loading={false}
               renderItem={(item: { name: string }) => (
                  <Item onClick={(event) => handleEventSelect(event, item.name)}>
                     <Item.Meta
                        avatar={<img alt='name' src='https://integrations.lambdatest.com/assets/images/integration-jira.svg' />}
                        title={<a href="https://ant.design">{item.name}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                     />
                  </Item>
               )}
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

type WatchDogTypes = {
   setCount?: React.Dispatch<React.SetStateAction<number>>
}

export const WatchDog = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & WatchDogTypes>(({ setCount, ...props }, ref) => {
   const [isConnected, setIsConnected] = React.useState<boolean>(false);
   const [watchData, setWatchData] = React.useState<Array<{ [key: string]: any }>>(sampleData);
   const [modal, setModal] = React.useState<boolean>(false);
   const [selected, setSelected] = React.useState<string>(undefined);

   const watchListener = (events: unknown) => {
      setWatchData((prev) => ([...prev, events]))
   }

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

   React.useEffect(() => {

      socket.on('connect', function () {
         setIsConnected(true);
      });

      socket.on('disconnect', function () {
         setIsConnected(false)
      });

      socket.on('listen_watch', watchListener)

   }, [])

   React.useEffect(() => {
      console.log(`socket ${!isConnected ? 'dis' : ''}connected!`)
   }, [isConnected])

   React.useEffect(() => {
      setCount(watchData.length)
   }, [watchData, setCount])

   const listProps: ListProps<unknown> = {
      dataSource: watchData,
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
   const [count, setCount] = React.useState(0);
   return (
      <div {...props} ref={ref}>
         <Popover forceRender id='notification-container' placement="bottomRight" content={<WatchDog setCount={setCount} />} trigger={['click']} >
            <Badge size='small' count={count} offset={[10, 10]}>
               <Button size='small' shape='circle' icon={<BellFilled />} />
            </Badge>
         </Popover>
      </div>
   )
})