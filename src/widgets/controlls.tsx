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

import styled from "styled-components";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendar,
  faCheck,
  faCloudDownloadAlt,
  faDatabase,
  faExternalLinkSquareAlt,
  faSpinner,
  faTimes,
  faToolbox,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faCalendar);
library.add(faCheck);
library.add(faCloudDownloadAlt);
library.add(faExternalLinkSquareAlt);
library.add(faDatabase);
library.add(faSpinner);
library.add(faTimes);
library.add(faToolbox);
library.add(faUser);

export const BaseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  margin: 0px;
  padding: 0px;
`;

export const WidgetWrapper = styled(BaseWrapper)`
  background-color: var(--jp-layout-color1);
  font-family: var(--jp-content-font-family);
  font-size: var(--jp-content-font-size1);
  height: calc(100vh - 95px);
  min-width: 270px;
  padding: 4px;
`;

export const BaseLabel = styled.span`
  color: var(--jp-content-font-color0);
  display: block;
  font-size: var(--jp-content-font-size1);
`;

export const BaseInput = styled.input`
  background: transparent;
  border: var(--jp-border-width) solid var(--jp-border-color1);
  box-sizing: border-box;
  color: var(--jp-content-font-color0);
  display: block;
  font-size: var(--jp-content-font-size2);
  height: var(--jp-content-line-height);
  margin: 0 4px 8px 0;
  width: 100%;
  :focus-within {
    border: var(--jp-border-width) solid var(--jp-brand-color1);
    box-shadow: inset 0 0 4px var(--jp-brand-color2);
  }
  ::placeholder {
    color: var(--jp-content-font-color3);
    text-transform: uppercase;
  }
`;

export const BaseButton = styled.button`
  background-color: rgb(0, 138, 188);
  border: 0px;
  border-radius: var(--jp-border-radius);
  color: var(--jp-ui-inverse-font-color1);
  font-size: var(--jp-content-font-size3);
  margin: 0 0 8px 0;
  :hover {
    background-color: #00a7ec;
  }
`;

export const BaseLink = styled.a`
  color: var(--jp-content-link-color);
  font-size: var(--jp-content-font-size1);
  :hover {
    color: var(--jp-content-link-color);
  }
`;

export const Icon = styled(FontAwesomeIcon)`
  margin: 0px 4px 0px 4px;
`;
