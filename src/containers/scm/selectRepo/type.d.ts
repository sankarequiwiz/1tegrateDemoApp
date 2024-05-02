export type ReposTypes = {
    id: number,
    fullName: string,
    language: string,
    size: string,
    archived: boolean,
    owner:string,
    private: string,
    url: string,
    description: string,
    organization: string,
    default_branch: master,
    created_at: Date,
    updated_at: Date,
    native_response: {
          id: number,
          description: string,
          name: string,
          name_with_namespace:string,
          path: string,
          path_with_namespace: string,
          created_at: Date,
          default_branch: string,
          tag_list: Array,
          topics: [],
          ssh_url_to_repo: string,
          http_url_to_repo: string,
          web_url: string,
          readme_url: string,
          forks_count: string,
          avatar_url: string,
          star_count: string,
          last_activity_at: Date,
          namespace: {
                id: string,
                name: string,
                path: string,
                kind: string,
                full_path: string,
                parent_id: string,
                avatar_url: string,
                web_url: number
          },
          container_registry_image_prefix: string,
          _links: {
                self: string,
                issues: string,
                merge_requests: string,
                repo_branches: string,
                labels: string,
                events: string,
                members: string,
                cluster_agents: string
          },
          packages_enabled: boolean,
          empty_repo: false,
          archived: false,
          visibility: public,
          resolve_outdated_diff_discussions: false,
          container_expiration_policy: {
                cadence: string,
                enabled: false,
                keep_n: number,
                older_than: string,
                name_regex: string,
                name_regex_keep: string,
                next_run_at: Date
          },
          repository_object_format: sha1,
          issues_enabled: true,
          merge_requests_enabled: true,
          wiki_enabled: true,
          jobs_enabled: true,
          snippets_enabled: true,
          container_registry_enabled: true,
          service_desk_enabled: false,
          can_create_merge_request_in: true,
          issues_access_level: enabled,
          repository_access_level: enabled,
          merge_requests_access_level: enabled,
          forking_access_level: enabled,
          wiki_access_level: enabled,
          builds_access_level: enabled,
          snippets_access_level: enabled,
          pages_access_level: string,
          analytics_access_level: enabled,
          container_registry_access_level: enabled,
          security_and_compliance_access_level: string,
          releases_access_level: enabled,
          environments_access_level: enabled,
          feature_flags_access_level: enabled,
          infrastructure_access_level: enabled,
          monitor_access_level: enabled,
          model_experiments_access_level: enabled,
          model_registry_access_level: enabled,
          emails_disabled: false,
          emails_enabled: true,
          shared_runners_enabled: true,
          lfs_enabled: true,
          creator_id: 20454219,
          import_status: string,
          open_issues_count: 0,
          description_html: string,
          updated_at: string,
          ci_config_path: string,
          public_jobs: true,
          shared_with_groups: [],
          only_allow_merge_if_pipeline_succeeds: false,
          allow_merge_on_skipped_pipeline: string,
          request_access_enabled: true,
          only_allow_merge_if_all_discussions_are_resolved: false,
          remove_source_branch_after_merge: true,
          printing_merge_request_link_enabled: true,
          merge_method: merge,
          squash_option: default_off,
          enforce_auth_checks_on_uploads: true,
          suggestion_commit_message: string,
          merge_commit_template: string,
          squash_commit_template: string,
          issue_branch_template: string,
          warn_about_potentially_unwanted_characters: true,
          autoclose_referenced_issues: true,
          approvals_before_merge: 0,
          mirror: false,
          external_authorization_classification_label: string,
          marked_for_deletion_at: string,
          marked_for_deletion_on: string,
          requirements_enabled: true,
          requirements_access_level: enabled,
          security_and_compliance_enabled: false,
          compliance_frameworks: [],
          issues_template: string,
          merge_requests_template: string,
          merge_pipelines_enabled: false,
          merge_trains_enabled: false,
          merge_trains_skip_train_allowed: false,
          only_allow_merge_if_all_status_checks_passed: false,
          allow_pipeline_trigger_approve_deployment: false,
          prevent_merge_without_jira_issue: false,
          permissions: {
                project_access: string,
                group_access: string
          }
    },
    change_log: string
}