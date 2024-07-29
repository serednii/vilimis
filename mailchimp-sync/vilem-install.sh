#!/bin/bash

############################################################
# vilem-install.sh test@test.cz
############################################################

echo "Začátek instalace"

db_password=$(tr -dc 'A-Za-z0-9.' < /dev/urandom | head -c 16)

posledni_id=$(cat /var/www/install/posledni_id.txt)
echo "Poslední id: $posledni_id"
nove_id=$((posledni_id+1))
echo "Nové id: $nove_id"
echo "$nove_id" > /var/www/install/posledni_id.txt
echo " "

sql_database=$(cat <<EOF
CREATE DATABASE vilem_$nove_id;
GRANT ALL ON vilem_$nove_id.* TO 'user_$nove_id' IDENTIFIED BY '$db_password';
quit
EOF
)
echo "SQL příkaz:"
echo "$sql_database"
echo " "


virtual_host=$(cat <<EOF
<VirtualHost *:80>
DocumentRoot /var/www/html/test/$nove_id/
ServerName $nove_id.test.vilemis.cz

<Directory /var/www/html/test/$nove_id/>
AllowOverride All
Order Allow,Deny
Allow from All
</Directory>

ErrorLog \${APACHE_LOG_DIR}/$nove_id.test.vilemis.cz-error.log
CustomLog \${APACHE_LOG_DIR}/$nove_id.test.vilemis.cz-access.log combined

RewriteEngine on
RewriteCond %{SERVER_NAME} =$nove_id.test.vilemis.cz
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]

RewriteRule ^api/v1/config/?\$ - [F,L]
RewriteRule ^api/v1/src/?\$ - [F,L]
RewriteRule ^api/v1/cache/?\$ - [F,L]
RewriteRule ^api/v1/template/?\$ - [F,L]
RewriteRule ^api/v1/vendor/?\$ - [F,L]
</VirtualHost>
EOF
)
echo "Virtuál host:";
echo "$virtual_host";
echo " "

orm_config=$(cat <<EOF
{
  "driver": "mysqli",
  "hostname": "localhost",
  "port": 3306,
  "username": "user_$nove_id",
  "password": "$db_password",
  "database": "vilem_$nove_id",

  "entities": [
    "API\\\\Entity"
  ]
}
EOF
)

echo "ORM config";
echo "$orm_config";
echo " "

# SEoeXL69wZ - výchozí heslo pro uživatele

#db_init=$(cat /var/www/html/test/_source/is/sql/crm.sql)
#echo "Inicializace DB:";
#echo "$db_init";
#echo " "

email_pro_odeslani=$(cat <<EOF
Dobrý den,

Byl aktivován Váš účet.

Vaše přístupové údaje:

URL instance: https://$nove_id.test.vilemis.cz/
Uživatelské jméno: $1
Heslo: SEoeXL69wZ

Budu velmi vděčný za jakoukoli zpětnou vazbu, děkuji.
Michal Katuščák, vilemis.cz
EOF
)

echo "E-mail";
echo "Vilém IS - Váš účet byl aktivován";
echo "$email_pro_odeslani";
echo " "




mysql -u root -ptů.r4vsvtů.r4v -e "$sql_database"
mysql -u user_"$nove_id" -p"$db_password" vilem_"$nove_id" < /var/www/html/test/_source/is/sql/crm.sql
mysql -u user_"$nove_id" -p"$db_password" vilem_"$nove_id"  -e "UPDATE user SET email = '$1', username = '$1' WHERE id = 1"

mkdir /var/www/html/test/"$nove_id"/
cp -a /var/www/html/test/_source/is/api/. /var/www/html/test/"$nove_id"/api
cp -a /var/www/html/test/_source/is/build/. /var/www/html/test/"$nove_id"/

cat <<< "$virtual_host"  > /etc/apache2/sites-available/"$nove_id".test.vilemis.cz.conf 
cat <<< "$orm_config" > /var/www/html/test/"$nove_id"/api/v1/config/orm.json 

chmod -R 755 /etc/apache2/sites-available/"$nove_id".test.vilemis.cz.conf
chmod -R 755 /var/www/html/test/"$nove_id"
chmod -R 755 /var/www/html/test/"$nove_id"/api/v1/config/orm.json
mkdir /var/www/html/test/"$nove_id"/api/v1/cache
mkdir /var/www/html/test/"$nove_id"/api/web/upload
chmod -R 777 /var/www/html/test/"$nove_id"/api/v1/cache
chmod -R 777 /var/www/html/test/"$nove_id"/api/v1/web/upload

a2ensite "$nove_id".test.vilemis.cz

service apache2 stop
service apache2 start

certbot --apache --agree-tos -m michal@katuscak.cz --non-interactive --domains "$nove_id".test.vilemis.cz

service apache2 stop
service apache2 start

mysql -u root -ptů.r4vsvtů.r4v -e "USE instance;UPDATE instance SET instance = '$nove_id.test.vilemis.cz', password = 'SEoeXL69wZ', passed = 1 WHERE email = '$1'"




