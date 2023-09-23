# BI-platform

Visit online: [link](http://170.106.170.25:81)

## Features

### Business characteristics

Hi! ZyBI is a business intelligence model that automates data analysis by taking in excel data format in form of .xlsx/.xlx, a prompt that outlines analysis goals, then connects to a chat-GPT API to output result plus a visualization of the user's choosing.
The project comes with a user login system that keeps track of a user's history. There are two types of prompt submission: synchronous that generates result on-demand and after some wait time; asynchronous that puts the task on a queue that you can check in the "my charts" section. Feed the model with an excel file and explore!

### Frontend
- React 18
- And Design Pro 5.x scaffolding
- Umi 4 frontend framework
- And Design component library
- Echart visualization library
- OpenAPI auto interface generation

### Backend
- Java Spring Boot template
- MySQL database
- MyBatis-Plus and MyBatis X content generation
- Redis + Redisson flow control
- RabbitMQ message queue
- GPT3.5-turbo API
- JDK thread pool and asynchronism
- Easy Excel table data processing
- Swagger + Knife4j interface documentation generation


## Quick Start

### Backend
Root directory /bi-backend. 
Change the apiKey string to your own openai key under OpenAiApi.java.
Run mvn install.
Run MainApplication.java.

### Frontend 
Root directory /bi-frontend. To execute, run:
```
$ npm i
$ npm run start
```


