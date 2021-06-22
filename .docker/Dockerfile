FROM php:7.4-fpm

ARG user
ARG uid

ENV XDEBUG_CONFIG remote_host=host.docker.internal


# Dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composer
COPY --from=composer:latest /usr/bin/composer  /usr/bin/composer
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Xdebug
RUN pecl install xdebug
ADD Xdebug/configXdebug.sh /var/www/configXdebug.sh
RUN sh /var/www/configXdebug.sh



# set WORKDIR
WORKDIR /var/www

USER $user
