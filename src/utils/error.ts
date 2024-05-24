function handleError(error: Array<{ [key: string]: any }> | { [key: string]: any }, _status: number = 500) {
   let message = 'Something went wrong!';
   if (typeof message === 'object' && Array.isArray(error) && error.length) {
      const [messageArr]: Array<{ [key: string]: any }> = message;
      message = messageArr?.errorMessage;
   } else if (typeof message === 'object' && !Array.isArray(error)) {
      message = error?.message || error?.errorMessage;
   }
   return message;
}