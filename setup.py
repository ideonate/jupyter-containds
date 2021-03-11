#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

from glob import glob
import os
from os.path import join as pjoin


from setuptools import setup, find_packages

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)

HERE = os.path.dirname(os.path.abspath(__file__))

# The name of the project
name = "jupyter_containds"

# Get our version
version = get_version(pjoin(name, "_version.py"))

nb_path = pjoin(HERE, name, "nbextension", "static")
lab_path = pjoin(HERE, name, "labextension")

# Representative files that should exist after a successful build
jstargets = [
    pjoin(nb_path, "index.js"),
    pjoin(lab_path, "package.json"),
]

package_data_spec = {name: ["nbextension/static/*.*js*", "labextension/**"]}

data_files_spec = [
    ("share/jupyter/nbextensions/jupyter-containds", nb_path, "*.js*"),
    ("share/jupyter/labextensions/@ideonate/jupyter-containds", lab_path, "**"),
    ("etc/jupyter/nbconfig/notebook.d", HERE, "jupyter_containds.json"),
]


cmdclass = create_cmdclass(
    "jsdeps", package_data_spec=package_data_spec, data_files_spec=data_files_spec
)
cmdclass["jsdeps"] = combine_commands(
    install_npm(HERE, build_cmd="build:all", npm=["jlpm"]),
    ensure_targets(jstargets),
)


setup_args = dict(
    name=name.replace("_", "-"),
    description="Companion Jupyter extension for ContainDS",
    version=version,
    scripts=glob(pjoin("scripts", "*")),
    cmdclass=cmdclass,
    packages=find_packages(),
    author="Ideonate",
    author_email="dan@containds.com",
    url="https://github.com/ideonate/jupyter-containds",
    license="BSD",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "Widgets", "IPython", "JupyterHub", "Dashboard"],
    classifiers=[
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Framework :: Jupyter",
    ],
    include_package_data=True,
    python_requires=">=3.6",
    install_requires=[
        "ipywidgets>=7.6.0,<8.0.0",
    ],
    extras_require={
        "test": [
            "pytest>=4.6",
            "pytest-cov",
            "nbval",
        ],
        "docs": [
            "sphinx>=1.5",
            "recommonmark",
            "sphinx_rtd_theme",
            "nbsphinx>=0.2.13,<0.4.0",
            "jupyter_sphinx",
            "nbsphinx-link",
            "pytest_check_links",
            "pypandoc",
        ],
    },
)

if __name__ == "__main__":
    setup(**setup_args)
