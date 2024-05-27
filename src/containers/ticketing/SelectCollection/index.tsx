import React, { HTMLProps, useEffect } from 'react';

import {
   List,
   ListProps,
   Radio,
   Space,
   Spin,
   message,
} from 'antd';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { Errors, handleError } from '../../../utils/error';

const errorObj = new Errors();
const SelectCollection = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const { integration, setCurrentStep, setSelectedCollection, current, selectedOrganization = 'default' } = React.useContext(AppContext);
   const [collectionsState, setCollectionsState] = React.useState([]);

   const getAllTickets = async () => {
      try {
         const resp = await API.services.getAllCollection(selectedOrganization, { integrationId: integration?.id });
         const { data } = resp?.data;
         setCollectionsState(data)
      } catch (error) {
         console.error(error);
         if (error?.response?.data && Array.isArray(error?.response?.data) && error?.response?.data.length) {
            const [{ errorCode }] = error?.response?.data;
            if (errorCode === errorObj.getOrg().getNotFoundCode) {
               setSelectedCollection('default');
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
            <ListComp dataSource={collectionsState} />
         </Space>
         <Footer
            onCancel={() => setCurrentStep(current - (selectedOrganization === 'default' ? 2 : 1))}
            onSubmit={() => setCurrentStep(current + 1)}
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
                        isSelected && <a onClick={handleCreateWatch} key={1} >Create Watch</a>
                     ]}
                     onClick={() => {
                        handleSelect(item.id);
                     }}
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
