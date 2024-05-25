import React from "react"

export const ADO = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
   return (
      <svg
         fill="none"
         width="55"
         height="55"
         viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
         ref={ref}
      >
         <linearGradient
            id="a"
            gradientUnits="userSpaceOnUse"
            x1="12"
            x2="12"
            y1="20.9438"
            y2="3.03371"
         >
            <stop offset="0" stopColor="#0078d4" />
            <stop offset=".16" stopColor="#1380da" />
            <stop offset=".53" stopColor="#3c91e5" />
            <stop offset=".82" stopColor="#559cec" />
            <stop offset="1" stopColor="#5ea0ef" />
         </linearGradient>
         <path
            d="m21 6.3708v10.9439l-4.5 3.6853-6.975-2.5393v2.5169l-3.94874-5.1574 11.50874.8989v-9.85392zm-3.8362.55055-6.4576-3.92135v2.57305l-5.9287 1.74157-1.7775 2.28091v5.17977l2.5425 1.1236v-6.64045z"
            fill="url(#a)"
         />
      </svg>
   )
})