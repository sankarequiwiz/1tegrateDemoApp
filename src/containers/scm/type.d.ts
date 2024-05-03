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