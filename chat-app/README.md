# ChatApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Docker

production build: ```docker build --no-cache --build-arg NGINX_CONF=nginx.prod.conf --build-arg CONFIGURATION=production -t chatapp-frontend:0.2 .```

production tag: ```docker tag chatapp-frontend:0.2 public.ecr.aws/n1s5i8z7/chatapp-frontend:0.2```

production build: ```docker push public.ecr.aws/n1s5i8z7/chatapp-frontend:0.2```

## Connect to running ECS container and run command from inside the container

aws ecs update-service  --cluster chatapp-fragrate-dns --task-definition chatapp-frontend-taskdefinition-family:2 --service  chatapp-frontend-service-1 --enable-execute-command --desired-count 1

aws ecs execute-command --cluster chatapp-fragrate-dns --task b0913e2a36794a90bc22c5153b33c54f --container chatapp-frontend --interactive --command "sh"

## Deploy Backend to AWS Elastic Beanstalk

install eb cli (google)

