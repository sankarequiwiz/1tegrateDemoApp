import React, { LegacyRef } from "react";

import { Button, Card, Typography, Divider } from "antd";
import { CardProps } from "antd/es/card";

import { Gitlab } from '../../../components/icons/providers/gitlab';
import { Github } from '../../../components/icons/providers/github';
import { Servicenow } from '../../../components/icons/providers/servicenow';
import { Bitbucket } from '../../../components/icons/providers/bitbucket';
import { ADO } from '../../../components/icons/providers/ado';
import { Jira } from '../../../components/icons/providers/jira';
import { Salesforce } from '../../../components/icons/providers/salesforce';
import { ServiceTypes } from "./types";
import { Trello } from "../../../components/icons/providers/trello";
import { GoogleArtifact } from "../../../components/icons/providers/googleartifact";
import { DockerHub } from "../../../components/icons/providers/dockerhub";
import { Jfrog } from "../../../components/icons/providers/jfrogartifactory";
import { Nuxus } from "../../../components/icons/providers/nexus";
import { Microsoft } from "../../../components/icons/providers/microsoftacr";
import { AmazonECR } from "../../../components/icons/providers/amazonecr";
import { Teams } from "../../../components/icons/providers/teams";
import { GoogleChat } from "../../../components/icons/providers/googlechat";
import { Slack } from "../../../components/icons/providers/slack";
import { Opsgenie } from "../../../components/icons/providers/opsgenie";
import { Pagerduty } from "../../../components/icons/providers/pagerduty";

type CustomCardProps = {
   onSelectProvider?: () => void
   selected?: boolean
   item: ServiceTypes
} & CardProps

export const ProviderCard = React.forwardRef((props: CustomCardProps, ref: LegacyRef<HTMLDivElement>) => {
   const { item, onSelectProvider, selected, ...rest } = props;

   const getLogo = React.useCallback((name: string) => {
      name = name?.toLowerCase();
      if (name.startsWith('github')) {
         return <Github />;
      } else if (name.startsWith('jira')) {
         return <Jira />
      } else if (name.startsWith('servicenow')) {
         return <Servicenow />
      }
      else if (name.startsWith('gitlab')) {
         return <Gitlab />;
      } else if (name.startsWith('bitbucket')) {
         return <Bitbucket />;
      } else if (name.startsWith('ado')) {
         return <ADO />;
      } else if (name.startsWith('trello')) {
         return <Trello />
      } else if (name.startsWith('salesforce')) {
         return <Salesforce />
      }else if (name.startsWith('google')) {
         return <GoogleArtifact />
      }else if (name.startsWith('docker')) {
         return <DockerHub />
      }else if (name.startsWith('jfrog')) {
         return <Jfrog />
      }else if (name.startsWith('nexus')) {
         return <Nuxus />
      }else if (name.startsWith('microsoft')) {
         return <Microsoft />
      }else if (name.startsWith('amazon')) {
         return <AmazonECR />
      }else if (name.startsWith('slack')) {
         return <Slack />
      }else if (name.startsWith('teams')) {
         return <Teams />
      }else if (name.startsWith('googlechat')) {
         return <GoogleChat />
      }else if (name.startsWith('opsgenie')) {
         return <Opsgenie />
      }else if (name.startsWith('pagerduty')) {
         return <Pagerduty />
      }
      
   }, [item]);

   return (
      <Card
         style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", maxWidth:"18rem !important"}}
         bordered
         rootClassName="card"
         ref={ref}
         {...rest as CardProps}
      >
         <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div>
               {getLogo(item?.serviceProfile?.name)}
            </div>
            <div>
               {item?.serviceProfile?.name && (
                  <Typography.Title level={5}>
                     {item?.serviceProfile?.name}
                  </Typography.Title>
               )}
            </div>
         </div>
         <Divider style={{ margin: '0 .5rem', border: '0.1px solid #e2e8f0' }} />
         <div style={{ textAlign: "center" }}>
            <Button type="link" style={{ fontSize: "15px" }} onClick={onSelectProvider as any}  >
               {selected ? "Selected" : 'Select'}
            </Button>
         </div>
      </Card>

   )
})