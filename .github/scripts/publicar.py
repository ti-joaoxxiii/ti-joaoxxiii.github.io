"""Publica no site um projeto enviado pelo formulário "Enviar projeto".

Roda no GitHub Actions (.github/workflows/publicar-projeto.yml).
Entrada: o pedido (issue) do GitHub. Saída: assets/<id>/*, data/enviados.json e projetos-enviados.js.
O texto do pedido é tratado como dado: nada dele é executado.
"""
import hashlib
import io
import json
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "enviados.json"
OUT_JS = ROOT / "projetos-enviados.js"
REPO = os.environ["REPO"]
TOKEN = os.environ["GH_TOKEN"]
ISSUE = json.loads(os.environ["ISSUE_JSON"])
NUM = ISSUE["number"]
LABELS = {l["name"] for l in ISSUE.get("labels", [])}
SITE = "https://apps.athomon.com"
MAX_BYTES = 40 * 1024 * 1024
ALLOWED_HOSTS = ("github.com", "githubusercontent.com")

PALETAS = [  # bg, ink, accent
    ("#1f2a44", "#eef2ff", "#8fb3ff"),
    ("#3a1f3d", "#fdeefe", "#f0a3ff"),
    ("#14352f", "#e9fbf5", "#5fe0b5"),
    ("#43281c", "#fff1e8", "#ffb38a"),
    ("#2b2d5c", "#eef0ff", "#ffd166"),
    ("#3d1f1f", "#fff0ee", "#ff8f80"),
]

CAMPOS = {
    "Nome do projeto": "nome",
    "O que é": "tipo",
    "Onde roda": "plataforma",
    "Uma frase sobre o projeto": "frase",
    "Descrição curta": "descricao",
    "Quem desenvolveu": "autores",
    "Em parceria com (opcional)": "parceria",
    "Feito com": "tecnologias",
    "Link do código (opcional)": "codigo",
    "Link do APK ou download (opcional)": "download",
    "Prints": "prints",
}


def api(path, method="GET", body=None, accept="application/vnd.github+json"):
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {TOKEN}", "Accept": accept, "User-Agent": "publicar-projeto"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        txt = r.read().decode()
        return json.loads(txt) if txt else {}


def comentar(texto):
    api(f"/repos/{REPO}/issues/{NUM}/comments", "POST", {"body": texto})


def ler_campos(body):
    campos, atual = {}, None
    for linha in (body or "").splitlines():
        m = re.match(r"^###\s+(.+?)\s*$", linha)
        if m:
            atual = CAMPOS.get(m.group(1).strip())
            if atual:
                campos[atual] = []
            continue
        if atual:
            campos[atual].append(linha)
    out = {}
    for k, linhas in campos.items():
        v = "\n".join(linhas).strip()
        out[k] = "" if v in ("_No response_", "None") else v
    return out


def slug(txt):
    t = unicodedata.normalize("NFKD", txt).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:40] or f"projeto-{NUM}"


def pessoas(txt):
    """'Ana Silva (@ana), Beto' -> [(nome, usuario|None)]"""
    if not txt:
        return []
    partes = re.split(r",|;|\n|\s+e\s+", txt)
    res = []
    for p in partes:
        p = p.strip(" -*")
        if not p:
            continue
        m = re.search(r"@([A-Za-z0-9-]{1,39})", p)
        user = m.group(1) if m else None
        nome = re.sub(r"\(?@[A-Za-z0-9-]+\)?", "", p).strip(" ()") or user
        if nome:
            res.append((nome, user))
    return res


def link_ok(url):
    return bool(re.match(r"^https?://[^\s<>\"']+$", url or ""))


class Midias(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for k in ("src", "href", "data-canonical-src"):
            u = a.get(k) or ""
            if tag in ("img", "video", "source", "a") and u.startswith("https://") and any(h in u for h in ALLOWED_HOSTS):
                if tag == "a" and "user-attachments" not in u and "githubusercontent" not in u:
                    continue
                self.urls.append(u)


def baixar(url):
    host = re.match(r"https://([^/]+)", url).group(1)
    if not any(host == h or host.endswith("." + h) for h in ALLOWED_HOSTS):
        return None, None
    headers = {"User-Agent": "publicar-projeto"}
    if host == "github.com":
        headers["Authorization"] = f"Bearer {TOKEN}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            return None, None
        return data, r.headers.get("Content-Type", "")


def quadros_de_video(data, pasta, inicio):
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
        f.write(data)
        caminho = f.name
    try:
        dur = float(subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", caminho],
            capture_output=True, text=True, timeout=60).stdout.strip() or 0)
    except ValueError:
        dur = 0
    saidas = []
    for i, frac in enumerate((0.15, 0.5, 0.85)):
        png = Path(tempfile.gettempdir()) / f"q{NUM}_{i}.png"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{max(dur * frac, 0):.2f}", "-i", caminho,
                        "-frames:v", "1", str(png)], timeout=120)
        if png.exists():
            saidas.append(salvar_imagem(Image.open(png), pasta, inicio + i))
    os.unlink(caminho)
    return [s for s in saidas if s]


def salvar_imagem(img, pasta, i):
    img = img.convert("RGB")
    img.thumbnail((1600, 1600))
    destino = pasta / f"{i + 1}.webp"
    img.save(destino, "WEBP", quality=88)
    return destino


