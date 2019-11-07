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
import { DatasetItem } from "../kaggle";
import { KaggleService } from "../service";
import {
  BaseButton,
  BaseLabel,
  BaseLink,
  BaseInput,
  BaseWrapper,
  Icon,
  WidgetWrapper,
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
  margin: 0px;
  padding: 2px 2px 2px 6px;
  :hover {
    background-color: var(--jp-layout-color3);
  }
  :nth-child(2n) {
    background-color: var(--jp-layout-color2);
    :hover {
      background-color: var(--jp-layout-color3);
    }
  }
`;

const DatasetInfoWrapper = styled(BaseWrapper)`
  border-style: none;
  border-width: 0px;
  height: auto;
  margin: 1px 0px 1px 0px;
  padding: 0px;
`;

const DatasetTopWrapper = styled(BaseWrapper)`
  border-style: none;
  border-width: 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: auto;
  margin: 1px 0px 1px 0px;
  padding: 0px;
`;

const DatasetTitleLabel = styled(BaseLabel)`
  color: var(--jp-content-font-color2);
  font-size: var(--jp-content-font-size2);
  margin-left: 2px;
  width: calc(100% - 24px);
`;

const DatasetSlugLabel = styled(BaseLink)`
  display: block;
  font-size: var(--jp-content-font-size0);
`;

const DatasetOwnerLabel = styled(BaseLink)`
  display: block;
  font-size: var(--jp-content-font-size0);
`;

const DownloadDataset = styled(BaseWrapper)`
  color: rgb(0, 138, 188);
  font-size: var(--jp-content-font-size3);
  :hover {
    cursor: copy;
  }
`;

const DatasetStatsWrapper = styled(BaseWrapper)`
  border-style: none;
  border-width: 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: auto;
  margin: 1px 0px 1px 0px;
  padding: 0px;
`;

const TimeAgo = styled(BaseLabel)`
  color: var(--jp-content-font-color2);
  font-size: var(--jp-content-font-size0);
  width: 120px;
`;

const TotalBytes = styled(BaseLabel)`
  color: var(--jp-content-font-color2);
  font-size: var(--jp-content-font-size0);
  width: 100px;
`;

const Rating = styled(BaseLabel)`
  color: var(--jp-content-font-color2);
  font-size: var(--jp-content-font-size0);
  width: 50px;
`;

const DatasetDownloadWrapper = styled(BaseWrapper)`
  height: auto;
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
  onDownload?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: JSX.Element;
}

function DatasetItemView(props: DatasetItemProps) {
  return (
    <DatasetItemWrapper>
      <DatasetInfoWrapper>
        <DatasetTopWrapper>
          <DatasetTitleLabel>{props.data.title}</DatasetTitleLabel>
          <DownloadDataset onClick={props.onDownload}>
            <Icon icon={"cloud-download-alt"} />
          </DownloadDataset>
        </DatasetTopWrapper>
        <DatasetSlugLabel href={props.data.url} target="_blank">
          <Icon icon={"external-link-square-alt"} />
          {props.data.ref}
        </DatasetSlugLabel>
        <DatasetOwnerLabel
          href={props.service.getOwnerUrl(props.data)}
          target="_blank"
        >
          <Icon icon={"user"} />
          {props.data.ownerName}
        </DatasetOwnerLabel>
      </DatasetInfoWrapper>
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
          {(props.data.usabilityRating * 10).toFixed(1)}
        </Rating>
      </DatasetStatsWrapper>
      {props.children && props.children}
    </DatasetItemWrapper>
  );
}

function DatasetPicker(props: DatasetPickerProps) {
  const [search, setSearch] = React.useState("");
  const [datasetItems, setDatasetItems] = React.useState(null as DatasetItem[]);
  const [selectedDatasetItem, setSelectedDatasetItem] = React.useState(
    null as DatasetItem
  );
  const [downloadMessage, setDownloadMessage] = React.useState("");
  const [downloadIcon, setDownloadIcon] = React.useState("spinner" as IconProp);
  const [spinDownloadIcon, setSpinDownloadIcon] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentSearch, setCurrentSearch] = React.useState("");

  React.useEffect(() => {
    setSelectedDatasetItem(null);
    setDatasetItems(null);
    LoadDatasets(1);
  }, [currentSearch]);

  const LoadDatasets = async (page: number) => {
    setCurrentPage(page);
    const result = await props.service.listDatasets(page, currentSearch);
    if (page == 1) {
      setDatasetItems(result);
    } else {
      setDatasetItems(datasetItems.concat(result));
    }
  };

  const OnKeyUp = async (keyCode: number) => {
    switch (keyCode) {
      case 13:
        setCurrentSearch(search);
        break;
      case 27:
        setSearch(currentSearch);
        break;
    }
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
        placeholder="Search datasets"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onBlur={e => setCurrentSearch(search)}
        onKeyUp={e => OnKeyUp(e.keyCode)}
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
      {datasetItems && (
        <DatasetListWrapper>
          {datasetItems.map((item, i) => (
            <DatasetItemView
              key={i}
              data={item}
              service={props.service}
              onDownload={e => {
                setSelectedDatasetItem(item);
                DownloadDataset(item);
              }}
            />
          ))}
          <ListDatasetsAction onClick={e => LoadDatasets(currentPage + 1)}>
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
