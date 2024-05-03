/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonProps, Space, Typography, Button, Checkbox, Modal, ModalProps, Radio } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import API from '../../../services';
import { ReposTypes } from './type';
import { List } from 'antd';


import mock from "./mock.json";
import { conclusionOption } from '../../../common/stepper';


const ModalStepOptions = React.forwardRef(({ ...props }: ModalProps, ref: React.RefObject<HTMLDivElement>) => {
    const { setConclusion, conclusion } = React.useContext(AppContext);

    return (
        <Modal {...props} title='Select download options'>
            <div ref={ref}>
                <Space direction='vertical'>
                    <Space direction='vertical'>
                        <Typography.Text type='secondary'>
                            Please specify the desired level for your repository/project download.
                        </Typography.Text>
                    </Space>
                    <Radio.Group
                        value={conclusion}
                        onChange={e => setConclusion(e.target.value)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        options={conclusionOption}
                    />
                </Space>
            </div>
        </Modal>
    )
})

export const SelectRepo = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
    const { setCurrentStep, current, setSelectedRepo, selectedRepo, setConclusion } = React.useContext(AppContext);
    const [Repositories] = React.useState<Array<ReposTypes>>(mock.data as any);
    const [open, setOpen] = React.useState<boolean>(false);

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

    const handleNext = () => {
        setOpen(true)
    }

    const handleOk = () => {
        setCurrentStep(current + 1)
    }

    const closeHandler = () => {
        setConclusion('')
        setOpen(false);
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
            <Footer onCancel={() => setCurrentStep(current - 1)} onSubmit={handleNext} onOkProps={onOkProps} />
            <ModalStepOptions onOk={handleOk} open={open} onCancel={closeHandler} />
        </Space>
    )
})
