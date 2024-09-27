import { Flex, Tabs } from "antd"
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context";
import { useMemo, useState } from "react";

export const APPKeyFlow = () => {

   const {
      selectedServiceConfig,
   } = useServiceConfigTypeProvider();

   const [activeKey, setActiveKey] = useState(0)

   const segments = selectedServiceConfig?.appConfig?.segments ?? [];
   const attentionInfos = segments?.map((i) => i?.authorizationProcessConfig?.attentionInfo)


   const tabItems = useMemo(() => {
      return attentionInfos?.map((item, index) => {
         return {
            label: '',
            key: index,
            children: (
               <Windows
                  info={item}
               />
            )
         }
      })
   }, [attentionInfos])

   return (
      <Flex>
         <Tabs
            items={tabItems}
         />
      </Flex>
   )
}

type WindowsProps = {
   info: {
      "title": "Administrator Role Required",
      "subTitle": "You must be an administrator of BambooHR to link Semgrep successfully.",
      "description": "Follow these steps to ensure your GitHub app is promoted for wider reach.",
      "options": {
         "type": "navigation",
         "name": "I'm an Admin",
         "requiresUserConfirmation": true,
         "requiresCloseWindow": true
      }
   }
}

export const Windows = (props: WindowsProps) => {

   const { info } = props;

   return (
      <Flex>
         wqd
      </Flex>
   )
}