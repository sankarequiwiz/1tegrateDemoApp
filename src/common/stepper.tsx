import { StepperItemsTypes } from "../components/stepper";
import { SelectOrganization } from "../containers/scm/selectOrg";
import { SelectService } from "../containers/scm/selectService";

export function getStepItems(): { [key: string]: StepperItemsTypes[] } {
      return {
            SCM: [
                  {
                        title: 'Select Service Profile',
                        container: <SelectService />,
                  },
                  {
                        title: 'Select Organization',
                        container: <SelectOrganization />,
                  },
                  {
                        title: 'Select Repository',
                        container: <p>kh21dkh</p>,
                  },
                  {
                        title: 'Select Branch',
                        container: <p>org select</p>,
                  },
                  {
                        title: 'Pull Request',
                        container: <p>kh21dkh</p>,
                  }
            ],
            BTS: [
                  {
                        title: 'Select Profile',
                        container: <p>kh21dkh</p>,
                  },
                  {
                        title: 'Select Organization',
                        container: <p>org select</p>,
                  },
                  {
                        title: 'Select Service Profile',
                        container: <p>kh21dkh</p>,
                  },
                  {
                        title: 'Select Organization',
                        container: <p>org select</p>,
                  }
            ]
      }
}