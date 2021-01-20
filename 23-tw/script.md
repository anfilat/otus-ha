1. Запустить контейнеры командой `docker-compose up -d`
1. Зайти в контейнер `web` командой `docker exec -it web sh`. В дальнейшем все команды выполняются в контейнере, если
   явно не указано иное
1. Создать схему БД командой `npm run updatedb`
1. Послать запрос `Add user` из коллекции Postman, проверить, что возвращается `success: true` и идентификатор
   пользователя
1. Для проверки скорости запросов добавить 1000 фолловеров из постмана `Add followers`
1. Послать синхронный запрос `Post tweet` из коллекции Postman, проверить, сколько времени он выполняется
1. Послать асинхронный запрос `Post tweet` из коллекции Postman, проверить, сколько времени он выполняется
1. Проверить в админке RabbitMQ `http://localhost:15672/`, что появилась точка обмена и очереди.
1. Проверить в админке Graphite `http://localhost:8000/`, что появилась статистика
   в `stats_counts.my_app.update_feed_received_x`.
1. Войти в Grafana `http://localhost:3000/`
1. Добавить Data source с типом Graphite и url `http://graphite:80`
1. Добавить Dashboard и Panel
1. Для созданной Panel выбрать `Panel Title > Inspect > Panel JSON`, вставить в поле содержимое
   файла `grafana_panel.json` и сохранить
