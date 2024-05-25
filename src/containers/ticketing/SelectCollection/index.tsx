import React, { HTMLProps, useCallback, useEffect } from 'react';

import {
   Badge,
   Dropdown,
   List,
   ListProps,
   Menu,
   Radio,
   Space,
   Spin,
   Tag,
   message,
} from 'antd';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { EllipsisOutlined, EyeOutlined, } from '@ant-design/icons';
import { Errors, handleError } from '../../../utils/error';

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
const errorObj = new Errors();
const SelectCollection = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const { setCurrentStep, setSelectedCollection, current, } = React.useContext(AppContext);
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
         const resp = await API.services.getAllCollection(headers);
         console.log(resp);
      } catch (error) {
         console.error(error);
         setSelectedCollection('default');
         if (error?.response?.data && Array.isArray(error?.response?.data) && error?.response?.data.length) {
            const [{ errorCode }] = error?.response?.data;
            if (errorCode === errorObj.getOrg().getNotFoundCode) {
               setCurrentStep(current + 1);
            }
         }
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
         // onSubmit={() => setCurrentStep(current + 1)}
         />
      </Space>
   );
});

type ListTypes = {
   dataSource?: { [key: string]: any }[]
} & ListProps<unknown>;

const ListComp = ({ dataSource }: ListTypes) => {
   const [_loading, setLoading] = React.useState<boolean>(false);
   const [messageApi, contextHolder] = message.useMessage();
   const { integration, selectedCollection, setSelectedCollection } = React.useContext(AppContext);

   const handleCreateWatch = async (e: any) => {
      e.stopPropagation();
      setLoading(true);
      const fullBodySelected = dataSource.find(
         (item) => item.id === selectedCollection
      );
      const payload = {
         name: `web-gateway-service-${fullBodySelected?.login}`,
         description: `Watch for ${fullBodySelected.login} repository`,
         type: 'HOOK',
         resource: {
            type: 'ORGANIZATION',
            organization: {
               id: selectedCollection,
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

   const handleSelect = (selected: string) => {
      setSelectedCollection(selectedCollection === selected ? '' : selected);
    };

   const menu = useCallback((_record: { [key: string]: any }) => {
      return (
         <Menu>
            <Menu.Item onClick={handleCreateWatch} key="1" icon={<EyeOutlined />} >
               <a >Create Watch</a>
            </Menu.Item>
         </Menu>
      )
   }, []);

   return (
      <Spin spinning={false} >
         {contextHolder}
         <List
            dataSource={dataSource}
            renderItem={(item: { [key: string]: any }) => {
               const isSelected = item.id === selectedCollection;
               return (
                  <List.Item
                     actions={[
                        <Badge dot color={Enum.priority?.[item.priority?.toLowerCase()].color} />,
                        <Tag>{item?.type}</Tag>
                     ]}
                     onClick={() => {
                        handleSelect(item.id);
                      }}
                     extra={(
                        [
                           <Dropdown overlay={() => menu(item)} trigger={['click']}>
                              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                 <EllipsisOutlined />
                              </a>
                           </Dropdown>
                        ]
                     )}
                  >
                     <List.Item.Meta
                        avatar={<Radio checked={isSelected} value={item.id} />}
                        title={item?.name}
                        description={item?.description}
                     />
                  </List.Item>
               );
            }}
         />
      </Spin>
   );
};

export { SelectCollection };
