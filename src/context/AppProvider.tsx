import React, { useContext } from 'react';
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
  selectedArtifact?: string;
  conclusion?: string;
  selectedBranch?: string;
  userName?: string;
  selectedPullReq?: string;
  selectedCommit?: string;
  appTitle?: string;
  selectedCollection?: string;
  redirectModalOpen?: boolean
  accessPointModalOpen?: boolean
  integration?: ServiceTypes;
  isIntegrationFailed?: boolean;
  selectedPR?:string;
  integrationId?: string;

  // to
  companykey?: string;
  setCompanykey?: (companyKey: string) => void;
  setIntegrationId?: (integrationId: string) => void;

  setIsIntegrationFailed?: (isFailed: boolean) => void;
  setAccessPointModalOpen?: (isOpen: boolean) => void
  setRedirectModalOpen?: (isOpen: boolean) => void
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
  setSelectedArtifact?: (selectedOrganization: string) => void;
  setCurrentStep?: (newCurrent: number) => void;
  setOrganization?: React.Dispatch<React.SetStateAction<string>>;
  setDomain?: React.Dispatch<React.SetStateAction<DomainTypes>>;
  setIntegration?: (serviceProfileTypes: ServiceTypes) => void;
  setSelectedCollection?: (collection: string) => void;
  setSelectedPR?:(selectedPR:string) =>void
};

type ProviderTypes = {
  children: React.ReactNode;
  value?: ContextTypes;
};

export function AppProvider({ children, value }: ProviderTypes) {

  const [search, setSearch] = useSearchParams({
    current: '0',
    accessKey: '',
    userName: 'Info Sec Engineer',
    organization: 'Secure Bank, Inc',
    appTitle: 'App Sec Saas',
    domain: 'SCM',
    redirectModalOpen: 'false',
    accessPointModalOpen: 'false',
    isIntegrationFailed: 'false',
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
      prev.set('selectedCollection', arg);
      return prev;
    });
  };

  const setSelectedRepo = (arg) => {
    setSearch((prev) => {
      prev.set('selectedRepo', arg);
      return prev;
    });
  };

  const setSelectedArtifact = (arg) => {
    setSearch((prev) => {
      prev.set('selectedArtifact', arg);
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

  const setSelectedPR = (selectedPR: string) => {
    setSearch((prev) => {
      prev.set('selectedCommit', selectedPR.toString());
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

  const setCompanykey = (newCommit: string) => {
    setSearch((prev) => {
      prev.set('companyKey', newCommit.toString());
      return prev;
    });
  };

  const setRedirectModalOpen = (isOpen: boolean) => {
    setSearch((prev) => {
      prev.set('redirectModalOpen', isOpen.toString());
      return prev;
    })
  }

  const setAccessPointModalOpen = (isOpen: boolean) => {
    setSearch((prev) => {
      prev.set('accessPointModalOpen', isOpen.toString());
      return prev;
    })
  }

  const setIsIntegrationFailed = (isFailed: boolean) => {
    setSearch((prev) => {
      prev.set('isIntegrationFailed', isFailed?.toString());

      return prev;
    })
  }

  const setIntegrationId = (id: string) => {
    setSearch((prev) => {
      prev.set('integrationId', id);
      return prev;
    })
  }

  // http://localhost:6101/api/demo/services/7f0830d4-c917-49de-9a75-378a3737cd62/buildInstallationFormUrl?successUrl=http:%2F%2Flocalhost:5173%2F%3Fcurrent%3D1%26accessKey%3D3wsIKETURE0K7bcJR3AqPQTK7ziTiW4h%26userName%3DDemo%2Bapp%2BUser%26organization%3DDemo%2Bapp%2BCompany%26appTitle%3DDemo%2Bapp%2BTitle%26domain%3DSCM%26redirectModalOpen%3Dtrue%26accessPointModalOpen%3Dfalse%26isIntegrationFailed%3Dfalse%26service%3D7f0830d4-c917-49de-9a75-378a3737cd62&failureUrl=http:%2F%2Flocalhost:5173%2F%3Fcurrent%3D0%26accessKey%3D3wsIKETURE0K7bcJR3AqPQTK7ziTiW4h%26userName%3DDemo%2Bapp%2BUser%26organization%3DDemo%2Bapp%2BCompany%26appTitle%3DDemo%2Bapp%2BTitle%26domain%3DSCM%26redirectModalOpen%3Dtrue%26accessPointModalOpen%3Dfalse%26isIntegrationFailed%3Dfalse%26service%3D7f0830d4-c917-49de-9a75-378a3737cd62

  const contextValues: ContextTypes = {
    setAccessKey,
    setDomain,
    setIntegration: setIntegrationDetails,
    setOrganization,
    setCurrentStep,
    setSelectedService,
    setSelectedOrganization,
    setSelectedRepo,
    setSelectedPR,
    setSelectedArtifact,
    setConclusion,
    setSelectedBranch,
    setUserName,
    setAppTitle,
    setCompanykey,
    setSelectedPullReq,
    setSelectedCommit,
    setSelectedCollection,
    setRedirectModalOpen,
    setAccessPointModalOpen,
    setIsIntegrationFailed,
    setIntegrationId,

    integrationId: search.get('integrationId'),
    isIntegrationFailed: JSON.parse(search.get('isIntegrationFailed')),
    redirectModalOpen: JSON.parse(search.get('redirectModalOpen')),
    accessPointModalOpen: JSON.parse(search.get('accessPointModalOpen')),
    organization: search.get('organization'),
    userName: search.get('userName'),
    companykey: search.get('companyKey'),
    accessKey: search.get('accessKey'),
    appTitle: search.get('appTitle'),
    selectedArtifact: search.get("selectedArtifact"),
    selectedCommit: search.get('selectedCommit'),
    selectedPR:search.get('selectedPR'),
    selectedPullReq: search.get('selectedPullReq'),
    selectedBranch: search.get('selectedBranch'),
    conclusion: search.get('conclusion'),
    selectedService: search.get('service'),
    selectedRepo: search.get('selectedRepo'),
    current: +search.get('current'),
    selectedOrganization: search.get('selectedOrganization'),
    selectedCollection: search.get('selectedCollection'),
    integration: search.get('integration')
      ? JSON.parse(search.get('integration'))
      : undefined,
    domain: search.get('domain') as any,
    ...value,
  };

  return <AppContext.Provider value={contextValues} children={children} />;
}


export const useAppProvider = () => {
  try {
    return useContext(AppContext)
  } catch (error) {
    console.error('useAppProvider must be within AppProvider')
  }
}