import React from "react";
import { Header } from "../components/Header";
import { Layout } from "antd";
import { Stepper } from "../components/stepper";
import { FloatingActionComp } from "../components/AccessKeyInput";
import { getStepItems } from "../common/stepper";
import { AppContext } from "../context/AppProvider";

export function Main() {
      const { domain } = React.useContext(AppContext);

      const headerRef = React.useRef<HTMLDivElement>(null)

      const items = React.useMemo(() => getStepItems()[domain], [domain]);

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