import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Multiple Frameworks",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Implementation examples for React, Svelte, and Vue.js. Compare
        approaches and choose what works best for your project.
      </>
    ),
  },
  {
    title: "Accessibility First",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        Every component follows WAI-ARIA guidelines with proper keyboard
        navigation, screen reader support, and accessibility testing.
      </>
    ),
  },
  {
    title: "MCP Integration",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        AI-friendly metadata structure allows tools like Claude to reference
        these implementations for code generation and assistance.
      </>
    ),
  },
];

function Feature({ Svg, title, description }: FeatureItem): JSX.Element {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
