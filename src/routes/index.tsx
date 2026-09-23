import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Droplets, History, Leaf, Plus, Send, Zap } from "lucide-react";

import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import logoAsset from "@/assets/banco-do-brasil.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ImpactaIA | Pegada Ambiental de IA" },
      { name: "description", content: "Estime o consumo de água, energia e emissões dos seus prompts de inteligência artificial." },
      { property: "og:title", content: "ImpactaIA | Pegada Ambiental de IA" },
      { property: "og:description", content: "Entenda a pegada ambiental dos seus prompts de inteligência artificial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "analyze" | "history";

const examples = [
  "Crie um relatório executivo sobre tendências de crédito no agronegócio brasileiro.",
  "Resuma as principais tendências do mercado financeiro brasileiro em 2026.",
  "Crie um plano de negócios para uma fintech de crédito rural sustentável.",
];

const historyItems = [
  { day: "22", prompt: "Faça um relatório do agronegócio", model: "Gemini", tokens: 45, water: "0,1 mL", carbon: "0,12 g CO₂e", time: "20:20" },
  { day: "22", prompt: "Gere um relatório sobre sustentabilidade corporativa com métricas ESG", model: "Gemini", tokens: 213, water: "0,6 mL", carbon: "0,51 g CO₂e", time: "20:07" },
  { day: "21", prompt: "Resuma as principais tendências do mercado financeiro brasileiro em 2026.", model: "Gemini", tokens: 105, water: "0,3 mL", carbon: "0,25 g CO₂e", time: "20:07" },
];

function Index() {
  const [view, setView] = useState<View>("analyze");
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [period, setPeriod] = useState("Este mês");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function analyze(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setPrompt(clean);
    setSubmittedPrompt(clean);
    setView("analyze");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-t-4 border-brand-yellow bg-primary text-primary-foreground shadow-header">
        <div className={`mx-auto flex h-17 max-w-7xl items-center px-4 sm:px-6 ${submittedPrompt ? "justify-center" : "justify-between"}`}>
          {!submittedPrompt && (
            <button className="flex items-center gap-3" onClick={() => { setView("analyze"); setSubmittedPrompt(""); setPrompt(""); }} aria-label="Ir para o início">
              <img src={logoAsset.url} alt="Banco do Brasil" className="h-10 w-18 rounded-sm object-cover" />
              <span className="hidden border-l border-primary-foreground/30 pl-3 text-left sm:block">
                <strong className="block text-base leading-none">Impacta<span className="text-brand-yellow">IA</span></strong>
                <small className="mt-1 block text-xs text-primary-foreground/75">Pegada Ambiental de IA</small>
              </span>
            </button>
          )}

          {(submittedPrompt || view === "history") && (
            <nav className="flex h-full items-center gap-1" aria-label="Navegação principal">
              <Button variant="nav" data-active={view === "analyze"} onClick={() => setView("analyze")}>
                <Leaf className="sm:hidden" /> <span className="hidden sm:inline">Analisar</span>
              </Button>
              <Button variant="nav" data-active={view === "history"} onClick={() => setView("history")}>
                <History className="sm:hidden" /> <span className="hidden sm:inline">Histórico</span>
              </Button>
            </nav>
          )}

          {!submittedPrompt && <span className="hidden text-sm font-semibold text-primary-foreground/85 md:block">Banco do Brasil</span>}
        </div>
      </header>

      {view === "history" ? (
        <HistoryView period={period} setPeriod={setPeriod} />
      ) : submittedPrompt ? (
        <AnalysisView prompt={prompt} setPrompt={setPrompt} analyze={analyze} inputRef={inputRef} />
      ) : (
        <HomeView prompt={prompt} setPrompt={setPrompt} analyze={analyze} inputRef={inputRef} />
      )}
    </div>
  );
}

type PromptProps = {
  prompt: string;
  setPrompt: (value: string) => void;
  analyze: (value: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
};

function HomeView({ prompt, setPrompt, analyze, inputRef }: PromptProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-5xl flex-col items-center justify-center px-4 pb-24 pt-12">
      <div className="mb-8 text-center">
        <img src={logoAsset.url} alt="Banco do Brasil" className="mx-auto mb-6 h-20 w-36 rounded-md object-cover shadow-brand" />
        <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">Por onde começamos?</h1>
        <p className="mt-3 text-muted-foreground">Descubra o impacto ambiental do seu próximo prompt.</p>
      </div>

      <PromptInput onSubmit={({ text }) => analyze(text)} className="w-full max-w-3xl rounded-2xl border-border bg-card shadow-composer">
        <PromptInputTextarea ref={inputRef} autoFocus value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Pergunte à ImpactaIA" className="min-h-28 px-5 pt-5 text-base" />
        <PromptInputFooter className="px-3 pb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-8 items-center justify-center rounded-full bg-secondary"><Plus className="size-4" /></span>
            <span className="hidden sm:inline">Gemini • estimativa completa</span>
          </div>
          <PromptInputSubmit disabled={!prompt.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90" aria-label="Analisar impacto"><ArrowUp /></PromptInputSubmit>
        </PromptInputFooter>
      </PromptInput>

      <div className="mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
        {examples.map((example) => <Button key={example} variant="suggestion" onClick={() => { setPrompt(example); inputRef.current?.focus(); }}>{example.split(".")[0]}</Button>)}
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">Os resultados são estimativas indicativas baseadas em médias da literatura científica.</p>
    </main>
  );
}

function AnalysisView({ prompt, setPrompt, analyze, inputRef }: PromptProps) {
  const metrics = useMemo(() => {
    const inputTokens = Math.max(1, Math.ceil(prompt.length / 3.5));
    const outputTokensProj = inputTokens * 2;
    const totalTokens = inputTokens + outputTokensProj;
    const energiaBaseWh = inputTokens * 0.001 + outputTokensProj * 0.004;
    const energiaTotalWh = energiaBaseWh * 6;
    const carbonoG = (energiaTotalWh / 1000) * 436;
    const aguaMl = (energiaTotalWh / 1000) * 500;
    return { inputTokens, totalTokens, energiaTotalWh, carbonoG, aguaMl };
  }, [prompt]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid items-start gap-7 lg:grid-cols-[0.78fr_1.22fr]">
        <section>
          <p className="text-sm font-semibold text-accent">ANÁLISE AMBIENTAL</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-primary sm:text-4xl">Pegada do seu prompt</h1>
          <p className="mt-2 text-muted-foreground">Uma estimativa clara do impacto gerado por esta interação.</p>

          <div className="mt-7 overflow-hidden rounded-lg border border-border bg-card shadow-panel">
            <Textarea ref={inputRef} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Digite seu prompt aqui..." className="min-h-52 resize-none rounded-none border-0 px-5 py-5 text-base shadow-none focus-visible:ring-0" />
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <span className="text-xs text-muted-foreground">≈ {metrics.inputTokens} tokens</span>
              <Button onClick={() => analyze(prompt)} disabled={!prompt.trim()}><Send />Analisar</Button>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-warning-border bg-warning px-4 py-4 text-sm text-warning-foreground">
            <strong>Estimativa indicativa.</strong> O impacto real varia conforme provedor, região e infraestrutura.
          </div>
        </section>

        <Card className="overflow-hidden rounded-lg border-border shadow-panel">
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b px-5 py-5 sm:px-7">
            <CardTitle className="font-display text-xl text-primary">Resultado da análise</CardTitle>
            <Badge className="gap-2 border-0 bg-success-soft text-success hover:bg-success-soft"><span className="size-2 rounded-full bg-success" />Impacto baixo</Badge>
          </CardHeader>
          <Tabs defaultValue="result">
            <TabsList className="h-auto w-full justify-start rounded-none border-b bg-card px-4 py-0 sm:px-7">
              <TabsTrigger value="result" className="result-tab">Resultado</TabsTrigger>
              <TabsTrigger value="method" className="result-tab">Metodologia</TabsTrigger>
              <TabsTrigger value="sources" className="result-tab">Fontes</TabsTrigger>
            </TabsList>
            <CardContent className="p-5 sm:p-7">
              <TabsContent value="result" className="m-0"><ResultContent {...metrics} /></TabsContent>
              <TabsContent value="method" className="m-0"><Methodology /></TabsContent>
              <TabsContent value="sources" className="m-0"><Sources /></TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}

function ResultContent({ totalTokens, energiaTotalWh, carbonoG, aguaMl }: { totalTokens: number; energiaTotalWh: number; carbonoG: number; aguaMl: number }) {
  const metrics = [
    { icon: Droplets, label: "Consumo de água", value: `${aguaMl.toFixed(1).replace(".", ",")} mL`, detail: "Uso indireto para resfriamento", tone: "metric-water" },
    { icon: Zap, label: "Energia consumida", value: `${energiaTotalWh.toFixed(2).replace(".", ",")} Wh`, detail: "Processamento dos tokens", tone: "metric-energy" },
    { icon: Leaf, label: "Emissões de CO₂e", value: `${carbonoG.toFixed(2).replace(".", ",")} g CO₂e`, detail: "Gases de efeito estufa equivalentes", tone: "metric-carbon" },
  ];
  return (
    <div>
      <div className="mb-5 rounded-lg bg-secondary px-5 py-4">
        <span className="font-mono text-3xl font-semibold text-primary">{totalTokens}</span>
        <span className="ml-3 text-sm font-semibold text-primary">tokens estimados</span>
        <p className="mt-1 text-xs text-muted-foreground">Entrada + resposta projetada • modelo Gemini</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map(({ icon: Icon, label, value, detail, tone }) => (
          <Card className={`metric-card border-0 shadow-none ${tone}`} key={label}>
            <Icon className="size-5" /><p className="mt-3 text-xs font-semibold">{label}</p><strong className="mt-1 block font-mono text-xl text-foreground">{value}</strong>
            <div className="my-2 h-1 rounded-full bg-card/70"><span className="block h-full w-3/4 rounded-full bg-current" /></div><p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
          </Card>
        ))}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm">
        <Leaf className="mt-0.5 size-5 shrink-0 text-success" />
        <p>Equivale a cerca de <strong>{(carbonoG * 0.3).toFixed(1).replace(".", ",")} segundos de banho</strong> e <strong>{(carbonoG * 0.008).toFixed(3).replace(".", ",")} km</strong> percorridos de carro.</p>
      </div>
    </div>
  );
}

const methodology = [
  ["Contagem de tokens", "O texto é tokenizado estimando ~3,5 caracteres por token (média BPE para português). Os tokens de entrada e saída esperada são calculados separadamente."],
  ["Energia de inferência", "Cada token consome ~0,003 Wh de energia elétrica em modelos base. Tokens de saída custam ~4× mais que entrada devido ao processo autoregressivo."],
  ["Multiplicador por modelo", "Modelos maiores (Gemini, GPT-4, Claude Opus) têm custo computacional maior. Aplicamos multiplicadores calibrados com base em benchmarks públicos."],
  ["Emissões de CO₂e", "Energia × intensidade média da rede elétrica global (436 gCO₂e/kWh, IEA 2023). O valor real varia conforme a localização do datacenter e uso de energia renovável."],
  ["Consumo de água", "Datacenters usam ~500 mL de água por kWh para refrigeração evaporativa (Li et al., 2023). Representa o uso indireto em torres de resfriamento."],
];

function Methodology() {
  return <div className="space-y-5">{methodology.map(([title, text], index) => <div className="flex gap-4" key={title}><Badge className="h-8 min-w-10 justify-center rounded-md bg-primary text-primary-foreground">{String(index + 1).padStart(2, "0")}</Badge><div><h3 className="font-semibold text-primary">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}</div>;
}

function Sources() {
  return <div className="space-y-3">{["IEA (2023) Electricity Market Report", "Patterson et al. (2021) Carbon Emissions and Large Neural Network Training", "Li et al. (2023) Making AI Less Thirsty"].map((source, index) => <div key={source} className="flex gap-3 rounded-lg bg-secondary p-4 text-sm"><span className="font-mono font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span><p>{source}</p></div>)}</div>;
}

function HistoryView({ period, setPeriod }: { period: string; setPeriod: (period: string) => void }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">Histórico de análises</h1><p className="mt-2 text-muted-foreground">Acompanhe seu impacto ambiental acumulado ao longo do tempo.</p>
      <div className="mt-6 flex flex-wrap gap-2">{["Hoje", "Últimos 7 dias", "Este mês"].map((item) => <Button key={item} variant={period === item ? "default" : "outline"} onClick={() => setPeriod(item)}>{item}</Button>)}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Summary icon={History} label="Análises" value="8" tone="summary-blue" /><Summary icon={Droplets} label="Água usada" value="1,2 mL" tone="summary-water" /><Summary icon={Zap} label="Energia" value="2,42 Wh" tone="summary-energy" /><Summary icon={Leaf} label="CO₂e emitido" value="1,06 g CO₂e" tone="summary-carbon" /></div>
      <div className="mt-7 space-y-3">{historyItems.map((item) => <Card key={`${item.day}-${item.prompt}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-lg px-4 py-4 shadow-panel sm:grid-cols-[52px_1fr_180px_24px] sm:px-5"><div className="text-center text-primary"><strong className="block text-lg leading-none">{item.day}</strong><span className="text-xs">set</span></div><div className="min-w-0"><p className="truncate text-sm font-medium">{item.prompt}</p><p className="mt-1 text-xs text-muted-foreground">{item.model} · {item.tokens} tokens · {item.time}</p></div><div className="hidden grid-cols-2 gap-4 text-right text-xs sm:grid"><span className="text-water"><strong className="block font-mono">{item.water}</strong>água</span><span className="text-success"><strong className="block font-mono">{item.carbon}</strong>CO₂e</span></div><ChevronDown className="size-4 text-muted-foreground" /></Card>)}</div>
    </main>
  );
}

function Summary({ icon: Icon, label, value, tone }: { icon: typeof Leaf; label: string; value: string; tone: string }) {
  return <Card className={`summary-card border-0 shadow-none ${tone}`}><Icon className="size-5" /><p className="mt-4 text-xs font-semibold">{label}</p><strong className="mt-1 block font-mono text-xl text-foreground">{value}</strong></Card>;
}