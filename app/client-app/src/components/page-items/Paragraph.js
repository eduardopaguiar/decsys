import React from "react";
import PropTypes from "prop-types";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import ReactMarkdown from "react-markdown";
import { Text } from "@chakra-ui/core";
import PageParagraphEditor from "./Paragraph.PreviewEditor";

const PageParagraph = ({ text, color, ...p }) => (
  // we set color in standard CSS,
  // so that simple CSS color names work e.g. "red"
  // and we don't have to explain to users how chakra theme colors work e.g. "red.500"
  <Text as="div" {...p} style={{ color }}>
    <ReactMarkdown source={text} />
  </Text>
);

PageParagraph.params = {
  color: ParamTypes.string("Color", "black"),
  textAlign: ParamTypes.oneOf("Alignment", ["left", "center", "right"], "left"),
  fontFamily: ParamTypes.stringUndefined("Font Family"),
};

const { pt, defaultProps } = buildPropTypes(PageParagraph.params, {
  // Text is configurable, but edited by our custom editor component
  // not the Platform's Params Editor
  text: PropTypes.string,
});
PageParagraph.propTypes = pt;
PageParagraph.defaultProps = defaultProps;

PageParagraph.previewEditorComponent = PageParagraphEditor;

export default PageParagraph;
