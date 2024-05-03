import { Alert, FloatButton, FloatButtonProps, Form, Input, Modal } from "antd";
import React, { Fragment } from "react";
import { SettingOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import { FloatButtonElement } from "antd/es/float-button/interface";
import { AppContext } from "../context/AppProvider";

type FloatButtonContextTypes = {
      setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const FloatButtonContext = React.createContext<FloatButtonContextTypes>(null);

export const FloatingActionComp = React.forwardRef(() => {
      const [open, setOpen] = React.useState<boolean>(false);

      return (
            <FloatButtonContext.Provider value={{ setOpen }}>
                  <FloatButton.Group
                        trigger="click"
                        type="primary"
                        style={{ left: 24, bottom: 10 }}
                        icon={<SettingOutlined />}
                        onClick={() => setOpen(true)}
                        open={open}
                  >
                        <AccessKeyForm />
                        <UserPersona />
                  </FloatButton.Group>
            </FloatButtonContext.Provider>
      )
})


const UserPersona = React.forwardRef((props: FloatButtonProps, ref: React.LegacyRef<FloatButtonElement>) => {
      const [isOpen, setIsOpen] = React.useState<boolean>(false);

      const [form] = Form.useForm()

      const { setOpen: setOpenFloat } = React.useContext(FloatButtonContext);
      const { setUserName, userName, setOrganization, organization, setAppTitle, appTitle } = React.useContext(AppContext)

      const handleOpen = () => {
            setIsOpen(true);
      }

      const handleClose = () => {
            setIsOpen(false);
            setOpenFloat(false);
            /* reset the form when close the modal box */
            form.resetFields();
      }

      React.useEffect(() => {
            isOpen && form.setFieldsValue({ userName, organization, appTitle })
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen])

      return (
            <Fragment>
                  <FloatButton {...props} ref={ref} onClick={handleOpen} icon={<UserOutlined />} />
                  <Modal
                        title='Enter details'
                        open={isOpen}
                        onCancel={handleClose}
                        onOk={() => {
                              form.validateFields()
                                    .then((resp: { [key: string]: string }) => {
                                          const { userName, organization, appTitle } = resp;
                                          setUserName(userName as string);
                                          setAppTitle(appTitle);
                                          setOrganization(organization);
                                          handleClose();
                                    })
                                    .catch(() => { })
                        }}
                        children={(() => {
                              return (
                                    <div style={{ margin: '1rem 0rem', display: 'flex', gap: '.5rem', flexDirection: 'column' }}>
                                          <Form form={form} layout='vertical'>
                                                <Form.Item  name={"appTitle"} style={{ width: '100%' }} label={'App title'}>
                                                      <Input placeholder="Enter app title" value="Demo app User" />
                                                </Form.Item>
                                                <Form.Item  name={"userName"} style={{ width: '100%' }} label={'User name'}>
                                                      <Input placeholder="Enter customer name" />
                                                </Form.Item>
                                                <Form.Item  name={"organization"} style={{ width: '100%' }} label={'Company'}>
                                                      <Input placeholder="Enter the organization name" />
                                                </Form.Item>
                                          </Form>
                                    </div>

                              )
                        })()}
                  />
            </Fragment>
      )
})

const AccessKeyForm = React.forwardRef((props: FloatButtonProps, ref: React.LegacyRef<FloatButtonElement>) => {
      const [isOpen, setIsOpen] = React.useState<boolean>(false);

      const [form] = Form.useForm()

      const { setOpen: setOpenFloat } = React.useContext(FloatButtonContext);
      const { setAccessKey, accessKey: accessKeyValue } = React.useContext(AppContext)

      const handleOpen = () => {
            setIsOpen(true);
      }

      const handleClose = () => {
            setIsOpen(false);
            setOpenFloat(false);
            /* reset the form when close the modal box */
            form.resetFields();
      }

      React.useEffect(() => {
            isOpen && form.setFieldsValue({ accessKey: accessKeyValue })
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen])

      return (
            <Fragment>
                  <FloatButton {...props} ref={ref} onClick={handleOpen} icon={<KeyOutlined />} />
                  <Modal
                        title='Please enter 1tegrate Access key for your organization'
                        open={isOpen}
                        onCancel={handleClose}
                        onOk={() => {
                              form.validateFields()
                                    .then((resp: { [key: string]: string }) => {
                                          const { accessKey } = resp;
                                          setAccessKey(accessKey as string);
                                          handleClose();
                                    })
                                    .catch(() => { })
                        }}
                        children={(() => {
                              return (
                                    <div style={{ margin: '1rem 0rem', display: 'flex', gap: '.5rem', flexDirection: 'column' }}>
                                          <Alert
                                                message="Your access key will take across all the api's"
                                                type="info"
                                                closable
                                          />
                                          <Form form={form} layout='vertical'>
                                                <Form.Item  name={"accessKey"} style={{ width: '100%' }} label={'Access Key'}>
                                                      <Input placeholder="Enter the access key" />
                                                </Form.Item>
                                          </Form>
                                    </div>

                              )
                        })()}
                  />
            </Fragment>
      )
})