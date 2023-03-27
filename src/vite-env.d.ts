/// <reference types="vite/client" />

declare module 'react-mouse-particles' {
  export type ConfigPositionProp = any;
  // Some typing error actual type should be:

  export interface Props {
    num?: number;
    color?: any;
    radius?: number;
    cull?: string;
    life?: number;
    tha?: number;
    alpha?: number;
    v?: number;
    g?: number;
  }

  class MouseParticles extends React.Component<Props, any> {}

  export default MouseParticles;
}
