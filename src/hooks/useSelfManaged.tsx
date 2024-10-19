import { useEffect, useState } from "react";
import { ServiceTypes } from "../containers/scm/selectService/types";
import API from '../services';

import { Form as AntForm, Input, Select, Typography } from "antd";

export const SELF_MANAGED_PROVIDERS = ['GitHub Enterprise', 'GitLab Self-Managed', 'Jira Server'];

type FormProps = {
   versions: any[]
};

const Form = ({ versions = [] }: FormProps) => {

   return (
      <AntForm>
         <AntForm.Item name="version" label={<Typography.Text strong>Please select your version</Typography.Text>} rules={[{ required: true }]}>
            <Select
               placeholder="Please select your version"
               allowClear
               options={versions?.map(({ id: value, name: label }) => ({ value, label }))}
            />
         </AntForm.Item>

         <AntForm.Item name="url" label={<Typography.Text strong>Please enter your endpoint url</Typography.Text>} rules={[{ required: true }]}>
            <Input
               placeholder="Please enter your endpoint url"
            />
         </AntForm.Item>
      </AntForm>
   )
}

export const useSelfManageWindow = ({ id }) => {
   const [versions, setVersion] = useState([]);

   const getAllVersions = async () => {
      try {
         const smResp = await API.services.getSelfManaged(id);
         setVersion(smResp?.data?.data ?? [])

      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      getAllVersions()
   }, [id])

   return {
      getForm: () => (
         <Form versions={[]} />
      ),
      getIsSelfManaged: (service: ServiceTypes) => {
         return SELF_MANAGED_PROVIDERS.includes(service?.serviceProfile?.name)
      },
      versions: versions ?? []
   }
}