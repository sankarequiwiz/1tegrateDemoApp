import React, { LegacyRef } from "react";

import { Card, Space, Typography } from "antd";
import { CardProps } from "antd/es/card";

import { Gitlab } from '../../../components/icons/providers/gitlab';
import { Github } from '../../../components/icons/providers/github';
import { Servicenow } from '../../../components/icons/providers/servicenow';
import { Bitbucket } from '../../../components/icons/providers/bitbucket';
import { ADO } from '../../../components/icons/providers/ado';
import { Jira } from '../../../components/icons/providers/jira';
import { ServiceTypes } from "./types";

const iconLayout: React.SVGProps<SVGSVGElement> = {
   width: 50,
   height: 50
}

export const ProviderCard = React.forwardRef((props: CardProps & { item: ServiceTypes }, ref: LegacyRef<HTMLDivElement>) => {
   const { item, ...rest } = props;

   const getLogo = React.useCallback((name: string) => {
      name = name?.toLowerCase();
      if (name.startsWith('github')) {
         return <Github {...iconLayout} />;
      } else if (name.startsWith('jira')) {
         return <Jira {...iconLayout} />
      } else if (name.startsWith('servicenow')) {
         return <Servicenow {...iconLayout} />
      }
      else if (name.startsWith('gitlab')) {
         return <Gitlab {...iconLayout} />;
      } else if (name.startsWith('bitbucket')) {
         return <Bitbucket {...iconLayout} />;
      } else if (name.startsWith('ado')) {
         return <ADO {...iconLayout} />;
      }
   }, [item]);

   return (
      <Card
         style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
         bordered
         rootClassName="card"
         ref={ref}
         {...rest as CardProps}
      >
         <Space align="center" size={15}>
            {getLogo(item?.serviceProfile?.name)}
            <Space direction="vertical">
               {item?.serviceProfile?.name && (
                  <Typography.Text strong>
                     {item?.serviceProfile?.name}
                  </Typography.Text>
               )}
            </Space>
         </Space>
      </Card>
   )
})