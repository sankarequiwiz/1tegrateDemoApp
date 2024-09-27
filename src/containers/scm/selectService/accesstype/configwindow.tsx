import { useServiceConfigTypeProvider } from '../../../../context/serviceConfig.context';
import { ServiceAccessTypeEnum } from '../constant';
import { APPKeyFlow } from './appflow';
import { APIKeyFlow } from './apiKeyflow';


export const ConfigWindows = () => {

   const { selectedServiceConfig } = useServiceConfigTypeProvider();

   if (selectedServiceConfig?.type !== ServiceAccessTypeEnum.APIKey) {
      return (
         <APPKeyFlow />
      )
   }
   return <APIKeyFlow />
}