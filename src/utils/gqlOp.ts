import { API, graphqlOperation } from "aws-amplify";

export const gqlOp = async <ResultType extends {}, VariablesType extends {} = {}>(
  query: string,
  variables?: VariablesType,
): Promise<ResultType> => {
  const { data } = (await API.graphql(graphqlOperation(query, variables))) as {
    data: ResultType;
  };

  return data;
};
