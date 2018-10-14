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
	REACT_APP_SQL_USER=<YOURUSERNAME>
	REACT_APP_SQL_PASSWORD=<YOURPASSWORD>
	REACT_APP_SQL_DATABASE=votefwd
	REACT_APP_DATABASE_DIALECT=postgres
	REACT_APP_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
	REACT_APP_RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
	REACT_APP_SLACK_WEBHOOK_URL=<LEAVEBLANK>
	REACT_APP_JWT_SECRET=eXB62QzaWp54hrjHtyfYJVgwr5NJNZ5dCRf43wEj

You might notice we have a REACT_APP_RECAPTCHA_SECRET but that is the [default google test one](https://developers.google.com/recaptcha/docs/faq), so this is not actually sensitive.

You can leave the slack webhook URL blank unless you are working on the Slack
integration, in which case, contact Scott.

#### Optional Environment variables

The node package that uses these to generate unique pledge codes for each letter has sensible defaults, but you can override
them if you need to. (We do so in deployed environments):

  	REACT_APP_HASHID_SALT=<ANY_STRING_OR_BLANK>
  	REACT_APP_HASHID_DICTIONARY=<CHARACTER SET>

We limit the number of PDFs that can be generated concurrently to prevent the
PDF generation processes from using up all memory on the VM.  The sensible
default is 20, but you can override it to anything you want:

   	PDF_GEN_LIMIT=<AN INTEGER>

Volunteers are limited to a adopting a certain number of voters when they are
merely "qualified." They can adopt more when they become "super-qualified." By
default these thresholds are 100 and 5000, respectively, but you can set them as
follows:

    REACT_APP_QUAL_NUM=<AN INTEGER>
    REACT_APP_SUPERQUAL_NUM=<AN INTEGER>

To send data to Google Analytics, set up

    REACT_APP_GA_TRACKING_ID=<A VALID GOOGLE TRACKING ID>
    REACT_APP_GA_DEBUG=<true | false>

#### Auth0

We use [Auth0](https://auth0.com/) for user authentication and management. You shouldn't need anything other than the (non-sensitive) `CLIENTID` in your `.env` file to make authentication work with your locally-running app. If you need access to the auth0 console, email `scott@votefwd.org`.

#### Set up your database

Run the migrations:

	knex migrate:latest

Load the ZIP lookup data. From the `psql` command prompt:

  	\copy lu_zip FROM ./lookup_data/lu_zip.csv with (format csv, header true, delimiter ',');

Load the catalist data. From the `psql` command prompt:

  	\copy catalist_raw FROM ./seed_data/catalist.csv with (format csv, header true, delimiter ',');


Load the district data:

 	\copy districts(district_id, state, state_abbr, district_num, description, lat, long, coordinates, return_address, ra_city, ra_state, ra_zip, why_this_district, display_name, url_election_info, url_wikipedia, url_ballotpedia, url_swingleft) from './lookup_data/districts.csv' with (FORMAT csv, header true, delimiter ',');

"Seed" the database with anonymized voter records:

	knex seed:run

These voter records consist of randomized names and addresses.

#### Make a new database migration

`knex migrate:make <migration_file_name>`.  Naming examples in the /migrations folder.  Note you dont need the datestring or the .js, so you can do a name like `add_index_on_qual_state_for_users`.

`knex migrate:latest` to apply it and `knex migrate:rollback` to go back.

#### Start devloping

	npm run start-dev


#### Run server-side tests

Note: if you run this with the dev server running you will get a localhost:3001 error on a test.  Stop the `npm run start-dev` to fix.

	npm run test-server

#### If you're updating SCSS files

Make sure to update SCSS files and not the compiled CSS files. Note that building CSS requires node-sass to be installed on your machine:

	npm install -g node-sass

To compile, run this script in a second tab in your terminal:

	npm run scss-compile
