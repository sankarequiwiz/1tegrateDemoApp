import { StepperItemsTypes } from "../components/stepper";
import { SelectOrganization } from "../containers/scm/selectOrg";
import { SelectRepo } from "../containers/scm/selectRepo";
import { SelectService } from "../containers/scm/selectService";

export const conclusionOption = [
      {
          label: 'Commit',
          value: 'commit'
      },
      {
          label: 'Pull request',
          value: 'pullRequest'
      },
      {
          label: 'Branch',
          value: 'branch'
      }
  ]

export type StepTypes = StepperItemsTypes & {
      key: string
}

export function getStepItems(args: Array<StepTypes> = []): { [key: string]: StepTypes[] } {

      return {
            SCM: [
                  {
                        title: 'Select Services',
                        container: <SelectService />,
                        key: '1'
                  },
                  {
                        title: 'Select Organization',
                        container: <SelectOrganization />,
                        key: '2'
                  },
                  {
                        title: 'Select Repository',
                        container: <SelectRepo />,
                        key: '3'
                  },
                  ...args,
            ],
            BTS: [
                  {
                        title: 'Select Profile',
                        container: <p>kh21dkh</p>,
                        key: '1'
                  },
                  {
                        title: 'Select Organization',
                        container: <p>org select</p>,
                        key: '2'
                  },
                  {
                        title: 'Select Service Profile',
                        container: <p>kh21dkh</p>,
                        key: '3'
                  },
                  {
                        title: 'Select Organization',
                        container: <p>org select</p>,
                        key: '4'
                  }
            ]
      }
}