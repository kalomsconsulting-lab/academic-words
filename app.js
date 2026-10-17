/* Study Cards — nauka z fiszek i powtórek SRS: Academic English, biologia i kolejne przedmioty.
 * Vanilla JS, bez build stepu. Postęp w localStorage. */
'use strict';
(function () {

  // ===================================================================
  // Stałe
  // ===================================================================
  const STORAGE_KEY = 'awv:v1';
  const SHARED_KEY = 'awv:shared'; // kopia wspólnych materiałów z Supabase (działa offline)

  const CATEGORIES = {
    phrasal_verbs:    { label: 'Phrasal verbs', short: 'Phrasal verbs', pl: 'czasowniki frazowe', icon: '🔗' },
    informal_phrases: { label: 'Informal phrases', short: 'Phrases', pl: 'wyrażenia nieformalne', icon: '💬' },
    academic_verbs:   { label: 'Academic verbs', short: 'Academic verbs', pl: 'czasowniki akademickie', icon: '🎓' },
    connectors:       { label: 'Connectors', short: 'Connectors', pl: 'łączniki i spójniki', icon: '➕' },
    hedging:          { label: 'Hedging', short: 'Hedging', pl: 'język ostrożny', icon: '🌫️' },
    awl:              { label: 'Academic Word List', short: 'AWL', pl: 'akademicka lista słów', icon: '📚' },
    style_rules:      { label: 'Style rules', short: 'Style', pl: 'reguły stylu', icon: '✍️' },
    noun_phrases:     { label: 'Noun phrases', short: 'Noun phrases', pl: 'frazy rzeczownikowe', icon: '🧩' },
    // Biologia (klucze z prefiksem przedmiotu, żeby nie kolidowały z innymi przedmiotami)
    bio_cells:        { subject: 'biology', label: 'Cells', short: 'Cells', pl: 'komórki', icon: '🦠' },
    bio_molecules:    { subject: 'biology', label: 'Molecules & metabolism', short: 'Molecules', pl: 'cząsteczki i metabolizm', icon: '⚗️' },
    bio_genetics:     { subject: 'biology', label: 'Genetics & evolution', short: 'Genetics', pl: 'genetyka i ewolucja', icon: '🧬' },
    bio_human:        { subject: 'biology', label: 'Human physiology', short: 'Physiology', pl: 'fizjologia człowieka', icon: '🫀' },
    bio_plants:       { subject: 'biology', label: 'Plants', short: 'Plants', pl: 'rośliny', icon: '🌱' },
    bio_ecology:      { subject: 'biology', label: 'Ecology', short: 'Ecology', pl: 'ekologia', icon: '🌍' },
    bio_skills:       { subject: 'biology', label: 'Skills & experiments', short: 'Skills', pl: 'umiejętności i doświadczenia', icon: '🔬' },
    bio_general:      { subject: 'biology', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    // Angielski, 7 klasa: tematy z podstawy programowej (podpis = nazwa po angielsku)
    en7_people:       { subject: 'english_sp7', label: 'Człowiek', short: 'Człowiek', pl: 'people', icon: '🧑' },
    en7_home:         { subject: 'english_sp7', label: 'Dom', short: 'Dom', pl: 'house & home', icon: '🏠' },
    en7_school:       { subject: 'english_sp7', label: 'Szkoła', short: 'Szkoła', pl: 'school', icon: '🏫' },
    en7_work:         { subject: 'english_sp7', label: 'Praca', short: 'Praca', pl: 'jobs & work', icon: '💼' },
    en7_family:       { subject: 'english_sp7', label: 'Rodzina i przyjaciele', short: 'Rodzina', pl: 'family & friends', icon: '👨‍👩‍👧' },
    en7_food:         { subject: 'english_sp7', label: 'Jedzenie', short: 'Jedzenie', pl: 'food', icon: '🍎' },
    en7_shopping:     { subject: 'english_sp7', label: 'Zakupy i usługi', short: 'Zakupy', pl: 'shopping & services', icon: '🛒' },
    en7_travel:       { subject: 'english_sp7', label: 'Podróże', short: 'Podróże', pl: 'travel & tourism', icon: '✈️' },
    en7_culture:      { subject: 'english_sp7', label: 'Kultura', short: 'Kultura', pl: 'culture', icon: '🎬' },
    en7_sport:        { subject: 'english_sp7', label: 'Sport', short: 'Sport', pl: 'sport', icon: '⚽' },
    en7_health:       { subject: 'english_sp7', label: 'Zdrowie', short: 'Zdrowie', pl: 'health', icon: '🩺' },
    en7_science:      { subject: 'english_sp7', label: 'Nauka i technika', short: 'Technika', pl: 'science & technology', icon: '💻' },
    en7_nature:       { subject: 'english_sp7', label: 'Przyroda', short: 'Przyroda', pl: 'the natural world', icon: '🌳' },
    en7_society:      { subject: 'english_sp7', label: 'Społeczeństwo', short: 'Społeczeństwo', pl: 'society', icon: '🏛️' },
    en7_other:        { subject: 'english_sp7', label: 'Inne', short: 'Inne', pl: 'other', icon: '📘' },
    // Biologia, 7 klasa: działy (biologia człowieka)
    bio7_body:        { subject: 'biologia_sp7', label: 'Organizm człowieka', short: 'Organizm', pl: 'tkanki, narządy, układy', icon: '🧍' },
    bio7_skin:        { subject: 'biologia_sp7', label: 'Skóra', short: 'Skóra', pl: 'powłoka ciała', icon: '✋' },
    bio7_movement:    { subject: 'biologia_sp7', label: 'Układ ruchu', short: 'Ruch', pl: 'szkielet i mięśnie', icon: '🦴' },
    bio7_digestion:   { subject: 'biologia_sp7', label: 'Układ pokarmowy', short: 'Pokarmowy', pl: 'odżywianie i trawienie', icon: '🍽️' },
    bio7_circulation: { subject: 'biologia_sp7', label: 'Układ krwionośny', short: 'Krwionośny', pl: 'krew, serce, naczynia', icon: '🫀' },
    bio7_immune:      { subject: 'biologia_sp7', label: 'Układ odpornościowy', short: 'Odporność', pl: 'odporność organizmu', icon: '🛡️' },
    bio7_breathing:   { subject: 'biologia_sp7', label: 'Układ oddechowy', short: 'Oddechowy', pl: 'oddychanie', icon: '🫁' },
    bio7_excretion:   { subject: 'biologia_sp7', label: 'Układ moczowy', short: 'Moczowy', pl: 'wydalanie', icon: '💧' },
    bio7_nervous:     { subject: 'biologia_sp7', label: 'Układ nerwowy', short: 'Nerwowy', pl: 'mózg i nerwy', icon: '🧠' },
    bio7_senses:      { subject: 'biologia_sp7', label: 'Narządy zmysłów', short: 'Zmysły', pl: 'wzrok, słuch i inne', icon: '👁️' },
    bio7_hormones:    { subject: 'biologia_sp7', label: 'Układ hormonalny', short: 'Hormony', pl: 'gruczoły i hormony', icon: '⚗️' },
    bio7_reproduction:{ subject: 'biologia_sp7', label: 'Rozmnażanie i rozwój', short: 'Rozwój', pl: 'rozmnażanie i dojrzewanie', icon: '👶' },
    bio7_health:      { subject: 'biologia_sp7', label: 'Zdrowie', short: 'Zdrowie', pl: 'homeostaza i zdrowie', icon: '🩺' },
    bio7_other:       { subject: 'biologia_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },

    // ----- IB Pre-DP: przedmioty z planu lekcji (karty po angielsku, przedmioty polskie po polsku) -----
    // Mathematics
    mathib_number:    { subject: 'math_ib', label: 'Number & algebra', short: 'Algebra', pl: 'liczby i algebra', icon: '🔢' },
    mathib_functions: { subject: 'math_ib', label: 'Functions', short: 'Functions', pl: 'funkcje', icon: '📈' },
    mathib_geometry:  { subject: 'math_ib', label: 'Geometry & trigonometry', short: 'Geometry', pl: 'geometria i trygonometria', icon: '📐' },
    mathib_stats:     { subject: 'math_ib', label: 'Statistics & probability', short: 'Statistics', pl: 'statystyka i prawdopodobieństwo', icon: '🎲' },
    mathib_calculus:  { subject: 'math_ib', label: 'Calculus', short: 'Calculus', pl: 'rachunek różniczkowy', icon: '📉' },
    mathib_other:     { subject: 'math_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    // Chemistry
    chemib_atoms:     { subject: 'chemistry_ib', label: 'Atomic structure', short: 'Atoms', pl: 'budowa atomu', icon: '⚛️' },
    chemib_periodic:  { subject: 'chemistry_ib', label: 'Periodic table', short: 'Periodic', pl: 'układ okresowy', icon: '🧮' },
    chemib_bonding:   { subject: 'chemistry_ib', label: 'Bonding & structure', short: 'Bonding', pl: 'wiązania i struktura', icon: '🔗' },
    chemib_mole:      { subject: 'chemistry_ib', label: 'The mole & stoichiometry', short: 'Mole', pl: 'mol i stechiometria', icon: '⚖️' },
    chemib_reactions: { subject: 'chemistry_ib', label: 'Reactions & energetics', short: 'Reactions', pl: 'reakcje i energetyka', icon: '🔥' },
    chemib_acids:     { subject: 'chemistry_ib', label: 'Acids & bases', short: 'Acids', pl: 'kwasy i zasady', icon: '🧫' },
    chemib_redox:     { subject: 'chemistry_ib', label: 'Redox', short: 'Redox', pl: 'utlenianie i redukcja', icon: '🔋' },
    chemib_organic:   { subject: 'chemistry_ib', label: 'Organic chemistry', short: 'Organic', pl: 'chemia organiczna', icon: '🧴' },
    chemib_skills:    { subject: 'chemistry_ib', label: 'Lab skills', short: 'Lab', pl: 'umiejętności laboratoryjne', icon: '🔬' },
    chemib_other:     { subject: 'chemistry_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    // Physics
    physib_measure:   { subject: 'physics_ib', label: 'Measurements & uncertainties', short: 'Measurement', pl: 'pomiary i niepewności', icon: '📏' },
    physib_motion:    { subject: 'physics_ib', label: 'Motion & forces', short: 'Mechanics', pl: 'ruch i siły', icon: '🚀' },
    physib_energy:    { subject: 'physics_ib', label: 'Work, energy & power', short: 'Energy', pl: 'praca, energia i moc', icon: '⚡' },
    physib_thermal:   { subject: 'physics_ib', label: 'Thermal physics', short: 'Thermal', pl: 'termodynamika', icon: '🌡️' },
    physib_waves:     { subject: 'physics_ib', label: 'Waves', short: 'Waves', pl: 'fale', icon: '🌊' },
    physib_electric:  { subject: 'physics_ib', label: 'Electricity & magnetism', short: 'Electricity', pl: 'elektryczność i magnetyzm', icon: '🧲' },
    physib_nuclear:   { subject: 'physics_ib', label: 'Atomic & nuclear physics', short: 'Nuclear', pl: 'fizyka atomowa i jądrowa', icon: '☢️' },
    physib_other:     { subject: 'physics_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    // History
    histib_skills:    { subject: 'history_ib', label: 'Sources & skills', short: 'Skills', pl: 'źródła i umiejętności', icon: '🔎' },
    histib_early:     { subject: 'history_ib', label: 'Ancient & medieval', short: 'Medieval', pl: 'starożytność i średniowiecze', icon: '🏺' },
    histib_modern:    { subject: 'history_ib', label: 'Early modern', short: 'Early modern', pl: 'nowożytność', icon: '⛵' },
    histib_19c:       { subject: 'history_ib', label: '19th century', short: '19th c.', pl: 'XIX wiek', icon: '🏭' },
    histib_wars:      { subject: 'history_ib', label: 'World wars', short: 'Wars', pl: 'wojny światowe', icon: '🪖' },
    histib_states:    { subject: 'history_ib', label: 'Authoritarian states', short: 'Authoritarian', pl: 'państwa autorytarne', icon: '🏛️' },
    histib_coldwar:   { subject: 'history_ib', label: 'Cold War', short: 'Cold War', pl: 'zimna wojna', icon: '🧊' },
    histib_other:     { subject: 'history_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    // History of Poland (po polsku)
    hpl_piast:        { subject: 'historia_polski_ib', label: 'Polska Piastów', short: 'Piastowie', pl: 'X–XIV wiek', icon: '👑' },
    hpl_jagiellon:    { subject: 'historia_polski_ib', label: 'Polska Jagiellonów', short: 'Jagiellonowie', pl: 'XIV–XVI wiek', icon: '🛡️' },
    hpl_commonwealth: { subject: 'historia_polski_ib', label: 'Rzeczpospolita Obojga Narodów', short: 'Rzeczpospolita', pl: 'XVI–XVIII wiek', icon: '🏰' },
    hpl_partitions:   { subject: 'historia_polski_ib', label: 'Rozbiory i XIX wiek', short: 'Zabory', pl: 'rozbiory, powstania, zabory', icon: '⛓️' },
    hpl_ii_rp:        { subject: 'historia_polski_ib', label: 'II Rzeczpospolita', short: 'II RP', pl: '1918–1939', icon: '🦅' },
    hpl_ww2:          { subject: 'historia_polski_ib', label: 'II wojna światowa', short: 'II wojna', pl: 'okupacja i Polskie Państwo Podziemne', icon: '🪖' },
    hpl_prl:          { subject: 'historia_polski_ib', label: 'PRL', short: 'PRL', pl: '1944–1989', icon: '🏭' },
    hpl_iii_rp:       { subject: 'historia_polski_ib', label: 'III Rzeczpospolita', short: 'III RP', pl: 'po 1989', icon: '🗳️' },
    hpl_other:        { subject: 'historia_polski_ib', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Geography
    geoib_skills:     { subject: 'geography_ib', label: 'Maps & skills', short: 'Maps', pl: 'mapy i umiejętności', icon: '🧭' },
    geoib_population: { subject: 'geography_ib', label: 'Population', short: 'Population', pl: 'ludność', icon: '👥' },
    geoib_urban:      { subject: 'geography_ib', label: 'Urbanisation', short: 'Urban', pl: 'urbanizacja', icon: '🏙️' },
    geoib_climate:    { subject: 'geography_ib', label: 'Weather & climate', short: 'Climate', pl: 'pogoda i klimat', icon: '🌦️' },
    geoib_landforms:  { subject: 'geography_ib', label: 'Landforms & hazards', short: 'Hazards', pl: 'rzeźba terenu i zagrożenia', icon: '🌋' },
    geoib_water:      { subject: 'geography_ib', label: 'Water & rivers', short: 'Water', pl: 'woda i rzeki', icon: '💧' },
    geoib_resources:  { subject: 'geography_ib', label: 'Resources & energy', short: 'Resources', pl: 'zasoby i energia', icon: '⛽' },
    geoib_global:     { subject: 'geography_ib', label: 'Development & globalisation', short: 'Global', pl: 'rozwój i globalizacja', icon: '🌐' },
    geoib_other:      { subject: 'geography_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    // Polish (język polski w liceum)
    plib_antiquity:   { subject: 'polski_ib', label: 'Antyk i Biblia', short: 'Antyk', pl: 'mitologia, Biblia, literatura antyczna', icon: '🏺' },
    plib_medieval:    { subject: 'polski_ib', label: 'Średniowiecze', short: 'Średniowiecze', pl: 'literatura średniowieczna', icon: '🏰' },
    plib_renaissance: { subject: 'polski_ib', label: 'Renesans', short: 'Renesans', pl: 'Kochanowski i humanizm', icon: '🎭' },
    plib_baroque:     { subject: 'polski_ib', label: 'Barok', short: 'Barok', pl: 'literatura barokowa', icon: '🕯️' },
    plib_enlight:     { subject: 'polski_ib', label: 'Oświecenie', short: 'Oświecenie', pl: 'Krasicki i literatura oświecenia', icon: '💡' },
    plib_theory:      { subject: 'polski_ib', label: 'Teoria literatury', short: 'Teoria', pl: 'rodzaje, gatunki, środki stylistyczne', icon: '📚' },
    plib_language:    { subject: 'polski_ib', label: 'Nauka o języku', short: 'Język', pl: 'gramatyka, stylistyka, retoryka', icon: '✍️' },
    plib_other:       { subject: 'polski_ib', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Edukacja obywatelska (po polsku)
    eo_society:       { subject: 'eo_ib', label: 'Społeczeństwo', short: 'Społeczeństwo', pl: 'grupy, społeczności, aktywność obywatelska', icon: '👥' },
    eo_rights:        { subject: 'eo_ib', label: 'Prawa człowieka', short: 'Prawa', pl: 'wolności i prawa', icon: '🕊️' },
    eo_state:         { subject: 'eo_ib', label: 'Państwo i ustrój RP', short: 'Ustrój', pl: 'Konstytucja, władze, wybory', icon: '🏛️' },
    eo_local:         { subject: 'eo_ib', label: 'Samorząd', short: 'Samorząd', pl: 'gmina, powiat, województwo', icon: '🏘️' },
    eo_law:           { subject: 'eo_ib', label: 'Prawo', short: 'Prawo', pl: 'prawo i sądy', icon: '⚖️' },
    eo_media:         { subject: 'eo_ib', label: 'Media i informacja', short: 'Media', pl: 'media, dezinformacja', icon: '📰' },
    eo_world:         { subject: 'eo_ib', label: 'Polska w Europie i świecie', short: 'UE i świat', pl: 'UE, NATO, ONZ', icon: '🌐' },
    eo_other:         { subject: 'eo_ib', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Computer Science (od II semestru)
    csib_systems:     { subject: 'cs_ib', label: 'Computer systems', short: 'Systems', pl: 'sprzęt i systemy', icon: '🖥️' },
    csib_data:        { subject: 'cs_ib', label: 'Data representation', short: 'Data', pl: 'reprezentacja danych', icon: '0️⃣' },
    csib_networks:    { subject: 'cs_ib', label: 'Networks', short: 'Networks', pl: 'sieci', icon: '🌐' },
    csib_algorithms:  { subject: 'cs_ib', label: 'Algorithms', short: 'Algorithms', pl: 'algorytmy', icon: '🧩' },
    csib_programming: { subject: 'cs_ib', label: 'Programming', short: 'Programming', pl: 'programowanie', icon: '⌨️' },
    csib_databases:   { subject: 'cs_ib', label: 'Databases', short: 'Databases', pl: 'bazy danych', icon: '🗄️' },
    csib_impacts:     { subject: 'cs_ib', label: 'Impacts & ethics', short: 'Ethics', pl: 'wpływ i etyka', icon: '🤝' },
    csib_other:       { subject: 'cs_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    // German B (słówka; podpis po polsku, pl = temat IB Language B)
    deib_identities:  { subject: 'german_ib', label: 'Tożsamość', short: 'Tożsamość', pl: 'Identities', icon: '🧑' },
    deib_experiences: { subject: 'german_ib', label: 'Doświadczenia', short: 'Doświadczenia', pl: 'Experiences', icon: '✈️' },
    deib_ingenuity:   { subject: 'german_ib', label: 'Wynalazczość', short: 'Wynalazki', pl: 'Human ingenuity', icon: '💡' },
    deib_social:      { subject: 'german_ib', label: 'Organizacja społeczna', short: 'Społeczeństwo', pl: 'Social organisation', icon: '🏛️' },
    deib_planet:      { subject: 'german_ib', label: 'Wspólna planeta', short: 'Planeta', pl: 'Sharing the planet', icon: '🌍' },
    deib_grammar:     { subject: 'german_ib', label: 'Gramatyka i zwroty', short: 'Gramatyka', pl: 'Grammatik', icon: '🧩' },
    deib_other:       { subject: 'german_ib', label: 'Inne', short: 'Inne', pl: 'Sonstiges', icon: '📘' },
    // English (osobny przedmiot, nie Academic Writing): analiza tekstów literackich i nieliterackich
    enib_devices:     { subject: 'english_ib', label: 'Literary devices', short: 'Devices', pl: 'środki stylistyczne', icon: '🎨' },
    enib_poetry:      { subject: 'english_ib', label: 'Poetry', short: 'Poetry', pl: 'poezja', icon: '🪶' },
    enib_prose:       { subject: 'english_ib', label: 'Prose fiction', short: 'Prose', pl: 'proza', icon: '📕' },
    enib_drama:       { subject: 'english_ib', label: 'Drama', short: 'Drama', pl: 'dramat', icon: '🎭' },
    enib_nonlit:      { subject: 'english_ib', label: 'Non-literary texts', short: 'Non-literary', pl: 'teksty nieliterackie', icon: '📰' },
    enib_rhetoric:    { subject: 'english_ib', label: 'Language & rhetoric', short: 'Rhetoric', pl: 'język i retoryka', icon: '📣' },
    enib_analysis:    { subject: 'english_ib', label: 'Analysis & essays', short: 'Analysis', pl: 'analiza i wypracowania', icon: '✍️' },
    enib_texts:       { subject: 'english_ib', label: 'Set texts', short: 'Set texts', pl: 'omawiane utwory', icon: '📚' },
    enib_other:       { subject: 'english_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    // Electives (każdy przez jeden trymestr): Psychology, Philosophy, Business & Management
    psyib_methods:    { subject: 'psychology_ib', label: 'Research methods & ethics', short: 'Methods', pl: 'metody badań i etyka', icon: '🔬' },
    psyib_biological: { subject: 'psychology_ib', label: 'Biological approach', short: 'Biological', pl: 'podejście biologiczne', icon: '🧬' },
    psyib_cognitive:  { subject: 'psychology_ib', label: 'Cognitive approach', short: 'Cognitive', pl: 'podejście poznawcze', icon: '💭' },
    psyib_social:     { subject: 'psychology_ib', label: 'Sociocultural approach', short: 'Sociocultural', pl: 'podejście społeczno-kulturowe', icon: '👥' },
    psyib_development:{ subject: 'psychology_ib', label: 'Developmental psychology', short: 'Development', pl: 'psychologia rozwojowa', icon: '👶' },
    psyib_health:     { subject: 'psychology_ib', label: 'Health & abnormal psychology', short: 'Health', pl: 'zdrowie i zaburzenia', icon: '🩺' },
    psyib_studies:    { subject: 'psychology_ib', label: 'Key studies', short: 'Studies', pl: 'kluczowe badania', icon: '📋' },
    psyib_other:      { subject: 'psychology_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    phiib_human:      { subject: 'philosophy_ib', label: 'Being human', short: 'Being human', pl: 'człowiek i umysł', icon: '🧍' },
    phiib_knowledge:  { subject: 'philosophy_ib', label: 'Knowledge & truth', short: 'Knowledge', pl: 'teoria poznania', icon: '🔎' },
    phiib_metaphysics:{ subject: 'philosophy_ib', label: 'Metaphysics', short: 'Metaphysics', pl: 'metafizyka', icon: '🌌' },
    phiib_ethics:     { subject: 'philosophy_ib', label: 'Ethics', short: 'Ethics', pl: 'etyka', icon: '⚖️' },
    phiib_political:  { subject: 'philosophy_ib', label: 'Political philosophy', short: 'Political', pl: 'filozofia polityczna', icon: '🏛️' },
    phiib_logic:      { subject: 'philosophy_ib', label: 'Logic & arguments', short: 'Logic', pl: 'logika i argumentacja', icon: '🧩' },
    phiib_thinkers:   { subject: 'philosophy_ib', label: 'Philosophers', short: 'Philosophers', pl: 'filozofowie i ich poglądy', icon: '🗿' },
    phiib_other:      { subject: 'philosophy_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },
    busib_intro:      { subject: 'business_ib', label: 'Business organisation', short: 'Organisation', pl: 'organizacja i otoczenie firmy', icon: '🏢' },
    busib_hr:         { subject: 'business_ib', label: 'Human resources', short: 'HR', pl: 'zarządzanie ludźmi', icon: '🧑‍💼' },
    busib_finance:    { subject: 'business_ib', label: 'Finance & accounts', short: 'Finance', pl: 'finanse i rachunkowość', icon: '💰' },
    busib_marketing:  { subject: 'business_ib', label: 'Marketing', short: 'Marketing', pl: 'marketing', icon: '📣' },
    busib_operations: { subject: 'business_ib', label: 'Operations', short: 'Operations', pl: 'zarządzanie operacyjne', icon: '⚙️' },
    busib_tools:      { subject: 'business_ib', label: 'Business tools', short: 'Tools', pl: 'narzędzia i modele (SWOT, STEEPLE…)', icon: '🧰' },
    busib_other:      { subject: 'business_ib', label: 'Other', short: 'Other', pl: 'inne', icon: '📘' },

    // ----- 7 klasa: przedmioty z planu lekcji (karty po polsku) -----
    // Matematyka
    mat7_numbers:     { subject: 'matematyka_sp7', label: 'Liczby i działania', short: 'Liczby', pl: 'działania, potęgi, pierwiastki', icon: '🔢' },
    mat7_algebra:     { subject: 'matematyka_sp7', label: 'Wyrażenia algebraiczne', short: 'Wyrażenia', pl: 'jednomiany i sumy algebraiczne', icon: '✖️' },
    mat7_equations:   { subject: 'matematyka_sp7', label: 'Równania', short: 'Równania', pl: 'równania i zadania tekstowe', icon: '🟰' },
    mat7_percent:     { subject: 'matematyka_sp7', label: 'Procenty i proporcje', short: 'Procenty', pl: 'procenty, proporcjonalność', icon: '💯' },
    mat7_geometry:    { subject: 'matematyka_sp7', label: 'Figury płaskie', short: 'Figury', pl: 'trójkąty, czworokąty, pola', icon: '📐' },
    mat7_solids:      { subject: 'matematyka_sp7', label: 'Bryły', short: 'Bryły', pl: 'graniastosłupy i ostrosłupy', icon: '🧊' },
    mat7_stats:       { subject: 'matematyka_sp7', label: 'Statystyka', short: 'Statystyka', pl: 'dane, wykresy, średnia', icon: '📊' },
    mat7_other:       { subject: 'matematyka_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Fizyka
    fiz7_intro:       { subject: 'fizyka_sp7', label: 'Pomiary', short: 'Pomiary', pl: 'wielkości fizyczne i jednostki', icon: '📏' },
    fiz7_matter:      { subject: 'fizyka_sp7', label: 'Właściwości materii', short: 'Materia', pl: 'stany skupienia, gęstość', icon: '🧱' },
    fiz7_pressure:    { subject: 'fizyka_sp7', label: 'Ciśnienie i hydrostatyka', short: 'Ciśnienie', pl: 'ciśnienie, prawo Pascala i Archimedesa', icon: '🎈' },
    fiz7_motion:      { subject: 'fizyka_sp7', label: 'Ruch', short: 'Ruch', pl: 'prędkość, przyspieszenie', icon: '🚲' },
    fiz7_forces:      { subject: 'fizyka_sp7', label: 'Siły i zasady dynamiki', short: 'Siły', pl: 'zasady dynamiki Newtona', icon: '🍎' },
    fiz7_energy:      { subject: 'fizyka_sp7', label: 'Praca, moc, energia', short: 'Energia', pl: 'energia mechaniczna', icon: '⚡' },
    fiz7_heat:        { subject: 'fizyka_sp7', label: 'Ciepło', short: 'Ciepło', pl: 'temperatura i przepływ ciepła', icon: '🌡️' },
    fiz7_other:       { subject: 'fizyka_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Chemia
    chem7_substances: { subject: 'chemia_sp7', label: 'Substancje i mieszaniny', short: 'Substancje', pl: 'właściwości, rozdzielanie mieszanin', icon: '🧂' },
    chem7_atoms:      { subject: 'chemia_sp7', label: 'Budowa atomu i układ okresowy', short: 'Atom', pl: 'atomy, pierwiastki, izotopy', icon: '⚛️' },
    chem7_bonding:    { subject: 'chemia_sp7', label: 'Wiązania chemiczne', short: 'Wiązania', pl: 'wiązania, wartościowość, wzory', icon: '🔗' },
    chem7_reactions:  { subject: 'chemia_sp7', label: 'Reakcje chemiczne', short: 'Reakcje', pl: 'typy reakcji, równania, prawa', icon: '🔥' },
    chem7_air:        { subject: 'chemia_sp7', label: 'Powietrze', short: 'Powietrze', pl: 'składniki powietrza, tlenki', icon: '💨' },
    chem7_water:      { subject: 'chemia_sp7', label: 'Woda i roztwory', short: 'Roztwory', pl: 'rozpuszczalność, stężenie', icon: '💧' },
    chem7_lab:        { subject: 'chemia_sp7', label: 'Pracownia chemiczna', short: 'Pracownia', pl: 'sprzęt i bezpieczeństwo', icon: '🔬' },
    chem7_other:      { subject: 'chemia_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Polski
    pol7_books:       { subject: 'polski_sp7', label: 'Lektury', short: 'Lektury', pl: 'treść, bohaterowie, motywy', icon: '📖' },
    pol7_theory:      { subject: 'polski_sp7', label: 'Teoria literatury', short: 'Teoria', pl: 'rodzaje, gatunki, środki stylistyczne', icon: '🎭' },
    pol7_grammar:     { subject: 'polski_sp7', label: 'Gramatyka', short: 'Gramatyka', pl: 'części mowy i zdania', icon: '🧩' },
    pol7_spelling:    { subject: 'polski_sp7', label: 'Ortografia i interpunkcja', short: 'Ortografia', pl: 'pisownia i przecinki', icon: '✏️' },
    pol7_writing:     { subject: 'polski_sp7', label: 'Formy wypowiedzi', short: 'Wypowiedzi', pl: 'rozprawka, charakterystyka, przemówienie', icon: '📝' },
    pol7_other:       { subject: 'polski_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Historia (XIX wiek – 1939)
    his7_napoleon:    { subject: 'historia_sp7', label: 'Epoka napoleońska', short: 'Napoleon', pl: 'Napoleon i Księstwo Warszawskie', icon: '🎖️' },
    his7_vienna:      { subject: 'historia_sp7', label: 'Europa po kongresie wiedeńskim', short: 'Po 1815', pl: 'Święte Przymierze, Wiosna Ludów', icon: '🏛️' },
    his7_uprisings:   { subject: 'historia_sp7', label: 'Powstania narodowe', short: 'Powstania', pl: 'listopadowe i styczniowe', icon: '⚔️' },
    his7_partitions:  { subject: 'historia_sp7', label: 'Ziemie polskie pod zaborami', short: 'Zabory', pl: 'rusyfikacja, germanizacja, praca organiczna', icon: '⛓️' },
    his7_industry:    { subject: 'historia_sp7', label: 'Przemiany XIX wieku', short: 'Przemysł', pl: 'rewolucja przemysłowa, nowe idee', icon: '🏭' },
    his7_ww1:         { subject: 'historia_sp7', label: 'I wojna światowa', short: 'I wojna', pl: '1914–1918', icon: '🪖' },
    his7_ii_rp:       { subject: 'historia_sp7', label: 'II Rzeczpospolita', short: 'II RP', pl: 'odzyskanie niepodległości, 1918–1939', icon: '🦅' },
    his7_interwar:    { subject: 'historia_sp7', label: 'Świat międzywojenny', short: 'Międzywojnie', pl: 'totalitaryzmy, kryzys', icon: '🌐' },
    his7_other:       { subject: 'historia_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Geografia (geografia Polski)
    geo7_location:    { subject: 'geografia_sp7', label: 'Położenie i mapa Polski', short: 'Położenie', pl: 'granice, podział administracyjny', icon: '🧭' },
    geo7_nature:      { subject: 'geografia_sp7', label: 'Środowisko przyrodnicze', short: 'Przyroda', pl: 'rzeźba, klimat, wody, gleby', icon: '🏔️' },
    geo7_population:  { subject: 'geografia_sp7', label: 'Ludność i urbanizacja', short: 'Ludność', pl: 'demografia, migracje, miasta', icon: '👥' },
    geo7_farming:     { subject: 'geografia_sp7', label: 'Rolnictwo', short: 'Rolnictwo', pl: 'uprawy i hodowla', icon: '🌾' },
    geo7_industry:    { subject: 'geografia_sp7', label: 'Przemysł i energetyka', short: 'Przemysł', pl: 'surowce, elektrownie', icon: '🏭' },
    geo7_services:    { subject: 'geografia_sp7', label: 'Usługi i transport', short: 'Usługi', pl: 'transport, turystyka, handel', icon: '🚆' },
    geo7_regions:     { subject: 'geografia_sp7', label: 'Regiony Polski', short: 'Regiony', pl: 'relacje człowiek–środowisko', icon: '🗺️' },
    geo7_other:       { subject: 'geografia_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Niemiecki (słówka; podpis po polsku, pl = temat po niemiecku)
    de7_people:       { subject: 'niemiecki_sp7', label: 'Człowiek', short: 'Człowiek', pl: 'der Mensch', icon: '🧑' },
    de7_family:       { subject: 'niemiecki_sp7', label: 'Rodzina i przyjaciele', short: 'Rodzina', pl: 'Familie und Freunde', icon: '👨‍👩‍👧' },
    de7_home:         { subject: 'niemiecki_sp7', label: 'Dom', short: 'Dom', pl: 'Haus und Wohnung', icon: '🏠' },
    de7_school:       { subject: 'niemiecki_sp7', label: 'Szkoła', short: 'Szkoła', pl: 'die Schule', icon: '🏫' },
    de7_food:         { subject: 'niemiecki_sp7', label: 'Jedzenie', short: 'Jedzenie', pl: 'Essen und Trinken', icon: '🍎' },
    de7_shopping:     { subject: 'niemiecki_sp7', label: 'Zakupy', short: 'Zakupy', pl: 'Einkaufen', icon: '🛒' },
    de7_free_time:    { subject: 'niemiecki_sp7', label: 'Czas wolny i sport', short: 'Czas wolny', pl: 'Freizeit und Sport', icon: '⚽' },
    de7_travel:       { subject: 'niemiecki_sp7', label: 'Podróże', short: 'Podróże', pl: 'Reisen', icon: '✈️' },
    de7_health:       { subject: 'niemiecki_sp7', label: 'Zdrowie', short: 'Zdrowie', pl: 'Gesundheit', icon: '🩺' },
    de7_nature:       { subject: 'niemiecki_sp7', label: 'Przyroda i pogoda', short: 'Przyroda', pl: 'Natur und Wetter', icon: '🌳' },
    de7_grammar:      { subject: 'niemiecki_sp7', label: 'Gramatyka i zwroty', short: 'Gramatyka', pl: 'Grammatik', icon: '🧩' },
    de7_other:        { subject: 'niemiecki_sp7', label: 'Inne', short: 'Inne', pl: 'Sonstiges', icon: '📘' },
    // Informatyka
    inf7_computer:    { subject: 'informatyka_sp7', label: 'Komputer i sieci', short: 'Komputer', pl: 'sprzęt, system, internet', icon: '🖥️' },
    inf7_algorithms:  { subject: 'informatyka_sp7', label: 'Algorytmy', short: 'Algorytmy', pl: 'schematy blokowe, sortowanie', icon: '🧩' },
    inf7_programming: { subject: 'informatyka_sp7', label: 'Programowanie', short: 'Programowanie', pl: 'Scratch, Python', icon: '⌨️' },
    inf7_office:      { subject: 'informatyka_sp7', label: 'Dokumenty i arkusze', short: 'Biuro', pl: 'edytor tekstu, arkusz kalkulacyjny', icon: '📄' },
    inf7_media:       { subject: 'informatyka_sp7', label: 'Grafika i multimedia', short: 'Multimedia', pl: 'grafika, prezentacje, wideo', icon: '🎨' },
    inf7_safety:      { subject: 'informatyka_sp7', label: 'Bezpieczeństwo i prawo', short: 'Bezpieczeństwo', pl: 'cyberbezpieczeństwo, licencje', icon: '🔒' },
    inf7_other:       { subject: 'informatyka_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
    // Edukacja zdrowotna
    ez7_physical:     { subject: 'edukacja_zdrowotna_sp7', label: 'Zdrowie fizyczne', short: 'Fizyczne', pl: 'sen, higiena, profilaktyka', icon: '💪' },
    ez7_activity:     { subject: 'edukacja_zdrowotna_sp7', label: 'Aktywność fizyczna', short: 'Aktywność', pl: 'ruch i wypoczynek', icon: '🏃' },
    ez7_nutrition:    { subject: 'edukacja_zdrowotna_sp7', label: 'Odżywianie', short: 'Odżywianie', pl: 'zdrowa dieta', icon: '🥗' },
    ez7_mental:       { subject: 'edukacja_zdrowotna_sp7', label: 'Zdrowie psychiczne', short: 'Psychiczne', pl: 'emocje, stres', icon: '🧠' },
    ez7_social:       { subject: 'edukacja_zdrowotna_sp7', label: 'Zdrowie społeczne', short: 'Społeczne', pl: 'relacje, komunikacja', icon: '🤝' },
    ez7_puberty:      { subject: 'edukacja_zdrowotna_sp7', label: 'Dojrzewanie', short: 'Dojrzewanie', pl: 'zmiany w okresie dojrzewania', icon: '🌱' },
    ez7_environment:  { subject: 'edukacja_zdrowotna_sp7', label: 'Środowisko i zdrowie', short: 'Środowisko', pl: 'zdrowie środowiskowe', icon: '🌍' },
    ez7_addictions:   { subject: 'edukacja_zdrowotna_sp7', label: 'Uzależnienia i internet', short: 'Uzależnienia', pl: 'profilaktyka, higiena cyfrowa', icon: '📵' },
    ez7_system:       { subject: 'edukacja_zdrowotna_sp7', label: 'Ochrona zdrowia', short: 'Pierwsza pomoc', pl: 'system ochrony zdrowia, pierwsza pomoc', icon: '🚑' },
    ez7_other:        { subject: 'edukacja_zdrowotna_sp7', label: 'Inne', short: 'Inne', pl: 'pozostałe', icon: '📘' },
  };

  const TYPES = {
    replacement: 'Zamiana informal → formal',
    academic_verb: 'Czasownik akademicki',
    awl_word: 'Słowo AWL',
    style_rule: 'Reguła stylu',
    hedging: 'Hedging',
    qa: 'Pytanie i odpowiedź',
    cloze: 'Zdanie z luką',
  };

  // Przedmioty: plik ze słownictwem bazowym, dozwolone typy wpisów, kategoria dla wpisów bez kategorii.
  // lang: język kart (do promptu AI), typeLabels: nazwy typów w tym przedmiocie, gdy inne niż w TYPES.
  const SUBJECTS = {
    academic_english: {
      label: 'Academic English', icon: '🎓', tagline: 'Formalny angielski do Academic Writing', file: 'vocabulary.json', lang: 'en',
      types: ['awl_word', 'replacement', 'academic_verb', 'hedging', 'style_rule', 'qa', 'cloze'], defaultType: 'awl_word', defaultCategory: 'style_rules',
    },
    biology: {
      label: 'Biology', icon: '🧬', tagline: 'Biologia: pojęcia, procesy i fakty', file: 'data/biology.json', lang: 'en',
      types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'bio_general',
    },
    english_sp7: {
      label: 'Angielski', icon: '🔤', tagline: 'Słówka i zwroty z angielskiego', file: 'data/angielski-7.json', lang: 'en-pl', vocab: true,
      types: ['awl_word', 'qa', 'cloze'], defaultType: 'awl_word', defaultCategory: 'en7_other',
      typeLabels: { awl_word: 'Słówko' },
    },
    biologia_sp7: {
      label: 'Biologia', icon: '🫀', tagline: 'Biologia człowieka: pojęcia i procesy', file: 'data/biologia-7.json', lang: 'pl',
      types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'bio7_other',
    },
    // Bez pola file: przedmiot startuje pusty, karty dochodzą z importu AI i materiałów wspólnych.
    math_ib: { label: 'Mathematics', icon: '📐', tagline: 'Pojęcia, wzory i twierdzenia', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'mathib_other' },
    chemistry_ib: { label: 'Chemistry', icon: '🧪', tagline: 'Pojęcia, reakcje i fakty', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'chemib_other' },
    physics_ib: { label: 'Physics', icon: '⚛️', tagline: 'Pojęcia, prawa i jednostki', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'physib_other' },
    history_ib: { label: 'History', icon: '📜', tagline: 'Wydarzenia, daty i pojęcia', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'histib_other' },
    historia_polski_ib: { label: 'History of Poland', icon: '🏰', tagline: 'Historia Polski: daty, postacie, pojęcia', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'hpl_other' },
    geography_ib: { label: 'Geography', icon: '🗺️', tagline: 'Procesy, pojęcia i przykłady', file: 'data/geography.json', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'geoib_other' },
    polski_ib: { label: 'Polish', icon: '📖', tagline: 'Epoki, lektury i pojęcia', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'plib_other' },
    eo_ib: { label: 'Edukacja obywatelska', icon: '⚖️', tagline: 'Państwo, prawo i społeczeństwo', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'eo_other' },
    cs_ib: { label: 'Computer Science', icon: '💻', tagline: 'Pojęcia i algorytmy (od II semestru)', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'csib_other' },
    english_ib: { label: 'English', icon: '🖋️', tagline: 'Literatura i analiza tekstów', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'enib_other' },
    psychology_ib: { label: 'Psychology', icon: '🧠', tagline: 'Elective: podejścia, badania i pojęcia', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'psyib_other' },
    philosophy_ib: { label: 'Philosophy', icon: '🤔', tagline: 'Elective: pojęcia, argumenty i filozofowie', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'phiib_other' },
    business_ib: { label: 'Business & Management', icon: '💼', tagline: 'Elective: pojęcia, modele i przykłady', lang: 'en', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'busib_other' },
    german_ib: {
      label: 'German B', icon: '🥨', tagline: 'Słówka i zwroty z niemieckiego', lang: 'de-pl', vocab: true,
      types: ['awl_word', 'qa', 'cloze'], defaultType: 'awl_word', defaultCategory: 'deib_other', typeLabels: { awl_word: 'Słówko' },
    },
    matematyka_sp7: { label: 'Matematyka', icon: '📐', tagline: 'Pojęcia, wzory i własności', file: 'data/matematyka-7.json', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'mat7_other' },
    fizyka_sp7: { label: 'Fizyka', icon: '⚛️', tagline: 'Wielkości, jednostki i prawa', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'fiz7_other' },
    chemia_sp7: { label: 'Chemia', icon: '🧪', tagline: 'Pierwiastki, wzory i reakcje', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'chem7_other' },
    polski_sp7: { label: 'Polski', icon: '📖', tagline: 'Lektury, gramatyka i pojęcia', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'pol7_other' },
    historia_sp7: { label: 'Historia', icon: '📜', tagline: 'XIX wiek i dwudziestolecie: daty i pojęcia', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'his7_other' },
    geografia_sp7: { label: 'Geografia', icon: '🗺️', tagline: 'Geografia Polski', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'geo7_other' },
    niemiecki_sp7: {
      label: 'Niemiecki', icon: '🥨', tagline: 'Słówka i zwroty z niemieckiego', file: 'data/niemiecki-7.json', lang: 'de-pl', vocab: true,
      types: ['awl_word', 'qa', 'cloze'], defaultType: 'awl_word', defaultCategory: 'de7_other', typeLabels: { awl_word: 'Słówko' },
    },
    informatyka_sp7: { label: 'Informatyka', icon: '💻', tagline: 'Pojęcia, algorytmy i programy', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'inf7_other' },
    edukacja_zdrowotna_sp7: { label: 'Edukacja zdrowotna', icon: '🩺', tagline: 'Zdrowie fizyczne, psychiczne i społeczne', lang: 'pl', types: ['qa', 'cloze'], defaultType: 'qa', defaultCategory: 'ez7_other' },
  };
  // Nazwa języka obcego w poleceniach ćwiczeń ze słówkami („Napisz po …”).
  const inLang = (subject) => ((SUBJECTS[subject] || {}).lang === 'de-pl' ? 'po niemiecku' : 'po angielsku');
  const DEFAULT_SUBJECT = 'academic_english';
  // Karty bazowe wygenerowane z podstawy programowej mają source = PP_SOURCE i pp = numer wymagania (np. „VI.3.2”).
  const PP_SOURCE = 'Podstawa programowa';
  for (const c of Object.values(CATEGORIES)) c.subject = c.subject || DEFAULT_SUBJECT;
  const typeLabel = (type, subject) => ((SUBJECTS[subject] || {}).typeLabels || {})[type] || TYPES[type] || type;

  // Ścieżki nauki: konto widzi tylko przedmioty swojej ścieżki. audience trafia do promptu AI.
  const LEVELS = {
    // Przedmioty z planów lekcji. Pierwsze są te z kartami bazowymi (pierwszy to domyślny przedmiot ścieżki),
    // dalej przedmioty, które zapełniają się z importu AI.
    ib: {
      label: 'IB Pre-DP',
      // Electives idą trymestrami: teraz Psychology; philosophy_ib i business_ib dopisać, gdy się zaczną.
      subjects: ['academic_english', 'biology', 'english_ib', 'math_ib', 'chemistry_ib', 'physics_ib', 'history_ib', 'historia_polski_ib',
        'geography_ib', 'polski_ib', 'german_ib', 'eo_ib', 'cs_ib', 'psychology_ib'],
      audience: 'uczeń IB Pre-DP (materiały po angielsku)',
    },
    sp7: {
      label: '7 klasa szkoły podstawowej',
      subjects: ['english_sp7', 'biologia_sp7', 'matematyka_sp7', 'polski_sp7', 'niemiecki_sp7', 'chemia_sp7', 'fizyka_sp7',
        'historia_sp7', 'geografia_sp7', 'informatyka_sp7', 'edukacja_zdrowotna_sp7'],
      audience: 'uczeń 7 klasy polskiej szkoły podstawowej (podstawa programowa)',
    },
  };
  const DEFAULT_LEVEL = 'ib';

  const FUNCTION_LABELS = {
    claim: 'Twierdzenie (claim)',
    agreement: 'Zgoda (agreement)',
    disagreement: 'Niezgoda / kwestionowanie',
    recommendation: 'Rekomendacja',
  };
  const FUNCTION_Q = {
    claim: 'formułowania twierdzenia (claim)',
    agreement: 'wyrażania zgody',
    disagreement: 'kwestionowania lub wyrażania niezgody',
    recommendation: 'wyrażania rekomendacji',
  };

  // Techniki hedgingu: nazwa angielska (jak w materiałach IB), polska i przykładowe słowa.
  const TECHNIQUE_DEFS = {
    removing_questions: { en: 'Removing rhetorical questions', pl: 'usuwanie pytań retorycznych' },
    modal_verbs: { en: 'Modal verbs', pl: 'czasowniki modalne', ex: 'may, might, could' },
    adverbs: { en: 'Adverbs', pl: 'przysłówki', ex: 'arguably, generally, possibly' },
    impersonal_constructions: { en: 'Impersonal constructions', pl: 'konstrukcje bezosobowe', ex: 'It is believed that…' },
    tentative_verbs: { en: 'Tentative verbs', pl: 'czasowniki osłabiające', ex: 'seem, appear, tend, suggest' },
    probability: { en: 'Probability expressions', pl: 'wyrażenia prawdopodobieństwa', ex: 'likely, possible' },
  };
  const TECHNIQUES = Object.fromEntries(Object.entries(TECHNIQUE_DEFS).map(([k, d]) =>
    [k, `${d.en} — ${d.pl}${d.ex ? ` (${d.ex})` : ''}`]));

  const DIFFICULTY = { 1: 'Podstawowy', 2: 'Średni', 3: 'Zaawansowany' };

  const EXERCISES = {
    mix: 'Mix',
    flashcard: 'Fiszki',
    mc: 'Quiz',
    typing: 'Wpisywanie',
    matching: 'Dopasowywanie',
    gap: 'Luki',
  };

  const STATUS_LABELS = { new: 'Nowe', learning: 'W nauce', mastered: 'Opanowane' };

  // Krótka odpowiedź = da się ją wpisać z pamięci i ułożyć z niej pary.
  const isShort = (s) => !!s && String(s).length <= 40 && String(s).trim().split(/\s+/).length <= 4;

  // Warianty ćwiczenia "dopasuj pary".
  const MATCH = {
    inf_formal: {
      label: 'Nieformalne → formalne',
      filter: (i) => i.type === 'replacement',
      left: (i) => i.informal, right: (i) => i.formal[0],
    },
    phrasal: {
      label: 'Phrasal verb → formalny odpowiednik',
      filter: (i) => i.type === 'replacement' && i.category === 'phrasal_verbs',
      left: (i) => i.informal, right: (i) => i.formal[0],
    },
    verb_function: {
      label: 'Czasownik → jego funkcja',
      filter: (i) => i.type === 'academic_verb',
      left: (i) => i.word, right: (i) => FUNCTION_LABELS[i.function],
    },
    en_pl: {
      label: 'Słówko → polski',
      filter: (i) => (i.type === 'awl_word' || i.type === 'academic_verb') && i.polish.length > 0,
      left: (i) => i.word, right: (i) => i.polish[0],
    },
    qa_pairs: {
      label: 'Odpowiedź → pytanie',
      filter: (i) => i.type === 'qa' && isShort(i.answer) && i.question.length <= 110,
      left: (i) => i.answer, right: (i) => i.question,
    },
  };

  // ===================================================================
  // Narzędzia
  // ===================================================================
  function h(tag, props, ...children) {
    const el = document.createElement(tag);
    let value;
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'value') value = v;
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (typeof v === 'boolean') el[k] = v;
        else el.setAttribute(k, v);
      }
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : String(c));
    }
    if (value !== undefined) el.value = value;
    return el;
  }

  // append() bez null/false (natywne append zamienia null na tekst "null")
  const put = (root, ...kids) => root.append(...kids.flat(Infinity).filter((k) => k != null && k !== false));

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const uniq = (arr) => [...new Set(arr)];
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function weightedPick(weights) {
    const entries = Object.entries(weights).filter(([, w]) => w > 0);
    let r = Math.random() * entries.reduce((s, [, w]) => s + w, 0);
    for (const [k, w] of entries) { if ((r -= w) < 0) return k; }
    return entries[entries.length - 1][0];
  }

  function dayStr(d = new Date()) {
    const z = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  }
  function addDays(str, n) {
    const [y, m, d] = str.split('-').map(Number);
    return dayStr(new Date(y, m - 1, d + n));
  }
  const today = () => dayStr();

  function plural(n, one, few, many) {
    if (n === 1) return one;
    const d = n % 10, t = n % 100;
    return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ===================================================================
  // Stan i zapis (localStorage)
  // ===================================================================
  function defaultState() {
    return {
      version: 1,
      progress: {},       // id -> { ef, interval, reps, due, attempts, correct, hist[], last }
      daily: {},          // 'YYYY-MM-DD' -> { answers, newItems }
      customItems: [],    // własne materiały dodane w aplikacji (id z prefiksem "c-")
      deletedCustom: {},  // id -> czas usunięcia (tombstones, żeby synchronizacja nie przywracała usuniętych)
      settings: {
        theme: 'system',
        name: '',
        level: null,      // ścieżka nauki (LEVELS); null = nowe konto, pytamy przy starcie
        subject: DEFAULT_SUBJECT,
        newPerDay: 10,
        sessionSize: 12,
        lastConfig: { mode: 'quick', category: 'all', difficulty: 'all', exercise: 'mix' },
      },
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const s = JSON.parse(raw);
      const settings = { ...base.settings, ...(s.settings || {}), lastConfig: { ...base.settings.lastConfig, ...((s.settings || {}).lastConfig || {}) } };
      // Stan sprzed ścieżek należał do ucznia IB.
      if (!settings.level && Object.keys(s.progress || {}).length) settings.level = DEFAULT_LEVEL;
      return {
        ...base, ...s,
        settings,
        progress: s.progress || {},
        daily: s.daily || {},
        customItems: s.customItems || [],
        deletedCustom: s.deletedCustom || {},
      };
    } catch (e) {
      return base;
    }
  }

  let state = loadState();

  // Odcisk ustawień (bez motywu, który jest per urządzenie) — wykrywa zmianę ustawień do synchronizacji.
  const settingsFp = () => JSON.stringify({ ...state.settings, theme: null });
  let lastSettingsFp = settingsFp();

  function saveLocal() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { toast('Nie udało się zapisać postępu (pamięć przeglądarki niedostępna).'); }
  }
  function save() {
    const fp = settingsFp();
    if (fp !== lastSettingsFp) { state.settingsTs = Date.now(); lastSettingsFp = fp; }
    saveLocal();
    scheduleSync();
  }

  function dayLog(d = today()) {
    return (state.daily[d] = state.daily[d] || { answers: 0, newItems: 0 });
  }

  // Nowe słowa dnia per przedmiot (limit liczony osobno). Dni sprzed podziału liczą się jako Academic English.
  function newCount(log, subject) {
    if (log.newBy) return log.newBy[subject] || 0;
    return subject === DEFAULT_SUBJECT ? log.newItems || 0 : 0;
  }
  function addNew(log, subject) {
    if (!log.newBy) log.newBy = { [DEFAULT_SUBJECT]: log.newItems || 0 };
    log.newBy[subject] = (log.newBy[subject] || 0) + 1;
    log.newItems++;
  }

  const currentLevel = () => (LEVELS[state.settings.level] ? state.settings.level : DEFAULT_LEVEL);
  const levelSubjects = () => LEVELS[currentLevel()].subjects;
  const currentSubject = () => (levelSubjects().includes(state.settings.subject) ? state.settings.subject : levelSubjects()[0]);
  const subjectOf = (raw) => (raw.subject && SUBJECTS[raw.subject] ? raw.subject
    : CATEGORIES[raw.category] ? CATEGORIES[raw.category].subject : DEFAULT_SUBJECT);
  const catsOf = (subject) => Object.entries(CATEGORIES).filter(([, c]) => c.subject === subject);
  const catOf = (key, subject) => (CATEGORIES[key] && CATEGORIES[key].subject === subject ? CATEGORIES[key] : null);
  // Kategoria dla wpisu bez kategorii: domyślna dla typu (jeśli należy do przedmiotu), inaczej domyślna przedmiotu.
  const defaultCat = (type, subject) => (catOf(TYPE_CATEGORY[type], subject) ? TYPE_CATEGORY[type] : SUBJECTS[subject].defaultCategory);

  function applyTheme() {
    const t = state.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
    const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#171c27' : '#16a34a');
  }

  // ===================================================================
  // Słownictwo
  // ===================================================================
  let VOCAB = [];
  let VOCAB_META = {};
  const BY_ID = new Map();

  const toArr = (v) => (Array.isArray(v) ? v : v ? [v] : []).map(String).filter(Boolean);

  // Bez znaków diakrytycznych: ą→a, ż→z, ł→l (NFD nie rozkłada „ł”).
  const fold = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L');

  // Porównywanie odpowiedzi: małe litery, bez interpunkcji i bez polskich znaków („żołądek” = „zoladek”).
  function norm(s) {
    return fold(String(s).toLowerCase())
      .replace(/[’‘`]/g, "'")
      .replace(/[^a-z0-9'\- ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  // Jak norm(), ale z zachowaniem liter spoza a–z — odróżnia „zoladek” od „żołądek”.
  function normStrict(s) {
    return String(s).toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/[^\p{L}\p{N}'\- ]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  // Wyszukiwanie: wielkość liter i polskie znaki bez znaczenia.
  const searchKey = (s) => fold(String(s).toLowerCase());
  const words = (s) => norm(s).split(' ').filter(Boolean);

  // Część formalnego wariantu, która faktycznie się różni ("Research demonstrates" vs "Research shows" -> "demonstrates").
  function coreOf(formal, informal) {
    const f = words(formal), i = words(informal);
    let a = 0;
    while (a < f.length && a < i.length && f[a] === i[a]) a++;
    let b = 0;
    while (b < f.length - a && b < i.length - a && f[f.length - 1 - b] === i[i.length - 1 - b]) b++;
    if (a === 0 && b === 0) return null;
    const core = f.slice(a, f.length - b);
    return core.length ? core.join(' ') : null;
  }

  // Szuka w zdaniu wyrażenia do ukrycia (dokładnie, potem po rdzeniu słowa: analyse -> analysed).
  function findGap(sentence, candidates) {
    if (!sentence) return null;
    const split = (m) => ({ before: sentence.slice(0, m.index), hidden: m[0], after: sentence.slice(m.index + m[0].length) });
    for (const c of candidates) {
      const m = sentence.match(new RegExp(`(?<!\\p{L})${escRe(c)}(?!\\p{L})`, 'iu'));
      if (m) return split(m);
    }
    for (const c of candidates) {
      if (/\s/.test(c)) continue;
      let stem = c.toLowerCase();
      if (stem.length >= 4 && /[ey]$/.test(stem)) stem = stem.slice(0, -1);
      const m = sentence.match(new RegExp(`(?<!\\p{L})${escRe(stem)}\\p{L}*`, 'iu'));
      if (m) return split(m);
    }
    return null;
  }

  // Domyślna kategoria, gdy wpis jej nie podaje.
  const TYPE_CATEGORY = { replacement: 'informal_phrases', academic_verb: 'academic_verbs', awl_word: 'awl', style_rule: 'style_rules', hedging: 'hedging' };

  // Pola wpisów wg typu (formularz, wklejanie, walidacja). list: separator kilku wartości.
  const FIELDS = {
    replacement: [
      { key: 'informal', label: 'Wyrażenie nieformalne', req: true, ph: 'find out' },
      { key: 'formal', label: 'Formalne odpowiedniki', req: true, list: '/', hint: 'kilka oddziel „/”', ph: 'investigate / determine' },
      { key: 'polish', label: 'Po polsku', list: ',', hint: 'kilka oddziel przecinkiem', ph: 'zbadać, ustalić' },
      { key: 'example_informal', label: 'Przykład nieformalny', ph: 'We need to find out what happened.' },
      { key: 'example_formal', label: 'Przykład formalny', ph: 'Further research is needed to determine the cause.' },
    ],
    academic_verb: [
      { key: 'word', label: 'Czasownik', req: true, ph: 'advocate' },
      { key: 'polish', label: 'Po polsku', list: ',', hint: 'kilka oddziel przecinkiem', ph: 'popierać' },
      { key: 'function', label: 'Funkcja', req: true, options: FUNCTION_LABELS },
      { key: 'example', label: 'Zdanie przykładowe', ph: 'Several researchers advocate a more cautious approach.' },
    ],
    awl_word: [
      { key: 'word', label: 'Słowo', req: true, ph: 'significant' },
      { key: 'polish', label: 'Po polsku', list: ',', hint: 'kilka oddziel przecinkiem', ph: 'istotny, znaczący' },
      { key: 'example', label: 'Zdanie przykładowe', ph: 'The results were statistically significant.' },
      { key: 'awl_group', label: 'Grupa AWL', num: true, hint: '1–10, opcjonalnie', ph: '1', only: DEFAULT_SUBJECT },
    ],
    hedging: [
      { key: 'informal', label: 'Zdanie zbyt pewne', req: true, ph: 'This proves that…' },
      { key: 'formal', label: 'Wersja ostrożna (hedging)', req: true, ph: 'This may indicate that…' },
      { key: 'technique', label: 'Technika', req: true, options: TECHNIQUES },
      { key: 'polish', label: 'Opis po polsku', ph: 'Czasowniki modalne' },
    ],
    style_rule: [
      { key: 'rule', label: 'Reguła', req: true, ph: 'Nie dziel bezokoliczników' },
      { key: 'incorrect', label: 'Błędnie', req: true, ph: 'I was told to always keep a good look out.' },
      { key: 'correct', label: 'Poprawnie', req: true, ph: 'I was always told to keep a good look out.' },
    ],
    qa: [
      { key: 'question', label: 'Pytanie', req: true, ph: 'Which organelle is the site of aerobic respiration?' },
      { key: 'answer', label: 'Odpowiedź', req: true, hint: 'najlepiej 1–4 słowa', ph: 'mitochondrion' },
      { key: 'accept', label: 'Inne poprawne odpowiedzi', list: '/', hint: 'kilka oddziel „/”', ph: 'mitochondria' },
      { key: 'explanation', label: 'Wyjaśnienie', ph: 'Aerobic respiration produces most of the cell’s ATP in the mitochondria.' },
    ],
    cloze: [
      { key: 'text', label: 'Zdanie z luką', req: true, hint: 'lukę zapisz w {{…}}, warianty oddziel „/”', ph: 'Enzymes lower the {{activation energy}} of a reaction.' },
      { key: 'hint', label: 'Podpowiedź', ph: 'energy' },
      { key: 'explanation', label: 'Wyjaśnienie', ph: 'The enzyme stabilises the transition state.' },
    ],
  };

  const CLOZE_RE = /\{\{([^{}]+)\}\}/;
  const CLOZE_RE_G = /\{\{([^{}]+)\}\}/g;

  const filled = (v) => (Array.isArray(v) ? v.some((x) => String(x).trim()) : v != null && String(v).trim() !== '');

  // Walidacja wpisu (wspólna dla vocabulary.json i własnych materiałów). Pusta lista = wpis poprawny.
  function itemErrors(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return ['Wpis nie jest obiektem JSON'];
    if (!filled(raw.type)) return ['Brak pola type'];
    if (!TYPES[raw.type]) return [`Nieznany typ „${raw.type}”`];
    const errs = [];
    if (filled(raw.subject) && !SUBJECTS[raw.subject]) return [`Nieznany przedmiot „${raw.subject}”`];
    const subject = subjectOf(raw);
    const subj = SUBJECTS[subject];
    if (!subj.types.includes(raw.type)) errs.push(`Typ „${raw.type}” nie jest dostępny w przedmiocie ${subj.label}`);
    if (filled(raw.category) && !CATEGORIES[raw.category]) errs.push(`Nieznana kategoria „${raw.category}”`);
    else if (filled(raw.category) && !catOf(raw.category, subject)) errs.push(`Kategoria „${raw.category}” nie należy do przedmiotu ${subj.label}`);
    for (const f of FIELDS[raw.type]) {
      if (f.req && !filled(raw[f.key])) errs.push(`Brak pola ${f.key} (${f.label.toLowerCase()})`);
      else if (f.options && filled(raw[f.key]) && !f.options[raw[f.key]]) errs.push(`Nieznana wartość ${f.key}: „${raw[f.key]}”`);
    }
    if (raw.type === 'cloze' && filled(raw.text) && !CLOZE_RE.test(raw.text)) errs.push('W zdaniu brakuje luki w podwójnych klamrach {{…}}');
    return errs;
  }

  function prepareItem(raw) {
    if (!raw || !raw.id || itemErrors(raw).length) return null;
    const it = { ...raw, difficulty: Math.min(3, Math.max(1, Number(raw.difficulty) || 1)) };
    it.subject = subjectOf(raw);
    if (!catOf(it.category, it.subject)) it.category = defaultCat(it.type, it.subject);
    it._shared = String(it.id).startsWith('s-');                 // wspólne: widoczne dla wszystkich
    it._custom = it._shared || String(it.id).startsWith('c-');  // dodane w aplikacji (prywatne lub wspólne)
    it._pp = it.source === PP_SOURCE;                            // karta bazowa z podstawy programowej (pole pp = numer wymagania)
    switch (it.type) {
      case 'qa':
        it.question = String(it.question).trim();
        it.answer = String(it.answer).trim();
        it.accept = toArr(it.accept);
        it._answers = uniq([it.answer, ...it.accept]);
        it._mc = isShort(it.answer) ? it.answer : null; // długie odpowiedzi byłyby w quizie oczywiste
        it._gap = null;
        it._label = it.question;
        it._answer = it.answer;
        break;
      case 'cloze': {
        // Pierwsza luka jest ukryta, pozostałe {{…}} pokazujemy jako zwykły tekst.
        const m = it.text.match(CLOZE_RE);
        const plain = (s) => s.replace(CLOZE_RE_G, (_, x) => x.split('/')[0].trim());
        const alts = m[1].split('/').map((x) => x.trim()).filter(Boolean);
        if (!alts.length) return null;
        it._gap = { before: plain(it.text.slice(0, m.index)), hidden: alts[0], after: plain(it.text.slice(m.index + m[0].length)) };
        it._answers = alts;
        it._mc = alts[0];
        it._label = `${it._gap.before}___${it._gap.after}`;
        it._answer = alts.join(' / ');
        break;
      }
      case 'replacement': {
        it.formal = toArr(it.formal);
        it.polish = toArr(it.polish);
        const cores = it.formal.map((f) => coreOf(f, it.informal)).filter(Boolean);
        it._answers = uniq([...it.formal, ...cores]);
        it._gap = findGap(it.example_formal, uniq([...it.formal, ...cores]));
        it._label = it.informal;
        it._answer = it.formal.join(' / ');
        break;
      }
      case 'academic_verb':
      case 'awl_word':
        it.polish = toArr(it.polish);
        it._answers = [it.word];
        it._gap = it.polish.length ? findGap(it.example, [it.word]) : null;
        it._label = it.word;
        it._answer = it.polish.join(', ') || '—';
        break;
      case 'style_rule':
        it._label = it.incorrect;
        it._answer = it.correct;
        it._gap = null;
        break;
      case 'hedging':
        it._label = it.informal;
        it._answer = it.formal;
        it._gap = null;
        break;
    }
    it._search = [it.informal, it.word, it.rule, it.incorrect, it.correct, it.example, it.example_formal,
      it.question, it.answer, it.explanation, it.hint, it.type === 'cloze' ? it.text.replace(CLOZE_RE_G, '$1') : null, ...(it.accept || []),
      ...(Array.isArray(it.formal) ? it.formal : [it.formal]), ...(Array.isArray(it.polish) ? it.polish : [it.polish])]
      .filter(Boolean).map(searchKey).join(' ');
    return it;
  }

  let BASE_ITEMS = [];
  let SHARED = (() => { try { return JSON.parse(localStorage.getItem(SHARED_KEY) || '[]'); } catch (e) { return []; } })();

  // Pliki wszystkich przedmiotów. Bez słownictwa domyślnego przedmiotu aplikacja nie startuje,
  // brak pliku innego przedmiotu (np. offline przed pierwszym pobraniem) daje tylko pusty przedmiot.
  async function loadVocab() {
    const loaded = await Promise.all(Object.entries(SUBJECTS).map(async ([key, subj]) => {
      if (!subj.file) return { key, items: [], meta: {} };
      try {
        const res = await fetch(subj.file, { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const items = (Array.isArray(data) ? data : data.items || []).map((it) => (it.subject ? it : { ...it, subject: key }));
        return { key, items, meta: Array.isArray(data) ? {} : data };
      } catch (e) {
        if (key === DEFAULT_SUBJECT) throw e;
        return { key, items: [], meta: {} };
      }
    }));
    BASE_ITEMS = loaded.flatMap((l) => l.items);
    VOCAB_META = loaded.find((l) => l.key === DEFAULT_SUBJECT).meta;
    rebuildVocab();
  }

  // Ile wpisów ma tekst do quizu (pytania/luki) w danym przedmiocie — quiz potrzebuje 3 dystraktorów.
  const MC_POOL = new Map();

  // Scala słownik z własnymi materiałami — wołane też po dodaniu/usunięciu i po synchronizacji.
  function rebuildVocab() {
    const gone = state.deletedCustom || {};
    VOCAB = [...BASE_ITEMS, ...state.customItems, ...SHARED].filter((c) => !gone[c.id]).map(prepareItem).filter(Boolean);
    BY_ID.clear();
    MC_POOL.clear();
    for (const it of VOCAB) {
      BY_ID.set(it.id, it);
      if (it._mc) MC_POOL.set(it.subject, (MC_POOL.get(it.subject) || 0) + 1);
    }
  }

  const subjectPool = (subject = currentSubject()) => VOCAB.filter((it) => it.subject === subject);
  // Filtr „pp” w kategoriach (Dziś, Własna sesja, Karty): karty z podstawy programowej; „custom”: dodane materiały.
  const inCat = (it, cat) => cat === 'all' || it.category === cat || (cat === 'custom' && it._custom) || (cat === 'pp' && it._pp);

  // ===================================================================
  // Postęp i powtórki (SM-2)
  // ===================================================================
  // progress: domyślnie własny; widok rodzica liczy status z postępu dziecka.
  function statusOf(it, progress = state.progress) {
    const p = progress[it.id];
    if (!p || !p.hist || !p.hist.length) return 'new';
    const acc = p.hist.reduce((s, x) => s + x, 0) / p.hist.length;
    if (acc > 0.9 && p.hist.length >= 3) return 'mastered';
    if (acc >= 0.6) return 'learning';
    return 'new';
  }

  // quality: 0–5 (SM-2). <3 = błędna odpowiedź.
  function record(it, correct, quality) {
    const t = today();
    let p = state.progress[it.id];
    const log = dayLog(t);
    if (!p) {
      p = state.progress[it.id] = { ef: 2.5, interval: 0, reps: 0, due: t, attempts: 0, correct: 0, hist: [] };
      addNew(log, it.subject);
    }
    p.attempts++;
    if (correct) p.correct++;
    p.hist = [...p.hist, correct ? 1 : 0].slice(-10);
    p.last = t;
    p.ts = Date.now();
    log.answers++;

    const q = Math.max(0, Math.min(5, quality));
    if (q < 3) {
      p.reps = 0;
      p.interval = 1;
    } else {
      p.reps++;
      p.interval = p.reps === 1 ? 1 : p.reps === 2 ? 6 : Math.round(p.interval * p.ef);
    }
    p.ef = Math.max(1.3, p.ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    p.due = addDays(t, p.interval);
    save();
  }

  const isDue = (it) => { const p = state.progress[it.id]; return !!p && p.due <= today(); };

  function srsCounts(pool = subjectPool(), subject = currentSubject()) {
    const due = pool.filter(isDue).length;
    const newLeft = Math.max(0, state.settings.newPerDay - newCount(dayLog(), subject));
    const unseen = pool.filter((it) => !state.progress[it.id]).length;
    return { due, newToday: Math.min(newLeft, unseen) };
  }

  function streak(daily = state.daily) {
    let n = 0;
    let d = today();
    if (!(daily[d] && daily[d].answers)) d = addDays(d, -1);
    while (daily[d] && daily[d].answers) { n++; d = addDays(d, -1); }
    return n;
  }

  // ===================================================================
  // Budowanie sesji
  // ===================================================================
  function filterPool(cfg) {
    return subjectPool().filter((it) =>
      inCat(it, cfg.category) &&
      (cfg.difficulty === 'all' || String(it.difficulty) === String(cfg.difficulty)));
  }

  function quickItems(pool, size) {
    // losowo, ale opanowane słowa trafiają do sesji dopiero na końcu
    const mastered = (it) => (statusOf(it) === 'mastered' ? 1 : 0);
    return shuffle(pool)
      .map((it, i) => ({ it, m: mastered(it), i }))
      .sort((a, b) => a.m - b.m || a.i - b.i)
      .slice(0, size)
      .map((x) => x.it);
  }

  function srsItems(pool) {
    const due = pool.filter(isDue).sort((a, b) => state.progress[a.id].due.localeCompare(state.progress[b.id].due)).slice(0, 30);
    const { newToday } = srsCounts(pool);
    // własne materiały (najnowsze najpierw) wchodzą jako nowe przed resztą słownika
    const fresh = pool.filter((it) => !state.progress[it.id])
      .sort((a, b) => b._custom - a._custom || String(b.addedAt || '').localeCompare(String(a.addedAt || '')) ||
        a.difficulty - b.difficulty || (a.awl_group || 0) - (b.awl_group || 0))
      .slice(0, newToday);
    return shuffle([...due, ...fresh]);
  }

  function eligible(kind, it) {
    switch (kind) {
      case 'flashcard': return true;
      case 'mc':
        if (it.type === 'qa' || it.type === 'cloze') return !!it._mc && (MC_POOL.get(it.subject) || 0) >= 4;
        if (it.type === 'style_rule') return false;
        if (it.type === 'awl_word') return it.polish.length > 0;
        return true;
      case 'typing':
        if (it.type === 'replacement') return true;
        if (it.type === 'qa') return isShort(it.answer);
        return (it.type === 'academic_verb' || it.type === 'awl_word') && it.polish.length > 0;
      case 'gap': return !!it._gap;
      default: return false;
    }
  }

  function chooseKind(it, exercise) {
    const kinds = exercise === 'mix' || exercise === 'matching' ? ['flashcard', 'mc', 'typing', 'gap'] : [exercise];
    const ok = kinds.filter((k) => eligible(k, it));
    // zdanie z luką to też wpisywanie
    if (!ok.length && exercise === 'typing' && eligible('gap', it)) return 'gap';
    if (!ok.length) return eligible('mc', it) ? 'mc' : 'flashcard';
    if (ok.length === 1) return ok[0];
    const fresh = !state.progress[it.id];
    const w = fresh ? { flashcard: 3, mc: 3, typing: 1, gap: 1 } : { flashcard: 1, mc: 3, typing: 2, gap: 2 };
    const weights = {};
    for (const k of ok) weights[k] = w[k];
    return weightedPick(weights);
  }

  function preferredVariant(it) {
    if (it.type === 'replacement') return it.category === 'phrasal_verbs' ? 'phrasal' : 'inf_formal';
    if (it.type === 'academic_verb') return 'verb_function';
    if (it.type === 'awl_word' && it.polish.length) return 'en_pl';
    if (MATCH.qa_pairs.filter(it)) return 'qa_pairs';
    return null;
  }

  function buildSteps(items, exercise, pool) {
    const steps = [];
    let rest = items.slice();

    if (exercise === 'matching') {
      const buckets = {};
      for (const it of rest) {
        const v = preferredVariant(it);
        if (v) (buckets[v] = buckets[v] || []).push(it);
        else steps.push({ kind: chooseKind(it, 'mix'), items: [it] });
      }
      for (const [variant, list] of Object.entries(buckets)) {
        for (let i = 0; i < list.length; i += 6) {
          let chunk = list.slice(i, i + 6);
          if (chunk.length < 4) {
            // dopełnij parami spoza sesji, żeby było co dopasowywać
            const extra = shuffle(pool.filter((o) => MATCH[variant].filter(o) && !items.includes(o))).slice(0, 4 - chunk.length);
            chunk = chunk.concat(extra);
          }
          if (chunk.length < 2) { chunk.forEach((it) => steps.push({ kind: chooseKind(it, 'mix'), items: [it] })); continue; }
          const v = variant === 'verb_function' && Math.random() < 0.4 ? 'en_pl' : variant;
          steps.push({ kind: 'matching', variant: v, items: chunk });
        }
      }
      return shuffle(steps);
    }

    if (exercise === 'mix' && rest.length >= 8) {
      for (const variant of shuffle(Object.keys(MATCH))) {
        const cand = rest.filter(MATCH[variant].filter);
        if (cand.length >= 5) {
          const chunk = shuffle(cand).slice(0, 5);
          rest = rest.filter((it) => !chunk.includes(it));
          steps.push({ kind: 'matching', variant, items: chunk });
          break;
        }
      }
    }
    for (const it of rest) steps.push({ kind: chooseKind(it, exercise), items: [it] });
    const shuffled = shuffle(steps);
    // dopasowywanie nie na sam początek
    const mi = shuffled.findIndex((s) => s.kind === 'matching');
    if (mi === 0 && shuffled.length > 2) shuffled.splice(2, 0, shuffled.shift());
    return shuffled;
  }

  let session = null;
  let lastSummary = null;

  function startSession(cfg) {
    const pool = filterPool(cfg);
    let items;
    if (cfg.items) items = cfg.items.filter((it) => BY_ID.get(it.id) === it); // bez wpisów usuniętych w międzyczasie
    else if (cfg.mode === 'srs') items = srsItems(pool);
    else items = quickItems(pool, cfg.size || state.settings.sessionSize);
    if (!items.length) {
      toast(cfg.mode === 'srs' ? 'Na dziś nie ma nic do powtórki 🎉' : 'Brak słów dla wybranych filtrów.');
      return;
    }
    session = {
      cfg,
      steps: buildSteps(items, cfg.exercise || 'mix', pool),
      index: 0,
      results: [],
      requeued: new Set(),
    };
    if (location.hash === '#/session') route(); else location.hash = '#/session';
  }

  // ===================================================================
  // Ćwiczenia — wspólne
  // ===================================================================
  const OK_TITLES = ['Świetnie!', 'Dobrze!', 'Brawo!', 'Tak jest!', 'Super!'];

  function kindLabel(text) { return h('div', { class: 'step-kind' }, text); }

  function exampleBlock(it) {
    if (it.type === 'replacement') return it.example_formal;
    if (it.type === 'academic_verb' || it.type === 'awl_word') return it.example;
    if (it.type === 'hedging') return it.formal;
    if (it.type === 'qa') return it.explanation || '';
    if (it.type === 'cloze') return [`${it._gap.before}${it._gap.hidden}${it._gap.after}`, it.explanation].filter(Boolean).join(' — ');
    return '';
  }

  function checkTyped(input, accepted) {
    const n = norm(input);
    if (!n) return { ok: false };
    let best = null;
    for (const a of accepted) {
      const na = norm(a);
      // ta sama odpowiedź, ale bez polskich znaków (np. „zoladek”) — zaliczona, z przypomnieniem
      if (n === na) return normStrict(input) === normStrict(a) ? { ok: true, exact: true, match: a } : { ok: true, exact: false, accents: true, match: a };
      const tol = na.length <= 3 ? 0 : na.length <= 6 ? 1 : 2; // max 2 literówki
      const d = levenshtein(n, na);
      if (d <= tol && (!best || d < best.d)) best = { d, a };
    }
    return best ? { ok: true, exact: false, match: best.a } : { ok: false };
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  // Dystraktory: najpierw ta sama kategoria, potem reszta tego samego typu.
  function distractors(it, getText, filterFn, exclude, n = 3) {
    const excl = new Set(exclude.map((x) => String(x).toLowerCase()));
    const cands = VOCAB.filter((o) => o !== it && o.subject === it.subject && filterFn(o));
    const same = shuffle(cands.filter((o) => o.category === it.category && (!it.awl_group || Math.abs((o.awl_group || 0) - it.awl_group) <= 2)));
    const other = shuffle(cands);
    const out = [];
    for (const o of [...same, ...other]) {
      const t = getText(o);
      if (!t) continue;
      const k = t.toLowerCase();
      if (excl.has(k)) continue;
      excl.add(k);
      out.push(t);
      if (out.length === n) break;
    }
    return out;
  }

  function buildMC(it) {
    const opts = (correct, wrong) => shuffle([{ text: correct, correct: true }, ...wrong.map((t) => ({ text: t, correct: false }))]);
    if (it.type === 'replacement') {
      const dir = it.polish.length ? weightedPick({ inf_formal: 2, formal_pl: 1, pl_formal: 1 }) : 'inf_formal';
      const sameType = (o) => o.type === 'replacement';
      if (dir === 'formal_pl') {
        return { instruction: 'Co to znaczy po polsku?', prompt: pick(it.formal), answer: it.polish[0],
          options: opts(it.polish[0], distractors(it, (o) => o.polish[0], sameType, it.polish)) };
      }
      if (dir === 'pl_formal') {
        return { instruction: 'Jak to napisać formalnie po angielsku?', prompt: it.polish.join(', '), answer: it.formal[0],
          options: opts(it.formal[0], distractors(it, (o) => o.formal[0], sameType, it.formal)) };
      }
      const correct = pick(it.formal);
      return { instruction: 'Wybierz formalny odpowiednik', prompt: it.informal, context: it.example_informal, answer: correct,
        options: opts(correct, distractors(it, (o) => o.formal[0], sameType, it.formal)) };
    }
    if (it.type === 'academic_verb') {
      const dir = it.polish.length ? weightedPick({ fn: 2, en_pl: 1, pl_en: 1 }) : 'fn';
      if (dir === 'fn') {
        return { instruction: 'Wybierz czasownik', prompt: `Który czasownik służy do ${FUNCTION_Q[it.function]}?`, sentence: true, answer: it.word,
          options: opts(it.word, distractors(it, (o) => o.word, (o) => o.type === 'academic_verb' && o.function !== it.function, [it.word])) };
      }
      const sameType = (o) => o.type === 'academic_verb';
      if (dir === 'en_pl') {
        return { instruction: 'Co to znaczy po polsku?', prompt: it.word, context: it.example, answer: it.polish[0],
          options: opts(it.polish[0], distractors(it, (o) => o.polish[0], sameType, it.polish)) };
      }
      return { instruction: 'Który czasownik to oznacza?', prompt: it.polish.join(', '), answer: it.word,
        options: opts(it.word, distractors(it, (o) => o.word, sameType, [it.word])) };
    }
    if (it.type === 'awl_word') {
      const sameType = (o) => o.type === 'awl_word' && o.polish.length > 0;
      if (Math.random() < 0.5) {
        return { instruction: 'Co to znaczy po polsku?', prompt: it.word, context: it.example, answer: it.polish[0],
          options: opts(it.polish[0], distractors(it, (o) => o.polish[0], sameType, it.polish)) };
      }
      return { instruction: it.subject === DEFAULT_SUBJECT ? 'Które słowo AWL to oznacza?' : `Jak to jest ${inLang(it.subject)}?`, prompt: it.polish.join(', '), answer: it.word,
        options: opts(it.word, distractors(it, (o) => o.word, sameType, [it.word])) };
    }
    if (it.type === 'qa' || it.type === 'cloze') {
      // dystraktory: odpowiedzi z innych pytań i luk tego przedmiotu (najpierw z tej samej kategorii)
      const wrong = distractors(it, (o) => o._mc, (o) => !!o._mc, it._answers);
      return it.type === 'qa'
        ? { instruction: 'Wybierz poprawną odpowiedź', prompt: it.question, sentence: true, answer: it.answer, options: opts(it.answer, wrong) }
        : { instruction: 'Czego brakuje w zdaniu?', prompt: it._label, sentence: true, context: it.hint ? `Podpowiedź: ${it.hint}` : null,
          answer: it._gap.hidden, options: opts(it._gap.hidden, wrong) };
    }
    if (it.type === 'hedging') {
      const correct = TECHNIQUES[it.technique] || it.technique;
      return { instruction: 'Jaką technikę hedgingu zastosowano?', prompt: `„${it.informal}”`, sentence: true,
        context: `→ „${it.formal}”`, answer: correct,
        options: opts(correct, shuffle(Object.values(TECHNIQUES).filter((t) => t !== correct)).slice(0, 3)) };
    }
    return null;
  }

  // ===================================================================
  // Ćwiczenia — renderery
  // ===================================================================
  function flashFaces(it) {
    const kv = (rows) => h('dl', { class: 'kv' }, rows.filter((r) => r[1]).map(([k, v]) => [h('dt', null, k), h('dd', null, v)]));
    const ex = (cls, mark, text) => text ? h('div', { class: 'ex ' + cls }, mark + ' ' + text) : null;
    switch (it.type) {
      case 'replacement': {
        const side = it.polish.length ? pick(['informal', 'informal', 'formal', 'polish']) : pick(['informal', 'formal']);
        const fronts = {
          informal: ['Nieformalnie → jak napisać formalnie?', it.informal],
          formal: ['Formalnie → co to znaczy?', it.formal.join(' / ')],
          polish: ['Po polsku → jak napisać formalnie?', it.polish.join(', ')],
        };
        const [label, text] = fronts[side];
        return {
          label, text,
          expected: side === 'formal' ? `${it.informal} (${it.polish.join(', ')})` : it.formal.join(' / '),
          back: [kv([['Nieformalnie', it.informal], ['Formalnie', it.formal.join(' / ')], ['Po polsku', it.polish.join(', ')]]),
            ex('bad', '✗', it.example_informal), ex('good', '✓', it.example_formal)],
        };
      }
      case 'academic_verb':
        return {
          label: 'Czasownik akademicki', text: it.word, expected: `${FUNCTION_LABELS[it.function]} — ${it.polish.join(', ')}`,
          back: [h('div', { class: 'main' }, it.word), kv([['Funkcja', FUNCTION_LABELS[it.function]], ['Po polsku', it.polish.join(', ')]]), ex('good', '✓', it.example)],
        };
      case 'awl_word':
        return {
          label: it.awl_group ? `AWL · grupa ${it.awl_group}` : it.subject === DEFAULT_SUBJECT ? 'Słowo akademickie' : 'Słówko', text: it.word, expected: it.polish.join(', ') || '—',
          back: [h('div', { class: 'main' }, it.word), kv([['Po polsku', it.polish.join(', ') || '(brak tłumaczenia)']]), ex('good', '✓', it.example)],
        };
      case 'style_rule':
        return {
          label: 'Co jest nie tak w tym zdaniu?', text: it.incorrect, sentence: true, expected: it.correct,
          back: [h('div', { class: 'side-label' }, 'Reguła'), h('div', { style: 'font-weight:700' }, it.rule),
            ex('bad', '✗', it.incorrect), ex('good', '✓', it.correct)],
        };
      case 'qa':
        return {
          label: 'Pytanie', text: it.question, sentence: true, expected: it.answer,
          back: [h('div', { class: 'main' + (isShort(it.answer) ? '' : ' sentence') }, it.answer),
            kv([['Też poprawnie', it.accept.join(' / ')]]), it.explanation ? h('p', { class: 'muted' }, it.explanation) : null],
        };
      case 'cloze':
        return {
          label: 'Czego brakuje?', text: it._label, sentence: true, expected: it._gap.hidden,
          back: [h('div', { class: 'main sentence' }, it._gap.before, h('mark', null, it._gap.hidden), it._gap.after),
            kv([['Też poprawnie', it._answers.slice(1).join(' / ')]]), it.explanation ? h('p', { class: 'muted' }, it.explanation) : null],
        };
      case 'hedging':
        return {
          label: 'Jak napisać to ostrożniej (hedging)?', text: it.informal, sentence: true, expected: it.formal,
          back: [ex('bad', '✗', it.informal), ex('good', '✓', it.formal),
            kv([['Technika', TECHNIQUES[it.technique] || it.technique], ['Opis', it.polish]])],
        };
    }
  }

  function renderFlashcard(step, root, ctx) {
    const it = step.items[0];
    const f = flashFaces(it);
    const tagL = h('div', { class: 'swipe-tag left' }, 'NIE ZNAM');
    const tagR = h('div', { class: 'swipe-tag right' }, 'ZNAM');
    const card = h('div', { class: 'flash', role: 'button', tabindex: '0', 'aria-label': 'Karta — kliknij, aby odwrócić' },
      h('div', { class: 'flash-face flash-front' },
        h('div', { class: 'side-label' }, f.label),
        h('div', { class: 'main' + (f.sentence ? ' sentence' : '') }, f.text),
        h('div', { class: 'tap-hint' }, 'Dotknij, aby odwrócić')),
      h('div', { class: 'flash-face flash-back' }, f.back));
    let flipped = false;
    let done = false;
    const flip = () => { flipped = !flipped; card.classList.toggle('flipped', flipped); };
    const rate = (q) => {
      if (done) return;
      done = true;
      ctx.finish([{ item: it, correct: q >= 3, quality: q, prompt: f.text, expected: f.expected, given: q < 3 ? 'Nie znam' : null }],
        null, q >= 3 ? 'ok' : 'bad');
    };

    // Swipe (dotyk i mysz)
    let sx = null, dx = 0, moved = false;
    const resetDrag = () => {
      card.classList.remove('dragging');
      card.style.transform = '';
      tagL.style.opacity = tagR.style.opacity = 0;
      sx = null;
    };
    card.addEventListener('pointerdown', (e) => {
      sx = e.clientX; dx = 0; moved = false;
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', (e) => {
      if (sx == null) return;
      dx = e.clientX - sx;
      if (Math.abs(dx) > 6) { moved = true; card.classList.add('dragging'); }
      if (!moved) return;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 25}deg)${flipped ? ' rotateY(180deg)' : ''}`;
      tagL.style.opacity = dx < -20 ? Math.min(1, -dx / 110) : 0;
      tagR.style.opacity = dx > 20 ? Math.min(1, dx / 110) : 0;
    });
    card.addEventListener('pointerup', () => {
      if (sx == null) return;
      const d = dx;
      const wasMoved = moved;
      if (Math.abs(d) > 90) {
        card.style.transition = 'transform .25s ease';
        card.style.transform = `translateX(${d > 0 ? 600 : -600}px) rotate(${d > 0 ? 25 : -25}deg)${flipped ? ' rotateY(180deg)' : ''}`;
        sx = null;
        rate(d > 0 ? 5 : 1);
        return;
      }
      resetDrag();
      if (!wasMoved) flip();
    });
    card.addEventListener('pointercancel', resetDrag);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); flip(); } });

    put(root,
      kindLabel('Fiszka'),
      h('div', { class: 'flash-wrap' }, tagL, tagR, card),
      h('div', { class: 'rate-row' },
        h('button', { class: 'btn btn-no', onClick: () => rate(1) }, '✗ Nie znam'),
        h('button', { class: 'btn btn-almost', onClick: () => rate(3) }, '≈ Prawie'),
        h('button', { class: 'btn btn-yes', onClick: () => rate(5) }, '✓ Znam')),
      h('p', { class: 'muted small', style: 'text-align:center;margin-top:12px' },
        'Przesuń kartę w prawo = znam, w lewo = nie znam. Klawisze: spacja, 1 / 2 / 3.'));

    ctx.onKey((e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      else if (e.key === '1' || e.key === 'ArrowLeft') rate(1);
      else if (e.key === '2') rate(3);
      else if (e.key === '3' || e.key === 'ArrowRight') rate(5);
    });
  }

  function renderMC(step, root, ctx) {
    const it = step.items[0];
    const q = buildMC(it);
    let answered = false;
    const buttons = q.options.map((o, i) => h('button', { class: 'opt', onClick: () => choose(i) },
      h('span', { class: 'key' }, String(i + 1)), h('span', null, o.text)));
    function choose(i) {
      if (answered) return;
      answered = true;
      const o = q.options[i];
      buttons.forEach((b, j) => {
        b.disabled = true;
        if (q.options[j].correct) b.classList.add('ok');
      });
      if (!o.correct) buttons[i].classList.add('bad');
      ctx.finish([{ item: it, correct: o.correct, quality: o.correct ? 4 : 1, prompt: q.prompt, expected: q.answer, given: o.text }],
        o.correct
          ? { ok: true, title: pick(OK_TITLES), detail: exampleBlock(it) }
          : { ok: false, title: 'Niestety…', detail: `Poprawna odpowiedź: ${q.answer}` });
    }
    put(root,
      kindLabel('Quiz'),
      h('div', { class: 'muted' }, q.instruction),
      h('div', { class: 'prompt' + (q.sentence ? ' sentence' : '') }, q.prompt),
      q.context ? h('div', { class: 'context' }, q.context) : null,
      h('div', { class: 'options' }, buttons));
    ctx.onKey((e) => {
      const n = Number(e.key);
      if (n >= 1 && n <= buttons.length) choose(n - 1);
    });
  }

  function typingPrompt(it) {
    if (it.type === 'qa') {
      return { instruction: 'Napisz odpowiedź', prompt: it.question, accepted: it._answers, expected: it.answer };
    }
    if (it.type === 'replacement') {
      return { instruction: 'Napisz formalny odpowiednik', prompt: it.informal, context: it.example_informal,
        accepted: it._answers, expected: it.formal.join(' / ') };
    }
    const hint = `Podpowiedź: zaczyna się na „${it.word[0]}”, ${it.word.length} ${plural(it.word.length, 'znak', 'znaki', 'znaków')}`;
    if (it.type === 'academic_verb') {
      return { instruction: 'Napisz angielski czasownik akademicki', prompt: it.polish.join(', '),
        context: `Funkcja: ${FUNCTION_LABELS[it.function]}. ${hint}`, accepted: [it.word], expected: it.word };
    }
    return { instruction: it.subject === DEFAULT_SUBJECT ? 'Napisz angielskie słowo z AWL' : `Napisz ${inLang(it.subject)}`, prompt: it.polish.join(', '), context: hint, accepted: [it.word], expected: it.word };
  }

  // Tytuł komunikatu dla zaliczonej odpowiedzi, która nie była idealna.
  const nearTitle = (res) => (res.accents ? 'Dobrze — pamiętaj o polskich znakach' : 'Prawie idealnie — mała literówka');

  function answerFeedback(res, expected, accepted, it) {
    if (res.ok && res.exact) {
      const others = accepted.filter((a) => norm(a) !== norm(res.match) && !norm(res.match).includes(norm(a)) && !norm(a).includes(norm(res.match)));
      return { ok: true, title: pick(OK_TITLES), detail: others.length ? `Inne poprawne: ${others.join(' / ')}` : exampleBlock(it) };
    }
    if (res.ok) return { ok: true, title: nearTitle(res), detail: `Poprawnie: ${res.match}` };
    return { ok: false, title: 'Niestety…', detail: `Poprawna odpowiedź: ${expected}` };
  }

  function answerInput(onSubmit) {
    const input = h('input', { type: 'text', class: 'answer', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
      placeholder: 'Wpisz odpowiedź…', 'aria-label': 'Twoja odpowiedź' });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); onSubmit(); }
    });
    return input;
  }

  function renderTyping(step, root, ctx) {
    const it = step.items[0];
    const p = typingPrompt(it);
    let answered = false;
    const input = answerInput(submit);
    function submit(giveUp) {
      if (answered) return;
      if (!giveUp && !input.value.trim()) { input.focus(); return; }
      answered = true;
      const res = giveUp ? { ok: false } : checkTyped(input.value, p.accepted);
      input.disabled = true;
      input.classList.add(res.ok ? 'ok' : 'bad');
      ctx.finish([{ item: it, correct: res.ok, quality: res.ok ? (res.exact ? 4 : 3) : 1, prompt: p.prompt, expected: p.expected, given: input.value || '(nie wiem)' }],
        answerFeedback(res, p.expected, p.accepted, it));
    }
    put(root,
      kindLabel('Wpisywanie'),
      h('div', { class: 'muted' }, p.instruction),
      h('div', { class: 'prompt' }, p.prompt),
      p.context ? h('div', { class: 'context' }, p.context) : null,
      h('div', { class: 'field' }, input),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-ghost', onClick: () => submit(true) }, 'Nie wiem'),
        h('div', { class: 'spacer' }),
        h('button', { class: 'btn btn-primary', onClick: () => submit(false) }, 'Sprawdź')));
    setTimeout(() => input.focus(), 50);
  }

  function renderGap(step, root, ctx) {
    const it = step.items[0];
    const g = it._gap;
    const hint = it.type === 'replacement' ? `(${it.informal})` : it.type === 'cloze' ? (it.hint ? `(${it.hint})` : '') : `(${it.polish[0]})`;
    const accepted = uniq([g.hidden, ...(it._answers || [])]);
    const line = h('span', { class: 'gap-line' }, ' '.repeat(10));
    let answered = false;
    const input = answerInput(submit);
    function submit(giveUp) {
      if (answered) return;
      if (!giveUp && !input.value.trim()) { input.focus(); return; }
      answered = true;
      const res = giveUp ? { ok: false } : checkTyped(input.value, accepted);
      input.disabled = true;
      input.classList.add(res.ok ? 'ok' : 'bad');
      line.textContent = g.hidden;
      line.classList.add(res.ok ? 'ok' : 'bad');
      ctx.finish([{ item: it, correct: res.ok, quality: res.ok ? (res.exact ? 4 : 3) : 1,
        prompt: `${g.before}___${g.after}`, expected: g.hidden, given: input.value || '(nie wiem)' }],
        res.ok ? { ok: true, title: res.exact ? pick(OK_TITLES) : nearTitle(res), detail: [`${g.before}${g.hidden}${g.after}`, it.explanation].filter(Boolean).join(' — ') }
          : { ok: false, title: 'Niestety…', detail: `Poprawnie: ${g.hidden}` });
    }
    put(root,
      kindLabel('Uzupełnij lukę'),
      h('div', { class: 'muted', style: 'margin-bottom:10px' },
        it.type === 'replacement' ? 'Wpisz formalne wyrażenie zamiast nieformalnego z nawiasu.'
          : it.type === 'cloze' ? 'Wpisz brakujące pojęcie.' : 'Wpisz brakujące słowo (podpowiedź po polsku).'),
      h('div', { class: 'gap-sentence card' },
        g.before,
        h('span', { class: 'gap-slot' }, h('span', { class: 'gap-hint' }, hint), line),
        g.after),
      h('div', { class: 'field' }, input),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-ghost', onClick: () => submit(true) }, 'Nie wiem'),
        h('div', { class: 'spacer' }),
        h('button', { class: 'btn btn-primary', onClick: () => submit(false) }, 'Sprawdź')));
    setTimeout(() => input.focus(), 50);
  }

  function renderMatching(step, root, ctx) {
    const def = MATCH[step.variant];
    const pairs = shuffle(step.items).map((it) => ({ it, l: def.left(it), r: def.right(it) }));
    const rights = shuffle(pairs.map((p) => p.r));
    const erred = new Set();
    let sel = null; // { side: 'l'|'r', i }
    let matched = 0;

    const leftEls = pairs.map((p, i) => h('button', { class: 'match-item', draggable: 'true', dataset: { i } }, p.l));
    const rightEls = rights.map((r, i) => h('button', { class: 'match-item', dataset: { i } }, r));

    const clearSel = () => { leftEls.concat(rightEls).forEach((e) => e.classList.remove('sel')); sel = null; };

    function attempt(li, ri) {
      const L = leftEls[li], R = rightEls[ri];
      clearSel();
      if (pairs[li].r === rights[ri]) {
        [L, R].forEach((e) => { e.classList.remove('wrong'); e.classList.add('done'); });
        L.disabled = R.disabled = true;
        matched++;
        if (matched === pairs.length) finish();
      } else {
        erred.add(pairs[li].it.id);
        [L, R].forEach((e) => {
          e.classList.remove('wrong');
          void e.offsetWidth;
          e.classList.add('wrong');
          setTimeout(() => e.classList.remove('wrong'), 450);
        });
      }
    }
    function tap(side, i) {
      const el = (side === 'l' ? leftEls : rightEls)[i];
      if (el.disabled) return;
      if (sel && sel.side !== side) {
        attempt(side === 'l' ? i : sel.i, side === 'r' ? i : sel.i);
      } else {
        clearSel();
        sel = { side, i };
        el.classList.add('sel');
      }
    }
    function finish() {
      const n = erred.size;
      ctx.finish(pairs.map((p) => ({ item: p.it, correct: !erred.has(p.it.id), quality: erred.has(p.it.id) ? 2 : 4,
        prompt: p.l, expected: p.r, given: erred.has(p.it.id) ? 'błędne dopasowanie' : null })),
        n === 0 ? { ok: true, title: 'Perfekcyjnie! Wszystkie pary bez błędu.', detail: '' }
          : { ok: false, title: `Gotowe — ${n} ${plural(n, 'para', 'pary', 'par')} z błędem`, detail: 'Te słowa wrócą w powtórkach.' });
    }

    leftEls.forEach((el, i) => {
      el.addEventListener('click', () => tap('l', i));
      el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', String(i)); e.dataTransfer.effectAllowed = 'move'; clearSel(); });
    });
    rightEls.forEach((el, i) => {
      el.addEventListener('click', () => tap('r', i));
      el.addEventListener('dragover', (e) => { if (!el.disabled) { e.preventDefault(); el.classList.add('drop-over'); } });
      el.addEventListener('dragleave', () => el.classList.remove('drop-over'));
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('drop-over');
        const li = Number(e.dataTransfer.getData('text/plain'));
        if (!Number.isNaN(li) && !leftEls[li].disabled && !el.disabled) attempt(li, i);
      });
    });

    put(root,
      kindLabel('Dopasuj pary'),
      h('div', { class: 'muted' }, `${def.label}. Kliknij element z lewej, potem z prawej (lub przeciągnij).`),
      h('div', { class: 'match-grid' }, h('div', { class: 'match-col' }, leftEls), h('div', { class: 'match-col' }, rightEls)));
  }

  const RENDERERS = { flashcard: renderFlashcard, mc: renderMC, typing: renderTyping, gap: renderGap, matching: renderMatching };

  // ===================================================================
  // Sesja — kontroler
  // ===================================================================
  let keyHandler = null;
  let feedbackAt = 0;
  let feedbackContinue = null;

  function feedbackEl() {
    let fb = document.getElementById('feedback');
    if (!fb) {
      fb = h('div', { id: 'feedback', class: 'feedback', role: 'status', 'aria-live': 'polite' });
      document.body.append(fb);
    }
    return fb;
  }
  function hideFeedback() {
    const fb = document.getElementById('feedback');
    if (fb) fb.className = 'feedback';
    feedbackContinue = null;
  }
  function showFeedback(f, onContinue) {
    const fb = feedbackEl();
    const btn = h('button', { class: 'btn ' + (f.ok ? 'btn-primary' : 'btn-danger'), onClick: () => onContinue() }, 'Dalej');
    fb.replaceChildren(h('div', { class: 'feedback-inner' },
      h('div', { class: 'fb-icon', 'aria-hidden': 'true' }, f.ok ? '✓' : '✗'),
      h('div', { class: 'fb-text' }, h('div', { class: 'fb-title' }, f.title), f.detail ? h('div', { class: 'fb-detail' }, f.detail) : null),
      btn));
    fb.className = 'feedback show ' + (f.ok ? 'ok' : 'bad');
    feedbackAt = Date.now();
    feedbackContinue = onContinue;
    setTimeout(() => btn.focus({ preventScroll: true }), 30);
  }

  function renderSessionView(view) {
    if (!session) { location.hash = '#/dashboard'; return; }
    const s = session;
    const step = s.steps[s.index];
    const total = s.steps.length;
    const pct = Math.round((s.index / total) * 100);

    const stepRoot = h('div', { class: 'step' });
    let finished = false;
    const ctx = {
      onKey: (fn) => { keyHandler = fn; },
      finish(results, fb, tone) {
        if (finished) return;
        finished = true;
        keyHandler = null;
        for (const r of results) {
          r.kind = step.kind;
          r.retry = !!step.retry;
          if (!r.skipped) record(r.item, r.correct, r.quality);
          s.results.push(r);
          if (s.cfg.mode === 'srs' && !r.correct && !r.skipped && !s.requeued.has(r.item.id)) {
            s.requeued.add(r.item.id);
            s.steps.push({ kind: chooseKind(r.item, 'mix'), items: [r.item], retry: true });
          }
        }
        const ok = fb ? fb.ok : tone === 'ok';
        view.classList.remove('flash-ok', 'flash-bad');
        void view.offsetWidth;
        view.classList.add(ok ? 'flash-ok' : 'flash-bad');
        if (fb) showFeedback(fb, advance);
        else setTimeout(advance, 280);
      },
    };

    function advance() {
      hideFeedback();
      s.index++;
      if (s.index >= s.steps.length) finishSession();
      else renderSessionView(view);
    }

    function skip() {
      if (finished) return;
      finished = true;
      for (const it of step.items) {
        s.results.push({ item: it, correct: false, skipped: true, kind: step.kind, retry: !!step.retry, prompt: it._label, expected: it._answer, given: 'pominięte' });
      }
      advance();
    }

    view.replaceChildren(
      h('div', { class: 'session-top' },
        h('button', { class: 'icon-btn', 'aria-label': 'Zakończ sesję', title: 'Zakończ sesję', onClick: quitSession }, '✕'),
        h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': String(s.index), 'aria-valuemax': String(total) },
          h('span', { class: 'p', style: `width:${pct}%` })),
        h('div', { class: 'count' }, `${s.index + 1}/${total}`)),
      stepRoot,
      h('div', { class: 'session-actions' },
        h('span', { class: 'muted small' }, step.retry ? '🔁 Powtórka błędu' : ''),
        h('button', { class: 'btn btn-ghost', onClick: skip }, 'Pomiń ⏭')));
    keyHandler = null;
    RENDERERS[step.kind](step, stepRoot, ctx);
  }

  function quitSession() {
    const answered = session ? session.results.length : 0;
    if (answered && !confirm('Zakończyć sesję? Dotychczasowe odpowiedzi są zapisane.')) return;
    if (answered) finishSession();
    else { session = null; location.hash = '#/dashboard'; }
  }

  function finishSession() {
    const s = session;
    const first = s.results.filter((r) => !r.retry);
    lastSummary = {
      cfg: s.cfg,
      total: first.length,
      correct: first.filter((r) => r.correct).length,
      errors: first.filter((r) => !r.correct),
    };
    session = null;
    hideFeedback();
    location.hash = '#/summary';
  }

  // ===================================================================
  // Widoki
  // ===================================================================
  function progressBar(stats, cls = '') {
    const t = stats.total || 1;
    return h('div', { class: 'bar ' + cls },
      h('span', { class: 'm', style: `width:${(stats.mastered / t) * 100}%` }),
      h('span', { class: 'l', style: `width:${(stats.learning / t) * 100}%` }));
  }

  function statsFor(items) {
    const s = { total: items.length, new: 0, learning: 0, mastered: 0 };
    for (const it of items) s[statusOf(it)]++;
    return s;
  }

  // Kategoria zapisana w ustawieniach może pochodzić z innego przedmiotu.
  function validCat(cat, pool) {
    if (cat === 'custom') return pool.some((it) => it._custom) ? cat : 'all';
    if (cat === 'pp') return pool.some((it) => it._pp) ? cat : 'all';
    return cat === 'all' || catOf(cat, currentSubject()) ? cat : 'all';
  }

  function setLevel(level) {
    if (!LEVELS[level]) return;
    state.settings.level = level;
    state.settings.subject = LEVELS[level].subjects[0];
    state.settings.lastConfig.category = 'all';
    browseState.category = 'all';
    browseState.type = 'all';
    save();
    route();
  }

  // Nowe konto: wybór ścieżki przed pierwszą nauką.
  function renderOnboarding(view) {
    view.replaceChildren(
      h('div', { class: 'hero' }, h('div', null, h('h1', null, 'Witaj w Study Cards! 👋'),
        h('div', { class: 'muted' }, 'Wybierz, czego się uczysz. Zmienisz to później w Ustawieniach.'))),
      h('div', { class: 'grid grid-2' }, Object.entries(LEVELS).map(([k, lv]) =>
        h('button', { class: 'card level-card', onClick: () => setLevel(k) },
          h('h2', null, lv.label),
          h('div', { class: 'muted small' }, lv.subjects.map((sk) => `${SUBJECTS[sk].icon} ${SUBJECTS[sk].label}`).join(' · ')))),
        h('button', { class: 'card level-card', onClick: () => { state.settings.parentMode = true; save(); applyParentMode(); location.hash = '#/family'; } },
          h('h2', null, '👪 Jestem rodzicem'),
          h('div', { class: 'muted small' }, 'Podgląd postępów dzieci. Własną ścieżkę nauki możesz wybrać później w Ustawieniach.'))),
      sync.client && !sync.user
        ? h('p', { class: 'muted small' }, 'Masz już konto na innym urządzeniu? ', h('a', { href: '#/settings' }, 'Zaloguj się w Ustawieniach'), ', a ścieżka i postęp wczytają się same.')
        : ''); // nie null: natywne replaceChildren wypisałoby „null”
  }

  function setSubject(key) {
    if (key === currentSubject()) return;
    state.settings.subject = key;
    state.settings.lastConfig.category = 'all';
    browseState.category = 'all';
    browseState.type = 'all';
    save();
    route();
  }

  // Ile kart z przedmiotu czeka dziś (powtórki + nowe w ramach limitu).
  function todoCount(subject) {
    const c = srsCounts(subjectPool(subject), subject);
    return c.due + c.newToday;
  }

  function subjectItem(key, todo, onPick) {
    const subj = SUBJECTS[key];
    const active = key === currentSubject();
    return h('button', { class: 'subj-item' + (active ? ' active' : ''), 'aria-current': active ? 'true' : null, onClick: onPick },
      h('span', { class: 'subj-ico', 'aria-hidden': 'true' }, subj.icon),
      h('span', { class: 'subj-name' }, subj.label),
      todo ? h('span', { class: 'chip-count', title: 'Do zrobienia dziś' }, String(todo)) : null);
  }

  // Menu: lista przedmiotów w menu bocznym (desktop) i rozwijany przełącznik w górnym pasku (telefon).
  function renderNav() {
    const cur = currentSubject();
    const subj = SUBJECTS[cur];
    const todo = Object.fromEntries(levelSubjects().map((k) => [k, todoCount(k)]));

    const list = document.getElementById('nav-subjects');
    list.replaceChildren(h('div', { class: 'nav-heading' }, 'Przedmioty'),
      ...levelSubjects().map((k) => subjectItem(k, todo[k], () => setSubject(k))));
    document.getElementById('nav-section').textContent = `${subj.icon} ${subj.label}`;

    const sw = document.getElementById('subj-switch');
    sw.classList.remove('open');
    const others = levelSubjects().filter((k) => k !== cur).reduce((n, k) => n + todo[k], 0);
    const btn = h('button', { class: 'subj-btn', 'aria-haspopup': 'true', 'aria-expanded': 'false', title: 'Zmień przedmiot',
      onClick: (e) => { e.stopPropagation(); const open = sw.classList.toggle('open'); btn.setAttribute('aria-expanded', String(open)); } },
      h('span', { 'aria-hidden': 'true' }, subj.icon), h('span', { class: 'name' }, subj.label),
      others ? h('span', { class: 'subj-dot', title: `W innych przedmiotach czeka dziś ${others} ${plural(others, 'karta', 'karty', 'kart')}` }) : null,
      h('span', { class: 'caret', 'aria-hidden': 'true' }, '▾'));
    sw.replaceChildren(btn, h('div', { class: 'subj-menu', role: 'menu' },
      h('div', { class: 'subj-menu-title' }, 'Przedmiot'),
      ...levelSubjects().map((k) => subjectItem(k, todo[k], () => { sw.classList.remove('open'); setSubject(k); }))));
  }
  document.addEventListener('click', (e) => {
    const sw = document.getElementById('subj-switch');
    if (sw && !sw.contains(e.target)) sw.classList.remove('open');
  });

  // Na panelu: przypomnienie o kartach na dziś w pozostałych przedmiotach (kliknięcie przełącza przedmiot).
  function otherSubjectsHint() {
    const rest = levelSubjects().filter((k) => k !== currentSubject()).map((k) => [k, todoCount(k)]).filter(([, n]) => n);
    if (!rest.length) return null;
    return h('div', { class: 'chips', style: 'margin:-4px 0 16px' },
      h('span', { class: 'muted small', style: 'align-self:center' }, 'Na dziś także:'),
      rest.map(([k, n]) => h('button', { class: 'chip', onClick: () => setSubject(k) }, `${SUBJECTS[k].icon} ${SUBJECTS[k].label} · ${n}`)));
  }

  function renderDashboard(view) {
    const name = state.settings.name.trim();
    const st = streak();
    const subj = SUBJECTS[currentSubject()];
    const pool = subjectPool();
    const { due, newToday } = srsCounts(pool);
    const overall = statsFor(pool);
    const mine = pool.filter((it) => it._custom);
    const fromPP = pool.filter((it) => it._pp);
    let quickCat = validCat(state.settings.lastConfig.category || 'all', pool);

    const chips = h('div', { class: 'chips' });
    const drawChips = () => chips.replaceChildren(
      ...[['all', 'Wszystkie'], ...(fromPP.length ? [['pp', '📘 Podstawa']] : []), ...(mine.length ? [['custom', '⭐ Dodane']] : []), ...catsOf(currentSubject()).map(([k, c]) => [k, c.icon + ' ' + c.short])].map(([k, label]) =>
        h('button', { class: 'chip' + (quickCat === k ? ' active' : ''), onClick: () => { quickCat = k; drawChips(); } }, label)));
    drawChips();

    const catRows = [...catsOf(currentSubject()), ['pp', { label: 'Podstawa programowa', pl: 'wymagania z podstawy', icon: '📘' }],
      ['custom', { label: 'Dodane materiały', pl: 'własne i wspólne', icon: '⭐' }]].map(([key, c]) => {
      const items = key === 'custom' ? mine : key === 'pp' ? fromPP : pool.filter((it) => it.category === key);
      if (!items.length) return null;
      const s = statsFor(items);
      return h('button', { class: 'cat-row', onClick: () => startSession({ mode: 'quick', category: key, difficulty: 'all', exercise: 'mix' }) },
        h('span', { class: 'cat-ico' }, c.icon),
        h('span', null,
          h('div', { class: 'cat-name' }, c.label, h('span', { class: 'cat-pl' }, c.pl)),
          progressBar(s)),
        h('span', { class: 'muted small', style: 'text-align:right' }, `${s.mastered}/${s.total}`, h('br'), `${Math.round((s.mastered / s.total) * 100)}%`));
    });

    view.replaceChildren();
    put(view,
      h('div', { class: 'hero' },
        h('div', null,
          h('h1', null, `Cześć${name ? ', ' + name : ''}! 👋`),
          h('div', { class: 'muted' }, subj.tagline),
          sync.client && !sync.user
            ? h('a', { href: '#/settings', class: 'small' }, '☁️ Włącz synchronizację między urządzeniami')
            : null),
        st ? h('div', { class: 'streak', title: 'Dni nauki z rzędu' }, `🔥 ${st} ${plural(st, 'dzień', 'dni', 'dni')}`) : null),
      otherSubjectsHint(),
      pool.length ? null : h('div', { class: 'card' },
        h('h2', null, `${subj.icon} ${subj.label}: jeszcze brak kart`),
        h('p', { class: 'muted small' }, 'Dodaj materiały z lekcji. Najszybciej przez czat AI: wklejasz handout, a czat przygotowuje karty.'),
        h('a', { class: 'btn btn-primary', href: '#/materials' }, '➕ Dodaj materiały')),
      pool.length ? h('div', { class: 'grid grid-2' },
        h('div', { class: 'card start-card' },
          h('h2', null, '🧠 Inteligentne powtórki'),
          h('div', { class: 'row', style: 'align-items:baseline' },
            h('span', { class: 'big-num' }, String(due)),
            h('span', { class: 'muted' }, `do powtórki dziś${newToday ? ` + ${newToday} ${plural(newToday, 'nowe', 'nowe', 'nowych')}` : ''}`)),
          h('p', { class: 'muted small', style: 'margin-top:8px' }, 'Algorytm SM-2 dobiera to, co właśnie zaczynasz zapominać.'),
          h('button', { class: 'btn btn-primary btn-block', disabled: !(due + newToday),
            onClick: () => startSession({ mode: 'srs', category: 'all', difficulty: 'all', exercise: 'mix' }) },
          due + newToday ? 'Rozpocznij powtórki' : 'Na dziś wszystko! 🎉')),
        h('div', { class: 'card start-card' },
          h('h2', null, '⚡ Szybka sesja'),
          h('p', { class: 'muted small' }, `${state.settings.sessionSize} losowych kart, różne typy ćwiczeń.`),
          chips,
          h('button', { class: 'btn btn-accent btn-block', style: 'margin-top:14px',
            onClick: () => { state.settings.lastConfig.category = quickCat; save(); startSession({ mode: 'quick', category: quickCat, difficulty: 'all', exercise: 'mix' }); } },
          'Start'))) : null,
      pool.length ? h('div', { class: 'card' },
        h('h2', null, 'Twój postęp'),
        h('div', { class: 'stat-row' },
          h('div', { class: 'stat' }, h('b', { style: 'color:var(--ok)' }, String(overall.mastered)), h('span', null, 'Opanowane')),
          h('div', { class: 'stat' }, h('b', { style: 'color:var(--warn)' }, String(overall.learning)), h('span', null, 'W nauce')),
          h('div', { class: 'stat' }, h('b', null, String(overall.new)), h('span', null, 'Nowe'))),
        h('div', { style: 'margin-top:12px' }, progressBar(overall)),
        h('div', { class: 'legend' },
          h('span', null, h('i', { style: 'background:var(--ok)' }), 'opanowane (>90%)'),
          h('span', null, h('i', { style: 'background:var(--warn)' }), 'w nauce (60–90%)'),
          h('span', null, h('i', { style: 'background:var(--surface-2);border:1px solid var(--border)' }), 'nowe (<60%)'))) : null,
      pool.length ? h('div', { class: 'card' },
        h('h2', null, 'Kategorie'),
        h('p', { class: 'muted small' }, 'Kliknij kategorię, aby od razu zacząć szybką sesję.'),
        h('div', { class: 'cat-list' }, catRows),
        h('a', { class: 'btn btn-block', href: '#/materials', style: 'margin-top:12px' }, '➕ Dodaj własne materiały')) : null);
  }

  function seg(options, value, onChange) {
    const wrap = h('div', { class: 'seg', role: 'group' });
    const draw = (v) => wrap.replaceChildren(...options.map(([k, label]) =>
      h('button', { class: v === k ? 'active' : '', 'aria-pressed': String(v === k), onClick: () => { draw(k); onChange(k); } }, label)));
    draw(value);
    return wrap;
  }

  function renderLearn(view) {
    const cfg = { ...state.settings.lastConfig };
    const persist = () => { state.settings.lastConfig = { ...cfg }; save(); refresh(); };
    const info = h('div', { class: 'muted small', style: 'margin-bottom:14px' });
    const sizeField = h('div', { class: 'field' });

    function refresh() {
      const pool = filterPool(cfg);
      if (cfg.mode === 'srs') {
        const c = srsCounts(pool);
        info.textContent = `W wybranym zakresie: ${c.due} do powtórki + ${c.newToday} nowych na dziś.`;
        sizeField.classList.add('hidden');
      } else {
        info.textContent = `W wybranym zakresie: ${pool.length} ${plural(pool.length, 'wpis', 'wpisy', 'wpisów')}.`;
        sizeField.classList.remove('hidden');
      }
    }

    const hasMine = subjectPool().some((it) => it._custom);
    const hasPP = subjectPool().some((it) => it._pp);
    cfg.category = validCat(cfg.category, subjectPool());
    const catSelect = h('select', { id: 'f-cat', value: cfg.category, onChange: (e) => { cfg.category = e.target.value; persist(); } },
      h('option', { value: 'all' }, 'Wszystkie kategorie'),
      hasPP ? h('option', { value: 'pp' }, '📘 Podstawa programowa') : null,
      hasMine ? h('option', { value: 'custom' }, '⭐ Dodane materiały') : null,
      catsOf(currentSubject()).map(([k, c]) => h('option', { value: k }, `${c.icon} ${c.label}`)));
    const diffSelect = h('select', { id: 'f-diff', value: String(cfg.difficulty), onChange: (e) => { cfg.difficulty = e.target.value; persist(); } },
      h('option', { value: 'all' }, 'Wszystkie poziomy'),
      Object.entries(DIFFICULTY).map(([k, l]) => h('option', { value: k }, `${k} — ${l}`)));

    sizeField.append(h('span', { class: 'label' }, 'Liczba słów'),
      seg([['10', '10'], ['12', '12'], ['15', '15']], String(state.settings.sessionSize), (v) => { state.settings.sessionSize = Number(v); save(); }));

    const exChips = h('div', { class: 'chips' });
    const drawEx = () => exChips.replaceChildren(...Object.entries(EXERCISES).map(([k, l]) =>
      h('button', { class: 'chip' + (cfg.exercise === k ? ' active' : ''), onClick: () => { cfg.exercise = k; drawEx(); persist(); } }, l)));
    drawEx();

    view.replaceChildren(
      h('h1', null, 'Własna sesja'),
      h('div', { class: 'card' },
        h('div', { class: 'field' }, h('span', { class: 'label' }, 'Tryb'),
          seg([['quick', '⚡ Szybka sesja'], ['srs', '🧠 Powtórki SRS']], cfg.mode, (v) => { cfg.mode = v; persist(); })),
        h('div', { class: 'grid grid-2', style: 'gap:0 16px' },
          h('div', { class: 'field' }, h('label', { for: 'f-cat' }, 'Kategoria'), catSelect),
          h('div', { class: 'field' }, h('label', { for: 'f-diff' }, 'Poziom'), diffSelect)),
        h('div', { class: 'field' }, h('span', { class: 'label' }, 'Rodzaj ćwiczeń'), exChips),
        sizeField,
        info,
        h('button', { class: 'btn btn-primary btn-lg btn-block', onClick: () => startSession({ ...cfg, size: state.settings.sessionSize }) }, 'Zaczynamy! 🚀')),
      h('div', { class: 'card' },
        h('h2', null, 'Rodzaje ćwiczeń'),
        h('dl', { class: 'kv' },
          h('dt', null, 'Fiszki'), h('dd', null, 'Odwróć kartę i oceń: znam / prawie / nie znam. Na telefonie przesuwaj kartę.'),
          h('dt', null, 'Quiz'), h('dd', null, '4 odpowiedzi do wyboru, np. informal → formal, EN → PL albo odpowiedź na pytanie.'),
          h('dt', null, 'Wpisywanie'), h('dd', null, 'Napisz odpowiedź z pamięci. Drobne literówki są akceptowane.'),
          h('dt', null, 'Dopasowywanie'), h('dd', null, '5–6 par, np. informal ↔ formal, EN ↔ PL albo odpowiedź ↔ pytanie.'),
          h('dt', null, 'Luki'), h('dd', null, 'Uzupełnij zdanie brakującym wyrażeniem lub pojęciem.'),
          h('dt', null, 'Mix'), h('dd', null, 'Wszystko naraz — najlepsze na co dzień.'))));
    refresh();
  }

  function renderSummary(view) {
    if (!lastSummary) { location.hash = '#/dashboard'; return; }
    const { total, correct, errors, cfg } = lastSummary;
    const pct = total ? correct / total : 0;
    const msg = pct >= 0.9 ? 'Świetnie! 🎉' : pct >= 0.7 ? 'Dobra robota! 👏' : pct >= 0.5 ? 'Nieźle — ćwicz dalej 💪' : 'Nie poddawaj się — powtórz błędy 🔁';
    const R = 64, C = 2 * Math.PI * R;
    const ring = `<svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
      <circle cx="75" cy="75" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="14"/>
      <circle cx="75" cy="75" r="${R}" fill="none" stroke="${pct >= 0.7 ? 'var(--ok)' : pct >= 0.5 ? 'var(--warn)' : 'var(--bad)'}" stroke-width="14"
        stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>`;
    const ringEl = h('div', { class: 'score-ring' });
    ringEl.innerHTML = ring;
    ringEl.append(h('div', { class: 'val' }, `${correct}/${total}`));

    const errItems = uniq(errors.map((e) => e.item));
    view.replaceChildren(
      h('div', { class: 'card summary-head' },
        h('h1', null, 'Koniec sesji'),
        ringEl,
        h('h2', null, `${correct}/${total} — ${msg}`),
        h('div', { class: 'row', style: 'justify-content:center;margin-top:14px' },
          errItems.length ? h('button', { class: 'btn btn-danger', onClick: () => startSession({ ...cfg, mode: 'quick', items: errItems }) }, `🔁 Powtórz błędy (${errItems.length})`) : null,
          h('button', { class: 'btn btn-primary', onClick: () => startSession({ ...cfg, items: undefined }) }, 'Kolejna sesja'),
          h('a', { class: 'btn', href: '#/dashboard' }, 'Panel'))),
      errors.length ? h('div', { class: 'card' },
        h('h2', null, 'Do przejrzenia'),
        h('div', { class: 'err-list' }, errors.map((e) => h('div', { class: 'err' + (e.skipped ? ' skipped' : '') },
          h('div', { class: 'q' }, e.prompt),
          e.given && !e.skipped ? h('div', { class: 'g' }, e.given) : e.skipped ? h('div', { class: 'muted small' }, 'pominięte') : null,
          h('div', { class: 'a' }, '✓ ' + e.expected))))) : h('div', { class: 'card', style: 'text-align:center' }, 'Bez błędów — tak trzymaj! ⭐'));
  }

  // ----- Słownik
  const browseState = { q: '', category: 'all', type: 'all', sort: 'alpha', limit: 80 };

  function wordCard(it) {
    const st = statusOf(it);
    const badges = h('div', { class: 'word-badges' },
      it.type === 'academic_verb' ? h('span', { class: 'badge' }, FUNCTION_LABELS[it.function]) : null,
      it.type === 'awl_word' && it.awl_group ? h('span', { class: 'badge' }, `AWL ${it.awl_group}`) : null,
      it._shared ? h('span', { class: 'badge mine', title: `${it.source} — od ${it.author}` }, '👥 Wspólne')
        : it._custom ? h('span', { class: 'badge mine', title: it.source }, '⭐ Moje')
        : it._pp ? h('span', { class: 'badge pp', title: it.pp ? `Wymaganie ${it.pp} z podstawy programowej` : PP_SOURCE }, '📘 Podstawa programowa') : null,
      it.type === 'hedging' ? h('span', { class: 'badge', title: TECHNIQUES[it.technique] }, (TECHNIQUE_DEFS[it.technique] || {}).en || it.technique) : null,
      h('span', { class: 'badge', title: DIFFICULTY[it.difficulty] }, '●'.repeat(it.difficulty) + '○'.repeat(3 - it.difficulty)),
      h('span', { class: 'badge ' + st }, STATUS_LABELS[st]));
    const ex = (cls, mark, text) => text ? h('div', { class: 'ex ' + cls }, mark + ' ' + text) : null;
    let head, details;
    switch (it.type) {
      case 'replacement':
        head = [h('span', { class: 'word-main' }, it.informal), h('span', { class: 'word-arrow' }, '→'), h('span', { class: 'word-sub' }, it.formal.join(' / '))];
        details = [it.polish.length ? h('div', null, h('b', null, 'PL: '), it.polish.join(', ')) : null, ex('bad', '✗', it.example_informal), ex('good', '✓', it.example_formal)];
        break;
      case 'academic_verb':
      case 'awl_word':
        head = [h('span', { class: 'word-main' }, it.word), h('span', { class: 'word-arrow' }, '—'), h('span', { class: 'muted' }, it.polish.join(', ') || '(brak tłumaczenia)')];
        details = [ex('good', '✓', it.example)];
        break;
      case 'style_rule':
        return h('div', { class: 'word rule-card' },
          h('div', { class: 'word-head' }, h('span', { class: 'word-main' }, '✍️ ' + it.rule), badges),
          h('div', { class: 'word-details' }, ex('bad', '✗', it.incorrect), ex('good', '✓', it.correct)));
      case 'qa':
        head = [h('span', { class: 'word-main', style: 'font-weight:600' }, it.question), h('span', { class: 'word-arrow' }, '→'), h('span', { class: 'word-sub' }, it.answer)];
        details = [it.accept.length ? h('div', null, h('b', null, 'Też poprawnie: '), it.accept.join(' / ')) : null,
          it.explanation ? h('div', { class: 'muted small' }, it.explanation) : null];
        break;
      case 'cloze':
        head = [h('span', { class: 'word-main', style: 'font-weight:600' }, it._gap.before, h('mark', null, it._gap.hidden), it._gap.after)];
        details = [it._answers.length > 1 ? h('div', null, h('b', null, 'Też poprawnie: '), it._answers.slice(1).join(' / ')) : null,
          it.hint ? h('div', null, h('b', null, 'Podpowiedź: '), it.hint) : null,
          it.explanation ? h('div', { class: 'muted small' }, it.explanation) : null];
        break;
      case 'hedging':
        head = [h('span', { class: 'word-main', style: 'font-weight:600' }, it.informal)];
        details = [ex('good', '✓', it.formal), h('div', { class: 'muted small' }, it.polish)];
        break;
    }
    const el = h('div', { class: 'word', tabindex: '0', role: 'button', 'aria-expanded': 'false' },
      h('div', { class: 'word-head' }, head, badges),
      h('div', { class: 'word-details' }, details));
    const toggle = () => { el.classList.toggle('open'); el.setAttribute('aria-expanded', String(el.classList.contains('open'))); };
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    return el;
  }

  function renderBrowse(view) {
    const list = h('div', { class: 'word-list' });
    const countEl = h('div', { class: 'muted small', style: 'margin-bottom:10px' });
    const more = h('div', { class: 'list-more' });
    const bs = browseState;

    function filtered() {
      const q = bs.q.trim().toLowerCase();
      const rank = { new: 0, learning: 1, mastered: 2 };
      const out = subjectPool().filter((it) =>
        inCat(it, bs.category) &&
        (bs.type === 'all' || it.type === bs.type) &&
        (!q || it._search.includes(searchKey(q))));
      const alpha = (a, b) => a._label.localeCompare(b._label, 'en', { sensitivity: 'base' });
      if (bs.sort === 'alpha') out.sort(alpha);
      else if (bs.sort === 'difficulty') out.sort((a, b) => a.difficulty - b.difficulty || alpha(a, b));
      else if (bs.sort === 'difficulty_desc') out.sort((a, b) => b.difficulty - a.difficulty || alpha(a, b));
      else if (bs.sort === 'status') out.sort((a, b) => rank[statusOf(a)] - rank[statusOf(b)] || alpha(a, b));
      return out;
    }
    function draw() {
      const items = filtered();
      countEl.textContent = `${items.length} ${plural(items.length, 'wpis', 'wpisy', 'wpisów')}`;
      list.replaceChildren(...items.slice(0, bs.limit).map(wordCard));
      more.replaceChildren(items.length > bs.limit
        ? h('button', { class: 'btn', onClick: () => { bs.limit += 120; draw(); } }, `Pokaż więcej (${items.length - bs.limit})`)
        : '');
      if (!items.length) list.append(h('div', { class: 'card muted', style: 'text-align:center' }, 'Nic nie znaleziono.'));
    }
    let t;
    const search = h('input', { type: 'search', placeholder: '🔍 Szukaj (EN lub PL)…', value: bs.q, 'aria-label': 'Szukaj',
      onInput: (e) => { clearTimeout(t); t = setTimeout(() => { bs.q = e.target.value; bs.limit = 80; draw(); }, 150); } });
    const sel = (key, options, label) => h('select', { 'aria-label': label, value: bs[key], onChange: (e) => { bs[key] = e.target.value; bs.limit = 80; draw(); } },
      options.map(([v, l]) => h('option', { value: v }, l)));

    view.replaceChildren(
      h('h1', null, 'Karty'),
      h('div', { class: 'filters' },
        search,
        sel('category', [['all', 'Wszystkie kategorie'], ...(subjectPool().some((it) => it._pp) ? [['pp', '📘 Podstawa programowa']] : []),
          ...(subjectPool().some((it) => it._custom) ? [['custom', '⭐ Dodane materiały']] : []),
          ...catsOf(currentSubject()).map(([k, c]) => [k, c.label])], 'Kategoria'),
        sel('type', [['all', 'Wszystkie typy'], ...SUBJECTS[currentSubject()].types.map((t) => [t, typeLabel(t, currentSubject())])], 'Typ'),
        sel('sort', [['alpha', 'A → Z'], ['difficulty', 'Poziom ↑'], ['difficulty_desc', 'Poziom ↓'], ['status', 'Status (nowe najpierw)']], 'Sortowanie')),
      countEl, list, more);
    draw();
  }

  // ----- Ustawienia
  function renderSettings(view) {
    const fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'hidden', onChange: importProgress });
    const learned = Object.keys(state.progress).length;
    const syncCard = h('div', { class: 'card', id: 'sync-card' });
    renderSyncCard(syncCard);
    const familyCard = h('div', { class: 'card', id: 'family-card' });
    renderFamilyCard(familyCard);
    const invitesCard = h('div', { class: 'card', id: 'invites-card' });
    renderInvitesCard(invitesCard);
    view.replaceChildren(
      h('h1', null, 'Ustawienia'),
      h('div', { class: 'card' },
        h('h2', null, 'Ogólne'),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Motyw'), h('span', { class: 'muted small' }, 'Jasny, ciemny lub zgodny z systemem')),
          seg([['system', 'Systemowy'], ['light', '☀️ Jasny'], ['dark', '🌙 Ciemny']], state.settings.theme, (v) => { state.settings.theme = v; save(); applyTheme(); })),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Ścieżka nauki'), h('span', { class: 'muted small' }, 'Decyduje, jakie przedmioty widzisz w menu')),
          h('select', { 'aria-label': 'Ścieżka nauki', value: state.settings.level || '', onChange: (e) => { setLevel(e.target.value); toast('Zapisano'); } },
            state.settings.level ? null : h('option', { value: '' }, '— wybierz —'),
            Object.entries(LEVELS).map(([k, lv]) => h('option', { value: k }, lv.label)))),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Imię'), h('span', { class: 'muted small' }, 'Do powitania na panelu')),
          h('input', { type: 'text', value: state.settings.name, maxlength: '30', placeholder: 'np. Tymon', 'aria-label': 'Imię',
            onChange: (e) => { state.settings.name = e.target.value; save(); toast('Zapisano'); } })),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Nowe słowa dziennie'), h('span', { class: 'muted small' }, 'Ile nowych kart wprowadzają powtórki SRS, osobno w każdym przedmiocie')),
          h('select', { 'aria-label': 'Nowe słowa dziennie', value: String(state.settings.newPerDay), onChange: (e) => { state.settings.newPerDay = Number(e.target.value); save(); } },
            [5, 10, 15, 20, 30].map((n) => h('option', { value: String(n) }, String(n))))),
        h('div', { class: 'setting' },
          h('div', { class: 'txt' }, h('b', null, 'Długość szybkiej sesji'), h('span', { class: 'muted small' }, 'Liczba słów w jednej sesji')),
          h('select', { 'aria-label': 'Długość sesji', value: String(state.settings.sessionSize), onChange: (e) => { state.settings.sessionSize = Number(e.target.value); save(); } },
            [10, 12, 15].map((n) => h('option', { value: String(n) }, String(n)))))),
      h('div', { class: 'card' },
        h('h2', null, '📚 Moje materiały'),
        h('p', { class: 'muted small' }, state.customItems.length
          ? `Masz ${state.customItems.length} ${plural(state.customItems.length, 'własny wpis', 'własne wpisy', 'własnych wpisów')}. Synchronizują się razem z postępem.`
          : 'Dodaj własne karty z czatu AI, pliku JSON, wklejonego tekstu albo pojedynczo.'),
        h('a', { class: 'btn btn-primary', href: '#/materials' }, '➕ Dodaj / zarządzaj materiałami')),
      syncCard,
      invitesCard,
      familyCard,
      h('div', { class: 'card' },
        h('h2', null, 'Dane i postęp'),
        h('p', { class: 'muted small' }, `Postęp na tym urządzeniu: ${learned} ${plural(learned, 'słowo', 'słowa', 'słów')}. Plik eksportu to zapasowa kopia — do przenoszenia między urządzeniami służy synchronizacja.`),
        h('div', { class: 'row' },
          h('button', { class: 'btn btn-primary', onClick: exportProgress }, '⬇️ Eksportuj postęp'),
          h('button', { class: 'btn', onClick: () => fileInput.click() }, '⬆️ Importuj postęp'),
          fileInput,
          h('div', { class: 'spacer' }),
          h('button', { class: 'btn btn-danger', onClick: resetProgress }, 'Resetuj postęp'))),
      h('div', { class: 'card' },
        h('h2', null, 'O aplikacji'),
        h('p', { class: 'muted small' },
          `Karty w Twojej ścieżce: ${VOCAB.filter((i) => levelSubjects().includes(i.subject)).length}${VOCAB_META.updated ? ` (aktualizacja ${VOCAB_META.updated})` : ''}. `,
          'Aplikacja działa offline po pierwszym uruchomieniu i można ją zainstalować na telefonie („Dodaj do ekranu głównego”).'),
        h('dl', { class: 'kv small' }, levelSubjects().flatMap((sk) => SUBJECTS[sk].types
          .map((k) => [k, VOCAB.filter((i) => i.subject === sk && i.type === k).length]).filter(([, n]) => n)
          .map(([k, n]) => [h('dt', null, `${SUBJECTS[sk].icon} ${typeLabel(k, sk)}`), h('dd', null, String(n))])))));
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify({ app: 'study-cards', exported: new Date().toISOString(), state }, null, 1)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `study-cards-postep-${today()}.json` });
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast('Plik z postępem pobrany');
  }

  function importProgress(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const s = data.state || data;
        if (!s || typeof s.progress !== 'object') throw new Error('format');
        if (!confirm('Zaimportować postęp z pliku? Obecny postęp na tym urządzeniu zostanie zastąpiony.')) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        state = loadState();
        lastSettingsFp = settingsFp();
        save();
        applyTheme();
        toast(`Zaimportowano postęp (${Object.keys(state.progress).length} słów)`);
        route();
      } catch (err) {
        toast('To nie jest poprawny plik z postępem.');
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (!confirm('Na pewno usunąć cały postęp nauki? Tej operacji nie można cofnąć (chyba że masz eksport).')) return;
    state.progress = {};
    state.daily = {};
    state.resetAt = Date.now(); // synchronizacja nie przywróci starszych wpisów z chmury
    save();
    toast('Postęp wyczyszczony');
    route();
  }

  // ===================================================================
  // Własne materiały: import pliku JSON, wklejony tekst, formularz, zarządzanie paczkami.
  // Zapis do state.customItems (localStorage + synchronizacja), usunięcia jako tombstones w state.deletedCustom.
  // ===================================================================
  // Kolumny wklejanego tekstu (separator ; lub tabulator).
  const PASTE_COLS = {
    awl_word: ['word', 'polish', 'example'],
    academic_verb: ['word', 'polish', 'function', 'example'],
    replacement: ['informal', 'formal', 'polish', 'example_formal'],
    hedging: ['informal', 'formal', 'technique', 'polish'],
    style_rule: ['rule', 'incorrect', 'correct'],
    qa: ['question', 'answer', 'explanation'],
    cloze: ['text', 'hint', 'explanation'],
  };

  // podgląd importu: { source, rows: [{ item, errors, warnings, dup, checked, line }], notes: [błędy parsera], parts, ai }
  let pending = null;
  let lastAdded = null; // { source, ids } — komunikat po dodaniu
  const openPacks = new Set();
  const matUi = { tab: 'ai', visibility: 'private', subject: null, aiText: '', aiSource: '', pasteText: '', pasteSource: '' };
  // Przedmiot w widoku materiałów (domyślnie bieżący) i zależne od niego typ i kategoria w panelach.
  function setMatSubject(subject) {
    const subj = SUBJECTS[subject];
    matUi.subject = subject;
    matUi.pasteType = matUi.formType = subj.defaultType;
    matUi.pasteCat = matUi.formCat = defaultCat(subj.defaultType, subject);
  }

  const fieldDef = (type, key) => (FIELDS[type] || []).find((f) => f.key === key);
  const textKey = (it) => norm(it.informal || it.word || it.incorrect || it.rule || it.question || it.text || '');
  // Duplikat = ten sam tekst w tym samym przedmiocie.
  const dupKey = (it) => { const k = textKey(it); return k ? `${subjectOf(it)}|${k}` : ''; };
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

  // Tekst z pola/kolumny -> wartość wpisu (listy, liczby, funkcja/technika po kluczu albo nazwie).
  function parseField(type, key, text) {
    const f = fieldDef(type, key);
    const v = String(text).trim();
    if (!f || !v) return v;
    if (f.list) return v.split(f.list === '/' ? /\s*\/\s*/ : /\s*[,/]\s*/).filter(Boolean);
    if (f.num) return Number(v) || undefined;
    if (f.options) {
      const k = v.toLowerCase().replace(/[\s-]+/g, '_');
      if (f.options[k]) return k;
      const byName = Object.keys(f.options).find((o) => f.options[o].toLowerCase().startsWith(v.toLowerCase()));
      return byName || v;
    }
    return v;
  }

  // Kopia wpisu z pliku bez pól nadawanych przez aplikację; brak przedmiotu -> przedmiot importu,
  // brak kategorii -> domyślna dla typu.
  function cleanRaw(raw, subject) {
    const out = {};
    for (const [k, v] of Object.entries(raw)) {
      if (k === 'id' || k === 'source' || k === 'addedAt' || k.startsWith('_') || v == null || v === '') continue;
      out[k] = typeof v === 'string' ? v.trim() : v;
    }
    // Bez pola subject wpis trafia do przedmiotu importu (kategoria z innego przedmiotu = błąd w podglądzie).
    if (!filled(out.subject)) out.subject = subject;
    if (!filled(out.category) && SUBJECTS[out.subject]) out.category = defaultCat(out.type, out.subject);
    if (out.difficulty != null) out.difficulty = Math.min(3, Math.max(1, Number(out.difficulty) || 1));
    return out;
  }

  function itemWarnings(it) {
    const w = [];
    if ((it.type === 'awl_word' || it.type === 'academic_verb') && !filled(it.polish)) w.push('Bez tłumaczenia — słowo pojawi się głównie jako fiszka');
    if (it.type === 'qa' && !isShort(it.answer)) w.push('Długa odpowiedź — bez ćwiczenia wpisywania (fiszka i quiz zostają)');
    if (it.type === 'cloze' && (String(it.text).match(CLOZE_RE_G) || []).length > 1) w.push('Kilka luk — ukryta będzie tylko pierwsza');
    if (subjectOf(it) !== matUi.subject) w.push(`Przedmiot: ${SUBJECTS[subjectOf(it)].label}`);
    return w;
  }

  // opts.append: dopisz do bieżącego podglądu (kolejna część odpowiedzi czatu); opts.notes: błędy parsera.
  function buildPending(raws, source, opts = {}) {
    const prev = opts.append && pending ? pending : null;
    const seen = new Map();
    for (const it of VOCAB) {
      const k = dupKey(it);
      if (k && !seen.has(k)) {
        seen.set(k, it._shared ? `już we wspólnych materiałach („${it.source}”, od ${it.author})`
          : it._custom ? `już w Twoich materiałach („${it.source}”)` : 'już jest w kartach');
      }
    }
    for (const r of prev ? prev.rows : []) {
      const k = !r.errors.length && dupKey(r.item);
      if (k && !seen.has(k)) seen.set(k, `powtórzone w tym imporcie (poz. ${r.line})`);
    }
    const offset = prev ? prev.rows.length : 0;
    const rows = raws.map((raw, i) => {
      const isObj = raw && typeof raw === 'object' && !Array.isArray(raw);
      const item = isObj ? cleanRaw(raw, opts.subject || matUi.subject || currentSubject()) : {};
      const errors = isObj ? itemErrors(item) : ['Wpis nie jest obiektem JSON'];
      const warnings = errors.length ? [] : itemWarnings(item);
      if (isObj && raw.__extra) warnings.push('Nadmiarowe kolumny pominięte');
      const line = isObj && raw.__line ? raw.__line : offset + i + 1;
      const k = errors.length ? '' : dupKey(item);
      const dup = (k && seen.get(k)) || null;
      if (k && !dup) seen.set(k, `powtórzone w tym imporcie (poz. ${line})`);
      return { item, errors, warnings, dup, checked: !errors.length && !dup, line };
    });
    const parts = prev ? prev.parts + 1 : 1;
    const notes = (opts.notes || []).map((n) => (parts > 1 ? `Część ${parts}: ${n}` : n));
    pending = prev
      ? { ...prev, rows: [...prev.rows, ...rows], notes: [...prev.notes, ...notes], parts }
      : { source: source || 'ręcznie', rows, notes, parts, ai: !!opts.ai };
    lastAdded = null;
  }

  function parsePaste(text, type, category) {
    const cols = PASTE_COLS[type];
    const out = [];
    text.split(/\r?\n/).forEach((line, i) => {
      const t = line.trim();
      if (!t || t.startsWith('#')) return;
      const parts = line.split(line.includes('\t') ? '\t' : ';').map((s) => s.trim());
      const raw = { type, category, __line: i + 1 };
      cols.forEach((key, j) => { if (parts[j]) raw[key] = parseField(type, key, parts[j]); });
      if (parts.slice(cols.length).some(Boolean)) raw.__extra = true;
      out.push(raw);
    });
    return out;
  }

  // Zapis podglądu: prywatnie (state.customItems, id "c-…") albo dla wszystkich (tabela shared_items, id "s-…").
  async function commitPending(shared) {
    const rows = pending.rows.filter((r) => r.checked && !r.errors.length);
    if (!rows.length) return false;
    const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const addedAt = new Date().toISOString();
    const source = pending.source;
    const added = rows.map((r, i) => ({ ...r.item, id: `${shared ? 's' : 'c'}-${stamp}-${i}`, source, addedAt }));
    if (shared) {
      if (!canShare()) { toast('Udostępnianie wymaga zalogowania (Ustawienia → Synchronizacja).'); return false; }
      const author = state.settings.name.trim() || (sync.user.email || '').split('@')[0];
      const recs = added.map(({ id, source: src, addedAt: _a, ...item }) => ({ id, item, source: src, author_name: author }));
      const { error } = await sync.client.from('shared_items').insert(recs);
      if (error) { toast('Nie udało się udostępnić: ' + error.message); return false; }
      setShared([...SHARED, ...recs.map((r) => sharedFromRow({ ...r, author_id: sync.user.id, created_at: addedAt }))]);
    } else {
      state.customItems = [...state.customItems, ...added];
      save();
    }
    rebuildVocab();
    lastAdded = { source, ids: added.map((a) => a.id), shared };
    pending = null;
    toast(`Dodano ${added.length} ${plural(added.length, 'wpis', 'wpisy', 'wpisów')}${shared ? ' dla wszystkich' : ''} ✅`);
    return true;
  }

  async function removeCustom(ids, what, shared) {
    const where = shared ? 'Zniknie u wszystkich użytkowników. ' : '';
    if (!confirm(`Usunąć ${what}? ${where}Postęp nauki tych słów też zostanie usunięty (również na innych urządzeniach po synchronizacji).`)) return false;
    const del = new Set(ids);
    if (shared) {
      const { error } = await sync.client.from('shared_items').delete().in('id', ids);
      if (error) { toast('Nie udało się usunąć: ' + error.message); return false; }
      setShared(SHARED.filter((c) => !del.has(c.id)));
    }
    const ts = Date.now();
    state.deletedCustom = { ...state.deletedCustom };
    for (const id of del) { state.deletedCustom[id] = ts; delete state.progress[id]; }
    state.customItems = state.customItems.filter((c) => !del.has(c.id));
    if (lastAdded) lastAdded.ids = lastAdded.ids.filter((id) => !del.has(id));
    save();
    rebuildVocab();
    toast('Usunięto');
    return true;
  }

  // ----- Wspólne materiały (Supabase, tabela shared_items): czyta każdy, dodaje zalogowany, usuwa tylko autor.
  const canShare = () => !!(sync.client && sync.user);
  const sharedFromRow = (r) => ({ ...r.item, id: r.id, source: r.source, addedAt: r.created_at, author: r.author_name || 'ktoś', authorId: r.author_id });
  function setShared(list) {
    SHARED = list;
    try { localStorage.setItem(SHARED_KEY, JSON.stringify(list)); } catch (e) { /* tylko kopia offline */ }
  }

  async function loadShared() {
    if (!sync.client || !navigator.onLine) return;
    const { data, error } = await sync.client.from('shared_items')
      .select('id, item, source, author_id, author_name, created_at').order('created_at');
    if (error) { sync.sharedError = error.message; return; } // np. tabela jeszcze nie założona — zostaje kopia lokalna
    sync.sharedError = '';
    const before = SHARED.map((c) => c.id).join();
    setShared(data.map(sharedFromRow));
    if (SHARED.map((c) => c.id).join() === before) return;
    rebuildVocab();
    if (['dashboard', 'browse', 'settings'].includes(currentRoute) || (currentRoute === 'materials' && !pending)) route();
  }

  function learnItems(ids) {
    const items = shuffle(ids.map((id) => BY_ID.get(id)).filter(Boolean)).slice(0, Math.max(state.settings.sessionSize, 15));
    startSession({ mode: 'quick', category: 'all', difficulty: 'all', exercise: 'mix', items });
  }

  const optionEls = (dict, value) => Object.entries(dict).map(([k, l]) => h('option', { value: k, selected: k === value }, l));
  const catOptions = (value) => catsOf(matUi.subject).map(([k, c]) => h('option', { value: k, selected: k === value }, `${c.icon} ${c.label}`));
  const typeOptions = (value) => optionEls(Object.fromEntries(SUBJECTS[matUi.subject].types.map((t) => [t, typeLabel(t, matUi.subject)])), value);

  function renderMaterials(view) {
    const panel = h('div');
    const tabs = h('div');
    const previewCard = h('div', { class: 'card', id: 'mat-preview' });
    const manageCard = h('div', { class: 'card' });
    if (matUi.tab === 'ai' && !window.AW_AI) matUi.tab = 'paste';
    // Materiały dodaje się do przedmiotu wybranego w menu; zmiana tutaj przełącza przedmiot w całej aplikacji.
    if (matUi.subject !== currentSubject()) setMatSubject(currentSubject());
    const subjSel = h('select', { id: 'm-subject', onChange: (e) => setSubject(e.target.value) },
      optionEls(Object.fromEntries(levelSubjects().map((k) => [k, `${SUBJECTS[k].icon} ${SUBJECTS[k].label}`])), matUi.subject));

    const showPreview = () => { drawPreview(); previewCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    function drawTabs() {
      const s = seg([['ai', '🤖 Czat AI'], ['file', '📄 JSON'], ['paste', '📋 Wklej'], ['form', '✏️ Słowo']], matUi.tab, (v) => { matUi.tab = v; drawPanel(); });
      s.classList.add('seg-full');
      tabs.replaceChildren(s);
    }
    function drawPanel() {
      const make = { ai: aiPanel, file: filePanel, paste: pastePanel, form: formPanel }[matUi.tab];
      panel.replaceChildren(make(showPreview));
    }
    // „Dodaj kolejną część”: wróć do pola odpowiedzi czatu, nowe wklejenie dopisze się do podglądu.
    function morePart() {
      matUi.tab = 'ai';
      matUi.aiText = '';
      drawTabs();
      drawPanel();
      const ta = document.getElementById('m-ai');
      if (ta) { ta.scrollIntoView({ behavior: 'smooth', block: 'center' }); ta.focus({ preventScroll: true }); }
    }

    function drawPreview() {
      if (matUi.tab === 'ai') drawPanel(); // przyciski panelu zależą od tego, czy jest podgląd z czatu
      if (!pending) {
        const ids = lastAdded ? lastAdded.ids : [];
        previewCard.classList.toggle('hidden', !ids.length);
        if (ids.length) {
          previewCard.replaceChildren(
            h('h2', null, `✅ Dodano ${ids.length} ${plural(ids.length, 'wpis', 'wpisy', 'wpisów')}`),
            h('p', { class: 'muted small' }, `Paczka „${lastAdded.source}” ${lastAdded.shared ? '(👥 dla wszystkich)' : '(🔒 tylko dla Ciebie)'}. `,
              'Nowe karty są już w Kartach, w sesjach i w powtórkach (jako nowe, przed resztą).'),
            h('div', { class: 'row' },
              h('button', { class: 'btn btn-primary', onClick: () => learnItems(ids) }, '🎯 Ucz się ich teraz'),
              h('button', { class: 'btn btn-ghost', onClick: () => { lastAdded = null; drawPreview(); } }, 'Zamknij')));
        }
        return;
      }
      previewCard.classList.remove('hidden');
      const rows = pending.rows;
      const nErr = rows.filter((r) => r.errors.length).length;
      const nDup = rows.filter((r) => r.dup).length;
      const nNew = rows.length - nErr - nDup;
      const addBtn = h('button', { class: 'btn btn-primary' });
      const updateBtn = () => {
        const n = rows.filter((r) => r.checked).length;
        addBtn.textContent = `Dodaj (${n})`;
        addBtn.disabled = !n;
      };
      addBtn.addEventListener('click', async () => {
        addBtn.disabled = true;
        if (await commitPending(matUi.visibility === 'shared')) { drawPreview(); drawManage(); } else updateBtn();
      });
      updateBtn();
      if (!canShare()) matUi.visibility = 'private';
      const visHint = h('p', { class: 'muted small', style: 'margin:6px 0 0' });
      const drawVisHint = () => {
        visHint.textContent = !canShare()
          ? 'Udostępnianie wszystkim wymaga zalogowania (Ustawienia → Synchronizacja).'
          : matUi.visibility === 'shared'
            ? 'Wpisy zobaczą wszyscy użytkownici aplikacji. Usunąć je możesz tylko Ty.'
            : 'Wpisy będą widoczne tylko na Twoim koncie.';
      };
      drawVisHint();
      const vis = seg([['private', '🔒 Tylko dla mnie'], ['shared', '👥 Dla wszystkich']], matUi.visibility, (v) => { matUi.visibility = v; drawVisHint(); });
      vis.classList.add('seg-full');
      vis.style.marginBottom = '0';
      if (!canShare()) vis.querySelectorAll('button').forEach((b) => { if (!b.classList.contains('active')) b.disabled = true; });
      previewCard.replaceChildren(h('div', null,
        h('h2', null, 'Podgląd przed zapisem'),
        h('p', { class: 'muted small' }, 'Źródło: ', h('b', null, pending.source),
          pending.parts > 1 ? ` · ${pending.parts} ${plural(pending.parts, 'część', 'części', 'części')}` : '',
          ` · ${rows.length} ${plural(rows.length, 'wpis', 'wpisy', 'wpisów')}: `,
          `${nNew} ${plural(nNew, 'nowy', 'nowe', 'nowych')}, ${nDup} ${plural(nDup, 'duplikat', 'duplikaty', 'duplikatów')}, ${nErr} z błędami. `,
          rows.length ? 'Odznacz wpisy, których nie chcesz dodawać.' : ''),
        pending.notes.length ? h('div', { class: 'pv-notes' }, pending.notes.map((n) => h('div', { class: 'pv-msg bad' }, '✗ ' + n))) : null,
        rows.length ? h('div', { class: 'pv-list' }, rows.map((r) => previewRow(r, updateBtn))) : null,
        h('div', { class: 'field', style: 'margin:14px 0 0' }, h('span', { class: 'label' }, 'Dla kogo?'), vis, visHint),
        h('div', { class: 'row', style: 'margin-top:14px' },
          h('button', { class: 'btn btn-ghost', onClick: () => { pending = null; drawPreview(); } }, 'Anuluj'),
          h('div', { class: 'spacer' }),
          pending.ai ? h('button', { class: 'btn', onClick: morePart }, '➕ Dodaj kolejną część') : null,
          addBtn)));
    }

    function drawManage() {
      const me = sync.user && sync.user.id;
      const groups = new Map(); // klucz: widoczność + źródło (+ autor dla wspólnych)
      const add = (c, shared) => {
        const k = shared ? `s|${c.authorId}|${c.source}` : `c|${c.source || 'bez nazwy'}`;
        if (!groups.has(k)) groups.set(k, { key: k, src: c.source || 'bez nazwy', shared, author: c.author, mine: !shared || c.authorId === me, items: [] });
        groups.get(k).items.push(c);
      };
      state.customItems.forEach((c) => add(c, false));
      // wspólne z innych ścieżek nauki (np. Biologia 7 klasy dla ucznia IB) nie są tu potrzebne
      const visibleShared = SHARED.filter((c) => c.authorId === me || levelSubjects().includes(subjectOf(c)));
      visibleShared.forEach((c) => add(c, true));
      const total = state.customItems.length + visibleShared.length;
      const title = h('h2', null, `📚 Dodane materiały${total ? ` (${total})` : ''}`);
      if (!groups.size) {
        manageCard.replaceChildren(title, h('p', { class: 'muted small' }, 'Nie ma jeszcze dodanych materiałów. Dodane wpisy trafią do sesji, powtórek i statystyk kategorii tak jak pozostałe karty.'));
        return;
      }
      const del = async (ids, what, shared) => { if (await removeCustom(ids, what, shared)) { drawManage(); drawPreview(); } };
      const list = [...groups.values()].sort((a, b) => b.mine - a.mine);
      manageCard.replaceChildren(title,
        h('p', { class: 'muted small' }, '🔒 tylko Twoje · 👥 wspólne dla wszystkich (usunąć może tylko autor). Usunięcie kasuje też postęp nauki tych słów.'),
        ...list.map((g) => {
          const { src, items, shared } = g;
          const latest = items.reduce((m, c) => (c.addedAt > m ? c.addedAt : m), '');
          const n = items.length;
          const who = shared ? (g.mine ? '👥 Twoje, dla wszystkich' : `👥 od ${g.author}`) : '🔒 tylko Ty';
          const det = h('details', { class: 'pack', open: openPacks.has(g.key) },
            h('summary', null,
              h('span', { class: 'pack-name' }, src),
              h('span', { class: 'muted small' }, `${who} · ${n} ${plural(n, 'wpis', 'wpisy', 'wpisów')} · ${fmtDate(latest)}`)),
            h('div', { class: 'pack-items' }, items.map((c) => {
              const it = BY_ID.get(c.id);
              const label = it ? it._label : textKey(c);
              return h('div', { class: 'pack-item' },
                h('div', { class: 'txt' },
                  h('b', null, label), it && it._answer ? h('span', { class: 'muted' }, ' — ' + it._answer) : null,
                  h('div', { class: 'pv-meta' }, `${SUBJECTS[subjectOf(c)].icon} ${typeLabel(c.type, subjectOf(c))} · ${(CATEGORIES[it ? it.category : c.category] || {}).label || '—'} · ${it ? STATUS_LABELS[statusOf(it)] : '—'}`)),
                g.mine ? h('button', { class: 'icon-btn', title: 'Usuń wpis', 'aria-label': `Usuń: ${label}`, onClick: () => del([c.id], `wpis „${label}”`, shared) }, '🗑') : null);
            })),
            h('div', { class: 'row pack-actions' },
              h('button', { class: 'btn', onClick: () => learnItems(items.map((c) => c.id)) }, '🎯 Ucz się'),
              h('div', { class: 'spacer' }),
              g.mine ? h('button', { class: 'btn btn-danger', onClick: () => del(items.map((c) => c.id), `całą paczkę „${src}” (${n} ${plural(n, 'wpis', 'wpisy', 'wpisów')})`, shared) }, 'Usuń paczkę') : null));
          det.addEventListener('toggle', () => (det.open ? openPacks.add(g.key) : openPacks.delete(g.key)));
          return det;
        }));
    }

    view.replaceChildren(
      h('h1', null, 'Dodaj materiały'),
      h('p', { class: 'muted' }, 'Nowe karty bez edytowania plików aplikacji. Każdy import kończy się podglądem, a dopiero potem zapisem.'),
      h('div', { class: 'card' },
        h('div', { class: 'field' }, h('label', { for: 'm-subject' }, 'Przedmiot'), subjSel),
        tabs, panel),
      previewCard,
      manageCard);
    drawTabs();
    drawPanel();
    drawPreview();
    drawManage();
  }

  function previewRow(r, onChange) {
    const p = r.errors.length ? null : prepareItem({ ...r.item, id: 'preview' });
    const label = p ? p._label : (textKey(r.item) || JSON.stringify(r.item).slice(0, 80) || '(pusty wpis)');
    const cb = h('input', { type: 'checkbox', checked: r.checked, disabled: !!r.errors.length, 'aria-label': `Dodaj: ${label}`,
      onChange: (e) => { r.checked = e.target.checked; onChange(); } });
    const cat = CATEGORIES[r.item.category];
    return h('label', { class: 'pv-row' + (r.errors.length ? ' err' : r.dup ? ' dup' : '') },
      cb,
      h('span', { class: 'pv-body' },
        h('span', null, h('b', null, label), p && p._answer ? h('span', { class: 'muted' }, ' — ' + p._answer) : null),
        h('span', { class: 'pv-meta' }, `poz. ${r.line} · ${r.item.type ? typeLabel(r.item.type, subjectOf(r.item)) : 'brak typu'} · ${cat ? cat.label : r.item.category || '—'}`),
        r.errors.map((e) => h('span', { class: 'pv-msg bad' }, '✗ ' + e)),
        r.dup ? h('span', { class: 'pv-msg warn' }, '⚠ Duplikat: ' + r.dup) : null,
        r.warnings.map((w) => h('span', { class: 'pv-msg' }, 'ℹ ' + w))));
  }

  // Import przez zewnętrzny czat AI: prompt i parser odpowiedzi z ai-import.js (window.AW_AI).
  function aiPanel(onPreview) {
    const AI = window.AW_AI;
    if (!AI) return h('p', { class: 'muted small' }, 'Moduł importu z czatu AI nie wczytał się — odśwież stronę.');
    const appending = !!(pending && pending.ai);
    const prompt = AI.promptFor({
      id: matUi.subject, label: SUBJECTS[matUi.subject].label, lang: SUBJECTS[matUi.subject].lang,
      vocab: !!SUBJECTS[matUi.subject].vocab, audience: LEVELS[currentLevel()].audience,
      categories: catsOf(matUi.subject).map(([key, c]) => ({ key, label: c.label })),
    });

    const promptBox = h('textarea', { id: 'm-ai-prompt', readonly: 'readonly', rows: '9', value: prompt, 'aria-label': 'Prompt dla czatu AI' });
    const promptDet = h('details', { class: 'ai-prompt' }, h('summary', null, 'Pokaż prompt'), promptBox);
    const showPromptForCopy = () => {
      promptDet.open = true;
      promptBox.focus();
      promptBox.select();
      toast('Schowek niedostępny — prompt jest zaznaczony, skopiuj go ręcznie.');
    };
    const copyAndOpen = () => {
      if (!navigator.clipboard || !navigator.clipboard.writeText) { showPromptForCopy(); return; }
      const copying = navigator.clipboard.writeText(prompt);
      // window.open od razu, w obrębie kliknięcia — po await przeglądarki (zwłaszcza Safari) blokują nowe karty
      const win = window.open(AI.copilotUrl, '_blank');
      if (win) win.opener = null;
      copying.then(
        () => toast(win ? 'Prompt skopiowany — wklej go w Copilocie' : 'Prompt skopiowany. Otwórz Copilota linkiem w kroku 1.'),
        showPromptForCopy);
    };

    const ta = h('textarea', { id: 'm-ai', rows: '7', spellcheck: 'false', value: matUi.aiText,
      placeholder: 'Wklej tu całą odpowiedź czatu — razem z tekstem i blokami kodu, aplikacja sama wyłuska JSON.' });
    ta.addEventListener('input', () => { matUi.aiText = ta.value; });
    const run = (append) => {
      const text = ta.value;
      if (!text.trim()) { toast('Najpierw wklej odpowiedź czatu.'); ta.focus(); return; }
      const { items, errors } = AI.parseReply(text);
      buildPending(items, matUi.aiSource.trim() || `Czat AI ${today()}`, { append, notes: errors, ai: true, subject: matUi.subject });
      matUi.aiText = '';
      onPreview();
    };
    const fromClipboard = async () => {
      const manual = 'wklej ręcznie (Ctrl+V albo przytrzymaj pole i wybierz „Wklej”).';
      if (!navigator.clipboard || !navigator.clipboard.readText) { toast('Przeglądarka nie daje dostępu do schowka — ' + manual); ta.focus(); return; }
      let text;
      try { text = await navigator.clipboard.readText(); } catch (e) { toast('Brak zgody na odczyt schowka — ' + manual); ta.focus(); return; }
      if (!text.trim()) { toast('Schowek jest pusty.'); return; }
      ta.value = matUi.aiText = text;
      run(appending);
    };
    const src = h('input', { type: 'text', id: 'm-aisrc', maxlength: '60', placeholder: `Czat AI ${today()}`, value: matUi.aiSource,
      onInput: (e) => { matUi.aiSource = e.target.value; } });

    return h('div', null,
      h('h3', null, 'Z czatu AI (Copilot) ', h('span', { class: 'badge mine' }, 'polecane')),
      h('ol', { class: 'ai-steps small' },
        h('li', null, 'Skopiuj prompt i otwórz ', h('a', { href: AI.copilotUrl, target: '_blank', rel: 'noopener' }, 'Copilota'), ' (przycisk niżej).'),
        h('li', null, 'Wklej prompt w czacie i dołącz handout: zdjęcie, PDF, plik Word albo jego tekst.'),
        h('li', null, 'Skopiuj całą odpowiedź czatu i wklej ją poniżej. Jeśli czat napisze „CIĄG DALSZY”, poproś o resztę i dodaj ją jako kolejną część.')),
      h('div', { class: 'row', style: 'margin-bottom:6px' },
        h('button', { class: 'btn btn-primary grow', onClick: copyAndOpen }, '📋 Skopiuj prompt i otwórz Copilota')),
      promptDet,
      h('div', { class: 'field', style: 'margin-top:14px' },
        h('label', { for: 'm-ai' }, appending ? `Wklej kolejną część odpowiedzi (część ${pending.parts + 1})` : 'Wklej odpowiedź czatu'), ta),
      appending ? null : h('div', { class: 'field' },
        h('label', { for: 'm-aisrc' }, 'Nazwa paczki ', h('span', { class: 'muted small', style: 'font-weight:500' }, '(opcjonalnie)')), src),
      h('div', { class: 'row' },
        h('button', { class: 'btn grow', onClick: fromClipboard }, '📥 Wklej ze schowka'),
        appending
          ? [h('button', { class: 'btn btn-primary grow', onClick: () => run(true) }, '➕ Dodaj kolejną część'),
            h('button', { class: 'btn btn-ghost', onClick: () => run(false) }, 'Nowy podgląd')]
          : h('button', { class: 'btn btn-primary grow', onClick: () => run(false) }, 'Podgląd →')));
  }

  function filePanel(onPreview) {
    const input = h('input', { type: 'file', accept: 'application/json,.json', class: 'hidden', onChange: (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      if (file.size > 2e6) { toast('Plik jest za duży (maks. 2 MB).'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        let data;
        try { data = JSON.parse(reader.result); } catch (err) { toast('To nie jest poprawny plik JSON.'); return; }
        const items = Array.isArray(data) ? data : data && Array.isArray(data.items) ? data.items : null;
        if (!items) { toast('Plik musi zawierać tablicę wpisów albo obiekt { "items": [...] }.'); return; }
        if (!items.length) { toast('Plik nie zawiera żadnych wpisów.'); return; }
        buildPending(items, file.name, { subject: matUi.subject });
        onPreview();
      };
      reader.readAsText(file);
    } });
    const sample = JSON.stringify({ items: SUBJECTS[matUi.subject].vocab ? [
      { type: 'awl_word', word: 'healthy', polish: ['zdrowy'], example: 'Fruit and vegetables are healthy.', category: 'en7_health', difficulty: 1 },
    ] : matUi.subject === DEFAULT_SUBJECT ? [
      { type: 'awl_word', word: 'significant', polish: ['istotny'], example: 'The results were statistically significant.', category: 'awl', difficulty: 1 },
      { type: 'replacement', informal: 'find out', formal: ['investigate', 'determine'], polish: ['zbadać'], category: 'phrasal_verbs' },
    ] : [
      { type: 'qa', question: FIELDS.qa[0].ph, answer: FIELDS.qa[1].ph, accept: [FIELDS.qa[2].ph], category: SUBJECTS[matUi.subject].defaultCategory, difficulty: 1 },
      { type: 'cloze', text: FIELDS.cloze[0].ph, hint: FIELDS.cloze[1].ph, category: SUBJECTS[matUi.subject].defaultCategory },
    ] }, null, 1);
    return h('div', null,
      h('p', { class: 'small' }, 'Plik w formacie vocabulary.json: tablica wpisów albo obiekt ', h('code', null, '{ "items": [...] }'),
        '. Pola ', h('code', null, 'id'), ' nie trzeba podawać — aplikacja nada własne.'),
      h('button', { class: 'btn btn-primary btn-block', onClick: () => input.click() }, '📂 Wybierz plik .json'),
      input,
      h('details', { class: 'small', style: 'margin-top:12px' },
        h('summary', null, 'Przykład pliku i dozwolone wartości'),
        h('pre', { class: 'code' }, sample),
        h('p', { class: 'muted' }, `Przedmiot ${SUBJECTS[matUi.subject].label}. Typy: `, SUBJECTS[matUi.subject].types.join(', '),
          '. Kategorie: ', catsOf(matUi.subject).map(([k]) => k).join(', '),
          '. Brak kategorii = domyślna dla typu. Wpis może wskazać inny przedmiot polem subject. Pełny opis pól: README, sekcja „Format wpisów”.')));
  }

  function pastePanel(onPreview) {
    const hint = h('p', { class: 'muted small', style: 'margin:0' });
    const ta = h('textarea', { id: 'm-paste', rows: '7', spellcheck: 'false', value: matUi.pasteText });
    ta.addEventListener('input', () => { matUi.pasteText = ta.value; });
    const catSel = h('select', { id: 'm-pcat', onChange: (e) => { matUi.pasteCat = e.target.value; } }, catOptions(matUi.pasteCat));
    const drawHint = () => {
      const t = matUi.pasteType;
      const cols = PASTE_COLS[t].map((k) => fieldDef(t, k).label.toLowerCase());
      hint.replaceChildren('Jeden wpis w linii, kolumny oddzielone ', h('b', null, ';'), ' lub tabulatorem: ', h('b', null, cols.join(' ; ')), '.',
        t === 'academic_verb' ? ` Funkcja: ${Object.keys(FUNCTION_LABELS).join(', ')}.` : '',
        t === 'hedging' ? ` Technika: ${Object.keys(TECHNIQUE_DEFS).join(', ')}.` : '');
      ta.placeholder = PASTE_COLS[t].map((k) => { const f = fieldDef(t, k); return f.options ? Object.keys(f.options)[0] : f.ph; }).join(' ; ');
    };
    const typeSel = h('select', { id: 'm-ptype', onChange: (e) => {
      matUi.pasteType = e.target.value;
      matUi.pasteCat = defaultCat(matUi.pasteType, matUi.subject);
      catSel.value = matUi.pasteCat;
      drawHint();
    } }, typeOptions(matUi.pasteType));
    const src = h('input', { type: 'text', id: 'm-psrc', maxlength: '60', placeholder: `Wklejone ${today()}`, value: matUi.pasteSource,
      onInput: (e) => { matUi.pasteSource = e.target.value; } });
    drawHint();
    const go = () => {
      const raws = parsePaste(ta.value, matUi.pasteType, matUi.pasteCat);
      if (!raws.length) { toast('Wklej co najmniej jedną linię.'); ta.focus(); return; }
      buildPending(raws, matUi.pasteSource.trim() || `Wklejone ${today()}`, { subject: matUi.subject });
      onPreview();
    };
    return h('div', null,
      h('div', { class: 'grid grid-2', style: 'gap:0 16px' },
        h('div', { class: 'field' }, h('label', { for: 'm-ptype' }, 'Typ wpisów'), typeSel),
        h('div', { class: 'field' }, h('label', { for: 'm-pcat' }, 'Kategoria'), catSel)),
      h('div', { class: 'field' }, h('label', { for: 'm-paste' }, 'Tekst'), hint, ta),
      h('div', { class: 'field' }, h('label', { for: 'm-psrc' }, 'Nazwa paczki ', h('span', { class: 'muted small', style: 'font-weight:500' }, '(opcjonalnie)')), src),
      h('button', { class: 'btn btn-primary btn-block', onClick: go }, 'Podgląd →'));
  }

  function formPanel(onPreview) {
    const wrap = h('div');
    function draw() {
      const type = matUi.formType;
      const inputs = {};
      const fields = FIELDS[type].filter((f) => !f.only || f.only === matUi.subject).map((f) => {
        const id = 'mf-' + f.key;
        const ctl = f.options
          ? h('select', { id }, optionEls(f.options))
          : h('input', { type: f.num ? 'number' : 'text', id, placeholder: f.ph, min: f.num ? '1' : null, max: f.num ? '10' : null,
            autocapitalize: 'off', spellcheck: 'false' });
        inputs[f.key] = ctl;
        return h('div', { class: 'field' },
          h('label', { for: id }, f.label, f.req ? h('span', { class: 'req', title: 'wymagane' }, ' *') : null,
            f.hint ? h('span', { class: 'muted small', style: 'font-weight:500' }, ` (${f.hint})`) : null),
          ctl);
      });
      const typeSel = h('select', { id: 'mf-type', onChange: (e) => { matUi.formType = e.target.value; matUi.formCat = defaultCat(matUi.formType, matUi.subject); draw(); } }, typeOptions(type));
      const catSel = h('select', { id: 'mf-cat', onChange: (e) => { matUi.formCat = e.target.value; } }, catOptions(matUi.formCat));
      const diffSel = h('select', { id: 'mf-diff' }, optionEls(Object.fromEntries(Object.entries(DIFFICULTY).map(([k, l]) => [k, `${k} — ${l}`])), '1'));
      const go = () => {
        const raw = { type, subject: matUi.subject, category: catSel.value, difficulty: Number(diffSel.value) };
        for (const f of FIELDS[type]) {
          if (!inputs[f.key]) continue;
          const v = inputs[f.key].value.trim();
          if (v) raw[f.key] = parseField(type, f.key, v);
        }
        buildPending([raw], 'ręcznie', { subject: matUi.subject });
        onPreview();
      };
      wrap.replaceChildren(
        h('div', { class: 'field' }, h('label', { for: 'mf-type' }, 'Typ'), typeSel),
        ...fields,
        h('div', { class: 'grid grid-2', style: 'gap:0 16px' },
          h('div', { class: 'field' }, h('label', { for: 'mf-cat' }, 'Kategoria'), catSel),
          h('div', { class: 'field' }, h('label', { for: 'mf-diff' }, 'Poziom'), diffSel)),
        h('button', { class: 'btn btn-primary btn-block', onClick: go }, 'Podgląd →'));
    }
    draw();
    return wrap;
  }

  // ===================================================================
  // Synchronizacja (Supabase): logowanie kodem z e-maila, jeden wiersz JSON na użytkownika.
  // localStorage pozostaje lokalną kopią — aplikacja działa offline, a zmiany wysyłamy w tle.
  // ===================================================================
  const CFG = window.AW_CONFIG || {};
  const sync = { client: null, user: null, status: 'off', error: '', lastSync: null, timer: null, busy: false, again: false, email: '',
    admin: false,     // administrator (supabase/invites.sql): widzi kartę Zaproszenia
    inviteEmail: '' }; // adres z linku zaproszenia (?zaproszenie=…), wpisywany przy logowaniu

  // Łączy dwa stany: dla każdego słowa wygrywa nowszy wpis, dni nauki — większa liczba odpowiedzi.
  function mergeStates(local, remote) {
    const resetAt = Math.max(local.resetAt || 0, remote.resetAt || 0);
    const progress = {};
    for (const src of [local.progress || {}, remote.progress || {}]) {
      for (const [id, p] of Object.entries(src)) {
        if (!p || (resetAt && (p.ts || 0) < resetAt)) continue;
        const cur = progress[id];
        if (!cur || (p.ts || 0) > (cur.ts || 0) || ((p.ts || 0) === (cur.ts || 0) && p.attempts > cur.attempts)) progress[id] = p;
      }
    }
    const resetDay = resetAt ? dayStr(new Date(resetAt)) : '';
    const daily = {};
    for (const src of [local.daily || {}, remote.daily || {}]) {
      for (const [d, v] of Object.entries(src)) {
        if (d < resetDay) continue;
        const cur = daily[d] || { answers: 0, newItems: 0 };
        daily[d] = { answers: Math.max(cur.answers, v.answers || 0), newItems: Math.max(cur.newItems, v.newItems || 0) };
        if (cur.newBy || v.newBy) {
          daily[d].newBy = { ...(cur.newBy || {}) };
          for (const [k, n] of Object.entries(v.newBy || {})) daily[d].newBy[k] = Math.max(daily[d].newBy[k] || 0, n);
        }
      }
    }
    const remoteNewer = (remote.settingsTs || 0) > (local.settingsTs || 0);
    const settings = remoteNewer ? { ...local.settings, ...remote.settings, theme: local.settings.theme } : { ...local.settings };
    // ścieżka: wybrana na którymkolwiek urządzeniu; postęp sprzed ścieżek należał do ucznia IB
    if (!settings.level) settings.level = (remote.settings || {}).level || (Object.keys(progress).length ? DEFAULT_LEVEL : null);
    // Usunięte własne materiały: suma tombstones z obu stron wygrywa nad sumą wpisów i ich postępem.
    const deletedCustom = { ...(remote.deletedCustom || {}) };
    for (const [id, t] of Object.entries(local.deletedCustom || {})) deletedCustom[id] = Math.max(t, deletedCustom[id] || 0);
    for (const id of Object.keys(deletedCustom)) delete progress[id];
    const custom = new Map();
    for (const it of [...(remote.customItems || []), ...(local.customItems || [])]) {
      if (it && it.id && !deletedCustom[it.id]) custom.set(it.id, it);
    }
    return {
      ...local, progress, daily, settings, resetAt, deletedCustom,
      settingsTs: Math.max(local.settingsTs || 0, remote.settingsTs || 0),
      customItems: [...custom.values()],
    };
  }

  function scheduleSync(delay = 8000) {
    if (!sync.user) return;
    sync.dirty = true;
    clearTimeout(sync.timer);
    sync.timer = setTimeout(() => syncNow(), delay);
  }

  async function syncNow(manual) {
    if (!sync.client || !sync.user) return;
    if (sync.busy) { sync.again = true; return; }
    if (!navigator.onLine) { sync.status = 'offline'; refreshSyncUi(); return; }
    clearTimeout(sync.timer);
    sync.busy = true;
    sync.status = 'syncing';
    refreshSyncUi();
    try {
      const { data, error } = await sync.client.from('progress').select('state').eq('user_id', sync.user.id).maybeSingle();
      if (error) throw error;
      const before = JSON.stringify(state.progress);
      const customFp = () => state.customItems.map((c) => c.id).join();
      const customBefore = customFp();
      const levelBefore = state.settings.level;
      if (data && data.state) {
        state = mergeStates(state, data.state);
        lastSettingsFp = settingsFp();
        saveLocal();
        applyParentMode();
      }
      const customChanged = customFp() !== customBefore;
      if (customChanged) rebuildVocab();
      sync.dirty = false;
      const { error: upErr } = await sync.client.from('progress')
        .upsert({ user_id: sync.user.id, state, updated_at: new Date().toISOString() });
      if (upErr) throw upErr;
      sync.status = 'ok';
      sync.error = '';
      sync.lastSync = new Date();
      if (manual) toast('Zsynchronizowano ☁️');
      // odśwież widok, jeśli z chmury przyszły nowe dane (nie w trakcie sesji)
      if (state.settings.level !== levelBefore && currentRoute !== 'session') route();
      else if ((JSON.stringify(state.progress) !== before || customChanged) && (currentRoute === 'dashboard' || currentRoute === 'browse')) route();
      else if (customChanged && currentRoute === 'materials' && !pending) route();
    } catch (e) {
      sync.status = 'error';
      sync.error = (e && e.message) || String(e);
      if (manual) toast('Błąd synchronizacji: ' + sync.error);
    } finally {
      sync.busy = false;
      refreshSyncUi();
      if (sync.again) { sync.again = false; syncNow(); }
    }
  }

  async function initSync() {
    const inviteQs = new URLSearchParams(location.search);
    if (inviteQs.has('zaproszenie')) {
      sync.inviteEmail = inviteQs.get('zaproszenie').trim().toLowerCase();
      inviteQs.delete('zaproszenie');
      history.replaceState(null, '', location.pathname + (inviteQs.toString() ? '?' + inviteQs : '') + location.hash);
    }
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) { sync.status = 'off'; return; }
    if (!window.supabase) { sync.status = 'unavailable'; refreshSyncUi(); return; }
    sync.client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'awv:auth' },
    });
    sync.client.auth.onAuthStateChange((event, session) => {
      const prev = sync.user && sync.user.id;
      sync.user = session ? session.user : null;
      if (!sync.user || sync.user.id !== family.loadedFor) { family.loadedFor = null; family.error = ''; }
      if (!sync.user || sync.user.id !== prev) { sync.admin = false; invites.list = null; }
      sync.status = sync.user ? (sync.status === 'off' || sync.status === 'loggedout' ? 'ok' : sync.status) : 'loggedout';
      // wywołania Supabase poza callbackiem (zalecenie biblioteki)
      if (sync.user && sync.user.id !== prev) {
        setTimeout(() => syncNow(), 0);
        setTimeout(() => checkAdmin(), 0);
        setTimeout(() => loadShared().catch(() => {}), 0); // wspólne materiały czytają tylko zalogowani
        // konto z kodem rodziny = rodzic: włącz zakładkę Rodzina (i pomiń wybór ścieżki)
        setTimeout(() => loadFamily().then(() => { if (state.settings.parentMode && currentRoute !== 'session') route(); }), 0);
      }
      refreshSyncUi();
      if (currentRoute === 'dashboard' || currentRoute === 'family') route();
    });
    await sync.client.auth.getSession();
    loadShared().catch(() => {});
    // posprzątaj adres po kliknięciu linku z e-maila (?code=… / ?error=…)
    const qs = new URLSearchParams(location.search);
    if (qs.has('code') || qs.has('error')) {
      if (qs.get('error_description')) toast('Logowanie nieudane: ' + qs.get('error_description'));
      history.replaceState(null, '', location.pathname + location.hash);
    }
    window.addEventListener('online', () => sync.dirty && syncNow());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && sync.dirty) syncNow();
      if (document.visibilityState === 'visible') { syncNow(); loadShared().catch(() => {}); } // zmiany z innych urządzeń i od innych osób
    });
  }

  function refreshSyncUi() {
    const card = document.getElementById('sync-card');
    if (card) renderSyncCard(card);
    // karta Rodzina zależy tylko od zalogowanego konta — nie przerysowuj jej przy każdej zmianie statusu
    const fam = document.getElementById('family-card');
    if (fam && fam.dataset.user !== String(sync.user ? sync.user.id : '')) renderFamilyCard(fam);
    const inv = document.getElementById('invites-card');
    if (inv && inv.dataset.admin !== String(sync.admin)) renderInvitesCard(inv);
  }

  function syncStatusText() {
    switch (sync.status) {
      case 'syncing': return '⏳ Synchronizuję…';
      case 'offline': return '📴 Brak internetu — zsynchronizuję po połączeniu.';
      case 'error': return '⚠️ Błąd: ' + sync.error;
      default: return sync.lastSync
        ? `✅ Ostatnia synchronizacja: ${sync.lastSync.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`
        : '✅ Połączono';
    }
  }

  function renderSyncCard(card) {
    const title = h('h2', null, '☁️ Synchronizacja');
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) {
      card.replaceChildren(title, h('p', { class: 'muted small' }, 'Synchronizacja nie jest jeszcze skonfigurowana (brak klucza Supabase w config.js). Postęp zapisuje się tylko na tym urządzeniu.'));
      return;
    }
    if (!sync.client) {
      card.replaceChildren(title, h('p', { class: 'muted small' }, 'Nie udało się wczytać modułu synchronizacji — sprawdź połączenie z internetem i odśwież stronę.'));
      return;
    }
    if (sync.user) {
      card.replaceChildren(title,
        h('p', null, 'Zalogowano jako ', h('b', null, sync.user.email || '—')),
        h('p', { class: 'muted small' }, syncStatusText()),
        h('p', { class: 'muted small' }, 'Postęp zapisuje się automatycznie po każdej odpowiedzi i łączy z innymi urządzeniami zalogowanymi na ten sam e-mail.'),
        h('div', { class: 'row' },
          h('button', { class: 'btn btn-primary', disabled: sync.busy, onClick: () => syncNow(true) }, '🔄 Synchronizuj teraz'),
          h('div', { class: 'spacer' }),
          h('button', { class: 'btn btn-ghost', onClick: async () => {
            if (sync.dirty) await syncNow();
            await sync.client.auth.signOut();
            toast('Wylogowano — postęp zostaje na tym urządzeniu');
          } }, 'Wyloguj')));
      return;
    }

    const msg = h('div', { class: 'muted small', style: 'min-height:1.5em' });
    const fail = (e) => { msg.textContent = '⚠️ ' + ((e && e.message) || e); };
    if (!sync.email) {
      const email = h('input', { type: 'text', inputmode: 'email', autocomplete: 'email', placeholder: 'adres e-mail', 'aria-label': 'Adres e-mail',
        value: sync.inviteEmail });
      const send = async () => {
        const v = email.value.trim();
        if (!/^\S+@\S+\.\S+$/.test(v)) { fail('Podaj poprawny adres e-mail.'); return; }
        msg.textContent = 'Wysyłam kod…';
        const { error } = await sync.client.auth.signInWithOtp({ email: v, options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname } });
        if (error) {
          // rejestracja wyłączona w panelu Supabase — komunikat biblioteki jest po angielsku
          fail(/signups? not allowed|signup.*disabled/i.test(error.message)
            ? 'Ten adres nie ma jeszcze konta w Study Cards. Poproś administratora o zaproszenie.' : error.message);
          return;
        }
        sync.email = v;
        renderSyncCard(card);
      };
      email.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
      card.replaceChildren();
      put(card, title,
        sync.inviteEmail ? h('p', { class: 'invite-hello' }, '🎉 Masz zaproszenie! Adres jest już wpisany — kliknij „Wyślij kod”, a potem wpisz kod z e-maila.') : null,
        h('p', { class: 'muted small' }, 'Zaloguj się tym samym e-mailem na telefonie i komputerze — postęp będzie wspólny. Bez hasła: dostaniesz kod w mailu.'),
        h('div', { class: 'field' }, email),
        h('button', { class: 'btn btn-primary', onClick: send }, 'Wyślij kod'),
        msg);
      return;
    }

    const code = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '10', placeholder: 'kod z e-maila', 'aria-label': 'Kod z e-maila', class: 'answer' });
    const verify = async () => {
      const token = code.value.replace(/\s/g, '');
      if (!/^\d{6,10}$/.test(token)) { fail('Wpisz kod z e-maila (same cyfry).'); return; }
      msg.textContent = 'Sprawdzam…';
      const { error } = await sync.client.auth.verifyOtp({ email: sync.email, token, type: 'email' });
      if (error) { fail(error.message); return; }
      sync.email = '';
      toast('Zalogowano — synchronizuję postęp ☁️');
    };
    code.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify(); });
    card.replaceChildren(title,
      h('p', { class: 'small' }, 'Wysłaliśmy kod na ', h('b', null, sync.email), '. Wpisz go poniżej (albo kliknij link w mailu na tym urządzeniu).'),
      h('div', { class: 'field' }, code),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onClick: verify }, 'Zaloguj'),
        h('button', { class: 'btn btn-ghost', onClick: () => { sync.email = ''; renderSyncCard(card); } }, 'Zmień e-mail')),
      msg);
    setTimeout(() => code.focus(), 30);
  }

  // ===================================================================
  // Rodzina: rodzic widzi postęp dzieci (Supabase: supabase/family.sql).
  // Rodzic tworzy kod rodziny, dziecko wpisuje go u siebie. Rodzic tylko czyta postęp i może zmienić ścieżkę.
  // ===================================================================
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bez 0/O i 1/I
  // Stan po stronie konta: kod rodzica, powiązania jako dziecko; null = jeszcze nie wczytano.
  const family = { code: null, asChild: null, error: '', loadedFor: null };

  const famErr = (e) => {
    const m = (e && e.message) || String(e);
    // brak tabel/funkcji = nie uruchomiono supabase/family.sql
    return /family_|join_family|set_child_level|schema cache|does not exist/i.test(m)
      ? 'Widok rodziny nie jest jeszcze włączony w bazie: uruchom supabase/family.sql w panelu Supabase.' : m;
  };

  async function loadFamily(force) {
    if (!sync.client || !sync.user) return;
    if (!force && family.loadedFor === sync.user.id) return;
    family.error = '';
    try {
      const [codeRes, linkRes] = await Promise.all([
        sync.client.from('family_codes').select('code').eq('parent_id', sync.user.id).maybeSingle(),
        sync.client.from('family_links').select('parent_id').eq('child_id', sync.user.id),
      ]);
      if (codeRes.error) throw codeRes.error;
      if (linkRes.error) throw linkRes.error;
      family.code = codeRes.data ? codeRes.data.code : '';
      family.asChild = linkRes.data || [];
      family.loadedFor = sync.user.id;
      if (family.code && !state.settings.parentMode) { state.settings.parentMode = true; save(); applyParentMode(); }
    } catch (e) {
      family.error = famErr(e);
    }
  }

  async function createFamilyCode() {
    for (let i = 0; i < 5; i++) {
      const code = Array.from(crypto.getRandomValues(new Uint32Array(6)), (n) => CODE_CHARS[n % CODE_CHARS.length]).join('');
      const { error } = await sync.client.from('family_codes').insert({ parent_id: sync.user.id, code });
      if (!error) { family.code = code; return; }
      if (!/duplicate|unique/i.test(error.message)) throw error; // powtórzony kod: losuj jeszcze raz
    }
    throw new Error('Nie udało się utworzyć kodu, spróbuj ponownie.');
  }

  function applyParentMode() {
    document.body.classList.toggle('parent-mode', !!state.settings.parentMode);
  }

  // Karta „Rodzina” w Ustawieniach: kod dla rodzica i dołączanie dla dziecka.
  // ===================================================================
  // Zaproszenia (supabase/invites.sql): konto może założyć tylko adres z listy zaproszeń.
  // Administrator dodaje adres i wysyła link (e-mailem albo komunikatorem); link wpisuje adres przy logowaniu.
  // ===================================================================
  const invites = { list: null, error: '', open: '' };

  async function checkAdmin() {
    if (!sync.client || !sync.user) return;
    const { data, error } = await sync.client.rpc('is_admin');
    sync.admin = !error && data === true; // brak funkcji (invites.sql nieuruchomione) = brak karty
    refreshSyncUi();
  }

  async function loadInvites() {
    const { data, error } = await sync.client.rpc('list_invites');
    invites.error = error ? error.message : '';
    invites.list = error ? [] : data || [];
  }

  const inviteLink = (email) => `${location.origin}${location.pathname}?zaproszenie=${encodeURIComponent(email)}#/settings`;
  function inviteMessage(inv) {
    return {
      subject: 'Zaproszenie do Study Cards',
      body: `Cześć${inv.name ? ' ' + inv.name : ''}!\n\n` +
        'Zapraszam Cię do Study Cards — aplikacji do nauki z fiszkami i powtórkami.\n\n' +
        `1. Otwórz link: ${inviteLink(inv.email)}\n` +
        `2. Twój adres (${inv.email}) będzie już wpisany — kliknij „Wyślij kod”.\n` +
        '3. Wpisz kod z e-maila i gotowe.\n\n' +
        'Na telefonie: menu przeglądarki → „Dodaj do ekranu głównego”, żeby mieć aplikację pod ręką.\n',
    };
  }

  function renderInvitesCard(card) {
    card.dataset.admin = String(sync.admin);
    card.classList.toggle('hidden', !sync.admin);
    if (!sync.admin) { card.replaceChildren(); return; }
    const title = h('h2', null, '✉️ Zaproszenia');
    if (invites.list === null) {
      card.replaceChildren(title, h('p', { class: 'muted small' }, 'Wczytuję…'));
      loadInvites().then(() => renderInvitesCard(card));
      return;
    }
    const msg = h('div', { class: 'muted small', style: 'min-height:1.5em' }, invites.error ? '⚠️ ' + invites.error : '');
    const emailIn = h('input', { type: 'text', inputmode: 'email', autocomplete: 'off', placeholder: 'adres e-mail', 'aria-label': 'E-mail osoby zapraszanej' });
    const nameIn = h('input', { type: 'text', maxlength: '30', placeholder: 'imię (opcjonalnie)', 'aria-label': 'Imię osoby zapraszanej' });
    const add = async () => {
      const email = emailIn.value.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = '⚠️ Podaj poprawny adres e-mail.'; emailIn.focus(); return; }
      msg.textContent = 'Dodaję…';
      const { error } = await sync.client.from('invites').insert({ email, name: nameIn.value.trim() || null });
      if (error && error.code !== '23505') { msg.textContent = '⚠️ ' + error.message; return; }
      invites.open = email; // od razu pokaż przyciski wysyłki
      await loadInvites();
      renderInvitesCard(card);
      toast(error ? 'Ten adres już jest na liście' : 'Dodano — teraz wyślij zaproszenie');
    };
    emailIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });

    const rows = invites.list.map((inv) => {
      const m = inviteMessage(inv);
      const full = `${m.body}`;
      const textBox = h('textarea', { readonly: 'readonly', rows: '7', class: 'hidden', 'aria-label': 'Treść zaproszenia', value: full });
      const copy = async () => {
        try { await navigator.clipboard.writeText(full); toast('Zaproszenie skopiowane — wklej je w SMS lub komunikatorze'); }
        catch (e) { textBox.classList.remove('hidden'); textBox.focus(); textBox.select(); toast('Schowek niedostępny — zaznaczony tekst skopiuj ręcznie.'); }
      };
      const share = async () => {
        try { await navigator.share({ title: m.subject, text: full }); } catch (e) { if (e && e.name !== 'AbortError') copy(); }
      };
      const remove = async () => {
        const what = inv.joined_at
          ? `Usunąć ${inv.email} z listy zaproszeń? Konto zostaje i działa dalej.`
          : `Wycofać zaproszenie dla ${inv.email}? Ten adres nie będzie mógł założyć konta.`;
        if (!confirm(what)) return;
        const { error } = await sync.client.from('invites').delete().eq('email', inv.email);
        if (error) { msg.textContent = '⚠️ ' + error.message; return; }
        await loadInvites();
        renderInvitesCard(card);
      };
      const status = inv.joined_at
        ? `✅ konto od ${fmtDate(inv.joined_at)}${inv.last_sign_in_at ? ` · ostatnio ${fmtDate(inv.last_sign_in_at)}` : ''}`
        : `⏳ czeka na pierwsze logowanie · zaproszono ${fmtDate(inv.invited_at)}`;
      const actions = inv.joined_at ? null : h('div', { class: 'row invite-actions' },
        h('a', { class: 'btn btn-primary', href: `mailto:${inv.email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}` }, '✉️ Wyślij e-mail'),
        navigator.share ? h('button', { class: 'btn', onClick: share }, '📤 Udostępnij') : null,
        h('button', { class: 'btn', onClick: copy }, '📋 Kopiuj'));
      const det = h('details', { class: 'pack', open: invites.open === inv.email },
        h('summary', null,
          h('span', { class: 'pack-name' }, inv.name ? `${inv.name} · ${inv.email}` : inv.email),
          h('span', { class: 'muted small' }, status)),
        h('div', { class: 'invite-body' },
          actions, textBox,
          h('div', { class: 'row', style: 'margin-top:8px' },
            h('div', { class: 'spacer' }),
            h('button', { class: 'btn btn-ghost', onClick: remove }, inv.joined_at ? 'Usuń z listy' : 'Wycofaj zaproszenie'))));
      det.addEventListener('toggle', () => { if (det.open) invites.open = inv.email; else if (invites.open === inv.email) invites.open = ''; });
      return det;
    });

    card.replaceChildren(title,
      h('p', { class: 'muted small' }, 'Konto w aplikacji może założyć tylko osoba z tej listy. Dodaj adres, a potem wyślij zaproszenie e-mailem lub komunikatorem — link sam wpisze adres przy logowaniu.'),
      h('div', { class: 'invite-form' }, emailIn, nameIn, h('button', { class: 'btn btn-primary', onClick: add }, '➕ Zaproś')),
      msg,
      ...(rows.length ? rows : [h('p', { class: 'muted small' }, 'Lista jest pusta.')]));
  }

  function renderFamilyCard(card) {
    card.dataset.user = sync.user ? sync.user.id : '';
    const title = h('h2', null, '👪 Rodzina');
    if (!sync.client || !sync.user) {
      card.replaceChildren(title, h('p', { class: 'muted small' },
        'Rodzic może podglądać postęp dzieci. Najpierw zaloguj się w karcie Synchronizacja (każdy na swoim koncie).'));
      return;
    }
    if (family.loadedFor !== sync.user.id && !family.error) {
      card.replaceChildren(title, h('p', { class: 'muted small' }, 'Wczytuję…'));
      loadFamily().then(() => renderFamilyCard(card));
      return;
    }
    const msg = h('div', { class: 'muted small', style: 'min-height:1.5em' }, family.error ? '⚠️ ' + family.error : '');
    const fail = (e) => { msg.textContent = '⚠️ ' + famErr(e); };

    // Rodzic
    const parentPart = family.code
      ? h('div', null,
        h('p', { class: 'small' }, 'Twój kod rodziny (dziecko wpisuje go u siebie w Ustawieniach):'),
        h('div', { class: 'family-code' }, family.code),
        h('a', { class: 'btn btn-primary', href: '#/family' }, '👪 Otwórz widok rodziny'))
      : h('div', null,
        h('p', { class: 'muted small' }, 'Jesteś rodzicem? Utwórz kod i przekaż go dzieciom. Zobaczysz ich postęp, ale nie zmienisz ich odpowiedzi.'),
        h('button', { class: 'btn', onClick: async () => {
          try { await createFamilyCode(); state.settings.parentMode = true; save(); applyParentMode(); renderFamilyCard(card); }
          catch (e) { fail(e); }
        } }, 'Utwórz kod rodziny'));

    // Dziecko
    let childPart;
    if (family.asChild && family.asChild.length) {
      childPart = h('div', null,
        h('p', { class: 'small' }, '✅ Twoje konto jest połączone z kontem rodzica. Rodzic widzi Twój postęp i może zmienić ścieżkę nauki, ale nie zmienia Twoich odpowiedzi.'),
        h('button', { class: 'btn btn-ghost', onClick: async () => {
          if (!confirm('Odłączyć konto od rodzica? Rodzic przestanie widzieć Twój postęp.')) return;
          const { error } = await sync.client.from('family_links').delete().eq('child_id', sync.user.id);
          if (error) { fail(error); return; }
          family.asChild = [];
          renderFamilyCard(card);
        } }, 'Odłącz od rodzica'));
    } else {
      const input = h('input', { type: 'text', maxlength: '12', placeholder: 'kod od rodzica', 'aria-label': 'Kod rodziny', autocapitalize: 'characters', class: 'answer' });
      const join = async () => {
        const code = input.value.replace(/\s/g, '').toUpperCase();
        if (code.length < 4) { msg.textContent = '⚠️ Wpisz kod od rodzica.'; return; }
        const { error } = await sync.client.rpc('join_family', { p_code: code, p_name: state.settings.name || null });
        if (error) { fail(error); return; }
        toast('Połączono z kontem rodzica 👪');
        await loadFamily(true);
        renderFamilyCard(card);
      };
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') join(); });
      childPart = h('div', null,
        h('p', { class: 'muted small' }, 'Masz kod od rodzica? Wpisz go, żeby rodzic widział Twój postęp.'),
        h('div', { class: 'row' }, input, h('button', { class: 'btn btn-primary', onClick: join }, 'Połącz')));
    }
    card.replaceChildren(title, parentPart, h('hr', { class: 'sep' }), childPart, msg);
  }

  // Podsumowanie postępu dziecka z jego stanu (wiersz progress.state).
  function childSummary(row) {
    const st = row.state || {};
    const settings = st.settings || {};
    const level = LEVELS[settings.level] ? settings.level : null;
    const prog = st.progress || {};
    const daily = st.daily || {};
    const gone = st.deletedCustom || {};
    const items = [...BASE_ITEMS, ...(st.customItems || []).filter((c) => c && !gone[c.id])].map(prepareItem).filter(Boolean);
    const byId = new Map(items.map((it) => [it.id, it]));
    const t = today();
    const subjects = (level ? LEVELS[level].subjects : []).map((key) => {
      const pool = items.filter((it) => it.subject === key);
      const stats = { total: pool.length, new: 0, learning: 0, mastered: 0 };
      for (const it of pool) stats[statusOf(it, prog)]++;
      const due = pool.filter((it) => prog[it.id] && prog[it.id].due <= t).length;
      return { key, stats, due };
    });
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(t, i - 6);
      return { d, n: (daily[d] && daily[d].answers) || 0 };
    });
    const lastDay = Object.keys(daily).filter((d) => daily[d].answers).sort().pop() || null;
    const hardest = Object.entries(prog)
      .map(([id, p]) => ({ it: byId.get(id), wrong: (p.attempts || 0) - (p.correct || 0), p }))
      .filter((x) => x.it && x.wrong > 0)
      .sort((a, b) => b.wrong - a.wrong || (a.p.correct / a.p.attempts) - (b.p.correct / b.p.attempts))
      .slice(0, 5);
    return { name: settings.name || '', level, subjects, week, today: (daily[t] && daily[t].answers) || 0, streak: streak(daily), lastDay, hardest };
  }

  const localDate = (d) => { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd); };
  const WEEKDAYS = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
  function dayAgo(d) {
    if (!d) return 'jeszcze się nie uczył(a)';
    const diff = Math.round((localDate(today()) - localDate(d)) / 864e5);
    return diff === 0 ? 'dziś' : diff === 1 ? 'wczoraj' : `${diff} dni temu (${fmtDate(d)})`;
  }

  function childCard(link, row, onChanged) {
    const name = (row && row.state && row.state.settings && row.state.settings.name) || link.child_name || link.child_email || 'Dziecko';
    const head = h('div', { class: 'child-head' },
      h('div', null, h('h2', { style: 'margin:0' }, name), h('div', { class: 'muted small' }, link.child_email || '')));
    const unlink = h('button', { class: 'btn btn-ghost btn-sm', onClick: async () => {
      if (!confirm(`Przestać śledzić postęp: ${name}?`)) return;
      const { error } = await sync.client.from('family_links').delete().eq('parent_id', sync.user.id).eq('child_id', link.child_id);
      if (error) { toast(famErr(error)); return; }
      onChanged();
    } }, 'Odłącz');
    if (!row) {
      return h('div', { class: 'card' }, head,
        h('p', { class: 'muted small' }, 'Brak zapisanego postępu. Dziecko musi raz zalogować się w aplikacji na swoim koncie.'), unlink);
    }
    const s = childSummary(row);
    const levelSel = h('select', { 'aria-label': 'Ścieżka nauki dziecka', onChange: async (e) => {
      const { error } = await sync.client.rpc('set_child_level', { p_child: link.child_id, p_level: e.target.value });
      if (error) { toast(famErr(error)); return; }
      toast('Zmieniono ścieżkę. Dziecko zobaczy ją po najbliższej synchronizacji.');
      onChanged();
    } },
    s.level ? null : h('option', { value: '' }, '— nie wybrano —'),
    Object.entries(LEVELS).map(([k, lv]) => h('option', { value: k, selected: k === s.level }, lv.label)));

    const max = Math.max(1, ...s.week.map((w) => w.n));
    const chart = h('div', { class: 'week-chart', role: 'img', 'aria-label': 'Odpowiedzi w ostatnich 7 dniach: ' + s.week.map((w) => w.n).join(', ') },
      s.week.map((w) => h('div', { class: 'week-col', title: `${fmtDate(w.d)}: ${w.n}` },
        h('span', { class: 'week-n' }, w.n ? String(w.n) : ''),
        h('div', { class: 'week-bar' + (w.n ? '' : ' empty'), style: `height:${Math.round((w.n / max) * 100)}%` }),
        h('span', { class: 'week-d' }, WEEKDAYS[localDate(w.d).getDay()]))));

    return h('div', { class: 'card' },
      head,
      h('div', { class: 'setting' }, h('div', { class: 'txt' }, h('b', null, 'Ścieżka nauki')), levelSel),
      h('div', { class: 'stat-row', style: 'margin-top:8px' },
        h('div', { class: 'stat' }, h('b', null, String(s.today)), h('span', null, 'odpowiedzi dziś')),
        h('div', { class: 'stat' }, h('b', { style: 'color:var(--warn)' }, `🔥 ${s.streak}`), h('span', null, plural(s.streak, 'dzień z rzędu', 'dni z rzędu', 'dni z rzędu'))),
        h('div', { class: 'stat' }, h('b', { class: 'small' }, dayAgo(s.lastDay)), h('span', null, 'ostatnia nauka'))),
      h('h3', null, 'Ostatnie 7 dni'), chart,
      s.subjects.length ? [h('h3', null, 'Przedmioty'),
        h('div', { class: 'cat-list' }, s.subjects.map((x) => h('div', { class: 'cat-row', style: 'cursor:default' },
          h('span', { class: 'cat-ico' }, SUBJECTS[x.key].icon),
          h('span', null, h('div', { class: 'cat-name' }, SUBJECTS[x.key].label), progressBar(x.stats)),
          h('span', { class: 'muted small', style: 'text-align:right;white-space:nowrap', title: 'opanowane / wszystkie karty' },
            `✓ ${x.stats.mastered}/${x.stats.total}`, h('br'), x.due ? `${x.due} do powtórki` : 'bez zaległości'))))] : null,
      s.hardest.length ? [h('h3', null, 'Najtrudniejsze karty'),
        h('div', { class: 'err-list' }, s.hardest.map((x) => h('div', { class: 'err' },
          h('div', { class: 'q' }, `${SUBJECTS[x.it.subject].icon} ${x.it._label}`),
          h('div', { class: 'a' }, '✓ ' + x.it._answer),
          h('div', { class: 'muted small' }, `${x.wrong} ${plural(x.wrong, 'błąd', 'błędy', 'błędów')} na ${x.p.attempts} ${plural(x.p.attempts, 'odpowiedź', 'odpowiedzi', 'odpowiedzi')}`))))] : null,
      h('p', { class: 'muted small', style: 'margin-top:12px' },
        `Dane z ostatniej synchronizacji dziecka: ${new Date(row.updated_at).toLocaleString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}.`),
      unlink);
  }

  async function renderFamily(view) {
    const title = h('h1', null, '👪 Rodzina');
    if (!sync.client || !sync.user) {
      view.replaceChildren(title, h('div', { class: 'card' },
        h('p', null, 'Widok rodziny wymaga zalogowania.'), h('a', { class: 'btn btn-primary', href: '#/settings' }, 'Przejdź do Ustawień')));
      return;
    }
    const body = h('div', null, h('div', { class: 'card muted' }, 'Wczytuję postęp dzieci…'));
    const reload = () => { if (currentRoute === 'family') renderFamily(view); };
    view.replaceChildren(title, h('div', { class: 'row', style: 'margin:-6px 0 14px' },
      h('span', { class: 'muted small' }, 'Postęp połączonych kont. Dane odświeżają się, gdy dziecko się uczy i jest online.'),
      h('div', { class: 'spacer' }), h('button', { class: 'btn btn-sm', onClick: reload }, '🔄 Odśwież')), body);
    try {
      await loadFamily(true);
      if (family.error) throw new Error(family.error);
      const { data: links, error } = await sync.client.from('family_links').select('child_id, child_email, child_name, created_at').eq('parent_id', sync.user.id).order('created_at');
      if (error) throw error;
      if (currentRoute !== 'family') return;
      if (!links.length) {
        body.replaceChildren(h('div', { class: 'card' },
          h('h2', null, 'Nie ma jeszcze połączonych dzieci'),
          family.code
            ? [h('p', { class: 'small' }, 'Kod rodziny do przekazania dzieciom:'), h('div', { class: 'family-code' }, family.code),
              h('p', { class: 'muted small' }, 'Dziecko wpisuje go na swoim koncie: Ustawienia → Rodzina → Połącz.')]
            : [h('p', { class: 'muted small' }, 'Najpierw utwórz kod rodziny w Ustawieniach.'), h('a', { class: 'btn btn-primary', href: '#/settings' }, 'Ustawienia')]));
        return;
      }
      const { data: rows, error: e2 } = await sync.client.from('progress').select('user_id, state, updated_at').in('user_id', links.map((l) => l.child_id));
      if (e2) throw e2;
      if (currentRoute !== 'family') return;
      const byUser = new Map(rows.map((r) => [r.user_id, r]));
      body.replaceChildren(...links.map((l) => childCard(l, byUser.get(l.child_id), reload)),
        family.code ? h('p', { class: 'muted small' }, 'Kod rodziny dla kolejnego dziecka: ', h('b', null, family.code)) : null);
    } catch (e) {
      body.replaceChildren(h('div', { class: 'card' }, h('p', null, '⚠️ ' + famErr(e))));
    }
  }

  // ===================================================================
  // Router i start
  // ===================================================================
  let currentRoute = '';
  const ROUTES = { dashboard: renderDashboard, learn: renderLearn, browse: renderBrowse, settings: renderSettings, session: renderSessionView, summary: renderSummary, materials: renderMaterials, family: renderFamily };
  const NAV_FOR = { session: 'learn', summary: 'learn' };

  function route() {
    const name = (location.hash.replace(/^#\/?/, '') || 'dashboard').split('?')[0];
    const key = ROUTES[name] ? name : 'dashboard';
    currentRoute = key;
    const view = document.getElementById('view');
    keyHandler = null;
    hideFeedback();
    view.classList.remove('flash-ok', 'flash-bad');
    document.body.classList.toggle('in-session', key === 'session');
    document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === (NAV_FOR[key] || key)));
    // Rodzic bez własnej ścieżki nauki: panel to widok rodziny.
    if (!state.settings.level && state.settings.parentMode && key === 'dashboard') { location.hash = '#/family'; return; }
    // Bez wybranej ścieżki: tylko ekran wyboru (i Ustawienia, żeby można było się zalogować).
    const onboarding = !state.settings.level && key !== 'settings' && !(key === 'family' && state.settings.parentMode);
    document.body.classList.toggle('no-level', !state.settings.level);
    if (key !== 'session') renderNav();
    if (onboarding) renderOnboarding(view);
    else ROUTES[key](view);
    window.scrollTo(0, 0);
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (feedbackContinue) {
      if ((e.key === 'Enter' || e.key === ' ') && Date.now() - feedbackAt > 250) { e.preventDefault(); feedbackContinue(); }
      return;
    }
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (keyHandler) keyHandler(e);
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  async function boot() {
    applyTheme();
    applyParentMode();
    try {
      await loadVocab();
    } catch (e) {
      document.getElementById('view').replaceChildren(h('div', { class: 'card' },
        h('h2', null, 'Nie udało się wczytać słownictwa'),
        h('p', null, 'Sprawdź połączenie z internetem i odśwież stronę. Jeśli otwierasz plik lokalnie, uruchom prosty serwer (np. python -m http.server).'),
        h('p', { class: 'muted small' }, String(e))));
      return;
    }
    window.addEventListener('hashchange', route);
    route();
    initSync().catch((e) => { sync.status = 'error'; sync.error = String(e); refreshSyncUi(); });
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  boot();
})();
