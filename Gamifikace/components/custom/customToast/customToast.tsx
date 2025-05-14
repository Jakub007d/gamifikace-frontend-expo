import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

type ToastType = ReturnType<typeof useToast>;

const showToast = (
  toast: ToastType,
  title: string,
  action?: "muted" | "error" | "warning" | "success" | "info" | undefined,
  description?: string
) => {
  toast.show({
    placement: "bottom",
    render: ({ id }) => (
      <Toast nativeID={id} action={action} variant="solid">
        <VStack space="xs">
          <ToastTitle>{title}</ToastTitle>
          {description && <ToastDescription>{description}</ToastDescription>}
        </VStack>
      </Toast>
    ),
  });
};
export { showToast };
