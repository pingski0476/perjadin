import create from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import pocketbaseEs from "pocketbase";

export const client = new pocketbaseEs("http://127.0.0.1:8090/");

const useStore = create(
  devtools(
    persist(
      (set) => ({
        currentUser: null,
        setCurrentUser: (client) => {
          set({ currentUser: client });
        },
        logoutUser: () => set({ currentUser: null }),
      }),
      { name: "user-login", storage: createJSONStorage(() => sessionStorage) }
    )
  )
);

const useData = create(
  devtools((set) => ({
    dataST: [],
    dataSTObj: {},
    setDataST: (data) => {
      set({ dataST: data });
    },
    setData: (obj) => {
      set({ dataSTObj: obj });
    },
  }))
);

export const useUserStore = useStore;

export const useST = useData;
