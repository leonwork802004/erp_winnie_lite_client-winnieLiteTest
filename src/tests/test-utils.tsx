import { RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { VirtuosoMockContext } from "react-virtuoso";
import { ButtonInfoSchema } from "@features/userButton";
import { AppProvider } from "@routes/appProvider";

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  const user = userEvent.setup();

  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <AppProvider>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 300, itemHeight: 100 }}
          >
            <Router>{children}</Router>
          </VirtuosoMockContext.Provider>
        </AppProvider>
      ),
      ...options,
    }),
    user,
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRender as render };

export const url = `${import.meta.env.VITE_SERVER_URL}/api/v1`;

export const mockButtonRequest = (featureNames: string[]) => {
  const mockButtons: ButtonInfoSchema = featureNames.map(
    (featureName, index) => ({
      Title: "",
      Id: index + 1,
      FeatureName: featureName,
    })
  );

  nock(url)
    .get("/button/userPage")
    .query({ page: featureNames[0].split("_")[0] })
    .reply(200, mockButtons);
};

export const convertHexToRGBA = (hexCode: string) => {
  let hex = hexCode.replace("#", "");

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};
