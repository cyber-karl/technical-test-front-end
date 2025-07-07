## About Software Development @ Cyberhawk



## The task
We've designed this task to try and give you the ability to show us what you can do and hopefully flex your technical and creative muscles. You can't show off too much here, show us you at your best and wow us!

To make things as simple as we could, we've opted to use [Laravel Sail](https://laravel.com/docs/8.x/sail) to provide a quick and convenient development environment, this will require you to install
[Docker Desktop](https://www.docker.com/products/docker-desktop) before you can start the test. We've provided [some more detailed instructions](#setting-everything-up) below in case this is your first time using Docker or Sail.

We'd like you to build the front-end of an application that will display an example wind farm, its turbines and their components and inspections.
We'd like to be able to see components and their grades (measurement of damage/wear) ranging between 1 - 5.

We've provided a pre-built API and an API spec document `api-spec.yaml` that we'd like you to consume to provide the functionality requested.

Don't be afraid of submitting incomplete code or code that isn't quite doing what you would like, just like your maths teacher, we like to see your working.
Just Document what you had hoped to achieve and your thoughts behind any unfinished code, so that we know what your plan was.

### Requirements
- Display a list of farms, turbines, components, inspections and grades
- Each Turbine should have a number of components
- A component can be have a grade from 1 to 5 (1 being perfect and 5 being completely broken/missing) via an inspection
- Conform to the spec provided in the `api-spec.yaml` file in the root of this project.

### Bonus Points
- Great UX/UI
- Use of React JS
- Use of Tailwind CSS
- Use of 3D
- Use of a web map technology in the display of the data
- Automated tests
- API Authentication
- API Authorization
- Use of coding style guidelines (we use PSR-12 and AirBnb)
- Use of git with clear logical commits
- Specs/Plans/Designs

### Submitting The Task
Ideally you will fork this repo, work on it then email us with details of where to access it.
Alternatively you can download locally and email us a zip of your completed work.

## Setting Everything Up
As mentioned above we have chosen to make use of Laravel Sail as the foundation of this technical test.
- If you haven't already, you will need to install [Docker Desktop](https://www.docker.com/products/docker-desktop).
- One that is installed your next step is to install this projects composer dependencies (including Sail).
    - This will require either PHP 8 installed on your local machine or the use of [a small docker container](https://laravel.com/docs/8.x/sail#installing-composer-dependencies-for-existing-projects) that runs PHP 8 that can install the dependencies for us.
- If you haven't done so already copy the `.env.example` file to `.env`
    - If you are running a local development environment you may need to change some default ports in the `.env` file
        - We've already changed mysql to 3303 and NGINX to 8382 for you
- It should now be time to [start Sail](https://laravel.com/docs/8.x/sail#starting-and-stopping-sail) and the task
- There is a file in the root of this project called `api-spec.yaml` this can be imported into your application of choice to ensure you're building your application to the spec that we're expecting. Some notable applications are:
  - Postman
  - Swagger
  - StopLight

- You can seed the pre-built API using the commands:
  - `sail artisan migrate --seed`


### Installing Composer Dependencies
https://laravel.com/docs/9.x/sail#installing-composer-dependencies-for-existing-projects
```bash
docker run --rm \
-u "$(id -u):$(id -g)" \
-v $(pwd):/var/www/html \
-w /var/www/html \
laravelsail/php81-composer:latest \
composer install --ignore-platform-reqs
```

### Quick Tips
- Don't run npm/composer from your host, always run it via the sail command
  - This is because the docker container may not be able to write to the filesystem after you do so
- Ensure you have a valid .env file before starting sail for the first time.
  - Sail creates a docker volume which is persistent, so stopping/starting sail will not affect/fix issues in a volume (missing DB etc)

## Your Notes
This is a place for you to add your notes, plans, thinking and any feedback you have for us of the task, please feel free to include whatever you like here, we'll make sure to read it.

To run the frontend project:

```bash
cd three-react
npm i
npm start
```

Picked up the Front End Interview Task to show skill development while working at CH.
Came up with the idea to display data from the database in a 3D environment.
In order to do this, I decided to use ThreeJS technology to display a 3D model in the browser.
From there, I was able to create a 3D environment with a camera and controller to look and move around the Scene.

I initially followed the basic setup for ThreeJS using vanilla JS, however this would not integrate well into
CH current platform. I then chose to refactor the code into a Create-React-App starter with React Components.
From there, I was able to load the data into state using FetchAPI, and work with it to display a 3D farm with windmills.

Lastly, I added in a hover feature so that you can move your mouse cursor over the rendered windmill and see specific
information about it. This required some techniques in the back end to not overload on the amount of requests being sent
such as back-off functionality and response caching.

