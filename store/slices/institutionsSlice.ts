import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Institution } from '@/types/firestore';
import { getInstitutions } from '@/services/firestoreService';

interface InstitutionsState {
  institutions: Institution[];
  loading: boolean;
  error: string | null;
}

const initialState: InstitutionsState = {
  institutions: [],
  loading: false,
  error: null,
};

export const fetchInstitutionsThunk = createAsyncThunk(
  'institutions/fetchInstitutions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getInstitutions();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const institutionsSlice = createSlice({
  name: 'institutions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstitutionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstitutionsThunk.fulfilled, (state, action: PayloadAction<Institution[]>) => {
        state.loading = false;
        state.institutions = action.payload;
      })
      .addCase(fetchInstitutionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default institutionsSlice.reducer;
