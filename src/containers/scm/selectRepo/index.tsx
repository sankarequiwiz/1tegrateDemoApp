/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonProps, Space, Button, Checkbox, Spin } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { ReposTypes } from './type';
import { List } from 'antd';


import { DownloadOutlined } from '@ant-design/icons';

export const SelectRepo = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
    const { setCurrentStep, current, setSelectedRepo, selectedRepo, selectedOrganization, integration } = React.useContext(AppContext);
    const [Repositories, setRepos] = React.useState<Array<ReposTypes>>([]);
    const [downloading, setDownloading] = React.useState<boolean>(false);
    const [loading, setLoading]=React.useState<boolean>(false)

    const getRepos = async () => {
        try {
            setLoading(true)
            const resp = await API.services.getRepo(selectedOrganization, { integrationId: integration.id });
            const { data } = resp.data;
            setRepos(data);
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleSelect = (selected: string) => {
        setSelectedRepo(selected === selectedRepo ? '' : selected)
    }
    const downloadHandler = async () => {
        setDownloading(true);
        try {
            await API.services.downloadCodeBase({})
            
        } catch (error) {
            console.error(error)
        } finally {
            setDownloading(false);
        }
    }

    React.useEffect(() => {
        getRepos()
    }, [])

    const onOkProps: ButtonProps = {
        disabled: !selectedRepo
    }

    return (
        <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between', flex: 1 }}>
            <Spin spinning={downloading} tip='Downloading...' style={{ height: '100%' }}>
                <Space direction='vertical' style={{ width: '100%' }}>
                    <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        </div>
                    </div>
                    <List
                        dataSource={Repositories}
                        loading={loading}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button type='link' key={1}>Create Watch</Button>,
                                    <Button type='link' onClick={downloadHandler} icon={<DownloadOutlined />} key={2} style={{ display: 'none' }}  >Download</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Checkbox checked={selectedRepo == item.id.toString()} value={item.id} onChange={(e) => handleSelect(e.target.value)} />}
                                    title={<a >{item?.fullName}</a>}
                                    description={item?.description}
                                />
                            </List.Item>
                        )}
                    />
                </Space>
            </Spin>
            <Footer onCancel={() => setCurrentStep(current - 1)} onSubmit={() => setCurrentStep(current + 1)} onOkProps={onOkProps} />
        </Space>
    )
})
