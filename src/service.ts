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

import { JSONObject } from "@phosphor/coreutils";
import { ISettingRegistry, PathExt } from "@jupyterlab/coreutils";
import { IDocumentManager } from "@jupyterlab/docmanager";
import { Contents } from "@jupyterlab/services";

import { KaggleApi, ApiToken, DatasetItem, DatasetFile } from "./kaggle";
import { JupyterFrontEnd } from "@jupyterlab/application";

interface ApiTokenObject extends ApiToken, JSONObject {}

export class KaggleService {
  static NAMESPACE = "kaggle";
  static ROOT_PATH = "kaggle";
  static PLUGIN_ID = "@kaggle/jupyterlab:kaggle";
  static KAGGLE_API_URL = KaggleApi.KAGGLE_API_URL;
  static KAGGLE_BASE_URL = "https://www.kaggle.com";

  private _app: JupyterFrontEnd;
  private _manager: IDocumentManager;
  private _settings: ISettingRegistry.ISettings;
  private _drive: Contents.IManager;

  private _kapi: KaggleApi;
  private _ready: boolean;

  public onTokenChangeAccepted: () => void;

  constructor(app: JupyterFrontEnd, manager: IDocumentManager, settings: ISettingRegistry.ISettings) {
    this._app = app;
    this._manager = manager;
    this._settings = settings;

    this._drive = this._manager.services.contents;

    const apiToken = this.getApiToken();
    this._ready = false;

    if (
      apiToken &&
      apiToken.username &&
      apiToken.username != "" &&
      apiToken.token &&
      apiToken.username != ""
    ) {
      const kapi2 = new KaggleApi(apiToken);
      if (kapi2.hello()) {
        this._ready = true;
        this._kapi = kapi2;
      }
    }
  }

  public isReady(): boolean {
    return this._ready;
  }

  public getApiToken(): ApiToken {
    return this._settings.get("apiToken").composite as ApiTokenObject;
  }

  public getOwnerUrl(data: DatasetItem): string {
    return data && "https://www.kaggle.com/" + data.ownerRef;
  }

  public async onTokenChanged(
    username: string,
    token: string
  ): Promise<boolean> {
    const apiToken = { username: username, token: token } as ApiToken;
    const kapi2 = new KaggleApi(apiToken);

    if (await kapi2.hello()) {
      this._kapi = kapi2;
      this._settings.set("apiToken", apiToken as ApiTokenObject);
      this._ready = true;
      this.onTokenChangeAccepted && this.onTokenChangeAccepted();
      return true;
    }

    return false;
  }

  public listDatasets(page?: number, search?: string) {
    if (!this.isReady()) {
      throw new Error("KaggleApi not initialized.");
    }

    return this._kapi.listDatasets(page, search);
  }

  public async addDataset(dataset: DatasetItem): Promise<DatasetFile[]> {
    if (!this.isReady()) {
      throw new Error("KaggleApi not initialized.");
    }

    await this._drive
      .get(KaggleService.ROOT_PATH, { content: false })
      .catch(async reason => {
        const e = reason as Error;
        if (e && e.message == "Invalid response: 404 Not Found") {
          console.log("Creating root folder for", KaggleService.ROOT_PATH);
          await this._drive.save(KaggleService.ROOT_PATH, {
            path: "",
            type: "directory",
          });
        }
      });

    const ownerPath: string = PathExt.join(
      KaggleService.ROOT_PATH,
      dataset.ownerRef
    );
    await this._drive.get(ownerPath, { content: false }).catch(async reason => {
      const e = reason as Error;
      if (e && e.message == "Invalid response: 404 Not Found") {
        console.log("Creating folder for owner", dataset.ownerName);
        await this._drive.save(ownerPath, { path: "", type: "directory" });
      }
    });

    const datasetPath: string = PathExt.join(
      KaggleService.ROOT_PATH,
      dataset.ref
    );
    await this._drive
      .get(datasetPath, { content: false })
      .then(model => {
        throw new Error("Dataset already downloaded.");
      })
      .catch(async reason => {
        const e = reason as Error;
        if (e && e.message == "Invalid response: 404 Not Found") {
          console.log("Creating folder for dataset", dataset.title);
          await this._drive.save(datasetPath, { path: "", type: "directory" });
        } else {
          throw reason;
        }
      });

    return await this._kapi.listDatasetFiles(dataset);
  }

  public async downloadFile(
    dataset: DatasetItem,
    file: DatasetFile
  ): Promise<void> {
    const datasetPath: string = PathExt.join(
      KaggleService.ROOT_PATH,
      dataset.ref
    );

    await this._kapi
      .downloadDatasetFile(dataset, file)
      .then(async stream => {
        const reader = stream.getReader();
        const filePath: string = PathExt.join(datasetPath, file.ref);
        let chunk = 1;
        while (true) {
          const result = await reader.read();
          if (result.done) {
            break;
          }
          this._drive.save(filePath, {
            name: file.ref,
            path: filePath,
            type: "file",
            format: "base64",
            content: this.bytesToBase64(result.value),
            writable: false,
            chunk: chunk++,
          } as Contents.IModel);
        }
      })
      .catch(async reason => {
        console.warn("error", reason);
      });
  }

  public async createNotebook(dataset: DatasetItem) {
    const notebook = await this._manager.newUntitled({
      path: "work",
      type: "notebook",
    });
    const datasetPath: string = "~/" + PathExt.join(
      KaggleService.ROOT_PATH,
      dataset.ref
    );

    const notebook2 = await this._manager.services.contents.save(
      notebook.path,
      {
        content: {
          cells: [
            {
              cell_type: "code",
              execution_count: null,
              metadata: {
                truested: true,
              },
              outputs: [],
              source: ["ls -l -a " + datasetPath],
            },
          ],
          metadata: {
            kernelspec: {
              display_name: "Python 3",
              language: "python",
              name: "python3",
            },
            language_info: {
              codemirror_mode: {
                name: "ipython",
                version: 3,
              },
              file_extension: ".py",
              mimetype: "text/x-python",
              name: "python",
              nbconvert_exporter: "python",
              pygments_lexer: "ipython3",
              version: "3.7.3",
            },
          },
          nbformat: 4,
          nbformat_minor: 4,
        },
        type: notebook.type,
      }
    );

    this._manager.openOrReveal(notebook2.path);
    this._app.commands.execute("filebrowser:activate", {path : notebook2.path});
    this._app.commands.execute("filebrowser:go-to-path", { path: notebook2.path });
  }

  private bytesToBase64(bytes: Uint8Array): string {
    var base64 = "";
    var encodings =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;

    var a, b, c, d;
    var chunk;

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63; // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength];

      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4; // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + "==";
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2; // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + "=";
    }

    return base64;
  }
}
