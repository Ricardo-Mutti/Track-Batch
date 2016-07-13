# Backend Bowl

### Coisas úteis

    Developer:
    Public DNS: ec2-54-210-71-210.compute-1.amazonaws.com
    AWS: ssh -i BackendBootstrap.pem ubuntu@ec2-54-210-71-210.compute-1.amazonaws.com

    Production:
    Public DNS: ec2-52-201-135-248.compute-1.amazonaws.com
    AWS: ssh -N -L 8888:127.0.0.1:80 -i InterUSP.pem ubuntu@ec2-52-201-135-248.compute-1.amazonaws.com

    Url admin:
    http://ec2-52-201-135-248.compute-1.amazonaws.com:8080/
###[RockMongo](http://127.0.0.1:8888/rockmongo/index.php?action=login.index&host=0): 
 
    ssh -N -L 8888:127.0.0.1:80 -i BackendBootstrap.pem ubuntu@ec2-54-210-71-210.compute-1.amazonaws.com

    ssh -N -L 8888:127.0.0.1:80 ubuntu@ec2-54-210-71-210.compute-1.amazonaws.com
   
    http://127.0.0.1:8888/rockmongo/index.php?action=login.index&host=0
 
    user: Appsimples
    senha: amazonapp123654

  
## Instalação

Dê clone no repositório e execute `npm install` na pasta do projeto para 
instalar as dependências

## Rodando o Banco de Dados

### Instale o MongoDB

https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
com Homebrew
    brew update
    brew install mongodb
### Make diretório do db

    sudo mkdir -p /data/db
### Entre na pasta do mongo

    cd /usr/local/Cellar/mongodb/
    
### Veja versão do mongo
     
      ls
### Entre na pasta da versão (ex=3.2.4)

       cd 3.2.4
### Entre na pasta bin

    cd bin
### Execute o comando
   
    sudo mongod
