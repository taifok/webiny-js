import { OktaAuthenticationPlugin, Config } from "./OktaAuthenticationPlugin";

export default (config: Config) => new OktaAuthenticationPlugin(config);
