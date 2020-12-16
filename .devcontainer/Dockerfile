ARG BASE_IMAGE=jupyterhub/jupyterhub:1.2
FROM $BASE_IMAGE

COPY .devcontainer/jupyterhub_config.py /etc/jupyterhub/
COPY .devcontainer/voila.py /usr/local/etc/jupyter/

RUN apt-get update && apt-get --assume-yes install git vim wget xz-utils \
 && python3 -m pip install setuptools jhsingle_native_proxy dockerspawner voila streamlit dash bokeh panel pylint rope black isort "jupyterlab~=2.0" \
 && useradd --no-log-init -r -u 999 dan && mkdir -p /home/dan && chown dan /home/dan \
 && useradd --no-log-init -r -u 998 bob && mkdir -p /home/bob && chown bob /home/bob \
 && wget https://nodejs.org/dist/v12.18.3/node-v12.18.3-linux-x64.tar.xz -O /tmp/node.tar.xz \
 && cd /tmp && tar xf node.tar.xz && cp -r node-v12.18.3-linux-x64/* /usr && rm -rf /tmp/node*

RUN python3 -m pip install git+https://github.com/ideonate/cdsdashboards.git@master#egg=cdsdashboards[user-voila]

