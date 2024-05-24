export type OrganizationTypes = {
  id: string;
  login: string;
  url: string;
  avatar_url: string;
  description: string;
  type: string;
  two_factor_requirement_enabled: string;
  members_can_create_public_repositories: string;
  created_at: string;
  updated_at: string;
  isLoading?: boolean;
  native_response: {
    login: string;
    id: number;
    node_id: string;
    url: string;
    repos_url: string;
    events_url: string;
    hooks_url: string;
    issues_url: string;
    members_url: string;
    public_members_url: string;
    avatar_url: string;
    description: string;
  };
};

export type Payload = {
  name?: string;
  description?: string;
  type: 'HOOK';
  resource: {
    type: 'ORGANIZATION' | 'REPOSITORY';
    organization: {
      id: string;
    };
    repository?: {
      id: string;
    };
  };
};
