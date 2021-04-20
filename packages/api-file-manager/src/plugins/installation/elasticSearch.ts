import { FileManagerInstallationHooksPlugin } from "~/types";
import defaults from "~/plugins/crud/utils/defaults";

export default {
    type: "installation-fm-hooks",
    async afterInstall(context) {
        const { elasticSearch } = context;
        // Create ES index if it doesn't already exist.
        const esIndex = defaults.es(context);
        const { body: exists } = await elasticSearch.indices.exists(esIndex);
        if (!exists) {
            await elasticSearch.indices.create({
                ...esIndex,
                body: {
                    // need this part for sorting to work on text fields
                    settings: {
                        analysis: {
                            analyzer: {
                                lowercase_analyzer: {
                                    type: "custom",
                                    filter: ["lowercase", "trim"],
                                    tokenizer: "keyword"
                                }
                            }
                        }
                    },
                    mappings: {
                        properties: {
                            property: {
                                type: "text",
                                fields: {
                                    keyword: {
                                        type: "keyword",
                                        ignore_above: 256
                                    }
                                },
                                analyzer: "lowercase_analyzer"
                            }
                        }
                    }
                }
            });
        }
    }
} as FileManagerInstallationHooksPlugin;
