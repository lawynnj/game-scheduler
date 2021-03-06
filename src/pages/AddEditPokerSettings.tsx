import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { API, graphqlOperation } from "aws-amplify";
import parseISO from "date-fns/parseISO";
import React, { useEffect, useState } from "react";
import { match, Prompt, useHistory } from "react-router-dom";
import { GetGameQuery } from "../API";
import PokerSettingsForm, { PokerFormVals } from "../components/AddEditPokerSettings/PokerSettingsForm";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { useQuery } from "../hooks/useQuery";
import { BuyInOptions, DateOptions, TimeOptions } from "../models/game";

const transformFormVals = (values: PokerFormVals): PokerFormVals => {
  // transoform form values to satisfy db schema. E.g. Transform a datetime string to just the `date` or `time`
  const cleanVals: PokerFormVals = {
    ...values,
  };

  if (cleanVals.timeOptions) {
    cleanVals.timeOptions = cleanVals.timeOptions.map((opt) => {
      const sanitizedOpt = { ...opt };
      const tmp: Date = new Date(sanitizedOpt.time);

      return {
        ...sanitizedOpt,
        time: tmp.toISOString().split("T")[1],
      };
    });
  }
  if (cleanVals.dateOptions) {
    cleanVals.dateOptions = cleanVals.dateOptions.map((opt) => {
      const sanitizedOpt = { ...opt };
      const tmp: Date = new Date(sanitizedOpt.date);

      return {
        ...sanitizedOpt,
        date: tmp.toISOString().split("T")[0],
      };
    });
  }

  return cleanVals;
};

interface MatchProps {
  gameId: string;
}

interface AddEditPokerSettingsProps {
  match: match<MatchProps>;
  userId: string;
}

const AddEditPokerSettings = (props: AddEditPokerSettingsProps): JSX.Element => {
  const { match, userId } = props;
  const { gameId } = match.params;
  const isAddMode = !gameId;
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);
  const { data, loading } = useQuery<GetGameQuery>(queries.getGame, {
    id: gameId,
    skip: !gameId,
  });
  const [initialValues, setInitialValues] = useState<PokerFormVals>({
    title: "",
    status: "PENDING",
    dateOptions: [],
    timeOptions: [],
    buyInOptions: [],
  });

  const game = data?.getGame;

  useEffect(() => {
    // initialize form values if we are in edit mode
    if (game && !isAddMode && !formInitialized) {
      const dateOptions: DateOptions[] =
        game?.dateOptions?.map((dateOpt) => {
          // add time and timezone to date to fix DatePicker bug
          // see: https://stackoverflow.com/questions/60382084/material-ui-datepicker-showing-wrong-date
          const dateStr = parseISO(dateOpt?.date ?? new Date().toISOString());

          return {
            ...dateOpt,
            date: dateStr.toISOString(),
            votes: dateOpt?.votes,
          } as DateOptions;
        }) ?? [];

      const timeOptions: TimeOptions[] =
        game?.timeOptions?.map((timeOpt) => {
          return {
            ...timeOpt,
            // To make the datetime picker component work, we need to prepend a dummy date.
            // The component expects a ISO date so we format it here.
            time: "9999-01-01T" + timeOpt?.time,
            votes: timeOpt?.votes,
          } as TimeOptions;
        }) ?? [];

      const buyInOptions: BuyInOptions[] =
        game?.buyInOptions?.map((buyInOpt) => {
          return {
            ...buyInOpt,
            amount: buyInOpt?.amount,
            votes: buyInOpt?.votes,
          } as BuyInOptions;
        }) ?? [];

      const values: PokerFormVals = {
        title: game?.title || "",
        status: game?.status || "",
        dateOptions: dateOptions,
        timeOptions: timeOptions,
        buyInOptions: buyInOptions,
      };
      setInitialValues(values);
      setFormInitialized(true);
    }
  }, [isAddMode, game, initialValues, formInitialized]);

  const handleAdd = async (values: PokerFormVals) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.createGame, {
          input: {
            ...values,
            hostId: userId,
          },
        }),
      );
      history.push("/");
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleEdit = async (values: PokerFormVals) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.updateGame, {
          input: {
            ...values,
            hostId: userId,
            id: game?.id,
          },
        }),
      );

      history.push("/");
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmit = async (values: PokerFormVals) => {
    setShowPrompt(false);
    const cleanVals = transformFormVals(values);
    if (isAddMode) {
      await handleAdd(cleanVals);
    } else {
      await handleEdit(cleanVals);
    }
  };

  if (!isAddMode && loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY="30px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Prompt when={showPrompt} message="You have unsaved changes. Are you sure you want to leave? " />

      <PokerSettingsForm
        onCancel={() => history.push(isAddMode ? "." : "..")}
        submitBtnText={isAddMode ? "Add" : "Save"}
        title={isAddMode ? "Add Poker Game Settings" : "Edit Poker Game Settings"}
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        onFormFocus={() => setShowPrompt(true)}
      />
    </>
  );
};

export default AddEditPokerSettings;
