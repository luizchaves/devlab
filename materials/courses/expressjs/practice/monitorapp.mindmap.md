---
title: 'MonitorApp: Visão Geral'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# MonitorApp: Visão Geral

## Visão Geral

- **Aplicação**: MonitorApp
- **Etapa**: Visão Geral
- **Objetivo**: monitoramento de hosts em treze etapas cumulativas.

## Antes das etapas

- **Backlog do produto**: épicos, features, histórias, critérios e tasks
- **Especificação da API**: endpoints, status codes, ping e eventos
- **Front estático**: primeira etapa prática e telas do painel

## Componentes Técnicos

- Front e API em origens separadas
- Proxy do Vite no desenvolvimento
- CORS no servidor quando necessário
- Ping real com `node:child_process`
- Server-Sent Events para atualização em tempo real

## Domínio

- `User`: conta autenticada
- `Host`: endereço monitorado
- `Ping`: medição de disponibilidade e latência
- `Tag`: classificação muitos-para-muitos

## Boas Práticas

- Use a visão geral como mapa, não como especificação completa
- Leia backlog e API spec antes de codificar
- Compare etapas para enxergar apenas o delta técnico
