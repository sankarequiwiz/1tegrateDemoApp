import React, { HTMLProps, useCallback, useEffect, useRef, useState } from 'react';

import {
   Badge,
   Button,
   Dropdown,
   List,
   ListProps,
   Menu,
   Space,
   Spin,
   Tag,
   message,
} from 'antd';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { EditOutlined, EllipsisOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { CreateTicketForm } from './CreateTicket';
import { handleError } from '../../../utils/error';

const Enum = {
   priority: {
      high: {
         color: '#FF0000'
      },
      medium: {
         color: '#f50'
      },
      low: {
         color: '#FFDB5C'
      }
   }
}

const SelectTicket = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const { setCurrentStep, current, integration, selectedOrganization = 'default', selectedCollection = 'default' } = React.useContext(AppContext);
   const [ticketsState, setTicketsState] = React.useState([]);

   const getAllTickets = async () => {
      try {
         const resp = await API.services.getAllTickets(selectedOrganization, selectedCollection, { integrationId: integration?.id });
         const { data } = resp.data;
         setTicketsState(data);
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
            <ListComp dataSource={ticketsState} getAllTickets={getAllTickets} />
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
   getAllTickets?: () => void;
} & ListProps<unknown>;

const ListComp = ({ dataSource, getAllTickets }: ListTypes) => {
   const [open, setOpen] = useState<boolean>(false)
   const [selected, setSelected] = useState<{ [key: string]: any }>();
   const [type, setType] = useState<'create' | 'edit'>('create')
   const [_loading, setLoading] = React.useState<boolean>(false);
   const [messageApi, contextHolder] = message.useMessage();
   const { integration, selectedOrganization } = React.useContext(AppContext);

   const actionRef = useRef<{ onOk: () => Promise<any> }>(null);

   const onOpen = (type: 'edit' | 'create', arg?: { [key: string]: any }) => {
      setType(type);
      setSelected(arg);
      setOpen(true);
   }

   const onCancel = () => {
      setSelected(undefined);
      setOpen(false);
   }

   const handleCreateWatch = async (e: any) => {
      e.stopPropagation();
      setLoading(true);
      const fullBodySelected = dataSource.find(
         (item) => item.id === selectedOrganization
      );
      const payload = {
         name: `web-gateway-service-${fullBodySelected?.login}`,
         description: `Watch for ${fullBodySelected.login} repository`,
         type: 'HOOK',
         resource: {
            type: 'ORGANIZATION',
            organization: {
               id: selectedOrganization,
            },
         },
      };
      try {
         await API.services.createWatch(payload, integration.id);
         messageApi.success({ content: 'Watch created successfully' });
      } catch (error) {
         console.log(error);
         const errorMessage = error?.response?.data, status = error?.response?.status;
         messageApi.error({ content: handleError(errorMessage, status) ?? 'Watch creation failed' });
      } finally {
         setLoading(false);
      }
   };

   const menu = useCallback((record: { [key: string]: any }) => {
      return (
         <Menu>
            <Menu.Item key="0" icon={<EditOutlined />}>
               <a onClick={() => onOpen('edit', record)} >Edit</a>
            </Menu.Item>
            <Menu.Item onClick={handleCreateWatch} key="1" icon={<EyeOutlined />} >
               <a >Create Watch</a>
            </Menu.Item>
         </Menu>
      )
   }, []);

   return (
      <Spin spinning={false} >
         {contextHolder}
         <Space style={{ width: '100%', alignItems:"end", display:"flex", flexDirection:"row-reverse", marginBottom: '1rem' }}>
            <Button type='primary' onClick={() => onOpen('create')} icon={<PlusOutlined />} >Create Ticket</Button>
         </Space>
         <List
            dataSource={dataSource}
            renderItem={(item: { [key: string]: any }) => {
               return (
                  <List.Item
                     key={item?.id}
                     actions={[
                        <Badge key={1} dot color={Enum?.priority?.[item?.priority?.toLowerCase()]?.color} />,
                        <Tag key={2} >{item?.type}</Tag>
                     ]}
                     extra={(
                        [
                           <Dropdown overlay={() => menu(item)} trigger={['click']} key={1}>
                              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                 <EllipsisOutlined />
                              </a>
                           </Dropdown>
                        ]
                     )}
                  >
                     <List.Item.Meta
                        title={item?.name}
                        description={item?.description}
                     />
                  </List.Item>
               );
            }}
         />
         <CreateTicketForm
            selected={selected}
            open={open}
            onCancel={onCancel}
            type={type}
            okText={type === 'create' ? 'Create' : 'Update'}
            actionRef={actionRef}
            onOk={async () => {
               actionRef.current.onOk().then((isSuccess) => {
                  if (isSuccess) {
                     messageApi.success({ content: `Ticket ${type}ed successfully` })
                     onCancel();
                     getAllTickets();
                  };
               })
            }}
         />
      </Spin>
   );
};

export { SelectTicket };
