import React, { LegacyRef } from "react";

import { Button, Card, Space, Typography } from "antd";
import { CardProps } from "antd/es/card";

import { Gitlab } from '../../../components/icons/providers/gitlab';
import { Github } from '../../../components/icons/providers/github';
import { Servicenow } from '../../../components/icons/providers/servicenow';
import { Bitbucket } from '../../../components/icons/providers/bitbucket';
import { ADO } from '../../../components/icons/providers/ado';
import { Jira } from '../../../components/icons/providers/jira';
import { ServiceTypes } from "./types";
import { AppContext } from "../../../context/AppProvider";

// const iconLayout: React.SVGProps<SVGSVGElement> = {
//    width: 50,
//    height: 50
// }

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
         return <Gitlab  />;
      } else if (name.startsWith('bitbucket')) {
         return <Bitbucket  />;
      } else if (name.startsWith('ado')) {
         return <ADO />;
      }
   }, [item]);

   const selected = selectedService === item?.id

   return (
      <Card
         style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
         bordered
         rootClassName="card"
         ref={ref}
         {...rest as CardProps}
      >
         {/* <Space align="center" size={15}> */}

         {/* <Space direction="vertical"> */}
         <div style={{ textAlign: "center" }}>
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

         {/* </Space> */}
         {/* </Space> */}
         <div style={{ textAlign: "center" }}>
            <Button type="link"  style={{fontSize:"15px"}} onClick={onSelect as any}  >
               {selected?"Selected":'Select'}</Button>
         </div>

      </Card>
   )
})