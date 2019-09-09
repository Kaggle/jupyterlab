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
  BaseForm,
} from "./controlls";

const Heading = styled.h2``;

const InputLabel = styled(BaseLabel)``;

const Username = styled(BaseInput)``;

const ApiKey = styled(BaseInput)``;

const SaveAction = styled(BaseButton)``;

const ImportAction = styled(BaseLabel)`
  background-color: rgb(0, 138, 188);
  border: 0px;
  border-radius: var(--jp-border-radius);
  color: var(--jp-ui-inverse-font-color0);
  font-size: var(--jp-ui-font-size2);
  margin: 4px;
  padding: 1px 6px;
  :hover {
    background-color: #00a7ec;
  }
  text-align: center;
`;

const ImportInput = styled(BaseInput)`
  display: none;
  height: 0px;
`;

const Dropzone = styled(BaseWrapper)`
  border: 2px;
  border-style: dashed;
  justify-content: space-between;
  height: auto;
  width: auto;
`;

const ApiForm = styled(BaseForm)``;

interface ApiSettingsProps {
  service: KaggleService;
}

function ApiSettings(props: ApiSettingsProps) {
  const apiToken = props.service.getApiToken();
  const [username, setUsername] = React.useState(apiToken!.username || "");
  const [token, setToken] = React.useState(apiToken!.token || "");
  const [showError, setShowError] = React.useState(false);
  const [error, setError] = React.useState("");

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
      const token = JSON.parse(reader.result.toString());
      setUsername(token.username);
      setToken(token.key);
    };

    acceptedFiles.forEach(file => reader.readAsBinaryString(file));
  };

  const validate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await props.service.onTokenChanged(username, token)) {
      setError("");
      setShowError(false);
    } else {
      setError("Incorrect username and token combination");
      setShowError(true);
    }
  };

  return (
    <WidgetWrapper>
      <Heading>Api Settings</Heading>
      <InputLabel hidden={showError}>{error}</InputLabel>
      <ApiForm onSubmit={validate}>
        <InputLabel>Username</InputLabel>
        <Username
          type="text"
          placeholder="username"
          autoComplete="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <InputLabel>Api Key</InputLabel>
        <ApiKey
          type="password"
          placeholder="apiKey"
          autoComplete="new-password"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        <SaveAction onClick={e => e.stopPropagation()}>Save</SaveAction>
        <ReactDropzone ref={dropzoneRef} onDrop={onTokenDrop}>
          {({ getRootProps, getInputProps }) => (
            <Dropzone {...getRootProps()}>
              <ImportAction>Import Api Token</ImportAction>
              <ImportInput {...getInputProps()} />
            </Dropzone>
          )}
        </ReactDropzone>
      </ApiForm>
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
