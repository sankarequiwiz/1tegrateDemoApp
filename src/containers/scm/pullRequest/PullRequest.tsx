/* eslint-disable @typescript-eslint/no-unused-vars */
import { List, Space, Tag, Typography, Button, Dropdown, Menu } from 'antd';
import React, { HTMLProps, useState } from 'react';
import { AppContext } from '../../../context/AppProvider';
import { PullRequestTypes } from '../type';
import API from '../../../services';
import { PlusOutlined } from '@ant-design/icons';
import { CreatePullRequestForm } from './CreatePullrequest';
import { EditOutlined, EllipsisOutlined} from '@ant-design/icons';


export const PullRequest = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(() => {
  const { integration, selectedOrganization, selectedRepo } =
    React.useContext(AppContext);

  const [pullRequest, setPullRequest] = useState<Array<PullRequestTypes>>(
    []
  );
  const actionRef = React.useRef<{ onOk: () => Promise<any> }>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false)
  const [selected, setSelected] = useState<{ [key: string]: any }>();
  const [type, setType] = useState<'create' | 'edit'>('create');

  const getHeaders = () => {
    return { integrationId: integration?.id };
  };

  const onOpen = (type: 'edit' | 'create', arg?: { [key: string]: any }) => {
    setType(type);
    setSelected(arg);
    setOpen(true);
  }
  const onCancel = () => {
    setSelected(undefined);
    setOpen(false);
  }
  const getAllPullRequests = async () => {
    try {
      setLoading(true);
      const resp = await API.services.getAllPullRequest(
        getHeaders(),
        selectedOrganization,
        selectedRepo
      );
      const { data } = resp.data;
      setPullRequest(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllPullRequests();
  }, []);

  return (
    <>
      <Space
        direction="vertical"
        className="w-full"
        style={{ height: '100%', justifyContent: 'space-between' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>

          <Space style={{ width: '100%', alignItems: "end", display: "flex", flexDirection: "row", marginBottom: '1rem', justifyContent: "space-between" }}>
            <Typography.Title level={4}>Pull Request</Typography.Title>
            <Button type='primary' onClick={() => onOpen('create')} icon={<PlusOutlined />} >Create Pull Request</Button>
          </Space>
          <List
            style={{ marginBottom: '10px' }}
            dataSource={pullRequest}
            renderItem={(item: { [key: string]: any }) => (
              <ListComp onOpen={onOpen} item={item} dataSource={pullRequest} loading={loading} />
            )}
          />
          {/* <ListComp dataSource={pullRequest} loading={loading} /> */}
        </Space>
      </Space>
      <CreatePullRequestForm
        selected={selected}
        open={open}
        onCancel={onCancel}
        type={type}
        okText={type === 'create' ? 'Create' : 'Update'}
        actionRef={actionRef}
        getPullrequest={getAllPullRequests}
      />
    </>

  );
});

// type ListTypes = {
//   dataSource: Array<PullRequestTypes>;
// } & ListProps<unknown>;

const ListComp = ({ item, dataSource, onOpen: onOpenProp, ...props }) => {

  const menu = (
    <Menu>
      <Menu.Item key="0" icon={<EditOutlined />}>
        <a onClick={() => onOpenProp('edit', item)} >Update Pull Request</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <List.Item
        {...props}
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
          title={<a>{item?.name || item?.title}</a>}
          description={item?.htmlUrl || item?.htmlurl}
        />
      </List.Item>

    </>
  );
};
