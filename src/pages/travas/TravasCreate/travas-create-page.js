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
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@radix-ui/react-separator";
import { Link, useNavigate } from "react-router-dom";
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
    .min(1, {
      message: "O tempo de desligamento deve ser pelo menos 1 segundo.",
    })
    .max(300, {
      message: "O tempo de desligamento não pode exceder 300 segundos.",
    })
    .default(30),
});
const TravaCreatePage = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(travaFormSchema),
    defaultValues: {
      tempoDesligamento: 30,
      powerStatus: "on", // Valor padrão para o status de energia
    },
  });
  const watchedValues = useWatch({
    control: form.control,
  });
  async function onSubmit(data) {
    try {
      const tempoDesligamento = data.tempoDesligamento || 30;
      const payload = {
        ...data,
        tempoDesligamento: tempoDesligamento * 1000, // Convertendo para milissegundos
        usuarios: [],
      };
      // AJUSTAR DE ACORDO COM SUA API
      await axios.post("https://api.plug.com/travas", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast({
        title: "Trava criada com sucesso!",
        description: "A nova trava foi cadastrada.",
      });
      setTimeout(() => {
        navigate("/travas");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro ao criar trava",
        description: "Ocorreu um erro ao criar a trava. Tente novamente.",
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
                children: "Criar Nova Trava",
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
                        children: "Travas",
                      }),
                    }),
                    _jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
                    _jsx(BreadcrumbItem, {
                      children: _jsx(BreadcrumbPage, {
                        children: _jsx(Link, {
                          to: "/travas/create",
                          children: "Criar Trava",
                        }),
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
                    _jsx(FormLabel, { children: "Nome da Trava" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        placeholder: "Nome da trava",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "nomeMercado",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Nome do Mercado" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        placeholder: "Nome do mercado",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "deviceId",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "ID do Dispositivo" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        placeholder: "ID do dispositivo",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "codigo",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "C\u00F3digo" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        placeholder: "C\u00F3digo de ativa\u00E7\u00E3o",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "status",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Status" }),
                    _jsx(FormControl, {
                      children: _jsxs("select", {
                        ...field,
                        className: "w-full border rounded p-2",
                        defaultValue: "",
                        children: [
                          _jsx("option", {
                            value: "",
                            disabled: true,
                            children: "Selecione",
                          }),
                          _jsx("option", { value: "ativa", children: "Ativa" }),
                          _jsx("option", {
                            value: "inativa",
                            children: "Inativa",
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
              name: "deviceStatus",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Status do Dispositivo" }),
                    _jsx(FormControl, {
                      children: _jsxs("select", {
                        ...field,
                        className: "w-full border rounded p-2",
                        defaultValue: "",
                        children: [
                          _jsx("option", {
                            value: "",
                            disabled: true,
                            children: "Selecione",
                          }),
                          _jsx("option", {
                            value: "online",
                            children: "Online",
                          }),
                          _jsx("option", {
                            value: "offline",
                            children: "Offline",
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
              name: "powerStatus",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Status de Energia" }),
                    _jsx(FormControl, {
                      children: _jsxs("select", {
                        ...field,
                        className: "w-full border rounded p-2",
                        defaultValue: "on",
                        children: [
                          _jsx("option", { value: "on", children: "Ligado" }),
                          _jsx("option", {
                            value: "off",
                            children: "Desligado",
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
              name: "tempoDesligamento",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, {
                      children: "Tempo de Desligamento (segundos)",
                    }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        type: "number",
                        placeholder: "Tempo de desligamento (padr\u00E3o: 30s)",
                        ...field,
                        onChange: (e) => field.onChange(Number(e.target.value)),
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx("div", {
              className: "flex justify-end",
              children: _jsx(Button, {
                type: "submit",
                children: "Criar Trava",
              }),
            }),
          ],
        }),
      }),
    ],
  });
};
export default TravaCreatePage;
