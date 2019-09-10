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
} from "./controlls";

const Heading = styled.h2``;

const ErrorMessage = styled(BaseLabel)`
  color: var(--jp-error-color1);
  padding: 2px 4px;
`;

const InputLabel = styled(BaseLabel)`
  padding: 2px 4px;
`;

const Username = styled(BaseInput)`
  color: var(--jp-ui-font-color3);
  margin: 2px;
  padding: 0px 2px;
  width: calc(100% - 4px);
  ::placeholder {
    font-size: var(--jp-ui-font-size0);
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
  border-style: dashed;
  justify-content: space-between;
  margin: 0px;
  padding: 0px;
  height: auto;
  width: auto;
`;

interface ApiSettingsProps {
  service: KaggleService;
}

function ApiSettings(props: ApiSettingsProps) {
  const apiToken = props.service.getApiToken();
  const [username, setUsername] = React.useState(apiToken!.username || "");
  const [token, setToken] = React.useState(apiToken!.token || "");
  const [showError, setShowError] = React.useState(username == "");
  const [error, setError] = React.useState("Start by import your Kaggle Api token");

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
    console.debug('onSave');
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
      <Heading>Kaggle Extension Settings</Heading>
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
      <SaveAction disabled={showError} onClick={onSave}>Save</SaveAction>
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
