import {
  FloatButton,
  FloatButtonProps,
  Form,
  Input,
  Modal,
  message,
} from 'antd';
import React, { Fragment } from 'react';
import { SettingOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import { FloatButtonElement } from 'antd/es/float-button/interface';
import { AppContext } from '../context/AppProvider';

import API from '../services/index';
import Event from '../../src/utils/Events/index';
import { WatchContext } from '../context/WatchContext';

type FloatButtonContextTypes = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const placement = { left: 24, bottom: 10 };
const FloatButtonContext = React.createContext<FloatButtonContextTypes>(null);

export const FloatingActionComp = React.forwardRef(() => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <FloatButtonContext.Provider value={{ setOpen }}>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={placement}
        icon={<SettingOutlined />}
        onOpenChange={setOpen}
        open={open}
      >
        <AccessKeyForm />
        <UserPersona />
      </FloatButton.Group>
    </FloatButtonContext.Provider>
  );
});

const UserPersona = React.forwardRef(
  (props: FloatButtonProps, ref: React.LegacyRef<FloatButtonElement>) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [form] = Form.useForm();

    const { setOpen: setOpenFloat } = React.useContext(FloatButtonContext);
    const {
      setUserName,
      userName,
      setOrganization,
      organization,
      setAppTitle,
      appTitle,
    } = React.useContext(AppContext);

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      setOpenFloat(false);
      /* reset the form when close the modal box */
      form.resetFields();
    };

    React.useEffect(() => {
      isOpen && form.setFieldsValue({ userName, organization, appTitle });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
      <Fragment>
        <FloatButton
          {...props}
          ref={ref}
          onClick={handleOpen}
          icon={<UserOutlined />}
        />
        <Modal
          title={`Kindly set up the following details based on the customer's specifications:`}
          open={isOpen}
          onCancel={handleClose}
          wrapProps={{ onClick: (e: { [key: string]: any }) => e.stopPropagation() }}
          onOk={() => {
            form
              .validateFields()
              .then((resp: { [key: string]: string }) => {
                const { userName, organization, appTitle } = resp;
                setUserName(userName as string);
                setAppTitle(appTitle);
                setOrganization(organization);
                handleClose();
              })
              .catch((error) => {console.log(error) });
          }}
          children={(() => {
            return (
              <div
                style={{
                  margin: '1rem 0rem',
                  display: 'flex',
                  gap: '.5rem',
                  flexDirection: 'column',
                }}
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    name={'appTitle'}
                    style={{ width: '100%' }}
                    label={'App title'}
                  >
                    <Input
                      placeholder="Enter app title"
                      value="Demo app User"
                    />
                  </Form.Item>
                  <Form.Item
                    name={'userName'}
                    style={{ width: '100%' }}
                    label={'User name'}
                  >
                    <Input placeholder="Enter customer name" />
                  </Form.Item>
                  <Form.Item
                    name={'organization'}
                    style={{ width: '100%' }}
                    label={'Company'}
                  >
                    <Input placeholder="Enter the organization name" />
                  </Form.Item>
                  <Form.Item
                    name={'companyKey'}
                    style={{ width: '100%' }}
                    label={'Company key'}
                  >
                    <Input placeholder="Enter the Company key" />
                  </Form.Item>
                </Form>
              </div>
            );
          })()}
        />
      </Fragment>
    );
  }
);

const AccessKeyForm = React.forwardRef(
  (props: FloatButtonProps, ref: React.LegacyRef<FloatButtonElement>) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [isSetting, seIsLoading] = React.useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { clearEvents } = React.useContext(WatchContext);

    const [form] = Form.useForm();

    const { setOpen: setOpenFloat } = React.useContext(FloatButtonContext);
    const { setAccessKey, accessKey: accessKeyValue } =
      React.useContext(AppContext);

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      setOpenFloat(false);
      /* reset the form when close the modal box */
      form.resetFields();
    };

    React.useEffect(() => {
      isOpen && form.setFieldsValue({ accessKey: accessKeyValue });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
      <Fragment>
        {contextHolder}
        <FloatButton
          {...props}
          ref={ref}
          onClick={handleOpen}
          icon={<KeyOutlined />}
        />
        <Modal
          title="Please enter Unizo API Key for your organization:"
          open={isOpen}
          okButtonProps={{ loading: isSetting }}
          onCancel={handleClose}
          wrapProps={{ onClick: (e: { [key: string]: any }) => e.stopPropagation() }}
          onOk={() => {
            form
              .validateFields()
              .then(async (resp: { [key: string]: string }) => {
                const { accessKey } = resp;
                try {
                  seIsLoading(true);
                  await API.services.setAccessKey(accessKey);
                  setAccessKey(accessKey as string);
                  handleClose();
                  Event.trigger('event:update_accesskey', {});
                  clearEvents();
                } catch (error) {
                  let content = 'Something went wrong!';
                  const { data, status } = error.response;
                  if (status === 400) {
                    if (Array.isArray(data) && data.length >= 1) {
                      content = data[0].errorMessage;
                    } else {
                      content = data.error;
                    }
                  } else if (status === 500) {
                    content = data.error;
                  }
                  messageApi.open({ type: 'error', content });
                } finally {
                  seIsLoading(false);
                }
              })
              .catch(() => { });
          }}
          children={(() => {
            return (
              <div
                style={{
                  margin: '1rem 0rem',
                  display: 'flex',
                  gap: '.5rem',
                  flexDirection: 'column',
                }}
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    name={'accessKey'}
                    style={{ width: '100%' }}
                    label={'API Key'}
                  >
                    <Input placeholder="Enter the API Key" />
                  </Form.Item>
                </Form>
              </div>
            );
          })()}
        />
      </Fragment>
    );
  }
);
