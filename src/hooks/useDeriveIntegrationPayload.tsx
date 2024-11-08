import { useContext, useState } from "react";

import API from '../services/index';
import { Payload, ServiceConfigType, ServiceTypes } from "../containers/scm/selectService/types";
import { parseError } from "../utils/API/fetchInstance";
import { AppContext } from "../context/AppProvider";
import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { useServiceConfigTypeProvider } from "../context/serviceConfig.context";

type ApiKeyFlowPayloadType = {
   derive: (values: Record<string, any>) => Record<string, any>;
   isCreating?: boolean
   isTesting?: boolean
   messageInstance?: readonly [MessageInstance, React.ReactElement<any, string | React.JSXElementConstructor<any>>]
   formValidationState?: FormValidationStateEnum
   // events
   onCreateIntegration?: (values: Record<string, any>) => void
   onTestIntegration?: (values: Record<string, any>) => void

};

interface useApiKeyFlowPayloadProps {
   selectedService: ServiceTypes
   selectedServiceConfig: ServiceConfigType
}

enum FormValidationStateEnum {
   Error = 'error',
   Warning = 'warning',
   Success = 'success',
   Validating = 'validating',
   Default = ''
}

export function useApiKeyFlowPayload({
   selectedService: selected,
}: useApiKeyFlowPayloadProps): ApiKeyFlowPayloadType {
   const [isCreating, setIsCreating] = useState<boolean>(false);
   const [isTesting, setIsTesting] = useState<boolean>(false);
   const [formValidationState, setFormValidationState] = useState<FormValidationStateEnum>(FormValidationStateEnum.Default);

   const {
      organization,
      setIntegration,
      setCurrentStep,
      current,
      domain,
      setIntegrationId
   } = useContext(AppContext);

   const { selectedService } = useServiceConfigTypeProvider()

   const messageInstance = message.useMessage();

   const [messageApi] = messageInstance;
console.log(organization,"appTitleappTitleappTitleappTitle")
   function derive(values) {
      const payload = {};
      Object.entries(values).forEach(([key, value]) => {

         if (key.includes('/')) {
            const [, ...keys] = key.split('/');
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
      const namePart = selected?.serviceProfile?.name.substring(0, 2);
      const subOrgPart = organization.substring(0, 4);
      const epocdate=Date.now();

      let formValues: Payload = {
         name: `${namePart+"_"+subOrgPart+"_"+epocdate}`,
         type: domain,
         subOrganization: { name: organization },
         target: {
            accessPoint: {
               type: 'SP',
               service: {
                  id: selectedService?.id
               },
               accessPointTypeConfig: {
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
         setIntegrationId(data?.id);
         setTimeout(() => {
            setCurrentStep(current + 1)
         }, 1000);
      } catch (error) {
         let errorMessage: string = 'Something went wrong';
                  if (error.response.status === 400) {
                     const data = error.response.data;
                     if (data && Array.isArray(data) && data.length && data[0]?.details) {
                        errorMessage = data[0]?.details;
                     } else {
                        errorMessage = data[0]?.errorMessage;
                     }
                  }
                  messageApi.open({
                     type: 'error',
                     content: errorMessage,
                  });
      } finally {
         setIsCreating(false);
      }
   }

   const onTestIntegration = async (values) => {
      let { flowType, ...formData } = values;
      try {
         setIsTesting(true);
         const { data } = await API.services.testIntegrations({
            criteria: {
               and: [
                  {
                     property: "/target/accessPoint/service/id",
                     operator: "=",
                     values: [
                        selected?.id
                     ]
                  },
                  {
                     property: "/target/accessPoint/accessPointTypeConfig/type",
                     operator: "=",
                     values: [
                        flowType
                     ]
                  },
                  ...Object.entries(formData).map(([key, value]) => {
                     return {
                        property: `/target/accessPoint${key}`,
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
            setFormValidationState(FormValidationStateEnum.Success);
            messageApi.open({
               type: 'success',
               content: <>
                  <strong>Success!</strong> Your credentials have been successfully validated. You can now proceed with your next steps.
               </>
            });
         }
         else if (data.data.some((item) => item.type === "FAILURE")) {
            setFormValidationState(FormValidationStateEnum.Error);
            messageApi.open({
               type: 'error',
               content: <>
                  <strong>Oops!</strong> Your tokens are invalid. Please check the information and try again.
               </>
            });
         }
      } catch (error) {
         setFormValidationState(FormValidationStateEnum.Error)
         const { message } = parseError(error?.response?.data)
         messageApi.open({
            type: 'error',
            content: message,
         });
      } finally {
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
      formValidationState,
   };
}