### Se deu tudo certo até agora algo assim deve ser retornado:
    
    2016-05-06T13:46:02.767-0300 I CONTROL  [initandlisten] ** WARNING: You are running this process as the                    root user, which is not recommended.
    2016-05-06T13:46:02.767-0300 I CONTROL  [initandlisten]
    2016-05-06T13:46:02.767-0300 I CONTROL  [initandlisten]
    2016-05-06T13:46:02.767-0300 I CONTROL  [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000
    2016-05-06T13:46:02.781-0300 I NETWORK  [HostnameCanonicalizationWorker] Starting hostname canonicalization worker
    2016-05-06T13:46:02.781-0300 I FTDC     [initandlisten] Initializing full-time diagnostic data capture with directory '/data/db/diagnostic.data'
    2016-05-06T13:46:02.783-0300 I NETWORK  [initandlisten] waiting for connections on port 27017
    2016-05-06T13:47:58.815-0300 I NETWORK  [initandlisten] connection accepted from 127.0.0.1:49511 #1 (1 connection now open)
    2016-05-06T14:01:09.098-0300 W NETWORK  [HostnameCanonicalizationWorker] Failed to obtain name info for: [   (192.168.0.105, "nodename nor servname provided, or not known"), (192.168.0.105, "nodename nor servname   provided, or not known") ] 

### Agora em outro terminal entre na mesma pasta (bin) e rode :

    mongo
### Se deu tudo certo até agora algo assim deve ser retornado:

    MongoDB shell version: 3.2.4
    connecting to: test
    Server has startup warnings:
    2016-04-11T08:36:58.867-0300 I CONTROL  [initandlisten] ** WARNING: You are running this process as the         root user, which is not recommended.
    2016-04-11T08:36:58.867-0300 I CONTROL  [initandlisten]
    2016-04-11T08:36:58.867-0300 I CONTROL  [initandlisten]
    2016-04-11T08:36:58.867-0300 I CONTROL  [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000
### Crie o banco local do projeto (ex:swapped)
    
    use swapped
### Se o db realmente foi criado a seguinte mensagem aparecerá:
    
    switched to db swapped
### Faça o primeiro insert no bd

    db.test.save({nome:"teste"})
### Se for realmente gravado aparecerá a seguinte mensagem:

    WriteResult({ "nInserted" : 1 })
### Na pasta do projeto do backend, execute:

    node app.js
### Se o servidor realmente estiver rodando aparecerá a seguinte mensagem avisando a porta do servidor:

    Express server listening on port 3000
### Nesse caso então o servidor se encontra na seguinte url:

    http://localhost:3000/
### Caso ocorra alguma modificação no servidor salvar o(s) arquivo(s) modificados, ir no terminal:
   
    ctrl+c (no mac tmb) -  Pra finalizar o processo e fechar o servidor 
    node server.js - Para rodar o servidor de novo 
### Principais comandos do Mongo
    
    show dbs - Mostra os dbs do mongo
    show collections -  Mostra as tabelas no db
    use DB_NAME - Entra no db que voce quer usar, se nao tiver ele cria
    db.TABLE_NAME.find()  - Mostra a tabela
    db.TABLE_NAME.save({nome:"teste"}) - Grava informações na tabela
    db.dropDatabase() - Apaga o banco inteiro, tem que dar use nome_db de novo
### Acesso remoto do mongodb 

    Caso o banco esteja rodando em uma máquina que está conectada na sua rede, basta ir no arquivo config.js
    do projeto e apontar para a url da máquina + a porta.

### Acesso remoto do Mongo
Isso serve pra você usar o seu computador como servidor, para que todos na mesma rede acessem o mongo através do seu IP.  

### Banco rodando em uma máquina na rede:

    Caso o banco esteja rodando em uma máquina que está conectada na sua rede, basta ir no arquivo config.js
    do projeto e apontar para a url da máquina + a porta.

### Banco rodando em uma máquina remota:
### Pegue o IP do seu computador na rede que é geralmente:
  
    198.168.0.xxx
    
### Chegar na pasta etc (use cd ../)
   
    cd /usr/local/etc

### Abrir o arquivo mongod.config

    nano mongod.conf

### Acrescentar o seu IP como acesso remoto (ex:198.168.0.121):

    systemLog:
       destination: file
       path: /usr/local/var/log/mongodb/mongo.log
       logAppend: true
    storage:
       dbPath: /usr/local/var/mongodb
    net:
       bindIp: 127.0.0.1,**192.168.0.121**

## Arquitetura do projeto
    
    server.js           --> Configuração do server (dependências, endpoints...)
    package.json        --> Configuração de dependências a serem instaladas pelo npm
    public/             --> arquivos do frontend de testes (blog)
      css/              --> css files
        app.css         --> default stylesheet
      img/              --> image files
      js/               --> javascript files
        app.js          --> declaração do app em Angular.js
        controllers.js  --> application controllers
        directives.js   --> custom angular directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
        lib/            --> angular and 3rd party JavaScript libraries
          angular/
            angular.js            --> the latest angular js
            angular.min.js        --> the latest minified angular js
            angular-*.js          --> angular add-on modules
            version.txt           --> version number
    routes/
      api.js            --> descrição das funcionalidades dos endpoints
      index.js          --> route for serving HTML pages and partials
      env.js            --> seta mongoURI dependendo do ambiente
    views/
      index.jade        --> main page for app
      layout.jade       --> doctype, title, head boilerplate
      partials/         --> angular view partials (partial jade templates)
        partial1.jade
        partial2.jade
## Editando Endpoints

Para editar os endpoints altere dois arquivos: api.js (adicione a funcionalidade do endpoint) e 
server.js (adicionando endereço do endpoint e linkando o método no JSON API)

## Envio de emails

Utilizamos o modulo https://nodemailer.com/

## Configurações AWS

### Credenciais MongoDB

    admins:

     User: root
     Password: SSSvGALha2Br

     User: appsimples
     Password: amazonapp123654

    banco backendBootstrap:

     User: backendBootstrap
     Password: amazonapp123654

### Acessar o banco

    sudo mongo admin --username *seu username* --password *sua senha*

### Reiniciar mongo, ir na pasta stack:

    sudo bash ctlscript.sh restart mongodb

### Acessando o server na Amazon via SSH:
    
### Crie uma permissão de acesso da sua máquina, execute o aquivo .pem (apenas a primeira vez):
    
    chmod 400 **path para projeto**/resources/ConceitoA.pem
    
### Acesse a máquina, execute o arquivo .pem e coloque a url da amazon:
    
    ssh -i **path para projeto**/resources/**BackendBootstrap**.pem ubuntu@ec2-54-210-71-210.compute-1.amazonaws.com

### Caso a máquina foi acessada com sucesso a seguinte mensagem aparecerá:

    Welcome to Ubuntu 14.04.4 LTS (GNU/Linux 3.13.0-77-generic x86_64)
    *** System restart required ***
       ___ _ _                   _
      | _ |_) |_ _ _  __ _ _ __ (_)
      | _ \ |  _| ' \/ _` | '  \| |
      |___/_|\__|_|_|\__,_|_|_|_|_|

    *** Welcome to the Bitnami MEAN 3.2.3-0            ***
    *** Bitnami Wiki:   https://wiki.bitnami.com/      ***
    *** Bitnami Forums: https://community.bitnami.com/ ***
    Last login: Thu Apr 28 20:15:56 2016 from 200.136.53.130

### Entra na pasta do projeto:

    cd apps/swapped

### Para atualizar o projeto basta dar um pull do repositório remoto
  
    sudo git pull 

### Depois de atualiza o projeto rode o projeto na AWS
O projeto usa forever.js para rodar o script continuamente na máquina, mesmo após você terminar sua sessão (https://github.com/foreverjs/forever) vá na pasta do projeto:

    forever start app.js

### Public DNS (URL de acesso remoto)

    ec2-54-210-71-210.compute-1.amazonaws.com
    (muda toda vez que reiniciamos a máquina da AWS)

### GUI Banco de dados - Rockmongo

    para acessar vá na sua maquina:
      ssh -N -L 8888:127.0.0.1:80 -i *path para projeto*/resources/ConceitoA.pem ubuntu@ec2-52-0-86-117.compute-1.amazonaws.com
   obs: nao vai mostrar nenhum resultado no terminal

    acesse: http://127.0.0.1:8888/rockmongo
## Credenciais de acesso S3

Access Key ID: AKIAJ7CRDDV6OIRPX7PA
Secret Access Key: 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

## passphrase ssh da maquina Bowl/interusp

amazonapp123654