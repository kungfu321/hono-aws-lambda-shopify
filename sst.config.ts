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
    new sst.aws.Function("UserFunction", {
      url: true,
      handler: "app/modules/users/index.handler",
    });
  },
});
