import React, { HTMLProps, useEffect, useRef, useState } from 'react';
import {
   List,
   ListProps,
   PaginationProps,
   Skeleton,
   Space,
} from 'antd';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { CreateTicketForm } from './CreateTicket';
import { ListItem } from './Item';

export const defaultPagination = {
   pageSize: 10,
   current: 1,
   showSizeChanger: false,
   showQuickJumper: true
}
const SelectChannels = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const { setCurrentStep, current,integration,domain, selectedOrganization = 'default', selectedCollection = 'default' } = React.useContext(AppContext);
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
   const getHeaders = () => {
      return { integrationId: integration.id,};
    };
   const getAllTickets = async (pagination: PaginationProps = defaultPagination) => {
      const { current, pageSize } = pagination;
      setLoading(true);
      try {
         const resp = await API.services.getChannels( selectedOrganization,
            getHeaders(),
            domain);
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
            <ListComp
               paginationState={paginationState}
               loading={loading}
               dataSource={ticketsState}
               getAllTickets={getAllTickets}
            />
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

const ListComp = (
   {
      paginationState,
      dataSource,
      getAllTickets,
      loading,
   }: ListTypes) => {
   const { setSelectedCollection,selectedCollection } = React.useContext(AppContext);
   const [open, setOpen] = useState<boolean>(false)
   const [selected, setSelected] = useState<{ [key: string]: any }>();
   const [type, setType] = useState<'create' | 'edit'>('create');

   const actionRef = useRef<{ onOk: () => Promise<any> }>(null);

   const onOpen = (type: 'edit' | 'create', arg?: { [key: string]: any }) => {
      setType(type);
      setSelected(arg);
      setOpen(true);
      setSelectedCollection(arg?.id);
   }
   console.log(selectedCollection)

   const onCancel = () => {
      setSelected(undefined);
      setOpen(false);
      setSelectedCollection("")
   }
  
   return (
      <>
         {
            loading ? <Skeleton /> : (
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
            )
         }
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
      </>
   );
};

export { SelectChannels };
