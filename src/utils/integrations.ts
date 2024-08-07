export const fieldMapper = () => {
   return {
      API_KEY: {
         value: 'apiKey',
      },
      USERNAME: {
         value: 'username'
      },
      PASSWORD: {
         value: 'password'
      },
      DOMAIN: {
         value: 'domain'
      },
      CLIENT_ID: {
         value: "clientId"
      },
      CLIENT_SECRET: {
         value: "clientSecret"
      },
      TENANT_ID: {
         value: "tenantId"
      },
      SERVICE_REGION: {
         value: "serviceRegion",
         getBaseKey(_value: string | { [key: string]: any } | { [key: string]: any }[]) {
            return {}
         }
      },
      contentType: {
         value: "contentType"
      },
      version: {
         value: "version"
      },
      url: {
         value: "url"
      }
   }
}