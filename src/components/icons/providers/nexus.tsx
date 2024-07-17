import React from 'react';

export const Nuxus = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
   return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256.000000 256.000000"
         preserveAspectRatio="xMidYMid meet" width="50" height="50" {...props} ref={ref}>

         <g transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path d="M0 1280 l0 -1280 1280 0 1280 0 0 1280 0 1280 -1280 0 -1280 0 0
               -1280z m1841 984 c272 -157 497 -288 501 -292 3 -4 -53 -41 -126 -83 l-132
               -76 -372 215 -372 215 0 154 c0 84 2 153 4 153 2 0 226 -129 497 -286z m-311
               -734 l0 -80 -45 0 c-54 0 -98 -17 -142 -54 l-33 -28 0 -224 0 -224 -85 0 -85
               0 0 340 0 340 85 0 85 0 0 -45 c0 -52 7 -55 41 -19 30 33 114 74 152 74 l27 0
               0 -80z"/>
         </g>
      </svg>
   )
})