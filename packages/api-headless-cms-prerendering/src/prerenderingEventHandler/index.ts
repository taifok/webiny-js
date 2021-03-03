import { createHandler } from "@webiny/handler-aws";
import { HandlerPlugin } from "@webiny/handler/types";
import { ArgsContext } from "@webiny/handler-args/types";

// Setup the handler, which can be expanded using plugins.
export const handler = createHandler({
    type: "handler",
    handle(context) {
        console.log("context.args", context.invocationArgs.event);
        console.log(JSON.stringify(context.invocationArgs));
    }
} as HandlerPlugin<ArgsContext<{ event: string }>>);
