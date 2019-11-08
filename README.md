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

![Kaggle](docs/KaggleJupyterLab.png 'Kaggle')

## Getting started

### Install

Run the following command on your JupyterLab system to install the extension.

```bash
jupyter labextension install @kaggle/jupyterlab
```

Next time you start JupyterLab you should see a shiny new Kaggle icon on the left panel.

![SideIcon](docs/ExtensionIcon.png 'Icon')

### Configure

To use the extension, you’ll need to download your Kaggle API token from your account page.  With the API token you can import it into the extension by dragging & dropping the file into the dotted area or click on the input box to bring up the file browser (1).  Once you imported the file make sure to save the change (2).

![Configure](docs/Configure.png 'Configure')

Once you save the changes, it will automatically take you to the dataset list panel, but you can always click on the settings icon to update the token.

### Work

1. On the dataset listing page, you can enter a search term in the input box to filter the results.  
2. Once you find the dataset you’re  interested in, click on the download icon to download the dataset to your system.


![Work](docs/Work.png 'Work')

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
