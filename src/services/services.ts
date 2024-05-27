import { AxiosHeaders } from 'axios';
import { Payload as CreateIntegrationType } from '../containers/scm/selectService/types';
import fetch from '../utils/API/fetchInstance';
import { DomainTypes } from '../types/type';

/* set accessKey */
export const setAccessKey = async (key: string) => {
	return await fetch.post('/api/demo/apiKey', { key });
};

/* get services */
type QueryParams = {
	type: DomainTypes;
	state: 'ACTIVE' | 'INACTIVE';
};
export const getServices = async (
	params: QueryParams,
	headers: { [key: string]: string }
) => {
	return await fetch.get('/api/demo/services', {
		headers,
		params: { ...params },
	});
};

/* create integrations */
export const createIntegrations = async (payload: CreateIntegrationType) => {
	return fetch.post('/api/demo/integrations', payload);
};

/* get all organization */
export const getSCMOrganization = async (headers: AxiosHeaders, type) => {
	return await fetch.get(`/api/demo/${type}/organizations`, { headers });
};

/* get all repositories for the organization */
export const getRepo = async (
	organizationId: string,
	headers: { [key: string]: string }
) => {
	return await fetch.get(
		`/api/demo/scm/organizations/${organizationId}/repositories`,
		{ headers }
	);
};

/* get all branches from the repositories */
export const getAllBranches = async (
	organizationId: string,
	headers: { [key: string]: string },
	repoId: string
) => {
	return await fetch.get(
		`/api/demo/scm/organizations/${organizationId}/repositories/${repoId}/branches`,
		{ headers }
	);
};

/* get all commits for the repositories */
export const getAllCommit = async (
	headers: { [key: string]: string },
	organizationId: string,
	repoId: string
) => {
	return await fetch.get(
		`/api/demo/scm/organizations/${organizationId}/repositories/${repoId}/commits`,
		{ headers }
	);
};

/* get all pull request for repositories  */
export const getAllPullRequest = async (
	headers: { [key: string]: string },
	organizationId: string,
	repoId: string
) => {
	return await fetch.get(
		`/api/demo/scm/organizations/${organizationId}/repositories/${repoId}/pullRequest`,
		{ headers }
	);
};

type RepositoryDownloadType = {
	orgId: string;
	repoId: string;
};
/* download the branch, repo, pullRequest  */
export const repositoryDownload = async (
	props: RepositoryDownloadType,
	headers: { [key: string]: string }
) => {
	return await fetch.get(
		`/api/demo/scm/organizations/${props.orgId}/repositories/${props.repoId}`,
		{ headers }
	);
};

type BranchDownloadType = {
	orgId: string;
	repoId: string;
	branch: string;
};
/* download the branch  */
export const branchDownload = async (
	args: BranchDownloadType,
	headers: { [key: string]: string }
) => {
	return await fetch.get(
		`api/demo/scm/organizations/${args.orgId}/repositories/${args.repoId}/branches/${args.branch}`,
		{ headers }
	);
};

export const createWatch = async (
	payload: { [key: string]: unknown },
	integrationId: string
) => {
	return await fetch.post(
		`/api/demo/integrations/${integrationId}/watches`,
		payload
	);
};


/* Get all Ticketing */
export const getAllCollection = async (
	organizationId: string,
	headers: { [key: string]: string }
) => {
	return await fetch.get(
		`/api/demo/ticketing/${organizationId}/collections`,
		{ headers }
	);
};

export const getAllTickets = async (
	organizationId: string,
	collectionId: string,
	headers: { [key: string]: string }
) => {
	return await fetch.get(
		`/api/demo/ticketing/${organizationId}/collections/${collectionId}/tickets`,
		{ headers }
	);
};

export const createTickets = async (
	payload: { [key: string]: any },
	headers: { [key: string]: any },
	orgId: string,
	collectionId: string
) => {
	return await fetch.post(`/api/demo/ticketing/${orgId}/collections/${collectionId}/tickets`, payload, { headers })
}