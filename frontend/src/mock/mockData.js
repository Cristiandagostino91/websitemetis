// Mock data for Centro Metis e-commerce

export const products = [
  {
    id: '1',
    name: 'Omega 3 Premium',
    category: 'integratori',
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
    description: 'Integratore di Omega 3 ad alto dosaggio, essenziale per la salute cardiovascolare',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Sali Minerali Complex',
    category: 'integratori',
    price: 19.90,
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600',
    description: 'Mix completo di sali minerali per il benessere quotidiano',
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Vitamina D3',
    category: 'integratori',
    price: 15.90,
    image: 'https://images.unsplash.com/photo-1550572017-4c6b0c9d0885?w=600',
    description: 'Vitamina D3 per il supporto del sistema immunitario',
    inStock: true,
    featured: false
  },
  {
    id: '4',
    name: 'Probiotici Avanzati',
    category: 'integratori',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600',
    description: 'Formula avanzata di probiotici per la salute intestinale',
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'Magnesio Supremo',
    category: 'integratori',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600',
    description: 'Magnesio altamente biodisponibile per energia e relax',
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Multivitaminico Completo',
    category: 'integratori',
    price: 27.90,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600',
    description: 'Formula completa di vitamine e minerali essenziali',
    inStock: true,
    featured: false
  }
];

export const services = [
  {
    id: 's1',
    title: 'Consulenza Nutrizionale',
    price: 80.00,
    duration: '60 min',
    description: 'Prima visita con valutazione completa e piano alimentare personalizzato',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600',
    category: 'consulenze'
  },
  {
    id: 's2',
    title: 'Bioimpedenziometria',
    price: 40.00,
    duration: '30 min',
    description: 'Analisi della composizione corporea con strumentazione avanzata',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
    category: 'analisi'
  },
  {
    id: 's3',
    title: 'Dieta Chetogenica',
    price: 120.00,
    duration: '90 min',
    description: 'Programma completo per dimagrimento con dieta chetogenica',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
    category: 'programmi'
  },
  {
    id: 's4',
    title: 'Nutrizione Sportiva',
    price: 100.00,
    duration: '60 min',
    description: 'Piano alimentare personalizzato per atleti e sportivi',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600',
    category: 'programmi'
  },
  {
    id: 's5',
    title: 'Nutrizione in Gravidanza',
    price: 90.00,
    duration: '60 min',
    description: 'Supporto nutrizionale durante gravidanza e allattamento',
    image: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=600',
    category: 'consulenze'
  },
  {
    id: 's6',
    title: 'Controllo Periodico',
    price: 50.00,
    duration: '30 min',
    description: 'Visita di controllo e adattamento del piano alimentare',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
    category: 'consulenze'
  }
];

export const blogPosts = [
  {
    id: 'b1',
    title: 'Dieta chetogenica e fertilità',
    excerpt: 'Migliorare gli indici di fertilità femminili e maschili attraverso l\'alimentazione',
    content: 'La dieta chetogenica può avere effetti positivi sulla fertilità...',
    author: 'Dott.ssa Paola Buoninfante',
    date: '13 marzo 2025',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
    category: 'Nutrizione'
  },
  {
    id: 'b2',
    title: 'Alimentazione sostenibile: il modello della dieta mediterranea',
    excerpt: 'L\'impronta ecologica delle nostre scelte alimentari',
    content: 'La dieta mediterranea rappresenta un modello di alimentazione sostenibile...',
    author: 'Dott.ssa Paola Buoninfante',
    date: '13 marzo 2025',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    category: 'Sostenibilità'
  },
  {
    id: 'b3',
    title: 'La nutrizione per la fibromialgia',
    excerpt: 'Ridurre l\'infiammazione e curare il microbiota intestinale',
    content: 'Un approccio nutrizionale mirato può aiutare a gestire i sintomi della fibromialgia...',
    author: 'Dott.ssa Paola Buoninfante',
    date: '13 marzo 2025',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    category: 'Patologie'
  }
];

export const testimonials = [
  {
    id: 't1',
    name: 'Mari',
    text: 'Sono felice di tornare al mio peso...grazie alla dottoressa Paola Buoninfante...molto professionale e gentilissima',
    rating: 5,
    source: 'Google'
  },
  {
    id: 't2',
    name: 'Antonella Pantaleo',
    text: 'Il posto della salvezza! Consigliatissimo!',
    rating: 5,
    source: 'Google'
  },
  {
    id: 't3',
    name: 'A. Cardinale',
    text: 'Posso dire di essere molto contenta di aver conosciuto la dottoressa Buoninfante, che consiglio vivamente, per scrupolosità, professionalità e preparazione. Sto ottenendo risultati soddisfacenti.',
    rating: 5,
    source: 'Google'
  }
];

export const teamMember = {
  name: 'Dott.ssa Paola Buoninfante',
  role: 'Biologa Nutrizionista',
  qualification: 'Iscrizione Albo n. 052079',
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600',
  bio: 'Biologa nutrizionista specializzata in bioterapia nutrizionale con anni di esperienza nel settore. Fondatrice del Centro Metis, si dedica con passione al benessere dei suoi pazienti attraverso piani alimentari personalizzati e un approccio olistico alla salute.',
  specializations: [
    'Bioterapia Nutrizionale',
    'Diete Chetogeniche',
    'Nutrizione Sportiva',
    'Nutrizione in Gravidanza',
    'Nutrizione Oncologica',
    'Educazione Alimentare'
  ]
};

export const contactInfo = {
  phone: '+39 0828 52615',
  email: 'info@centrometis.it',
  address: 'Via John Fitzgerald Kennedy, 66',
  city: '84092 Bellizzi (SA)',
  country: 'Italia'
};