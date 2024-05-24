import React, { HTMLProps, useCallback, useEffect, useState } from 'react';

import {
   Button,
   Dropdown,
   Form,
   List,
   ListProps,
   Menu,
   Space,
   Spin,
} from 'antd';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { EllipsisOutlined } from '@ant-design/icons';
import { CreateTicketForm } from './CreateTicket';

const SelectTicket = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const { setCurrentStep, current, } = React.useContext(AppContext);
   const [ticketState] = React.useState([
      { id: 'uuid', type: 'TASK', priority: 'high', description: 'Ticket Description', name: 'Ticket Name 1' },
      { id: 'uuid', type: 'BUG', priority: 'low', description: 'Ticket Description', name: 'Ticket Name 2' },
      { id: 'uuid', type: 'STORY', priority: 'medium', description: 'Ticket Description', name: 'Ticket Name 3' },
      { id: 'uuid', type: 'DOCUMENTATION', priority: 'low', description: 'Ticket Description', name: 'Ticket Name 4' },
      { id: 'uuid', type: 'INCIDENT', priority: 'high', description: 'Ticket Description', name: 'Ticket Name 5' },
   ]);

   const getAllTickets = async () => {
      const headers = {
         integrationId: 'ac5bc316-b4a4-4b25-9a0a-1aaa30ae33f6',
         organizationId: '4a321a7d-ee19-4e4a-b096-7de51c9e279e'
      }
      try {
         const resp = await API.services.getAllTickets(headers);
         console.log(resp);
      } catch (error) {
         console.error(error);
      }
   }

   useEffect(() => {
      getAllTickets();
   }, [])

   return (
      <Space
         direction="vertical"
         className="w-full"
         style={{ height: '100%', justifyContent: 'space-between' }}
      >
         <Space direction="vertical" style={{ width: '100%' }}>
            <div {...props} ref={ref} id="service_profile" style={{ flex: 1 }}>
               <div
                  style={{
                     width: '100%',
                     display: 'flex',
                     flexDirection: 'column',
                     gap: '1rem',
                  }}
               ></div>
            </div>
            <ListComp dataSource={ticketState} />
         </Space>
         <Footer
            onCancel={() => setCurrentStep(current - 1)}
            onSubmit={() => setCurrentStep(current + 1)}
         />
      </Space>
   );
});

type ListTypes = {
   dataSource?: { [key: string]: any }[]
} & ListProps<unknown>;

const ListComp = ({ dataSource }: ListTypes) => {
   const [open, setOpen] = useState<boolean>(false)
   const [selected, setSelected] = useState<{ [key: string]: any }>();
   const [type, setType] = useState<'create' | 'edit'>('create')

   const onOpen = (type: 'edit' | 'create', arg?: { [key: string]: any }) => {
      setType(type);
      setSelected(arg);
      setOpen(true);
   }

   const onCancel = () => {
      setSelected(undefined);
      setOpen(false);
   }

   const onOpenDelete = () => { }

   const menu = useCallback((record: { [key: string]: any }) => {
      return (
         <Menu>
            <Menu.Item key="0">
               <a onClick={() => onOpen('edit', record)} >Edit</a>
            </Menu.Item>
            <Menu.Item key="1" danger>
               <a onClick={() => onOpenDelete()} >Delete</a>
            </Menu.Item>
         </Menu>
      )
   }, []);

   return (
      <Spin spinning={false} >
         <Space style={{ width: '100%', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <Button size='small' type='primary' onClick={() => onOpen('create')} >Create Ticket</Button>
         </Space>
         <List
            dataSource={dataSource}
            renderItem={(item: { [key: string]: any }) => {
               return (
                  <List.Item
                     actions={[
                        (
                           <Button
                              loading={item?.isLoading}
                              type="link"
                              key={1}
                           >
                              Create Watch
                           </Button>
                        ),
                        <Dropdown overlay={() => menu(item)} trigger={['click']}>
                           <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                              <EllipsisOutlined />
                           </a>
                        </Dropdown>
                     ]}
                  >
                     <List.Item.Meta
                        title={<a>{item?.name}</a>}
                        description={item?.description}
                     />
                  </List.Item>
               );
            }}
         />
         <CreateTicketForm selected={selected} open={open} onCancel={onCancel} type={type} />
      </Spin>
   );
};

export { SelectTicket };
