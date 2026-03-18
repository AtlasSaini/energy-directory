'use strict';

/**
 * seed-mining-vendors.js
 * Adds 12 mining categories + 120+ Canadian mining companies to energydirectory.ca
 */

const { createClient } = require('/mnt/c/Atlas/projects/energy-directory/node_modules/@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtbrsarvecxpnuesyypa.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY env var'); process.exit(1); }
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── STEP 1: Mining Categories ───────────────────────────────────────────────
const MINING_CATEGORIES = [
  { name: 'Gold Mining',                  slug: 'gold-mining',              description: 'Gold producers and explorers operating in Canada',                        icon: '🥇', sort_order: 24 },
  { name: 'Copper & Base Metals',         slug: 'copper-base-metals',       description: 'Copper, zinc, nickel and base metal mining companies',                    icon: '🔶', sort_order: 25 },
  { name: 'Coal Mining',                  slug: 'coal-mining',              description: 'Metallurgical and thermal coal producers',                                icon: '⚫', sort_order: 26 },
  { name: 'Uranium & Nuclear Fuels',      slug: 'uranium-nuclear-fuels',    description: 'Uranium mining, milling, and nuclear fuel companies',                     icon: '☢️', sort_order: 27 },
  { name: 'Potash & Fertilizer',          slug: 'potash-fertilizer',        description: 'Potash, phosphate and agricultural mineral producers',                    icon: '🌱', sort_order: 28 },
  { name: 'Iron Ore & Steel',             slug: 'iron-ore-steel',           description: 'Iron ore mining and steel production companies',                          icon: '🏗️', sort_order: 29 },
  { name: 'Lithium & Battery Metals',     slug: 'lithium-battery-metals',   description: 'Lithium, cobalt, manganese and battery mineral producers',                icon: '🔋', sort_order: 30 },
  { name: 'Diamonds & Precious Stones',   slug: 'diamonds-precious-stones', description: 'Diamond and gemstone mining companies',                                   icon: '💎', sort_order: 31 },
  { name: 'Mining Services & Equipment',  slug: 'mining-services-equipment','description': 'Mining equipment suppliers, contractors and service providers',         icon: '⛏️', sort_order: 32 },
  { name: 'Mineral Exploration',          slug: 'mineral-exploration',      description: 'Junior and senior exploration companies searching for mineral deposits',   icon: '🔍', sort_order: 33 },
  { name: 'Mine Engineering & Consulting',slug: 'mine-engineering-consulting','description':'Engineering, EPCM and technical consulting for mining projects',         icon: '📐', sort_order: 34 },
  { name: 'Mine Safety & Environment',    slug: 'mine-safety-environment',  description: 'Environmental, reclamation, health and safety services for mines',        icon: '🦺', sort_order: 35 },
];

