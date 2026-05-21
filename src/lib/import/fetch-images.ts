const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";

export type ImagePair = { front: string | null; back: string | null };

// Extrai a imagem principal do produto (og:image) e tenta achar a segunda
// foto da galeria que pertence ao MESMO produto (mesmo prefixo no filename).
// Tienda Nube nomeia: "stores/.../products/{slug-do-produto}{N}-{hash}-{size}-{i}.webp"
export async function fetchLojaDoCapitaImages(
  productUrl: string
): Promise<ImagePair> {
  try {
    const res = await fetch(productUrl, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
    });
    if (!res.ok) return { front: null, back: null };
    const html = await res.text();

    // 1. og:image é a fonte canônica da imagem principal
    const ogMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    const ogRaw = ogMatch?.[1] ?? null;
    const upgrade = (u: string) =>
      u
        .replace(/^http:\/\//i, "https://")
        .replace(/-\d{2,4}-\d\.(webp|jpg|jpeg|png)$/i, "-1024-0.$1");
    const front = ogRaw ? upgrade(ogRaw) : null;

    if (!front) return { front: null, back: null };

    // 2. Pra back: pega TODAS as imagens do CDN no HTML, extrai o prefixo do
    // filename do og:image (até o número/hash) e busca outra que tenha o
    // mesmo prefixo mas seja arquivo diferente.
    const filename = front.split("/").pop() ?? "";
    // Prefixo: tudo antes do hash hexadecimal de 32 chars
    const prefixMatch = filename.match(/^(.+?)\d?-[a-f0-9]{20,}/i);
    const prefix = prefixMatch?.[1] ?? null;

    let back: string | null = null;
    if (prefix) {
      const all = new Set<string>();
      const re = /https:\/\/acdn[a-z0-9-]*\.mitiendanube\.com\/stores\/[^"' )]+\/products\/[^"' )]+\.(?:webp|jpg|jpeg|png)/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(html))) {
        all.add(upgrade(m[0]));
      }
      // Procura outra imagem com mesmo prefixo que não é a front
      for (const url of all) {
        const fn = url.split("/").pop() ?? "";
        if (fn === filename) continue;
        if (fn.toLowerCase().startsWith(prefix.toLowerCase())) {
          back = url;
          break;
        }
      }
    }

    return { front, back };
  } catch {
    return { front: null, back: null };
  }
}

// Baixa uma imagem. Se a URL é uma versão upgradeada (-1024-0) e retorna 404,
// tenta fallback nas versões -640-0 e -480-0 do mesmo arquivo.
export async function downloadImage(
  url: string
): Promise<{ buffer: Buffer; contentType: string; ext: string } | null> {
  const candidates = [url];
  if (/-1024-0\./i.test(url)) {
    candidates.push(url.replace("-1024-0.", "-640-0."));
    candidates.push(url.replace("-1024-0.", "-480-0."));
    candidates.push(url.replace("-1024-0.", "-320-0."));
  }

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, {
        headers: { "User-Agent": UA, Referer: "https://lojadocapita.com.br/" },
        redirect: "follow",
      });
      if (!res.ok) continue;
      const contentType = res.headers.get("content-type") || "image/jpeg";
      if (!contentType.startsWith("image/")) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 1000) continue; // very small response = error page
      const ext = (candidate.split(".").pop() || "jpg").split("?")[0].toLowerCase();
      return { buffer, contentType, ext };
    } catch {
      continue;
    }
  }
  return null;
}
