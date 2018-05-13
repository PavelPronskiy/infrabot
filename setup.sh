#!/bin/bash


BASE_DIR="/opt/infrabot"
INFRABOT_DIR="${BASE_DIR}/infrabot"
ARCH=$(uname -m)

NODEJS_ARCH="x64"
NODEJS_VER="v10.0.0"
NODEJS_VER_LATEST="v10.x"

export PATH="${PATH}:${INFRABOT_DIR}/bin:${INFRABOT_DIR}/node_modules/.bin"

function __infrabot_update() {
	local version=$(grep 'const VERSION.*' logic.js | awk '{print $4}' | sed "s|'||g;s|;||g")
	# echo "Updating infrabot $(hostname)"
	LANG=C git fetch && \
	LANG=C git status | grep -q 'Your branch is behind' && \
	git merge && \
		echo "New infrabot version: ${version}" || \
		echo "No new updates found"

	echo "Check npm packages updates"
	LANG=C npm update

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
	cd ${BASE_DIR}/
	git clone https://github.com/PavelPronskiy/infrabot.git

	if [ ! -d "${INFRABOT_DIR}" ]
	then
			echo "${INFRABOT_DIR} directory not found"
			exit 1
	fi

	cd ${INFRABOT_DIR}


	node -v > /dev/null 2>&1
	if [ $? == 127 ]
	then
		echo "nodejs not found"
		mkdir -p ${INFRABOT_DIR}/node/ ${INFRABOT_DIR}/bin/ ${INFRABOT_DIR}/log/
		cd ${INFRABOT_DIR}/node/
		echo "Installing nodejs ver: ${NODEJS_VER}"
		echo "https://nodejs.org/dist/latest-${NODEJS_VER_LATEST}/node-${NODEJS_VER}-linux-${NODEJS_ARCH}.tar.xz"
		wget -qO- https://nodejs.org/dist/latest-${NODEJS_VER_LATEST}/node-${NODEJS_VER}-linux-${NODEJS_ARCH}.tar.xz | tar Jx
		ln -s ${INFRABOT_DIR}/node/node-${NODEJS_VER}-linux-${NODEJS_ARCH}/bin/node ${INFRABOT_DIR}/bin/node
		ln -s ${INFRABOT_DIR}/node/node-${NODEJS_VER}-linux-${NODEJS_ARCH}/lib/node_modules/npm/bin/npm-cli.js ${INFRABOT_DIR}/bin/npm
		ln -s ${INFRABOT_DIR}/node/node-${NODEJS_VER}-linux-${NODEJS_ARCH}/lib/node_modules/npm/bin/npx-cli.js ${INFRABOT_DIR}/bin/npx
	fi


	# echo "${HOME}"
 	
	cd ${INFRABOT_DIR}

	npm update
	npm install
	npm dedupe
	
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
	[ -f "${INFRABOT_DIR}/bin/node" ] && rm -f ${INFRABOT_DIR}/bin/node
	[ -f "${INFRABOT_DIR}/bin/npm" ] && rm -f ${INFRABOT_DIR}/bin/npm
	[ -f "${INFRABOT_DIR}/bin/npx" ] && rm -f ${INFRABOT_DIR}/bin/npx
	[ -d "${INFRABOT_DIR}/node" ] && rm -rf ${INFRABOT_DIR}/node
	[ -d "${INFRABOT_DIR}/bin" ] && rm -rf ${INFRABOT_DIR}/bin
	[ -d "${INFRABOT_DIR}/node_modules" ] && rm -rf ${INFRABOT_DIR}/node_modules
	[ -d "${INFRABOT_DIR}/log" ] && rm -rf ${INFRABOT_DIR}/log
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
