FROM php:8.2-apache

# Set environment variables.
ENV ACCEPT_EULA=Y

# mix
RUN apt-get update \
  && apt-get install -y build-essential zlib1g-dev default-mysql-client curl gnupg procps vim git unzip libzip-dev libpq-dev \
  && docker-php-ext-install zip pdo_mysql pdo_pgsql pgsql

# Enable Apache modules required for Laravel.
RUN a2enmod rewrite

# intl
RUN apt-get install -y libicu-dev \
  && docker-php-ext-configure intl \
  && docker-php-ext-install intl

# gd
RUN apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev && \
docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ && \
docker-php-ext-install gd

# redis
# RUN pecl install redis && docker-php-ext-enable redis

# pcov
# RUN pecl install pcov && docker-php-ext-enable pcov

# Xdebug
RUN pecl install xdebug \
&& docker-php-ext-enable xdebug \
&& echo ";zend_extension=xdebug" > /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Node.js, NPM, Yarn
# RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
# RUN apt-get install -y nodejs
# RUN npm install npm@latest -g
# RUN npm install yarn -g

# Composer
#RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
#RUN php composer-setup.php
#RUN php -r "unlink('composer-setup.php');"
#RUN mv composer.phar /usr/local/bin/composer
#
#ENV COMPOSER_ALLOW_SUPERUSER 1
#ENV COMPOSER_HOME /composer
#ENV PATH $PATH:/composer/vendor/bin
#RUN composer config --global process-timeout 3600

# Set the Apache document root
ENV APACHE_DOCUMENT_ROOT /var/www/html/api/v1/web
ENV APACHE_DOCUMENT_ROOT_NPM /var/www/html/build

# Update the default Apache site configuration
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf
COPY apache-config-npm.conf /etc/apache2/sites-available/vilemis.localhost.conf



# Expose port 80 for Apache.
EXPOSE 80
WORKDIR /var/www/html

# Start Apache web server.
CMD ["apache2-foreground"]