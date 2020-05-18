import axios from "axios";
import { appJsonHeaderOptions } from "./helpers";

export const createSurveyPage = async id =>
  await axios.post(`/api/surveys/${id}/pages`);

export const setSurveyPageOrder = async (surveyId, pageId, newOrder) =>
  await axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/order`,
    newOrder,
    appJsonHeaderOptions
  );

export const deleteSurveyPage = async (surveyId, pageId) =>
  await axios.delete(`/api/surveys/${surveyId}/pages/${pageId}`);

export const duplicateSurveyPage = async (surveyId, pageId) =>
  await axios.post(`/api/surveys/${surveyId}/pages/${pageId}/duplicate`);
