#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Ideonate.
# Distributed under the terms of the Modified BSD License.

import pytest

from ..user import User


def test_user_creation_blank():
    u = User()
    assert u.attrs == {}
    assert u.name == None
    assert u.is_ready == False
