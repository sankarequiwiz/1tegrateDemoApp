/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from "react";
import { EventContext } from ".";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Typography } from "antd";

type EventContentTypes = HTMLProps<HTMLDivElement>

export const EventContent = (({ ...props }: EventContentTypes) => {
   const { selected } = React.useContext(EventContext)

   const payload = React.useMemo(() => {
      return selected?.payload;
   }, [selected])

   return (
      <div  {...props} >
         <Typography.Text strong >{selected?.name}</Typography.Text>
         {
            payload && <SyntaxHighlighter style={nord}  >
               {JSON.stringify(payload, null, 2)}
            </SyntaxHighlighter>
         }
      </div>
   )
})