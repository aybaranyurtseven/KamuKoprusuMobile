import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Complaint } from '@/types/firestore';

interface ComplaintsState {
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'resolved'; // Example filters
}

const initialState: ComplaintsState = {
  complaints: [],
  loading: false,
  error: null,
  filter: 'all',
};

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    setComplaints: (state, action: PayloadAction<Complaint[]>) => {
      state.complaints = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilter: (state, action: PayloadAction<'all' | 'pending' | 'resolved'>) => {
      state.filter = action.payload;
    },
  },
});

export const { setComplaints, setLoading, setFilter } = complaintsSlice.actions;
export default complaintsSlice.reducer;
