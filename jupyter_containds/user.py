#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Ideonate.
# Distributed under the terms of the Modified BSD License.
"""
Widget to get dashboard user metadata from its cookie
"""
from traitlets import Bool, Dict, Unicode, observe
from ipywidgets import DOMWidget

from ._frontend import module_name, module_version


class User(DOMWidget):
    """Widget to get dashboard user metadata from its cookie"""

    _model_name = Unicode("UserModel").tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = None
    _view_module = None
    _view_module_version = ""

    attrs = Dict({}, help="User info", read_only=True).tag(sync=True)
    name = Unicode(
        default_value=None,
        allow_none=True,
        help="""User name
        
        Its initial value is None. And when it is ready, it contains
        the user name or an empty string if no information were recovered.
        """,
        read_only=True,
    ).tag(sync=True)

    is_ready = Bool(
        default_value=False,
        help="""True when the user information have been obtained.
        
        This attribute is not available on the frontend side.
        """,
        read_only=True,
    )

    @observe("name", type="change")
    def _is_ready(self, change):
        self.set_trait("is_ready", change["new"] is not None)


__all__ = ["User"]
