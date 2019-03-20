import React from "react";
import PropTypes from "prop-types";
import { FlexBox, ActiveIndicator } from "../ui";
import { connect } from "react-redux";
import { Typography, Box } from "@smooth-ui/core-sc";
import RunCountBadge from "./RunCountBadge";
import { Grid, Cell } from "styled-css-grid";
import * as Buttons from "./SurveyCardButton";
import ManageSurveyButton from "./ManageSurveyButton";
import { closeInstance, launchInstance } from "../../state/ducks/surveys";

const PureSurveyCard = ({
  id,
  name,
  activeInstanceId,
  runCount = 0,
  allowLaunch = false,
  onLaunchClick,
  onCloseClick
}) => {
  // conditionally prep buttons beforehand
  const buttons = [];
  if (!!activeInstanceId) {
    buttons.push(
      <Buttons.Close onClick={() => onCloseClick(id, activeInstanceId)} />
    );
    buttons.push(<Buttons.Dashboard id={id} />);
  }
  if (allowLaunch && !activeInstanceId)
    buttons.push(<Buttons.Launch onClick={() => onLaunchClick(id)} />);
  if (runCount > 0) buttons.push(<Buttons.Results id={id} />);

  return (
    <FlexBox
      backgroundColor="cardBg"
      borderBottom="thin solid"
      borderColor="cardBorder"
    >
      <ActiveIndicator active={!!activeInstanceId} />

      <Box width={1} p={1}>
        <Grid
          columns={`80px 1fr ${Array(buttons.length)
            .fill("100px")
            .join(" ")} auto`}
        >
          <Cell middle>
            <RunCountBadge count={runCount} />
          </Cell>

          <Cell middle>
            <Typography variant="h5" title={name} ml={1} mb={0.5}>
              {name}
            </Typography>
          </Cell>

          {buttons.map((x, i) => (
            <Cell middle key={i}>
              {x}
            </Cell>
          ))}

          <Cell middle>
            <ManageSurveyButton id={id} name={name} editable={!runCount} />
          </Cell>
        </Grid>
      </Box>
    </FlexBox>
  );
};

PureSurveyCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  activeInstanceId: PropTypes.number,
  runCount: PropTypes.number,
  allowLaunch: PropTypes.bool
};

const SurveyCard = connect(
  null,
  (dispatch, { id }) => ({
    onLaunchClick: id => dispatch(launchInstance(id)), // TODO: action
    onCloseClick: (surveyId, instanceId) =>
      dispatch(closeInstance(surveyId, instanceId))
  })
)(PureSurveyCard);

export { PureSurveyCard };

export default SurveyCard;