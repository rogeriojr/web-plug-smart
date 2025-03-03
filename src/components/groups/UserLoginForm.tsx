import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth-context";
import logo from "@/assets/icon.png";

const api_url = import.meta.env.VITE_API_BASE_URL;
const api_token_authorization = import.meta.env.VITE_API_TOKEN_AUTHORIZATION;

const schema = z.object({
  email: z.string().email({ message: "Digite um e-mail válido" }).min(3),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type FormData = z.infer<typeof schema>;

const UserLoginForm: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage(null);

      const response = await fetch(`${api_url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${api_token_authorization}`,
        },
        body: JSON.stringify({
          email: data.email,
          senha: data.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        const errorData = await response.json();
        throw new Error(errorData?.message || "Erro ao fazer login");
      }

      const result = await response.json();
      const { usuario, access_token, refresh_token } = result;

      if (!usuario || !access_token || !refresh_token) {
        throw new Error("Resposta inválida do servidor");
      }

      login(access_token, refresh_token, usuario);
      navigate("/dashboard");
    } catch (error: any) {
      setErrorMessage(
        error.message || "Erro ao fazer login, verifique suas credenciais."
      );
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 px-8">
      <div className="flex items-center justify-center w-32 h-32 rounded-lg">
        <img
          src={logo}
          alt="Logo"
          className="object-cover w-24 h-24 rounded-md"
        />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Acesso à plataforma
          </CardTitle>
          <CardDescription>Coloque as informações de acesso</CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="email">E-mail</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Digite seu e-mail"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Senha</FormLabel>
                      <Link
                        to="#"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Entrar</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLoginForm;
