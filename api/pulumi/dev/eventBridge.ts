import * as aws from "@pulumi/aws";

class EventBridge {
    eventBridge: aws.cloudwatch.EventBus;
    constructor() {
        this.eventBridge = new aws.cloudwatch.EventBus("default-event-bus", {});
    }
}

export default EventBridge;
