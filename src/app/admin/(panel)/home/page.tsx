import { fetchAllSectionsForAdmin } from "@/lib/home-sections";
import HomeEditorClient from "./HomeEditorClient";

export const dynamic = "force-dynamic";

export default async function HomeEditorPage() {
  const sections = await fetchAllSectionsForAdmin();
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Editar home
          </h1>
          <p className="text-sm text-foreground/60">
            Reordene, ative/desative ou edite cada seção da página inicial.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
        >
          Ver loja ↗
        </a>
      </header>

      <HomeEditorClient sections={sections} />
    </div>
  );
}
