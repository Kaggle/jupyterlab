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

### Download

## Contributing

### Development

#### Requirements

* JupyterLab >= 1.1.0 
* A Kaggle account for accessing Kaggle API
* [Yarn](https://yarnpkg.com)
* [Docker](https://www.docker.com)

#### Getting started

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
```

You can modify the Typescript files while docker is running and rebuild
the extension to see the changes in JupyterLab.  Requires a refresh of
your browser after the extension has been rebuild.

```bash
# Rebuild Typescript source after making changes
> yarn build
```
