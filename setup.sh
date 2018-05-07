#!/bin/bash

PWD_DIR=$PWD
ARCH=$(uname -m)

NODEJS_ARCH="x64"
NODEJS_VER="v10.0.0"

function __infrabot_update() {
	echo "Updating infrabot $(hostname)"
	git pull
	return 0
}

function __infrabot_status() {
	echo "Getting update status $(hostname)"
	git status
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

	git clone https://github.com/PavelPronskiy/infrabot.git
	cd infrabot/
	mkdir -p node/ bin/ log/
	cd node/
	echo "Installing nodejs ${NODEJS_VER}"
	wget -qO- https://nodejs.org/dist/latest-v10.x/node-v10.0.0-linux-${NODEJS_ARCH}.tar.xz | tar Jx
	ln -s $PWD/node-v10.0.0-linux-${NODEJS_ARCH}/bin/node ../bin/node
	ln -s $PWD/node-v10.0.0-linux-${NODEJS_ARCH}/lib/node_modules/npm/bin/npm-cli.js ../bin/npm
	ln -s $PWD/node-v10.0.0-linux-${NODEJS_ARCH}/lib/node_modules/npm/bin/npx-cli.js ../bin/npx

	export PATH="${PATH}:${PWD_DIR}/bin"

	cd ../

	node -v

	# echo "Setup supervisord configuration file: ${PWD}/supervisord.d/infrabot.conf"
	# sed -e "s|_BASEDIR_|${PWD}|g" \
	# 	-e "s|_NODEPATH_|${PWD}/bin/node|g" \
	# 	-e "s|_USER_|${USER}|g" \
	# 	${PWD}/supervisord.d/template.cnf > ${PWD}/supervisord.d/infrabot.conf

	npm install
	
	cp -p .env.example .env
	
	echo "Need to edit settings:"
	cat .env
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
	update)	__infrabot_update ;;
	status)	__infrabot_status ;;
	uninstall)	__infrabot_uninstall ;;
	*)		__infrabot_install ;;
esac
exit 0