def gerar_js(dados):
    apps, people = [], {}
    for chave in sorted(dados, key=int):
        apps.append(dados[chave]["app"])
        people.update(dados[chave]["people"])
    OUT_JS.write_text(
        "/* GERADO AUTOMATICAMENTE pelo formulário \"Enviar projeto\". Não edite aqui:\n"
        "   edite o pedido no GitHub (ou use o rótulo \"remover\"). */\n"
        f"window.PEOPLE = Object.assign(window.PEOPLE || {{}}, {json.dumps(people, ensure_ascii=False, indent=2)});\n"
        f"window.APPS = (window.APPS || []).concat({json.dumps(apps, ensure_ascii=False, indent=2)});\n",
        encoding="utf-8")


def main():
    dados = json.loads(DATA.read_text(encoding="utf-8")) if DATA.exists() else {}
    chave = str(NUM)

    if "remover" in LABELS:
        if chave in dados:
            pasta = ROOT / dados[chave]["app"]["shots"][0].rsplit("/", 1)[0]
            for f in pasta.glob("*"):
                f.unlink()
            pasta.rmdir()
            del dados[chave]
            DATA.write_text(json.dumps(dados, ensure_ascii=False, indent=2), encoding="utf-8")
            gerar_js(dados)
            print("REMOVIDO")
        return

    c = ler_campos(ISSUE.get("body"))
    if not c.get("nome"):
        comentar("Não consegui ler este pedido. Use o formulário **Enviar projeto** para mandar o projeto.")
        return

    # id único: não pode bater com projeto já existente no apps.js
    pid = slug(c["nome"])
    existentes = set(re.findall(r'id:\s*"([^"]+)"', (ROOT / "apps.js").read_text(encoding="utf-8")))
    if pid in existentes:
        pid = f"{pid}-{NUM}"

    # prints: pega as mídias do HTML do pedido (os links assinados funcionam por alguns minutos)
    html = api(f"/repos/{REPO}/issues/{NUM}", accept="application/vnd.github.html+json").get("body_html", "")
    p = Midias()
    p.feed(html)
    urls = list(dict.fromkeys(p.urls))
    pasta = ROOT / "assets" / "enviados" / pid
    pasta.mkdir(parents=True, exist_ok=True)
    for f in pasta.glob("*"):
        f.unlink()
    shots = []
    for url in urls:
        if len(shots) >= 6:
            break
        try:
            data, tipo = baixar(url)
        except Exception as e:  # link quebrado ou expirado
            print("falha ao baixar", url[:80], e)
            continue
        if not data:
            continue
        if tipo.startswith("video/") or data[4:8] == b"ftyp":
            shots += quadros_de_video(data, pasta, len(shots))
            continue
        try:
            shots.append(salvar_imagem(Image.open(io.BytesIO(data)), pasta, len(shots)))
        except Exception:
            continue
    if not shots:
        comentar("Não achei nenhum print no pedido. Edite o pedido e **arraste as imagens** (ou um vídeo curto) no campo Prints.")
        return

    # ícone: recorte quadrado do primeiro print
    primeira = Image.open(shots[0]).convert("RGB")
    w, h = primeira.size
    lado = min(w, h) // 2
    primeira.crop(((w - lado) // 2, (h - lado) // 2, (w + lado) // 2, (h + lado) // 2)).resize((192, 192)).save(pasta / "icone.png")

    plataforma = c.get("plataforma", "")
    if "em pé" in plataforma:
        device, fit = "portrait", "cover"
    elif plataforma:
        device, fit = "landscape", "contain"
    else:
        device, fit = ("portrait", "cover") if h > w else ("landscape", "contain")

    autores = pessoas(c.get("autores")) or [(ISSUE["user"]["login"], ISSUE["user"]["login"])]
    parceiros = pessoas(c.get("parceria"))
    people, refs = {}, []
    for (nome, user), papel in [(a, "autor") for a in autores] + [(p_, "parceria") for p_ in parceiros]:
        k = "u_" + slug(user or nome)
        people[k] = {"name": nome, **({"gh": f"https://github.com/{user}"} if user else {})}
        refs.append({"who": k, "role": papel})

    bg, ink, accent = PALETAS[int(hashlib.md5(pid.encode()).hexdigest(), 16) % len(PALETAS)]
    links = []
    if link_ok(c.get("codigo")):
        links.append({"label": "Código", "url": c["codigo"]})
    app = {
        "id": pid,
        "name": c["nome"][:60],
        "kind": (c.get("tipo") or "Projeto")[:40],
        "bg": bg, "ink": ink, "accent": accent,
        "device": device, "fit": fit, "screen": "#111",
        "icon": f"assets/enviados/{pid}/icone.png",
        "shots": [f"assets/enviados/{pid}/{s.name}" for s in shots],
        "tagline": (c.get("frase") or c["nome"])[:140],
        "desc": (c.get("descricao") or "")[:600],
        "features": [],
        "tech": [t.strip() for t in re.split(r",|;|\n", c.get("tecnologias") or "") if t.strip()][:8] or ["—"],
        "authors": refs,
        "download": c["download"] if link_ok(c.get("download")) else None,
        "links": links,
    }
    dados[chave] = {"app": app, "people": people}
    DATA.parent.mkdir(exist_ok=True)
    DATA.write_text(json.dumps(dados, ensure_ascii=False, indent=2), encoding="utf-8")
    gerar_js(dados)
    Path(os.environ.get("GITHUB_OUTPUT", os.devnull)).open("a").write(f"id={pid}\n")
    print("PUBLICADO", pid)


if __name__ == "__main__":
    sys.exit(main())
