import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/lgpd")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade e LGPD · Protocolo Soberano" },
      { name: "description", content: "Política de Privacidade e tratamento de dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD) — Instituto Venditti." },
      { property: "og:title", content: "LGPD · Protocolo Soberano" },
      { property: "og:url", content: "https://state-domain-protocol.lovable.app/lgpd" },
    ],
    links: [{ rel: "canonical", href: "https://state-domain-protocol.lovable.app/lgpd" }],
  }),
  component: Lgpd,
});

function Lgpd() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 px-6 py-6 md:px-12">
        <Link to="/" className="text-mono text-tracked text-[10px] text-muted-foreground hover:text-foreground">
          ← Voltar ao início
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-12">
        <h1 className="text-3xl font-light text-foreground md:text-4xl">
          Política de Privacidade e LGPD
        </h1>
        <p className="text-mono text-tracked mt-2 text-[10px] text-muted-foreground">
          Em conformidade com a Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section className="space-y-2">
            <h2 className="text-lg text-foreground">1. Controlador dos Dados</h2>
            <p>
              <strong>Instituto Venditti — Educação, Moda e Empreendedorismo</strong>
              <br />
              CNPJ 62.170.498/0001-98
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">2. Dados Coletados</h2>
            <ul className="ml-5 list-disc space-y-1">
              <li>Dados cadastrais: nome, e-mail e senha (criptografada).</li>
              <li>Dados de uso: progressão nos protocolos, frequências utilizadas, registros de voz e texto criados pelo próprio usuário.</li>
              <li>Dados técnicos: endereço IP, navegador, sistema operacional, cookies estritamente necessários.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">3. Finalidades do Tratamento</h2>
            <ul className="ml-5 list-disc space-y-1">
              <li>Permitir o acesso e funcionamento da plataforma.</li>
              <li>Personalizar a experiência e medir evolução do protocolo.</li>
              <li>Garantir segurança, prevenir fraudes e cumprir obrigações legais.</li>
              <li>Comunicação operacional (confirmação de cadastro, alertas, suporte).</li>
              <li>Envio de conteúdos, novidades e publicidade — apenas mediante consentimento expresso.</li>
            </ul>
          </section>

          <section className="space-y-2 rounded-lg border border-signal/40 bg-signal/5 p-4">
            <h2 className="text-lg text-foreground">4. Disclaimer — Consentimento para Publicidade</h2>
            <p>
              No momento do cadastro, o titular poderá <strong>aceitar receber comunicações de marketing,
              publicidade e ofertas</strong> do Instituto Venditti e parceiros relacionados ao Protocolo
              Soberano de Harmonia Quântica.
            </p>
            <p>
              Esse consentimento é <strong>opcional</strong> e pode ser revogado a qualquer momento por
              meio do link de descadastramento presente em cada mensagem ou por solicitação direta ao
              encarregado de dados.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">5. Compartilhamento</h2>
            <p>
              Os dados não são vendidos. Podem ser compartilhados apenas com operadores estritamente
              necessários (hospedagem, autenticação, envio de e-mail, processamento de pagamento) e com
              autoridades quando exigido por lei.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">6. Direitos do Titular (art. 18 da LGPD)</h2>
            <p>O titular pode, a qualquer tempo, solicitar:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso, correção e portabilidade dos dados;</li>
              <li>Anonimização, bloqueio ou eliminação;</li>
              <li>Revogação do consentimento;</li>
              <li>Informação sobre o uso compartilhado.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">7. Segurança e Retenção</h2>
            <p>
              Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não
              autorizados. Os dados são retidos pelo tempo necessário às finalidades descritas e às
              obrigações legais.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">8. Cookies</h2>
            <p>
              Utilizamos cookies essenciais ao funcionamento e, mediante consentimento, cookies
              analíticos para melhoria da experiência.
            </p>
          </section>

          <section className="space-y-2 border-t border-border/60 pt-6">
            <h2 className="text-lg text-foreground">9. Encarregado (DPO) e Contato</h2>
            <p>
              Para exercer seus direitos, escreva ao encarregado de dados do Instituto Venditti — CNPJ
              62.170.498/0001-98 — utilizando o canal oficial divulgado em nossos materiais.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
