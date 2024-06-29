import { Form, Input, InputNumber, Select, Modal, ModalProps, PaginationProps, message } from 'antd';
import React, { useEffect, useState } from 'react';
import API from '../../../services';
import { AppContext } from '../../../context/AppProvider';
import { defaultPagination } from '.';
import { MetaDataConfigTypes } from "./type"

type FormTypes = {
   type: 'edit' | 'create'
   selected?: { [key: string]: any }
   actionRef?: any
   getAllTickets?: (pagination: { [key: string]: any }) => void;
   paginationState?: PaginationProps
} & ModalProps;

const fieldType = {
   TEXT_STRING: <Input />,
   TEXT_NUMBER: <InputNumber />,
   LIST_STRING: <Select />,
}

function FormComp(props: FormTypes) {
   const { open, type, selected, onCancel: onCancelProp, getAllTickets, paginationState } = props;
   const { integration, selectedOrganization, selectedCollection } = React.useContext(AppContext);
   const [messageApi, contextHolder] = message.useMessage();
   const [creating, setCreating] = useState(false);
   const [formFields, setFormFields] = useState<MetaDataConfigTypes[]>([]);

   const [form] = Form.useForm();

   const headers = { integrationId: integration?.id }

   const onCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
      onCancelProp(e);
      form.resetFields();
   }

   const createTicket = async (values: { [key: string]: string }) => {
      setCreating(true);
      try {
         await API.services.createTickets(
            values,
            headers,
            selectedOrganization,
            selectedCollection
         );
         messageApi.success({ content: `Ticket created successfully.` });
         setTimeout(() => {
            getAllTickets(defaultPagination)
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

   const editTicket = async (values: { [key: string]: string }) => {
      const dirtyFields = {};
      Object.entries(values).map(([key, value]) => {
         if (!selected?.[key] || selected?.[key] !== value) {
            dirtyFields[key] = value;
         }
      })
      try {
         await API.services.editTickets(
            dirtyFields,
            headers,
            selectedOrganization,
            selectedCollection,
            selected?.id
         );
         onCancel(undefined);
         messageApi.success({ content: `Ticket updated successfully.` });
         setTimeout(() => {
            getAllTickets(paginationState);
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
            await createTicket(resp);
         } else {
            await editTicket(resp);
         }
      } catch (error) {
         console.error(error);
      };
   }

   const payload = {
      type: "TICKET_CREATE"
   }

   const fetchFormFields = async () => {
      try {
         const response = await API.services.metaDataConfig(selectedOrganization, selectedCollection, payload, headers);
         setFormFields(response.data.data);
      } catch (error) {
         console.error('Error fetching form fields:', error);
      }
   };

   useEffect(() => {
      if (type === 'edit') {
         form.setFieldsValue(selected)
      } else {
         form.setFieldsValue(formFields.reduce((acc, cur) => {
            const { defaultValue } = cur;
            if (defaultValue) {
               acc = { ...acc, [defaultValue.key]: defaultValue.value }
            }
            return acc;
         }, {}))
      }
   }, [selected, type])

   useEffect(() => {
      fetchFormFields()
   }, []);

   return (
      <div>
         {contextHolder}
         <Modal
            open={open}
            okButtonProps={{ loading: creating }}
            title={`${type === 'create' ? 'Create' : 'Update'} Ticket`}
            onOk={onOk}
            onCancel={onCancel}
         >
            <Form requiredMark={false} layout='vertical' style={{ padding: '.5rem 0rem' }} form={form}>
               {formFields.map((item, index) => {
                  const { label, type, placeholderValue: placeholder, property, required = false, attributes: options } = item;
                  let fieldProps = {};
                  if (type == "TEXT_NUMBER") {
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

export { FormComp as CreateTicketForm }