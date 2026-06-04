import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso · Protocolo Soberano de Harmonia Quântica" },
      { name: "description", content: "Termos de Uso do Protocolo Soberano de Harmonia Quântica — Instituto Venditti." },
      { property: "og:title", content: "Termos de Uso · Protocolo Soberano" },
      { property: "og:url", content: "https://state-domain-protocol.lovable.app/termos-de-uso" },
    ],
    links: [{ rel: "canonical", href: "https://state-domain-protocol.lovable.app/termos-de-uso" }],
  }),
  component: TermosDeUso,
});

function TermosDeUso() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 px-6 py-6 md:px-12">
        <Link to="/" className="text-mono text-tracked text-[10px] text-muted-foreground hover:text-foreground">
          ← Voltar ao início
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-12">
        <h1 className="text-3xl font-light text-foreground md:text-4xl">Termos de Uso</h1>
        <p className="text-mono text-tracked mt-2 text-[10px] text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section className="space-y-2">
            <h2 className="text-lg text-foreground">1. Objeto</h2>
            <p>
              Estes Termos de Uso regulam o acesso e a utilização da plataforma{" "}
              <strong>Protocolo Soberano de Harmonia Quântica</strong>, mantida pelo{" "}
              <strong>Instituto Venditti — Educação, Moda e Empreendedorismo</strong>,
              inscrito no CNPJ sob o nº 62.170.498/0001-98, doravante denominado simplesmente "Instituto".
            </p>
            <p>
              A plataforma oferece protocolo de transformação de vida e treinamento empresarial de alta
              performance por meio de conteúdos digitais, frequências sonoras, materiais de leitura e
              ferramentas interativas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">2. Cadastro e Conta</h2>
            <p>
              Para acessar áreas restritas, o usuário deverá criar uma conta fornecendo dados verídicos
              e atualizados, sendo o único responsável pela guarda das credenciais.
            </p>
            <p>É vedado o compartilhamento de conta, uso por terceiros ou criação de contas falsas.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">3. Uso Permitido</h2>
            <p>
              O usuário se compromete a utilizar a plataforma de forma lícita, respeitando direitos de
              propriedade intelectual, sem reproduzir, distribuir ou comercializar os conteúdos sem
              autorização expressa do Instituto.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">4. Natureza do Conteúdo</h2>
            <p>
              Os protocolos, frequências e treinamentos têm finalidade educacional e de desenvolvimento
              pessoal e profissional. Não substituem acompanhamento médico, psicológico ou terapêutico.
              Resultados podem variar conforme o engajamento individual.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da plataforma — textos, áudios, marcas, layout, código e metodologia — é
              de titularidade exclusiva do Instituto Venditti, protegido pelas Leis 9.279/96 e 9.610/98.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">6. Suspensão e Encerramento</h2>
            <p>
              O Instituto poderá suspender ou encerrar contas que violem estes Termos, sem prejuízo das
              medidas legais cabíveis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">7. Alterações</h2>
            <p>
              Estes Termos podem ser atualizados a qualquer tempo. A versão vigente estará sempre
              disponível nesta página.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg text-foreground">8. Foro</h2>
            <p>
              Fica eleito o foro da comarca da sede do Instituto para dirimir quaisquer controvérsias
              decorrentes destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section className="space-y-2 border-t border-border/60 pt-6">
            <h2 className="text-lg text-foreground">Contato</h2>
            <p>
              Instituto Venditti — Educação, Moda e Empreendedorismo
              <br />
              CNPJ 62.170.498/0001-98
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
