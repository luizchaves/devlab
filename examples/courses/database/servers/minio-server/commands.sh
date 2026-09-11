#!/bin/bash
# Comandos de exemplo para o MinIO Client (mc)

# 1. Configurar o alias local
mc alias set local http://localhost:9000 minioadmin miniopassword123

# 2. Criar um bucket para a aplicação
mc mb local/invest-uploads

# 3. Listar buckets
mc ls local

# 4. Fazer upload de um arquivo de exemplo
echo "Documento de Investimento" > comprovante.txt
mc cp comprovante.txt local/invest-uploads/docs/comprovante.txt

# 5. Listar o conteúdo do bucket
mc ls local/invest-uploads/docs/

# 6. Gerar uma URL pré-assinada de download válida por 30 minutos (1800 segundos)
mc share download --expire 30m local/invest-uploads/docs/comprovante.txt

# 7. Configurar política de acesso público para leitura de avatares
mc mb local/avatars
mc anonymous set download local/avatars
