# jupyter-containds

![Github Actions Status](https://github.com/ideonate/jupyter-containds/workflows/Build/badge.svg)

Companion Jupyter extension for [ContainDS](https://github.com/ideonate/cdsdashboards)

[![JupyterLab ContainDS Extension screenshot](screenshots/launcher.png "JupyterLab ContainDS Extension screenshot")](screenshots/launcher.png)

When editing a Jupyter notebook, one click creates a new Voila dashboard based on the current file.

From the JupyterLab launcher screen, access your own dashboard configuration pages or click straight through to view 
dashboards shared with you.

## Requirements

* JupyterLab >= 2.0

## Install

Search for 'containds' in the JupyterLab extensions manager, and enable @ideonate/jupyter-containds.

Or from the command line:

```bash
jupyter labextension install @ideonate/jupyter-containds
```

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to jupyter-containds directory

# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension install .
# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

Now every change will be built locally and bundled into JupyterLab. Be sure to refresh your browser page after saving file changes to reload the extension (note: you'll need to wait for webpack to finish, which can take 10s+ at times).

### Uninstall

```bash

jupyter labextension uninstall @ideonate/jupyter-containds
```
