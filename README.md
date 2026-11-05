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

<p align="center"><sub>Feito no Técnico em Informática da E.E.E.B. João XXIII</sub></p>
