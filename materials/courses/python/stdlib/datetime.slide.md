---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Python: Data e Hora"
description: "Slides da aula de datas em Python: date, time, datetime, timedelta, strftime, strptime, ISO 8601 e fuso horário com zoneinfo."


---



<!-- _class: lead -->

# Python: Data e Hora

`date`, `time`, `datetime` e `timedelta`, formatação, ISO 8601 e fuso horário.



---



## Objetivo

Trabalhar com datas sem cair nas armadilhas clássicas:

- Criar e manipular `date`, `time`, `datetime` e `timedelta`.
- Converter entre texto e data com `strftime` e `strptime`.
- Usar **ISO 8601** para armazenar e transportar.
- Calcular diferenças e prazos.
- Diferenciar datas **ingênuas** de **conscientes** de fuso.



---



## Os Quatro Tipos

| Tipo | Representa |
| --- | --- |
| `date` | Data civil (ano, mês, dia) |
| `time` | Hora do dia, sem data |
| `datetime` | Data e hora combinadas |
| `timedelta` | Duração entre dois instantes |

```python
from datetime import date, datetime, time, timedelta

print(date.today(), datetime.now())
```



---



## Criando Valores

```python
today = date.today()
now = datetime.now()
specific = datetime(2026, 8, 27, 14, 30)
duration = timedelta(days=30, hours=2)

print(specific.year, specific.month, specific.day)
print(specific.weekday())   # 0 = segunda, 6 = domingo
```



---



## `strftime`: Data → Texto

| Código | Exemplo |
| --- | --- |
| `%d/%m/%Y` | `27/08/2026` |
| `%H:%M:%S` | `14:30:00` |
| `%A` / `%a` | `Thursday` / `Thu` |
| `%B` / `%b` | `August` / `Aug` |
| `%j` | Dia do ano |

```python
print(moment.strftime("%d/%m/%Y às %H:%M"))
print(f"{moment:%d/%m/%Y}")     # f-string aceita os mesmos códigos
```



---



## `strptime`: Texto → Data

```python
parsed = datetime.strptime("27/08/2026 14:30", "%d/%m/%Y %H:%M")

print(datetime.fromisoformat("2026-08-27T14:30:00"))
print(date.fromisoformat("2026-08-27"))
print(parsed.isoformat())

# formato incompatível levanta ValueError
```

*Ao converter entrada do usuário, trate `ValueError`.*



---



## Use ISO 8601 para Armazenar

- `2026-08-27T14:30:00` é **não ambíguo** e ordenável alfabeticamente.
- `dd/mm/aaaa` confunde com `mm/dd/aaaa`: `03/04` é março ou abril?
- Bancos de dados e APIs falam ISO por padrão.

*Armazene em ISO, formate apenas na exibição.*



---

## Aritmética com `timedelta` (Parte 1)

```python
print(today + timedelta(days=30))
print(today - timedelta(weeks=2))

remaining = date(2026, 12, 31) - today
print(f"faltam {remaining.days} dias")

```

---

## Aritmética com `timedelta` (Parte 2)

```python
worked = end - start
print(worked.total_seconds() / 3600, "horas")
```

| Operação | Resultado |
| --- | --- |
| `data ± timedelta` | Nova data |
| `data - data` | `timedelta` |

---



## `timedelta` Não Tem Meses

- Meses e anos têm duração variável (28 a 31 dias).
- `timedelta` aceita apenas dias, semanas, horas, minutos, segundos e microssegundos.
- "Daqui a 3 meses" exige `dateutil.relativedelta` ou cálculo manual de ano/mês.



---



## Fuso Horário

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

naive = datetime(2026, 8, 27, 14, 30)                      # sem fuso
aware = datetime(2026, 8, 27, 14, 30, tzinfo=ZoneInfo("America/Recife"))

utc_now = datetime.now(timezone.utc)
local = utc_now.astimezone(ZoneInfo("America/Sao_Paulo"))
```

*Misturar ingênuo com consciente levanta `TypeError`.*



---



## Regra de Ouro

```txt
Registrar  ──▶  datetime.now(timezone.utc)
Armazenar  ──▶  ISO 8601 em UTC
Exibir     ──▶  astimezone(fuso do usuário)
```

- `zoneinfo` está na biblioteca padrão desde o Python 3.9.
- Ele conhece o horário de verão de cada região.



---



## Exercício

Crie `deadlines.py` controlando prazos:

1. Tarefas com `titulo` e `prazo` em ISO 8601;
2. Converta com `date.fromisoformat`;
3. Classifique em atrasada, hoje, esta semana ou futura;
4. Calcule quantos dias faltam (ou passaram);
5. Ordene por prazo e exiba com data em `dd/mm/aaaa`.



---


## Solução do Exercício (Parte 1)

```python
def classify(deadline):
    if deadline < today:
        return "atrasada"
    if deadline == today:
        return "hoje"
    if deadline <= today + timedelta(days=7):
        return "esta semana"
    return "futura"

```


---


## Solução do Exercício (Parte 2)

```python

for task in sorted(tasks, key=lambda t: t["data"]):
    days = (task["data"] - today).days
    print(f"{task['titulo']:<22}{task['data']:%d/%m/%Y}{days:>8}  {classify(task['data'])}")
```


---


## Resumo da Aula (Parte 1)

- `date`, `time` e `datetime` representam instantes; `timedelta`, durações.
- `strftime` formata (data → texto); `strptime` interpreta (texto → data).
- ISO 8601 é o formato para **armazenar**; formatos locais só na exibição.


---


## Resumo da Aula (Parte 2)

- Subtrair duas datas produz `timedelta`; `.days` e `.total_seconds()` extraem valores.
- `timedelta` não tem meses nem anos — duração variável.
- Registre em UTC com `timezone.utc` e converta com `astimezone()` só ao exibir.