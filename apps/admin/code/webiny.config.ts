import invariant from "invariant";
import { startApp, buildApp } from "@webiny/project-utils";
import { getStackOutput } from "@webiny/cli-plugin-deploy-pulumi/utils";
import WorkboxPlugin from "workbox-webpack-plugin";

const MAP = {
    REACT_APP_USER_POOL_REGION: "${region}",
    REACT_APP_GRAPHQL_API_URL: "${apiUrl}/graphql",
    REACT_APP_API_URL: "${apiUrl}",
    REACT_APP_USER_POOL_ID: "${cognitoUserPoolId}",
    REACT_APP_USER_POOL_WEB_CLIENT_ID: "${cognitoAppClientId}"
};

const NO_ENV_MESSAGE = `Please specify the environment via the "--env" argument, for example: "--env dev".`;
const NO_API_MESSAGE = env => {
    return `It seems that the API project application isn't deployed!\nBefore continuing, please deploy it by running the following command: yarn webiny deploy api --env=${env}`;
};

export default {
    commands: {
        async start(options, context) {
            invariant(options.env, NO_ENV_MESSAGE);

            const output = await getStackOutput("api", options.env, MAP);
            invariant(output, NO_API_MESSAGE(options.env));

            Object.assign(process.env, output);

            // Start local development
            await startApp(
                {
                    ...options,
                    webpack(config) {
                        config.plugins.push(
                            new WorkboxPlugin.InjectManifest({
                                swSrc: "./src/service-worker.ts",
                                swDest: "service-worker.js",
                                dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
                                exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
                                // Bump up the default maximum size (2mb) that's precached,
                                // to make lazy-loading failure scenarios less likely.
                                // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
                                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                            }),
                        );
                        return config;
                    }
                },
                context
            );
        },
        async build(options, context) {
            invariant(options.env, NO_ENV_MESSAGE);

            const output = await getStackOutput("api", options.env, MAP);
            invariant(output, NO_API_MESSAGE(options.env));

            Object.assign(process.env, output);

            // Bundle app for deployment
            await buildApp(options, context);
        }
    }
};
