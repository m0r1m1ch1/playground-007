declare module '*.svg?react' {
  import type { SVGProps } from 'react';

  const ReactComponent: (props: SVGProps<SVGSVGElement> & { title?: string }) => JSX.Element;

  export default ReactComponent;
}
