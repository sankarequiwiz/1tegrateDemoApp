import React from "react";
import { Header } from "../components/Header";
import { Layout } from "antd";
import { Stepper } from "../components/stepper";
import { FloatingActionComp } from "../components/AccessKeyInput";
import { StepTypes, getStepItems } from "../common/stepper";
import { AppContext } from "../context/AppProvider";
import { Commits } from "./scm/Commit";
import { PullRequest } from "./scm/PullRequest";
import { Branch } from "./scm/Branch";

export function Main() {
      const { domain, conclusion } = React.useContext(AppContext);

      const headerRef = React.useRef<HTMLDivElement>(null)

      const getConclusion = React.useCallback((): StepTypes => {
            const baseProperties = { key: 'conclusion' }
            switch (conclusion) {
                  case 'commit':
                        return { title: 'Select Commit', container: <Commits />, ...baseProperties }
                  case 'pullRequest':
                        return { title: 'Select Pull Request', container: <PullRequest />, ...baseProperties }
                  case 'branch':
                        return { title: 'Select Branch', container: <Branch />, ...baseProperties }
                  default:
                        return { title: 'Download Options', container: null, ...baseProperties }
            }
      }, [conclusion])

      const items = React.useMemo(() => {
            return getStepItems([getConclusion()])[domain]
      }, [domain, getConclusion]);

      return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                  <Header ref={headerRef} style={{ position: 'fixed', top: 0, width: '100%', zIndex: 2 }} />
                  <Layout style={{ flex: 1 }}  >
                        <Stepper name='demo-app-guide' items={items} />
                  </Layout>
                  <FloatingActionComp />
            </div>
      )
}