import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GameEventPayload = {
  gameId: number;
  gameSlug?: string;
  eventType: string;
  metadata?: {
    headshot?: boolean;
    weapon?: string;
    map?: string;
    agent?: string;
  };
};

type GameState = {
  lastEvent: GameEventPayload | null;
  events: GameEventPayload[];
};

const initialState: GameState = {
  lastEvent: null,
  events: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addGameEvent(state, action: PayloadAction<GameEventPayload>) {
      state.lastEvent = action.payload;

      state.events.unshift(action.payload);

      // optional limit
      if (state.events.length > 100) {
        state.events.pop();
      }
    },

    clearGameEvents(state) {
      state.lastEvent = null;
      state.events = [];
    },
  },
});

export const { addGameEvent, clearGameEvents } = gameSlice.actions;

export default gameSlice.reducer;