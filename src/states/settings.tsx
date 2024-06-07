'use client';

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import toast from "react-hot-toast";


/**
 * Since using zustand states doesn't work with class method, this class is only used
 * to construct a new default settings.
 */
export class Settings {
  diagramDays: number = 1;
  diagramType: 'balance' | 'usage' = 'usage';
  chartTimeRange: 'day' | 'week' | 'month' = 'day';
  chartItemsCount: number = 7;
  usageSmoothing: boolean = true;
  usageSpreading: boolean = true;
  usagePreHourUnit: boolean = true;
  usageSmartMerge: boolean = true;
}

export type SettingsKeys = keyof Settings;

interface SettingsState {
  settings: Settings;
  /**
   * Update current state to input one, then return current new states.
   * @param newSettings The new ``Settings`` class instance.
   */
  update: (newSettings: Settings) => (Settings);

  updateKey: <T extends keyof Settings>(key: T, newValue: Settings[T]) => void;

  /**
   * Update states through a mutateFn.
   *
   * mutateFn will receive a draft of the current settings state, then do some changes
   * on this draft. Then the change will automatically apply to new state.
   *
   * Notice you don't need to return the new state instance in `mutateFn`.
   *
   * Deprecated:
   *
   * This method doesn't work in some cases.
   */

  exportToClipboard: () => (void);

  /**
   * Import settings from clipboard.
   *
   * Notice: This will NOT check the data imported from clipboard. Means maybe the data is not eligible.
   * Notice: Will only run in Client Side, else do nothing.
   */
  importFromClipboard: () => (void);

  reset: () => (Settings);
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    immer(
      (set, get) => ({
        settings: new Settings(),

        update(newSettings: Settings) {
          set((state) => {
            state.settings = newSettings;
          });
          return get().settings;
        },

        updateKey(key, value) {
          set((state) => {
            state.settings[key] = value;
          });
        },

        exportToClipboard() {
          if (typeof window == 'undefined') {
            return;
          }

          navigator.clipboard.writeText(JSON.stringify(get().settings));
          toast.success('Settings JSON copied to clipboard');
        },

        async importFromClipboard() {
          if (typeof window == 'undefined') {
            return;
          }

          try {
            const newSettingsData = JSON.parse(await navigator.clipboard.readText());
            get().update(newSettingsData);
            toast.success('Successfully import settings from clipboard');
          } catch (e) {
            toast.error('Could not parse settings data from clipboard');
            toast.error(JSON.stringify(e));
          }
        },

        reset() {
          set((state) => {
            state.settings = {
              ...state.settings,
              ...(new Settings()),
            };
          });
          return get().settings;
        },
      }),
    ),
    {
      name: 'state_settings', // name of the item in the storage (must be unique)
    },
  ),
);