import React, {
   useState,
   useEffect,
   useRef,
   useCallback,
   useMemo,
} from "react";
import { Card, Button, Input, Form } from "antd";

import "./style.scss";

export type SvgUpTrianglePropsType = {
   className?: string;
   leftOffset?: number;
};
const SvgUpTriangle = ({ className, leftOffset }: SvgUpTrianglePropsType) => {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 36 21"
         width="36"
         height="21"
         className={className}
         style={{ marginLeft: (leftOffset || 0) + 20 }}
      >
         <path
            fill="#fff"
            stroke="#f0f0f0"
            d="M1 21h34L18 2z"
            strokeDasharray="0 34 50"
            strokeWidth="1"
         />
      </svg>
   );
};

export const useInvalidateOnViewportResize = () => {
   const [, setChangeCount] = useState(0);

   const handleResize = useCallback(() => {
      setChangeCount((count) => count + 1);
   }, []);

   useEffect(() => {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, [handleResize]);
};

export type GridPropsType = {
   tiles: React.JSX.Element[];
   selectedIndex: number | null;
   detailPanelContent?: React.JSX.Element | null | undefined | boolean;
};

const ResponsiveGridWithDetailPanel = ({
   tiles,
   selectedIndex,
   detailPanelContent,
}: GridPropsType) => {
   useInvalidateOnViewportResize();
   const containerRef = useRef<HTMLDivElement | null>(null);

   const renderDetailPanel = () => {
      if (!containerRef.current) return null;
      if (!Number.isFinite(selectedIndex)) return null;


      const gridComputedStyle = window.getComputedStyle(containerRef.current);

      const gridTemplateColumns =
         gridComputedStyle.gridTemplateColumns.split(" ");
      const gridColumnCount = gridTemplateColumns.length;
      const targetRowIndex = Math.floor(selectedIndex! / gridColumnCount) + 1;
      const colWidth =
         Number.parseFloat(gridTemplateColumns[0]) +
         Number.parseFloat(gridComputedStyle.columnGap);

      return (
         <div
            className="detailsPanel"
            key={"detailsPanel" + selectedIndex}
            style={{ gridRow: targetRowIndex + 1 + " / " + (targetRowIndex + 2) }}
         >
            <SvgUpTriangle
               className="detailsPanel__triangle"
               leftOffset={((selectedIndex || 0) % gridColumnCount) * colWidth}
            />
            <Card style={{ padding: "10px" }} key={"details:" + selectedIndex}>
               {detailPanelContent}
            </Card>
         </div>
      );
   };

   return (
      <div className="responsive-grid-with-detail-panel" ref={containerRef}>
         {tiles}
         {Number.isFinite(selectedIndex) && renderDetailPanel()}
      </div>
   );
};

type GridProps = {
   tiles?: Array<any>
   selectedIndex?: number
   detailedPanel?: React.JSX.Element | null | undefined | boolean
}

const GridExampleUsage = (
   { tiles,
      selectedIndex,
      detailedPanel: detailedPanelContent
   }: GridProps
) => {

   return (
      <ResponsiveGridWithDetailPanel
         selectedIndex={selectedIndex}
         detailPanelContent={detailedPanelContent}
         tiles={tiles}
      />
   );
};

export default GridExampleUsage;
