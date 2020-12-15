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
  ChartLabel,
} from "react-vis";
import PropTypes from "prop-types";

export default function Results({ settings }) {
  const dateData = settings.dateOptions.map((date) => ({
    x: date.date,
    y: date.votes,
  }));

  const d = new Date().toISOString().split("T")[0];
  const timeData = settings.timeOptions.map((time) => ({
    x: new Date(d + "T" + time.time).toLocaleTimeString(),
    y: time.votes,
  }));

  const buyInData = settings.buyInOptions.map((buyIn) => ({
    x: buyIn.amount,
    y: buyIn.votes,
  }));

  const RenderChart = ({ title, yLabel, xLabel, data, width, height }) => (
    <>
      <Typography>{title}</Typography>

      <XYPlot xType="ordinal" width={width} height={height} xDistance={50}>
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <ChartLabel
          text={xLabel}
          xPercent={0.4}
          yPercent={1.33}
          includeMargin={false}
        />

        <ChartLabel
          text={yLabel}
          includeMargin={false}
          xPercent={-0.2}
          yPercent={0.5}
          style={{
            transform: "rotate(-90)",
            textAnchor: "end",
          }}
        />
        <VerticalBarSeries data={data} />
      </XYPlot>
    </>
  );

  const graphs = [
    {
      data: dateData,
      title: "Date",
      xLabel: "Dates",
      yLabel: "Votes",
      width: 200,
      height: 200,
    },
    {
      data: timeData,
      title: "Time",
      xLabel: "Times",
      yLabel: "Votes",
      width: 200,
      height: 200,
    },
    {
      data: buyInData,
      title: "Buy In",
      xLabel: "Amounts",
      yLabel: "Votes",
      width: 200,
      height: 200,
    },
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
          <Grid item sm={12} md={3}>
            <RenderChart key={props.title} {...props} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

Results.propTypes = {
  settings: PropTypes.object.isRequired,
};