// ─── STEP 2: Mining Vendors ───────────────────────────────────────────────────
// Categories will be resolved after insert; we reference by slug.
const VENDORS = [

  // ── Gold Mining ──────────────────────────────────────────────────────────────
  {
    company_name: 'Barrick Gold Corporation',
    slug: 'barrick-gold-corporation',
    description: 'Barrick Gold is one of the world\'s largest gold mining companies, headquartered in Toronto, Ontario. The company operates mines across Canada, the United States, Africa, and Latin America. Barrick is listed on both the NYSE and TSX and is a member of the S&P 500.',
    website: 'https://www.barrick.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'Agnico Eagle Mines',
    slug: 'agnico-eagle-mines',
    description: 'Agnico Eagle is a senior Canadian gold mining company headquartered in Toronto, Ontario. Founded in 1957, the company operates mines in Canada, Finland, Mexico, and Australia. Major Canadian operations include the LaRonde, Meadowbank, and Meliadine mines.',
    website: 'https://www.agnicoeagle.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'Kinross Gold Corporation',
    slug: 'kinross-gold-corporation',
    description: 'Kinross Gold is a senior Canadian gold mining company headquartered in Toronto. The company operates gold mines in the United States, Brazil, Mauritania, Chile, and Ghana, and is listed on the TSX and NYSE.',
    website: 'https://www.kinross.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining'],
  },
  {
    company_name: 'Yamana Gold',
    slug: 'yamana-gold',
    description: 'Yamana Gold is a Canadian precious metals producer with gold and silver operations in Canada and South America. Headquartered in Toronto, the company has grown through both acquisitions and mine development.',
    website: 'https://www.yamana.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining'],
  },
  {
    company_name: 'Iamgold Corporation',
    slug: 'iamgold-corporation',
    description: 'IAMGOLD is a mid-tier Canadian gold producer headquartered in Toronto with mines and advanced development projects in North America and West Africa. The company\'s flagship Canadian project is the Côté Gold mine in Ontario.',
    website: 'https://www.iamgold.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'Wesdome Gold Mines',
    slug: 'wesdome-gold-mines',
    description: 'Wesdome Gold Mines is a Canadian gold producer operating the Eagle River mine complex in Wawa, Ontario and the Kiena mine in Val-d\'Or, Quebec. The company focuses on high-grade underground gold mining in Canada.',
    website: 'https://www.wesdome.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining'],
  },
  {
    company_name: 'Alamos Gold',
    slug: 'alamos-gold',
    description: 'Alamos Gold is a Canadian gold producer with two operating gold mines in Canada and one in Mexico. The company\'s Canadian operations include the Island Gold mine in Ontario and the Lynn Lake project in Manitoba.',
    website: 'https://www.alamosgold.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'Equinox Gold Corp',
    slug: 'equinox-gold-corp',
    description: 'Equinox Gold is a Canadian gold producer with operating mines in Canada, the United States, Mexico, and Brazil. The company\'s Greenstone mine in Ontario is one of Canada\'s largest new gold mining operations.',
    website: 'https://www.equinoxgold.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining'],
  },
  {
    company_name: 'SSR Mining',
    slug: 'ssr-mining',
    description: 'SSR Mining is a diversified gold producer headquartered in Vancouver, British Columbia with operations in the United States, Turkey, Argentina, and Canada. The company was formerly known as Silver Standard Resources.',
    website: 'https://www.ssrmining.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining'],
  },
  {
    company_name: 'Pan American Silver Corp',
    slug: 'pan-american-silver-corp',
    description: 'Pan American Silver is a Canadian mining company primarily focused on silver, gold, zinc, lead, and copper. Headquartered in Vancouver, the company operates across Latin America and is listed on both the TSX and NASDAQ.',
    website: 'https://www.panamericansilver.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining', 'copper-base-metals'],
  },
  {
    company_name: 'Endeavour Silver Corp',
    slug: 'endeavour-silver-corp',
    description: 'Endeavour Silver is a Canadian silver and gold mining company with operations in Mexico and a flagship development project at Terronera. The company is headquartered in Vancouver and listed on the TSX and NYSE.',
    website: 'https://www.edrsilver.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining'],
  },
  {
    company_name: 'Torex Gold Resources',
    slug: 'torex-gold-resources',
    description: 'Torex Gold is a Canadian intermediate gold producer headquartered in Toronto. The company operates the El Limón-Guajes mine complex in Guerrero, Mexico and is developing the Media Luna project adjacent to existing operations.',
    website: 'https://www.torexgold.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining'],
  },

  // ── Copper & Base Metals ─────────────────────────────────────────────────────
  {
    company_name: 'Teck Resources Limited',
    slug: 'teck-resources-limited',
    description: 'Teck Resources is a diversified Canadian mining company headquartered in Vancouver, BC. The company is Canada\'s largest diversified mining company with operations in copper, steelmaking coal, zinc, and energy. Major assets include Highland Valley Copper and the Quebrada Blanca copper mine.',
    website: 'https://www.teck.com',
    province: 'BC', city: 'Vancouver',
    categories: ['copper-base-metals', 'coal-mining'],
  },
  {
    company_name: 'First Quantum Minerals',
    slug: 'first-quantum-minerals',
    description: 'First Quantum Minerals is a Canadian copper mining company headquartered in Vancouver, BC. The company operates copper mines in Zambia, Panama, and other jurisdictions. First Quantum\'s Cobre Panama mine was one of the world\'s largest new copper mines when it opened.',
    website: 'https://www.first-quantum.com',
    province: 'BC', city: 'Vancouver',
    categories: ['copper-base-metals'],
  },
  {
    company_name: 'Hudbay Minerals',
    slug: 'hudbay-minerals',
    description: 'Hudbay Minerals is a diversified Canadian mining company headquartered in Toronto. The company owns and operates mines in Manitoba, British Columbia, Arizona, and Peru. Key assets include the Constancia copper mine in Peru and operations in the Snow Lake area of Manitoba.',
    website: 'https://www.hudbayminerals.com',
    province: 'ON', city: 'Toronto',
    categories: ['copper-base-metals', 'gold-mining'],
  },
  {
    company_name: 'Lundin Mining Corporation',
    slug: 'lundin-mining-corporation',
    description: 'Lundin Mining is a Canadian diversified base metals mining company headquartered in Toronto. The company operates copper, zinc, gold, and nickel mines in Europe, South America, and the United States. Key assets include the Candelaria copper mine in Chile.',
    website: 'https://www.lundinmining.com',
    province: 'ON', city: 'Toronto',
    categories: ['copper-base-metals', 'gold-mining'],
  },
  {
    company_name: 'Copper Mountain Mining',
    slug: 'copper-mountain-mining',
    description: 'Copper Mountain Mining is a Canadian copper producer operating the Copper Mountain Mine in southern British Columbia, one of Canada\'s largest open-pit copper mines. The company is headquartered in Vancouver and listed on the TSX.',
    website: 'https://www.coppermountainmining.com',
    province: 'BC', city: 'Vancouver',
    categories: ['copper-base-metals'],
  },
  {
    company_name: 'Taseko Mines Limited',
    slug: 'taseko-mines-limited',
    description: 'Taseko Mines is a Canadian copper mining company headquartered in Vancouver operating the Gibraltar Mine in British Columbia, one of the largest open-pit copper mines in Canada. The company also holds permits for the New Prosperity copper-gold project in BC.',
    website: 'https://www.tasekomines.com',
    province: 'BC', city: 'Vancouver',
    categories: ['copper-base-metals'],
  },
  {
    company_name: 'Falco Resources',
    slug: 'falco-resources',
    description: 'Falco Resources is a Canadian mineral exploration company focused on the Horne 5 project in Rouyn-Noranda, Quebec — one of the largest undeveloped gold, silver, copper, and zinc deposits in Canada. The project is adjacent to the former Horne Mine.',
    website: 'https://www.falcores.com',
    province: 'QC', city: 'Rouyn-Noranda',
    categories: ['copper-base-metals', 'mineral-exploration'],
  },
  {
    company_name: 'Foran Mining Corporation',
    slug: 'foran-mining-corporation',
    description: 'Foran Mining is a Canadian copper-zinc-gold-silver developer working to develop the McIlvenna Bay deposit in Saskatchewan. The company is focused on becoming a copper-zinc producer through development of the Flin Flon Greenstone Belt corridor.',
    website: 'https://www.foranmining.com',
    province: 'SK', city: 'Saskatoon',
    categories: ['copper-base-metals', 'mineral-exploration'],
  },

  // ── Coal Mining ──────────────────────────────────────────────────────────────
  {
    company_name: 'Elk Valley Resources',
    slug: 'elk-valley-resources',
    description: 'Elk Valley Resources (formerly Teck\'s steelmaking coal business) is one of the world\'s largest producers of seaborne steelmaking coal. The company operates five mines in the Elk Valley region of southeastern British Columbia, supplying metallurgical coal for global steel production.',
    website: 'https://www.elkvalleyresources.com',
    province: 'BC', city: 'Sparwood',
    categories: ['coal-mining'],
  },
  {
    company_name: 'Glencore Canada',
    slug: 'glencore-canada',
    description: 'Glencore Canada operates coal, zinc, and copper assets across Canada. Through its Produits Miniers Glencore subsidiary, the company owns the Raglan nickel-copper mine in Northern Quebec and the Sudbury Integrated Nickel Operations in Ontario.',
    website: 'https://www.glencore.ca',
    province: 'ON', city: 'Toronto',
    categories: ['coal-mining', 'copper-base-metals'],
  },
  {
    company_name: 'Coalspur Mines',
    slug: 'coalspur-mines',
    description: 'Coalspur Mines is a thermal coal producer developing the Vista Coal Mine project near Hinton, Alberta — one of the largest coal development projects in Canada. The company holds significant thermal coal resources in the Alberta foothills.',
    website: 'https://www.coalspur.com',
    province: 'AB', city: 'Calgary',
    categories: ['coal-mining'],
  },
  {
    company_name: 'Conuma Coal Resources',
    slug: 'conuma-coal-resources',
    description: 'Conuma Coal Resources is a Canadian metallurgical coal producer operating three mines in northeastern British Columbia: the Brule, Willow Creek, and Wolverine mines. The company produces hard coking coal and semi-soft coking coal for global steelmakers.',
    website: 'https://www.conumacoal.com',
    province: 'BC', city: 'Tumbler Ridge',
    categories: ['coal-mining'],
  },
  {
    company_name: 'NACCO Industries Canada',
    slug: 'nacco-industries-canada',
    description: 'NACCO Industries operates surface coal mining operations in Western Canada supplying thermal coal to power generation utilities. The company specializes in contract coal mining with long-term supply agreements.',
    website: 'https://www.nacco.com',
    province: 'AB', city: 'Edmonton',
    categories: ['coal-mining'],
  },

  // ── Uranium & Nuclear Fuels ──────────────────────────────────────────────────
  {
    company_name: 'Cameco Corporation',
    slug: 'cameco-corporation',
    description: 'Cameco Corporation is the world\'s largest publicly traded uranium company, headquartered in Saskatoon, Saskatchewan. Cameco operates the McArthur River and Cigar Lake mines in northern Saskatchewan — two of the world\'s highest-grade uranium mines. The company also provides nuclear fuel processing and services.',
    website: 'https://www.cameco.com',
    province: 'SK', city: 'Saskatoon',
    categories: ['uranium-nuclear-fuels'],
  },
  {
    company_name: 'Denison Mines Corp',
    slug: 'denison-mines-corp',
    description: 'Denison Mines is a Canadian uranium developer and exploration company with assets in the Athabasca Basin region of Saskatchewan. The company\'s flagship Wheeler River project is one of the most significant uranium development projects globally, hosting the Phoenix and Gryphon uranium deposits.',
    website: 'https://www.denisonmines.com',
    province: 'ON', city: 'Toronto',
    categories: ['uranium-nuclear-fuels', 'mineral-exploration'],
  },
  {
    company_name: 'NexGen Energy',
    slug: 'nexgen-energy',
    description: 'NexGen Energy is a Canadian uranium development company advancing the Rook I project in the Athabasca Basin, Saskatchewan. The Arrow deposit at Rook I is one of the world\'s largest undeveloped high-grade uranium deposits and is among the world\'s highest-grade uranium development projects.',
    website: 'https://www.nexgenenergy.ca',
    province: 'BC', city: 'Vancouver',
    categories: ['uranium-nuclear-fuels', 'mineral-exploration'],
  },
  {
    company_name: 'Fission Uranium Corp',
    slug: 'fission-uranium-corp',
    description: 'Fission Uranium is a Canadian uranium developer focused on the Triple R uranium deposit at the Patterson Lake South project in Saskatchewan\'s Athabasca Basin. The deposit is one of the world\'s largest, highest-grade uranium discoveries in recent years.',
    website: 'https://www.fissionuranium.com',
    province: 'BC', city: 'Kelowna',
    categories: ['uranium-nuclear-fuels', 'mineral-exploration'],
  },
  {
    company_name: 'Uranium Energy Corp Canada',
    slug: 'uranium-energy-corp-canada',
    description: 'Uranium Energy Corp holds uranium assets in the Athabasca Basin of Saskatchewan and the Thelon Basin of Nunavut through its Canadian subsidiary. The company is an in-situ recovery uranium mining developer with operations and development projects across Canada and the United States.',
    website: 'https://www.uraniumenergy.com',
    province: 'SK', city: 'Saskatoon',
    categories: ['uranium-nuclear-fuels', 'mineral-exploration'],
  },
  {
    company_name: 'Orano Canada',
    slug: 'orano-canada',
    description: 'Orano Canada (formerly AREVA Resources Canada) is a uranium mining and exploration company operating in northern Saskatchewan\'s Athabasca Basin. The company holds interests in the McClean Lake uranium mill and the Cigar Lake mine, and continues to explore for new uranium deposits.',
    website: 'https://www.orano.group/en/our-activities/mining/canada',
    province: 'SK', city: 'Saskatoon',
    categories: ['uranium-nuclear-fuels'],
  },

  // ── Potash & Fertilizer ──────────────────────────────────────────────────────
  {
    company_name: 'Nutrien Ltd',
    slug: 'nutrien-ltd',
    description: 'Nutrien is the world\'s largest producer of potash and one of the largest producers of nitrogen and phosphate, headquartered in Saskatoon, Saskatchewan. Formed by the 2018 merger of PotashCorp and Agrium, the company operates mines and production facilities across Saskatchewan and New Brunswick, supplying crop nutrients globally.',
    website: 'https://www.nutrien.com',
    province: 'SK', city: 'Saskatoon',
    categories: ['potash-fertilizer'],
  },
  {
    company_name: 'Mosaic Company Canada',
    slug: 'mosaic-company-canada',
    description: 'The Mosaic Company is a major potash and phosphate producer with significant operations in Saskatchewan, Canada. The company operates the Esterhazy, Colonsay, and Belle Plaine potash mines in Saskatchewan and is one of the world\'s largest potash producers.',
    website: 'https://www.mosaicco.com',
    province: 'SK', city: 'Regina',
    categories: ['potash-fertilizer'],
  },
  {
    company_name: 'BHP Canada Potash',
    slug: 'bhp-canada-potash',
    description: 'BHP is developing the Jansen Potash Project in Saskatchewan, one of the world\'s largest potash development projects. The underground mine is expected to produce approximately 4.35 million tonnes of potash per year and is one of the largest mining investments in Canadian history.',
    website: 'https://www.bhp.com/what-we-do/projects/jansen',
    province: 'SK', city: 'Saskatoon',
    categories: ['potash-fertilizer'],
  },
  {
    company_name: 'Western Potash Corp',
    slug: 'western-potash-corp',
    description: 'Western Potash Corp is a Canadian potash developer with the Milestone potash project located south of Regina, Saskatchewan. The company is advancing a conventional underground potash mine and is one of several new entrants into Saskatchewan\'s potash industry.',
    website: 'https://www.westernpotash.com',
    province: 'SK', city: 'Regina',
    categories: ['potash-fertilizer', 'mineral-exploration'],
  },
  {
    company_name: 'Verde AgriTech',
    slug: 'verde-agritech',
    description: 'Verde AgriTech is a Canadian agricultural technology and potassium fertilizer producer headquartered in Ottawa. The company produces K Forte and Super Greensand multi-nutrient fertilizers from its plant in Brazil, offering sustainable alternatives to conventional potash.',
    website: 'https://www.verde.ag',
    province: 'ON', city: 'Ottawa',
    categories: ['potash-fertilizer'],
  },

  // ── Iron Ore & Steel ─────────────────────────────────────────────────────────
  {
    company_name: 'Champion Iron Limited',
    slug: 'champion-iron-limited',
    description: 'Champion Iron is a Canadian iron ore producer headquartered in Montreal, Quebec. The company operates the Bloom Lake iron ore mine in the Labrador Trough region of Quebec. Champion Iron produces high-grade iron ore concentrate (66% Fe) for global steel markets.',
    website: 'https://www.championiron.com',
    province: 'QC', city: 'Montreal',
    categories: ['iron-ore-steel'],
  },
  {
    company_name: 'ArcelorMittal Mines Canada',
    slug: 'arcelormittal-mines-canada',
    description: 'ArcelorMittal Mines Canada operates the Mont-Wright iron ore mining complex near Fermont, Quebec and the Port-Cartier pellet plant — one of the world\'s largest open-pit iron ore mines. The operation produces iron ore pellets and concentrate for ArcelorMittal\'s global steel operations.',
    website: 'https://corporate.arcelormittal.com/who-we-are/geographic-presence/arcelormittal-mines-canada',
    province: 'QC', city: 'Fermont',
    categories: ['iron-ore-steel'],
  },
  {
    company_name: 'Rio Tinto Iron & Titanium Canada',
    slug: 'rio-tinto-iron-titanium-canada',
    description: 'Rio Tinto Iron & Titanium operates the largest mineral sands complex in the world at its Quebec facilities, mining ilmenite, titanium dioxide slag, and high-purity iron products. The operation at Havre-Saint-Pierre, Quebec is a global leader in titanium minerals.',
    website: 'https://www.riotinto.com/operations/canada',
    province: 'QC', city: 'Havre-Saint-Pierre',
    categories: ['iron-ore-steel'],
  },
  {
    company_name: 'Labrador Iron Ore Royalty Corporation',
    slug: 'labrador-iron-ore-royalty-corporation',
    description: 'Labrador Iron Ore Royalty Corporation (LIORC) holds a royalty and equity interest in the Iron Ore Company of Canada (IOC), one of Canada\'s largest iron ore producers. IOC operates iron ore mines and processing facilities near Labrador City, Newfoundland and Labrador.',
    website: 'https://www.liorc.ca',
    province: 'ON', city: 'Toronto',
    categories: ['iron-ore-steel'],
  },

  // ── Lithium & Battery Metals ─────────────────────────────────────────────────
  {
    company_name: 'Lithium Americas Corp',
    slug: 'lithium-americas-corp',
    description: 'Lithium Americas is a Canadian lithium development company headquartered in Vancouver, BC. The company is developing the Thacker Pass lithium project in Nevada — one of the largest lithium deposits in the United States — and holds exploration assets in Argentina.',
    website: 'https://www.lithiumamericas.com',
    province: 'BC', city: 'Vancouver',
    categories: ['lithium-battery-metals', 'mineral-exploration'],
  },
  {
    company_name: 'Standard Lithium Ltd',
    slug: 'standard-lithium-ltd',
    description: 'Standard Lithium is a Canadian technology and lithium development company headquartered in Vancouver. The company is developing the South West Arkansas Lithium Project and holds the SWA project in Arkansas and the Lanxess project — a direct lithium extraction facility using a novel selective extraction process.',
    website: 'https://www.standardlithium.com',
    province: 'BC', city: 'Vancouver',
    categories: ['lithium-battery-metals', 'mineral-exploration'],
  },
  {
    company_name: 'Patriot Battery Metals',
    slug: 'patriot-battery-metals',
    description: 'Patriot Battery Metals is a Canadian lithium explorer focused on the Corvette lithium project in the James Bay region of Quebec — one of the most significant lithium discoveries in North America in recent years. The project hosts spodumene pegmatite mineralization across a large strike length.',
    website: 'https://www.patriotbatterymetals.com',
    province: 'BC', city: 'Vancouver',
    categories: ['lithium-battery-metals', 'mineral-exploration'],
  },
  {
    company_name: 'Frontier Lithium',
    slug: 'frontier-lithium',
    description: 'Frontier Lithium is a Canadian lithium development company advancing the PAK Lithium Project in the electric vehicle hub of northern Ontario. The project hosts one of North America\'s largest, highest-grade spodumene lithium deposits and is being developed as a fully integrated lithium hydroxide producer.',
    website: 'https://www.frontierlithium.com',
    province: 'ON', city: 'Thunder Bay',
    categories: ['lithium-battery-metals', 'mineral-exploration'],
  },
  {
    company_name: 'Sigma Lithium Corporation',
    slug: 'sigma-lithium-corporation',
    description: 'Sigma Lithium is a Canadian lithium producer with operations in Brazil. The company produces battery-grade lithium concentrate from the Grota do Cirilo project in Minas Gerais and is focused on sustainable, carbon-neutral lithium production for the EV battery supply chain.',
    website: 'https://www.sigmalithiumresources.com',
    province: 'BC', city: 'Vancouver',
    categories: ['lithium-battery-metals'],
  },
  {
    company_name: 'Sayona Mining',
    slug: 'sayona-mining',
    description: 'Sayona Mining (with significant Canadian operations through Sayona Quebec) is a lithium developer with the North American Lithium project and Authier Lithium project in Quebec. The company is working to develop Quebec\'s lithium resources to supply the North American EV battery market.',
    website: 'https://www.sayonamining.com.au',
    province: 'QC', city: 'Val-d\'Or',
    categories: ['lithium-battery-metals', 'mineral-exploration'],
  },
  {
    company_name: 'Electra Battery Materials',
    slug: 'electra-battery-materials',
    description: 'Electra Battery Materials is a Canadian battery materials developer focused on building North America\'s only cobalt refinery in Ontario. The company is developing a battery materials complex including cobalt sulfate production and a black mass recycling facility to supply the North American EV battery supply chain.',
    website: 'https://www.electrabmc.com',
    province: 'ON', city: 'Toronto',
    categories: ['lithium-battery-metals'],
  },
  {
    company_name: 'Canada Nickel Company',
    slug: 'canada-nickel-company',
    description: 'Canada Nickel Company is a Canadian battery metals developer advancing the Crawford Nickel-Cobalt Sulphide Project near Timmins, Ontario — one of the world\'s largest nickel sulphide deposits. The project is positioned to supply nickel for EV batteries from a Canadian source.',
    website: 'https://canadanickel.com',
    province: 'ON', city: 'Toronto',
    categories: ['lithium-battery-metals', 'mineral-exploration'],
  },

  // ── Diamonds & Precious Stones ───────────────────────────────────────────────
  {
    company_name: 'De Beers Canada',
    slug: 'de-beers-canada',
    description: 'De Beers Canada operates the Victor diamond mine (now closed) and the Gahcho Kué mine in the Northwest Territories in joint venture with Mountain Province Diamonds. The company continues to explore for new diamond deposits across Canada, including projects in Ontario and the Northwest Territories.',
    website: 'https://www.debeersgroup.com/canada',
    province: 'ON', city: 'Toronto',
    categories: ['diamonds-precious-stones'],
  },
  {
    company_name: 'Mountain Province Diamonds',
    slug: 'mountain-province-diamonds',
    description: 'Mountain Province Diamonds is a Canadian diamond producer with a 49% interest in the Gahcho Kué Diamond Mine in the Northwest Territories, operated by De Beers Canada. Mountain Province sells its rough diamond production through its own marketing arrangements.',
    website: 'https://www.mountainprovince.com',
    province: 'ON', city: 'Toronto',
    categories: ['diamonds-precious-stones'],
  },
  {
    company_name: 'Lucara Diamond Corp',
    slug: 'lucara-diamond-corp',
    description: 'Lucara Diamond Corp is a Vancouver-based diamond mining company operating the Karowe diamond mine in Botswana, one of the world\'s most valuable diamond mines. Karowe has produced several of the world\'s largest gem-quality diamonds, including the 1,109-carat Lesedi La Rona.',
    website: 'https://www.lucaradiamond.com',
    province: 'BC', city: 'Vancouver',
    categories: ['diamonds-precious-stones'],
  },
  {
    company_name: 'Dominion Diamond Mines',
    slug: 'dominion-diamond-mines',
    description: 'Dominion Diamond Mines operates the Ekati Diamond Mine in the Northwest Territories, Canada — the country\'s first surface and underground diamond mine. The mine produces gem-quality rough diamonds and is a significant employer in the NWT.',
    website: 'https://www.dominiondiamondmines.com',
    province: 'NT', city: 'Yellowknife',
    categories: ['diamonds-precious-stones'],
  },
  {
    company_name: 'Shore Gold',
    slug: 'shore-gold',
    description: 'Shore Gold is a Saskatchewan-based diamond exploration company that discovered and delineated the Fort à la Corne diamond fields in central Saskatchewan — one of the world\'s largest kimberlite fields. The company has conducted extensive exploration and preliminary feasibility work on the Star-Orion South diamond project.',
    website: 'https://www.shoregold.com',
    province: 'SK', city: 'Saskatoon',
    categories: ['diamonds-precious-stones', 'mineral-exploration'],
  },

  // ── Mining Services & Equipment ──────────────────────────────────────────────
  {
    company_name: 'Finning International',
    slug: 'finning-international',
    description: 'Finning International is the world\'s largest Caterpillar equipment dealer, headquartered in Vancouver, BC. The company sells, rents, and provides parts and service for Caterpillar equipment and engines across Western Canada, South America, and the UK and Ireland, serving mining, construction, forestry, and petroleum industries.',
    website: 'https://www.finning.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'Toromont Industries',
    slug: 'toromont-industries',
    description: 'Toromont Industries is the Caterpillar equipment dealer for Ontario, Quebec, Manitoba, and Atlantic Canada. The company provides equipment, parts, and service for mining, construction, and power generation through its WAJAX and Battlefield equipment divisions.',
    website: 'https://www.toromont.com',
    province: 'ON', city: 'Concord',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'SMS Equipment',
    slug: 'sms-equipment',
    description: 'SMS Equipment is a leading Komatsu mining and construction equipment dealer headquartered in Acheson, Alberta. The company serves Western Canada and Nunavut with equipment sales, rentals, parts, and full-service support for surface and underground mining operations.',
    website: 'https://www.smsequipment.com',
    province: 'AB', city: 'Acheson',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'Nuna Group of Companies',
    slug: 'nuna-group-of-companies',
    description: 'Nuna Group of Companies is an Indigenous-owned Canadian mining contractor headquartered in Edmonton, Alberta. The company provides contract mining, civil construction, and road building services primarily in Northern Canada, and is one of Canada\'s largest Indigenous-owned businesses.',
    website: 'https://www.nunagroup.com',
    province: 'AB', city: 'Edmonton',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'Explor Research',
    slug: 'explor-research',
    description: 'Explor Research is a Canadian geophysical survey and mineral exploration services company headquartered in Sudbury, Ontario. The company provides airborne and ground geophysical survey services, 3D modelling, and mineral exploration data management to mining companies across Canada and internationally.',
    website: 'https://www.explor.ca',
    province: 'ON', city: 'Sudbury',
    categories: ['mining-services-equipment', 'mineral-exploration'],
  },
  {
    company_name: 'Boart Longyear Canada',
    slug: 'boart-longyear-canada',
    description: 'Boart Longyear is a global leader in mineral drilling services and equipment with significant operations across Canada. The company provides diamond core drilling services, reverse circulation drilling, and manufactures drilling consumables for mining exploration and development projects.',
    website: 'https://www.boartlongyear.com',
    province: 'AB', city: 'Calgary',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'Major Drilling Group International',
    slug: 'major-drilling-group-international',
    description: 'Major Drilling Group International is one of the world\'s largest mineral drilling companies, headquartered in Moncton, New Brunswick. The company provides contract drilling services for mineral exploration and development projects in over 20 countries, with extensive operations in Canada and remote locations.',
    website: 'https://www.majordrilling.com',
    province: 'NB', city: 'Moncton',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'Foraco International',
    slug: 'foraco-international',
    description: 'Foraco International is a global mineral and water drilling company with a significant Canadian presence. Headquartered in Montreal, the company provides drilling services for mineral exploration, resource delineation, and environmental drilling across Canada and internationally.',
    website: 'https://www.foraco.com',
    province: 'QC', city: 'Montreal',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'Cementation Americas',
    slug: 'cementation-americas',
    description: 'Cementation Americas is a leading underground mine development contractor headquartered in North Bay, Ontario. The company specializes in shaft sinking, underground mining, and mine development for the Canadian mining industry, with projects across Canada and internationally.',
    website: 'https://www.cementation.com',
    province: 'ON', city: 'North Bay',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'MacLean Engineering & Marketing',
    slug: 'maclean-engineering-marketing',
    description: 'MacLean Engineering & Marketing is a Canadian underground mining equipment manufacturer headquartered in Collingwood, Ontario. The company designs and builds mobile equipment for underground mining including boom trucks, scissor lifts, and utility vehicles for mines across Canada and globally.',
    website: 'https://www.macleansupports.com',
    province: 'ON', city: 'Collingwood',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'Epiroc Canada',
    slug: 'epiroc-canada',
    description: 'Epiroc Canada is a leading provider of innovative drilling solutions, rock excavation equipment, and construction tools for mining and civil construction. With Canadian headquarters in Montreal, Epiroc serves underground and surface mining operations across Canada with world-class equipment and aftermarket services.',
    website: 'https://www.epiroc.com/en-ca',
    province: 'QC', city: 'Montreal',
    categories: ['mining-services-equipment'],
  },
  {
    company_name: 'Sandvik Mining Canada',
    slug: 'sandvik-mining-canada',
    description: 'Sandvik Mining and Rock Solutions provides mining equipment, tools, service and technical solutions for the Canadian mining industry. With operations across Canada, Sandvik offers underground and surface drilling, rock cutting, material handling and crushing equipment for mining customers.',
    website: 'https://www.home.sandvik/en/industries/mining/',
    province: 'ON', city: 'Burlington',
    categories: ['mining-services-equipment'],
  },

  // ── Mineral Exploration ──────────────────────────────────────────────────────
  {
    company_name: 'Probe Metals',
    slug: 'probe-metals',
    description: 'Probe Metals is a Canadian junior gold exploration company focused on the Val-d\'Or East gold project in the Abitibi greenstone belt of Quebec. The company has identified a significant gold resource at the Monique and Lynx deposits and is advancing the project toward production.',
    website: 'https://www.probemetals.com',
    province: 'QC', city: 'Val-d\'Or',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Osisko Mining',
    slug: 'osisko-mining',
    description: 'Osisko Mining is a Canadian gold exploration and development company headquartered in Montreal. The company is advancing the Windfall gold deposit in the Abitibi greenstone belt of Quebec — one of the highest-grade gold resources in Canada — toward production.',
    website: 'https://www.osiskomining.com',
    province: 'QC', city: 'Montreal',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Osisko Gold Royalties',
    slug: 'osisko-gold-royalties',
    description: 'Osisko Gold Royalties is a Canadian precious metal royalty company based in Montreal with a portfolio of royalties, streams and precious metal offtakes on properties across the Americas. The company provides financing to mining companies in exchange for royalty interests on their properties.',
    website: 'https://www.osiskogr.com',
    province: 'QC', city: 'Montreal',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Adventus Mining Corporation',
    slug: 'adventus-mining-corporation',
    description: 'Adventus Mining is a Canadian mineral exploration and development company advancing the Curipamba copper-gold project in Ecuador. The company is developing one of Ecuador\'s most significant undeveloped copper-gold deposits through its commitment to responsible mining.',
    website: 'https://www.adventusmining.com',
    province: 'ON', city: 'Toronto',
    categories: ['mineral-exploration', 'copper-base-metals'],
  },
  {
    company_name: 'Goliath Resources',
    slug: 'goliath-resources',
    description: 'Goliath Resources is a Canadian junior mineral exploration company focused on the Goldstrike district in the prolific Golden Triangle of British Columbia. The company\'s Surebet discovery hosts significant gold-silver-copper mineralization and continues to yield exceptional drill results.',
    website: 'https://www.goliathresourcesltd.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Collective Mining',
    slug: 'collective-mining',
    description: 'Collective Mining is a Canadian mineral explorer advancing the Guayabales project in Colombia, which hosts the Apollo system — a major copper-gold-silver porphyry discovery. The company is backed by key industry veterans with a track record of mine discovery.',
    website: 'https://www.collectivemining.com',
    province: 'ON', city: 'Toronto',
    categories: ['mineral-exploration', 'copper-base-metals'],
  },
  {
    company_name: 'Aya Gold & Silver',
    slug: 'aya-gold-and-silver',
    description: 'Aya Gold & Silver is a Canadian silver and gold mining company operating the Zgounder Silver Mine in Morocco, one of the world\'s highest-grade silver mines. The company is focused on growing production through expansion of Zgounder and exploration on its large Moroccan mineral portfolio.',
    website: 'https://www.ayagoldsilver.com',
    province: 'QC', city: 'Montreal',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Maple Gold Mines',
    slug: 'maple-gold-mines',
    description: 'Maple Gold Mines is a Canadian mineral exploration company focused on the Douay gold project in the Abitibi greenstone belt of Quebec. In joint venture with Agnico Eagle, the company is advancing one of Canada\'s largest undeveloped gold projects by acreage.',
    website: 'https://www.maplegoldmines.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Aurion Resources',
    slug: 'aurion-resources',
    description: 'Aurion Resources is a Canadian gold exploration company focused on the Central Lapland Greenstone Belt in northern Finland, known as the Kittilä area. The company has partnered with B2Gold Corp to explore one of Europe\'s most prospective gold exploration jurisdictions.',
    website: 'https://www.aurionresources.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Troilus Gold Corp',
    slug: 'troilus-gold-corp',
    description: 'Troilus Gold Corp is a Canadian mineral exploration and development company advancing the past-producing Troilus gold-copper mine in northern Quebec back into production. The Troilus project hosts one of Canada\'s largest undeveloped gold-copper resources.',
    website: 'https://www.troilusgold.com',
    province: 'ON', city: 'Toronto',
    categories: ['mineral-exploration', 'gold-mining', 'copper-base-metals'],
  },

  // ── Mine Engineering & Consulting ────────────────────────────────────────────
  {
    company_name: 'WSP Global',
    slug: 'wsp-global',
    description: 'WSP Global is a leading Canadian engineering and professional services firm headquartered in Montreal, Quebec. With over 67,000 professionals worldwide, WSP provides environmental, geotechnical, and mining engineering services and is one of the world\'s largest mining consultancies by headcount.',
    website: 'https://www.wsp.com/en-CA',
    province: 'QC', city: 'Montreal',
    categories: ['mine-engineering-consulting'],
  },
  {
    company_name: 'Hatch Ltd',
    slug: 'hatch-ltd',
    description: 'Hatch is a Canadian engineering and consulting firm headquartered in Mississauga, Ontario. The company provides engineering, project management, and operational consulting services to the mining, energy, and infrastructure sectors. Hatch has deep expertise in metallurgy, mine design, and process plant engineering.',
    website: 'https://www.hatch.com',
    province: 'ON', city: 'Mississauga',
    categories: ['mine-engineering-consulting'],
  },
  {
    company_name: 'Ausenco',
    slug: 'ausenco',
    description: 'Ausenco is a global engineering and project delivery company with significant Canadian operations, particularly in mine engineering and project management for the mining sector. The company specializes in copper, gold, and mineral processing engineering from feasibility through commissioning.',
    website: 'https://www.ausenco.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mine-engineering-consulting'],
  },
  {
    company_name: 'SNC-Lavalin Mining',
    slug: 'snc-lavalin-mining',
    description: 'AtkinsRéalis (formerly SNC-Lavalin) is one of Canada\'s largest engineering firms with a dedicated mining group providing EPCM services, feasibility studies, and operational support for mining projects globally. The Montreal-headquartered firm has extensive experience in open-pit and underground mine development.',
    website: 'https://www.atkinsrealis.com/mining',
    province: 'QC', city: 'Montreal',
    categories: ['mine-engineering-consulting'],
  },
  {
    company_name: 'Knight Piésold',
    slug: 'knight-piesold',
    description: 'Knight Piésold is an independent engineering consulting firm with a major Canadian presence providing geotechnical, environmental, and water resources engineering services to the mining industry. The company specializes in tailings management, dam engineering, and mine closure planning.',
    website: 'https://www.knightpiesold.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mine-engineering-consulting', 'mine-safety-environment'],
  },
  {
    company_name: 'Golder Associates',
    slug: 'golder-associates',
    description: 'Golder Associates (now part of WSP) was a leading Canadian geotechnical and environmental engineering firm originally founded in Toronto. The company remains one of the leading providers of mine geotechnical engineering, tailings consulting, and environmental assessment services in Canada.',
    website: 'https://www.wsp.com/en-CA/services/environmental-services',
    province: 'ON', city: 'Mississauga',
    categories: ['mine-engineering-consulting', 'mine-safety-environment'],
  },
  {
    company_name: 'Stantec Mining',
    slug: 'stantec-mining',
    description: 'Stantec is a Canadian engineering and consulting firm headquartered in Edmonton, Alberta with a significant mining practice. The company provides environmental assessment, permitting, mine infrastructure design, and reclamation planning services for mining projects across Canada and globally.',
    website: 'https://www.stantec.com/en/services/mining',
    province: 'AB', city: 'Edmonton',
    categories: ['mine-engineering-consulting', 'mine-safety-environment'],
  },
  {
    company_name: 'Tetra Tech Canada Mining',
    slug: 'tetra-tech-canada-mining',
    description: 'Tetra Tech provides technical and management consulting services to the Canadian mining industry with expertise in geotechnical engineering, hydrology, environmental assessment, and mine closure. The company has Canadian offices in Vancouver, Calgary, and Toronto serving major mining companies.',
    website: 'https://www.tetratech.com/en/markets/mining',
    province: 'BC', city: 'Vancouver',
    categories: ['mine-engineering-consulting'],
  },
  {
    company_name: 'Moose Mountain Technical Services',
    slug: 'moose-mountain-technical-services',
    description: 'Moose Mountain Technical Services is a Canadian mine engineering and consulting firm headquartered in Calgary, Alberta specializing in mine planning, reserve estimation, production optimization, and feasibility studies for open-pit and underground mining operations in Canada.',
    website: 'https://www.mmts.ca',
    province: 'AB', city: 'Calgary',
    categories: ['mine-engineering-consulting'],
  },
  {
    company_name: 'Caracle Creek International Consulting',
    slug: 'caracle-creek-international-consulting',
    description: 'Caracle Creek International Consulting is a Canadian geological and mining engineering consultancy headquartered in Sudbury, Ontario. The company specializes in resource estimation, geological modelling, technical studies, and mine consulting for Canadian and international mining companies.',
    website: 'https://www.caracle.com',
    province: 'ON', city: 'Sudbury',
    categories: ['mine-engineering-consulting', 'mineral-exploration'],
  },

  // ── Mine Safety & Environment ────────────────────────────────────────────────
  {
    company_name: 'Intrinsik Environmental Sciences',
    slug: 'intrinsik-environmental-sciences',
    description: 'Intrinsik Environmental Sciences is a Canadian environmental consulting firm headquartered in Mississauga, Ontario specializing in human health risk assessment, toxicology, and environmental assessments for the mining, energy, and chemical industries.',
    website: 'https://www.intrinsik.com',
    province: 'ON', city: 'Mississauga',
    categories: ['mine-safety-environment'],
  },
  {
    company_name: 'SENES Consultants',
    slug: 'senes-consultants',
    description: 'SENES Consultants (part of RWDI) is a Canadian environmental consulting firm with expertise in mine environmental assessments, radiation protection, and nuclear industry environmental studies. The company has worked on some of Canada\'s most complex environmental assessments for uranium and other mines.',
    website: 'https://www.senes.ca',
    province: 'ON', city: 'Richmond Hill',
    categories: ['mine-safety-environment'],
  },
  {
    company_name: 'GHD Canada Mining',
    slug: 'ghd-canada-mining',
    description: 'GHD provides environmental, geotechnical, and water management consulting to Canadian mining companies. The firm specializes in mine water management, acid rock drainage assessment, environmental impact assessment, and mine closure and reclamation planning.',
    website: 'https://www.ghd.com/en-ca/industries/mining',
    province: 'BC', city: 'Vancouver',
    categories: ['mine-safety-environment', 'mine-engineering-consulting'],
  },
  {
    company_name: 'Rescan Environmental Services',
    slug: 'rescan-environmental-services',
    description: 'Rescan Environmental Services is a Vancouver-based environmental consulting firm with extensive experience conducting environmental assessments and providing environmental management services for Canadian and international mining projects, particularly in British Columbia and the Yukon.',
    website: 'https://www.rescan.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mine-safety-environment'],
  },
  {
    company_name: 'SRK Consulting Canada',
    slug: 'srk-consulting-canada',
    description: 'SRK Consulting is an independent international consulting practice with major Canadian offices in Vancouver and Toronto. The company provides geotechnical and rock engineering, tailings management, mine waste, hydrogeology, and environmental services to the Canadian mining industry.',
    website: 'https://www.srk.com/en/canada',
    province: 'BC', city: 'Vancouver',
    categories: ['mine-safety-environment', 'mine-engineering-consulting'],
  },
  {
    company_name: 'Dumas Mining',
    slug: 'dumas-mining',
    description: 'Dumas Mining is a Canadian underground mining contractor headquartered in Timmins, Ontario. The company provides underground mine development, production mining, and mine management services to clients across Canada with a strong safety culture and environmental commitment.',
    website: 'https://www.dumasmining.com',
    province: 'ON', city: 'Timmins',
    categories: ['mine-safety-environment', 'mining-services-equipment'],
  },

  // ── Additional Senior/Mid-Tier Producers ─────────────────────────────────────
  {
    company_name: 'Vale Canada',
    slug: 'vale-canada',
    description: 'Vale Canada is a subsidiary of Vale S.A., one of the world\'s largest mining companies. Vale Canada operates nickel, copper, cobalt, and platinum group metals mines in Sudbury, Ontario and Thompson, Manitoba. The Sudbury operations are among the world\'s most significant nickel mining complexes.',
    website: 'https://www.vale.com/canada',
    province: 'ON', city: 'Sudbury',
    categories: ['copper-base-metals', 'lithium-battery-metals'],
  },
  {
    company_name: 'Glencore Nickel',
    slug: 'glencore-nickel',
    description: 'Glencore\'s Integrated Nickel Operations in Sudbury, Ontario encompasses the Nickel Rim South and Fraser mines, the Sudbury smelter and refinery, and the Sudbury INO operation. Glencore is one of the largest nickel producers in Canada and a major employer in Northern Ontario.',
    website: 'https://www.glencore.com/en/what-we-do/mining/nickel',
    province: 'ON', city: 'Sudbury',
    categories: ['copper-base-metals'],
  },
  {
    company_name: 'Noront Resources',
    slug: 'noront-resources',
    description: 'Noront Resources (acquired by Wyloo Metals) holds the Eagle\'s Nest nickel-copper-platinum-palladium deposit in the Ring of Fire region of Northern Ontario — one of Canada\'s most significant undeveloped critical mineral deposits. The project is key to Ontario\'s critical minerals strategy.',
    website: 'https://www.wyloo.com/ring-of-fire/',
    province: 'ON', city: 'Toronto',
    categories: ['copper-base-metals', 'lithium-battery-metals', 'mineral-exploration'],
  },
  {
    company_name: 'McEwen Mining',
    slug: 'mcewen-mining',
    description: 'McEwen Mining is a Canadian gold and silver producer with mines in Nevada, Ontario, and Argentina. Co-founded by Rob McEwen (former CEO of Goldcorp), the company has a strong presence in the Timmins gold camp and is developing the Fox Complex in Ontario.',
    website: 'https://www.mcewenmining.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining'],
  },
  {
    company_name: 'Victoria Gold Corp',
    slug: 'victoria-gold-corp',
    description: 'Victoria Gold Corp is a Yukon-focused gold producer operating the Eagle Gold Mine in the Yukon Territory — the Yukon\'s largest gold mine. The Eagle mine produces gold through heap leach processing and has helped establish the Yukon as a significant Canadian gold producing jurisdiction.',
    website: 'https://www.vgcx.com',
    province: 'YT', city: 'Whitehorse',
    categories: ['gold-mining'],
  },
  {
    company_name: 'Artemis Gold',
    slug: 'artemis-gold',
    description: 'Artemis Gold is a Canadian gold developer advancing the Blackwater Gold Project in central British Columbia — one of Canada\'s largest undeveloped open-pit gold projects. The project is expected to be a major BC gold producer when it enters production.',
    website: 'https://www.artemisgold.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'New Gold',
    slug: 'new-gold',
    description: 'New Gold is an intermediate Canadian gold mining company headquartered in Toronto with two producing mines in Canada: the New Afton copper-gold mine in BC and the Rainy River gold-silver mine in Ontario. The company is focused on growing its Canadian production base.',
    website: 'https://www.newgold.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining', 'copper-base-metals'],
  },
  {
    company_name: 'First Mining Gold Corp',
    slug: 'first-mining-gold-corp',
    description: 'First Mining Gold is a Canadian gold developer advancing the Springpole Gold Project in northwestern Ontario, one of the largest undeveloped gold projects in Canada. The company holds a portfolio of Canadian gold development and exploration assets.',
    website: 'https://www.firstmininggold.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'Dundee Precious Metals',
    slug: 'dundee-precious-metals',
    description: 'Dundee Precious Metals is a Canadian-based international mining company headquartered in Toronto with two gold mines in Bulgaria and a copper smelter in Namibia. The company continues to explore for precious metal deposits and apply innovation in its operations.',
    website: 'https://www.dundeeprecious.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining', 'copper-base-metals'],
  },
  {
    company_name: 'Sherritt International',
    slug: 'sherritt-international',
    description: 'Sherritt International is a Canadian mining and hydrometallurgy company headquartered in Toronto. The company produces nickel and cobalt from laterite deposits in Cuba through its Moa Joint Venture and also has oil and gas operations in Cuba. Sherritt has been a pioneer in laterite nickel processing technology.',
    website: 'https://www.sherritt.com',
    province: 'ON', city: 'Toronto',
    categories: ['copper-base-metals', 'lithium-battery-metals'],
  },
  {
    company_name: 'MAG Silver Corp',
    slug: 'mag-silver-corp',
    description: 'MAG Silver Corp is a Canadian silver development and exploration company, primarily focused on becoming a premier primary silver mining company through its ownership of 44% of the Juanicipio Mine in Zacatecas, Mexico, operated by Fresnillo plc.',
    website: 'https://www.magsilver.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'Seabridge Gold',
    slug: 'seabridge-gold',
    description: 'Seabridge Gold is a Canadian gold company whose principal asset is the KSM (Kerr-Sulphurets-Mitchell) gold-copper project in British Columbia — one of the world\'s largest undeveloped gold-copper deposits by gold equivalent ounces. The company acquires and advances large gold deposits for future operation or sale.',
    website: 'https://www.seabridgegold.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining', 'copper-base-metals', 'mineral-exploration'],
  },
  {
    company_name: 'Largo Resources',
    slug: 'largo-resources',
    description: 'Largo Resources is a Canadian vanadium producer and energy storage company headquartered in Toronto. The company operates the Maracás Menchen vanadium mine in Brazil and is developing vanadium redox flow battery energy storage products through its Largo Clean Energy division.',
    website: 'https://largoresources.com',
    province: 'ON', city: 'Toronto',
    categories: ['lithium-battery-metals', 'mineral-exploration'],
  },
  {
    company_name: 'Hochschild Mining Canada',
    slug: 'hochschild-mining-canada',
    description: 'Hochschild Mining has Canadian exploration activities and holds the Hope Bay gold project in Nunavut through its subsidiary. Hope Bay is one of the highest-grade open-pit developable gold projects in Canada, located in Nunavut\'s Kitikmeot region.',
    website: 'https://www.hochschildmining.com',
    province: 'NU', city: 'Cambridge Bay',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'G Mining Ventures',
    slug: 'g-mining-ventures',
    description: 'G Mining Ventures is a Canadian gold development company advancing the Tocantinzinho (TZ) gold project in Brazil and is constructing the Oko West gold project in Guyana. Headquartered in Brossard, Quebec, the company is led by experienced mine builders from the Quebec mining industry.',
    website: 'https://www.gmining.com',
    province: 'QC', city: 'Brossard',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'NiCAN Limited',
    slug: 'nican-limited',
    description: 'NiCAN Limited is a Canadian nickel-copper explorer focused on the Ni-Cu-PGE discovery at its Havilah project in Manitoba and the Qiqavik PGE-Au project in Nunavut. The company targets battery metal deposits in understudied Canadian geological terranes.',
    website: 'https://www.nicanlimited.com',
    province: 'MB', city: 'Winnipeg',
    categories: ['mineral-exploration', 'copper-base-metals', 'lithium-battery-metals'],
  },
  {
    company_name: 'Paladin Energy Canada',
    slug: 'paladin-energy-canada',
    description: 'Paladin Energy is a uranium exploration and development company with properties in the Athabasca Basin of Saskatchewan. The company is focused on advancing its Saskatchewan uranium portfolio to take advantage of the global nuclear energy renaissance.',
    website: 'https://www.paladinenergy.com.au',
    province: 'SK', city: 'Saskatoon',
    categories: ['uranium-nuclear-fuels', 'mineral-exploration'],
  },
  {
    company_name: 'Skyharbour Resources',
    slug: 'skyharbour-resources',
    description: 'Skyharbour Resources is a Canadian uranium explorer focused on the Athabasca Basin of Saskatchewan. The company manages a portfolio of uranium exploration projects and partners with other companies to advance exploration through a prospect generator model.',
    website: 'https://www.skyharbourltd.com',
    province: 'BC', city: 'Vancouver',
    categories: ['uranium-nuclear-fuels', 'mineral-exploration'],
  },
  {
    company_name: 'Tethys Metals',
    slug: 'tethys-metals',
    description: 'Tethys Metals is a Canadian copper-gold explorer advancing the Onaxa copper-gold project in Sonora, Mexico. The company is focused on making new discoveries in underexplored regions with strong geological potential.',
    website: 'https://www.tethysmetals.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mineral-exploration', 'copper-base-metals'],
  },
  {
    company_name: 'Torchlight Energy Canada',
    slug: 'murchison-minerals',
    description: 'Murchison Minerals is a Canadian nickel-cobalt-copper explorer focused on the HPM project in Quebec and the Brabant Lake project in Saskatchewan. The company is targeting battery metal deposits in Canada\'s world-class mineral provinces.',
    website: 'https://www.murchisonminerals.com',
    province: 'ON', city: 'Toronto',
    categories: ['mineral-exploration', 'copper-base-metals', 'lithium-battery-metals'],
  },
  {
    company_name: 'Aura Silver Resources',
    slug: 'aura-silver-resources',
    description: 'Aura Silver Resources is a Canadian silver and gold explorer with projects in British Columbia and Ontario. The company is focused on the discovery of high-grade silver-gold veins in historic mining camps.',
    website: 'https://www.aurasilverresources.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Comstock Metals',
    slug: 'comstock-metals',
    description: 'Comstock Metals is a Canadian mineral exploration company focused on gold and copper discoveries in British Columbia\'s prolific Golden Triangle. The company\'s QV project hosts gold-silver-copper mineralization in a geologically prospective corridor.',
    website: 'https://www.comstockmetals.ca',
    province: 'BC', city: 'Vancouver',
    categories: ['mineral-exploration', 'gold-mining'],
  },
  {
    company_name: 'Mandalay Resources',
    slug: 'mandalay-resources',
    description: 'Mandalay Resources is a Canadian natural resources company with mining operations producing gold, silver, antimony, and tin. Headquartered in Toronto, the company operates the Björkdal mine in Sweden and the Costerfield mine in Australia.',
    website: 'https://www.mandalayresources.com',
    province: 'ON', city: 'Toronto',
    categories: ['gold-mining'],
  },
  {
    company_name: 'Silvercorp Metals',
    slug: 'silvercorp-metals',
    description: 'Silvercorp Metals is a Canadian silver mining company producing silver, gold, lead, and zinc from mines in China. Headquartered in Vancouver, BC, the company is the largest primary silver producer in China and one of the few profitable junior silver miners.',
    website: 'https://www.silvercorpmetals.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining'],
  },
  {
    company_name: 'B2Gold Corp',
    slug: 'b2gold-corp',
    description: 'B2Gold is a Vancouver-based senior gold producer with mines in Mali, Namibia, and the Philippines. The company is one of Canada\'s most successful gold producers, known for building and commissioning mines on time and on budget. B2Gold has exploration activities in Finland and other jurisdictions.',
    website: 'https://www.b2gold.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining', 'mineral-exploration'],
  },
  {
    company_name: 'Eldorado Gold',
    slug: 'eldorado-gold',
    description: 'Eldorado Gold is a Canadian gold mining company headquartered in Vancouver with gold mines in Greece, Türkiye, and Brazil. The company is focused on low-cost gold production and has a development pipeline of projects including the Skouries polymetallic gold-copper project in Greece.',
    website: 'https://www.eldoradogold.com',
    province: 'BC', city: 'Vancouver',
    categories: ['gold-mining', 'copper-base-metals'],
  },
  {
    company_name: 'Capstone Copper Corp',
    slug: 'capstone-copper-corp',
    description: 'Capstone Copper is a Canadian copper producer headquartered in Vancouver, formed by the merger of Capstone Mining and Mantos Copper. The company operates copper mines in Arizona, Chile, and Mexico and is advancing the Santo Domingo project in Chile — a major copper-iron ore project.',
    website: 'https://www.capstonecoppercorp.com',
    province: 'BC', city: 'Vancouver',
    categories: ['copper-base-metals'],
  },
  {
    company_name: 'Solaris Resources',
    slug: 'solaris-resources',
    description: 'Solaris Resources is a Vancouver-based copper-gold exploration company advancing the Warintza project in Ecuador — one of the most significant copper porphyry discoveries in South America in recent years. The company is backed by major mining companies through strategic investments.',
    website: 'https://www.solarisresources.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mineral-exploration', 'copper-base-metals'],
  },
  {
    company_name: 'Copper Fox Metals',
    slug: 'copper-fox-metals',
    description: 'Copper Fox Metals is a Canadian copper-gold explorer focused on the Schaft Creek copper-gold-molybdenum-silver project in British Columbia — one of the largest undeveloped copper-gold projects in Canada. The project is in joint venture with Teck Resources.',
    website: 'https://www.copperfox.ca',
    province: 'AB', city: 'Calgary',
    categories: ['mineral-exploration', 'copper-base-metals'],
  },
  {
    company_name: 'Stakeholder Gold Corp',
    slug: 'highgold-mining',
    description: 'HighGold Mining is a Canadian gold-copper explorer focused on the Johnson Tract gold-copper-silver-zinc project in southcentral Alaska and the Munro gold project in the Timmins area of Ontario. The company is focused on high-grade discovery in underexplored districts.',
    website: 'https://www.highgoldmining.com',
    province: 'BC', city: 'Vancouver',
    categories: ['mineral-exploration', 'gold-mining'],
  },
];

