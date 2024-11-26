import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { Payload as CreateIntegrationType } from '../containers/scm/selectService/types';
import fetch from '../utils/API/fetchInstance';
import { DomainTypes } from '../types/type';

const withLowerCase = (str: string = "") => {
	return str.toLowerCase();
};
/* set accessKey */
export const setAccessKey = async (key: string) => {
	return await fetch.post('/api/demo/apiKey', { key });
};

/* set accessKey */
export const getAccessKey = async () => {
	return await fetch.get('/api/demo/apiKey');
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

export const getServiceAccessType = async (id: string) => {
	return await fetch.get(`/api/demo/services/${id}/accessPoints?customerView=true`)
}

export const buildInstallationFormUrl = async (serviceId: string, options: AxiosRequestConfig<any>) => {
	return fetch({
		url: `/api/demo/services/${serviceId}/buildInstallationFormUrl`,
		...options
	})
}

/* create integrations */
export const createIntegrations = async (payload: CreateIntegrationType) => {
	return fetch.post('/api/demo/integrations', payload);
};

export const getIntegrationById = async (id: string) => {
	return fetch.get(`/api/demo/integrations/${id}`);
};

/* test integrations */
export const testIntegrations = async (payload: { [key: string]: any }) => {
	return fetch.post('/api/demo/integrations/validate', payload);
};

/*get all versions */
export const getSelfManaged = async (spId: string) => {
	return await fetch.get(`/api/demo/serviceProfiles/${spId}/versions`)
}

/* get all organization */
export const getSCMOrganization = async (headers: AxiosHeaders, type) => {
	return await fetch.get(`/api/demo/${withLowerCase(type)}/organizations`, { headers });
};

/* get all repositories for the organization */
export const getRepo = async (
	organizationId: string,
	headers: { [key: string]: string },
	type
) => {
	return await fetch.get(
		`/api/demo/${withLowerCase(type)}/organizations/${organizationId}/repositories`,
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
		`/api/demo/scm/organizations/${organizationId}/repositories/${repoId}/pullRequests`,
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

export const getTicket = async (id: string, orgId: string, collectionId: string, headers: { [key: string]: any }) => {
	return await fetch.get(`/api/demo/ticketing/${orgId}/collections/${collectionId}/tickets/${id}`, { headers })
}

export const editTickets = async (
	payload: { [key: string]: any },
	headers: { [key: string]: any },
	orgId: string,
	collections: string,
	ticketId: string
) => {
	return await fetch.put(`/api/demo/ticketing/${orgId}/collections/${collections}/tickets/${ticketId}`, payload, { headers })
}

export const metaDataConfig = async (orgId: string, collectionId: string, payload: { [key: string]: any }, headers: { [key: string]: any }) => {
	return await fetch.post(`/api/demo/ticketing/${orgId}/collections/${collectionId}/tickets/metadataConfig`, payload, { headers })
}

//pull Request

export const createPullrequest = async (
	payload: { [key: string]: any },
	headers: { [key: string]: any },
	orgId: string,
	repoId: string
) => {
	return await fetch.post(`/api/demo/scm/organizations/${orgId}/repositories/${repoId}/pullRequests`, payload, { headers })
}

export const editPullrequest = async (
	payload: { [key: string]: any },
	headers: { [key: string]: any },
	orgId: string,
	repoId: string,
	pullrequestId:string
) => {
	return await fetch.put(`/api/demo/scm/organizations/${orgId}/repositories/${repoId}/pullRequests/${pullrequestId}`, payload, { headers })
}
export const PRmetaDataConfig = async (orgId: string, repoId: string, payload: { [key: string]: any }, headers: { [key: string]: any }) => {
	return await fetch.post(`/api/demo/scm/organizations/${orgId}/repositories/${repoId}/pullRequests/metadataConfig`, payload, { headers })
}

// export const PRmetaDataConfig = async (
// 	payload: { [key: string]: any },
// 	headers: { [key: string]: any },
// 	orgId: string,
// 	repoId: string
// ) => {
// 	return await fetch.post(`/api/demo/scm/organizations/${orgId}/repositories/${repoId}/pullRequests/metadataConfig`, payload, { headers })
// }

//pcr APi calls

export const getSCMOrganizationPcr = async (headers: AxiosHeaders, type) => {
	return await fetch.get(`/api/demo/${withLowerCase(type)}/organizations`, { headers });
};


export const getRepoPcr = async (
	organizationId: string,
	headers: { [key: string]: string },
	type
) => {
	return await fetch.get(
		`/api/demo/${withLowerCase(type)}/${organizationId}/repositories`,
		{ headers }
	);
};


export const getAllArtifact = async (
	organizationId: string,
	headers: { [key: string]: string },
	repoId: string,
	type
) => {
	return await fetch.get(
		`/api/demo/${withLowerCase(type)}/${organizationId}/repositories/${repoId}/artifacts`,
		{ headers }
	);
};


export const getAllTags = async (
	organizationId: string,
	headers: { [key: string]: string },
	repoId: string,
	artifactId: string,
	type
) => {
	return await fetch.get(
		`/api/demo/${withLowerCase(type)}/${organizationId}/repositories/${repoId}/artifacts/${artifactId}/tags`,
		{ headers }
	);
};

//Comms APi calls

export const getChannels = async (
	organizationId: string,
	headers: { [key: string]: string },
	type
) => {
	return await fetch.get(
		`/api/demo/${withLowerCase(type)}/${organizationId}/channels`,
		{ headers }
	);
};


export const metaDataConfigComms = async (orgId: string, channelsId: string, payload: { [key: string]: any }, headers: { [key: string]: any }) => {
	return await fetch.post(`/api/demo/comms/${orgId}/channels/${channelsId}/messages/metadataConfig`, payload, { headers })
}

export const sendMessages = async (
	payload: { [key: string]: any },
	headers: { [key: string]: any },
	orgId: string,
	channelsId: string,
) => {
	return await fetch.post(`/api/demo/comms/${orgId}/channels/${channelsId}/messages`, payload, { headers })
}


//Incident Api calls
export const getServicesOpsigine = async (
	organizationId: string,
	headers: { [key: string]: string },
	type
) => {
	return await fetch.get(
		`/api/demo/${withLowerCase(type)}/${organizationId}/services`,
		{ headers }
	);
};

export const getTeamsOpsigine = async (
	organizationId: string,
	serviceId: string,
	headers: { [key: string]: string },
	type
) => {
	return await fetch.get(
		`/api/demo/${withLowerCase(type)}/${organizationId}/services/${serviceId}/teams`,
		{ headers }
	);
};


export const getIncidentOpsigine = async (
	organizationId: string,
	serviceId: string,
	teamId: string,
	headers: { [key: string]: string },
	type
) => {
	return await fetch.get(
		`/api/demo/${withLowerCase(type)}/${organizationId}/services/${serviceId}/teams/${teamId}/incidents`,
		{ headers }
	);
};


//vulnerability Api calls


export const getAllvulnerability = async (
	headers: { [key: string]: string }
) => {
	return await fetch.get(
		`/api/demo/vulnerability/test/vulnerabilities`,
		{ headers }
	);
};
