---
title: 'Python: Data e Hora'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Data e Hora

## Ideia Central

- O módulo `datetime` separa data, hora, instante e duração
- Armazene em **UTC** e no formato **ISO 8601**; formate só na exibição

## Os Quatro Tipos

- **`date`**: ano, mês e dia
- **`time`**: hora do dia, sem data
- **`datetime`**: data e hora combinadas
- **`timedelta`**: duração entre dois instantes

## Criando Valores

- `date.today()` e `datetime.now()`
- `datetime(2026, 8, 27, 14, 30)` para valor específico
- `datetime.now(timezone.utc)` para registrar eventos
- `weekday()`: 0 = segunda, 6 = domingo

## Formatação

### strftime (data para texto)
- `%d/%m/%Y` data, `%H:%M:%S` hora
- `%A` e `%B` dependem do *locale* do sistema
- f-string aceita os mesmos códigos: `f"{momento:%d/%m/%Y}"`

### strptime (texto para data)
- Exige o formato exato da entrada
- Formato incompatível levanta `ValueError`
- `fromisoformat()` lê ISO 8601 diretamente

## ISO 8601

- `2026-08-27T14:30:00` é não ambíguo e ordenável
- Reconhecido por bancos de dados e APIs
- `dd/mm/aaaa` confunde com `mm/dd/aaaa`

## Cálculos

- `data + timedelta` e `data - timedelta` produzem nova data
- `data - data` produz `timedelta`
- `.days` e `.total_seconds()` extraem a duração
- `timedelta` **não** tem meses nem anos (duração variável)

## Fuso Horário

- **Ingênuo** (*naive*): sem `tzinfo`, leitura de relógio sem contexto
- **Consciente** (*aware*): com `tzinfo`, identifica um instante único
- Misturar os dois levanta `TypeError`
- `zoneinfo` está na biblioteca padrão desde o 3.9 e conhece horário de verão
- `astimezone()` converte entre fusos

## Boas Práticas

- **Registre em UTC** e converta apenas ao exibir
- **Armazene em ISO 8601**, nunca em formato local
- **Trate `ValueError`** ao converter entrada do usuário
- **Use `dateutil.relativedelta`** para deslocamentos por mês ou ano
