import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

interface ITag {
  title: string;
  url: string;
}

interface ITags {
  tags: ITag[];
  addTag: (newTag: ITag) => void;
  currentActiveUrl: string;
  setCurrentActiveUrl: (newUrl: string) => void;
  deleteTag: (url: string) => void;
}

export const useTagsStore = create(
  immer<ITags>((set) => ({
    currentActiveUrl: '',
    tags: [],
    addTag: (newTag) =>
      set((state) => {
        const url = newTag.url;
        if (state.tags.find(e => e.url === url)) {
          return;
        }
        state.tags = [...state.tags.filter(tag => tag.url !== url), newTag];
      }),
    setCurrentActiveUrl: (newUrl) => {
      set(state => {
        state.currentActiveUrl = newUrl;
      })
    },
    deleteTag: (url) => set((state) => {
      state.tags = [...state.tags.filter(tag => tag.url !== url)];
    })
  })),
);
