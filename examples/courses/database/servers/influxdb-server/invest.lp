# ==============================================================================
# InfluxDB Line Protocol: Histórico de Cotações de Ativos no InvestApp
# Sintaxe: <measurement>[,<tag_key>=<tag_value>...] <field_key>=<field_value>... [timestamp_ns]
# ==============================================================================

quotes,ticker=VALE3,broker=XP price=65.20,volume=12000i 1709280000000000000
quotes,ticker=VALE3,broker=XP price=65.80,volume=15400i 1709283600000000000
quotes,ticker=VALE3,broker=XP price=66.10,volume=18200i 1709287200000000000
quotes,ticker=VALE3,broker=XP price=65.95,volume=9800i 1709290800000000000

quotes,ticker=TESOURO_SELIC,broker=NuInvest price=152.30,volume=450i 1709280000000000000
quotes,ticker=TESOURO_SELIC,broker=NuInvest price=152.35,volume=620i 1709283600000000000
quotes,ticker=TESOURO_SELIC,broker=NuInvest price=152.40,volume=580i 1709287200000000000

quotes,ticker=HGLG11,broker=BTG price=162.50,volume=3100i 1709280000000000000
quotes,ticker=HGLG11,broker=BTG price=163.10,volume=4200i 1709283600000000000
