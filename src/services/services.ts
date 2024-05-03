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

export const getRepo = async (organizationId: string, headers: { [key: string]: string }) => {
      return await fetch.get(`/api/v1/scm/organizations/${organizationId}/repositories`, { headers })
}

export const getAllBranches = async (payload: { [key: string]: unknown }) => {
      return await fetch.post('/api/v1/services/search', payload)
}
export const getAllPullRequest = async (payload: { [key: string]: unknown }) => {
      return await fetch.post('/api/v1/services/search', payload)
}
export const getAllCommit = async (payload: { [key: string]: unknown }) => {
      return await fetch.post('/api/v1/services/search', payload)
}

export const downloadBranch = async (payload: { [key: string]: unknown }) => {
      return await fetch.post('/api/v1/services/search', payload)
}

export const createWatch = async (payload: { [key: string]: unknown }, integrationId: string) => {
      return await fetch.post(`api/v1/integrations/${integrationId}/watches`, payload)
}