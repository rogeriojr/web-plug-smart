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
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import api from "@/services/api";

const accountFormSchema = z
  .object({
    nome: z
      .string()
      .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
      .max(30, { message: "O nome não pode ter mais de 30 caracteres." }),
    email: z.string().email({ message: "Insira um email válido." }),
    cpf: z.string().min(11, { message: "CPF inválido." }),
    telefone: z.string(),
    dataDeNascimento: z.date({
      required_error: "A data de nascimento é obrigatória.",
    }),
    tipo: z.enum(["adm", "comum", "mercado"], {
      required_error: "Selecione o tipo de usuário.",
    }),
    desabilitarUsuario: z.boolean().default(false),
    travaId: z.array(z.string()).optional(),
    imagem: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.tipo === "mercado" &&
      (!data.travaId || data.travaId.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Selecione pelo menos uma trava para usuários do tipo mercado.",
        path: ["travaId"],
      });
    }
  });

type AccountFormValues = z.infer<typeof accountFormSchema>;

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState("");
  const [isBase64, setIsBase64] = useState(false);
  const [loading, setLoading] = useState(false);
  const [travaOptions, setTravaOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { desabilitarUsuario: false },
  });

  const tipo = form.watch("tipo");

  // Adicione este useEffect para carregar as travas
  useEffect(() => {
    const fetchTravas = async () => {
      try {
        const response = await api.get("travas");
        const options = [
          { value: "", label: "Nenhuma trava" },
          ...response.data.data.map((trava: any) => ({
            value: trava._id,
            label: trava.nome,
          })),
        ];
        setTravaOptions(options);
      } catch (error) {
        console.error("Erro ao buscar travas:", error);
        toast({
          title: "Erro ao carregar travas",
          description: "Não foi possível carregar a lista de travas.",
          status: "error",
        });
      }
    };

    if (tipo === "mercado") {
      fetchTravas();
    }
  }, [tipo]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`usuarios/${id}`);
        const user = response.data;

        // Formatação correta da data
        const birthDate = new Date(user.dataDeNascimento);
        user.imagem
          ? setIsBase64(true)
          : setUserImage(
              user.imagem ||
                "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
            );

        form.reset({
          ...user,
          dataDeNascimento: birthDate,
          tipo: user.travaId?.length > 0 ? "mercado" : user.tipo,
          travaId: user.travaId || [],
        });
      } catch (error) {
        toast({
          title: "Erro ao carregar usuário",
          description:
            error instanceof Error
              ? error.message
              : "Não foi possível obter os dados do usuário",
          status: "error",
        });

        // Redireciona se for erro de autenticação
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, form]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  async function onSubmit(data: AccountFormValues) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token de autenticação não encontrado.");

      // Formatação correta da data
      const formattedDate = format(data.dataDeNascimento, "yyyy-MM-dd");

      const payload = {
        ...data,
        dataDeNascimento: formattedDate,
        // Mantém o tipo correto
        tipo: data.tipo,
        // Filtra travas vazias
        travaId:
          data.tipo === "mercado"
            ? data.travaId.filter((id) => id !== "")
            : undefined,
      };

      await api.put(`usuarios/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Usuário atualizado com sucesso!",
        description: "As informações do usuário foram salvas.",
      });

      navigate("/users");
    } catch (error) {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao atualizar o usuário. Tente novamente.",
        status: "error",
      });
    }
  }

  const toggleUserStatus = async (newStatus: boolean) => {
    try {
      console.log(newStatus, "newStatus");
      console.log("🔍 Entrou na função toggleUserStatus");

      // Recupera o token do localStorage
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("❌ Token de autenticação não encontrado.");

      console.log("✅ Token encontrado:", token);

      // Verifica se o ID está definido
      if (typeof id === "undefined" || id === null) {
        throw new Error("❌ ID do usuário não encontrado.");
      }
      console.log("✅ ID do usuário:", id);

      // Criar um payload limpo para evitar problemas de serialização
      const payload = { desabilitarUsuario: newStatus };
      console.log("📦 Payload enviado:", payload);

      // Chama a API para atualizar o status do usuário
      const response = await api.put(`usuarios/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Resposta da API:", response);

      // Atualiza o formulário com o novo status
      if (form && typeof form.setValue === "function") {
        form.setValue("desabilitarUsuario", newStatus);
        console.log("✅ Formulário atualizado com o novo status.");
      } else {
        console.warn(
          "⚠️ Objeto form está inválido ou setValue não é uma função."
        );
      }

      // Exibe uma notificação de sucesso
      toast({
        title: "Status atualizado!",
        description: `Usuário ${
          newStatus ? "desabilitado" : "habilitado"
        } com sucesso.`,
      });
    } catch (error) {
      console.error("❌ Erro ao alterar status:", error);

      // Exibe uma notificação de erro
      toast({
        title: "Erro ao alterar status",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível alterar o status do usuário.",
        status: "error",
      });
    }
  };

  return (
    <>
      <header className="flex flex-col gap-4 p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Editar Usuário</h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              form.watch("desabilitarUsuario") ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {form.watch("desabilitarUsuario") ? "Desabilitado" : "Habilitado"}
          </span>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/users">Usuários</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar Usuário</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Seção da Imagem */}
            <div className="md:col-span-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>Foto do Usuário</FormLabel>
                  <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={
                        isBase64
                          ? `data:image/png;base64,${userImage}`
                          : userImage
                      }
                      alt="User"
                      className="h-32 w-32 rounded-full object-cover border-4 border-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="CPF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataDeNascimento"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tipo de Usuário</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border rounded p-2"
                        >
                          <option value="">Selecione</option>
                          <option value="adm">Administrador</option>
                          <option value="comum">Usuário</option>
                          <option value="mercado">Mercado</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {tipo === "mercado" && (
                  <FormField
                    control={form.control}
                    name="travaId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Travas Vinculadas</FormLabel>
                        <FormControl>
                          {travaOptions.length > 0 ? (
                            <select
                              multiple
                              {...field}
                              className="w-full border rounded p-2 h-32"
                              value={field.value || []}
                              onChange={(e) => {
                                const selected = Array.from(
                                  e.target.selectedOptions
                                )
                                  .map((opt) => opt.value)
                                  .filter((v) => v !== "");

                                field.onChange(selected);
                              }}
                            >
                              {travaOptions.map((trava) => (
                                <option
                                  key={trava.value}
                                  value={trava.value}
                                  // Marca as travas existentes
                                  selected={field.value?.includes(trava.value)}
                                >
                                  {trava.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Nenhuma trava disponível.
                            </p>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* <FormField
                  control={form.control}
                  name="desabilitarUsuario"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Status do Usuário</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border rounded p-2"
                          value={field.value ? "true" : "false"}
                          onChange={(e) =>
                            field.onChange(e.target.value === "true")
                          }
                        >
                          <option value="false">Habilitado</option>
                          <option value="true">Desabilitado</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <div className="md:col-span-2">
                  <FormField
                    name="dataDeNascimento"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Nascimento</FormLabel>
                        {/* Mantenha o datepicker existente */}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        className={`w-full ${
                          form.watch("desabilitarUsuario")
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        {form.watch("desabilitarUsuario")
                          ? "Habilitar Usuário"
                          : "Desabilitar Usuário"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Ação</DialogTitle>
                        <DialogDescription>
                          Tem certeza que deseja{" "}
                          {form.watch("desabilitarUsuario")
                            ? "habilitar"
                            : "desabilitar"}{" "}
                          este usuário? Isso afetará o acesso ao sistema.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={() =>
                              toggleUserStatus(
                                !form.watch("desabilitarUsuario")
                              )
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Confirmar
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-32"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              className="w-32 bg-blue-600 hover:bg-blue-700"
            >
              Salvar
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default UserEditPage;
