# Backup e Restauração de Dados PostgreSQL (Somente Dados)

Este passo a passo descreve como **extrair apenas os dados** de um PostgreSQL em produção (rodando em Docker em uma VPS) e **restaurá-los em um PostgreSQL local**, também em Docker.

> ⚠️ **Importante:** este processo **não cria tabelas**. O schema do banco **deve existir previamente** no ambiente local.

## 1️⃣ Verificar containers em execução (Produção)

```bash 
docker ps
```

Identifique o **nome do container PostgreSQL em produção**.

## 2️⃣ Acessar a VPS via SSH

```
bash ssh <Usuário>@<IP>
```

Exemplo:  
```
bash ssh root@212.85.22.208
```

## 3️⃣ Gerar dump SOMENTE DOS DADOS (Produção)

```bash 
docker exec -t <Container Docker em Produção> pg_dump -U <Usuário do BD em Produção> -d <Nome do BD em Produção> --data-only --column-inserts > /opt/backups/postgres/system_data_<Ano, Mês e Dia>.sql
```

Exemplo:  
```bash 
docker exec -t system-psql pg_dump -U cetec -d system_database --data-only --column-inserts > /opt/backups/postgres/system_data_2026_01_19.sql
```

## 4️⃣ Copiar o arquivo da VPS para a máquina local (DA MÁQUINA LOCAL)

```bash
scp <Usuário>@<IP>:/opt/backups/postgres/system_data_<Ano, Mês e Dia>.sql .
```

Exemplo:  
```bash
scp root@212.85.22.208:/opt/backups/postgres/system_data_2026_01_19.sql .
```

## 5️⃣ Verificar containers locais

```bash 
docker ps
```

Identifique o **container PostgreSQL local**.

## 6️⃣ Copiar o dump para dentro do container local

```bash
docker cp system_data_<Ano, Mês e Dia>.sql system-psql:/data.sql
```

## 7️⃣ Restaurar os dados no PostgreSQL local

```bash
docker exec -it <Container Docker Local> psql -U <Usuário do BD Local> -d <Nome do BD Local> -f /data.sql
```

Exemplo:  
```bash
docker exec -it system-psql psql -U postgres -d database -f /data.sql
```

## ✅ Resultado Final

- Todos os **dados do banco de produção** foram inseridos no banco local
- Schema, tabelas e constraints **não são alterados**
- Ideal para **ambiente de testes e desenvolvimento**

## ⚠️ Observações Importantes

- As tabelas **devem existir** no banco local
- Pode haver conflito de chaves primárias se já existirem dados