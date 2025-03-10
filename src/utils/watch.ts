import { DomainTypes } from "../types/type";

type ConfigType = {
   level?: 'organization' | 'collection' | 'repository' | 'ticket' | 'service' | 'artifact'
}

const setup = {
   SCM: {
      organization: {
         watch: true
      },
      repository: {
         watch: true
      }
   },
   TICKETING: {
      organization: {
         watch: false
      },
      collection: {
         watch: true
      },
      ticket: {
         watch: false
      }
   },
   PCR: {
      organization: {
         watch: true
      },
      repository: {
         watch: true
      },
      artifact: {
         watch: false
      }
   },
   INCIDENT: {
      service: {
         watch: true
      },
   }
}

export class Watch {
   public domain: DomainTypes;

   constructor(domain: DomainTypes) {
      this.domain = domain;
   }

   isAvailable(config: ConfigType) {
      const { level } = config;
      return setup?.[this.domain]?.[level]?.watch ?? false;
   }
}