declare module '@docusaurus/useGlobalData' {
  interface PluginData {
    'code-loader-plugin': {
      codeFiles: {
        [pattern: string]: {
          [framework: string]: {
            component: string;
            styles?: string;
            usage?: string;
          };
        };
      };
    };
  }
}