// Unsplash photo IDs for destination images
// Format: https://images.unsplash.com/photo-{ID}?w=800&h=500&fit=crop&q=80

const PHOTO_IDS: Record<string, string> = {
  // Indian destinations
  'Goa':          'photo-1512343879784-a960bf40e7f2',
  'Manali':       'photo-1626621341517-bbf3d9990a23',
  'Delhi':        'photo-1587474260584-136574528ed5',
  'Mumbai':       'photo-1529253355930-ddbe423a2ac7',
  'Jaipur':       'photo-1477587458883-47145ed94245',
  'Kerala':       'photo-1602216056096-3b40cc0c9944',
  'Kochi':        'photo-1602216056096-3b40cc0c9944',
  'Agra':         'photo-1564507592333-c60657eea523',
  'Kolkata':      'photo-1558431382-27e303142255',
  'Hyderabad':    'photo-1624307966715-2ef8c23df18e',
  'Bangalore':    'photo-1596176530529-78163a4f7af2',
  'Rishikesh':    'photo-1625751667233-1b77d5f1cf26',
  'Ladakh':       'photo-1626714661668-f73bf05f3a09',
  'Udaipur':      'photo-1524492412937-b28074a5d7da',
  'Chennai':      'photo-1582510003544-4d00b7f74220',
  'Pune':         'photo-1570168007204-dfb528c6958f',
  'Amritsar':     'photo-1588416936097-41850ab3d86d',
  'Varanasi':     'photo-1561361058-c24e022f8b41',
  'Hampi':        'photo-1582972236019-ea4af5ffe587',
  'Shimla':       'photo-1597074866923-dc0589150358',
  'Ooty':         'photo-1558618666-fcd25c85cd64',
  'Coorg':        'photo-1552465011-b4e21bf6e79a',
  'Andaman':      'photo-1559494007-9f5847c49d94',
  'Lakshadweep':  'photo-1559494007-9f5847c49d94',
  // International
  'London':       'photo-1513635269975-59663e0ac1ad',
  'Paris':        'photo-1502602898657-3e91760cbb34',
  'Dubai':        'photo-1512453979798-5ea266f8880c',
  'Bali':         'photo-1537996194471-e657df975ab4',
  'Singapore':    'photo-1565967511849-76a60a516170',
  'Bangkok':      'photo-1508009603885-50cf7c579365',
  'Tokyo':        'photo-1540959733332-eab4deabeeaf',
  'New York':     'photo-1496442226666-8d4d0e62e6e9',
  'Sydney':       'photo-1506973035872-a4ec16b8e8d9',
  'Amsterdam':    'photo-1512470876302-972faa2aa9a4',
  'Barcelona':    'photo-1539037116277-4db20889f2d4',
  'Rome':         'photo-1552832230-c0197dd311b5',
  'Istanbul':     'photo-1524231757912-21f4fe3a7200',
  'Maldives':     'photo-1514282401047-d79a71a590e8',
}

const DEFAULT = 'photo-1476514525535-07fb3b4ae5f1' // scenic mountain/sky fallback

export function getDestinationImage(
  destination: string,
  width = 800,
  height = 500,
): string {
  const id = PHOTO_IDS[destination] ?? DEFAULT
  return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&q=80`
}
