import { setContext } from "apollo-link-context";

const API_TOKEN = "a295a07e8071ab468956567859b000f3836e9fa05bd8d311";

export default {
    type: "apollo-link",
    createLink() {
        return setContext(async (_, { headers }) => {
            console.log('ad')
            return {
                headers: {
                    ...headers,
                    authorization: `Bearer ${API_TOKEN}`
                }
            };
        });
    }
};
