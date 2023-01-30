import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import pocketbaseEs from "pocketbase";

export const address = "http://192.168.123.50:8070/";

export const client = new pocketbaseEs(address);

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
