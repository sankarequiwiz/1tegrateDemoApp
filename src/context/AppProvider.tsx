import React from 'react';
import { DomainTypes } from '../types/type';
import { useSearchParams } from 'react-router-dom';
import { ServiceTypes } from '../containers/scm/selectService/types';

export const AppContext = React.createContext<ContextTypes>(null);

type ContextTypes = {
  domain?: DomainTypes;
  accessKey?: string;
  organization?: string;
  current?: number;
  selectedService?: string;
  selectedOrganization?: string | 'default';
  selectedRepo?: string;
  conclusion?: string;
  selectedBranch?: string;
  userName?: string;
  selectedPullReq?: string;
  selectedCommit?: string;
  appTitle?: string;
  selectedCollection?: string;

  setAppTitle?: (appTitle: string) => void;
  setUserName?: (userName: string) => void;
  setAccessKey?: (accessKey: string) => void;
  setSelectedCommit?: (selectedCommit: string) => void;
  setSelectedPullReq?: (selectedPullReq: string) => void;
  setSelectedBranch?: (selectedBranch: string) => void;
  setConclusion?: (option?: string) => void;
  setSelectedOrganization?: (selectedOrganization: string) => void;
  setSelectedService?: (selectedService: string) => void;
  setSelectedRepo?: (selectedOrganization: string) => void;
  setCurrentStep?: (newCurrent: number) => void;
  setOrganization?: React.Dispatch<React.SetStateAction<string>>;
  setDomain?: React.Dispatch<React.SetStateAction<DomainTypes>>;
  setIntegration?: (serviceProfileTypes: ServiceTypes) => void;
  setSelectedCollection?: (collection: string) => void;

  integration?: ServiceTypes;
};

type ProviderTypes = {
  children: React.ReactNode;
  value?: ContextTypes;
};

export function AppProvider({ children, value }: ProviderTypes) {

  const [search, setSearch] = useSearchParams({
    current: '0',
    accessKey: '',
    userName: 'Demo app User',
    organization: 'Demo app Company',
    appTitle: 'Demo app Title',
    domain: 'SCM'
  });

  const setIntegrationDetails = (arg) => {
    setSearch((prev) => {
      prev.set('integration', JSON.stringify(arg));
      return prev;
    });
  };

  const setOrganization = (arg) => {
    setSearch((prev) => {
      prev.set('organization', arg);
      return prev;
    });
  };

  const setUserName = (arg) => {
    setSearch((prev) => {
      prev.set('userName', arg);
      return prev;
    });
  };

  const setConclusion = (arg) => {
    setSearch((prev) => {
      prev.set('conclusion', arg);
      return prev;
    });
  };

  const setAccessKey = (arg) => {
    setSearch((prev) => {
      prev.set('accessKey', arg);
      return prev;
    });
  };

  const setSelectedService = (arg) => {
    setSearch((prev) => {
      prev.set('service', arg);
      return prev;
    });
  };

  const setSelectedOrganization = (arg: string | 'default') => {
    setSearch((prev) => {
      prev.set('selectedOrganization', arg);
      return prev;
    });
  };

  const setSelectedCollection = (arg: string | 'default') => {
    setSearch((prev) => {
      prev.set('selected', arg);
      return prev;
    });
  };

  const setSelectedRepo = (arg) => {
    setSearch((prev) => {
      prev.set('selectedRepo', arg);
      return prev;
    });
  };

  const setCurrentStep = (newCurrent: number) => {
    setSearch((prev) => {
      prev.set('current', newCurrent.toString());
      return prev;
    });
  };

  const setSelectedBranch = (newBranch: string) => {
    setSearch((prev) => {
      prev.set('selectedBranch', newBranch.toString());
      return prev;
    });
  };
  const setSelectedPullReq = (newPullrequest: string) => {
    setSearch((prev) => {
      prev.set('selectedPullReq', newPullrequest.toString());
      return prev;
    });
  };

  const setSelectedCommit = (newCommit: string) => {
    setSearch((prev) => {
      prev.set('selectedCommit', newCommit.toString());
      return prev;
    });
  };

  const setDomain = (domain: DomainTypes) => {
    setSearch((prev) => {
      return {
        domain, current: '0',
        organization: prev.get('organization'),
        userName: prev.get('userName'),
        appTitle: prev.get('appTitle'),
        accessKey: prev.get('accessKey') ?? '',
      }
    });
  }

  const setAppTitle = (newCommit: string) => {
    setSearch((prev) => {
      prev.set('appTitle', newCommit.toString());
      return prev;
    });
  };

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
    setUserName,
    setAppTitle,
    setSelectedPullReq,
    setSelectedCommit,
    setSelectedCollection,
    organization: search.get('organization'),
    userName: search.get('userName'),
    accessKey: search.get('accessKey'),
    appTitle: search.get('appTitle'),
    selectedCommit: search.get('selectedCommit'),
    selectedPullReq: search.get('selectedPullReq'),
    selectedBranch: search.get('selectedBranch'),
    conclusion: search.get('conclusion'),
    selectedService: search.get('service'),
    selectedRepo: search.get('selectedRepo'),
    current: +search.get('current'),
    selectedOrganization: search.get('selectedOrganization'),
    integration: search.get('integration')
      ? JSON.parse(search.get('integration'))
      : undefined,
    domain: search.get('domain') as any,
    ...value,
  };

  return <AppContext.Provider value={contextValues} children={children} />;
}
