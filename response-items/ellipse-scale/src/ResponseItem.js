import React, { useEffect } from "react";
import EllipseScale from "@decsys/rating-scales/cjs/ellipse";
import { params } from "./ResponseItem.params";
import stats from "./ResponseItem.stats";
import PropTypes from "prop-types";
import { renderContextPropTypes } from "@decsys/param-types";

const ResponseItem = ({
  barLeftMargin = 10,
  barRightMargin = 10,
  barTopMargin = 50,
  barColor = "black",
  barThickness = 4,
  barMinValue = 0,
  barMaxValue = 100,
  labelColor = "black",
  fontSize = "18pt",
  labelAlignment = "below",
  minLabel = "Min",
  maxLabel = "Max",
  penColor = "red",
  penThickness = 2,
  rangeMarkerColor = "blue",
  rangeMarkerHeight = 100,
  rangeMarkerThickness = 6,
  scaleMarkerColor = "black",
  scaleMarkerThickness = 4,
  scaleMarkerHeight = 30,
  scaleSubdivisionColor = "black",
  scaleSubdivisionThickness = 4,
  scaleSubdivisionHeight = 15,
  scaleMarkers = 5,
  scaleSubdivisions = 4,
  midLabel,
  fontFamily,
  minRangeValue,
  maxRangeValue,
  _context: { setNextEnabled, logResults },
}) => {
  const handleEllipseCompleted = (e) => {
    logResults(e.detail);
    setNextEnabled(true);
  };

  useEffect(() => {
    document.addEventListener("EllipseCompleted", handleEllipseCompleted);
    return () =>
      document.removeEventListener("EllipseCompleted", handleEllipseCompleted);
  }, []); // eslint-disable-line

  return (
    <EllipseScale
      barOptions={{
        minValue: barMinValue,
        maxValue: barMaxValue,
        leftMargin: `${barLeftMargin}%`,
        rightMargin: `${barRightMargin}%`,
        topMargin: `${barTopMargin}%`,
        barColor,
        thickness: `${barThickness}px`,
      }}
      penOptions={{
        color: penColor,
        thickness: penThickness,
      }}
      labels={{
        min: minLabel,
        mid: midLabel,
        max: maxLabel,
      }}
      labelOptions={{
        labelColor,
        fontFamily,
        fontSize,
        yAlign: labelAlignment,
      }}
      rangeMarkerOptions={{
        markerColor: rangeMarkerColor,
        length: `${rangeMarkerHeight}px`,
        thickness: `${rangeMarkerThickness}px`,
      }}
      scaleMarkerOptions={{
        markerColor: scaleMarkerColor,
        thickness: `${scaleMarkerThickness}px`,
        length: `${scaleMarkerHeight}px`,
        subColor: scaleSubdivisionColor,
        subThickness: `${scaleSubdivisionThickness}px`,
        subLength: `${scaleSubdivisionHeight}px`,
        markers: scaleMarkers,
        subdivisions: scaleSubdivisions,
      }}
      minRangeValue={minRangeValue}
      maxRangeValue={maxRangeValue}
      frameHeight="300px"
    />
  );
};

ResponseItem.params = params;
ResponseItem.propTypes = {
  ...Object.keys(params).map((k) => params[k].propType),
  minRangeValue: PropTypes.number,
  maxRangeValue: PropTypes.number,
  ...renderContextPropTypes,
};
//ResponseItem.defaultProps = paramDefaults;
ResponseItem.stats = stats;

export default ResponseItem;
