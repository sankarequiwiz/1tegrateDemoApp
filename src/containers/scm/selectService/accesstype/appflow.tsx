import { Tabs, } from "antd"
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context";
import { useEffect, useMemo, useState } from "react";

import { useAppProvider } from "../../../../context/AppProvider";
import { AttentionInfoWindows } from "./attentionInfo";

export const APPKeyFlow = () => {

   const {
      selectedServiceConfig,
   } = useServiceConfigTypeProvider();

   const { setAccessPointModalOpen, setRedirectModalOpen } = useAppProvider()

   const [activeKey, setActiveKey] = useState<number>(0);
   const [loading] = useState<boolean>(false);

   const segments = selectedServiceConfig?.appConfig?.segments ?? [];

   const attentionInfos = useMemo(() => {
      const tempArr = [];
      segments?.forEach((i) => {
         const steps = i?.authorizationProcessConfig?.attentionInfo?.processSteps ?? [];
         tempArr.push(...steps);
      })
      return tempArr;
   }, [segments]);

   const onMoveWindow = () => {
      setActiveKey((prev) => {
         return prev + 1;
      })
   }

   const onBackWindow = () => {
      setActiveKey((prev) => prev - 1)
   }

   const onContinue = () => {
      setAccessPointModalOpen(false);
      setRedirectModalOpen(true);
   }

   const tabItems: any = useMemo(() => {
      return attentionInfos?.map((item, index) => {
         return {
            label: null,
            key: index,
            children: (
               <AttentionInfoWindows
                  info={item}
                  onProceed={() => {
                     if (index < attentionInfos?.length - 1) {
                        onMoveWindow()
                     } else {
                        // all looks good then go ahead and proceed with redirection process
                        onContinue()
                     }
                  }}
                  onBack={onBackWindow}
                  backButtonProps={{
                     style: {
                        display: index === 0 ? 'none' : 'block'
                     }
                  }}
                  onButtonProps={{
                     loading,
                     disabled: loading
                  }}
               />
            )
         }
      })
   }, [attentionInfos])

   useEffect(() => {

      if (!tabItems?.length) {
         onContinue()
      }

   }, [tabItems])

   return (
      <Tabs
         className="hide-header"
         items={tabItems}
         activeKey={activeKey as any}
      />
   )
}
