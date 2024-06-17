To test firebase locally (notifications for example). 
The chat-app-serviceAccountKey.json file with all the keys is needed 

To run mongodb atlas locally execute the following:
```
docker pull mongodb/mongodb-atlas-local
```
```
docker run -d --name mongodb_messages -p 27017:27017 mongodb/mongodb-atlas-local
```
