# FibraControl — demonstração

Site estático demonstrativo para gestão FTTH.

## Publicar gratuitamente no GitHub Pages

1. Entre em https://github.com e crie um repositório novo chamado `fibracontrol`.
2. Escolha **Public** para facilitar a publicação gratuita pelo GitHub Pages.
3. Envie o arquivo `index.html` deste pacote para a raiz do repositório.
4. No repositório, abra **Settings → Pages**.
5. Em **Build and deployment**, selecione **Deploy from a branch**.
6. Selecione a branch `main` e a pasta `/ (root)`; clique em **Save**.
7. Aguarde a publicação. O endereço normalmente será `https://SEU-USUARIO.github.io/fibracontrol/`.

## O que a demo inclui

- Gestão de CTOs, lacres, clientes e portas.
- Mapa de ruas de Santos Dumont, MG.
- Aba de projetos de infraestrutura.
- Mapa ilustrativo de caixas de emenda e trechos de cabos AS.
- Referência de cores de fibras.
- Exportação CSV.

## Limitações importantes

- Os dados e coordenadas das CTOs/caixas/cabos são fictícios e devem ser validados em campo.
- Os dados ficam no armazenamento local do navegador; não sincronizam entre funcionários.
- Os mapas dependem de internet, Leaflet CDN e tiles do OpenStreetMap.
- Não insira dados reais de clientes nem topologia da rede sem autorização da empresa e uma arquitetura segura com autenticação e banco de dados central.
