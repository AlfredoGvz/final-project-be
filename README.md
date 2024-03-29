﻿Flush Finder


Welcome to Flush Finder, this is the backend repo of our app. 

We help users find the nearest toilet and includes features like filtering, voting, reviewing and geolocating toilets worldwide.


Table of Contents

1. Installation
2. Dependencies
3. Environment Variables
4. Contact 


1. Installation

To get started with Flush Finder, please follow these steps:

Clone this repository locally.

Install the necessary dependencies using 'npm install'. 

Set up your environment variables in a '.env' files (see section 3).

Run the application using 'npm start'.


2. Dependencies
The following dependencies are required to run Flush Finder:

axios: Promise-based HTTP client for making HTTP requests. /// https://axios-http.com/docs/intro
cors: Middleware for enabling Cross-Origin Resource Sharing (CORS). /// https://www.npmjs.com/package/cors
dotenv: Loads environment variables from a .env file. /// https://www.npmjs.com/package/dotenv
express: Web framework for Node.js. /// https://expressjs.com/en/5x/api.html
mongodb: Official MongoDB driver for Node.js. https://www.mongodb.com/docs/
mongoose: Object Data Modeling (ODM) library for MongoDB. https://mongoosejs.com/docs/api/mongoose.html


3. Environment Variables

MongoDB URI
To obtain the MongoDB URI, please email us at not-a-real-email@gmail.com.

We will provide you with the necessary credentials and URI.

Additionally our application uses environment variables for it's configuration. 

You'll need to create three .env file in the root directory of the project.

Each file will have MONGODB_URI='the_mongodb_uri_we_will_email_you'

i) Development Environment
For development, create a .env.development file in the root directory

ii) Test Environment
For running tests, create a .env.test file in the root directory

iii) Production Environment
For development, create a .env.production file in the root directory


