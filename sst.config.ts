/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "hono-aws-lambda-shopify",
      // removal: input?.stage === "production" ? "retain" : "remove",
      // protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: process.env.AWS_REGION || "ap-southeast-1",
        }
      }
    };
  },
  async run() {
    const sessionTable = sst.aws.Dynamo.get("SessionTable", "app-dev-session-table");

    const api = new sst.aws.ApiGatewayV1("MyApi");

    const userPool = new sst.aws.CognitoUserPool("MyUserPool");

    const myAuthorizer = api.addAuthorizer({
      name: "myAuthorizer",
      userPools: [userPool.arn]
    });

    api.route("GET /users/{id}", {
      handler: "app/modules/users/index.handler",
      link: [sessionTable],
    }, {
      auth: {
        cognito: {
          authorizer: myAuthorizer.id
        }
      }
    });

    api.route("PUT /users/{id}", {
      handler: "app/modules/users/index.handler",
      link: [sessionTable],
    }, {
      auth: {
        cognito: {
          authorizer: myAuthorizer.id
        }
      }
    });

    api.route("POST /users", {
      handler: "app/modules/users/index.handler",
      link: [sessionTable],
    }, {
      auth: {
        cognito: {
          authorizer: myAuthorizer.id
        }
      }
    });

    api.route("DELETE /users/{id}", {
      handler: "app/modules/users/index.handler",
      link: [sessionTable],
    }, {
      auth: {
        cognito: {
          authorizer: myAuthorizer.id
        }
      }
    });

    api.deploy();
  },
});
