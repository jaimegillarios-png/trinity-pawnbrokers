import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Set here so `sanity deploy` publishes to the same address every time
  // instead of stopping to ask for one.
  studioHost: 'trinity-pawnbrokers',
  // Moved here from the top level in this CLI version, which warns otherwise.
  deployment: { autoUpdates: true },
});
