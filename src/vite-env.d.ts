/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: 'development' | 'production' | 'nginx';

  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
