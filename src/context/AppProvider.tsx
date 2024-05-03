import React from 'react';
import { DomainTypes } from '../types/type';
import { useSearchParams } from 'react-router-dom';
import { ServiceTypes } from '../containers/scm/selectService/types';

export const AppContext = React.createContext<ContextTypes>(null);

type ContextTypes = {
      domain?: DomainTypes
      accessKey?: string
      organization?: string
      current?: number
      selectedService?: string;
      selectedOrganization?: string;
      selectedRepo?: string;
      conclusion?: string;
      selectedBranch?: string;
      selectedPullReq?: string;
      selectedCommit? :string;

      setSelectedCommit?: (selectedCommit :string) =>void;
      setSelectedPullReq?: (selectedPullReq :string) => void;
      setSelectedBranch?: (selectedBranch: string) => void;
      setConclusion?: (option?: string) => void;
      setSelectedOrganization?: (selectedOrganization: string) => void;
      setSelectedService?: (selectedService: string) => void;
      setSelectedRepo?: (selectedOrganization: string) => void;
      setCurrentStep?: (newCurrent: number) => void;
      setOrganization?: React.Dispatch<React.SetStateAction<string>>
      setAccessKey?: React.Dispatch<React.SetStateAction<string>>
      setDomain?: React.Dispatch<React.SetStateAction<DomainTypes>>
      setIntegration?: (serviceProfileTypes: ServiceTypes) => void


      integration?: ServiceTypes
}

type ProviderTypes = {
      children: React.ReactNode
      value?: ContextTypes
}

export function AppProvider({ children, value }: ProviderTypes) {
      const [accessKey, setAccessKey] = React.useState<string>(null);
      const [domain, setDomain] = React.useState<DomainTypes>('SCM');
      const [organization, setOrganization] = React.useState<string>(undefined);

      const [search, setSearch] = useSearchParams({ current: '0' });

      const setIntegrationDetails = (arg) => {
            setSearch((prev) => {
                  prev.set('integration', JSON.stringify(arg))
                  return prev;
            })
      }

      const setConclusion = (arg) => {
            setSearch((prev) => {
                  prev.set('conclusion', arg)
                  return prev;
            })
      }

      const setSelectedService = (arg) => {
            setSearch((prev) => {
                  prev.set('service', arg)
                  return prev;
            })
      }

      const setSelectedOrganization = (arg) => {
            setSearch((prev) => {
                  prev.set('selectedOrganization', arg)
                  return prev;
            })
      }

      const setSelectedRepo = (arg) => {
            setSearch((prev) => {
                  prev.set('selectedRepo', arg)
                  return prev;
            })
      }

      const setCurrentStep = (newCurrent: number) => {
            setSearch((prev) => {
                  prev.set('current', newCurrent.toString())
                  return prev;
            })
      }

      const setSelectedBranch = (newBranch: string) => {
            setSearch((prev) => {
                  prev.set('selectedBranch', newBranch.toString())
                  return prev;
            })
      }
      const setSelectedPullReq = (newPullrequest: string) => {
            setSearch((prev) => {
                  prev.set('selectedPullReq', newPullrequest.toString())
                  return prev;
            })
      }
      
      const setSelectedCommit = (newCommit: string) => {
            setSearch((prev) => {
                  prev.set('selectedCommit', newCommit.toString())
                  return prev;
            })
      }

      const contextValues: ContextTypes = {
            setAccessKey,
            setDomain,
            setIntegration: setIntegrationDetails,
            setOrganization,
            setCurrentStep,
            setSelectedService,
            setSelectedOrganization,
            setSelectedRepo,
            setConclusion,
            setSelectedBranch,
            setSelectedPullReq,
            setSelectedCommit,
            organization,
            selectedCommit: search.get("selectedCommit"),
            selectedPullReq: search.get('selectedPullReq'),
            selectedBranch: search.get('selectedBranch'),
            conclusion: search.get('conclusion'),
            selectedService: search.get('service'),
            selectedRepo: search.get("selectedRepo"),
            current: +search.get('current'),
            selectedOrganization: search.get('selectedOrganization'),
            integration: search.get('integration') ? JSON.parse(search.get('integration')) : undefined,
            domain,
            accessKey,
            ...value
      }

      return (
            <AppContext.Provider value={contextValues} children={children} />
      )
}