import { Form, Input, Modal, ModalProps, message } from 'antd';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import API from '../../../services';
import { AppContext } from '../../../context/AppProvider';

type FormTypes = {
   type: 'edit' | 'create'
   selected?: { [key: string]: any }
   actionRef?: any
} & ModalProps;

const formDetails = [
   {
      name: 'type',
      type: 'text',
      label: 'Type',
      fieldType: <Input />,
      required: true,
   },
   {
      name: 'name',
      label: 'Title',
      type: 'text',
      fieldType: <Input />,
      required: true,
   },
   {
      name: 'description',
      label: 'Description',
      type: 'text',
      fieldType: <Input />,
      required: true,
   },
   {
      name: 'priority',
      label: 'Priority',
      type: 'text',
      fieldType: <Input />,
      required: true,
   },
   {
      name: 'status',
      label: 'Status',
      type: 'text',
      fieldType: <Input />,
      required: true,
   },
]

function FormComp(props: FormTypes) {
   const { open, type, selected, onCancel: onCancelProp, actionRef, ...rest } = props;
   const { integration, selectedOrganization, selectedCollection } = React.useContext(AppContext);
   const [messageApi, contextHolder] = message.useMessage();
   const [creating, setCreating] = useState(false);

   const [form] = Form.useForm();

   const headers = { integrationId: integration?.id }

   const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      onCancelProp(e);
      form.resetFields();
   }

   const createTicket = async (values: { [key: string]: string }) => {
      setCreating(true);
      try {
         const resp = await API.services.createTickets(
            values,
            headers,
            selectedOrganization,
            selectedCollection
         );
         onCancel(undefined);
         return resp;
      } catch (error) {
         const errorProp = error?.response?.data;
         console.error(errorProp);
         let content = 'something went wrong!'
         if (Array.isArray(errorProp) && errorProp.length) {
            const [message] = errorProp;
            content = message?.errorMessage || message?.message;
         }
         messageApi.error({ content })
         return false;
      } finally {
         setCreating(false);
      }
   }

   const editTicket = async (values: { [key: string]: string }) => {
      const dirtyFields = {};
      Object.entries(values).map(([key, value]) => {
         if (!selected[key] || selected[key] !== value) {
            dirtyFields[key] = value;
         }
      })
      try {
         const resp = await API.services.editTickets(
            dirtyFields,
            headers,
            selectedOrganization,
            selectedCollection,
            selected?.id
         );
         onCancel(undefined);
         return resp;
      } catch (error) {
         const errorProp = error?.response?.data;
         console.error(errorProp);
         let content = 'something went wrong!'
         if (Array.isArray(errorProp) && errorProp.length) {
            const [message] = errorProp;
            content = message?.errorMessage || message?.message;
         }
         messageApi.error({ content })
         return false;
      }
   }

   const onOk = async () => {
      try {
         const resp = await form.validateFields()
         if (type === 'create') {
            return await createTicket(resp);
         } else {
            return await editTicket(resp);
         }

      } catch (error) {
         console.error(error);
      };
   }

   useImperativeHandle(actionRef, () => {
      return { onOk }
   }, [type])

   useEffect(() => {
      form.setFieldsValue(selected)
   }, [selected])

   return (
      <Modal
         open={open}
         okButtonProps={{ loading: creating }}
         title={`${type === 'create' ? 'Create' : 'Update'} Ticket`}
         {...rest}
         onCancel={onCancel}
      >
         {contextHolder}
         <Form requiredMark={false} layout='vertical' style={{ padding: '.5rem 0rem' }} form={form}>
            {formDetails.map((item, index) => {
               const { label, name, fieldType, type, required = false } = item;
               return (
                  <Form.Item rules={[{ required }]} label={label} key={index} name={name}>
                     {React.cloneElement(fieldType, {
                        placeholder: `${type === 'text' ? 'Enter' : 'Select'} the ${label?.toLowerCase()}`,
                     })}
                  </Form.Item>
               )
            })}
         </Form>
      </Modal>
   )
}

export { FormComp as CreateTicketForm }