import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect } from "react";
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
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@radix-ui/react-separator";
const acessoFormSchema = z.object({
  usuarioNome: z.string().optional(),
  imgUsuario: z.string().optional(),
  travaNome: z.string().optional(),
  travaMercado: z.string().optional(),
  data: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});
const AcessoEditPage = () => {
  const { id } = useParams(); // Obter o ID do acesso pela URL
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(acessoFormSchema),
  });
  useEffect(() => {
    // Carregar os dados do acesso ao montar o componente
    const fetchAcesso = async () => {
      try {
        // AJUSTAR DE ACORDO COM SUA API
        const response = await axios.get(`https://api.plug.com/acessos/${id}`);
        const acesso = response.data;
        form.reset({
          usuarioNome: acesso.usuarioId?.nome || "Sem usuário",
          imgUsuario: acesso.usuarioId?.imgUsuario || "",
          travaNome: acesso.travaId?.nome || "Sem trava",
          travaMercado: acesso.travaId?.nomeMercado || "Sem mercado",
          data: acesso.data || "",
          latitude: acesso.lat || "",
          longitude: acesso.long || "",
        });
      } catch (error) {
        toast({
          title: "Erro ao carregar acesso",
          description: "Não foi possível carregar os dados do acesso.",
        });
      }
    };
    fetchAcesso();
  }, [id, form]);
  async function onSubmit(data) {
    try {
      // AJUSTAR DE ACORDO COM SUA API
      await axios.put(
        `https://api.plug.com/acessos/${id}`,
        { ...data },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "Acesso atualizado com sucesso!",
        description: "As informações do acesso foram salvas.",
      });
      navigate("/acessos");
    } catch (error) {
      toast({
        title: "Erro ao atualizar acesso",
        description:
          "Ocorreu um erro ao salvar as alterações. Tente novamente.",
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
                children: "Editar Acesso",
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
                        children: "Acessos",
                      }),
                    }),
                    _jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
                    _jsx(BreadcrumbItem, {
                      children: _jsx(BreadcrumbPage, {
                        children: "Editar Acesso",
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
              name: "usuarioNome",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Nome do Usu\u00E1rio" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        disabled: true,
                        placeholder: "Nome do usu\u00E1rio",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "imgUsuario",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Imagem do Usu\u00E1rio" }),
                    _jsx(FormControl, {
                      children: field.value
                        ? _jsx("img", {
                            src: `data:image/png;base64,${field.value}`,
                            alt: "Imagem do Usu\u00E1rio",
                            className: "w-32 h-32 object-cover rounded",
                          })
                        : _jsx("p", { children: "Sem imagem dispon\u00EDvel" }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "travaNome",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Nome da Trava" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        disabled: true,
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
              name: "travaMercado",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Mercado da Trava" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        disabled: true,
                        placeholder: "Mercado da trava",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "data",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Data do Acesso" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        disabled: true,
                        placeholder: "Data do acesso",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "latitude",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Latitude" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        disabled: true,
                        placeholder: "Latitude",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx(FormField, {
              control: form.control,
              name: "longitude",
              render: ({ field }) =>
                _jsxs(FormItem, {
                  children: [
                    _jsx(FormLabel, { children: "Longitude" }),
                    _jsx(FormControl, {
                      children: _jsx(Input, {
                        disabled: true,
                        placeholder: "Longitude",
                        ...field,
                      }),
                    }),
                    _jsx(FormMessage, {}),
                  ],
                }),
            }),
            _jsx("div", {
              className: "flex justify-between items-center",
              children: _jsx(Button, {
                type: "button",
                variant: "outline",
                onClick: () => navigate(-1),
                className: "bg-gray-200 hover:bg-gray-300 text-black",
                children: "Voltar",
              }),
            }),
          ],
        }),
      }),
    ],
  });
};
export default AcessoEditPage;
