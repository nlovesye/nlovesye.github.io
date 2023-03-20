import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { GlobalState } from '@/models';
import defaultTheme from '@/config/theme/default.json';

const initialState: GlobalState = {
  loading: false,
  themeType: 'default',
  theme: defaultTheme,
  locale: '', // 国际化支持配置
  collapsed: true,
};

// slice
export const globalSlice = createSlice({
  name: 'global', // namespace
  initialState,
  reducers: {
    setLoading: (state: GlobalState, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setTheme: (
      state: GlobalState,
      {
        payload: { loading, themeType, theme },
      }: PayloadAction<Pick<GlobalState, 'theme' | 'themeType' | 'loading'>>,
    ) => {
      state.loading = loading;
      state.themeType = themeType;
      state.theme = theme;
    },
    updateCollapsed: (state: GlobalState) => {
      state.collapsed = !state.collapsed;
    },
  },
});

// actions
export const { setTheme, setLoading, updateCollapsed } = globalSlice.actions;

// reducer
export default globalSlice.reducer;
