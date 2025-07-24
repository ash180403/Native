import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlantState {
  uploadedImage: string | null;
  plantInfo: string | null;
}

const initialState: PlantState = {
  uploadedImage: null,
  plantInfo: null,
};

const plantSlice = createSlice({
  name: 'plant',
  initialState,
  reducers: {
    setUploadedImage(state, action: PayloadAction<string | null>) {
      state.uploadedImage = action.payload;
    },
    setPlantInfo(state, action: PayloadAction<string | null>) {
      state.plantInfo = action.payload;
    },
  },
});

export const { setUploadedImage, setPlantInfo } = plantSlice.actions;
export default plantSlice.reducer;
