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
import { Separator } from "@radix-ui/react-separator";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { format, parse, isValid } from "date-fns";

const accountFormSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(30, { message: "O nome não pode ter mais de 30 caracteres." }),
  email: z.string().email({ message: "Insira um email válido." }),
  cpf: z.string().min(11, { message: "CPF inválido." }),
  telefone: z.string(),
  dataDeNascimento: z
    .string()
    .refine((val) => isValid(parse(val, "dd/MM/yyyy", new Date())), {
      message: "Data inválida (use DD/MM/AAAA)",
    })
    .transform((val) => parse(val, "dd/MM/yyyy", new Date())),
  tipo: z.enum(["adm", "comum", "mercado"], {
    required_error: "Selecione o tipo de usuário.",
  }),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  desabilitarUsuario: z.boolean().default(false),
  travaId: z.array(z.string()).optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const UserCreatePage = () => {
  const [travaOptions, setTravaOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Função para formatar a entrada da data
  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    let formatted = "";
    if (digits.length > 4) {
      formatted = `${day}/${month}/${year}`;
    } else if (digits.length > 2) {
      formatted = `${day}/${month}`;
    } else {
      formatted = day;
    }
    return formatted;
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      desabilitarUsuario: false,
    },
  });

  const tipo = form.watch("tipo");

  useEffect(() => {
    if (tipo === "mercado") {
      api
        .get("travas")
        .then((response) => {
          const options = [
            { value: "", label: "Nenhuma trava" }, // Opção para nenhuma trava
            ...response.data.data.map((trava: any) => ({
              value: trava._id,
              label: trava.nome,
            })),
          ];
          setTravaOptions(options);
        })
        .catch((error) => {
          console.error("Erro ao buscar travas:", error);
          toast({
            title: "Erro ao carregar travas",
            description: "Não foi possível carregar a lista de travas.",
            status: "error",
          });
        });
    }
  }, [tipo]);

  async function onSubmit(data: AccountFormValues) {
    try {
      const payload = {
        ...data,
        dataDeNascimento: format(data.dataDeNascimento, "yyyy-MM-dd"),
        status: "ativo",
        travaId:
          data.tipo === "mercado" && data.travaId?.some((t) => t !== "")
            ? data.travaId?.filter((t) => t !== "")
            : undefined,
      };

      await api.post("usuarios", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Usuário criado com sucesso!",
        description: "O novo usuário foi cadastrado.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário. Tente novamente.",
        status: "error",
      });
    }
  }

  return (
    <>
      <header className="flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold inline-block">
            Criar Novo Usuário
          </h1>
        </div>

        <div className="flex items-center gap-2 px-4 mb-6">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Usuários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <Link to="/users/create">Criar Usuário</Link>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Campo Nome */}
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
          {/* Campo Email */}
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
          {/* Campo CPF */}
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
          {/* Campo Telefone */}
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
          {/* Campo Data de Nascimento */}
          <FormField
            control={form.control}
            name="dataDeNascimento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="DD/MM/AAAA"
                    value={
                      field.value instanceof Date
                        ? format(field.value, "dd/MM/yyyy")
                        : field.value
                    }
                    onChange={(e) => {
                      const formattedValue = formatDateInput(e.target.value);
                      // Atualiza o campo com a string formatada
                      field.onChange(formattedValue);
                    }}
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo Tipo de Usuário */}
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tipo de Usuário</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded p-2">
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
          {/* Campo Senha */}
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo Desabilitar Usuário */}
          <FormField
            control={form.control}
            name="desabilitarUsuario"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Status do Usuário</FormLabel>
                <FormControl>
                  <select
                    className="w-full border rounded p-2"
                    value={field.value ? "true" : "false"}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <option value="false">Habilitado</option>
                    <option value="true">Desabilitado</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo Travas (apenas para tipo mercado) */}
          {tipo === "mercado" && (
            <FormField
              control={form.control}
              name="travaId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Travas Vinculadas</FormLabel>
                  <FormControl>
                    {travaOptions?.length > 0 ? (
                      <select
                        multiple
                        {...field}
                        className="w-full border rounded p-2 h-32"
                        onChange={(e) => {
                          const selectedOptions = Array?.from(
                            e.target.selectedOptions
                          )?.map((opt) => opt?.value);

                          // Se a opção "Nenhuma trava" for selecionada, limpa o campo
                          if (selectedOptions.includes("")) {
                            field.onChange([]);
                          } else {
                            field.onChange(selectedOptions);
                          }
                        }}
                      >
                        {/* Adiciona a opção padrão */}
                        {travaOptions?.map((trava) => (
                          <option key={trava.value} value={trava.value}>
                            {trava?.label}
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
          <div className="flex justify-end">
            <Button type="submit">Criar Usuário</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default UserCreatePage;
