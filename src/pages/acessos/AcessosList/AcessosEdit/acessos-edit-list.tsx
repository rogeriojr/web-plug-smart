import React, { useEffect } from "react";
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
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import api from "@/services/api";

const acessoFormSchema = z.object({
  usuarioNome: z.string().optional(),
  imgUsuario: z.string().optional(),
  travaNome: z.string().optional(),
  travaMercado: z.string().optional(),
  data: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type AcessoFormValues = z.infer<typeof acessoFormSchema>;

const AcessoEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<AcessoFormValues>({
    resolver: zodResolver(acessoFormSchema),
  });

  useEffect(() => {
    const fetchAcesso = async () => {
      try {
        const response = await api.get(`acessos/${id}`);
        const acesso = response.data;

        const dataFormatada = acesso.data
          ? format(
              toZonedTime(new Date(acesso.data), "UTC"),
              "dd/MM/yyyy HH:mm"
            )
          : "";

        form.reset({
          usuarioNome: acesso.usuarioId?.nome || "Sem usuário",
          imgUsuario: acesso.usuarioId?.imgUsuario || "",
          travaNome: acesso.travaId?.nome || "Sem trava",
          travaMercado: acesso.travaId?.nomeMercado || "Sem mercado",
          data: dataFormatada,
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

  async function onSubmit(data: AcessoFormValues) {
    try {
      await api.put(
        `acessos/${id}`,
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

  const showTravaInfo =
    !form.getValues("latitude") && !form.getValues("longitude");

  return (
    <>
      <header className="flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold inline-block">Editar Acesso</h1>
        </div>

        <div className="flex items-center gap-2 px-4 mb-6">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Acessos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar Acesso</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seção do Usuário */}
            <div className="space-y-4 p-4 bg-muted/40 rounded-lg">
              <h2 className="text-lg font-semibold">Informações do Usuário</h2>
              <FormField
                control={form.control}
                name="usuarioNome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Usuário</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Nome do usuário"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imgUsuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem do Usuário</FormLabel>
                    <FormControl>
                      {field.value ? (
                        <img
                          src={`data:image/png;base64,${field.value}`}
                          alt="Imagem do Usuário"
                          className="w-32 h-32 object-cover rounded"
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          Sem imagem disponível
                        </p>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Seção da Trava ou Localização */}
            {showTravaInfo ? (
              <div className="space-y-4 p-4 bg-muted/40 rounded-lg">
                <h2 className="text-lg font-semibold">Informações da Trava</h2>
                <FormField
                  control={form.control}
                  name="travaNome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Trava</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Nome da trava"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="travaMercado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mercado da Trava</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Mercado da trava"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="space-y-4 p-4 bg-muted/40 rounded-lg">
                <h2 className="text-lg font-semibold">Localização</h2>
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Latitude" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Longitude" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Seção de Data */}
          <div className="p-4 bg-muted/40 rounded-lg">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Acesso</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Data do acesso" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-black"
            >
              Voltar
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AcessoEditPage;
