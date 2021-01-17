import React from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import { API, graphqlOperation } from "aws-amplify";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

type UseQueryType<ResultType> = {
  loading: boolean;
  error: unknown;
  data: ResultType;
  refetch: () => void;
};

interface AuthType {
  isPublic?: boolean;
}

export const gqlOp = async <ResultType extends {}, VariablesType extends AuthType = {}>(
  query: string,
  variables?: VariablesType,
): Promise<ResultType> => {
  const { isPublic = false, ...rest } = variables || {};
  const authMode = isPublic === true ? GRAPHQL_AUTH_MODE.API_KEY : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS;

  const { data } = (await API.graphql({
    ...graphqlOperation(query, rest),
    authMode,
  })) as {
    data: ResultType;
  };

  return data;
};

interface QueryType extends AuthType {
  skip?: boolean;
}

export const useQuery = <ResultType extends {}, VariablesType extends QueryType = {}>(
  query: string,
  variables?: VariablesType,
): UseQueryType<ResultType> => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({} as ResultType);

  const fetchQuery = async (query: string, variables?: VariablesType) => {
    try {
      const data = await gqlOp<ResultType, VariablesType>(query, variables);
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchQuery(query, variables);
  };

  useDeepCompareEffect(() => {
    const { skip = false } = variables || {};
    if (!skip) fetchQuery(query, variables);
  }, [query, variables]);

  return {
    loading,
    data,
    error,
    refetch,
  };
};
