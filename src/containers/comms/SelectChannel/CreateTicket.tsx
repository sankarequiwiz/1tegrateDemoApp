import { Form, Input, InputNumber, Select, Modal, ModalProps, PaginationProps, message } from 'antd';
import React, { useEffect, useState } from 'react';
import API from '../../../services';
import { AppContext } from '../../../context/AppProvider';
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



   const sendMessage = async (values: { [key: string]: string }) => {
      values.name=selectedCollection
      try {
         await API.services.sendMessages(
            values,
            headers,
            selectedOrganization,
            selectedCollection,
         );
         onCancel(undefined);
         messageApi.success({ content: `Message sent successfully.` });
         setTimeout(() => {
            getAllTickets(paginationState);
         }, 2000)
         setCreating
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
            await sendMessage(resp);
      } catch (error) {
         console.error(error);
      };
   }

   const payload = 
      {
         type:"MESSAGE_CREATE"
     }
   
   const fetchFormFields = async () => {
      try {
         const response = await API.services.metaDataConfigComms(selectedOrganization, selectedCollection, payload, headers);
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
      if(open){
         fetchFormFields()
      }else{
         setFormFields([])
      }
   }, [type,open]);

   return (
      <div>
         {contextHolder}
         <Modal
            open={open}
            okButtonProps={{ loading: creating }}
            title={`${type === 'create' ? 'Create' : 'Send'} Message`}
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

export { FormComp as CreateTicketForm }