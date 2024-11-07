import { Form, Input, InputNumber, Select, Modal, ModalProps, PaginationProps, message } from 'antd';
import React, { useEffect, useState } from 'react';
import API from '../../../services';
import { AppContext } from '../../../context/AppProvider';

import { MetaDataConfigTypes } from "./type"

type FormTypes = {
   type: 'edit' | 'create'
   selected?: { [key: string]: any }
   actionRef?: any
   getPullrequest?: (pagination: { [key: string]: any }) => void;
   paginationState?: PaginationProps
} & ModalProps;

const defaultPagination = {
    pageSize:4,
    current: 1,
    showSizeChanger: false,
    showQuickJumper: true
 }
const fieldType = {
   TEXT_STRING: <Input />,
   TEXT_NUMBER: <InputNumber />,
   LIST_STRING: <Select />,
}

function FormComp(props: FormTypes) {
   const { open, type, selected, onCancel: onCancelProp, getPullrequest, paginationState } = props;
   const { integration, selectedOrganization, selectedRepo } = React.useContext(AppContext);
   const [messageApi, contextHolder] = message.useMessage();
   const [creating, setCreating] = useState(false);
   const [formFields, setFormFields] = useState<MetaDataConfigTypes[]>([]);

   const [form] = Form.useForm();

   const headers = { integrationId: integration?.id }

   const onCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
      onCancelProp(e);
      form.resetFields();
   }

   const createPullrequests = async (values: { [key: string]: string }) => {
      setCreating(true);
      try {
         await API.services.createPullrequest(
            values,
            headers,
            selectedOrganization,
            selectedRepo
         );
         messageApi.success({ content: `Pull Request created successfully.` });
         setTimeout(() => {
            getPullrequest(defaultPagination)
         }, 2000)
         onCancel();
      } catch (error) {
         const errorProp = error?.response?.data;
         console.error(errorProp);
         let content = 'something went wrong!'
         if (Array.isArray(errorProp) && errorProp.length) {
            const [message] = errorProp;
            content = message?.errorMessage || message?.message;
         }
         messageApi.error({ content })

      } finally {
         setCreating(false);
      }
   }

   const editPullrequests = async (values: { [key: string]: string }) => {
      const dirtyFields = {};
      Object.entries(values).map(([key, value]) => {
         if (!selected?.[key] || selected?.[key] !== value) {
            dirtyFields[key] = value;
         }
      })
      try {
         await API.services.editPullrequest(
            dirtyFields,
            headers,
            selectedOrganization,
            selectedRepo,
            selected?.id
         );
         onCancel(undefined);
         messageApi.success({ content: `Pull Request updated successfully.` });
         setTimeout(() => {
            getPullrequest(paginationState);
         }, 2000)
      } catch (error) {
         const errorProp = error?.response?.data;
         console.error(errorProp);
         let content = 'something went wrong!'
         if (Array.isArray(errorProp) && errorProp.length) {
            const [message] = errorProp;
            content = message?.errorMessage || message?.message;
         }
         messageApi.error({ content })
      }
   }

   const onOk = async () => {
      try {
         const resp = await form.validateFields()
         if (type === 'create') {
            await createPullrequests(resp);
         } else {
            await editPullrequests(resp);
         }
      } catch (error) {
         console.error(error);
      };
   }

   const payload = {
      edit: {
         type: 'UPDATE'
      },
      create: {
         type: 'CREATE'
      },
   }

   const fetchFormFields = async () => {
      try {
         const response = await API.services.PRmetaDataConfig(selectedOrganization, selectedRepo, payload[type], headers);
         setFormFields(response.data.data);
      } catch (error) {
         console.error('Error fetching form fields:', error);
      }
   };

   useEffect(() => {
      if (type === 'edit') {
         form.setFieldsValue(selected)
      } else {
         const values = formFields.reduce((acc, cur) => {
            const { defaultValue } = cur;
            if (defaultValue) {
               acc = { ...acc, [defaultValue.key]: defaultValue?.value ?? '' }
            }
            return acc;
         }, {});
         form.setFieldsValue(values)
      }
   }, [selected, type, open,formFields])

   useEffect(() => {
      if (open) {
         fetchFormFields()
      } else {
         setFormFields([])
      }
   }, [type, open]);

   return (
      <div>
         {contextHolder}
         <Modal
            open={open}
            okButtonProps={{ loading: creating }}
            title={`${type === 'create' ? 'Create' : 'Update'} PullRequest`}
            onOk={onOk}
            onCancel={onCancel}
         >
            <Form
               requiredMark={false}
               layout='vertical'
               style={{ padding: '.5rem 0rem' }}
               form={form}
            >
               {formFields.map((item, index) => {
                  const { label, type, placeholderValue: placeholder, property, required = false, attributes: options } = item;
                  let fieldProps = {};
                  if (type == "LIST_STRING") {
                     fieldProps = { ...fieldProps, options }
                  }
                  return (
                     <Form.Item rules={[{ required }]} label={label} key={index} name={property}>
                        {React.cloneElement(fieldType[type], {
                           placeholder,
                           ...fieldProps
                        })}
                     </Form.Item>
                  );
               })}
            </Form>
         </Modal>
      </div>
   )
}

export { FormComp as CreatePullRequestForm }