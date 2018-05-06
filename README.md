# infrabot
Telegram bot for home and corporate infrastructure

# Requirements
Need to install supervisor

# Installation
```bash
$ wget -qO- https://raw.githubusercontent.com/PavelPronskiy/infrabot/master/setup.sh?$(date +%s) | bash
```

# setup
```bash
sudo ln -s $PWD/supervisord.d/infrabot.conf /etc/supervisord.d/infrabot.conf

supervisorctl start infrabot

```

