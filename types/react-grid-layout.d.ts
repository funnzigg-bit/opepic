declare module "react-grid-layout" {
  import * as React from "react";

  export type Layout = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
  };

  export interface ReactGridLayoutProps {
    children?: React.ReactNode;
    className?: string;
    layout?: Layout[];
    cols?: number;
    rowHeight?: number;
    width?: number;
    onLayoutChange?: (layout: Layout[]) => void;
  }

  export default class GridLayout extends React.Component<ReactGridLayoutProps> {}
}
