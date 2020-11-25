import React from "react";
import { Link } from "@webiny/react-router";
import { PbRenderElementPlugin } from "@webiny/app-page-builder/types";
import { useDataSources } from "@webiny/app-page-builder/render/hooks/useDataSources";
import { plugins } from "@webiny/plugins";
import { useRichTextSerialiser } from "webiny-richtext-serializer/useRichTextSerialiser";

export default [
    {
        name: "pb-render-page-element-dynamic-content",
        type: "pb-render-page-element",
        elementType: "dynamic-content",
        render({ element }) {
            const components = plugins.byType("pb-page-element-dynamic-content-component");
            const plugin = components.find(cmp => cmp.componentName === element.data.component);
            let preview = false,
                dataSources;

            dataSources = useDataSources();
            if (!dataSources) {
                preview = true;
                dataSources = [];
            }

            if (!plugin) {
                return (
                    <div>
                        Missing component <strong>{element.data.component}</strong>
                    </div>
                );
            }

            const Component = plugin.component;

            if (preview) {
                return <Component preview />;
            }

            const dataSource = dataSources.find(ds => ds.name === element.data.dataSource);
            if (!dataSource) {
                return (
                    <div>
                        Missing data source <strong>{element.data.dataSource}</strong>
                    </div>
                );
            }

            return <Component data={dataSource.data} />;
        }
    } as PbRenderElementPlugin,
    {
        name: "pb-page-element-dynamic-content-component-article-header",
        type: "pb-page-element-dynamic-content-component",
        title: "Article Header",
        componentName: "article-header",
        component: ({ preview, data }) => {
            if (preview) {
                return (
                    <div style={{ padding: 20, backgroundColor: "#e0e0e0" }}>
                        <h3>{"{article.title}"}</h3>
                        <h4>Institution: {"{article.institution}"}</h4>
                        <h4>Author: {"{article.author}"}</h4>
                        <p>#tag1 #tag3 #tag3</p>
                    </div>
                );
            }

            const article = data.article.data;

            return (
                <div style={{ padding: 20, backgroundColor: "#e0e0e0" }}>
                    <h3>{article.title}</h3>
                    <h4>Institution: {article.institution}</h4>
                    <h4>Author: {article.author}</h4>
                    <p>
                        {article.tags.map(tag => (
                            <span className="article-tag" key={tag}>
                                #{tag}
                            </span>
                        ))}
                    </p>
                </div>
            );
        }
    },
    {
        name: "pb-page-element-dynamic-content-component-article-content",
        type: "pb-page-element-dynamic-content-component",
        title: "Article Content",
        componentName: "article-content",
        component: ({ preview, data }) => {
            const richTextAsHtml = useRichTextSerialiser(data ? data.article.data.content : []);

            if (preview) {
                return (
                    <div style={{ padding: 20 }}>
                        <p>{"{article.content}"}</p>
                    </div>
                );
            }

            return (
                <div
                    className={"article-content"}
                    dangerouslySetInnerHTML={{ __html: richTextAsHtml }}
                />
            );
        }
    },
    {
        name: "pb-page-element-dynamic-content-component-articles-list",
        type: "pb-page-element-dynamic-content-component",
        title: "Articles List",
        componentName: "articles-list",
        component: ({ preview, data }) => {
            if (preview) {
                return (
                    <div style={{ padding: 20, backgroundColor: "#e46c0a" }}>
                        <ul>
                            <li>{"{article[0].title}"}</li>
                            <li>{"{article[1].title}"}</li>
                            <li>{"{article[2].title}"}</li>
                        </ul>
                    </div>
                );
            }

            const linkStyle = { color: "#fff", fontSize: 18 };

            return (
                <div style={{ padding: 20, backgroundColor: "#e46c0a" }}>
                    Related articles:
                    <ul>
                        {data.articles.data.map(article => (
                            <li key={article.id} style={{ marginBottom: 10 }}>
                                <Link to={`/articles/${article.url}`} style={linkStyle}>
                                    > {article.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    }
];
