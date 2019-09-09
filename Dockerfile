FROM jupyter/minimal-notebook:2ce7c06a61a1 AS base

LABEL author="Kaggle <support@kaggle.com>"
LABEL maintainer="Kaggle <support@kaggle.com>"

# do stuff here
ENV JUPYTER_ENABLE_LAB=yes

# make sure the version match @jupyterlab/application that
# @kaggle/jupyterlab is depending on
RUN conda install jupyterlab=1.1.0

CMD ["start-notebook.sh", "--watch"]

USER root

COPY docker/usr/local/bin/start-notebook.d /usr/local/bin/start-notebook.d
RUN fix-permissions /usr/local/bin/start-notebook.d/

USER $NB_UID
WORKDIR $HOME
