# CMPT470-VanEat-Group13

VanEat is an website designed for Vancouver local restuarant guide, user can search restaurants by category, leave reviews and rates. 

# Installation

  - CMPT470-VanEat-Group13 requires Node.js to run
  - clone the repository from github and install all the backages
    ```sh
    $ git clone git@csil-git1.cs.surrey.sfu.ca:yha150/cmpt470-vaneat-group13.git
    $ cd cmpt470-vaneat-group13/
    $ git submodule update --init --recursive
    ```
  - Run docker image to active the website, make sure you have docker and docker-compose installed
    ```sh
    $ docker-compose build && docker-compose run
    ```

#Website functionality

FrontEnd
 - User login with Google account, Facebook account or create account using email
 - Search restaurants
 - Restaurants Category
 - Show restaurant location using Google API
 - user leave reviews and rate for the restaurant
 
BackEnd
 - Admin signup and login
 - Admin have access to create categories, restaurants, and popular dishes for each restaurant
 - Admin has access to view all users
 - Admin has access to view all restaurants detail information

Interaction
 - User sign up and store user informations in database
 - Upload review with images
 - User get restaurant informations

### Tech

Dillinger uses a number of open source projects to work properly:

* [React](https://reactjs.org/) - Frontend
* [MongoDB](https://www.mongodb.com/) - Restaurants, users, admins, categories, dishes, reviews data storage
* [AWS s3](https://aws.amazon.com/s3/) -image data storage
* [node.js] - evented I/O for the backend
* [Express] - backend node.js network app framework
* [jQuery] - backend events



### Docker
VanEat is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.

Frontend website is running on http://localhost:3000

Backend website is running on http://localhost:8080 


# account

backend user: asd
passwor: asdfgh

backend user: ggbaker@sfu.ca
passwor: ggbakergood

frontend user ggbaker@sfu.ca
password: ggbakergood