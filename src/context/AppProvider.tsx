import React from 'react';
import { DomainTypes } from '../types/type';
import { ServiceProfileTypes } from '../containers/scm/selectService/types';

export const AppContext = React.createContext<ContextTypes>(null);

type ContextTypes = {
      domain?: DomainTypes
      accessKey?: string
      organization?: string
      setOrganization?: React.Dispatch<React.SetStateAction<string>>
      setAccessKey?: React.Dispatch<React.SetStateAction<string>>
      setDomain?: React.Dispatch<React.SetStateAction<DomainTypes>>
      setIntegration?: React.Dispatch<React.SetStateAction<ServiceProfileTypes>>
      integration?: ServiceProfileTypes
}

type ProviderTypes = {
      children: React.ReactNode
      value?: ContextTypes
}

export function AppProvider({ children, value }: ProviderTypes) {
      const [accessKey, setAccessKey] = React.useState<string>(null);
      const [domain, setDomain] = React.useState<DomainTypes>('SCM');
      const [integration, setIntegration] = React.useState<ServiceProfileTypes>(undefined);
      const [organization, setOrganization] = React.useState<string>(undefined);

      const contextValues: ContextTypes = {
            setAccessKey,
            setDomain,
            setIntegration,
            setOrganization,
            organization,
            integration,
            domain,
            accessKey,
            ...value
      }


      return (
            <AppContext.Provider value={contextValues} children={children} />
      )
}