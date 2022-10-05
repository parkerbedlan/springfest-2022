@echo off

echo old versions:
docker image ls parkerbedlan/springfest

echo.
set /p version="What should the next version be? "

docker build -t parkerbedlan/springfest:%version% --build-arg DATABASE_URL=postgres://foo .
docker push parkerbedlan/springfest:%version%

echo paste this into your ssh:
echo "docker pull parkerbedlan/springfest:%version% && dokku git:from-image springfest parkerbedlan/springfest:%version%"

@REM ssh root@68.183.115.8 "docker pull parkerbedlan/springfest:%version% && dokku git:from-image springfest parkerbedlan/springfest:%version%"
