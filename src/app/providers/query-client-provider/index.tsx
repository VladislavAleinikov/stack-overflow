import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./consts";

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
};