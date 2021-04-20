import graphql from "./graphql";
import context from "./context";
import upgrades from "./upgrades";
import installation from "./installation/installation";
import elasticSearch from "./installation/elasticSearch";

export default (): any => [graphql, context, upgrades, installation, elasticSearch];
