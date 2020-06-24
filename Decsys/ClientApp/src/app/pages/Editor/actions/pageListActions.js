import {
  createSurveyPage,
  setSurveyPageOrder,
  deleteSurveyPage,
  duplicateSurveyPage,
  setPageRandomize,
  addSurveyPageItem
} from "api/pages";
import produce from "immer";
import { v4 as uuid } from "uuid";

export default (id, mutate, setBusy, resetAfterIndex) => ({
  addPage: async () => {
    const tempId = uuid();
    mutate(
      produce(({ pages }) => {
        pages.push({ id: tempId, components: [], isLoading: true });
      }),
      false
    );
    await createSurveyPage(id);
    mutate();
  },

  duplicatePage: async pageId => {
    mutate(
      produce(({ pages }) => {
        const newId = uuid();
        const i = pages.findIndex(({ id }) => id === pageId);
        pages.splice(i + 1, 0, { ...pages[i], id: newId, isLoading: true });
        resetAfterIndex(i, false);
      }),
      false
    );
    await duplicateSurveyPage(id, pageId);
    mutate();
  },

  deletePage: async pageId => {
    mutate(
      produce(({ pages }) => {
        const i = pages.findIndex(({ id }) => id === pageId);
        pages.splice(i, 1);
        resetAfterIndex(i, false);
      }),
      false
    );
    await deleteSurveyPage(id, pageId);
    mutate();
  },

  setPageRandomize: async (pageId, randomize) => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        page.randomize = randomize;
      }),
      false
    );
    await setPageRandomize(id, pageId, randomize);
    mutate();
  },

  movePage: async (pageId, source, destination) => {
    setBusy({ isListReordering: true });
    mutate(
      produce(({ pages }) => {
        const [page] = pages.splice(source, 1);
        pages.splice(destination, 0, page);
      }),
      false
    );
    await (async () => new Promise(resolve => setTimeout(resolve, 0)))();
    resetAfterIndex(Math.min(source, destination), false);
    // await setSurveyPageOrder(id, pageId, destination + 1); // indexes server side are the order, so start from 1
    // mutate();

    // resetAfterIndex(Math.min(source, destination), false);
    setBusy({});
  },

  addItemToPage: async (pageId, type) => {
    const tempId = uuid();
    mutate(
      produce(({ pages }) => {
        const i = pages.findIndex(({ id }) => id === pageId);
        pages[i].components.push({ id: tempId, type, isLoading: true });
        resetAfterIndex(i, false);
      }),
      false
    );
    await addSurveyPageItem(id, pageId, type);
    mutate();
  },

  movePageItem: (pageId, itemId, source, destination) => {},
  mutate
});
