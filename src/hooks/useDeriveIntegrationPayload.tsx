import { API_FLW_INTEGRATION_KEY_MAPPER } from "../containers/scm/selectService/constant";

export const useDeriveApiKeyFlowPayload = (): ReturnType<typeof useDeriveApiKeyFlowPayload> => {

   function derive(values) {
      let formData = {}
      Object.entries(values).map(([key, value]) => {

         delete formData[key];
         if (!API_FLW_INTEGRATION_KEY_MAPPER?.[key]) {
            alert(`${key} is not configured in mapper`)
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

   return { derive }
}