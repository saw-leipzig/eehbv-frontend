#!/bin/bash
npm i

API_BASE=${API_BASE:-https://api}

sed -i "s|^const apiBase = .*$|const apiBase = '$API_BASE'|" \
	  /src/vue/config/index.js

exec "$@"
