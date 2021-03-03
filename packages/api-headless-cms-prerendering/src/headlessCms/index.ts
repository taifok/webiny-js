import { CmsContentEntryHookPlugin } from "@webiny/api-headless-cms/types";
import EventBridge from "aws-sdk/clients/eventbridge";

const eventBridge = new EventBridge({ apiVersion: "2015-10-07" });

type Args = {
    eventBridge: string;
};

export default (pluginArgs: Args) => {
    const plugin: CmsContentEntryHookPlugin = {
        type: "cms-content-entry-hook",
        async afterPublish(args) {
            // After an entry was published, we fire an event.
            const params = {
                Entries: [
                    {
                        Detail: JSON.stringify(args.entry),
                        DetailType: "cms-content-entry-published",
                        EventBusName: pluginArgs.eventBridge,
                        Source: "cmsContentEntry"
                    }
                ]
            };

            console.log(
                JSON.stringify([
                    {
                        Detail: args.entry,
                        DetailType: "cms-content-entry-published",
                        EventBusName: pluginArgs.eventBridge,
                        Source: "api"
                    }
                ])
            );

            try {
                const response = await eventBridge.putEvents(params).promise();
                console.log("WEEEEEE", response);
            } catch (e) {
                console.log("KOMAAAAAA", e.message, e);
            }
        }
    };

    return plugin;
};
