import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
} from "react-vis";
import PropTypes from "prop-types";

import { GetGameQuery } from "../API";

interface RenderChartProps {
  title: string;
  data: any;
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
}

const RenderChart = ({
  title,
  data,
  width,
  height,
  xLabel,
  yLabel,
}: RenderChartProps) => (
  <>
    <Typography>{title}</Typography>

    <XYPlot
      xType="ordinal"
      width={width}
      height={height}
      margin={{ bottom: 80 }}
    >
      <HorizontalGridLines />
      <XAxis tickLabelAngle={-45} title={xLabel} />
      <YAxis title={yLabel} />
      <VerticalBarSeries barWidth={0.3} data={data} />
    </XYPlot>
  </>
);

const getGraphData = (
  data: any,
  title: string,
  yLabel: string,
  xLabel: string
) => ({
  data,
  title,
  xLabel,
  yLabel,
  width: 300,
  height: 200,
});

interface ResultsProps {
  game: GetGameQuery;
}

interface Coords {
  x?: string;
  y?: number;
}
export default function Results({ game: game_ }: ResultsProps) {
  const game = game_?.getGame;
  const dateData: Coords[] =
    game?.dateOptions?.map(
      (date) =>
        ({
          x: date?.date,
          y: date?.votes,
        } as Coords)
    ) ?? [];

  const d = new Date().toISOString().split("T")[0];
  const timeData: Coords[] =
    game?.timeOptions?.map(
      (time) =>
        ({
          x: new Date(d + "T" + time?.time).toLocaleTimeString(),
          y: time?.votes,
        } as Coords)
    ) ?? [];

  const buyInData =
    game?.buyInOptions?.map(
      (buyIn) =>
        ({
          x: buyIn?.amount,
          y: buyIn?.votes,
        } as Coords)
    ) ?? [];

  const graphs = [
    getGraphData(dateData, "Date", "Votes", "Dates"),
    getGraphData(timeData, "Time", "Votes", "Times"),
    getGraphData(buyInData, "Buy In", "Votes", "Amounts"),
  ];

  return (
    <Box padding={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5">Results</Typography>
      <Grid
        container
        style={{ marginTop: 10 }}
        alignItems="center"
        justify="center"
        spacing={2}
      >
        {graphs.map((props) => (
          <Grid item sm={12} md={4} key={props.title}>
            <RenderChart key={props.title} {...props} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

Results.propTypes = {
  game: PropTypes.object.isRequired,
};
