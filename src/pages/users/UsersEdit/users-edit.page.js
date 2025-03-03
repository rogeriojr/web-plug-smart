import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
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
import { Separator } from "@radix-ui/react-separator";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
const api_token_authorization = import.meta.env.VITE_API_TOKEN_AUTHORIZATION;
const accountFormSchema = z.object({
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
  tipo: z.enum(["adm", "user"], {
    required_error: "Selecione o tipo de usuário.",
  }),
  desabilitarUsuario: z.boolean().default(false), // Campo desabilitarUsuario com valor padrão false
});
const UserEditPage = () => {
  const { id } = useParams(); // Obter o ID do usuário da URL
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      desabilitarUsuario: false, // Valor padrão para desabilitarUsuario
    },
  });
  // Carregar os dados do usuário ao montar o componente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`usuarios/${id}`);
        const user = response.data;
        console.log("Dados do usuário carregados:", user); // Log para depuração
        form.reset({
          nome: user.nome,
          email: user.email,
          cpf: user.cpf,
          telefone: user.telefone,
          dataDeNascimento: new Date(user.dataDeNascimento), // Certifique-se de que a data está no formato correto
          tipo: user.tipo,
          desabilitarUsuario: user.desabilitarUsuario || false, // Usar false como padrão se não houver valor
        });
        console.log("Dados do formulário resetados:", form.getValues()); // Log para depuração
      } catch (error) {
        console.error("Erro ao carregar usuário:", error); // Log para depuração
        toast({
          title: "Erro ao carregar usuário",
          description: "Ocorreu um erro ao carregar os dados do usuário.",
          status: "error",
        });
      }
    };
    fetchUser();
  }, [id, form]);
  async function onSubmit(data) {
    try {
      const formattedDate = data.dataDeNascimento.toISOString().split("T")[0];
      const payload = {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        telefone: data.telefone,
        dataDeNascimento: formattedDate,
        tipo: data.tipo,
        desabilitarUsuario: data.desabilitarUsuario, // Incluir o campo desabilitarUsuario no payload
      };
      await axios.put(`usuarios/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${api_token_authorization}`, // Adicionar token de autorização
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
  return _jsxs(_Fragment, {
    children: [
      _jsxs("header", {
        className:
          "flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto",
        children: [
          _jsxs("div", {
            className: "flex items-center",
            children: [
              _jsx(SidebarTrigger, { className: "-ml-1" }),
              _jsx("h1", {
                className: "text-xl font-semibold inline-block",
                children: "Editar Usu\u00E1rio",
              }),
            ],
          }),
          _jsxs("div", {
            className: "flex items-center gap-2 px-4 mb-6",
            children: [
              _jsx(Separator, {
                orientation: "vertical",
                className: "mr-2 h-4",
              }),
              _jsx(Breadcrumb, {
                children: _jsxs(BreadcrumbList, {
                  children: [
                    _jsx(BreadcrumbItem, {
                      className: "hidden md:block",
                      children: _jsx(BreadcrumbLink, {
                        href: "#",
                        children: "Usu\u00E1rios",
                      }),
                    }),
                    _jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
                    _jsx(BreadcrumbItem, {
                      children: _jsx(BreadcrumbPage, {
                        children: "Editar Usu\u00E1rio",
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
      _jsx(FormProvider, {
        ...form,
        children: _jsxs("form", {
          onSubmit: form.handleSubmit(onSubmit),
          className: "space-y-8",
          children: [
            _jsx(FormField, {
              control: form.control,
              name: "nome",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Nome" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        placeholder: "Nome completo",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "email",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Email" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        placeholder: "email@example.com",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "cpf",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "CPF" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, { placeholder: "CPF", ...field }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "telefone",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Telefone" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        placeholder: "Telefone",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "dataDeNascimento",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  className: "flex flex-col",
                  children: [
                    _jsx(FormLabel, { children: "Data de Nascimento" }),
                    _jsxs(Popover, {
                      children: [
                        _jsx(PopoverTrigger, {
                          asChild: true,
                          children: _jsx(FormControl, {
                            children: _jsxs(Button, {
                              variant: "outline",
                              className: cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              ),
                              children: [
                                field.value
                                  ? format(field.value, "dd/MM/yyyy")
                                  : _jsx("span", {
                                      children: "Selecione uma data",
                                    }),
                                _jsx(CalendarIcon, {
                                  className: "ml-auto h-4 w-4 opacity-50",
                                }),
                              ],
                            }),
                          }),
                        }),
                        _jsx(PopoverContent, {
                          className: "w-auto p-0",
                          align: "start",
                          children: _jsx(Calendar, {
                            mode: "single",
                            selected: field.value,
                            onSelect: field.onChange,
                            disabled: (date) =>
                              date > new Date() ||
                              date < new Date("1900-01-01"),
                            initialFocus: true,
                          }),
                        }),
                      ],
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "tipo",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  className: "flex flex-col",
                  children: [
                    _jsx(FormLabel, { children: "Tipo de Usu\u00E1rio" }),
                    _jsx(FormControl, {
                      children: _jsxs("select", {
                        ...field,
                        className: "w-full border rounded p-2",
                        children: [
                          _jsx("option", { value: "", children: "Selecione" }),
                          _jsx("option", {
                            value: "adm",
                            children: "Administrador",
                          }),
                          _jsx("option", {
                            value: "user",
                            children: "Usu\u00E1rio",
                          }),
                        ],
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "desabilitarUsuario",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  className: "flex flex-col",
                  children: [
                    _jsx(FormLabel, { children: "Status do Usu\u00E1rio" }),
                    _jsx(FormControl, {
                      children: _jsxs("select", {
                        ...field,
                        className: "w-full border rounded p-2",
                        value: field.value ? "true" : "false",
                        onChange: (e) =>
                          field.onChange(e.target.value === "true"),
                        children: [
                          _jsx("option", {
                            value: "false",
                            children: "Habilitado",
                          }),
                          _jsx("option", {
                            value: "true",
                            children: "Desabilitado",
                          }),
                        ],
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsxs("div", {
              className: "flex justify-between items-center",
              children: [
                _jsx(Button, {
                  type: "button",
                  variant: "outline",
                  onClick: () => navigate(-1),
                  className: "bg-gray-200 hover:bg-gray-300 text-black",
                  children: "Voltar",
                }),
                _jsx(Button, {
                  type: "submit",
                  className: "bg-blue-600 hover:bg-blue-700",
                  children: "Salvar Altera\u00E7\u00F5es",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
};
export default UserEditPage;
