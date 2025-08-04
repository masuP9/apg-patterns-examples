const fs = require("fs");
const path = require("path");

/**
 * Docusaurus custom plugin to generate static JSON files for code loading
 */
module.exports = function codeLoaderPlugin(context, options) {
  return {
    name: "code-loader-plugin",
    async loadContent() {
      const { siteDir } = context;

      // Define patterns and their file paths
      const patterns = {
        toggleButton: {
          react: {
            component: "demos/react/src/components/Button/ToggleButton.tsx",
          },
          svelte: {
            component: "demos/svelte/src/components/ToggleButton.svelte",
          },
          vue: {
            component: "demos/vue/src/components/ToggleButton.vue",
          },
          shared: {
            styles: "demos/shared/styles/toggle-button.css",
          },
        },
        tabs: {
          react: {
            component: "demos/react/src/components/Tabs/Tabs.tsx",
            styles: "demos/react/src/components/Tabs/Tabs.module.css",
          },
          svelte: {
            component: "demos/svelte/src/components/Tabs/Tabs.svelte",
          },
          vue: {
            component: "demos/vue/src/components/Tabs/Tabs.vue",
          },
        },
      };

      const loadedFiles = {};

      // Helper function to safely read file
      function readFileSync(filePath) {
        try {
          const fullPath = path.join(siteDir, filePath);
          if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, "utf8");
            console.log(`✅ Successfully loaded: ${filePath}`);
            return content;
          } else {
            console.warn(`⚠️  File not found: ${fullPath}`);
            return `// File not found: ${filePath}
// Please ensure the file exists at: ${fullPath}`;
          }
        } catch (error) {
          console.error(`❌ Error reading file ${filePath}:`, error.message);
          return `// Error reading file: ${filePath}
// Error details: ${error.message}`;
        }
      }

      // Helper function to extract usage example from App files
      function extractUsageExample(appContent, framework) {
        switch (framework) {
          case "react": {
            // Extract ToggleButton usage from return statement
            const returnMatch = appContent.match(/return\s*\(([\s\S]*?)\);/);
            if (returnMatch) {
              const jsxContent = returnMatch[1].trim();
              return `import { ToggleButton } from './ToggleButton';
import { useState } from 'react';

function App() {
  const [notification, setNotification] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const setNotification = (pressed: boolean) => {
    setNotification(pressed);
  };

  const setDarkMode = (pressed: boolean) => {
    setDarkMode(pressed);
  };

  return (
${jsxContent}
  );
}`;
            }
            break;
          }
          case "svelte": {
            // Extract ToggleButton usage from template
            const templateMatch = appContent.match(
              /<ToggleButton[\s\S]*?<\/ToggleButton>/g
            );
            if (templateMatch && templateMatch.length > 0) {
              const firstToggle = templateMatch[0];
              return `<script>
  import ToggleButton from './ToggleButton.svelte';
  
  let notification = false;
  let darkMode = false;
  
  const setNotification = (pressed) => {
    notification = pressed;
  };
  
  const setDarkMode = (pressed) => {
    darkMode = pressed;
  };
</script>

${firstToggle}`;
            }
            break;
          }
          case "vue": {
            // Extract ToggleButton usage from template
            const templateMatch = appContent.match(
              /<template>([\s\S]*?)<\/template>/
            );

            if (templateMatch) {
              const templateContent = templateMatch[1];
              const toggleMatch = templateContent.match(
                /<ToggleButton[\s\S]*?<\/ToggleButton>/
              );

              if (toggleMatch) {
                return `<template>
${toggleMatch[0]}
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ToggleButton from './ToggleButton.vue';

const notification = ref(false);
const darkMode = ref(false);

const setNotification = (pressed: boolean) => {
  notification.value = pressed;
};

const setDarkMode = (pressed: boolean) => {
  darkMode.value = pressed;
};
</script>`;
              }
            }
            break;
          }
        }

        return `// Usage example for ${framework}\n// See the full demo application for complete implementation`;
      }

      // Load all patterns with error tracking
      const errors = [];
      const warnings = [];

      for (const [patternName, patternFiles] of Object.entries(patterns)) {
        const patternData = {};

        for (const [framework, files] of Object.entries(patternFiles)) {
          if (framework === "shared") {
            patternData[framework] = {};
            for (const [fileType, filePath] of Object.entries(files)) {
              const content = readFileSync(filePath);
              patternData[framework][fileType] = content;

              if (content.startsWith("// File not found:")) {
                warnings.push(
                  `${patternName}/${framework}/${fileType}: ${filePath}`
                );
              } else if (content.startsWith("// Error reading file:")) {
                errors.push(
                  `${patternName}/${framework}/${fileType}: ${filePath}`
                );
              }
            }
          } else {
            patternData[framework] = {};
            for (const [fileType, filePath] of Object.entries(files)) {
              const content = readFileSync(filePath);
              patternData[framework][fileType] = content;

              if (content.startsWith("// File not found:")) {
                warnings.push(
                  `${patternName}/${framework}/${fileType}: ${filePath}`
                );
              } else if (content.startsWith("// Error reading file:")) {
                errors.push(
                  `${patternName}/${framework}/${fileType}: ${filePath}`
                );
              }
            }
          }
        }

        loadedFiles[patternName] = patternData;
      }

      // Report summary
      if (errors.length > 0) {
        console.error(`❌ Failed to load ${errors.length} files:`, errors);
      }
      if (warnings.length > 0) {
        console.warn(`⚠️  ${warnings.length} files not found:`, warnings);
      }
      if (errors.length === 0 && warnings.length === 0) {
        console.log("✅ All code files loaded successfully!");
      }

      // Create static directory if it doesn't exist
      const staticDir = path.join(context.siteDir, "static", "code");
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }

      // Write individual pattern files
      for (const [patternName, patternData] of Object.entries(loadedFiles)) {
        const jsonPath = path.join(staticDir, `${patternName}.json`);
        try {
          fs.writeFileSync(jsonPath, JSON.stringify(patternData, null, 2));
          console.log(
            `✅ Generated static file: static/code/${patternName}.json`
          );
        } catch (error) {
          console.error(
            `❌ Failed to write ${patternName}.json:`,
            error.message
          );
        }
      }

      // Return minimal metadata for plugin data
      return {
        patterns: Object.keys(loadedFiles),
        version: Date.now(), // Cache busting
      };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;

      try {
        // Only store minimal metadata in global data
        setGlobalData({
          metadata: content,
        });
        console.log("✅ Code loader plugin metadata set successfully");
      } catch (error) {
        console.error("❌ Failed to set global data:", error);
        throw error;
      }
    },

    getClientModules() {
      // Return client modules if needed for TypeScript support
      return [];
    },
  };
};
