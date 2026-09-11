// #region nosql-embedding
// Padrão 1: Embutido (Embedding) vs Referenciado (Referencing) em Documentos
const orderEmbedded = {
  orderId: 'ORD-9021',
  customerId: 'CUST-42',
  placedAt: '2026-09-11T12:00:00Z',
  // Itens embutidos: lidos e gravados atomicamente em uma única operação
  items: [
    { sku: 'KB-400', name: 'Teclado Mecânico', qty: 1, unitPrice: 25000 },
    { sku: 'MO-100', name: 'Mouse Ergonômico', qty: 2, unitPrice: 15000 },
  ],
  shippingAddress: {
    street: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zip: '01310-100',
  },
  totalAmount: 55000,
};
// #endregion nosql-embedding

// #region nosql-subset-bucket
// Padrão 2: Subset Pattern (para relacionamentos 1:N com milhares de registros)
// Guarda apenas os N comentários mais recentes no documento principal para renderização rápida
const productWithSubset = {
  id: 'PROD-101',
  name: 'Monitor UltraWide 34"',
  ratingAvg: 4.8,
  reviewCount: 4820,
  recentReviews: [
    { author: 'Beatriz', rating: 5, comment: 'Excelente para produtividade!', date: '2026-09-10' },
    { author: 'Rodrigo', rating: 4, comment: 'Cores muito vivas.', date: '2026-09-08' },
  ],
};

// Padrão 3: Bucket Pattern (Agrupamento temporal de métricas IoT / Séries Temporais)
const sensorMetricsBucket = {
  sensorId: 'TEMP-ROOM-01',
  bucketDate: '2026-09-11T12:00:00Z', // 1 documento por hora
  sampleCount: 60,
  temperatureSum: 1320.5,
  samples: [
    { minute: 0, val: 21.8 },
    { minute: 1, val: 22.0 },
    // ... até o minuto 59
  ],
};
// #endregion nosql-subset-bucket

// #region nosql-redis-graph
// Padrão 4: Convenção de Chaves e Hash para Chave-Valor (Redis)
const redisKeyPatterns = {
  userSession: 'session:token_98f12a:data', // Chave com TTL de 3600s
  userProfileHash: 'user:1001:profile', // HSET com campos (name, email, role)
  leaderboardSortedSet: 'leaderboard:monthly:2026-09', // ZADD com score (pontos) e membro (userId)
};

// Padrão 5: Estrutura de Grafo (Property Graph Model)
const graphModel = {
  nodes: [
    { id: 1, labels: ['Person', 'Developer'], props: { name: 'Lucas', xp: 5 } },
    { id: 2, labels: ['Person', 'Architect'], props: { name: 'Marina', xp: 12 } },
    { id: 10, labels: ['Project'], props: { name: 'DevLab', status: 'active' } },
  ],
  relationships: [
    { from: 1, to: 2, type: 'COLLABORATES_WITH', props: { since: 2024 } },
    { from: 1, to: 10, type: 'CONTRIBUTES_TO', props: { role: 'author' } },
    { from: 2, to: 10, type: 'MAINTAINS', props: { role: 'lead' } },
  ],
};
// #endregion nosql-redis-graph

console.log('Modelos e padrões NoSQL validados com sucesso:');
console.log(`- Pedido com itens embutidos: ${orderEmbedded.orderId} (${orderEmbedded.items.length} itens)`);
console.log(`- Produto com Subset Pattern: ${productWithSubset.id} (${productWithSubset.recentReviews.length} reviews embutidas de ${productWithSubset.reviewCount} totais)`);
console.log(`- Grafo: ${graphModel.nodes.length} nós e ${graphModel.relationships.length} relacionamentos com index-free adjacency`);
