// @ts-nocheck

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import api from "@/services/api";

const smsFormSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+55\d{10,11}$/, {
      message:
        "O número deve estar no formato +55 seguido de 10 ou 11 dígitos.",
    })
    .nonempty({ message: "O número de telefone é obrigatório." }),
  message: z
    .string()
    .min(1, { message: "A mensagem não pode estar vazia." })
    .max(160, { message: "A mensagem deve ter no máximo 160 caracteres." }),
});

type SmsFormValues = z.infer<typeof smsFormSchema>;

const SmsSendPage = () => {
  const form = useForm<SmsFormValues>({
    resolver: zodResolver(smsFormSchema),
    defaultValues: {
      phoneNumber: "+55",
      message: "",
    },
  });

  async function onSubmit(data: SmsFormValues) {
    try {
      const payload = {
        phoneNumber: data.phoneNumber,
        message: data.message,
      };

      await api.post("/sms/send", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "SMS enviado com sucesso!",
        description: `Mensagem enviada para ${data.phoneNumber}.`,
      });

      form.reset({ phoneNumber: "+55", message: "" });
    } catch (error) {
      toast({
        title: "Erro ao enviar SMS",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        status: "error",
      });
    }
  }

  return (
    <>
      <header className="flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-2xl font-bold inline-block">
            Envio Personalizado de SMS
          </h1>
        </div>

        <div className="flex items-center gap-2 px-4 mb-6">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Notificações</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Envio Personalizado de SMS</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+55"
                    {...field}
                    className="border-gray-300 rounded-lg p-3 text-lg"
                    onFocus={(e) =>
                      !e.target.value.startsWith("+55") &&
                      form.setValue("phoneNumber", "+55")
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Digite sua mensagem (máximo 160 caracteres)"
                    {...field}
                    className="border-gray-300 rounded-lg p-3 text-lg w-full h-32 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Enviar SMS
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default SmsSendPage;
