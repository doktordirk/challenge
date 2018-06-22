# aurelia-challenge

A sample aurelia-cli-webpack-babel-scss project

## Install, build, test

### Install

* Requirements: nodejs 8+, yarn, [aurelia-cli](https://www.npmjs.com/package/aurelia-cli)
* From your shell in the folder run `yarn install`

### Build and run

* Build and serve at localhost:8080: `au run --watch`
* Production build to `dist` folder: `au build --env prod`

### Tests

* Webpack Bundle Analyser: `au run --analyse --env prod`
* Unit test + coverage report in `test/coverage-karma/`: `au karma`
* E2E test: `nps e2e`

## What's included

Other than the required functionally, nothing can be considered fully done.

### User experience

* Functionality as per specs: **done**
  - display persons in a sortable filtered table with their attributes
    - feedback if all persons are filtered
    - feedback if person list is empty
  - inline updating of attributes and removal of persons with confirmation
  - add new persons to the list
    - sorted to the right position with highlighting
    - user feedback if added person will not be listed with current filter
  - filters activated per routes
    - filter links provided bellow the table if applicable
    - includes a link to 'total' list (as I would expect as a user)
  - Person statistics provided in a sidebar
    - only shows applicable statistics
    - statistics link to filtered tables views
* Input validation: **partially done**
  - (+) validates min and max name length with feedback
  - (-) does not validate uniqueness of names
* Accessibility: **partially done**
  - (+) some use of aria attributes
  - (-) screen reader friendliness not tested 
* Browser-compatibility: **not tested**
* Responsiveness: **partially done**
  - (+) elements arrange for different screen sizes
  - (-) table doesn't fit if bellow 500px screen width
* Overall design: **partially done**
  - (+) all is where expected and appropriate user action feedback is provided
  - (-) bland theme
* Build size optimization: **partially done**
  - (+) no usage of a table plugin reduces build size
  - (+) uses aurelia-cli's minification setup
  - (-) not all unneeded modules are excluded from the build

### Extensibility and maintainability

* Splitting of features into appropriate modules: **partially done**
  * (+) most services and components are separated
  * (-) table could be split into table, row and cell modules
* Extensibility of available person attributes: **partially done**
  * (+) easily extensible as they are are separated into `config/person-schema`
  * (-) no tests for schema integrity
  * (-) e2e tests not automatically adapted for available attributes
* Internationalization: **partially done**
  * (+) I18N used for texts
  * (-) No locale switcher
  * (-) Not tested for RTL
* Ease of styling: **partially done**
  * (+) scss setup
  * (-) no mixins used
* Testing: **partially done**
  * (+) unit tests
  * (+) e2e tests
  * (-) some tests are missing, eg. component tests
  * (-) no ci setup eg travis, cicleCI
  * (-) use of a better e2e testing framework
* Documentation: **partially done**
  * (+) docblocks provided
  * (-) no api documentation generated
  * (-) no changelog generated
* Automated build: **partially done**
  * (+) aurelia-cli's webpack already does most
  * (+) locales kept in separated chunks and made available in the `dist` folder
  * (-) repository not setup with automated lint test, ci, stalebot, ...

Note: 
In the rxjs branch is a version which uses aurelia-store and observables. Only the e2e test has been adapted.
