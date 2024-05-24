import { Badge, Button, Form, FormInstance, Input, Modal, ModalProps, Select } from 'antd';
import React, { HTMLProps, useState } from 'react';


export const CreateTicket = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
   const [open, setOpen] = useState<boolean>(false);

   const [form] = Form.useForm();

   const onOpen = () => {
      setOpen(true);
   }
   const onCancel = () => {
      setOpen(false);
   }
   const onOk = () => {
      form.validateFields().then((resp) => {
         const formValues = resp;

         console.log(formValues)
      })
   }

   return (
      <div {...props} ref={ref}>
         <Button size='small' onClick={onOpen} >Create Ticket</Button>
         <FormComp onCancel={onCancel} onOk={onOk} open={open} form={form} />
      </div>
   )
})

type FormTypes = {
   form?: FormInstance<any>
} & ModalProps;

const formDetails = [
   {
      name: 'type',
      type: 'enum',
      label: 'Type',
      fieldType: <Select />,
   },
   {
      name: 'title',
      label: 'Title',
      type: 'text',
      fieldType: <Input />,
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
]

function FormComp(props: FormTypes) {
   const { open, onCancel, form, ...rest } = props;
   return (
      <Modal open={open} onCancel={onCancel} title='Create ticket' {...rest}>
         <Form layout='vertical' style={{ padding: '.5rem 0rem' }} form={form}>
            {formDetails.map((item, index) => {
               const { label, name, fieldType, options, type } = item;
               let props = {}
               if (type === 'enum') {
                  props = { options };
               }
               return (
                  <Form.Item label={`Select the ${label}`} key={index} name={name}>
                     {React.cloneElement(fieldType, {
                        placeholder: `please select the ${label}`,
                        ...props
                     })}
                  </Form.Item>
               )
            })}
         </Form>
      </Modal>
   )
}