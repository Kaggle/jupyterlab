#!/bin/bash

set -e

jlpm --cwd /github.com/kaggle/jupyterlab/ build
jupyter labextension install /github.com/kaggle/jupyterlab/ --log-level='DEBUG'

jlpm --cwd /github.com/kaggle/jupyterlab/ watch &
