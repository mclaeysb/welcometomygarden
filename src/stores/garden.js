import { get, writable } from 'svelte/store';

export const isUploading = writable(false);
export const uploadProgress = writable(0);
export const isFetchingGardens = writable(true);
export const allGardens = writable({});

export const addGardenLocally = (garden) => {
  allGardens.set({ ...get(allGardens), [garden.id]: garden });
};

export const updateGardenLocally = (garden) => {
  allGardens.set({ ...get(allGardens), [garden.id]: garden });
};
