import { Button, Flex, Tabs, Typography } from "antd"
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context";
import { MouseEvent, useMemo, useState } from "react";

export const APPKeyFlow = () => {

   const {
      selectedServiceConfig,
   } = useServiceConfigTypeProvider();

   const [activeKey, setActiveKey] = useState(0)

   const segments = selectedServiceConfig?.appConfig?.segments ?? [];

   const attentionInfos = useMemo(() => {
      const tempArr = [];
      segments?.forEach((i) => {
         const steps = i?.authorizationProcessConfig?.attentionInfo?.attentionInfo ?? [];
         tempArr.push(...steps);
      })
      return tempArr;
   }, [segments]);

   const onMoveWindow = (index: number) => {
      setActiveKey(index)
   }

   const tabItems: any = useMemo(() => {
      return attentionInfos?.map((item, index) => {
         return {
            label: '',
            key: index,
            children: (
               <Windows
                  info={item}
                  onProceed={() => onMoveWindow(index)}
               />
            )
         }
      })
   }, [attentionInfos])

   return (
      <Flex>
         <Tabs
            className="hide-header"
            items={tabItems}
            accessKey={activeKey as any}
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
   },
   onProceed: (e: MouseEvent<HTMLButtonElement>) => void
}

export const Windows = (props: WindowsProps) => {

   const { onProceed } = props;

   const { info } = props;

   return (
      <Flex vertical>
         <Flex>
            <Typography.Text>{info?.title}</Typography.Text>
            <Typography.Text>{info?.subTitle}</Typography.Text>
            <Typography.Text>{info?.description}</Typography.Text>
         </Flex>
         <Flex vertical>
            <Button onClick={onProceed} >{info?.options?.name}</Button>
         </Flex>
      </Flex>
   )
}