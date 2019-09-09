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

import * as React from "react";
import filesize from "filesize";
import moment from "moment";
import styled from "styled-components";
import { ReactWidget } from "@jupyterlab/apputils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatasetItem } from "../kaggle";
import { KaggleService } from "../service";
import {
  BaseWrapper,
  BaseInput,
  BaseButton,
  BaseLabel,
  WidgetWrapper,
  BaseLink,
} from "./controlls";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const SearchInput = styled(BaseInput)``;

const ListDatasetsAction = styled(BaseButton)``;

const DatasetListWrapper = styled(BaseWrapper)`
  margin: 4px 0px 4px 0px;
  padding: 0px;
  overflow-y: auto;
`;

const DatasetItemWrapper = styled(BaseWrapper)`
  border-style: solid;
  border-width: 1px;
  height: 200px;
  margin: 1px 0px 1px 0px;
  padding: 2px 2px 2px 6px;
  :hover {
    background-color: var(--jp-layout-color2);
  }
`;

const DatasetTitleLabel = styled(BaseLabel)`
  font-size: var(--jp-ui-font-size1);
`;

const DatasetSlugLabel = styled(BaseLink)`
  font-size: var(--jp-ui-font-size0);
`;

const DatasetOwnerLabel = styled(BaseLink)`
  font-size: var(--jp-ui-font-size0);
`;

const DatasetStatsWrapper = styled(BaseWrapper)`
  border-style: none;
  border-width: 0px;
  color: var(--jp-ui-font-color2);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: auto;
  margin: 1px 0px 1px 0px;
  padding: 0px;
`;

const TimeAgo = styled(BaseLabel)`
  font-size: var(--jp-ui-font-size0);
  width: 120px;
`;

const TotalBytes = styled(BaseLabel)`
  font-size: var(--jp-ui-font-size0);
  width: 100px;
`;

const Rating = styled(BaseLabel)`
  font-size: var(--jp-ui-font-size0);
  width: 50px;
`;

const Icon = styled(FontAwesomeIcon)`
  margin: 0px 4px 0px 4px;
`;

const DatasetDownloadWrapper = styled(BaseWrapper)`
  height: 100px;
  margin: 4px 0px 4px 0px;
  padding: 0px;
`;

const DownloadStatus = styled(BaseLabel)`
  margin: 8px 0px 8px 0px;
`;

interface DatasetPickerProps {
  service: KaggleService;
}

interface DatasetItemProps extends DatasetPickerProps {
  data: DatasetItem;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: JSX.Element;
}

function DatasetItemView(props: DatasetItemProps) {
  return (
    <DatasetItemWrapper onClick={props.onClick}>
      <DatasetTitleLabel>{props.data.title}</DatasetTitleLabel>
      <DatasetSlugLabel href={props.data.url} target="_blank">
        {props.data.ref}
      </DatasetSlugLabel>
      <DatasetOwnerLabel
        href={props.service.getOwnerUrl(props.data)}
        target="_blank"
      >
        <Icon icon={"user"} />
        {props.data.ownerName}
      </DatasetOwnerLabel>
      <DatasetStatsWrapper>
        <TimeAgo>
          <Icon icon={"calendar"} />
          {moment(props.data.lastUpdated).fromNow()}
        </TimeAgo>
        <TotalBytes>
          <Icon icon={"database"} />
          {filesize(props.data.totalBytes)}
        </TotalBytes>
        <Rating>
          <Icon icon={"toolbox"} />
          {props.data.usabilityRating.toFixed(1)}
        </Rating>
      </DatasetStatsWrapper>
      {props.children && props.children}
    </DatasetItemWrapper>
  );
}

function DatasetPicker(props: DatasetPickerProps) {
  const [search, setSearch] = React.useState("");
  const [datasetItems, setDatasetItems] = React.useState(null as DatasetItem[]);
  const [selectedDatasetItem, setSelectedDatasetItem] = React.useState(null as DatasetItem);
  const [downloadMessage, setDownloadMessage] = React.useState("");
  const [downloadIcon, setDownloadIcon] = React.useState("spinner" as IconProp);
  const [spinDownloadIcon, setSpinDownloadIcon] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentSearch, setCurrentSearch] = React.useState("");

  const ListDatasets = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedDatasetItem(null);
    setCurrentPage(1);
    setCurrentSearch(search)
    const result = await props.service.listDatasets(1, search);
    setDatasetItems(result);
  };

  const ListMoreDatasets = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // capture currentPage before waiting on the promise to reduce
    // timing issue with setCurrentPage
    const promise = props.service.listDatasets(currentPage + 1, currentSearch);
    setCurrentPage(currentPage + 1);
    const result = await promise;
    setDatasetItems(datasetItems.concat(result));
  };

  const DownloadDataset = async (dataset: DatasetItem) => {
    setDownloadIcon("spinner");
    setSpinDownloadIcon(true);
    setDownloadMessage("Retrieving file list.");
    await props.service
      .addDataset(dataset)
      .then(async files => {
        for (let i = 0; i < files.length; i++) {
          setDownloadMessage(
            "Downloading file " + (i + 1) + " of " + files.length
          );
          await props.service.downloadFile(dataset, files[i]);
        }

        setDownloadMessage("Download completed");
        setDownloadIcon("check");
        setSpinDownloadIcon(false);

        await props.service.createNotebook(dataset);
      })
      .catch(reason => {
        const e = reason as Error;
        if (e) {
          console.error(e.message);
          setDownloadMessage(e.message);
          setDownloadIcon("times");
          setSpinDownloadIcon(false);
        }
      });
  };

  return (
    <WidgetWrapper>
      <SearchInput
        placeholder="search for datasets"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {selectedDatasetItem && (
        <DatasetDownloadWrapper>
          <DatasetItemView data={selectedDatasetItem} service={props.service}>
            <DownloadStatus>
              <Icon icon={downloadIcon} spin={spinDownloadIcon} />
              {downloadMessage}
            </DownloadStatus>
          </DatasetItemView>
        </DatasetDownloadWrapper>
      )}
      <ListDatasetsAction onClick={ListDatasets}>
        List Datasets
      </ListDatasetsAction>
      {datasetItems && (
        <DatasetListWrapper>
          {datasetItems.map((item, i) => (
            <DatasetItemView
              key={i}
              data={item}
              service={props.service}
              onClick={e => {
                setSelectedDatasetItem(item);
                DownloadDataset(item);
              }}
            />
          ))}
          <ListDatasetsAction onClick={ListMoreDatasets}>
            Load More
          </ListDatasetsAction>
        </DatasetListWrapper>
      )}
    </WidgetWrapper>
  );
}

export class DatasetPickerWidget extends ReactWidget {
  private service: KaggleService;

  constructor(service: KaggleService) {
    super();
    this.service = service;
  }

  render() {
    return <DatasetPicker service={this.service} />;
  }
}
