# ==============================================================================
# DOCKERFILE - GRUPO ELOIZIO (Apache + PHP 8.2 + PostgreSQL 16 Driver)
# Domínio: grupoeloizio.com.br
# ==============================================================================
FROM php:8.2-apache

# 1. Instalar dependências do sistema e bibliotecas para PostgreSQL, cURL, GD e ZIP
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libcurl4-openssl-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    ca-certificates \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        curl \
        gd \
        zip \
        bcmath \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. Habilitar mod_rewrite do Apache para URLs amigáveis (.htaccess e /api/*)
RUN a2enmod rewrite headers

# 3. Configurar diretório de trabalho padrão do Apache
WORKDIR /var/www/html

# 4. Copiar código da aplicação para a pasta pública
COPY php-dist/ /var/www/html/

# 5. Ajustar permissões para o Apache (www-data) gravar logs e cache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# 6. Expor porta interna do Apache
EXPOSE 80

# 7. Iniciar Apache em primeiro plano
CMD ["apache2-foreground"]
