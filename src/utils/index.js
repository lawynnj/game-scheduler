import { API } from "aws-amplify";

export const publicAPI = (operation) => {
  return API.graphql({
    ...operation,
    authMode: "API_KEY",
  });
};
