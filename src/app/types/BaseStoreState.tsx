interface BaseStoreState {
  tg: TGUser | null;
  userId: string | null;
  setTg: (tg: TGUser | null) => void;
  removeTg: () => void;
  removeUserId: () => void;
}