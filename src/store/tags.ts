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
}

export const useTagsStore = create(
  immer<ITags>((set) => ({
    currentActiveUrl: '',
    tags: [],
    addTag: (newTag) =>
      set((state) => {
        state.tags = [...state.tags.filter(tag => tag.url !== newTag.url), newTag];
      }),
    setCurrentActiveUrl: (newUrl) => {
      set(state => {
        state.currentActiveUrl = newUrl;
      })
    }
  })),
);
