#!/usr/bin/env bash

echo "opcache.enable=1
zend_extension=xdebug.so
xdebug.remote_enable=on
xdebug.remote_autostart=off
xdebug.idekey=PHPSTORM
xdebug.profiler_enable=0
xdebug.profiler_output_dir=/var/www/html/profiler/
xdebug.collect_params=4" >> /usr/local/etc/php/php.ini;
