import React from "react";
import { Header } from "../components/Header";
import { Layout } from "antd";
import { Stepper } from "../components/stepper";
import { FloatingActionComp } from "../components/AccessKeyInput";
import { StepTypes, getStepItems } from "../common/stepper";
import { AppContext } from "../context/AppProvider";

export function Main() {
      const { domain, conclusion } = React.useContext(AppContext);

      const headerRef = React.useRef<HTMLDivElement>(null)

      const getConclusion = React.useCallback((): StepTypes => {
            const baseProperties = { key: 'conclusion' }

            switch (conclusion) {
                  case 'commit':
                        return { title: 'Commit', container: <p>Commit</p>, ...baseProperties }
                  case 'pullRequest':
                        return { title: 'Pull Request', container: <p>Pull Request</p>, ...baseProperties }
                  case 'branch':
                        return { title: 'Branch', container: <p>Branch</p>, ...baseProperties }
                  default:
                        return { title: 'Resource', container: null, ...baseProperties }
            }
      }, [conclusion])

      const items = React.useMemo(() => {
            return getStepItems([getConclusion()])[domain]
      }, [domain, getConclusion]);

      console.log(items)

      return (
            <>
                  <Header ref={headerRef} />
                  <Layout id='app' >
                        <Stepper name='demo-app-guide' items={items} />
                  </Layout>
                  <FloatingActionComp />
            </>
      )
}