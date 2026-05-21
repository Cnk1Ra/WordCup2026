import { fetchHeroSettings } from "@/lib/site-settings";
import HomeEditorClient from "./HomeEditorClient";

export const dynamic = "force-dynamic";

export default async function HomeEditorPage() {
  const hero = await fetchHeroSettings();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Editar home
        </h1>
        <p className="text-sm text-foreground/60">
          Personalize o texto principal da página inicial da loja.
        </p>
      </header>

      <HomeEditorClient initialHero={hero} />
    </div>
  );
}
