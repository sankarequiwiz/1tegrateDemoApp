import { Form, Input, Modal, ModalProps, PaginationProps, message } from 'antd';
import React, { useEffect, useState } from 'react';
import API from '../../../services';
import { AppContext } from '../../../context/AppProvider';
import { defaultPagination } from '.';

type FormTypes = {
   type: 'edit' | 'create'
   selected?: { [key: string]: any }
   actionRef?: any
   getAllTickets?: (pagination: { [key: string]: any }) => void;
   paginationState?: PaginationProps
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
   const { open, type, selected, onCancel: onCancelProp, getAllTickets, paginationState } = props;
   const { integration, selectedOrganization, selectedCollection } = React.useContext(AppContext);
   const [messageApi, contextHolder] = message.useMessage();
   const [creating, setCreating] = useState(false);

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
         onCancel(undefined);
         messageApi.success({ content: `Ticket created successfully.` });
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
         messageApi.success({ content: `Ticket updated successfully.` });;
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
         setTimeout(() => {
            getAllTickets(type === 'edit' ? paginationState : defaultPagination)
         }, 1000)
         onCancel();
      } catch (error) {
         console.error(error);
      };
   }

   useEffect(() => {
      form.setFieldsValue(selected)
   }, [selected, type])

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
      </div>
   )
}

export { FormComp as CreateTicketForm }