# FrontEnd DevStack

Build template based on Twitter Bootstrap

---

## How to start

1.  Download or clone repository
2.  run npm install --save
3.  run bower install --save
4.  generate favicon, iOS... <http://realfavicongenerator.net> and copy to root
5.  run **grunt default** and develop or **grunt dist** for production

## How to setup virtual host

1.  Add line `127.0.1.1    project.l` into **/etc/hosts**
2.  Create entry in server config **/etc/apache2/extra/httpd-vhosts.conf**

```#
    <VirtualHost *:80>
        ServerName project.l
        ServerAdmin webmaster@project.l

        DocumentRoot project_directory/www
        <Directory />
            Options FollowSymLinks
            AllowOverride All
        </Directory>
        <Directory project_directory/www>
            Options Indexes FollowSymLinks MultiViews
            AllowOverride All
            Require all granted
        </Directory>
        ErrorLog project_directory/error.log
        LogLevel warn
        CustomLog project_directory/log.log combined
    </VirtualHost>
```

Restart apache now `#!bash sudo service apache2 restart`
