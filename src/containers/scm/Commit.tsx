import React, { HTMLProps } from 'react';


export const Commits = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ ...props }, ref) => {
      return (
            <div {...props} ref={ref} ></div>
      )
})