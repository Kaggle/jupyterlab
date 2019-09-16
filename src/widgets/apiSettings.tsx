// Copyright 2019 Kaggle Inc
//
// Licensed under the Apache License, Version 2.0(the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// DO NOT RENAME THIS FILE TO settings.tsx THINGS WILL BREAK
import React from "react";
import styled from "styled-components";
import ReactDropzone, { DropzoneRef, DropEvent } from "react-dropzone";
import { ReactWidget } from "@jupyterlab/apputils";
import { KaggleService } from "../service";
import {
  BaseInput,
  BaseButton,
  BaseLabel,
  WidgetWrapper,
  BaseWrapper,
  BaseLink,
  Icon,
} from "./controlls";

const SectionHeading = styled.h3`
  color: var(--jp-content-font-color1);
`;

const ErrorMessage = styled(BaseLabel)`
  color: var(--jp-error-color1);
  padding: 2px 4px;
`;

const HelpText = styled(BaseLabel)`
  margin: 4px 0px;
`;

const KaggleLink = styled(BaseLink)``;

const InputLabel = styled(BaseLabel)`
  padding: 2px 4px;
`;

const Username = styled(BaseInput)`
  color: var(--jp-content-font-color3);
  margin: 2px;
  padding: 0px 2px;
  width: calc(100% - 4px);
  ::placeholder {
    font-size: var(--jp-content-font-size0);
  }
`;

const SaveAction = styled(BaseButton)`
  margin: 4px 0px;
  padding: 0px 4px;
  :disabled {
    background-color: var(--jp-layout-color3);
  }
`;

const ImportInput = styled(BaseInput)`
  display: none;
  height: 0px;
`;

const Dropzone = styled(BaseWrapper)`
  border: 2px;
  border-color: var(--jp-accent-color1);
  border-style: dashed;
  justify-content: space-between;
  margin: 4px 0px;
  padding: 0px;
  height: auto;
  width: auto;
`;

interface ApiSettingsProps {
  service: KaggleService;
}

function ApiSettings(props: ApiSettingsProps) {
  const [username, setUsername] = React.useState("");
  const [token, setToken] = React.useState("");
  const [showError, setShowError] = React.useState(true);
  const [error, setError] = React.useState(
    "Start by importing your Kaggle Api token"
  );

  props.service.getApiToken().then(apiToken => {
    if (apiToken && apiToken.username !== "") {
      setUsername(apiToken.username);
      setToken(apiToken.token);
      setError("");
      setShowError(false);
    }
  });

  const dropzoneRef = React.createRef<DropzoneRef>();
  const onTokenDrop = (
    acceptedFiles: File[],
    rejectedFiles: File[],
    event: DropEvent
  ) => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      try {
        const token = JSON.parse(reader.result.toString());
        if (!(token && token.username && token.key)) {
          setError("Invalid token file.");
          setShowError(true);
          return;
        }
        setError("");
        setShowError(false);
        setUsername(token.username);
        setToken(token.key);
      } catch (e) {
        setError("Invalid token file.");
        setShowError(true);
      }
    };

    acceptedFiles.forEach(file => reader.readAsBinaryString(file));
  };

  const onSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.debug("onSave");
    if (await props.service.onTokenChanged(username, token)) {
      setError("");
      setShowError(false);
    } else {
      setError("Invalid api token.");
      setShowError(true);
    }
  };

  return (
    <WidgetWrapper>
      <SectionHeading>Kaggle</SectionHeading>
      <HelpText>
        <KaggleLink href="https://www.kaggle.com" target="_blank">
          Kaggle
          <Icon icon={"external-link-square-alt"} />
        </KaggleLink>
        is an online community of data scientists and machine learners. Kaggle
        allows users to find and publish data sets, explore and build models in
        a web-based data-science environment, work with other data scientists
        and machine learning engineers, and enter competitions to solve data
        science challenges.
      </HelpText>
      <SectionHeading>Extension</SectionHeading>
      <HelpText>
        <KaggleLink
          href="https://www.npmjs.com/package/@kaggle/jupyterlab"
          target="_blank"
        >
          Kaggle extension for JupyterLab
          <Icon icon={"external-link-square-alt"} />
        </KaggleLink>{" "}
        enables you to browse and download Kaggle Dataset to use in your
        JupyterLab.
      </HelpText>
      <SectionHeading>Contribution</SectionHeading>
      <HelpText>
        Also check out the{" "}
        <KaggleLink
          href="https://www.github.com/Kaggle/jupyterlab"
          target="_blank"
        >
          GitHub project
          <Icon icon={"external-link-square-alt"} />
        </KaggleLink>
        to interact with the community and contribute to the project.
      </HelpText>
      <SectionHeading>Settings</SectionHeading>
      <HelpText>
        Download your Kaggle API token from your{" "}
        <KaggleLink href="https://www.kaggle.com/me/account" target="_blank">
          Kaggle user's account page
          <Icon icon={"external-link-square-alt"} />
        </KaggleLink>
        to get started.
      </HelpText>
      <ReactDropzone ref={dropzoneRef} onDrop={onTokenDrop}>
        {({ getRootProps, getInputProps }) => (
          <Dropzone {...getRootProps()}>
            <InputLabel>Api Token</InputLabel>
            <ErrorMessage hidden={showError}>{error}</ErrorMessage>
            <Username
              type="text"
              disabled
              placeholder="drop file here or click to browse"
              value={username}
            />
            <ImportInput {...getInputProps()} />
          </Dropzone>
        )}
      </ReactDropzone>
      <HelpText>Don't forget to save the changes you have made.</HelpText>
      <SaveAction disabled={showError} onClick={onSave}>
        Save
      </SaveAction>
    </WidgetWrapper>
  );
}

export class ApiSettingsWidget extends ReactWidget {
  private service: KaggleService;

  constructor(service: KaggleService) {
    super();
    this.service = service;
  }

  render() {
    return <ApiSettings service={this.service} />;
  }
}
