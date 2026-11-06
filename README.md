<p align="center">
  <img src="assets/logo-ti.png" width="72" alt="Técnico em Informática">
  &nbsp;
  <img src="assets/logo-escola.png" width="72" alt="E.E.E.B. João XXIII">
</p>

<h1 align="center">Projetos desenvolvidos</h1>
<p align="center">Site com os apps e jogos criados no curso Técnico em Informática da E.E.E.B. João XXIII.</p>

<p align="center">
  <a href="https://apps.athomon.com"><b>apps.athomon.com</b></a> ·
  <a href="https://ti-joaoxxiii.github.io">ti-joaoxxiii.github.io</a> ·
  <a href="https://www.instagram.com/ti_joaoxxiii/">Instagram do Técnico</a>
</p>

<p align="center"><img src="assets/shadow-duel/duelo.jpg" width="100%" alt="Shadow Duel Remastered"></p>

## Como funciona

Site estático em HTML, CSS e JavaScript, sem build. Publicado pelo GitHub Pages a partir da branch `main`.

- `apps.js`: todos os dados (projetos, créditos, prints, links de download e cores de cada seção)
- `assets/<projeto>/`: prints e ícones
- `jogar/aventura-do-moai/`: versão de navegador do Aventura do Moai

## Adicionar um projeto

**Jeito fácil:** preencha o formulário [Enviar projeto](https://github.com/ti-joaoxxiii/ti-joaoxxiii.github.io/issues/new?template=novo-projeto.yml). Um administrador aprova e o projeto entra no site.

**Direto no código:**

1. Coloque os prints em `assets/<id-do-projeto>/`.
2. Adicione um bloco em `window.APPS` dentro de `apps.js` (copie um dos existentes).
3. Em `authors`, use `role: "autor"` para quem desenvolveu e `role: "parceria"` para quem ajudou. Novas pessoas entram em `window.PEOPLE`.
4. O APK vai em **Releases** do repositório do projeto, e o link em `download`.
5. Faça commit e push: o site atualiza sozinho em cerca de 1 minuto.

## Publicação automática

Quando alguém preenche o formulário **Enviar projeto**, um robô (GitHub Actions) monta o projeto e publica no site sozinho:

1. Lê o pedido, baixa os prints (se vier vídeo, tira 3 quadros dele) e cria o ícone.
2. Quem está em [`data/membros.txt`](data/membros.txt) publica na hora. Quem não está espera um administrador colocar o rótulo **aprovado** no pedido.
3. Em cerca de 1 minuto o projeto aparece no site, e o robô responde no pedido com o link.

- **Corrigir algo:** é só editar o pedido; o robô atualiza o site.
- **Tirar do site:** coloque o rótulo **remover** no pedido.
- **Novo membro da organização:** adicione o usuário dele em `data/membros.txt` para ele publicar sem aprovação.

Os projetos enviados ficam em `projetos-enviados.js` e `assets/enviados/` (gerados pelo robô: não edite à mão).

<p align="center"><sub>Feito no Técnico em Informática da E.E.E.B. João XXIII</sub></p>
