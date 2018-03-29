[Vote Forward](http://votefwd.org) works to increase U.S. voter turnout using behavioral science and the U.S. Postal Service. We provide the tools for citizens to "adopt" registered but unlikely voters in swing states, and send them (partially) hand-written letters encouraging them to vote.

If you want to send letters, visit the [actual website](http://votefwd.org). Thank you!

If you want to help build the software, it's a React app with a Node server and a Postgres database.

### Getting Started

#### Install Homebrew

	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	brew tap homebrew/versions

#### Install binary dependencies

You'll need node, npm, and postgresql:

	brew install node
	brew install postgresql

Follow the instructions in your terminal after installing postgres to get and keep it running (`launchctl` is recommended).

#### Set up development environment

Install git if necessary and clone the repo:

	brew install git
	git clone git@github.com:sjforman/votefwd.git

Install application dependencies using `npm`:

	cd votefwd
	npm install

Ensure local node module binaries are available on your `PATH` by prefixing it
with `./node_modules/.bin`:

    export PATH=./node_modules/.bin:$PATH

Make a local database for Vote Forward:

	createdb votefwd

#### Environment variables

Set up your configuration by populating a `.env` file with the following
variables:

	REACT_APP_URL=http://localhost:3000
	REACT_APP_API_URL=http://localhost:3001/api
	REACT_APP_DATABASE_URL=postgres://<YOURUSERNAME>:@localhost:5432/votefwd
	REACT_APP_DATABASE_DIALECT=postgres
	REACT_APP_AUTH0_CLIENTID=T0oLi22JFRtHPsx0595AAf8p573bxD4d

#### Google Cloud Platform Storage

We're currently using GCP to store PDFs of generated plea letters. You'll need a file named `googleappcreds.json` in the root directory to grant you access to the voteforward bucket to create and store PDFs.

Email `sjforman@gmail.com` to request access to the project on GCP. Once granted access, you may or may not also have permission to create your own `service account key` in the [GCP console](https://console.cloud.google.com/apis/credentials?project=voteforward-198801&authuser=1). If you can, great. If not, you know who to email.

#### Auth0

We're currently using [Auth0](https://auth0.com/) for user authentication and management. You shouldn't need anything other than the (non-sensitive) `CLIENTID` in your `.env` file to make authentication work with your locally-running app. If you need access to the auth0 console, email `sjforman@gmail.com`.

#### Set up your database

Run the migrations:

	knex migrate:latest

"Seed" the database with anonymized voter records:

	knex seed:run

These voter records consist of randomized names and addresses. The voter file import process doesn't yet account for different formats from different states. That's a work-in-progress.

#### Run client-side tests

	npm test

#### Run server-side tests

	npm run test-server

Currently, the server must be running for these server-side tests, such as they are, to succeed. I guess they're more like integration tests.

#### Start devloping

	npm run start-dev
