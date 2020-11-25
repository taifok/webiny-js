import createSite, { SiteAppOptions } from "@webiny/app-template-site";
import "./App.scss";
import renderPlugins from "dynamic-pages/render";

export default (params: SiteAppOptions = {}) => {
    const plugins = params.plugins || [];
    plugins.push(renderPlugins());
    return createSite({ ...params, plugins });
};
