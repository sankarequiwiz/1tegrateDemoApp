import { Button, ButtonProps, Checkbox, List, ListProps, Space, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../components/footer';
import { AppContext } from '../../context/AppProvider';
import { BranchTypes } from './type';
import API from '../../services';

import mock from './branc.json';

export const Branch = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ ...props }, ref) => {
      const { setCurrentStep, current } = React.useContext(AppContext);

      const [ branches ] = React.useState<Array<BranchTypes>>(mock.data);

      const okButtonProps: ButtonProps = {
            children: 'Done',
            icon: null
      }

      const onCancel = () => {
            setCurrentStep(current - 1)
      }

      const onNext = () => { }

      const getAllBranches = async () => {
            try {
                  await API.services.getAllBranches({})
            } catch (error) {
                  console.log(error);
            }
      }

      React.useEffect(() => {
            getAllBranches();
      }, [])

      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <Space direction='vertical' style={{ width: '100%' }}>
                        <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Typography.Text strong >Select organization</Typography.Text>
                              </div>
                        </div>
                        <ListComp dataSource={branches} />
                  </Space>
                  <Footer onCancel={onCancel} onSubmit={onNext} onOkProps={okButtonProps} />
            </Space>
      )
})

type ListTypes = {
      dataSource: Array<BranchTypes>
} & ListProps<unknown>

const ListComp = ({ dataSource, ...props }: ListTypes) => {
      const { setSelectedBranch, selectedBranch } = React.useContext(AppContext)

      const handleSelect = (selected: string) => {
            setSelectedBranch(selected === selectedBranch ? '' : selected)
      }

      return (
            <List
                  {...props}
                  dataSource={dataSource}
                  renderItem={(item: BranchTypes) => (
                        <List.Item
                              actions={[<Button loading={item?.isLoading} type='link' key={1}>Download</Button>]}
                        >
                              <List.Item.Meta
                                    avatar={
                                          <Checkbox
                                                checked={selectedBranch === item.id}
                                                value={item.id} onChange={(e) => handleSelect(e.target.value)}
                                          />
                                    }
                                    title={<a >{item.name}</a>}
                                    description={item.committer_name}
                              />
                        </List.Item>
                  )}
            />
      )
};