// ─── Helper: sleep ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  let totalInserted = 0;
  let totalSkipped  = 0;

  // ── 1. Insert categories ──────────────────────────────────────────────────
  console.log('\n📂 Step 1: Inserting mining categories...');
  const { data: existingCats, error: catErr } = await sb.from('categories').select('slug');
  if (catErr) { console.error('Error fetching categories:', catErr.message); process.exit(1); }
  const existingSlugs = new Set(existingCats.map(c => c.slug));

  const catsToInsert = MINING_CATEGORIES.filter(c => !existingSlugs.has(c.slug));
  console.log(`  Found ${existingSlugs.size} existing categories. Inserting ${catsToInsert.length} new ones.`);

  if (catsToInsert.length > 0) {
    const { data: inserted, error: insertErr } = await sb.from('categories').insert(catsToInsert).select('id, name, slug');
    if (insertErr) { console.error('Error inserting categories:', insertErr.message); process.exit(1); }
    console.log('  ✅ Categories inserted:');
    inserted.forEach(c => console.log(`    - [${c.slug}] ${c.name} → ${c.id}`));
  }

  // ── 2. Build category slug → id map ──────────────────────────────────────
  const { data: allCats } = await sb.from('categories').select('id, slug');
  const catMap = {};
  allCats.forEach(c => { catMap[c.slug] = c.id; });

  // ── 3. Fetch existing vendor names ────────────────────────────────────────
  console.log('\n🏢 Step 2: Checking existing vendors...');
  let existingVendorNames = new Set();
  let page = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await sb.from('vendors')
      .select('company_name')
      .range(page * PAGE, (page + 1) * PAGE - 1);
    if (error) { console.error('Error fetching vendors:', error.message); break; }
    data.forEach(v => existingVendorNames.add(v.company_name.toLowerCase().trim()));
    if (data.length < PAGE) break;
    page++;
  }
  console.log(`  Found ${existingVendorNames.size} existing vendors.`);

  // ── 4. Insert vendors ─────────────────────────────────────────────────────
  console.log('\n🔨 Step 3: Inserting mining vendors...');
  
  for (const v of VENDORS) {
    const nameKey = v.company_name.toLowerCase().trim();
    if (existingVendorNames.has(nameKey)) {
      console.log(`  ⏭️  Skip (exists): ${v.company_name}`);
      totalSkipped++;
      continue;
    }

    // Resolve category IDs
    const categoryIds = (v.categories || []).map(slug => catMap[slug]).filter(Boolean);

    const vendorPayload = {
      company_name: v.company_name,
      slug: v.slug,
      description: v.description,
      website: v.website || null,
      phone: v.phone || null,
      email: v.email || null,
      province: v.province || null,
      city: v.city || null,
      tier: 'free',
      active: true,
      verified: false,
      data_status: 'current',
      display_quality: 'full',
      data_source: 'manual',
    };

    const { data: vendorData, error: vErr } = await sb
      .from('vendors')
      .insert(vendorPayload)
      .select('id, company_name')
      .single();

    if (vErr) {
      // Handle slug conflict by appending suffix
      if (vErr.code === '23505' && vErr.message.includes('slug')) {
        const altSlug = v.slug + '-ca';
        const { data: v2, error: v2Err } = await sb
          .from('vendors')
          .insert({ ...vendorPayload, slug: altSlug })
          .select('id, company_name')
          .single();
        if (v2Err) {
          console.error(`  ❌ Failed: ${v.company_name} — ${v2Err.message}`);
          continue;
        }
        // Link categories
        if (categoryIds.length > 0) {
          const links = categoryIds.map(cat_id => ({ vendor_id: v2.id, category_id: cat_id }));
          await sb.from('vendor_categories').insert(links);
        }
        console.log(`  ✅ Inserted (alt slug): ${v2.company_name}`);
        totalInserted++;
        existingVendorNames.add(nameKey);
        continue;
      }
      console.error(`  ❌ Failed: ${v.company_name} — ${vErr.message}`);
      continue;
    }

    // Link categories
    if (categoryIds.length > 0) {
      const links = categoryIds.map(cat_id => ({ vendor_id: vendorData.id, category_id: cat_id }));
      const { error: linkErr } = await sb.from('vendor_categories').insert(links);
      if (linkErr) console.warn(`    ⚠️  Category link warning for ${vendorData.company_name}: ${linkErr.message}`);
    }

    console.log(`  ✅ Inserted: ${vendorData.company_name}`);
    totalInserted++;
    existingVendorNames.add(nameKey);
    await sleep(50); // gentle rate limiting
  }

  // ── 5. Final count ────────────────────────────────────────────────────────
  const { count: finalCount } = await sb.from('vendors').select('*', { count: 'exact', head: true }).eq('active', true);
  console.log('\n══════════════════════════════════════════════');
  console.log(`✅ Done!`);
  console.log(`   Vendors inserted : ${totalInserted}`);
  console.log(`   Vendors skipped  : ${totalSkipped}`);
  console.log(`   Total active     : ${finalCount}`);
  console.log('══════════════════════════════════════════════');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
