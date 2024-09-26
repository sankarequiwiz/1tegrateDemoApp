import { useContext, useState } from "react";

import API from '../services/index';
import { API_FLW_INTEGRATION_KEY_MAPPER } from "../containers/scm/selectService/constant";
import { Payload, ServiceConfigType, ServiceTypes } from "../containers/scm/selectService/types";
import { parseError } from "../utils/API/fetchInstance";
import { AppContext } from "../context/AppProvider";
import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { FormValidationState } from "../context/serviceConfig.context";

type ApiKeyFlowPayloadType = {
   derive: (values: Record<string, any>) => Record<string, any>;
   isCreating?: boolean
   isTesting?: boolean
   isIntValidated?: FormValidationState
   messageInstance?: readonly [MessageInstance, React.ReactElement<any, string | React.JSXElementConstructor<any>>]

   // events
   onCreateIntegration?: (values: Record<string, any>) => void
   onTestIntegration?: (values: Record<string, any>) => void

};

interface useApiKeyFlowPayloadProps {
   selectedService: ServiceTypes
   selectedServiceConfig: ServiceConfigType
}

export function useApiKeyFlowPayload({
   selectedService: selected,
   selectedServiceConfig
}: useApiKeyFlowPayloadProps): ApiKeyFlowPayloadType {
   const [isCreating, setIsCreating] = useState<boolean>(false);
   const [isTesting, setIsTesting] = useState<boolean>(false);
   const [isIntValidated, setIsIntValidated] = useState<FormValidationState>(null)

   const {
      organization,
      setIntegration,
      setCurrentStep,
      current
   } = useContext(AppContext);

   const {
      type = null
   } = selectedServiceConfig;
   const messageInstance = message.useMessage();

   const [messageApi] = messageInstance;

   function derive(values) {
      let formData = {};
      Object.entries(values).map(([key, value]) => {

         delete formData[key];
         if (!API_FLW_INTEGRATION_KEY_MAPPER?.[key]) {
            alert(`${key} is not configured in mapper`);
         }
         const baseValue = API_FLW_INTEGRATION_KEY_MAPPER?.[key];

         if (typeof baseValue?.getBaseValues(value) === 'object') {
            formData[baseValue?.['value'] ?? key] = baseValue?.getBaseValues(value);
         } else {
            formData[API_FLW_INTEGRATION_KEY_MAPPER?.[key]?.['value'] ?? key] = value;
         }
      });

      return formData;
   }

   const onCreateIntegration = async (values) => {
      let { flowType, ...formData } = values;

      const payload = derive(formData);

      let formValues: Payload = {
         name: `${selected?.serviceProfile?.name} integration`,
         type,
         subOrganization: { name: organization },
         target: {
            accessPoint: {
               type: 'SP',
               serviceProfile: {
                  id: selected?.serviceProfile.id,
               },
               accessPointConfig: {
                  type: flowType,
               },
               ...payload,
            },
         },
      };

      try {
         setIsCreating(true);
         const resp = await API.services.createIntegrations(formValues);
         const { data } = resp;
         setIntegration(data);
         setTimeout(() => {
            setCurrentStep(current + 1)
         }, 1000);
      } catch (error) {
         const { message } = parseError(error?.response?.data)
         messageApi.open({
            type: 'error',
            content: message,
         });
      } finally {
         setIsCreating(false);
      }
   }

   const onTestIntegration = async (values) => {
      let { flowType, ...formData } = values;
      const payload = derive(formData);
      try {
         setIsTesting(true);
         const { data } = await API.services.testIntegrations({
            criteria: {
               and: [
                  {
                     property: "/target/accessPoint/serviceProfile/id",
                     operator: "=",
                     values: [
                        selected?.serviceProfile.id
                     ]
                  },
                  {
                     property: "/target/accessPoint/accessPointConfig/type",
                     operator: "=",
                     values: [
                        flowType
                     ]
                  },
                  ...Object.entries(payload).map(([key, value]) => {
                     return {
                        property: `/target/accessPoint/${key}`,
                        operator: "=",
                        values: [
                           value
                        ]
                     }
                  })
               ]
            }
         });
         if (data?.data.some((item) => item.type === "SUCCESS")) {
            setIsIntValidated("success");
            messageApi.open({
               type: 'success',
               content: <>
                  <strong>Success!</strong> Your credentials have been successfully validated. You can now proceed with your next steps.
               </>
            });
         }
         else if (data.data.some((item) => item.type === "FAILURE")) {
            setIsIntValidated("error");
            messageApi.open({
               type: 'error',
               content: <>
                  <strong>Oops!</strong> Your tokens are invalid. Please check the information and try again.
               </>
            });
         }
      } catch (error) {
         setIsIntValidated("error")
         const { message } = parseError(error?.response?.data)
         messageApi.open({
            type: 'error',
            content: message,
         });
         setIsTesting(false);
      }
   }

   return {
      derive,
      isCreating,
      isTesting,
      onTestIntegration,
      onCreateIntegration,
      messageInstance,
      isIntValidated
   };
}