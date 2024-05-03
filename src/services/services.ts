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

export const getRepo = async () => {
      return await fetch.get('/api/v1/scm/organizations/EQ-IPaaS/repositories/shared-services-api')
}

export const getOrganization = async (payload: { [key: string]: unknown }) => {
      return await fetch.post('/api/v1/services/search', payload)
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