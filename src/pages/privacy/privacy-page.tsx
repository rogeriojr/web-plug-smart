import React from "react";
import logo from "@/assets/icon.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PrivacyPolicy: React.FC = () => {
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
            Política de Privacidade
          </CardTitle>
          <CardDescription>
            Leia atentamente nossa política de privacidade para entender como
            tratamos seus dados.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-justify space-y-4">
          <section>
            <h2 className="text-xl font-semibold">1. Informações Coletadas</h2>
            <p>
              Coletamos informações pessoais fornecidas diretamente por você,
              como nome, e-mail, e outras fornecidas durante o uso de nossos
              serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Uso das Informações</h2>
            <p>
              Usamos suas informações para fornecer e melhorar nossos serviços,
              bem como para comunicar novidades e ofertas relevantes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              3. Compartilhamento de Dados
            </h2>
            <p>
              Podemos compartilhar dados com terceiros apenas quando necessário
              para a prestação dos serviços, ou em cumprimento às obrigações
              legais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Seus Direitos</h2>
            <p>
              Você tem o direito de acessar, corrigir ou excluir suas
              informações pessoais. Entre em contato conosco para exercer esses
              direitos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta política, entre em contato
              conosco pelo e-mail suporte@plugsmart.com.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
