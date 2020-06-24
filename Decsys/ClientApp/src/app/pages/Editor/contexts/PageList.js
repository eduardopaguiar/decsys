import { createContext, useContext } from "react";

const PageListContext = createContext({
  addPage: () => {},
  deletePage: pageId => {},
  duplicatePage: pageId => {},
  setPageRandomize: (pageId, randomize) => {},
  movePage: (pageId, source, destination) => {},
  addItemToPage: (pageId, type) => {},
  movePageItem: (pageId, itemId, source, destination) => {},
  mutate: () => {},
  busy: {
    isPageDragging: false,
    isPageItemDragging: false,
    isListReordering: false
  },
  setBusy: ({ isPageDragging, isPageItemDragging, isListReordering }) => {},
  setResetAfterIndex: () => {}
});

export const usePageListContext = () => useContext(PageListContext);

export const PageListContextProvider = PageListContext.Provider;