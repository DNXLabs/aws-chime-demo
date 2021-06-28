# API Gateway cognito Authorization

### Create an authorizer

![auth-1](images/api-gateway-auth-1.png)

### Attach the authorizer to the resource

![auth-2](images/api-gateway-auth-2.png)

> All requests to the api should contain the header `Authorization` with cognito token to be able to fetch data.