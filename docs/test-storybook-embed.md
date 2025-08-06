# StorybookEmbed Test Page

このページは新しいStorybookEmbedコンポーネントのテスト用です。

## Default ToggleButton

import StorybookEmbed from '@site/src/components/StorybookEmbed';

<StorybookEmbed 
  frameworks={['react', 'vue', 'svelte']}
  story="apg-togglebutton--default"
/>

## Email Notifications ToggleButton

<StorybookEmbed 
  frameworks={['react', 'vue', 'svelte']}
  story="apg-togglebutton--email-notifications"
  defaultFramework="vue"
/>

## Dark Mode ToggleButton

<StorybookEmbed 
  frameworks={['react', 'vue', 'svelte']}
  story="apg-togglebutton--dark-mode"
  defaultFramework="svelte"
/>

## Initially Pressed ToggleButton

<StorybookEmbed 
  frameworks={['react', 'vue', 'svelte']}
  story="apg-togglebutton--initially-pressed"
/>