- [Introduction](#introduction)
- [Step 0: Prerequisites](#step-0-prerequisites)
- [Step 1: Installation of global dependencies (OS level)](#step-1-installation-of-global-dependencies-os-level)
- [Step 2: REST API](#step-2-rest-api)
  - [Step 2.1: Configuring Supervisor](#step-21-configuring-supervisor)
  - [Step 2.2: Configuring the Apache server](#step-22-configuring-the-apache-server)
- [Step 3: Mobile Web Application](#step-3-mobile-web-application)
  - [Step 3.1 Publishing the Mobile Web Application](#step-31-publishing-the-mobile-web-application)

# Introduction

This document provides a guide to installing and deploying the research apparatus. From the end-user side, the apparatus is a mobile application running in a web browser. In the background, the mobile application communicates with an application programming interface (API), through which the user is authenticated using JSON web tokens, and the business layer is implemented.

# Step 0: Prerequisites

This document assumes fresh installation of Ubuntu **22.04.3 LTS** and that we are logged in with user `usuario`.

# Step 1: Installation of global dependencies (OS level)

System update:

```console
sudo apt update && sudo apt upgrade -y
```

Installation of Python 3.10 and the command line interface (CLI) for creating virtual environments. Along with this, we will install Supervisor. 

```console
sudo apt install python3.10 python3.10-venv -y
sudo apt install supervisor -y
```

We now install Node.js v20.x and NPM.

```console
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

We verify the installation by executing the following commands.

```console
node --version
npm --version
```

Finally, we will install Expo-CLI.

```console
sudo npm install expo-cli@6.3.10 --global
```

# Step 2: REST API

Below, we define the path to install the API (backend). We will also create a Python virtual environment.

```console
mkdir ~/pyenvs/
cd ~/pyenvs/
cd sostrapp-backend/
python3.10 -m venv .venv
```

API-specific dependencies:

```console
source .venv/bin/activate
pip install -r requirements.txt
deactivate
```

We now configure the `gunicorn_start` file.

```console
nano gunicorn_start
```

Verify below that `DIR` corresponds to the path where the API has been installed. Also, `USER` and `GROUP` must match the OS user; in our case, `usuario`.

```bash
#!/bin/bash

NAME=sostrapp-backend
DIR=/home/usuario/pyenvs/sostrapp-backend
USER=usuario
GROUP=usuario
WORKERS=3
WORKER_CLASS=uvicorn.workers.UvicornWorker
VENV=$DIR/.venv/bin/activate
BIND=unix:$DIR/run/gunicorn.sock
LOG_LEVEL=error

cd $DIR
source $VENV

exec gunicorn app.main:app \
  --name $NAME \
  --workers $WORKERS \
  --worker-class $WORKER_CLASS \
  --user=$USER \
  --group=$GROUP \
  --bind=$BIND \
  --log-level=$LOG_LEVEL \
  --log-file=-
```

The following command makes the `gunicorn_start` file executable.

```console
chmod u+x gunicorn_start
```

Finally, we create the directories for the Unix socket file and logs.

```console
mkdir run
mkdir logs
```

## Step 2.1: Configuring Supervisor

The following command creates the configuration file.

```console
sudo nano /etc/supervisor/conf.d/sostrapp-backend.conf
```

Copy and paste the following text.

```bash
[program:sostrapp-backend]
command=/home/usuario/pyenvs/sostrapp-backend/gunicorn_start
user=usuario
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/usuario/pyenvs/sostrapp-backend/logs/gunicorn-error.log
```

The following commands reread the Supervisor's configuration files and restart the service.

```console
sudo supervisorctl reread
sudo supervisorctl update
```

We verify that our program is running.

```console
sudo supervisorctl status sostrapp-backend
```

## Step 2.2: Configuring the Apache server

Let's start by installing Apache 2. Note that we will use it as a __reverse proxy__.

```console
sudo apt install apache2
```

The following command creates the configuration file.

```console
sudo nano /etc/apache2/sites-available/sostrapp-backend.conf
```

Copy and paste the following text. Note that the server configuration runs on port `3200`.

```bash
<VirtualHost *:3200>
    ServerAdmin root@ubuntu
    
    ErrorLog /home/usuario/pyenvs/sostrapp-backend/logs/fastapi-error.log
    CustomLog /home/usuario/pyenvs/sostrapp-backend/logs/fastapi-access.log combined
    
    <Location />
        ProxyPass unix:/home/usuario/pyenvs/sostrapp-backend/run/gunicorn.sock|http://127.0.0.1/
        ProxyPassReverse unix:/home/usuario/pyenvs/sostrapp-backend/run/gunicorn.sock|http://127.0.0.1/
    </Location>
</VirtualHost>
```

Add the port in `/etc/apache2/ports.conf`.

```bash
Listen 3200
```

Enable the necessary Apache modules.

```console
sudo a2enmod proxy proxy_http proxy_balancer lbmethod_byrequests
```

Enable the configuration file just created.

```console
sudo a2ensite sostrapp-backend.conf
```

Restart the Apache server.

```console
sudo systemctl restart apache2
```

Finally, we add the user `usuario` to the `www-data` group to grant it access to the Unix socket file.

```console
sudo usermod -aG usuario www-data
```

# Step 3: Mobile Web Application

We will create the path to install and set up the app.

```console
mkdir ~/expo-cli/
cd ~/expo-cli/
cd sostrapp-frontend/
```

Then, we install all the dependencies (at the project level, node.js packages) and start an Expo project.

```console
npm install
```

The following command will allow us to access the application in a development environment. However, the application **MUST** be deployed as a production website before being tested by users.

```console
npx expo start --web
```

## Step 3.1 Publishing the Mobile Web Application

Our first step will be to create a web bundle of the React Native project. The bundle will be created in the `/home/usuario/expo-cli/sostrapp-frontend/web-build/` path.

```console
cd ~/expo-cli/sostrapp-frontend/
npx expo export:web
```

The following command allows us to test the web application before hosting it in production.

```console
npx serve web-build --single
```

We will serve the application as a static website through Apache using the path we created for the web bundle. With the following command, we will make up the Apache configuration file.

```console
sudo nano /etc/apache2/sites-available/sostrapp-frontend.conf
```

Copy and paste the following text. Note that the server configuration runs on port `3100`.

```bash
<VirtualHost *:3100>
    ServerAdmin root@ubuntu

    DocumentRoot /home/usuario/expo-cli/sostrapp-frontend/web-build

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    <Directory /home/usuario/expo-cli/sostrapp-frontend/web-build>
        AllowOverride all
        Require all granted
    </Directory>
</VirtualHost>
```

Add the port in `/etc/apache2/ports.conf`.

```bash
Listen 3100
```

Enable the configuration just created.

```console
sudo a2ensite sostrapp-frontend.conf
```

Finally, restart the Apache server.

```console
sudo systemctl restart apache2
```