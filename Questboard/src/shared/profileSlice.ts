import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { apiClient } from "../lib/apiClient";
import { fetchUserProfile, UserProfile, userWallet } from '../shared/api';

type ProfileState = {
  data: UserProfile | null;
  loading: boolean;
  error: string | null;

  walletQueue: Partial<userWallet>[];
};

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
  walletQueue: [],
};

export const fetchProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>('profile/fetch', async (_, thunkAPI) => {
  try {
    return await fetchUserProfile();
  } catch (error) {
    return thunkAPI.rejectWithValue(
      String(
        (error as { message?: string })?.message ??
          error ??
          'Failed to load profile',
      ),
    );
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    updateWallet(state, action: PayloadAction<Partial<userWallet>>) {
      Object.assign(state.data!.wallet!, action.payload);
    },
    flushWalletQueue(state) {
      if (!state.data?.wallet) return;

      for (const update of state.walletQueue) {
        Object.assign(state.data.wallet, update);
      }

      state.walletQueue = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(fetchProfile.fulfilled, (state, action) => {
        console.log(
          'PROFILE LOADED',
          action.payload.wallet,
          "ACTION PAYLOD",
          action.payload,
          'queued updates:',
          state.walletQueue.length,
        );

        state.data = action.payload;
        state.loading = false;
        state.error = null;
        if (state.data.wallet) {
          for (const update of state.walletQueue) {
            Object.assign(state.data.wallet, update);
          }

          state.walletQueue = [];
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Failed to load profile';
      });
      
  },
});

export const { clearProfile, updateWallet, flushWalletQueue } =
  profileSlice.actions;
export default profileSlice.reducer;
