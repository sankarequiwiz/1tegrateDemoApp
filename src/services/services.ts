import { Payload as CreateIntegrationType } from '../containers/scm/selectService/types';
import fetch from '../utils/API/fetchInstance';


export const getServices = async (payload: { [key: string]: unknown }) => {
      return await fetch.post('/api/v1/services/search', payload)
}

export const getRepo= async ()=>{
      return await fetch.get('/api/v1/scm/organizations/EQ-IPaaS/repositories/shared-services-api')
}

export const createIntegrations = async (payload: CreateIntegrationType) => {
      console.log(payload)
      return {
            data: {
                  "href": "http://api.1tegrate.com/api/v1/integrations/5de61048-b2f3-4500-9129-991730b47ddd",
                  "type": "SCM",
                  "id": "5de61048-b2f3-4500-9129-991730b47ddd",
                  "externalKey": "p029p094-32d0-4960-a447-48be5fa98e18",
                  "name": "Google-gitlab-integration",
                  "state": "ACTIVE",
                  "source": {
                        "accessPoint": {
                              "type": "ORG",
                              "organization": {
                                    "href": "http://api.platform.com/api/v1/organizations/5a4b607c-cb0a-4f67-91d8-c1427ff1080a",
                                    "type": "STANDARD",
                                    "id": "5a4b607c-cb0a-4f67-91d8-c1427ff1080a",
                                    "name": "Equiwiz"
                              }
                        }
                  },
                  "target": {
                        "accessPoint": {
                              "type": "SP",
                              "serviceProfile": {
                                    "href": "http://api.platform.com/api/v1/serviceProfiles/7ae4ae78-7e98-4995-9e16-547983871d38",
                                    "type": "SCM",
                                    "id": "7ae4ae78-7e98-4995-9e16-547983871d38",
                                    "name": "Github",
                                    "image": {
                                          "original": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x",
                                          "xSmall": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x",
                                          "small": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x",
                                          "medium": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x",
                                          "large": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x"
                                    }
                              },
                              "accessPointConfig": {
                                    "type": "APIKEY_FLW"
                              },
                              "emailAddress": "test@someone.com",
                              "apiKey": "yQQiMMdFgMySginBm5-5"
                        }
                  },
                  "operation": {
                        "1tegrateStatus": "PROVISIONED",
                        "providerStatus": "AVAILABLE"
                  },
                  "notifications": [],
                  "tags": [],
                  "attributes": [],
                  "organization": {
                        "href": "http://api.platform.com/api/v1/organizations/5a4b607c-cb0a-4f67-91d8-c1427ff1080a",
                        "type": "STANDARD",
                        "id": "5a4b607c-cb0a-4f67-91d8-c1427ff1080a",
                        "name": "Equiwiz"
                  },
                  "serviceProfile": {
                        "href": "http://api.platform.com/api/v1/serviceProfiles/7ae4ae78-7e98-4995-9e16-547983871d38",
                        "type": "SCM",
                        "id": "7ae4ae78-7e98-4995-9e16-547983871d38",
                        "name": "Github",
                        "image": {
                              "original": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x",
                              "xSmall": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x",
                              "small": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x",
                              "medium": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x",
                              "large": "https://gravatar.com/avatar/d86afe36842f05cba1c7648357370b0b?s=400&d=robohash&r=x"
                        }
                  },
                  "subOrganization": {
                        "name": "Phonepe Inc",
                        "externalKey": "l946c690-32d0-4960-a447-48fe4fa9fd43"
                  },
                  "changeRequest": {
                        "type": "CREATE_REQUEST",
                        "description": "changerequest.desc.create-request",
                        "status": "IN_PROGRESS"
                  },
                  "changeLog": {
                        "createdDateTime": "2024-04-19T12:29:29.620+00:00",
                        "lastUpdatedDateTime": "2024-04-19T12:29:29.620+00:00"
                  },
                  "links": []
            }
      }
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