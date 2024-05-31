import { EditOutlined, EllipsisOutlined, EyeOutlined, } from '@ant-design/icons';
import { Badge, Dropdown, List, Menu, Tag, message } from 'antd';
import React, { LegacyRef } from 'react';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services/index';
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
type ItemTypes = { [key: string]: any; };
type ListItemType = {
   item?: ItemTypes
   dataSource?: Array<ItemTypes>
   onOpen?: (type?: 'create' | 'edit', item?: ItemTypes) => void;
}
export const ListItem = React.forwardRef((props: ListItemType, ref: LegacyRef<HTMLDivElement>) => {
   const { item, dataSource, onOpen: onOpenProp } = props;
   const [messageApi, contextHolder] = message.useMessage();

   const { integration, selectedOrganization = 'default' } = React.useContext(AppContext);


   const handleCreateWatch = async (ticket: any) => {
      const fullBodySelected = dataSource.find(
         (item) => item.id === ticket?.id
      );
      const payload = {
         name: `web-gateway-service-${fullBodySelected?.id}`,
         description: `Watch for ${fullBodySelected.id} repository`,
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
      }
   };

   const menu = (
      <Menu>
         <Menu.Item key="0" icon={<EditOutlined />}>
            <a onClick={() => onOpenProp('edit', item)} >Update Ticket</a>
         </Menu.Item>
         <Menu.Item onClick={() => handleCreateWatch(item)} key="1" icon={<EyeOutlined />} >
            <a >Create Watch</a>
         </Menu.Item>
      </Menu>
   );

   return (
      <>
         <List.Item
            ref={ref}
            key={item?.id}
            actions={[
               item?.type && <Tag key={2} >{item?.type}</Tag>
            ]}
            extra={(
               [
                  <Dropdown overlay={menu} trigger={['click']} key={1}>
                     <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <EllipsisOutlined />
                     </a>
                  </Dropdown>
               ]
            )}
         >
            <List.Item.Meta
               title={item?.name ?? item?.id}
               description={item?.description ?? item?.url}
            />
         </List.Item>
         {contextHolder}
      </>
   )
})