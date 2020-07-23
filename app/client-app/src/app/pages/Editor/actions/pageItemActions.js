import produce from "immer";
import { v4 as uuid } from "uuid";
import {
  deleteSurveyPageItem,
  duplicateSurveyPageItem,
  setSurveyPageItemParam
} from "api/page-items";

export default (
  surveyId,
  pageId,
  mutate,
  selectedPageItem,
  setSelectedPageItem
) => ({
  duplicatePageItem: async itemId => {
    mutate(
      produce(({ pages }) => {
        const newId = uuid();
        const page = pages.find(({ id }) => id === pageId);
        const i = page.components.findIndex(({ id }) => id === itemId);
        page.components.splice(i + 1, 0, {
          ...page.components[i],
          id: newId,
          isLoading: true
        });
      }),
      false
    );
    await duplicateSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  },

  deletePageItem: async itemId => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        const i = page.components.findIndex(({ id }) => id === itemId);
        page.components.splice(i, 1);

        if (selectedPageItem.itemId === itemId) {
          if (i > 0)
            setSelectedPageItem({ pageId, itemId: page.components[i - 1].id });
          else if (i !== page.components.length)
            setSelectedPageItem({ pageId, itemId: page.components[i].id });
          else setSelectedPageItem({});
        }
      }),
      false
    );

    await deleteSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  },
  setParamValue: async (itemId, paramKey, value) => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        const item = page.components.find(({ id }) => id === itemId);
        item.params[paramKey] = value;
      }),
      false
    );
    await setSurveyPageItemParam(surveyId, pageId, itemId, paramKey, value);
    mutate();
  }
});