[![Cover](https://raw.githubusercontent.com/amowu/hkt48-taiwantour/fa05c5902cb46e93816b021425c39fe72c40501f/public/modules/core/img/brand/logo.png)

[![Build Status](https://travis-ci.org/amowu/hkt48-taiwantour.svg)](https://travis-ci.org/amowu/hkt48-taiwantour)
[![Dependencies Status](https://david-dm.org/amowu/hkt48-taiwantour.svg)](https://david-dm.org/amowu/hkt48-taiwantour)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/amowu/hkt48-taiwantour?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# HKT48台灣應援網站

![Logo](https://raw.githubusercontent.com/amowu/hkt48-taiwantour/develop/public/modules/core/img/brand/64x64.png)

介紹以福岡‧博多為根據地的日本少女偶像團體HKT48之成員的網站。

## Before You Begin 

Before you begin we recommend you read about the basic building blocks that assemble a MEAN.JS application: 

MEAN.JS is a full-stack JavaScript open-source solution, which provides a solid starting point for [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications. The idea is to solve the common issues with connecting those frameworks, build a robust framework to support daily development needs, and help developers use better practices while working with popular JavaScript components. 

* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), particularly [The Express Guide](http://expressjs.com/guide.html); you can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.

## Prerequisites

Make sure you have installed all these prerequisites on your development machine.

* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [Github Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

## Downloading Project

There are several ways you can get the MEAN.JS boilerplate: 

### Cloning The GitHub Repository

You can also use Git to directly clone the project repository:

```
$ git clone https://github.com/amowu/hkt48-taiwantour.git
```

This will clone the latest version of the project repository to a **hkt48-taiwantour** folder.

### Downloading The Repository Zip File

Another way to use the MEAN.JS boilerplate is to download a zip copy from the [master branch on github](https://github.com/meanjs/mean/archive/master.zip). You can also do this using `wget` command:
```
$ wget https://github.com/amowu/hkt48-taiwantour/archive/master.zip -O hkt48-taiwantour.zip; unzip hkt48-taiwantour.zip; rm hkt48-taiwantour.zip
```
Don't forget to rename **hkt48-taiwantour-master** after your project name.

## Quick Install

Once you've downloaded the project and installed all the prerequisites, you're just a few steps away from starting to develop your application.

The first thing you should do is install the Node.js dependencies. The boilerplate comes pre-bundled with a package.json file that contains the list of modules you need to start your application, to learn more about the modules installed visit the NPM & Package.json section.

To install Node.js dependencies you're going to use npm again, in the application folder run this in the command-line:

```
$ npm install
```

This command does a few things:

* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower installcommand to install all the front-end modules needed for the application

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)

![B1gpCDGCYAAUacy.jpg](https://pbs.twimg.com/media/B1gpCDGCYAAUacy.jpg)
![B1gpCFhCEAAa5Z7.jpg](https://pbs.twimg.com/media/B1gpCFhCEAAa5Z7.jpg)

That's it! your application should be running by now, to proceed with your development check the other sections in this documentation. 
If you encounter any problem try the Troubleshooting section.

## Development and deployment With Docker

* Install [Docker](http://www.docker.com/)
* Install [Fig](https://github.com/orchardup/fig)

Local development and testing with fig: 

```bash
$ fig up
```

Local development and testing with just Docker:

```bash
$ docker build -t mean .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
```

To enable live reload forward 35729 port and mount /app and /public as volumes:

```bash
$ docker run -p 3000:3000 -p 35729:35729 -v /Users/mdl/workspace/mean-stack/mean/public:/home/mean/public -v /Users/mdl/workspa/mean-stack/mean/app:/home/mean/app --link db:db_1 mean
```

## Getting Started With MEAN.JS

You have your application running but there are a lot of stuff to understand, we recommend you'll go over the [Offical Documentation](http://meanjs.org/docs.html). 
In the docs we'll try to explain both general concepts of MEAN components and give you some guidelines to help you improve your development procees. We tried covering as many aspects as possible, and will keep update it by your request, you can also help us develop the documentation better by checking out the *gh-pages* branch of this repository.

## Live Example

Browse the live project example on [http://www.tpe48.com.tw/hkt48](http://www.tpe48.com.tw/hkt48).

## Credits

本網站純為個人興趣產物，並非為營利行為所創作。建立者並無因此獲得任何利益。
本站所提供的所有文章與圖片之著作權/肖像權皆屬該權利所有人之物。
本站無任何侵害權利之目的。

このサイトは、趣味によりものであり、営利的な目的のものではありません。
創設者その他が利益を得ることは一切ありません。
コンテンツとして提供する全ての文章、画像について著作権/肖像権等は各権利所有者に帰属します。
権利を侵害する目的は一切ありません。

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
