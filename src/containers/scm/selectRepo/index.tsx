import { ButtonProps, Space, Typography, Button, Checkbox } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { ReposTypes } from './type';
import { List } from 'antd';


import mock from "./mock.json"

export const SelectRepo = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
    const { setCurrentStep, current, setSelectedRepo, selectedRepo } = React.useContext(AppContext);
    const [Repositories] = React.useState<Array<ReposTypes>>(mock.data as any);


    const getRepos = async () => {
        try {
            await API.services.getRepo;
        } catch (error) {
            console.log(error)
        }
    }

    const handleSelect = (selected: string) => {
        setSelectedRepo(selected === selectedRepo ? '' : selected)
    }
    React.useEffect(() => {
        getRepos()
    }, [])

    const onOkProps: ButtonProps = {
        disabled: !selectedRepo
    }

    return (
        <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
            <Space direction='vertical' style={{ width: '100%' }}>
                <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Typography.Text strong >Select Repository</Typography.Text>
                    </div>
                </div>
                <List
                    dataSource={Repositories}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<Button type='link' key={1}>Create Watch</Button>]}
                        >
                            <List.Item.Meta
                                avatar={<Checkbox checked={selectedRepo == item.id.toString()} value={item.id} onChange={(e) => handleSelect(e.target.value)} />}
                                title={<a >{item.fullName}</a>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Space>
            <Footer onCancel={() => setCurrentStep(current - 1)} onSubmit={() => setCurrentStep(current + 1)} onOkProps={onOkProps} />
        </Space>
    )
})