import { useServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { ServiceAccessTypeEnum } from '../constant';
import { APPKeyFlow } from './appflow';
import { APIKeyFlow } from './apiKeyflow';


export const ConfigWindows = () => {

   const { selectedServiceConfig } = useServiceConfigTypeProvider();

   if ([
      ServiceAccessTypeEnum.APIKey,
      ServiceAccessTypeEnum.CredentialFlow,
      ServiceAccessTypeEnum.OAuthPasswordFlow
   ].includes(selectedServiceConfig?.type)) {
      return (
         <APIKeyFlow />
      )
   }
   return <APPKeyFlow />
}