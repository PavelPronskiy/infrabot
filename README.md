# infrabot
Telegram bot for home and corporate infrastructure

# Requirements
Need to install supervisor

# Installation
```bash
$ useradd -d /opt/infrabot infrabot
$ cd /opt/infrabot
$ wget -qO- https://raw.githubusercontent.com/PavelPronskiy/infrabot/master/setup.sh?$(date +%s) | bash
$ pm2 startup
$ pm2 start apps.json
$ pm2 save
```

# System autostart
Need root privileges to make links nodejs binaries.
```bash
ln -s /opt/infrabot/infrabot/bin/node /usr/bin/node
```


