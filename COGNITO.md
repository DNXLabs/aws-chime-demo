# Adding Cognito Auth using amazon-cognito-identity-js


```js

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

var poolData = {
    UserPoolId: '...', // Your user pool id here
    ClientId: '...', // Your client id here
};

var CognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var authenticationData = {
    Username: (document.getElementById('inputUsername') as HTMLInputElement).value,
    Password: (document.getElementById('inputPassword') as HTMLInputElement).value,
};

var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
);

var userData = {
    Username: (document.getElementById('inputUsername') as HTMLInputElement).value,
    Pool: CognitoUserPool,
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result: any) {
        this.accessToken = result.getAccessToken().getJwtToken();
        console.log('Successfully logged!');

        console.log(cognitoUser)

        cognitoUser.getUserAttributes(function(err: any, result: any) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        console.log(result[0].getName()) // sub
        console.log(result[0].getValue())
        this.uid = result[0].getValue()
        });
    },

    onFailure: function(err: any) {
        console.log(err);
        alert(err.message || JSON.stringify(err));
    },
});
```