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

function transformObject(input) {
   const output = {};

   // Iterate over each key-value pair in the input object
   Object.entries(input).forEach(([key, value]) => {
      // Check if the key contains a slash
      if (key.includes('/')) {
         const keys = key.split('/'); // Split the key by '/'
         let current = output;

         // Iterate through the keys, creating nested objects as needed
         keys.forEach((k, index) => {
            if (index === keys.length - 1) {
               current[k] = value; // Set the value at the last key
            } else {
               current[k] = current[k] || {}; // Create the nested object if it doesn't exist
               current = current[k];
            }
         });
      } else {
         output[key] = value; // Copy the key-value pair directly if no slash is found
      }
   });

   return output;
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
      const payload = {};
      Object.entries(values).forEach(([key, value]) => {

         if (key.includes('/')) {
            const [,...keys] = key.split('/');
            let current = payload;

            keys.forEach((k, index) => {
               if (index === keys.length - 1) {
                  current[k] = value;
               } else {
                  current[k] = current[k] || {};
                  current = current[k];
               }
            });
         } else {
            payload[key] = value;
         }

      })
      return payload;
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