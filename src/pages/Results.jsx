import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
  ChartLabel,
} from "react-vis";

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
    <div>
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
    </div>
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
    <Box padding={4}>
      <Typography variant="h5">Result</Typography>
      <Grid container style={{ marginTop: 10 }}>
        {graphs.map((props) => (
          <Grid item sm={12} md={4}>
            <RenderChart key={props.title} {...props} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
