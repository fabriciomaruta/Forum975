# Forum975
Forum for a software engeneering class

##TO INSTALL :

###1.Instalação do Node.js: https://nodejs.org
> sudo su
 apt-get install nodejs
 apt-get install npm


###2. Instalação dos pacotes principais do Node.js:
> sudo su
 npm install express --save
 npm install body-parser --save
 npm install cookie-parser --save
 npm install -g express-generator
 npm install mongoose --save
 npm install serve-favicon --save
 npm install frisby --save
 npm install -g jasmine-node


###3. Instalação do banco de dados MongoDB
> sudo su
 apt-get install mongodb
 mkdir /data
 mkdir /data/db

Editar /etc/init.d/mongod e acrescentar --smallfiles no final da linha
--exec $NUMACTL $DAEMON $DAEMON_OPTS

depois:
 service mongodb stop
 service mongodb start


###4. Aplicação Hello World em Node.js:
Vamos criar, para fins de teste da instalação, uma aplicação tipo
Hello World em Node.js:

> mkdir NodeJS
> cd NodeJS
> express Hello
> cd Hello
> npm install
> npm start

