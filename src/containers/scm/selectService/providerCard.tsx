import React, { LegacyRef } from "react";

import { Button, Card, Typography, Divider } from "antd";
import { CardProps } from "antd/es/card";


type CustomCardProps = {
   onSelectProvider?: () => void
   selected?: boolean
   item: ServiceTypes
} & CardProps

export const ProviderCard = React.forwardRef((props: CustomCardProps, ref: LegacyRef<HTMLDivElement>) => {
   const { item, onSelectProvider, selected, ...rest } = props;

   const imageurl = item?.serviceProfile?.image?.small
   return (
      <Card
         style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", maxWidth: "18rem !important" }}
         bordered
         rootClassName="card"
         ref={ref}
         {...rest as CardProps}
      >
         <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div>
               <img src={imageurl} alt="ProviderLogo" />
            </div>
            <div style={{marginTop:"0.2rem"}}>
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