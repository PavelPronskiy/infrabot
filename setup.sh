#!/bin/bash

BASE_DIR="${BASE_DIR}"
ARCH=$(uname -m)

NODEJS_ARCH="x64"
NODEJS_VER="v10.0.0"

function __infrabot_update() {
	local version=$(grep 'const VERSION.*' logic.js | awk '{print $4}' | sed "s|'||g;s|;||g")
	# echo "Updating infrabot $(hostname)"
	LANG=C git fetch && \
	LANG=C git status | grep -q 'Your branch is behind' && \
	git merge && \
		echo "New infrabot version: ${version}" || \
		echo "No new updates found"

	return 0
}

function __infrabot_status() {
	git fetch > /dev/null
	git status | grep -q 'Your branch is behind' && \
		echo "Found new updates!" || \
		echo "No new updates found."
	return 0
}

function __infrabot_install() {

	which git > /dev/null 2>&1 || {
		echo "Please install git"
		exit 1
	}


	case "${ARCH}" in
		x86_64) NODEJS_ARCH="x64" ;;
		armv7l) NODEJS_ARCH="armv7l" ;;
		armv6l) NODEJS_ARCH="armv6l" ;;
	esac

	id infrabot > /dev/null 2>&1 || useradd -d ${BASE_DIR} infrabot
	cd ${BASE_DIR}
	git clone https://github.com/PavelPronskiy/infrabot.git

	if [ ! -d "${BASE_DIR}/infrabot" ]
	then
			echo "${BASE_DIR}/infrabot directory not found"
			exit 1
	fi

	cd infrabot/
	mkdir -p node/ bin/ log/
	cd node/
	echo "Installing nodejs ${NODEJS_VER}"
	wget -qO- https://nodejs.org/dist/latest-v10.x/node-v10.0.0-linux-${NODEJS_ARCH}.tar.xz | tar Jx
	ln -s $PWD/node-v10.0.0-linux-${NODEJS_ARCH}/bin/node ../bin/node
	ln -s $PWD/node-v10.0.0-linux-${NODEJS_ARCH}/lib/node_modules/npm/bin/npm-cli.js ../bin/npm
	ln -s $PWD/node-v10.0.0-linux-${NODEJS_ARCH}/lib/node_modules/npm/bin/npx-cli.js ../bin/npx

	export PATH="${PATH}:${PWD_DIR}/bin"

	# echo "${HOME}"
 	
	cd ${BASE_DIR}/infrabot

	npm install
	
	cp -p .env.example .env

	if [ -f ${BASE_DIR}/.bashrc ]
	then
		grep -q '.env.node' ${BASE_DIR}/.bashrc || {
			echo ". ~/infrabot/.env.node" >> ${BASE_DIR}/.bashrc
			. ${BASE_DIR}/.bashrc
		}
	fi

	
	echo "Need to edit settings"
	cat .env
	echo
	echo "Need root privileges to execute generated pm2 autostart command line"
	pm2 startup
	echo
	pm2 start apps.json
	pm2 stop infrabot
	pm2 start infrabot
	pm2 save

	echo "Infrabot installed"
	echo "You need edit ~/infrabot/.env file and restart pm2 infrabot instance"

	#node ./logic.js -m version
	# node ${BASEPATH_DIR}

}

function __infrabot_uninstall() {
	#id infrabot > /dev/null 2>&1 && userdel infrabot
	[ -f "$PWD/bin/node" ] && rm -f $PWD/bin/node
	[ -f "$PWD/bin/npm" ] && rm -f $PWD/bin/npm
	[ -f "$PWD/bin/npx" ] && rm -f $PWD/bin/npx
	[ -d "$PWD/node" ] && rm -rf $PWD/node
	[ -d "$PWD/bin" ] && rm -rf $PWD/bin
	[ -d "$PWD/node_modules" ] && rm -rf $PWD/node_modules
	[ -d "$PWD/log" ] && rm -rf $PWD/log
	[ -d "${PWD}/supervisord.d/infrabot.conf" ] && rm -rf ${PWD}/supervisord.d/infrabot.conf
	echo "Uninstall success"
}


case "$1" in
	install)	__infrabot_install ;;
	update)		__infrabot_update ;;
	status)		__infrabot_status ;;
	uninstall)	__infrabot_uninstall ;;
	*)			__infrabot_install ;;
esac
exit 0
