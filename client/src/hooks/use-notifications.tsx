import { useToast } from "@/hooks/use-toast";

export function useNotifications() {
  const { toast } = useToast();

  const showErrorNotification = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const showSuccessNotification = (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  };

  const showInfoNotification = (message: string) => {
    toast({
      title: "Info",
      description: message,
      variant: "default",
    });
  };

  return {
    showErrorNotification,
    showSuccessNotification,
    showInfoNotification,
  };
}
