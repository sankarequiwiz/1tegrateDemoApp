/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space, Spin } from 'antd';
import React, { HTMLProps, } from 'react';
import { Footer } from '../../components/footer/index';
import { AppContext } from '../../context/AppProvider';
import API from '../../services/';
import { List } from 'antd';


export const Tag = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const { integration, selectedOrganization, selectedRepo, domain, selectedArtifact,setCurrentStep ,current} =
      React.useContext(AppContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  
    const [tags, SetTags] = React.useState<Array<any>>();

  const getHeaders = () => {
    return { integrationId: integration.id,};
  };
 
  const getAllTags = async () => {
    try {
      setLoading(true);
      const resp = await API.services.getAllTags(
        selectedOrganization,
        getHeaders(),
        selectedRepo,
        selectedArtifact,
        domain,
      );
      const { data } = resp.data;
      SetTags(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getAllTags();
  }, []);
  return (
    <Space
      direction="vertical"
      className="w-full"
      style={{ height: '100%', justifyContent: 'space-between', flex: 1 }}
    >
      
      <Spin
        spinning={false}
        tip="Downloading..."
        style={{ height: '100%' }}
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
          <List
            dataSource={tags}
            loading={loading}
            renderItem={(item) => {
              return (
                <List.Item
                >
                  <List.Item.Meta
                    title={<a>{item?.name}</a>}
                  />
                </List.Item>
              );
            }}
          />
        </Space>
      </Spin>
      <Footer
        onCancel={() => setCurrentStep(current - 1)}
        onSubmit={() => setCurrentStep(0)}
      />
    </Space>
  );
});
