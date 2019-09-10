# @kaggle/jupyterlab

Official Kaggle extension for JupyterLab.


## Requirements

* JupyterLab >= 1.1.0 

## Install

```bash
jupyter labextension install @kaggle/jupyterlab
```

## Contributing

### Development

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
