export type AccessPointConfigsTypes = {
  type: string;
  label: string;
  recommended: boolean;
  isBeta: boolean;
  apiConfig: {
    workflowKey: string;
  };
  assistanceInfo: {
    processSteps: [
      {
        title: string;
        subTitle: string;
        description: string;
      },
    ];
  };
  links: [
    {
      rel: string;
      href: string;
      method: string;
      contentType: string;
      authenticate: boolean;
    },
  ];
  fieldTypeConfigs: [
    {
      type: string;
      label: string;
      name: string;
      required: boolean;
      property: string
    },
  ];
};

type ServiceTypes = {
  href: string;
  type: string;
  id: string;
  state: string;
  serviceProfile: {
    href: string;
    type: string;
    id: string;
    name: string;
    description: string;
    state: string;
    visibility: string;
    image: { [key: string]: string };
    accessPointConfigs: Array<AccessPointConfigsTypes>;
    notifications: [];
    tags: [];
    attributes: [];
    organization: {
      href: string;
      type: string;
      id: string;
      name: string;
    };
    changeLog: {
      createdDateTime: string;
      lastUpdatedDateTime: string;
    };
    links: [];
  };
  notifications: [];
  attributes: [];
  tags: [];
  changeLog: {
    createdDateTime: string;
    lastUpdatedDateTime: string;
  };
  links: [];
};

export type ServiceProfileDataTypes = {
  href: string;
  type: string;
  id: string;
  name: string;
  description: string;
  state: string;
  image: Image;
  visibility: string;
  accessPointConfigs?: Array<AccessPointConfigsTypes>;
  notifications?: [];
  tags?: [];
  attributes?: [];
  links?: [];
  organization?: CommonDataType;
  changeLog?: ChangeLogType;
};

type Payload = {
  name: string;
  type: 'SCM' | 'TICKETING'|'PCR'|'COMMS',
  externalKey?: string;
  subOrganization: {
    name: string;
    externalKey?: string;
  };
  target: {
    accessPoint: {
      type: 'SP';
      serviceProfile: {
        id: string;
      };
      accessPointConfig: {
        type: 'APIKEY_FLW' | 'EMAIL' | 'OAUTH_PASSWORD_FLW';
      };
      emailAddress?: string;
      apiKey: string;
    };
  };
};
