import { AxiosHeaders } from 'axios';
import { Payload as CreateIntegrationType } from '../containers/scm/selectService/types';
import fetch from '../utils/API/fetchInstance';


/* get services */
export const getServices = async (payload: { [key: string]: unknown }, headers: { [key: string]: string }) => {
      return await fetch.post('/api/v1/services/search', payload, { headers: headers })
}

/* create integrations */
export const createIntegrations = async (payload: CreateIntegrationType) => {
      return fetch.post('/api/v1/integrations', payload)
}

/* get all organization */
export const getSCMOrganization = async (headers: AxiosHeaders) => {
      return await fetch.get('/api/v1/scm/organizations ', { headers })
}

/* get all repositories for the organization */
export const getRepo = async (organizationId: string, headers: { [key: string]: string }) => {
      return await fetch.get(`/api/v1/scm/organizations/${organizationId}/repositories`, { headers })
}

/* get all branches from the repositories */
export const getAllBranches = async (organizationId: string, headers: { [key: string]: string }) => {
      return await fetch.get(`api/v1/scm/organizations/${organizationId}/repositories/demo-repository`, { headers })
}

/* get all commits for the repositories */
export const getAllCommit = async (headers: { [key: string]: string }) => {
      return await fetch.get('/api/v1/scm/organizations/EQ-IPaaS/repositories/identity-manager-service/commits', { headers })
}

/* get all pull request for repositories  */
export const getAllPullRequest = async (headers: { [key: string]: string }) => {
      return await fetch.post('/api/v1/scm/organizations/Equiwiz/repositories/identity-manager-service/pullRequest', { headers })
}

/* download the branch, repo, pullRequest  */
export const downloadCodeBase = async (payload: { [key: string]: unknown }) => {
      return await fetch.post('/api/v1/services/search', payload)
}

export const createWatch = async (payload: { [key: string]: unknown }, integrationId: string) => {
      return await fetch.post(`api/v1/integrations/${integrationId}/watches`, payload)
}