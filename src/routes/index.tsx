import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  Droplets,
  History,
  Leaf,
  Plus,
  Send,
  Zap,
} from "lucide-react";

import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/banco-do-brasil.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ImpactaIA | Pegada Ambiental de IA" },
      {
        name: "description",
        content: "Estime o consumo de água, energia e emissões dos seus prompts de inteligência artificial.",
      },
      { property: "og:title", content: "ImpactaIA | Pegada Ambiental de IA" },
      {
        property: "og:description",
        content: "Entenda a pegada ambiental dos seus prompts de inteligência artificial.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "analyze" | "history";
type ResultTab = "result" | "method" | "sources";

const examples = [
  "Crie um relatório executivo sobre tendências de crédito no agronegócio brasileiro.",
  "Resuma as principais tendências do mercado financeiro brasileiro em 2026.",
  "Crie um plano de negócios para uma fintech de crédito rural sustentável.",
];

const historyItems = [
  { day: "22", prompt: "Faça um relatório do agronegócio", model: "GPT-4", tokens: 15, water: "8,8 mL", carbon: "4,09 g CO₂e", time: "20:20" },
  { day: "22", prompt: "Gere um relatório sobre sustentabilidade corporativa com métricas ESG", model: "GPT-4", tokens: 71, water: "40,8 mL", carbon: "19,00 g CO₂e", time: "20:07" },
  { day: "21", prompt: "Resuma as principais tendências do mercado financeiro brasileiro em 2026.", model: "Claude 3 Sonnet", tokens: 35, water: "13,5 mL", carbon: "6,29 g CO₂e", time: "20:07" },
  { day: "20", prompt: "Qual é a taxa Selic atual?", model: "GPT-3.5", tokens: 13, water: "2,9 mL", carbon: "1,37 g CO₂e", time: "20:07" },
  { day: "18", prompt: "Crie um plano de negócios detalhado para uma fintech de crédito rural sustentável.", model: "Claude 3 Opus", tokens: 42, water: "26,9 mL", carbon: "12,51 g CO₂e", time: "20:07" },
];

function Index() {
  const [view, setView] = useState<View>("analyze");
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [tab, setTab] = useState<ResultTab>("result");
  const [period, setPeriod] = useState("Este mês");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const tokens = useMemo(() => Math.max(1, Math.round(submittedPrompt.length / 3.5)), [submittedPrompt]);
  const water = (tokens * 0.59).toFixed(1).replace(".", ",");
  const energy = (tokens * 1.17).toFixed(2).replace(".", ",");
  const carbon = (tokens * 0.273).toFixed(2).replace(".", ",");

  function analyze(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setSubmittedPrompt(clean);
    setPrompt(clean);
    setView("analyze");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-t-4 border-brand-yellow bg-primary text-primary-foreground shadow-header">
        <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button className="flex items-center gap-3" onClick={() => { setView("analyze"); setSubmittedPrompt(""); }} aria-label="Ir para o início">
            <span className="brand-mark" aria-hidden="true">
              <img src={logoAsset.url} alt="" />
            </span>
            <span className="hidden border-l border-primary-foreground/30 pl-3 text-left sm:block">
              <strong className="block text-base leading-none">Impacta<span className="text-brand-yellow">IA</span></strong>
              <small className="mt-1 block text-xs text-primary-foreground/75">Pegada Ambiental de IA</small>
            </span>
          </button>

          <nav className="flex h-full items-center gap-1" aria-label="Navegação principal">
            <Button variant="nav" data-active={view === "analyze"} onClick={() => setView("analyze")}>
              <Leaf className="sm:hidden" /> <span className="hidden sm:inline">Analisar</span>
            </Button>
            <Button variant="nav" data-active={view === "history"} onClick={() => setView("history")}>
              <History className="sm:hidden" /> <span className="hidden sm:inline">Histórico</span>
            </Button>
          </nav>

          <div className="hidden text-right md:block">
            <strong className="block text-sm">Kallyne Melo</strong>
            <span className="text-xs text-primary-foreground/70">Banco do Brasil</span>
          </div>
        </div>
      </header>

      {view === "history" ? (
        <HistoryView period={period} setPeriod={setPeriod} />
      ) : submittedPrompt ? (
        <AnalysisView
          prompt={prompt}
          setPrompt={setPrompt}
          analyze={analyze}
          inputRef={inputRef}
          tab={tab}
          setTab={setTab}
          tokens={tokens}
          water={water}
          energy={energy}
          carbon={carbon}
        />
      ) : (
        <HomeView prompt={prompt} setPrompt={setPrompt} analyze={analyze} inputRef={inputRef} />
      )}
    </div>
  );
}

function HomeView({ prompt, setPrompt, analyze, inputRef }: PromptProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-5xl flex-col items-center justify-center px-4 pb-24 pt-12">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-brand-yellow shadow-brand">
          <Leaf className="size-7 text-primary" />
        </span>
        <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">Por onde começamos?</h1>
        <p className="mt-3 text-muted-foreground">Descubra o impacto ambiental do seu próximo prompt.</p>
      </div>

      <PromptInput onSubmit={({ text }) => analyze(text)} className="w-full max-w-3xl rounded-2xl border-border bg-card shadow-composer">
        <PromptInputTextarea
          ref={inputRef}
          autoFocus
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Pergunte à ImpactaIA"
          className="min-h-28 px-5 pt-5 text-base"
        />
        <PromptInputFooter className="px-3 pb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-8 items-center justify-center rounded-full bg-secondary"><Plus className="size-4" /></span>
            <span className="hidden sm:inline">GPT-4 • estimativa completa</span>
          </div>
          <PromptInputSubmit disabled={!prompt.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90" aria-label="Analisar impacto">
            <ArrowUp />
          </PromptInputSubmit>
        </PromptInputFooter>
      </PromptInput>

      <div className="mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
        {examples.map((example) => (
          <Button key={example} variant="suggestion" onClick={() => { setPrompt(example); inputRef.current?.focus(); }}>
            {example.split(".")[0]}
          </Button>
        ))}
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">Os resultados são estimativas indicativas baseadas em médias da literatura científica.</p>
    </main>
  );
}

type PromptProps = {
  prompt: string;
  setPrompt: (value: string) => void;
  analyze: (value: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
};

function AnalysisView({ prompt, setPrompt, analyze, inputRef, tab, setTab, tokens, water, energy, carbon }: PromptProps & {
  tab: ResultTab;
  setTab: (tab: ResultTab) => void;
  tokens: number;
  water: string;
  energy: string;
  carbon: string;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-7">
        <p className="text-sm font-semibold text-accent">ANÁLISE AMBIENTAL</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-primary sm:text-4xl">Pegada do seu prompt</h1>
        <p className="mt-2 text-muted-foreground">Uma estimativa clara do impacto gerado por esta interação.</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="space-y-4">
          <PromptInput onSubmit={({ text }) => analyze(text)} className="rounded-lg border-border bg-card shadow-panel">
            <PromptInputTextarea ref={inputRef} value={prompt} onChange={(event) => setPrompt(event.target.value)} className="min-h-52 px-5 pt-5 text-base" />
            <PromptInputFooter className="border-t border-border px-4 py-3">
              <span className="text-xs text-muted-foreground">≈ {Math.max(1, Math.round(prompt.length / 3.5))} tokens</span>
              <PromptInputSubmit disabled={!prompt.trim()} className="w-auto rounded-md bg-primary px-4 text-primary-foreground hover:bg-primary/90">
                <Send className="size-4" /><span>Analisar</span>
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
          <div className="rounded-lg border border-warning-border bg-warning px-4 py-4 text-sm text-warning-foreground">
            <strong>Estimativa indicativa.</strong> O impacto real varia conforme provedor, região e infraestrutura.
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-panel">
          <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-7">
            <h2 className="font-display text-xl font-semibold text-primary">Resultado da análise</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
              <span className="size-2 rounded-full bg-success" /> Impacto baixo
            </span>
          </div>
          <div className="flex border-b border-border px-4 sm:px-7">
            {([['result', 'Resultado'], ['method', 'Metodologia'], ['sources', 'Fontes']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={`tab-button ${tab === key ? "tab-button-active" : ""}`}>{label}</button>
            ))}
          </div>
          <div className="p-5 sm:p-7">
            {tab === "result" && <ResultContent tokens={tokens} water={water} energy={energy} carbon={carbon} />}
            {tab === "method" && (
              <div className="prose-panel">
                <h3>Como calculamos</h3>
                <p>Estimamos a quantidade de tokens do texto e aplicamos fatores médios de consumo por processamento em data centers.</p>
                <p>Os valores consideram energia computacional, resfriamento e intensidade média de carbono da infraestrutura.</p>
              </div>
            )}
            {tab === "sources" && (
              <div className="prose-panel">
                <h3>Nível de confiança da estimativa</h3>
                <strong className="text-destructive">Baixa</strong>
                <p>Prompt curto — margem de incerteza maior (±50%). Tokens representam uma pequena amostra.</p>
                <p className="text-xs">Referências: médias públicas de eficiência energética de data centers e estudos sobre consumo hídrico de modelos de linguagem.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultContent({ tokens, water, energy, carbon }: { tokens: number; water: string; energy: string; carbon: string }) {
  const metrics = [
    { icon: Droplets, label: "Consumo de água", value: `${water} mL`, detail: "Uso indireto para resfriamento", className: "metric-water" },
    { icon: Zap, label: "Energia consumida", value: `${energy} Wh`, detail: "Processamento dos tokens", className: "metric-energy" },
    { icon: Leaf, label: "Emissões de CO₂e", value: `${carbon} g CO₂e`, detail: "Gases de efeito estufa equivalentes", className: "metric-carbon" },
  ];
  return (
    <div>
      <div className="mb-5 rounded-lg bg-secondary px-5 py-4">
        <span className="font-mono text-3xl font-semibold text-primary">{tokens}</span>
        <span className="ml-3 text-sm font-semibold text-primary">tokens estimados</span>
        <p className="mt-1 text-xs text-muted-foreground">Entrada + resposta projetada • modelo GPT-4</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map(({ icon: Icon, label, value, detail, className }) => (
          <article className={`metric-card ${className}`} key={label}>
            <Icon className="size-5" />
            <p className="mt-3 text-xs font-semibold">{label}</p>
            <strong className="mt-1 block font-mono text-xl text-foreground">{value}</strong>
            <div className="my-2 h-1 rounded-full bg-border"><span className="block h-full w-3/4 rounded-full bg-current" /></div>
            <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm">
        <Leaf className="mt-0.5 size-5 shrink-0 text-success" />
        <p>Equivale a cerca de <strong>{Math.max(1, Math.round(tokens / 10))} segundos de banho</strong> e <strong>{(tokens * 0.0023).toFixed(3)} km</strong> percorridos de carro.</p>
      </div>
    </div>
  );
}

function HistoryView({ period, setPeriod }: { period: string; setPeriod: (period: string) => void }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">Histórico de análises</h1>
      <p className="mt-2 text-muted-foreground">Acompanhe seu impacto ambiental acumulado ao longo do tempo.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {["Hoje", "Últimos 7 dias", "Este mês"].map((item) => (
          <Button key={item} variant={period === item ? "default" : "outline"} onClick={() => setPeriod(item)}>{item}</Button>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={History} label="Análises" value="8" tone="summary-blue" />
        <Summary icon={Droplets} label="Água usada" value="145,8 mL" tone="summary-water" />
        <Summary icon={Zap} label="Energia" value="291,62 Wh" tone="summary-energy" />
        <Summary icon={Leaf} label="CO₂e emitido" value="67,95 g CO₂e" tone="summary-carbon" />
      </div>
      <div className="mt-7 space-y-3">
        {historyItems.map((item) => (
          <article key={`${item.day}-${item.prompt}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-lg border border-border bg-card px-4 py-4 shadow-panel sm:grid-cols-[52px_1fr_180px_24px] sm:px-5">
            <div className="text-center text-primary"><strong className="block text-lg leading-none">{item.day}</strong><span className="text-xs">set</span></div>
            <div className="min-w-0"><p className="truncate text-sm font-medium">{item.prompt}</p><p className="mt-1 text-xs text-muted-foreground">{item.model} · {item.tokens} tokens · {item.time}</p></div>
            <div className="hidden grid-cols-2 gap-4 text-right text-xs sm:grid"><span className="text-water"><strong className="block font-mono">{item.water}</strong>água</span><span className="text-success"><strong className="block font-mono">{item.carbon}</strong>CO₂e</span></div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </article>
        ))}
      </div>
    </main>
  );
}

function Summary({ icon: Icon, label, value, tone }: { icon: typeof Leaf; label: string; value: string; tone: string }) {
  return <article className={`summary-card ${tone}`}><Icon className="size-5" /><p className="mt-4 text-xs font-semibold">{label}</p><strong className="mt-1 block font-mono text-xl text-foreground">{value}</strong></article>;
}