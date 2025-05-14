import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataProvider } from "./study/add_screens/components/answers_context";
import { ToastProvider } from "@gluestack-ui/toast";

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <ToastProvider>
      <DataProvider>
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider mode="light">
            <Stack />
          </GluestackUIProvider>
        </QueryClientProvider>
      </DataProvider>
    </ToastProvider>
  );
}
