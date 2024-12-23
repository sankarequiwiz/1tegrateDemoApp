import { StepperItemsTypes } from '../components/stepper';
import { SelectChannels } from '../containers/comms/SelectChannel';
import { SelectIncident } from '../containers/incident/SelectIncident';
import { SelectServices } from '../containers/incident/SelectService/index';
import { SelectTeams } from '../containers/incident/SelectTeams';
import { Tag } from '../containers/pcr/Tag';
import { Artifact } from '../containers/pcr/selectArtifact/Artifact'
import { SelectRepoPcr } from '../containers/pcr/selectRepo';
import { Branch } from '../containers/scm/Branch';
import { SelectOrganization } from '../containers/scm/selectOrg';
import { SelectRepo } from '../containers/scm/selectRepo';
import { SelectService } from '../containers/scm/selectService';
import { SelectCollection } from '../containers/ticketing/SelectCollection';
import { SelectTicket } from '../containers/ticketing/SelectTicket';
import {SelectCollectionn} from '../containers/vulnerability/SelectCollectionn'
import { SelectVulnerability } from '../containers/vulnerability/SelectVulnerability';

export const conclusionOption = [
  {
    label: 'Branch',
    value: 'branch',
  },
  {
    label: 'Pull request/Merge request',
    value: 'pullRequest',
  },
  {
    label: 'Commit',
    value: 'commit',
  },
];

export type StepTypes = StepperItemsTypes & {
  key: string;
};

export function getStepItems(_args: Array<StepTypes> = []): {
  [key: string]: StepTypes[];
} {
  return {
    SCM: [
      {
        title: 'Select Services',
        container: <SelectService />,
        key: '1',
      },
      {
        title: 'Select Organization',
        container: <SelectOrganization />,
        key: '2',
      },
      {
        title: 'Select Repository',
        container: <SelectRepo />,
        key: '3',
      },
      {
        title: 'Download Options',
        container: <Branch />,
        key: '3',
      },
    ],
    TICKETING: [
      {
        title: 'Select Services',
        container: <SelectService />,
        key: '1',
      },
      {
        title: 'Select Organization ',
        container: <SelectOrganization />,
        key: '2',
      },
      {
        title: 'Select Collection',
        container: <SelectCollection />,
        key: '3',
      },
      {
        title: 'Select Ticket',
        container: <SelectTicket />,
        key: '4',
      },
    ],
    PCR:[
      {
        title: 'Select Services',
        container: <SelectService />,
        key: '1',
      },
      {
        title: 'Select Organization ',
        container: <SelectOrganization />,
        key: '2',
      },
      {
        title: 'Select Repository',
        container: <SelectRepoPcr />,
        key: '3',
      },
      {
        title: 'Select Artifact',
        container: <Artifact />,
        key: '4',
      },
      {
        title: 'Select Tag',
        container: <Tag />,
        key: '4',
      },
    ],
    COMMS:[
      {
        title: 'Select Services',
        container: <SelectService />,
        key: '1',
      },
      {
        title: 'Select Organization ',
        container: <SelectOrganization />,
        key: '2',
      },
      {
        title: 'Select Channel',
        container: <SelectChannels />,
        key: '3',
      },
    ],
    INCIDENT:[
      {
        title: 'Select Services',
        container: <SelectService />,
        key: '1',
      },
      {
        title: 'Select Organization ',
        container: <SelectOrganization />,
        key: '2',
      },
       {
        title: 'Select Service',
        container: <SelectServices />,
        key: '3',
      },
      {
        title: 'Select Team',
        container: <SelectTeams />,
        key: '4',
      },
      {
        title: 'Select Incident',
        container: <SelectIncident />,
        key: '5',
      }, 
    ]
    ,
    SIEM:[
      {
        title: 'Select Services',
        container: <SelectService />,
        key: '1',
      },
    ],
    VMS:[
      {
        title: 'Select Services',
        container: <SelectService />,
        key: '1',
      },
      {
        title: 'Select Collection',
        container: <SelectCollectionn />,
        key: '2',
      },
      {
        title: 'Select Vulnerability',
        container: <SelectVulnerability />,
        key: '3',
      },      
    ], 
    COMPLIANCE:[
      {
        title: 'Select Services',
        container: <SelectService />,
        key: '1',
      },
    ],
  };
}
