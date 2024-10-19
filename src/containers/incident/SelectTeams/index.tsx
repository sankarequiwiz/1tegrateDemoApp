import React, { HTMLProps, useEffect, useMemo, useState } from 'react';

import {
   List,
   ListProps,
   Radio,
   Skeleton,
   Space,
   Spin,
   message,
} from 'antd';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { Errors, handleError } from '../../../utils/error';
import utils from '../../../utils';

const errorObj = new Errors();
const SelectTeams = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const { integration, setCurrentStep, setSelectedService,domain,current, selectedCollection,selectedOrganization = 'default' } = React.useContext(AppContext);
   const [collectionsState, setCollectionsState] = React.useState([]);
   const [loading, setLoading] = useState<boolean>(false);

   const getAllTickets = async () => {
      setLoading(true);
      try {
         const resp = await API.services.getTeamsOpsigine(selectedOrganization, selectedCollection, { integrationId: integration?.id } ,domain);
         const { data } = resp?.data;
         setCollectionsState(data)
      } catch (error) {
         console.error(error);
         if (error?.response?.data && Array.isArray(error?.response?.data) && error?.response?.data.length) {
            const [{ errorCode }] = error?.response?.data;
            if (errorCode === errorObj.getOrg().getNotFoundCode) {
               setSelectedService('default');
               setCurrentStep(current + 1);
            }
         }
      } finally {
         setLoading(false);
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
            <ListComp loading={loading} dataSource={collectionsState} />
         </Space>
         <Footer
            onCancel={() => setCurrentStep(current - (selectedCollection==="default" && selectedOrganization==="default" ? 3 :selectedOrganization==="default"? 2:1))}
            onSubmit={() => setCurrentStep(current + 1)}
         />
      </Space>
   );
});

type ListTypes = {
   dataSource?: { [key: string]: any }[]
   loading?: boolean
} & ListProps<unknown>;

const ListComp = ({ dataSource, loading: loadingProp }: ListTypes) => {
   const [loading, setLoading] = React.useState<boolean>(false);
   const [messageApi, contextHolder] = message.useMessage();
   const {
      integration,
      selectedCollection,
      domain,
      selectedOrganization,
      setSelectedService,
      selectedService,
   } = React.useContext(AppContext);

   const handleCreateWatch = async (e: any) => {
      e.stopPropagation();
      setLoading(true);
      const fullBodySelected = dataSource.find(
         (item) => item.id === selectedCollection
      );
      const payload = {
         name: `web-gateway-service-${fullBodySelected?.name}`,
         description: `Watch for ${fullBodySelected.name} repository`,
         type: 'Webhook',
         resource: {
            type: `${domain}_COLLECTIONS`,
            collections: {
               id: selectedCollection
            },
            organization: {
               id: selectedOrganization,
            },
         },
      };
      try {
         await API.services.createWatch(payload, integration.id);
         messageApi.success({ content: 'Bi-directional created successfully' });
      } catch (error) {
         console.log(error);
         const errorMessage = error?.response?.data, status = error?.response?.status;
         messageApi.error({ content: handleError(errorMessage, status) ?? 'Bi-directional creation failed' });
      } finally {
         setLoading(false);
      }
   };

   const isWatchEnabled = useMemo(() => {
      const watch = new utils.watch.Watch(domain);
      return watch.isAvailable({ level: 'collection' })
   }, [domain]);

   const handleSelect = (selected: string) => {
      setSelectedService(selectedService === selected ? '' : selected);
   };

   return (
      <Spin spinning={(loading)} >
         {contextHolder}
         {
            loadingProp ? <Skeleton /> : (
               <List
                  dataSource={dataSource}
                  renderItem={(item: { [key: string]: any }) => {
                     const isSelected = item.id === selectedService;
                     return (
                        <List.Item
                           actions={[
                              (isWatchEnabled && isSelected) && <a onClick={handleCreateWatch} key={1} >Create Watch</a>
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
            )
         }
      </Spin>
   );
};

export { SelectTeams };
