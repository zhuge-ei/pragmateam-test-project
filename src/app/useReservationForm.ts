import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReserveSchema, type ReserveSchemaType } from "~/trpc/schemas/reserve";
import { api } from "~/trpc/react";

export const useReservationForm = (
  canReserve: boolean,
  refetch: () => Promise<void>,
) => {
  const { mutateAsync: reserve, isLoading: isMutationLoading } =
    api.reserve.useMutation({
      async onSuccess() {
        await refetch();
      },
    });
  const {
    register,
    handleSubmit,
    resetField,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ReserveSchemaType>({
    resolver: zodResolver(ReserveSchema),
    defaultValues: {},
    mode: "onChange",
    disabled: !canReserve || isMutationLoading,
  });

  const onSubmit = (input: ReserveSchemaType) => reserve(input);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    isValid,
    isMutationLoading,
    watch,
    resetField,
  };
};
