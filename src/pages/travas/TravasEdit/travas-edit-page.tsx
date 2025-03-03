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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import api from "@/services/api";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { UsuarioSearchSelector } from "@/components/ui/usuario-search-selector";
import { useAuth } from "@/hooks/auth-context";

const travaFormSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(30, { message: "O nome não pode ter mais de 30 caracteres." }),
  nomeMercado: z
    .string()
    .min(2, { message: "O nome do mercado deve ter pelo menos 2 caracteres." })
    .max(50, {
      message: "O nome do mercado não pode ter mais de 50 caracteres.",
    }),
  deviceId: z.string().min(5, { message: "ID do dispositivo inválido." }),
  codigo: z
    .string()
    .min(6, { message: "O código deve ter pelo menos 6 caracteres." }),
  status: z.enum(["ativa", "inativa"], {
    required_error: "Selecione o status da trava.",
  }),
  deviceStatus: z.enum(["online", "offline"], {
    required_error: "Selecione o status do dispositivo.",
  }),
  powerStatus: z.enum(["on", "off"], {
    required_error: "Selecione o status de energia.",
  }),
  tempoDesligamento: z
    .number()
    .min(1, { message: "O tempo mínimo é 1 segundo." })
    .max(600, { message: "O tempo máximo é 600 segundos (10 minutos)." })
    .default(30),
  isPersonalizada: z.boolean().default(false),
  maioresDe18: z.boolean().default(false),
  usuarios: z.array(z.string()).optional(),
});

type TravaFormValues = z.infer<typeof travaFormSchema>;

const TravaEditPage = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Atualiza se o localStorage mudar
  useEffect(() => {
    const handleStorage = () => {
      const storedUser = localStorage.getItem("currentUser");
      setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<TravaFormValues>({
    resolver: zodResolver(travaFormSchema),
    defaultValues: {
      tempoDesligamento: 30,
      powerStatus: "on",
      isPersonalizada: false,
      maioresDe18: false,
      usuarios: [],
    },
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    const fetchTrava = async () => {
      try {
        const response = await api.get(`travas/${id}`);
        const trava = response.data;

        const tempoDesligamentoSegundos = trava.tempoDesligamento
          ? trava.tempoDesligamento / 1000
          : 30;

        form.reset({
          ...trava,
          status: trava.status,
          deviceStatus: trava.deviceStatus,
          powerStatus: trava.powerStatus,
          tempoDesligamento: tempoDesligamentoSegundos,
          isPersonalizada: trava.isPersonalizada || false,
          maioresDe18: trava.maioresDe18 || false,
          usuarios: trava.usuarios || [],
        });
      } catch (error) {
        toast({
          title: "Erro ao carregar trava",
          description: "Não foi possível carregar os dados da trava.",
          status: "error",
        });
      }
    };

    fetchTrava();
  }, [id, form]);

  async function onSubmit(data: TravaFormValues) {
    try {
      const payload = {
        ...data,
        tempoDesligamento: data.tempoDesligamento
          ? data.tempoDesligamento * 1000
          : 30000,
      };

      await api.put(`travas/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Trava atualizada com sucesso!",
        description: "As informações da trava foram salvas.",
      });

      navigate("/travas");
    } catch (error) {
      toast({
        title: "Erro ao atualizar trava",
        description:
          "Ocorreu um erro ao salvar as alterações. Tente novamente.",
        status: "error",
      });
    }
  }

  return (
    <>
      <header className="flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold inline-block">Editar Trava</h1>
        </div>

        <div className="flex items-center gap-2 px-4 mb-6">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Travas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar Trava</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Trava</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da trava" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomeMercado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Mercado</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do mercado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Dispositivo</FormLabel>
                <FormControl>
                  <Input placeholder="ID do dispositivo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código de ativação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded p-2">
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deviceStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status do Dispositivo</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded p-2">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="powerStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status de Energia</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2"
                    defaultValue="on"
                  >
                    <option value="on">Ligado</option>
                    <option value="off">Desligado</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tempoDesligamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo de Desligamento (segundos)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Tempo de desligamento em segundos (1-600)"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {currentUser?.tipo === "adm" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isPersonalizada"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <CheckboxPrimitive.Root
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      >
                        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </CheckboxPrimitive.Indicator>
                      </CheckboxPrimitive.Root>
                    </FormControl>
                    <FormLabel>Trava Personalizada</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maioresDe18"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <CheckboxPrimitive.Root
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      >
                        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </CheckboxPrimitive.Indicator>
                      </CheckboxPrimitive.Root>
                    </FormControl>
                    <FormLabel>Restrito a maiores de 18 anos</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("isPersonalizada") && (
                <FormField
                  control={form.control}
                  name="usuarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuários Autorizados</FormLabel>
                      <UsuarioSearchSelector
                        selectedUsers={field.value || []}
                        onUsersSelected={(users) => field.onChange(users)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-black"
            >
              Voltar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default TravaEditPage;
