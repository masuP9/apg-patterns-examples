import 'csstype';

declare module 'csstype' {
  interface Properties {
    // Allow CSS Custom Properties (CSS Variables)
    [key: `--${string}`]: string | number | undefined;
  }
}
