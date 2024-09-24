export enum ServiceAccessTypeStateEnum {
   Configured = 'CONFIGURED',
   ReadyToConfigured = 'READY_TO_BE_CONFIGURED',
   Disabled = 'DISABLED'
}

export enum ServiceAccessTypeEnum {
   APIKey = 'API_KEY_FLW',
   AppFlow = 'APP_FLW',
}

export enum InputFieldType {
   Text = 'TEXT',
   List = 'LIST'
}

export const API_FLW_INTEGRATION_KEY_MAPPER = {
   API_KEY: {
      value: 'apiKey',
      getBaseValues() {
         return this.value
      }
   },
   USERNAME: {
      value: 'username',
      getBaseValues() {
         return this.value
      }
   },
   PASSWORD: {
      value: 'password',
      getBaseValues() {
         return this.value
      }
   },
   DOMAIN: {
      value: 'domain',
      getBaseValues() {
         return this.value
      }
   },
   CLIENT_ID: {
      value: "clientId",
      getBaseValues() {
         return this.value
      }
   },
   CLIENT_SECRET: {
      value: "clientSecret",
      getBaseValues() {
         return this.value
      }
   },
   TENANT_ID: {
      value: "tenantId",
      getBaseValues() {
         return this.value
      }
   },
   SERVICE_REGION: {
      value: "serviceRegion",
      getBaseValues(code) {
         return { code }
      }
   },
   ACCOUNT_ID: {
      value: "accountId",
      getBaseValues() {
         return this.value
      }
   },
   contentType: {
      value: "contentType",
      getBaseValues() {
         return this.value
      }
   },
   version: {
      value: "version",
      getBaseValues() {
         return this.value
      }
   },
   url: {
      value: "url",
      getBaseValues() {
         return this.value
      }
   },
   API_ID: {
      value: "apiId",
      getBaseValues() {
         return this.value
      }
   },
   CODE: {
      value: "code",
      getBaseValues() {
         return this.value
      }
   },
}