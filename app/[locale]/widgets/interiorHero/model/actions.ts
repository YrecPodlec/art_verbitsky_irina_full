// Здесь только порядок и маршруты. Все подписи находятся в messages/*.json.
// Якоря ведут к готовым секциям той же страницы, а шоурум — на отдельный маршрут.
export const heroActions = [
  {id: 'projects', index: '01', href: '/interior#projects'},
  {id: 'services', index: '02', href: '/interior#services'},
  {id: 'showroom', index: '03', href: '/showroom'},
] as const;
