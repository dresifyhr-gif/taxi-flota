export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "zasto-je-prednost-voziti-taxi",
    title: "Zašto je taxi posao dobra opcija u 2026. godini",
    excerpt:
      "Taxi posao mnogim vozačima odgovara zbog fleksibilnosti, mogućnosti vlastite organizacije rada i jasnog operativnog modela.",
    date: "15.04.2026.",
    readTime: "4 min čitanja",
    category: "Prednosti posla",
    content: [
      "Jedna od najvećih prednosti taxi posla je fleksibilnost. Vozači sami biraju koliko žele raditi i kako će organizirati svoj dan, umjesto da ovise o klasičnom fiksnom rasporedu.",
      "Uz pravu podršku pri pokretanju, vozač prolazi kroz onboarding i dokumentaciju bez nepotrebnog čekanja. Mnogi vozači upravo tu kombinaciju samostalnosti i stručne pomoći pri startu navode kao ključnu prednost.",
      "Dodatna prednost je što vozač ne mora nužno imati vlastiti auto. Ako nema vozilo, može se raspitati o taxi najmu ili dnevnom najmu, što ulazak u posao čini dostupnijim i jednostavnijim.",
    ],
  },
  {
    slug: "kako-se-prijaviti-za-rad-preko-uber-i-bolt-platformi",
    title: "Kako se prijaviti za rad na Uber i Bolt platformama",
    excerpt:
      "Kratki vodič za vozače koji žele započeti rad na taxi platformama, s objašnjenjem procesa prijave i dokumentacije.",
    date: "15.04.2026.",
    readTime: "4 min čitanja",
    category: "Prijava",
    content: [
      "Ako želiš voziti na Uber i Bolt platformama, prvi korak je potpuna online prijava. Na prijavnoj stranici ostavljaš osnovne kontakt podatke i odmah učitavaš tražene dokumente kako bi obrada mogla krenuti bez zastoja.",
      "Za pregled prijave trebamo osobnu iskaznicu, vozačku dozvolu, taxi diplomu, uvjerenje o nekažnjavanju i selfie fotografiju. Kada je prijava potpuna, naš tim pregledava dokumentaciju i javlja se s povratnom informacijom te sljedećim koracima.",
      "Ako kandidat još nije riješio sve formalnosti — poput taxi ispita ili taxi kartice — upućujemo ga kroz svaki korak koji mu je potreban da bi mogao legalno početi voziti.",
      "Cilj nam je da vozač ne mora slati dokumente kroz više kanala, nego da sve riješi na jednom mjestu. Tako je proces uredniji, brži i lakši za praćenje.",
    ],
  },
  {
    slug: "sto-trebate-znati-o-najmu-taxi-vozila-u-zagrebu",
    title: "Što trebate znati o najmu taxi vozila u Zagrebu",
    excerpt:
      "Pregled najvažnijih informacija o taxi najmu i dnevnom najmu vozila za vozače koji žele krenuti raditi bez vlastitog auta.",
    date: "15.04.2026.",
    readTime: "3 min čitanja",
    category: "Najam vozila",
    content: [
      "Vozači koji nemaju vlastiti auto i dalje se mogu uključiti u taxi posao. Nudimo tjedni i dnevni najam vozila u Zagrebu, a sva vozila su novije generacije od 2020. do 2025. godine.",
      "Manualnih modeli kreću od 180 EUR tjedno, a automatik modeli od 200 EUR tjedno. Sva vozila su kasko osigurana i pripremljena za profesionalan rad na platformama.",
      "Ako u određenom trenutku traženo vozilo nije slobodno, pokušavamo osigurati auto kroz provjerene partnerske flote kako bi kandidat što prije mogao krenuti s radom.",
    ],
  },
  {
    slug: "zasto-vozaci-biraju-strucnu-podrsku-pri-pokretanju",
    title: "Zašto vozači biraju stručnu podršku pri pokretanju taxi posla",
    excerpt:
      "Pokretanje taxi posla lakše ide uz stručnu pomoć oko obrta, dozvola, dokumentacije i spajanja s provjerenim partnerima.",
    date: "15.04.2026.",
    readTime: "4 min čitanja",
    category: "Pokretanje posla",
    content: [
      "Vozači koji se tek uključuju u taxi posao često ne znaju gdje krenuti — koji obrt otvoriti, koje dozvole pribaviti, kako proći taxi ispit. Stručna podrška u tom procesu štedi tjedne samostalnog istraživanja.",
      "FLOTA vozačima pomaže oko otvaranja obrta, pregleda dokumentacije i spajanja s provjerenim fleet partnerima koji rade uredno i pouzdano. Svaki korak koordiniramo zajedno, bez skrivenih iznenaðenja.",
      "Za mnoge kandidate dodatna vrijednost je i mogućnost da uz prijavu odmah riješe pitanje vozila — bilo kroz vlastiti auto ili kroz dostupni najam — te pitanje knjiga za obrt koje vodimo u sklopu naših usluga.",
    ],
  },
  {
    slug: "kako-organizirati-rad-kao-taxi-vozac",
    title: "Kako organizirati rad kao taxi vozač",
    excerpt:
      "Dobar taxi vozač ne razmišlja samo o vožnji, nego i o tome kako rasporediti vrijeme, odabrati smjene i dugoročno raditi održivo.",
    date: "15.04.2026.",
    readTime: "3 min čitanja",
    category: "Savjeti za vozače",
    content: [
      "Jedna od važnih prednosti rada na taxi platformama je to što vozač može bolje prilagoditi posao vlastitom rasporedu. Nekome više odgovaraju jutarnje vožnje, nekome popodne, a nekome vikendi i večernji termini.",
      "Kada vozač zna da sam bira koliko će raditi, lakše planira privatne obaveze i dugoročno održava stabilan ritam. Zato mnogi vozači kažu da se u ovom poslu osjećaju kao da sami vode svoj radni dan.",
      "Uz pomoć pri pokretanju i administraciji, vozač se od prvog dana može fokusirati na ono što mu donosi zaradu — kvalitetnu vožnju i dobru organizaciju vremena.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
