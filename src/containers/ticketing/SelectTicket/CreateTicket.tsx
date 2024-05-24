import { Badge, Form, Input, Modal, ModalProps, Select } from 'antd';
import React, { useEffect } from 'react';


type FormTypes = {
   type: 'edit' | 'create'
   selected?: { [key: string]: any }
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
            value: 'BUG',
         },
         {
            label: 'Feature Request',
            value: 'FEATURE_REQUEST'
         },
         {
            label: 'Improvement',
            value: 'IMPROVEMENT'
         },
         {
            label: 'Story',
            value: 'STORY',
         },
         {
            label: 'Task',
            value: 'TASK'
         },
         {
            label: 'Incident',
            value: 'INCIDENT'
         },
         {
            label: 'Support Request',
            value: 'SUPPORT_REQUEST',
         },
         {
            label: 'Test Case',
            value: 'TEST_CASE'
         },
         {
            label: 'Documentation',
            value: 'DOCUMENTATION'
         },
         {
            label: 'Change Request',
            value: 'CHANGE_REQUEST'
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
      required: true,
   },
   {
      name: 'priority',
      label: 'Priority',
      type: 'enum',
      fieldType: <Select />,
      required: true,
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
]

function FormComp(props: FormTypes) {
   const { open, type, selected, onCancel: onCancelProp, ...rest } = props;

   const [form] = Form.useForm();

   const onOk = () => {
      form.validateFields().then((resp) => {
         let formValues = resp;
         console.log(formValues);
      }).catch((err) => {
         console.error(err);
      })
   }

   const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      onCancelProp(e);
      form.resetFields();
   }

   useEffect(() => {
      form.setFieldsValue(selected)
   }, [selected])

   return (
      <Modal open={open} title={`${type === 'create' ? 'Create' : 'Edit'} Ticket`} {...rest} onCancel={onCancel} onOk={onOk}>
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