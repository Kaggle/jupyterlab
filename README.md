# @kaggle/jupyterlab

Official Kaggle extension for JupyterLab.

## Requirements

* JupyterLab >= 1.1.0 
* A Kaggle account for accessing Kaggle API

To run this extension you will need to download a Kaggle API token.  You can
find the token on your [Kaggle account page](https://www.kaggle.com/me/account).

Once you download the token to your local machine you can drag & drop the
token on the settings page of Kaggle extension for JupyterLab.

## Overview

Kaggle extension for JupyterLab enables you to browse and download Kaggle
Dataset to use in your JupyterLab.

![Kaggle](KaggleJupyterLab.png 'Kaggle')

## Getting started

### Install

```bash
jupyter labextension install @kaggle/jupyterlab
```

### Configure

Before you start interacting with Kaggle datasets, you will need to import a
Kaggle API token.  Simply drop the token file to the `Api Token` box or click
on it to bring up the file browser and select the Kaggle Api token file.

![Placeholder](add image here)

Don't forget to save your changes.  When you click `Save` button the exetension
will automatically takes you to dataset browser.

### Download

To get to the dataset browser click on the magnifying glass on the toolbar.
You can enter a search term in the text box and click on `List Datasets`
button to retrieve a list of datasets.  At the end of list you can click on
`More Datasets` to get more results.  You can click on the download icon on
a dataset you are interested to work with and the file will be download to
your Jupyter environment and a notebook will be created for you with basic
instruction on how to get started.

![Placeholder](add image here)

## Contributing

We'd love to accept your patches and contributions to this project. See
[CONTRIBUTEING.md](CONTRIBUTING.md) for more infromation.

### Development

Here are some quick instruction to get your started experiementing with
this extension locally.

#### Requirements

* JupyterLab >= 1.1.0 
* A Kaggle account for accessing Kaggle API
* [Yarn](https://yarnpkg.com)
* [Docker](https://www.docker.com)

#### Build & Run

```bash
# Clone the repo to your local environment
# Move to jupyterlab directory

# Install dependencies
> yarn

# Build All
> yarn build:all

# Start the docker running JupyterLab with @kaggle/jupyterlab extension
# Look for the url to access the JupyterLab instance in console output
# after the service finishes starting up
> yarn docker

# If you are working on Windows run this command instead
> yarn docker:win
```

You can modify the Typescript files while docker is running and rebuild
the extension to see the changes in JupyterLab.  Requires a refresh of
your browser after the extension has been rebuild.

```bash
# Rebuild Typescript source after making changes
> yarn build
```
