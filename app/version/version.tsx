import { VersionDisplay } from "./version-display";
import * as fs from "node:fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import { MDXComponents } from "mdx/types";
import path from "node:path";

const components: MDXComponents = {
  h1: (props) => (
    <h1 {...props} className="text-2xl py-4">
      {props.children}
    </h1>
  ),
  h2: (props) => (
    <h2 {...props} className="text-xl py-4">
      {props.children}
    </h2>
  ),
  h3: (props) => (
    <h3 {...props} className="text-xl py-2">
      {props.children}
    </h3>
  ),
  p: (props) => (
    <p {...props} className="text-sm">
      {props.children}
    </p>
  ),
  ul: (props) => (
    <ul {...props} className="list-disc list-inside text-sm">
      {props.children}
    </ul>
  ),
};

export async function Version() {
  if (!process.env.NEXT_PUBLIC_VERSION) {
    return null;
  }
  const changeLogPath = path.join(process.cwd(), "CHANGELOG.md");
  const changeLogContents = fs.readFileSync(changeLogPath, "utf-8");

  return (
    <VersionDisplay version={process.env.NEXT_PUBLIC_VERSION}>
      <MDXRemote source={changeLogContents} components={components} />
    </VersionDisplay>
  );
}
