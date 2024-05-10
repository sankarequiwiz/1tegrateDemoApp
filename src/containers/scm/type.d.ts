export type BranchTypes = {
      id: string,
      name: string,
      author_name: string,
      committer_name: string,
      sha: string,
      url: string,
      enabled: string,
      authored_date: string,
      committer_date: string,
      isLoading?: boolean;
      native_response?: { [key: string]: unknown }
}

export type PullRequestTypes ={
      id: string,
      creator: string,
      name: string,
      title: string,
      description: string,
      url: string,
      node_id: string,
      htmlurl?: string,
      htmlUrl?: string,
      native_response?: { [key: string]: unknown }
}

export type CommitTypes ={
            id: string,
            url: string,
            author: {
                name: string,
                email: string,
                date: string,
                type: string,
                url: string,
                id: string,
                login: string,
                site_admin: boolean,
                received_events_url: string,
                events_url:string,
                repos_url: string,
                organizations_url:string,
                subscriptions_url: string,
                starred_url: string,
                gists_url:string,
                following_url: string,
                followers_url: string,
                html_url:string,
                gravatar_id: string,
                avatar_url: string,
                node_id: string,
            },
            committer: {
                name: string,
                email: string,
                date: string,
                type: string,
                url:string,
                id: string,
                login: string,
                site_admin: boolean,
                received_events_url: string,
                events_url: string,
                repos_url: string,
                organizations_url: string,
                subscriptions_url:string,
                starred_url: string,
                gists_url: string,
                following_url: string,
                followers_url: string,
                html_url: string,
                gravatar_id:string,
                avatar_url:string,
                node_id: string,
            },
            parents: [
                {
                    sha: string,
                    url: string,
                    htmlUrl: string,
                },
                {
                    sha: string,
                    url: string,
                    htmlUrl: string
                }
            ],
            sha: string
}