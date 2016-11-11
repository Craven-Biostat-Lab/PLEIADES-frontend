PLEIADES front-end
========================

The main repository for this project is located here:
https://github.com/Craven-Biostat-Lab/PLEIADES-frontend


This repository has an angular2 app with the front-end for PLEIADES.

See the back-end readme for more documentation:
https://github.com/Craven-Biostat-Lab/PLEIADES-backend



About the angular app
------------------------
When writing code for the front-end, don't modify the .js files in the 'app' folder!  They are automatically generated from the .ts files with the same names, and they will get overwritten.

Take a look at this quickstart and tutorial to learn about angular2:
https://angular.io/docs/ts/latest/quickstart.html
https://angular.io/docs/ts/latest/tutorial/


Structure
---------------------
The angular app (in the 'app' folder) consists of the following pieces:

Modules:
- AppModule: The only module for this app, just loads the AppComponenet.  When you create new components or providers, you have to add them to this .ts file.

Components:
- AppComponent: loads the app, and includes the router, doesn't do much else.
    - ArticleListComponent: The front page of the app, lists articles for the user to edit.
    - ArticleDatumsComponent: For one article, show the datums and let the user select a datum to edit.
        - ArticleTextComponent: Shows the article text in an iframe, and handles interaction with TextHighlighter.js.

Services:
- ArticleService: Fetches articles and datums from the back-end.
- DatumEditService: Handles communication between ArticleDatumsComponent and ArticleTextComponent, and submits user edits to the back-end.

Data classes:
- Article: Contains citation information, and optionally a list of highlight objects from TextHighlighter.js
- Datum: Contains a datum ID and list of highlights.
- TreatmentEntity: Represents one treatment entity, and contains datums for that treatment entity grouped by treatment-type and treatment-test.


Installation
----------------------
Angular 2 requires node v4.x.x or higher and npm 3.x.x or higher.

Install dependencies with "npm install."


Compilation
-----------------------
When running the back-end in debug mode, the back-end bottle script will automatically compile the front-end for you.

Compile the node app with 'npm run tsc'.  Or, you can set it to watch for changes and automatically recompile by running "npm run start-noserver".
