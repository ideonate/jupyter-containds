# jupyter-containds

![Github Actions Status](https://github.com/ideonate/jupyter-containds/workflows/Build/badge.svg)

Companion Jupyter extension for [ContainDS](https://github.com/ideonate/cdsdashboards)

[![JupyterLab ContainDS Extension screenshot](screenshots/launcher.png 'JupyterLab ContainDS Extension screenshot')](screenshots/launcher.png)

When editing a Jupyter notebook, one click creates a new Voila dashboard based on the current file.

From the JupyterLab launcher screen, access your own dashboard configuration pages or click straight through to view
dashboards shared with you.

## Requirements

- JupyterLab >= 2.0
- ipywidgets >= 7

## Installation

You can install using `pip`:

```bash
pip install jupyter-containds
```

Or if you use jupyterlab:

```bash
pip install jupyter-containds
jupyter labextension install @jupyter-widgets/jupyterlab-manager @ideonate/jupyter-containds
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:

```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] jupyter-containds
```

### Uninstall

```bash
jupyter labextension uninstall @ideonate/jupyter-containds
pip uninstall jupyter-containds
```

## Development Installation

```bash
# First install the python package. This will also build the JS packages.
pip install -e ".[test, examples]"
```

When developing your extensions, you need to manually enable your extensions with the
notebook / lab frontend. For lab, this is done by the command:

```
jupyter labextension install @jupyter-widgets/jupyterlab-manager --no-build
jupyter labextension install .
```

For classic notebook, you can run:

```
jupyter nbextension install --sys-prefix --symlink --overwrite --py jupyter-containds
jupyter nbextension enable --sys-prefix --py jupyter-containds
```

Note that the `--symlink` flag doesn't work on Windows, so you will here have to run
the `install` command every time that you rebuild your extension. For certain installations
you might also need another flag instead of `--sys-prefix`, but we won't cover the meaning
of those flags here.

### How to see your changes

#### Typescript:

To continuously monitor the project for changes and automatically trigger a rebuild, start Jupyter in watch mode:

```bash
jupyter lab --watch
```

And in a separate session, begin watching the source directory for changes:

```bash
jlpm run watch
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.

#### Python:

If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.
