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
import { AppContext } from "../../../context/AppProvider";
import { Trello } from "../../../components/icons/providers/trello";

export const ProviderCard = React.forwardRef((props: CardProps & { item: ServiceTypes }, ref: LegacyRef<HTMLDivElement>) => {
   const { item, onSelect, ...rest } = props;
   const {
      selectedService,
   } = React.useContext(AppContext);

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
      }else if(name.startsWith('trello')){
         return <Trello />
      } else if(name.startsWith('salesforce')){
         return <Salesforce />
      }
   }, [item]);

   const selected = selectedService === item?.id

   return (
      <Card
         style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",}}
         bordered
         rootClassName="card"
         ref={ref}
         {...rest as CardProps}
      >

         <div style={{ textAlign: "center", marginBottom:"1.5rem"}}>
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
         <Divider style={{ margin:'0 .5rem',border: '0.1px solid #e2e8f0'  }} />
         <div style={{ textAlign: "center" }}>
            <Button type="link" style={{ fontSize: "15px" }} onClick={onSelect as any}  >
               {selected ? "Selected" : 'Select'} 
            </Button>
         </div>

      </Card>

   )
})