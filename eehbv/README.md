# eehbv

**EEHBV** is a web application developed in the context of the research project
[Energieeffiziente Energiewandlung in der industriellen Holzbe- und -verarbeitung vom Prozess bis zum Stromnetz](https://www.fnr.de/index.php?id=11150&fkz=2220HV046C)
(Energy efficient energy conversion in industrial wood working from process to
power grid), government-funded by the German Federal Ministry of Food and 
Agriculture.

The software supports an optimization process of the energy efficiency of custom
machines. Further information can be found in the accompanying manual.

This repository contains the frontend for EEHBV, written with **Vue.js**, to be used 
in combination with the backend in the repository **eehbv-api**.

## Build docker image

To build the docker image run
<pre><code>docker build -t saw-leipzig/eehbv-frontend .</code></pre>
after building for production.

The docker image can also be built without a development setup, using the file
`Dockerfile.multistage`.

## Deployment
The app consists of a frontend and a backend Docker container. Additionally, a 
**MariaDB** or **MySQL** instance is necessary for the database. A complete setup 
for deployment with docker compose is described in the backend repository.

## Project development setup
### Install vue command line tool
```
npm install -g @vue/cli
```
### Install dependencies
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Development environment
Start the database setup from the backend repository and the backend (as container
or as development setup).
