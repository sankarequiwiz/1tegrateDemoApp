import { Badge, Form, Input, Modal, ModalProps, Select, message } from 'antd';
import React, { useEffect, useImperativeHandle } from 'react';
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
      type: 'enum',
      label: 'Type',
      fieldType: <Select />,
      required: true,
      options: [
         {
            label: 'Bug',
            value: 'Bug',
         },
         {
            label: 'Feature Request',
            value: 'Feature Request'
         },
         {
            label: 'Improvement',
            value: 'Feature Request'
         },
         {
            label: 'Story',
            value: 'Story',
         },
         {
            label: 'Task',
            value: 'Task'
         },
         {
            label: 'Incident',
            value: 'Incident'
         },
         {
            label: 'Support Request',
            value: 'Support Request',
         },
         {
            label: 'Test Case',
            value: 'Test Case'
         },
         {
            label: 'Documentation',
            value: 'Documentation'
         },
         {
            label: 'Change Request',
            value: 'Change Request'
         }
      ]
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
   },
   {
      name: 'priority',
      label: 'Priority',
      type: 'enum',
      fieldType: <Select />,
      options: [
         {
            label: 'High',
            value: 'high',
            emoji: <Badge dot />
         },
         {
            label: 'Medium',
            value: 'medium'
         },
         {
            label: 'Low',
            value: 'low'
         }
      ]
   },
   {
      name: 'status',
      label: 'Status',
      type: 'text',
      fieldType: <Input />,
   },
]

function FormComp(props: FormTypes) {
   const { open, type, selected, onCancel: onCancelProp, actionRef, ...rest } = props;
   const { integration, selectedOrganization, selectedCollection } = React.useContext(AppContext);
   const [messageApi, contextHolder] = message.useMessage();

   const [form] = Form.useForm();

   const headers = { integrationId: integration?.id }

   const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      onCancelProp(e);
      form.resetFields();
   }

   const createTicket = async (values: { [key: string]: string }) => {
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
      }
   }

   const editTicket = async (values: { [key: string]: string }) => {
      try {
         const resp = await API.services.editTickets(
            values,
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
      <Modal open={open} title={`${type === 'create' ? 'Create' : 'Edit'} Ticket`} {...rest} onCancel={onCancel}>
         {contextHolder}
         <Form layout='vertical' style={{ padding: '.5rem 0rem' }} form={form}>
            {formDetails.map((item, index) => {
               const { label, name, fieldType, options, type, required = false } = item;
               let props = {}
               if (type === 'enum') {
                  props = { options };
               }
               return (
                  <Form.Item rules={[{ required }]} label={label} key={index} name={name}>
                     {React.cloneElement(fieldType, {
                        placeholder: `${type === 'text' ? 'Enter' : 'Select'} the ${label?.toLowerCase()}`,
                        ...props
                     })}
                  </Form.Item>
               )
            })}
         </Form>
      </Modal>
   )
}

export { FormComp as CreateTicketForm }