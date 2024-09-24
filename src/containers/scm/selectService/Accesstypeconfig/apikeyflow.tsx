import { Flex, Form, Input, Select, Typography } from "antd"
import { FormArea } from "../formArea"
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context"
import { useCallback, useEffect, useMemo, useState } from "react";
import { InputFieldType } from "../constant";
import { deploymentModel } from "../../../../common/deploymentModal";
import API from '../../../../services';

type FieldTypeConfig = {
   type: string
   name: string
   label: string
   required: string
   property: string
   dataType?: {
      type?: InputFieldType
      values?: { code?: string, description?: string }[]
   }
};

const INPUT_FIELD_MAPPERS = {
   [InputFieldType.List]: {
      getParseOption(list: Array<{ [key: string]: any }>) {
         return list.map(({ code: value = null, description: label = null }) => (
            { value, label }
         ))
      },
      getField({ dataType, ...rest }: any) {
         const options = this.getParseOption(dataType?.values ?? [])
         return <Select {...rest} options={options} allowClear />
      },
      getValidations(validations: Array<{ [key: string]: any }>) {
         return validations?.map(({ required = false }) => ({
            required,
            message: '${name}'
         }))
      }
   },
   [InputFieldType.Text]: {
      getField: (props: any) => {
         return <Input {...props} allowClear />
      },
      getValidations(...args: Array<{ [key: string]: any }>) {
         const [validations] = args;
         return validations?.map(({ required = false }) => ({
            required,
            message: '${name}'
         }))
      }
   }
}

export const APIKeyFlowIntegration = () => {

   const { selectedService, form } = useServiceConfigTypeProvider();

   const [versions, setVersion] = useState([]);

   const getIsSelfManaged = useCallback(() => {
      return selectedService?.serviceProfile.deploymentModel?.type === deploymentModel.type.SELF_MANAGED;
   }, [selectedService])

   const fields: FieldTypeConfig[] = useMemo(() => (
      selectedService?.serviceProfile?.accessPointConfigs?.[0]?.fieldTypeConfigs ?? [] as any
   ), [selectedService]);

   const getAllVersions = async () => {
      try {
         const smResp = await API.services.getSelfManaged(selectedService?.serviceProfile?.id);
         setVersion(smResp?.data?.data ?? [])

      } catch (error) {
         console.log(error)
      }
   };

   const flwType = useMemo(() => {
      return selectedService?.serviceProfile?.accessPointConfigs?.[0]?.type ?? 'not_set';
   }, [selectedService?.serviceProfile]);

   useEffect(() => {
      getIsSelfManaged() ? getAllVersions() : null
   }, [getIsSelfManaged()])

   useEffect(() => {
      form.setFieldValue('flowType', flwType)
   }, [flwType])

   return (
      <Flex>
         {/* <FormArea selected={selectedService as any} /> */}
         {/* new implementation */}
         <Form
            layout="vertical"
            form={form}
            style={{ width: '100%' }}
         >
            <Typography.Title level={5}>
               {`Configure ${selectedService?.serviceProfile?.name} services`}
            </Typography.Title>
            <Form.Item
               name={'flowType'}
               hidden
               preserve
            >
               <Input value={flwType} />
            </Form.Item>
            <Flex vertical gap={'small'}>
               {fields.map((field, index) => {

                  const {  dataType, label, name, required, type } = field,
                     fieldType = dataType?.type ?? InputFieldType.Text;

                  const fieldMapper = INPUT_FIELD_MAPPERS?.[fieldType],
                     validations = fieldMapper?.getValidations([{ required }])

                  return (
                     <Form.Item
                        key={index}
                        name={type}
                        label={<b>{label}</b>}
                        hasFeedback
                        rules={validations}
                        messageVariables={{ name }}
                     >
                        {fieldMapper?.getField({
                           placeholder: `${(name ?? label)?.toString()}`,
                           ...field
                        })}
                     </Form.Item>
                  )
               })}

               {getIsSelfManaged() && (
                  <>
                     <Form.Item name="version" label={<Typography.Text strong>Please select your version</Typography.Text>} rules={[{ required: true }]}>
                        <Select
                           placeholder="Please select your version"
                           allowClear
                           options={versions?.map(({ id: value, name: label }) => ({ value, label }))}
                        />
                     </Form.Item>

                     <Form.Item name="url" label={<Typography.Text strong>Please enter your endpoint url</Typography.Text>} rules={[{ required: true }]}>
                        <Input
                           placeholder="Please enter your endpoint url"
                        />
                     </Form.Item>
                  </>
               )}
            </Flex>
         </Form>
      </Flex>
   )
}