import React, { HTMLProps, useEffect, useRef, useState } from 'react';
import {
   Button,
   List,
   ListProps,
   PaginationProps,
   Space,
   Spin,
   message,
} from 'antd';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { PlusOutlined } from '@ant-design/icons';
import { CreateTicketForm } from './CreateTicket';
import { ListItem } from './Item';

export const defaultPagination = {
   pageSize: 10,
   current: 1,
   showSizeChanger: false,
   showQuickJumper: true
}
const SelectTicket = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const { setCurrentStep, current, integration, selectedOrganization = 'default', selectedCollection = 'default' } = React.useContext(AppContext);
   const [ticketsState, setTicketsState] = React.useState([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [paginationState, setPagination] = useState<PaginationProps>(defaultPagination);

   const headers = { integrationId: integration?.id };

   const getTicketsById = async (payload) => {
      try {
         return (await API.services.getTicket(
            payload?.id, selectedOrganization, selectedCollection, headers
         )).data;
      } catch (err) {
         console.log(`error while get ticket by id ${payload?.id}`)
      }
   }

   const getAllTickets = async (pagination: PaginationProps = defaultPagination) => {
      const { current, pageSize } = pagination;
      setLoading(true);
      try {
         const resp = await API.services.getAllTickets(selectedOrganization, selectedCollection, headers);
         const { data, pagination: newPagination } = resp.data;
         const end = pageSize * current;
         const start = end - pageSize;
         const withoutName = data.filter((item) => !item.name).slice(start, end)
         const fullBody = await Promise.all(withoutName.map(getTicketsById));
         const newData = data.slice(start, end).map((item: { [key: string]: any }) => {
            const exist = fullBody.find((i) => i.id === item.id);
            if (exist) return exist;
            return item;
         })
         setTicketsState(newData);
         setPagination({ ...pagination, total: newPagination?.total })
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getAllTickets(paginationState);
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
            <ListComp paginationState={paginationState} loading={loading} dataSource={ticketsState} getAllTickets={getAllTickets} />
         </Space>
         <Footer
            onCancel={() => setCurrentStep(current - 1)}
            onSubmit={() => setCurrentStep(0)}
         />
      </Space>
   );
});

type ListTypes = {
   dataSource?: { [key: string]: any }[]
   getAllTickets?: (pagination: { [key: string]: any }) => void;
   paginationState?: PaginationProps
   loading?: boolean
} & ListProps<unknown>;

const ListComp = ({ paginationState, dataSource, getAllTickets, loading }: ListTypes) => {
   const [open, setOpen] = useState<boolean>(false)
   const [selected, setSelected] = useState<{ [key: string]: any }>();
   const [type, setType] = useState<'create' | 'edit'>('create');

   const actionRef = useRef<{ onOk: () => Promise<any> }>(null);
   const listRef = useRef<{ loading?: boolean }>(null);

   const onOpen = (type: 'edit' | 'create', arg?: { [key: string]: any }) => {
      setType(type);
      setSelected(arg);
      setOpen(true);
   }

   const onCancel = () => {
      setSelected(undefined);
      setOpen(false);
   }

   return (
      <Spin spinning={(loading || (listRef?.current?.loading ?? false))} >
         <Space style={{ width: '100%', alignItems: "end", display: "flex", flexDirection: "row-reverse", marginBottom: '1rem' }}>
            <Button type='primary' onClick={() => onOpen('create')} icon={<PlusOutlined />} >Create Ticket</Button>
         </Space>
         <List
            style={{ marginBottom: '10px' }}
            pagination={{
               ...paginationState,
               onChange: (current: number, pageSize: number) => {
                  getAllTickets({ ...paginationState, current, pageSize })
               }
            }}
            dataSource={dataSource}
            renderItem={(item: { [key: string]: any }) => (
               <ListItem onOpen={onOpen} item={item} dataSource={dataSource} />
            )}
         />
         <CreateTicketForm
            selected={selected}
            open={open}
            onCancel={onCancel}
            type={type}
            okText={type === 'create' ? 'Create' : 'Update'}
            actionRef={actionRef}
            paginationState={paginationState}
            getAllTickets={getAllTickets}
         />
      </Spin>
   );
};

export { SelectTicket };
