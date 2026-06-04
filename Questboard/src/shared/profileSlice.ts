import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../lib/apiClient";

export type UserProfile = {
  username?: string;
  email?: string;
  membership?: string;
  achievementsCount?: number;
  avatarUrl?: string;
  role?: string;
};

type ProfileState = {
  data: UserProfile | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  "profile/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get<any>("/auth/me");

      return {
        username: String(response?.username ?? response?.name ?? ""),
        email: String(response?.email ?? ""),
        membership: String(response?.membership ?? response?.plan ?? "Free tier"),
        achievementsCount:
          typeof response?.achievements === "number"
            ? response.achievements
            : Array.isArray(response?.achievements)
            ? response.achievements.length
            : undefined,
        avatarUrl: String(response?.avatarUrl ?? response?.avatar ?? ""),
        role: String(response?.role ?? response?.userRole ?? "").toUpperCase(),
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        String((error as { message?: string })?.message ?? error ?? "Failed to load profile"),
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to load profile";
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
