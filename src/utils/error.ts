export function handleError(error: Array<{ [key: string]: any }> | { [key: string]: any }, _status: number = 500) {
   let message = 'Something went wrong!';
   if (typeof error === 'object' && Array.isArray(error) && error.length) {
      const [messageArr] = error;
      const errorObj = new Errors();
      message = errorObj.getMessageForCode(messageArr?.errorCode) ?? messageArr?.errorMessage;
   } else if (typeof message === 'object' && !Array.isArray(error)) {
      message = error?.message || error?.errorMessage;
   }
   return message;
}

const errorMessages: { [key: string]: string } = {
   'OTG-3200403': 'Watch dog configuration not found. Please create.!'
};

export class Errors {
   constructor() {
   }
   getErrorCodes(): { orgNotFound: string } {
      return {
         orgNotFound: 'UNZ-00000001-0000'
      }
   }
   getOrg() {
      return {
         getNotFoundCode: this.getErrorCodes().orgNotFound
      }
   }
   getMessageForCode(code: string) {
      return errorMessages?.[code]
   }
}