import { useState, useEffect, useRef } from 'react'
import eagleLogo from './assets/eagle-flag.png'

(function injectFonts() {
  if (typeof document === 'undefined') return
  if (document.querySelector('[data-id="ga-vision-fonts"]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700;900&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=Public+Sans:wght@300;400;500&display=swap'
  link.setAttribute('data-id', 'ga-vision-fonts')
  document.head.appendChild(link)
})()

const C = {
  bg:       '#F4F2EE',
  surface:  '#ECEAE4',
  navy:     '#1C2B4E',
  red:      '#BF2033',
  ink:      '#141414',
  muted:    'rgba(20,20,20,0.45)',
  mutedHi:  'rgba(20,20,20,0.68)',
  border:   'rgba(28,43,78,0.12)',
}

const POLICIES = [
  {
    id: 'tax', num: '01', color: '#1C2B4E', colorDim: 'rgba(28,43,78,0.06)',
    eyebrow: 'Tax Repeal',
    title: "Don't Tax My Home. Don't Tax My Income.",
    stat: '0%', statSub: 'The target for both income and property tax.',
    body: "Florida doesn't tax income. Tennessee doesn't tax income. Neither should Georgia. And property tax is rent paid to the government on a home you already own that ends too. Redirect to a broad consumption tax and let a booming tourism economy carry the load, not Georgia families.",
    bullets: ["Eliminate state income tax to match Florida and Tennessee","Abolish property tax on primary residences","Shift to a broad-based consumption and sales tax model","Drive an aggressive tourism boom that lowers the financial burden on every Georgian the same playbook Tennessee and Florida already run"],
  },
  {
    id: 'infrastructure', num: '02', color: '#BF2033', colorDim: 'rgba(191,32,51,0.06)',
    eyebrow: 'Infrastructure',
    title: 'Atlanta Is Not Georgia. Georgia Is Georgia.',
    stat: 'Build Airports', statSub: 'Every corner of Georgia deserves its own front door.',
    body: "Florida built ten airports. Georgia built one that matters and then told the rest of the state to drive to Atlanta. That ends. Every region of Georgia gets its own gateway: a coastal hub on the Savannah or Brunswick corridor, a South Georgia airport that opens the door to hunting, agriculture, and rural tourism, an East Georgia hub through Augusta that pulls visitors straight from the Carolinas, and a Central Georgia connector in Macon that ties it all together. Open the doors to the wonders of all of Georgia, not just Atlanta.",
    bullets: [
      "Coastal Gateway: Upgrade SAV or fully activate BQK with international routes",
      "South Georgia Hub: Valdosta or Tifton area, serving the hunting and agri-tourism economy",
      "East Georgia Gateway: Expand Augusta Regional into a real hub, front door from the Carolinas",
      "Central Georgia Connector: Macon, equidistant from every major Georgia city",
      "Break Atlanta's monopoly so every region can stand on its own",
    ],
  },
  {
    id: 'coastal', num: '03', color: '#4A8BC4', colorDim: 'rgba(74,139,196,0.06)',
    eyebrow: 'Coastal Identity',
    title: 'Brand the Coast Like We Mean It.',
    stat: '100 Mi.', statSub: 'The marsh is not the obstacle. The marsh is the scenery.',
    body: "Yes, Georgia's coast is 70% salt marsh. So is South Carolina's. Hilton Head, Kiawah, Folly Beach, Sullivan's Island, Isle of Palms, all built on the buildable portions while the marsh became the backdrop that makes it feel wild, scenic, and worth the premium. Nobody is proposing to build on marsh. The case is simpler: Georgia owns some of the most beautiful barrier islands on the East Coast and the only thing standing between that land and its potential is leadership that gets out of its own way. Tybee is underbuilt. St. Simons needs investment. Jekyll Island is state-owned with a master plan collecting dust. Sea Island already proves the model works. The land is not the problem. The leadership is.",
    bullets: [
      "Tybee Island: fully accessible and underbuilt relative to its potential",
      "St. Simons Island: infrastructure already exists, needs investment and marketing",
      "Jekyll Island: state-owned, master plan approved, waiting on leadership to act",
      "Sea Island: already world class, proves the model works, needs to be scaled",
      "Stop hiding behind the marsh argument. Build on the buildable land and let the marsh sell itself",
    ],
  },
  {
    id: 'southga', num: '04', color: '#3D6B35', colorDim: 'rgba(61,107,53,0.06)',
    eyebrow: 'South Georgia',
    title: 'Turn the Wild South Into an Industry.',
    stat: '$1.5B', statSub: 'Annual feral hog damage. Flip it into revenue.',
    body: "Texas built an entire aerial hunting industry around feral hogs Georgia has the same problem, the same land, and none of the commercial infrastructure. License outfitters, develop hunting lodges, and let South Georgia rural counties participate in an economy that doesn't depend on Atlanta.",
    bullets: ["License commercial aerial hog hunting operations statewide","Develop Texas-style hunting tourism across South Georgia","Expand agri-tourism and outfitter certification programs","Economic engine for counties currently left behind"],
  },
  {
    id: 'river', num: '05', color: '#2D5F8A', colorDim: 'rgba(45,95,138,0.06)',
    eyebrow: 'Natural Resources',
    title: "Nashville Did It. Austin Did It. Georgia Hasn't.",
    stat: '430 Mi.', statSub: 'God already gave us the river time to build on it.',
    body: "From Roswell and Sandy Springs through Atlanta down to Columbus and the Gulf every mile of the Chattahoochee gets activated. Restaurants, bars, marinas, trails, boat launches, and riverfront districts up and down the full corridor. And underpinning all of it: a statewide river cleanliness initiative so Georgia kids and families can actually swim and play in the water without getting sick. The whole river. Clean. Open. Alive.",
    bullets: ["Extend and improve the navigable channel from Columbus to the Gulf","Develop marinas, boat launches, and water taxi infrastructure along the lower river","Build restaurant, bar, and entertainment districts the entire length of the river","Statewide water quality initiative clean enough for kids and families to swim in","Trails, riverfront parks, and recreation from the mountains to the Gulf","Turn the Chattahoochee into a statewide economic asset every Georgian can enjoy"],
  },
]

const GA_CITIES = [
  { city: 'Atlanta',          role: 'Finance, tech, culture the engine' },
  { city: 'Savannah',         role: 'History, food, coastal charm' },
  { city: 'Columbus',         role: 'River economy, military, affordable growth' },
  { city: 'Augusta',          role: 'Golf, medical, quiet Southern character' },
  { city: 'The Golden Isles', role: 'World-class coastal luxury destination' },
  { city: 'The Chattahoochee',role: 'Family recreation and riverfront living' },
  { city: 'South Georgia',    role: 'Land, hunting, agri-tourism powerhouse' },
]

const GA_ASSETS = [
  {
    category: 'Geography', color: '#2D5F8A',
    items: ['Blue Ridge Mountains in the North','Lake Lanier and lakes throughout the state','Chattahoochee, Savannah, Flint, and Oconee Rivers','Barrier islands and full Atlantic coast access','Piedmont farmland and open countryside','Flat open hunting land across South Georgia'],
  },
  {
    category: 'All 7 Seasons', color: '#3D6B35',
    items: ['Spring in Savannah one of the most beautiful in the country','Summer on the coast and the lakes','Fall foliage across the North Georgia mountains','Mild winters that never chase people indoors','A 12-month tourism pitch not a seasonal one','Something going on every single month of the year'],
  },
  {
    category: 'Universities', color: '#BF2033',
    items: ['UGA flagship SEC school and Athens cultural engine','Georgia Tech world-class engineering and research','Emory top-tier medical university, CDC next door','SCAD arguably the best art and design school in the country'],
  },
]

// ── Hooks ──────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function Reveal({ children, delay = 0, y = 30, style = {} }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : `translateY(${y}px)`, transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

// ── Scroll progress ────────────────────────────────────────────────────────

function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const update = () => { const t = document.documentElement.scrollHeight - window.innerHeight; if (t > 0) setPct(window.scrollY / t) }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 1000, background: 'rgba(28,43,78,0.1)' }}>
      <div style={{ height: '100%', width: `${pct * 100}%`, background: C.red, transition: 'width 0.08s linear' }} />
    </div>
  )
}

// ── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const navItems = [
    { label: 'Tax Repeal', id: 'tax' },
    { label: 'Infrastructure', id: 'infrastructure' },
    { label: 'Coast', id: 'coastal' },
    { label: 'South GA', id: 'southga' },
    { label: 'River', id: 'river' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: '3px', left: 0, right: 0, zIndex: 999,
        padding: isMobile ? '0.9rem 1.5rem' : '1.1rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrolled || menuOpen ? 'rgba(244,242,238,0.97)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(14px)' : 'none',
        borderBottom: scrolled || menuOpen ? `1px solid ${C.border}` : 'none',
        transition: 'all 0.35s ease',
      }}>
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={eagleLogo} alt="USA First Lab" style={{ width: '30px', height: '30px', objectFit: 'cover', objectPosition: 'center top', imageRendering: 'pixelated', borderRadius: '2px' }} />
          <span style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: isMobile ? '0.95rem' : '1.1rem', color: C.navy, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            USA First Lab
          </span>
        </a>

        {isMobile ? (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '22px', height: '2px', background: C.navy, borderRadius: '2px', transition: 'all 0.25s ease',
                transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'scaleX(0)') : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {navItems.map(item => <NavLink key={item.id} href={`#${item.id}`} label={item.label} />)}
          </div>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: '3px', left: 0, right: 0, zIndex: 998,
          background: 'rgba(244,242,238,0.97)',
          backdropFilter: 'blur(14px)',
          padding: menuOpen ? '5rem 1.5rem 2rem' : '0 1.5rem',
          maxHeight: menuOpen ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, padding 0.4s ease',
          borderBottom: menuOpen ? `1px solid ${C.border}` : 'none',
        }}>
          {navItems.map((item, i) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)} style={{
              display: 'block',
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 700,
              fontSize: '1.6rem',
              color: C.navy,
              textDecoration: 'none',
              padding: '0.7rem 0',
              borderBottom: `1px solid ${C.border}`,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'none' : 'translateX(-10px)',
              transition: `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
            }}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}

function NavLink({ href, label }) {
  const [hov, setHov] = useState(false)
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.73rem', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: hov ? C.navy : C.muted, textDecoration: 'none', transition: 'color 0.2s ease' }}>
      {label}
    </a>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  const [vis, setVis] = useState(false)
  const isMobile = useIsMobile()
  useEffect(() => { const t = setTimeout(() => setVis(true), 100); return () => clearTimeout(t) }, [])

  const anim = (delay) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : 'translateY(24px)',
    transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
  })

  return (
    <section style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gridTemplateRows: isMobile ? 'auto auto' : undefined,
      background: C.bg,
      overflow: 'hidden',
    }}>
      {/* Text */}
      <div style={{ padding: isMobile ? '7rem 1.5rem 3rem' : '10rem 4rem 6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={anim(0.2)}>
          <p style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 1.4rem' }}>
            USA First Lab
          </p>
        </div>
        <div style={anim(0.36)}>
          <h1 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: isMobile ? '5.5rem' : 'clamp(4.5rem, 9vw, 9rem)', lineHeight: 0.9, color: C.navy, margin: '0 0 0.2rem', letterSpacing: '-0.01em' }}>
            GEORGIA
          </h1>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: isMobile ? '2.2rem' : 'clamp(1.8rem, 3.5vw, 3.2rem)', color: C.red, margin: 0 }}>
            Unleashed.
          </h2>
        </div>
        <div style={{ ...anim(0.52), marginTop: '1.8rem' }}>
          <p style={{ fontFamily: "'Public Sans', sans-serif", fontSize: isMobile ? '1rem' : '0.95rem', fontWeight: 400, color: C.mutedHi, lineHeight: 1.85, maxWidth: '28rem', margin: 0 }}>
            Five pillars for a Georgia that competes with Florida, Texas, and Tennessee not just geographically, but economically, fiscally, and culturally.
          </p>
        </div>
        <div style={{ ...anim(0.66), marginTop: '2.4rem' }}>
          <a href="#tax" style={{ display: 'inline-block', fontFamily: "'Public Sans', sans-serif", fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: C.navy, padding: '0.9rem 2.2rem', textDecoration: 'none', borderRadius: '2px' }}>
            Read the Vision
          </a>
        </div>
      </div>

      {/* Eagle image */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#A8CEE8', minHeight: isMobile ? '45vw' : undefined }}>
        <img src={eagleLogo} alt="USA First Lab" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: vis ? 1 : 0, transition: 'opacity 1.2s ease 0.5s', imageRendering: 'pixelated' }} />
      </div>
    </section>
  )
}

// ── The Full Georgia ───────────────────────────────────────────────────────

function FullGeorgia() {
  const [ref, inView] = useInView(0.08)
  const isMobile = useIsMobile()

  return (
    <section ref={ref} style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 4rem', background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.8fr', gap: isMobile ? '2.5rem' : '6rem', alignItems: 'start' }}>

          {/* Left */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(25px)', transition: 'opacity 0.9s ease 0.05s, transform 0.9s ease 0.05s' }}>
            <p style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.red, margin: '0 0 1rem' }}>
              The Vision
            </p>
            <h2 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: isMobile ? '3.2rem' : 'clamp(3.5rem, 6vw, 5.5rem)', lineHeight: 0.92, color: C.navy, margin: '0 0 1.4rem' }}>
              THE FULL GEORGIA
            </h2>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: isMobile ? '1.05rem' : '1.15rem', color: C.muted, lineHeight: 1.7, margin: '0 0 1.2rem' }}>
              Florida doesn't run on Miami alone. It runs on Miami, Tampa, Orlando, Jacksonville, St. Pete, West Palm a full roster of cities each pulling their own weight.
            </p>
            <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 300, fontSize: '0.94rem', color: C.mutedHi, lineHeight: 1.9, margin: 0 }}>
              Right now Georgia runs on Atlanta and a supporting cast nobody's bothered to develop. The Full Georgia means every region has an identity, an economy, and a reason to exist on the national map independently.
            </p>
          </div>

          {/* City list */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {GA_CITIES.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'baseline', gap: isMobile ? '0.8rem' : '1.5rem',
                padding: isMobile ? '1rem 0' : '1.4rem 0',
                borderBottom: `1px solid ${C.border}`,
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateX(20px)',
                transition: `opacity 0.7s ease ${0.15 + i * 0.07}s, transform 0.7s ease ${0.15 + i * 0.07}s`,
              }}>
                <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 700, fontSize: isMobile ? '1.15rem' : '1.35rem', color: C.navy, minWidth: isMobile ? 'auto' : '11rem', letterSpacing: '0.01em' }}>
                  {item.city}
                </div>
                <div style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 300, fontSize: '0.88rem', color: C.muted, lineHeight: 1.5 }}>
                  {item.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── The Case for Georgia ───────────────────────────────────────────────────

function CaseForGeorgia() {
  const [ref, inView] = useInView(0.06)
  const isMobile = useIsMobile()

  return (
    <section ref={ref} style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 4rem', background: C.navy }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: isMobile ? '3rem' : '5rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(22px)', transition: 'opacity 0.9s ease 0.05s, transform 0.9s ease 0.05s' }}>
          <p style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 1rem' }}>
            The Opportunity
          </p>
          <h2 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: isMobile ? '3rem' : 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 0.92, color: '#fff', margin: '0 0 1.5rem' }}>
            THE CASE FOR GEORGIA
          </h2>
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: isMobile ? '1.05rem' : '1.2rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '42rem', margin: 0 }}>
            Georgia is quietly one of the most complete states in the country. Mountains, coast, rivers, lakes, hunting land, elite universities, a world-class city and still underpriced compared to Florida and Texas. That's the pitch.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '2.5rem' : '3rem' }}>
          {GA_ASSETS.map((block, i) => (
            <div key={i} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: `opacity 0.85s ease ${0.2 + i * 0.12}s, transform 0.85s ease ${0.2 + i * 0.12}s` }}>
              <div style={{ width: '2rem', height: '3px', background: block.color, marginBottom: '1rem', borderRadius: '2px' }} />
              <h3 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#fff', letterSpacing: '0.04em', margin: '0 0 1.2rem', textTransform: 'uppercase' }}>
                {block.category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {block.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', opacity: inView ? 1 : 0, transition: `opacity 0.6s ease ${0.3 + i * 0.12 + j * 0.05}s` }}>
                    <div style={{ flexShrink: 0, marginTop: '0.45rem', width: '4px', height: '4px', borderRadius: '50%', background: block.color }} />
                    <span style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 300, fontSize: isMobile ? '0.95rem' : '0.88rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.65 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: isMobile ? '3.5rem' : '5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', opacity: inView ? 1 : 0, transition: 'opacity 1s ease 0.7s' }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: isMobile ? '1.2rem' : 'clamp(1.3rem, 2.5vw, 2rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0, maxWidth: '52rem' }}>
            "Most states sell one or two seasons. Georgia has something going on every single month of the year and a geography stack most states would trade anything for."
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Stat strip ─────────────────────────────────────────────────────────────

function StatStrip() {
  const isMobile = useIsMobile()
  const stats = [
    { val: '5', label: 'Policy Pillars' },
    { val: '430mi', label: 'Untapped River' },
    { val: '$1.5B', label: 'Hog Damage Annually' },
    { val: '100mi', label: 'Underused Coastline' },
    { val: '0%', label: 'Target Income Tax' },
  ]
  return (
    <section style={{
      padding: isMobile ? '2rem 1.5rem' : '2.2rem 4rem',
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
      gap: isMobile ? '1.5rem' : '1rem',
      background: C.navy,
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      {stats.map((s, i) => (
        <Reveal key={i} delay={i * 0.07} y={14}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 700, fontSize: isMobile ? '1.8rem' : 'clamp(1.6rem, 2.8vw, 2.5rem)', color: '#fff', lineHeight: 1 }}>
              {s.val}
            </div>
            <div style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.62rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: '0.3rem' }}>
              {s.label}
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  )
}

// ── Policy section ─────────────────────────────────────────────────────────

function PolicySection({ policy, index }) {
  const isEven = index % 2 === 0
  const [secRef, inView] = useInView(0.06)
  const isMobile = useIsMobile()

  return (
    <section id={policy.id} ref={secRef} style={{
      padding: isMobile ? '4rem 1.5rem' : '9rem 4rem',
      display: 'flex', alignItems: 'center',
      borderTop: `1px solid ${C.border}`,
      background: isEven ? C.bg : C.surface,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: policy.color, opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease 0.1s' }} />

      <div style={{
        position: 'absolute', [isEven ? 'right' : 'left']: '-12%', top: '50%', transform: 'translateY(-50%)',
        width: '50vw', height: '50vw', borderRadius: '50%',
        background: `radial-gradient(circle, ${policy.colorDim} 0%, transparent 65%)`, pointerEvents: 'none',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.7fr',
        gap: isMobile ? '2rem' : '6rem',
        width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative',
      }}>
        {/* Stat block */}
        <div style={{
          order: isMobile ? 0 : (isEven ? 0 : 1),
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(25px)',
          transition: 'opacity 0.9s ease 0.05s, transform 0.9s ease 0.05s',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.9rem',
        }}>
          <p style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.67rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: policy.color, margin: 0 }}>
            {policy.num}: {policy.eyebrow}
          </p>
          <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: isMobile ? '3.5rem' : 'clamp(3rem, 7.5vw, 7rem)', lineHeight: 0.88, color: C.ink }}>
            {policy.stat}
          </div>
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: isMobile ? '1rem' : '1rem', color: C.muted, lineHeight: 1.55, margin: 0, maxWidth: '18rem', paddingLeft: '1rem', borderLeft: `3px solid ${policy.color}` }}>
            {policy.statSub}
          </p>
        </div>

        {/* Content block */}
        <div style={{
          order: isMobile ? 1 : (isEven ? 1 : 0),
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(25px)',
          transition: 'opacity 0.9s ease 0.18s, transform 0.9s ease 0.18s',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.4rem',
        }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: isMobile ? '1.6rem' : 'clamp(1.7rem, 2.8vw, 2.6rem)', lineHeight: 1.22, color: C.ink, margin: 0 }}>
            {policy.title}
          </h2>
          <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 300, fontSize: isMobile ? '1rem' : '0.94rem', lineHeight: 1.9, color: C.mutedHi, margin: 0 }}>
            {policy.body}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {policy.bullets.map((bullet, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(14px)', transition: `opacity 0.65s ease ${0.35 + i * 0.08}s, transform 0.65s ease ${0.35 + i * 0.08}s` }}>
                <div style={{ flexShrink: 0, marginTop: '0.5rem', width: '5px', height: '5px', borderRadius: '50%', background: policy.color }} />
                <span style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400, fontSize: isMobile ? '0.95rem' : '0.9rem', color: C.mutedHi, lineHeight: 1.65 }}>
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Manifesto ──────────────────────────────────────────────────────────────

function Manifesto() {
  const [ref, inView] = useInView(0.12)
  const isMobile = useIsMobile()
  return (
    <section ref={ref} style={{ padding: isMobile ? '5rem 1.5rem' : '11rem 4rem', textAlign: 'center', background: C.navy, overflow: 'hidden' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(25px)', transition: 'opacity 0.9s ease 0.05s, transform 0.9s ease 0.05s' }}>
          <p style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.67rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: '2.5rem' }}>
            The Bottom Line
          </p>
        </div>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(35px)', transition: 'opacity 1s ease 0.18s, transform 1s ease 0.18s' }}>
          <blockquote style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: isMobile ? '1.5rem' : 'clamp(1.7rem, 3.8vw, 3.3rem)', color: '#fff', lineHeight: 1.38, margin: '0 0 2.5rem' }}>
            "Georgia has the assets. The coast, the rivers, the land, the climate and a growing population ready to be led somewhere great. What's been missing is the will."
          </blockquote>
        </div>
        <div style={{ opacity: inView ? 1 : 0, transition: 'opacity 1s ease 0.36s' }}>
          <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 300, fontSize: isMobile ? '1rem' : '0.93rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.9, maxWidth: '520px', margin: '0 auto' }}>
            This is a blueprint for a Georgia that competes on every front fiscally, economically, and culturally. The infrastructure is real. The natural assets are real. The only missing ingredient is leadership willing to act.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  const isMobile = useIsMobile()
  return (
    <footer style={{
      padding: isMobile ? '2rem 1.5rem' : '2.5rem 4rem',
      borderTop: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      background: C.bg,
      gap: '1.2rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src={eagleLogo} alt="USA First Lab" style={{ width: '26px', height: '26px', objectFit: 'cover', objectPosition: 'center top', imageRendering: 'pixelated', borderRadius: '2px' }} />
        <span style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: '1rem', color: C.navy, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          USA First Lab
        </span>
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: '0.9rem', color: C.muted }}>
        A framework for bold leadership
      </div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <a href="https://x.com/usafirstlab" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.75rem', fontWeight: 500, color: C.muted, textDecoration: 'none', letterSpacing: '0.04em' }}>
          𝕏 @usafirstlab
        </a>
        <a href="https://instagram.com/usafirstlab" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '0.75rem', fontWeight: 500, color: C.muted, textDecoration: 'none', letterSpacing: '0.04em' }}>
          IG @usafirstlab
        </a>
      </div>
    </footer>
  )
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: '100vh', overflowX: 'hidden' }}>
      <ScrollProgress />
      <Nav />
      <Hero />
      <FullGeorgia />
      <CaseForGeorgia />
      <StatStrip />
      {POLICIES.map((policy, i) => (
        <PolicySection key={policy.id} policy={policy} index={i} />
      ))}
      <Manifesto />
      <Footer />
    </div>
  )
}
