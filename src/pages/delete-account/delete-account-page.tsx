import React, { useState } from "react";
import logo from "@/assets/icon.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AccountDeletion: React.FC = () => {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Simulação de requisição para exclusão de conta
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, reason }),
      });

      if (response.ok) {
        setSuccessMessage(
          "Solicitação enviada com sucesso. Sua conta será excluída em breve."
        );
        setEmail("");
        setReason("");
      } else {
        throw new Error(
          "Falha ao enviar a solicitação. Tente novamente mais tarde."
        );
      }
    } catch (error: any) {
      setErrorMessage(error.message);
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
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Solicitação de Exclusão de Conta
          </CardTitle>
          <CardDescription>
            Preencha os campos abaixo para solicitar a exclusão de sua conta.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {successMessage && (
            <div className="text-green-500 text-center mb-4">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                className="mt-1 block w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700"
              >
                Motivo da Exclusão
              </label>
              <Input
                id="reason"
                type="text"
                placeholder="Descreva o motivo da solicitação"
                className="mt-1 block w-full"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Enviar Solicitação
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDeletion;
