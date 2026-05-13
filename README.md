# System

API desenvolvida em **Django REST Framework**, com autenticação via **JWT**, e React para gerar lado do Client.  
O projeto roda dentro de containers **Docker** para facilitar o desenvolvimento e a implantação.

## Iniciar Projeto

Para iniciar o projeto, vá para o diretório `docker`:

```Shell
$ cd docker
```

E então para iniciá-lo de forma local, basta dar o comando:

```Shell
$ sudo docker-compose up --build
```

Caso deseje o projeto em produção, basta dar o comando:

```Shell
$ docker-compose -f docker-compose.prod.yml up --build
```

> OBS: Para sincronizar o repositório em produção com o em núvem, mantendo as modificações de produção, ou seja, as configurações e `.env`, basta executar o comando `git pull --rebase --autostash`.

## Atualizar Projeto em VPS

Para iniciar o processo de atualização, vá para o diretório `docker`:

```Shell
$ cd /opt/System/docker
```

Puxe todas as atualizações presentes na branch de produção `main` do Github (Ignorando o `.env`):

```Shell
$ sudo git pull --rebase --autostash
```

E então para derrubar os containers que estão no ar, basta dar o comando:

```Shell
$ sudo docker-compose down
```

Segue-se então para a limpeza dos resquicios dos containers antigos, com o comando:

```Shell
$ sudo docker system prune -a --volumes -f
```

Finalmente, para por em produção, basta dar o comando:

```Shell
$ sudo docker-compose -f docker-compose.prod.yml up --build
```

## Documentação e Endpoints

Após subir o projeto, você pode acessar a documentação interativa da API:

- **Swagger UI:**  
  [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)

- **ReDoc:**  
  [http://127.0.0.1:8000/redoc/](http://127.0.0.1:8000/redoc/)
