# Лабораторная работа по Веб-программированию №2

## Инструкция по запуску

1. **Скачать [WildFly](https://www.wildfly.org/downloads/) и распаковать архив** (я скачивал 26.1.2)
2. **Добавить пользователя:**
   - В папке `bin` запустить `add-user.bat` (Windows) или `add-user.sh` (Linux/MacOS)
   - Тип пользователя: **Management User** (можно просто `Enter`)
   - Логин и пароль: **любой**
   - Группы: **пропускаем** (можно просто `Enter`)
   - Остальное: **ввести yes**
3. **Настроить порты:**
   - Открыть в папке standalone/configuration/ файл `standalone.xml`
   - В строке `500` (в конце файла) сменить оффсет с нуля на свой 
     - Было:
       ```xml
       <socket-binding-group name="standard-sockets" default-interface="public" port-offset="${jboss.socket.binding.port-offset:0}">
       ```
     - Стало:
       ```xml
       <socket-binding-group name="standard-sockets" default-interface="public" port-offset="${jboss.socket.binding.port-offset:2400}">
       ```
   - Таким образом порты будут `8080 + offset` и `9990 + offset` для запуска сервера и админки соответственно
4. **Использование в IntelliJ IDEA:**
   - Создать/Открыть проект (при создании из зависимостей достаточно выбрать только `Servlet API`)
   - Вверху нажать `Edit configuration`
   - Нажать на `+` (Add configuration)
   - В списке выбрать `JBoss/Wildfly Local`
   - Внизу нажать на `Fix` или перейти на вкладку `Deployments` и добавить артефакт (я добавлял просто `war`)
5. **Запуск на Helios:**
   - Перенести архив с `WildFly` на сервер (через консоль и `scp` или через `WinSCP/FileZilla`) и распаковать его (через `unzip`), 
   заменив стандартный `standalone.xml` на свой, **либо** перенести распакованную папку (так будет дольше)
   - Пробросить порты:
     - Подключиться с помощью команды, заменив `PORT` на свои:
       ```shell
       ssh -p 2222 -L PORT:localhost:PORT sXXXXXX@se.ifmo.ru
       ```
     - Нужно пробросить порты для запуска сервера `(8080 + offset)` и для админки `(9990 + offset)`
   - Запустить `bin/standalone.sh` на Helios'е (можно открыть еще одно окно терминала)
   - Открыть в браузере `localhost:PORT`, где `PORT` - порт для админки
   - Ввести свои логин и пароль в появившемся окне
   - Перейти на вкладку `Deployments` и справа нажать `+` и `Upload Deployment`, добавив свой `war` (**либо** добавить свой `war` в папку deployments)
   - Открыть свою страничку :-)




***- так делал я, возможно можно лучше и быстрее***