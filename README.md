[Vote Forward](https://votefwd.org) works to increase U.S. voter turnout using behavioral science and the U.S. Postal Service. We provide the tools for citizens to "adopt" registered but unlikely voters in swing states, and send them (partially) hand-written letters encouraging them to vote.

If you want to send letters, visit the [actual website](https://votefwd.org). Thank you!

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

If you already have postgres installed via Homebrew but not configured, or not
running via `launchctl`, you can see the post-install directions again with:

  brew info postgresql

#### Set up development environment

Install git if necessary and clone the repo:

	brew install git
	git clone https://github.com/sjforman/votefwd.git

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
  	REACT_APP_SQL_USER=<YOURUSERNAME>
  	REACT_APP_SQL_PASSWORD=<YOURPASSWORD>
  	REACT_APP_SQL_DATABASE=votefwd
  	REACT_APP_DATABASE_DIALECT=postgres
	REACT_APP_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
	REACT_APP_RECAPTCHA_SECRET=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
	
(you  might notice we have a REACT_APP_RECAPTCHA_SECRET but that is the [default google test one](https://developers.google.com/recaptcha/docs/faq), so this is not actually sensitive)

#### Optional Environment variables

The node package that uses these to generate unique pledge codes for each letter has sensible defaults, but you can override
them if you need to. (We do so in deployed environments):

  	REACT_APP_HASHID_SALT=<ANY_STRING_OR_BLANK>
  	REACT_APP_HASHID_DICTIONARY=<CHARACTER SET>

#### Google Cloud Platform Storage

We use GCP to store PDFs of generated plea letters. Email `scott@votefwd.org` to request access to the project on GCP. Then visit the [GCP console](https://console.cloud.google.com/apis/credentials?project=voteforward-198801) and create a JSON `service account key`. Move this file to the root directory of your repo and rename it `googleappcreds.json`.

#### Auth0

We use [Auth0](https://auth0.com/) for user authentication and management. You shouldn't need anything other than the (non-sensitive) `CLIENTID` in your `.env` file to make authentication work with your locally-running app. If you need access to the auth0 console, email `scott@votefwd.org`.

#### Set up your database

Run the migrations:

	knex migrate:latest

"Seed" the database with anonymized voter records:

	knex seed:run

These voter records consist of randomized names and addresses.

#### Start devloping

	npm run start-dev

#### Run client-side tests

	npm test

#### Run server-side tests

Note: currently, the server must be already running for these server-side tests, such as they are, to succeed.

	npm run test-server
