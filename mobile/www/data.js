// ══════════════════════════════════════════════════════════════════════
// TRANS POWER V6 — DATA (Enhanced with Voice Exercises, Timeline, Interactions, Mindfulness)
// ══════════════════════════════════════════════════════════════════════

const AFFS = [
  "You are not broken. You are becoming.",
  "Your identity is not a phase — it is a truth unfolding.",
  "You deserve to be loved exactly as you are.",
  "Transition is not about becoming someone new — it's about revealing who you've always been.",
  "The courage it takes to be yourself is extraordinary.",
  "You are allowed to take up space in this world.",
  "Your pronouns are not a preference. They are a fact about you.",
  "Being trans is not a weakness — it is a superpower.",
  "You don't owe anyone an explanation for who you are.",
  "Today, you are closer to yourself than you were yesterday.",
  "Your body is not wrong. Society's understanding is limited.",
  "There is no wrong way to be trans.",
  "You are seen, you are valid, and you matter.",
  "Every step in your journey — no matter how small — is progress.",
  "The people who matter will stay. The ones who leave were never truly for you.",
  "Your chosen name is your real name.",
  "Trans joy is resistance. Trans joy is revolutionary.",
  "You existed before anyone had words for what you are.",
  "Healing is not linear, and neither is transition.",
  "You are enough. Exactly as you are. Right now.",
  "Your identity doesn't need to be understood to be respected.",
  "You bring something irreplaceable to this world.",
  "Rest is not weakness. You have already fought so hard today.",
  "Your future self is grateful you didn't give up.",
  "The world is better because you are in it, being unapologetically you.",
  "No one — not a single person — gets to define your gender but you.",
  "You have survived every hard day so far. That's a 100% survival rate.",
  "Even on the days it doesn't feel like it — you are growing.",
  "You were not an accident, and your gender is not a mistake.",
  "Choosing yourself is the bravest thing you've ever done."
];

const GOALS = [
  "Practice one voice exercise for 5 minutes.",
  "Write down one thing you love about your future self.",
  "Check your medication supply — do you need a refill?",
  "Reach out to one trans-affirming friend or community.",
  "Find one clothing item or accessory that brings you joy.",
  "Look in the mirror and say your chosen name out loud.",
  "Take a deep breath and acknowledge your courage.",
  "Research one trans-friendly local resource or doctor.",
  "Drink an extra glass of water and rest your voice.",
  "Read one positive story in the Support tab.",
  "Journal about one gender-euphoric moment from this week.",
  "Do a 2-minute breathing exercise in the Wellness tab."
];

const TERMS = [
  {w:'Transgender', c:'identity', d:'A person whose gender identity differs from the sex they were assigned at birth. Being trans is a natural variation of human experience.'},
  {w:'Cisgender', c:'identity', d:'A person whose gender identity matches the sex they were assigned at birth.'},
  {w:'Non-binary', c:'identity', d:'An umbrella term for gender identities that are not exclusively masculine or feminine — identities outside the gender binary.'},
  {w:'Gender Dysphoria', c:'medical', d:'The distress a person experiences when their gender identity does not match their sex assigned at birth. Not all trans people experience dysphoria.'},
  {w:'Gender Euphoria', c:'identity', d:'The joy, comfort, or relief felt when one\'s gender is affirmed — through expression, social recognition, or physical changes. The positive counterpart to dysphoria.'},
  {w:'HRT', c:'medical', d:'Hormone Replacement Therapy — medical treatment using estrogen, testosterone, or anti-androgens to align physical characteristics with gender identity.'},
  {w:'Transition', c:'social', d:'The process of aligning your external life with your gender identity. This can be social (name, pronouns, expression), medical (HRT, surgery), or legal (documents).'},
  {w:'Passing', c:'social', d:'When a trans person is perceived as cisgender. Important: passing is not the goal of transition — living authentically is.'},
  {w:'Deadname', c:'social', d:'The birth name of a trans person that they no longer use. Using someone\'s deadname after they\'ve chosen a new name is harmful and disrespectful.'},
  {w:'Misgendering', c:'social', d:'Referring to someone using a pronoun or form of address that does not correctly reflect their gender identity.'},
  {w:'Top Surgery', c:'medical', d:'Chest surgery — either breast augmentation (for trans women) or chest masculinisation/mastectomy (for trans men).'},
  {w:'Bottom Surgery', c:'medical', d:'Genital reconstruction surgery. There are multiple procedures depending on the individual\'s goals and anatomy.'},
  {w:'Binding', c:'social', d:'Compressing chest tissue to create a flatter chest appearance. Should be done safely with a proper binder — never with tape or bandages.'},
  {w:'Tucking', c:'social', d:'A technique used by some trans women to minimise the appearance of a genital bulge when wearing tight clothing.'},
  {w:'Ally', c:'community', d:'A cisgender person who supports and advocates for trans rights. True allyship requires action, not just words.'},
  {w:'TERF', c:'community', d:'Trans-Exclusionary Radical Feminist — someone who claims feminism while excluding trans women. Their views are not supported by mainstream feminism or science.'},
  {w:'Chosen Name', c:'social', d:'The name a trans person chooses for themselves, which reflects their true gender identity. This IS their real name.'},
  {w:'Genderfluid', c:'identity', d:'A gender identity that shifts or changes over time — sometimes feeling more masculine, sometimes more feminine, sometimes neither.'},
  {w:'Agender', c:'identity', d:'Identifying as having no gender, or being gender-neutral. Falls under the non-binary umbrella.'},
  {w:'Two-Spirit', c:'identity', d:'A term used by some Indigenous North American peoples to describe a person who fulfils a traditional third-gender or other gender-variant role.'},
  {w:'Hijra', c:'identity', d:'A term used in South Asia for people who are assigned male at birth but identify as a third gender. Hijras have a long, sacred cultural history.'},
  {w:'WPATH', c:'medical', d:'World Professional Association for Transgender Health — the global organisation that publishes evidence-based standards of care for transgender health.'},
  {w:'Informed Consent', c:'medical', d:'A model of care where patients receive HRT after being informed of risks and benefits, without requiring lengthy psych evaluations. Used in many progressive clinics.'},
  {w:'SRS / GRS', c:'medical', d:'Sex Reassignment Surgery / Gender Reassignment Surgery — now often called Gender Confirmation Surgery (GCS) to reflect that it confirms rather than changes identity.'},
  {w:'Estradiol', c:'medical', d:'The primary form of estrogen used in feminising HRT. Available as pills, patches, injections, and gels.'},
  {w:'Testosterone', c:'medical', d:'The primary hormone used in masculinising HRT. Available as injections, gels, and patches.'},
  {w:'Anti-androgen', c:'medical', d:'Medication that reduces testosterone levels. Common types include spironolactone, cyproterone acetate, and GnRH agonists.'},
  {w:'Chosen Family', c:'community', d:'The family trans people build from friends, mentors, and community who truly see and support them. Often more meaningful than biological family.'},
  {w:'Stealth', c:'social', d:'When a trans person lives as their true gender without disclosing their trans status. This is a personal choice that deserves respect.'},
  {w:'Pride', c:'community', d:'The celebration of LGBTQ+ identity, community, and rights. Originally a protest, now also a celebration of visibility and self-love.'}
];

const HRT = [
  {i:'💊', t:'Estrogen (E2)', b:'The primary feminising hormone. Effects include breast development, softer skin, fat redistribution, reduced body hair, and emotional changes.\n\nTimeline: Skin softening (1-3 months), breast budding (3-6 months), fat redistribution (3-6 months), full effects (2-5 years).\n\nForms: oral tablets, sublingual, patches, injections, gel.\n\nCommon in India: Progynova (estradiol valerate) 1mg/2mg.'},
  {i:'🧬', t:'Anti-Androgens', b:'Reduce testosterone to allow estrogen to work effectively.\n\nTypes:\n• Spironolactone (Aldactone) — most common globally\n• Cyproterone acetate — very effective, common in India/EU\n• Bicalutamide — newer, fewer side effects\n• GnRH agonists — most precise, most expensive\n\nMonitor: potassium levels (spiro), liver function (cypro).'},
  {i:'💉', t:'Testosterone (T)', b:'The primary masculinising hormone. Effects include voice deepening, facial hair, muscle development, fat redistribution, and body hair growth.\n\nTimeline: Voice changes (3-12 months), facial hair (6-12 months), muscle growth (6-12 months), full effects (3-5 years).\n\nForms: IM injections, topical gel, patches.\n\nCommon in India: Sustanon 250, Nebido (long-acting).'},
  {i:'🔬', t:'Blood Tests', b:'Regular monitoring is essential for safe HRT:\n\n• Estradiol levels (target: 100-200 pg/mL for feminising)\n• Testosterone levels\n• Complete blood count\n• Liver function tests (especially with cypro)\n• Potassium (especially with spiro)\n• Prolactin (especially with cypro)\n• Lipid panel\n\nFrequency: every 3 months first year, then every 6-12 months.'},
  {i:'⚖️', t:'Progesterone', b:'Optional addition to feminising HRT. Some report benefits for:\n• Breast development (rounding/fullness)\n• Sleep quality\n• Mood stabilisation\n• Libido\n\nCommon form: micronised progesterone (Susten in India), 100-200mg taken rectally or orally at bedtime.\n\nEvidence is mixed but many trans women report subjective benefits.'},
  {i:'🧠', t:'Mental Health on HRT', b:'HRT can significantly affect mood and emotions:\n\nFeminising HRT: Many report feeling emotions more deeply, crying more easily, feeling more \"present\". Some experience mood swings early on.\n\nMasculinising HRT: Some report feeling emotions differently — less crying, but not less feeling. Increased energy and sometimes irritability early on.\n\nBoth: Reduced gender dysphoria is the most commonly reported mental health benefit.'},
  {i:'⚠️', t:'DIY HRT Safety', b:'If you are self-medicating (we understand why):\n\n• Get blood tests regardless — many labs allow walk-in testing\n• Start low, go slow\n• Research your sources carefully\n• Monitor liver and kidney function\n• Know the signs of blood clots: leg pain/swelling, chest pain, sudden headache\n• Find a doctor willing to monitor you even if they didn\'t prescribe\n• The goal is always to transition to supervised care when possible'}
];

const MVR = [
  {m:'Being trans is a mental illness', r:'Being trans is not a mental illness. The WHO removed it from mental disorder classifications in 2019. Gender dysphoria is the distress from the mismatch — the identity itself is healthy and valid.', mc:'rgba(255,100,100,.15)', rc:'rgba(91,206,250,.12)'},
  {m:'Trans people are confused', r:'Trans people are often among the most self-aware people you will meet. It takes extraordinary clarity to identify and articulate your authentic gender in a world that pressures you not to.', mc:'rgba(200,80,80,.12)', rc:'rgba(91,206,250,.12)'},
  {m:'Children are too young to know their gender', r:'Research shows children have a stable sense of gender identity by age 3-4. Trans children who are supported have mental health outcomes equal to their cisgender peers.', mc:'rgba(180,70,70,.12)', rc:'rgba(91,206,250,.12)'},
  {m:'HRT is dangerous and experimental', r:'HRT has been prescribed since the 1920s. It uses the same hormones present in every human body. With proper medical supervision, it is safe and well-understood.', mc:'rgba(160,60,60,.12)', rc:'rgba(91,206,250,.12)'},
  {m:'Trans women are not real women', r:'Trans women are women. Gender identity is determined by neurology and self-knowledge, not chromosomes or genitals. Every major medical organisation affirms this.', mc:'rgba(255,90,90,.12)', rc:'rgba(91,206,250,.12)'},
  {m:'Being trans is a trend', r:'Trans people have existed in every culture throughout history — hijra in India, Two-Spirit in Indigenous cultures, kathoey in Thailand. What\'s new is visibility, not existence.', mc:'rgba(200,80,80,.12)', rc:'rgba(91,206,250,.12)'},
  {m:'You need surgery to be really trans', r:'Being trans is about identity, not anatomy. Many trans people never have surgery — by choice, cost, or access. No surgery makes someone "more" or "less" trans.', mc:'rgba(180,70,70,.12)', rc:'rgba(91,206,250,.12)'},
  {m:'Trans people regret transitioning', r:'Studies consistently show regret rates under 1-3%. The vast majority of trans people report dramatically improved quality of life after transitioning.', mc:'rgba(160,60,60,.12)', rc:'rgba(91,206,250,.12)'}
];

const STORIES = [
  {e:'🌸', t:'Finding My Voice', p:'Aria, 24 · She/Her · 2 years on HRT', b:'The first time someone called me "ma\'am" on the phone, I cried for ten minutes. Not because of the word — but because my voice had found its home. Two years of practice, and the world finally hears what I always heard inside.'},
  {e:'💙', t:'My Father\'s First Hug', p:'Kai, 19 · He/Him · Pre-everything', b:'I came out expecting to lose my family. My father was quiet for three days. On the fourth day, he hugged me and said, "I don\'t understand everything, but I love you and I\'ll learn." That hug rebuilt my whole world.'},
  {e:'✨', t:'The Mirror Smiled Back', p:'River, 27 · They/Them · 1 year on T', b:'For 26 years, I avoided mirrors. One morning, about eight months on testosterone, I walked past the bathroom mirror and stopped. The person looking back was smiling. I didn\'t recognise them at first — not because they were different, but because they were finally real.'},
  {e:'💜', t:'Chosen Family', p:'Luna, 31 · She/Her · Post-transition', b:'My biological family left. But the family I built — my trans sisters, my allies, my community — they showed up in ways blood never did. They held my hand through surgery, celebrated my name change, and reminded me daily that I am loved.'},
  {e:'🌈', t:'The Classroom', p:'Jay, 16 · They/He · Student', b:'My teacher asked the class to share their pronouns on the first day. When I said "they/he," she nodded and moved on. No questions, no stares. Just acceptance. I felt seen for the first time in a school. That teacher changed my life.'},
  {e:'🏳️‍⚧️', t:'First Sari', p:'Priya, 29 · She/Her · India', b:'My grandmother helped me drape my first sari. She said, "I always knew my grandchild would look beautiful in this." In that moment, centuries of South Asian trans heritage wrapped around me. I wasn\'t just wearing fabric — I was wearing history.'}
];

const SEED_WALL = [
  {t:'Starting HRT next week. Terrified and excited. Both feelings are valid. 💜', d:'2 hours ago'},
  {t:'To the person who just came out — we see you and we love you. 🏳️‍⚧️', d:'5 hours ago'},
  {t:'3 years on E today! The journey has been everything. Stay strong, friends. ✨', d:'Yesterday'},
  {t:'Some days are hard. Today is one of them. But tomorrow might not be. 🌸', d:'Yesterday'},
  {t:'Just found this app. I have never felt so seen. Thank you. 💖', d:'2 days ago'}
];

const CRISIS = {
  translife: {name:'Trans Lifeline (US)', num:'877-565-8860', note:'By and for trans people. 24/7.'},
  trevor:    {name:'Trevor Project (US)', num:'866-488-7386', note:'LGBTQ+ youth crisis. 24/7.'},
  samaritans:{name:'Samaritans (UK)',     num:'116 123',     note:'24/7 emotional support.'},
  icall:     {name:'iCall (India)',       num:'9152987821',  note:'TISS Mumbai. LGBTQ+ affirming.'},
  vandrevala: {name:'Vandrevala Fdn (India)', num:'1860-2662-345', note:'24/7 mental health.'},
  switchboard:{name:'Switchboard (UK)',   num:'0300 330 0630',note:'LGBTQ+ helpline.'},
  crisis_txt:{name:'Crisis Text Line',   num:'Text HOME to 741741', note:'US text-based support.'}
};

// ══════════════════════════════════════════════════════════════════════
// AI CHAT ENGINE
// ══════════════════════════════════════════════════════════════════════
const AI_ENGINE = {
  msgCount: 0, history: [], lastTopic: null, sentTips: new Set(),
  responses: [
    {score:10, keys:['coming out','come out','tell my parents','tell my family','tell my friends','tell my mom','tell my dad','disclose','closeted','in the closet'],
     r:[`Coming out is one of the most personal decisions you'll ever make — and there is no single right way to do it. 💜\n\n**Before you come out:**\n- Make sure you have a safe place to stay if things don't go well\n- Consider starting with the person most likely to be supportive\n- You don't have to come out to everyone at once\n- Written letters or messages can be powerful if face-to-face feels too hard\n\nYour safety always comes first. You don't owe anyone this information before you're ready. 🌸`]},
    {score:10, keys:['hrt','hormone','estrogen','testosterone','estradiol','spiro','cypro','anti-androgen','pills','injections','patches'],
     r:[`HRT is one of the most powerful tools in a medical transition. 💊\n\n**Feminising HRT** (estrogen + anti-androgen): softer skin, breast growth, fat redistribution, emotional changes. Timeline: 1-5 years for full effects.\n\n**Masculinising HRT** (testosterone): voice deepening, facial hair, muscle growth, body hair. Timeline: 3-5 years.\n\n**In India:** Progynova, Sustanon, and Aldactone are commonly available.\n\nAlways get blood tests every 3-6 months. Your health matters. 🌸`]},
    {score:12, keys:['dysphoria','hate my body','wrong body','don\'t feel right','uncomfortable','can\'t look','mirror','disgusted','don\'t recognize'],
     r:[`Dysphoria is real, it's painful, and what you're feeling is valid. 💙\n\n**What can help right now:**\n- Wear clothes that affirm your identity\n- Avoid mirrors if they trigger you today\n- Focus on parts of yourself that do feel right\n- Ground yourself: 5 things you see, 4 you touch, 3 you hear\n- Talk to someone who understands\n\nDysphoria lies to you. It tells you that who you are is wrong. But you are not wrong — you are becoming. 🌸`]},
    {score:9, keys:['voice','voice training','pitch','resonance','sound feminine','sound masculine','voice coach','vocal'],
     r:[`Voice training is a journey and every voice can change with practice. 🎙️\n\n**For feminising:** Focus on resonance (bright, forward placement) more than pitch. Aim for 180-220Hz but resonance matters more than numbers.\n\n**For masculinising:** T will lower your voice naturally but you can still train for placement and intonation.\n\n**Daily practice:** 15 mins is better than 1 hour once a week. Use the Voice tab in this app to track your pitch! 🌸`]},
    {score:11, keys:['suicide','kill myself','don\'t want to live','end it','self harm','cutting','hurting myself','want to die','no reason to live','hopeless'],
     r:[`I hear you, and I'm so glad you're still here. 💙\n\n**Please reach out right now:**\n- Trans Lifeline: 877-565-8860\n- Trevor Project: 866-488-7386\n- Crisis Text Line: Text HOME to 741741\n- India: iCall 9152987821\n\nYou matter. Your pain is real but it is not permanent. There are people who want to help — and they understand what you're going through.\n\nPlease don't go through this alone. 💜🏳️‍⚧️`]},
    {score:8, keys:['family','parents','mother','father','mom','dad','sister','brother','rejected','kicked out','disowned'],
     r:[`Family relationships as a trans person can be incredibly complex and painful. 💜\n\n**If you've been rejected:** Your pain is real and you didn't deserve it. Many families need time — some come around, some don't.\n\n**What you should know:**\n- Chosen family is real family\n- PFLAG and similar orgs help parents understand\n- You are not responsible for managing their emotions\n- Your identity is not negotiable\n\nYou deserve love without conditions. 🌸`]},
    {score:8, keys:['dating','relationship','love','partner','boyfriend','girlfriend','attracted','single','lonely','romance'],
     r:[`Being trans and dating comes with extra vulnerability — and your feelings about that are completely valid. 💖\n\n**Key truths:**\n- The right person will celebrate your identity, not tolerate it\n- You don't owe anyone your medical history before you're ready\n- Trans people have loving, committed relationships every single day\n- You deserve someone who sees you — really sees you\n\nDon't settle for someone who treats your identity as something to overcome. You deserve joy. 🌸`]},
    {score:8, keys:['anxiety','anxious','worried','panic','scared','nervous','fear','stress','overwhelmed','can\'t breathe','breathing'],
     r:[`What you're feeling is real and valid. Anxiety is your body trying to protect you. 💙\n\n**Try this right now:**\n1. Breathe in for 4 counts\n2. Hold for 4 counts\n3. Breathe out for 4 counts\n4. Repeat 4 times\n\nOr try the Breathing exercise in the Wellness tab of this app.\n\nYou are safe right now. This feeling will pass. And you are stronger than you know. 🌸`]},
    {score:7, keys:['pronouns','misgendered','wrong pronoun','dead name','deadname','old name','birth name'],
     r:[`Being misgendered hurts. And it's not "being sensitive" — it's being disrespected. 💜\n\n**Your pronouns are not a preference. They are a fact about you.**\n\nIf someone consistently misgenders you:\n- Correct them calmly if you feel safe\n- Decide if the relationship is worth maintaining\n- Remember: their failure doesn't define your identity\n\nYour chosen name is your real name. Full stop. 🏳️‍⚧️`]},
    {score:7, keys:['legal','name change','change name','documents','passport','id','birth certificate','court','office'],
     r:[`Legal recognition matters — it's your name and identity on paper. 📋\n\n**In India:**\n- NALSA judgment (2014) affirmed trans rights\n- Apply for Transgender Certificate through District Magistrate\n- Update Aadhaar, PAN, voter ID\n\n**In the US:** varies by state. Many allow court-ordered name changes.\n\n**In the UK:** Gender Recognition Certificate (GRC) process.\n\nYou deserve documents that reflect who you truly are. 🌸`]},
    {score:9, keys:['india','indian','desi','south asia','nalsa','hijra','mumbai','delhi'],
     r:[`Being trans in India comes with unique challenges and a rich cultural heritage. 🏳️‍⚧️\n\n**Resources:**\n- iCall (TISS Mumbai): 9152987821\n- Humsafar Trust (Mumbai)\n- Sappho for Equality (Kolkata)\n- Sahodari Foundation (Chennai)\n\n**Legal:** NALSA judgment + Transgender Persons Act 2019 provide legal recognition.\n\nYou have rights. You have community. You have history. 💖`]},
    {score:7, keys:['makeup','lipstick','foundation','beauty','contouring','feminine look','beauty tips'],
     r:[`Makeup is self-expression and joy — there are no rules, only what feels right. 💄\n\n**Starter tips:** Mascara + brow grooming = biggest impact with least effort. Tinted moisturiser for natural coverage. Light blush adds warmth.\n\n**For feminising:** Highlight cheekbones, contour jaw lightly, winged eyeliner elongates eyes.\n\nCheck the Glow Guide tab for personalized advice based on your vibe! ✨`]},
    {score:7, keys:['euphoria','happy','good','joy','amazing','excited','celebrate','milestone','progress','proud'],
     r:[`YES! 🌟✨ Trans joy is a radical act!\n\nIn a world that often frames trans existence as suffering, claiming your joy is powerful. Every step, every milestone, every moment of gender euphoria deserves celebration.\n\nI'm so glad you're sharing this. What happened? Tell me everything. 💖🏳️‍⚧️`]},
    {score:6, keys:['thank','thanks','appreciate','helpful','love this','you are great'],
     r:[`You are so welcome. 💖 This is exactly what I'm here for.\n\nYou deserve support, understanding, and a space where you can be yourself without explanation. I'm always here — come back whenever you need.\n\nTake care of yourself today. You matter. 🌸 🏳️‍⚧️`]}
  ],
  fallbacks: [
    `I'm here with you, and whatever you're feeling is valid. 💖\n\nCan you tell me more about what's on your mind? I'm not going anywhere. 🌸`,
    `That's something I want to understand better. 💙\n\nCould you share more about what you're going through? Every journey is unique. 🏳️‍⚧️`,
    `Thank you for sharing that. 💜\n\nYou deserve thoughtful support. What would be most helpful — information, encouragement, or just someone here? 🌸`,
    `I hear you. You are not alone in whatever you're feeling. 💖\n\nThe trans community is vast and full of people who understand. You belong. 🏳️‍⚧️`
  ],
  reply(input) {
    this.msgCount++;
    const q = input.toLowerCase().trim();
    this.history.push({role:'user', text:input});
    if(this.history.length > 10) this.history.shift();
    let bestScore = 0, bestGroup = null;
    for(const g of this.responses) {
      let score = 0;
      for(const k of g.keys) if(q.includes(k)) score += g.score + k.length * 0.3;
      if(score > bestScore) { bestScore = score; bestGroup = g; }
    }
    let reply;
    if(bestGroup && bestScore > 0) {
      reply = bestGroup.r[Math.floor(Math.random() * bestGroup.r.length)];
      this.lastTopic = bestGroup.keys[0];
    } else {
      reply = this.fallbacks[Math.floor(Math.random() * this.fallbacks.length)];
    }
    // Add user name if available
    const uname = localStorage.getItem('tp_name');
    if(uname && Math.random() < 0.3) {
      reply = `${uname}, ` + reply.charAt(0).toLowerCase() + reply.slice(1);
    }
    this.history.push({role:'ai', text:reply});
    if(this.history.length > 10) this.history.shift();
    return reply;
  }
};

// ══════════════════════════════════════════════════════════════════════
// GLOW GUIDE ENGINE
// ══════════════════════════════════════════════════════════════════════
const GLOW = {
guides: {
"Soft Feminine": {
  makeup:`For a **soft feminine** look, think dewiness, blush, and gentle colour. Tinted moisturiser, cream blush (rose/peach) on cheeks, champagne highlight on cheekbones.\n\nEyes: warm pink eyeshadow, mascara, nude-pink lip. Avoid sharp lines — blend everything.\n\n✨ Top picks: NARS Dewy Skin tint, Rare Beauty blush, Charlotte Tilbury Pillow Talk.`,
  outfit:`Flowing fabrics, gentle colours: lavender, dusty rose, cream, sage. A flowy midi dress, oversized cardigans, delicate jewellery, Mary Janes.\n\n🌸 Inspo: cottagecore, ballet core, soft girl aesthetic.`,
  hair:`Loose waves, half-up with face-framing pieces, flower clips or pearl pins. Light curling wand + shine serum for glassy hair. 🌸`,
  expression:`Soft energy is warmth and openness. Move slowly, make eye contact warmly, speak softly, laugh freely.\n\n💖 Before going out: find three things you love about how you look. Name them out loud.`,
  affirmation:`You don't need to become softer — you already carry so much gentleness. Let it show. 🌸`
},
"Elegant & Refined": {
  makeup:`Precision, quality, statement. Full-coverage foundation, sculpted brows, classic eye (matte brown crease, fine liner), dramatic lashes, bold lip (berry, red, or plum).\n\n✨ Bold lip rule: keep everything else simple.`,
  outfit:`Fit, quality fabric, restrained colour. Tailored blazer, column midi, silk blouse. Natural fibres: silk, wool, cashmere.\n\n👗 Inspo: classic French, old Hollywood, Audrey Hepburn.`,
  hair:`Sleek low bun with centre part, or a polished blowout. For natural hair: a defined twist-out or elegant updo. ✨`,
  expression:`Inner stillness radiating outward. Unhurried movement, considered speech, sustained warm eye contact.\n\n💙 The most elegant thing: be genuinely interested in others.`,
  affirmation:`Elegance was never about what you wear — it's how you inhabit yourself. Walk in knowing that. ✨`
},
"Cute & Playful": {
  makeup:`Joyful, colourful! Flushed cheeks, glossy lips in strawberry/coral, graphic eyeliner in bold colours, press-on nails, tiny hearts near eyes. Don't worry about perfection! 🎀`,
  outfit:`Mix prints! Clash colours! Puff-sleeve tops, mini skirts, platform trainers, Y2K accessories, colourful tights.\n\n🎀 Inspo: Y2K, kawaii, indie girl, Clueless.`,
  hair:`Pigtails, space buns, braids with ribbon, butterfly clips everywhere. Curtain bangs for extra cuteness. Clip-in pastels for zero-commitment colour. ✨`,
  expression:`Playful energy: smile wide, move with bounce, be enthusiastic, compliment people immediately.\n\n🎀 The world is more fun when you act like it can be.`,
  affirmation:`There is nothing more courageous than unapologetic joy. Your playful energy is not childish — it's radical. 🌟`
},
"Natural & Real": {
  makeup:`BB cream, cream concealer only where needed, one coat brown-black mascara, a tiny bit of cream blush, lip balm. Under 10 minutes.\n\n✨ Secret: good skincare makes natural makeup extraordinary.`,
  outfit:`Quality basics in earthy tones. Linen, soft denim, crisp white tee, minimal gold jewellery. Fit matters enormously.\n\n🌿 Inspo: Scandi minimalism.`,
  hair:`Know your texture, work with it. Air dry. Simple: a hair claw, a delicate pin, or nothing at all. 🌿`,
  expression:`Comfortable in silence, genuine in connection, present in every room. Let your face react naturally.\n\n🌿 You're most attractive when you stop trying. Because you're already enough.`,
  affirmation:`You are most beautiful when you're most yourself. Not performing, not hiding. Just you. 🌿`
},
"Bold & Powerful": {
  makeup:`Statement-making. Full-coverage, dramatic smokey eye or power lip (true red, deep berry). Defined brows, sharp contour, blinding highlight.\n\n💜 You are the main character. Dress your face accordingly.`,
  outfit:`Occupying your full space. Structured blazer, wide-leg trousers with heel, all-black monochrome, bold-coloured dress.\n\nPower colours: black, deep red, cobalt blue, forest green. 💜`,
  hair:`Sleek high ponytail, voluminous curls, or dramatic structured updo. Deep red, jet black, or striking platinum. Walk like your hair cost a fortune. 💜`,
  expression:`Inner certainty. Don't rush, don't apologise for space, speak slower. Enter rooms like you meant to be there.\n\n💜 Decide before you walk out: today you belong everywhere.`,
  affirmation:`Being trans and being powerful are the same sentence. You have survived what would break others. That is power. 💜`
},
"Cozy & Comfortable": {
  makeup:`Good moisturiser, tinted SPF, warm nude eyeshadow, one coat mascara, peachy blush, lip balm. You look deeply comfortable in your skin. 🧸`,
  outfit:`Fleece, sherpa, jersey, waffle knit, cashmere. Oversized knit + soft trousers + thick socks. Warm neutrals: oatmeal, cream, rust, caramel. 🧸`,
  hair:`Loose bun, soft scrunchie, or just down and air-dried. Clean, soft, effortless. 🧸`,
  expression:`Make everyone feel at ease. Be present, offer warmth, let conversations breathe.\n\n🧸 Cozy is a gift you give other people by being relaxed.`,
  affirmation:`Rest is not laziness. Choosing softness today is self-love. You deserve to feel warm, safe, and at home in yourself. 🧸`
},
"Alternative & Edgy": {
  makeup:`Graphic liner, dark smokey eye, black or burgundy lips. Think editorial. Skin: matte perfection or deliberately undone.\n\n🖤 Your only rule: be intentional. Edgy is chosen chaos.`,
  outfit:`Personal mythology. Black jeans, band tees, leather jackets, platforms, fishnets, silver hardware, rings everywhere.\n\n🖤 Wear what excites YOU, not what alt people "should" wear.`,
  hair:`Dark, dramatic, or deliberately messy. Shaved sections, asymmetric cuts, bleach platinum. Texturising salt spray. 🖤`,
  expression:`Authentic nonconformity. Don't explain your look. Have deep, specific interests. Be sharp but not unkind.\n\n🖤 The most alt thing: be completely, uncomplicatedly yourself.`,
  affirmation:`You were never meant to fit in. Your edges, your darkness, your refusal to be palatable — that is your power. 🖤`
},
"Androgynous & Fluid": {
  makeup:`Sharpness and softness coexisting. Even skin, strong brows, defined but genderless eyes. Lip colour that reads as "person" — warm terracotta, dusty plum.\n\n✦ Goal: a face that makes people pause before categorising.`,
  outfit:`Wide-leg trousers, oversized shirts, jumpsuits, minimal knitwear. Neutrals, monochrome, or deliberately subversive accessories.\n\n🏳️‍⚧️ Goal: refuse to be limited by gender.`,
  hair:`Cropped, natural, or deliberately in-between. Sharp cuts, curtain bangs, or long with such ease it becomes genderless. Minimal, quality accessories. ✦`,
  expression:`Freedom from gender performance. Move how you want. Speak how you naturally speak. Be comfortable with ambiguity.\n\n🏳️‍⚧️ You are beyond the binary.`,
  affirmation:`You don't exist to make gender easy for others. You exist for yourself — in all your complexity. The world is catching up to you. ✦`
}
},
generate(goal) {
  const g = this.guides[goal] || this.guides["Natural & Real"];
  return {makeup:g.makeup, outfit:g.outfit, hair:g.hair, expression:g.expression, affirmation:g.affirmation};
}
};

// ══════════════════════════════════════════════════════════════════════
// MEDS DATABASE (India HRT Prices)
// ══════════════════════════════════════════════════════════════════════
const MEDS_DB = [
  {id:'progynova_2',   name:'Progynova 2mg (Estradiol Valerate)', type:'pill',      dose:'2mg',   perPack:28,  price:'₹280–350',   cat:'Estrogen'},
  {id:'progynova_1',   name:'Progynova 1mg (Estradiol Valerate)', type:'pill',      dose:'1mg',   perPack:28,  price:'₹220–280',   cat:'Estrogen'},
  {id:'ev_inj_10',     name:'Estradiol Valerate Injection 10mg',  type:'injection', dose:'10mg',  perPack:1,   price:'₹150–250',   cat:'Estrogen'},
  {id:'ev_inj_40',     name:'Estradiol Valerate Injection 40mg',  type:'injection', dose:'40mg',  perPack:1,   price:'₹350–500',   cat:'Estrogen'},
  {id:'estradiol_gel', name:'Estradiol Gel 0.06%',                type:'gel',       dose:'0.06%', perPack:30,  price:'₹400–600',   cat:'Estrogen'},
  {id:'cypro_50',      name:'Cyproterone Acetate 50mg',           type:'pill',      dose:'50mg',  perPack:10,  price:'₹180–250',   cat:'Anti-androgen'},
  {id:'spiro_100',     name:'Aldactone (Spironolactone) 100mg',   type:'pill',      dose:'100mg', perPack:15,  price:'₹90–150',    cat:'Anti-androgen'},
  {id:'spiro_50',      name:'Aldactone (Spironolactone) 50mg',    type:'pill',      dose:'50mg',  perPack:15,  price:'₹55–90',     cat:'Anti-androgen'},
  {id:'bica_50',       name:'Bicalutamide 50mg',                  type:'pill',      dose:'50mg',  perPack:10,  price:'₹250–400',   cat:'Anti-androgen'},
  {id:'micronized_p',  name:'Susten (Micronized Progesterone) 200mg', type:'pill',  dose:'200mg', perPack:10,  price:'₹180–280',   cat:'Progesterone'},
  {id:'sustanon',      name:'Sustanon 250 (Testosterone blend)',  type:'injection', dose:'250mg', perPack:1,   price:'₹250–400',   cat:'Testosterone'},
  {id:'nebido',        name:'Testosterone Undecanoate 250mg',     type:'injection', dose:'250mg', perPack:1,   price:'₹3500–5000', cat:'Testosterone'},
  {id:'androgel',      name:'Androgel 1% (Testosterone gel)',     type:'gel',       dose:'1%',    perPack:30,  price:'₹2000–3000', cat:'Testosterone'},
];

const DISCREET_MSGS = ['✨ Time for your update', '💊 Self-care reminder', '🌸 Your moment', '⭐ Daily check-in', '💜 Take care of you'];
const TYPE_EMOJI = {pill:'💊', patch:'🩹', injection:'💉', gel:'🧴'};

// ══════════════════════════════════════════════════════════════════════
// V6 — VOICE EXERCISE LIBRARY (20+ structured exercises)
// ══════════════════════════════════════════════════════════════════════
const VOICE_EXERCISES = [
  {id:'ve1',cat:'warmup',name:'Lip Trills',icon:'💋',dur:'2 min',level:'Beginner',desc:'Blow air through relaxed lips making a "brrr" sound. Glide up and down your range.',steps:['Relax jaw and lips completely','Blow air to create a buzzing "brrr"','Glide from low to high pitch slowly','Repeat 5 times, increasing range each time']},
  {id:'ve2',cat:'warmup',name:'Humming Scales',icon:'🎵',dur:'3 min',level:'Beginner',desc:'Hum up a scale feeling vibration shift from chest to face.',steps:['Start humming at your comfortable low pitch','Slowly glide upward note by note','Feel where the buzz moves — chest → throat → nose → forehead','Hold each note for 3 seconds']},
  {id:'ve3',cat:'warmup',name:'Yawn-Sigh',icon:'😮',dur:'2 min',level:'Beginner',desc:'Fake a yawn then sigh downward. Opens the throat.',steps:['Open mouth wide as if yawning','Feel throat open and relax','Sigh from high to low on "ahh"','Repeat 8 times']},
  {id:'ve4',cat:'pitch',name:'Pitch Slides',icon:'📈',dur:'3 min',level:'Beginner',desc:'Slide smoothly between low and high notes like a siren.',steps:['Start at your lowest comfortable note','Slide up smoothly (no jumps) to your highest','Slide back down','Do 5 rounds, trying to expand range each time']},
  {id:'ve5',cat:'pitch',name:'Pitch Anchoring',icon:'⚓',dur:'4 min',level:'Intermediate',desc:'Find and hold your target pitch for increasing durations.',steps:['Use the analyzer to find 180Hz','Speak "ahhh" and match that pitch','Hold for 5 seconds, rest, repeat','Increase hold time: 10s, 15s, 20s']},
  {id:'ve6',cat:'pitch',name:'Phrase Practice',icon:'💬',dur:'5 min',level:'Intermediate',desc:'Say common phrases maintaining target pitch throughout.',steps:['Set target: 175-200 Hz','Say: "Hi, how are you today?"','Check pitch stayed consistent','Try: "I would like a coffee, please"','Practice 10 different phrases']},
  {id:'ve7',cat:'pitch',name:'Reading Aloud',icon:'📖',dur:'5 min',level:'Advanced',desc:'Read a paragraph maintaining feminine pitch and intonation.',steps:['Choose any text (book, article, phone screen)','Read aloud at your target pitch','Focus on upward inflections at phrase ends','Record and listen back — adjust']},
  {id:'ve8',cat:'resonance',name:'Mask Resonance',icon:'😌',dur:'3 min',level:'Beginner',desc:'Shift vibration from chest to face and nose.',steps:['Hum at a comfortable pitch','Place fingers on your chest — feel vibration','Now "move" the hum higher without changing pitch','Goal: feel buzz in nose/forehead, not chest']},
  {id:'ve9',cat:'resonance',name:'Bright Vowels',icon:'✨',dur:'4 min',level:'Intermediate',desc:'Practice vowels that naturally lift resonance.',steps:['Say "eee" "ay" "ee" — feel the brightness','Now say "ooo" "ahh" — feel the darkness','Practice shifting "ahh" to be as bright as "eee"','Try words: "see, sea, ski, she" — keep them bright']},
  {id:'ve10',cat:'resonance',name:'Larynx Lift',icon:'⬆️',dur:'3 min',level:'Intermediate',desc:'Gently raise larynx position for brighter tone.',steps:['Swallow and feel your Adam\'s apple rise','Now try to hold that raised position','Say "eee" with larynx slightly raised','Practice speaking sentences in this position']},
  {id:'ve11',cat:'resonance',name:'Whisper-to-Voice',icon:'🌬️',dur:'4 min',level:'Advanced',desc:'Whisper bright words then add voice while keeping the placement.',steps:['Whisper "see, sea, ski, she" very brightly','Now add just a tiny bit of voice','Gradually increase volume','The bright placement should carry over']},
  {id:'ve12',cat:'intonation',name:'Question Melody',icon:'❓',dur:'3 min',level:'Beginner',desc:'Practice rising intonation at the end of statements.',steps:['Say "It was beautiful" as a statement (flat end)','Now say it as a question (rising end)','Practice: "That looks nice?" "Really?" "You think so?"','Feminine speech uses more pitch variation']},
  {id:'ve13',cat:'intonation',name:'Emotional Color',icon:'🎨',dur:'4 min',level:'Intermediate',desc:'Add emotional emphasis and melody to speech.',steps:['Say "wow" with genuine surprise','Say "really?" with curiosity','Say "that\'s amazing" with excitement','Notice how your pitch dances — this is feminine intonation']},
  {id:'ve14',cat:'intonation',name:'Storytelling',icon:'📚',dur:'5 min',level:'Advanced',desc:'Tell a short story with dynamic pitch, pauses, and emphasis.',steps:['Pick any short story or event from your day','Tell it aloud with exaggerated emotion','Use pauses for drama, pitch rises for excitement','Record and compare to how you normally speak']},
  {id:'ve15',cat:'breathwork',name:'Diaphragm Support',icon:'🫁',dur:'3 min',level:'Beginner',desc:'Build breath control for sustained, steady voice.',steps:['Lie flat, place hand on belly','Breathe in — belly rises (not chest)','Breathe out slowly on "sssss" for 15 seconds','Repeat 5 times, extending the "sss" each round']},
  {id:'ve16',cat:'breathwork',name:'Soft Onset',icon:'🕊️',dur:'3 min',level:'Intermediate',desc:'Start words gently without a hard glottal attack.',steps:['Say "uh-oh" — feel the hard click in your throat','Now say "huh-oh" — much softer start','Practice "hello" → "h-hello" (soft H before)','Feminine voices use softer onsets']},
  {id:'ve17',cat:'daily',name:'Morning Voice',icon:'🌅',dur:'5 min',level:'All',desc:'Gentle morning warm-up routine to start your day right.',steps:['1. Lip trills (30 seconds)','2. Humming from low to high (1 min)','3. "Eee" vowel slides (1 min)','4. 3 phrases at target pitch (2 min)','5. Read one sentence aloud with emotion']},
  {id:'ve18',cat:'daily',name:'Before Calls',icon:'📱',dur:'2 min',level:'All',desc:'Quick warm-up before phone calls or meetings.',steps:['Hum at your target pitch for 10 seconds','Say "hi, how are you?" 3 times at target pitch','Take 3 deep breaths','Make the call with confidence!']},
  {id:'ve19',cat:'daily',name:'Bedtime Review',icon:'🌙',dur:'3 min',level:'All',desc:'Reflect on your voice use today and set tomorrow\'s goal.',steps:['Rate today\'s voice comfort: 1-10','What went well? (a call, a store visit?)','What felt hard?','Set one small goal for tomorrow']},
  {id:'ve20',cat:'advanced',name:'Conversation Drill',icon:'🗣️',dur:'5 min',level:'Advanced',desc:'Maintain your trained voice through a full conversation.',steps:['Call a friend or talk to someone','Focus on maintaining resonance + pitch','Don\'t force — let the training habits work','After: rate comfort and naturalness 1-10']},
  {id:'ve21',cat:'advanced',name:'Singing Bridge',icon:'🎤',dur:'5 min',level:'Advanced',desc:'Singing exercises that bridge into speech patterns.',steps:['Pick a song you love (any genre)','Sing the chorus at your target pitch','Now speak the lyrics as a sentence','Feel how the singing placement carries over']},
  {id:'ve22',cat:'advanced',name:'Emotion Switching',icon:'🎭',dur:'4 min',level:'Advanced',desc:'Maintain voice while switching between emotions.',steps:['Say a sentence happily → sadly → angrily → neutrally','Your trained voice should hold across all emotions','This builds "muscle memory" for natural use','Practice with: "I can\'t believe it"']}
];

// ══════════════════════════════════════════════════════════════════════
// V6 — TRANSITION TIMELINE (Interactive Guide)
// ══════════════════════════════════════════════════════════════════════
const TRANSITION_TIMELINE = {
  feminising: [
    {month:'0-1',icon:'🌱',title:'Early Days',changes:['Skin begins softening','Decreased oiliness','Emotional changes may start','Libido changes'],note:'Most changes not yet visible. Be patient with yourself.'},
    {month:'1-3',icon:'🌸',title:'First Bloom',changes:['Skin noticeably softer','Breast budding begins (may be tender)','Body odour changes','Fat begins redistributing'],note:'Breast growth starts! Very normal to feel tender.'},
    {month:'3-6',icon:'💜',title:'Finding Shape',changes:['Breast growth continues','Face softening','Body hair thinning','Fat moving to hips/thighs','Muscle mass decreasing'],note:'Others may start noticing changes.'},
    {month:'6-12',icon:'✨',title:'Becoming',changes:['Significant breast growth','Face clearly feminising','Body hair much finer','Emotional landscape deepening','Skin very soft'],note:'Many report this as the most euphoric period.'},
    {month:'12-24',icon:'🌟',title:'Flourishing',changes:['Breast growth continues (up to 5 years)','Full fat redistribution','Body hair at final state','Facial changes maturing'],note:'Changes slow but continue. Full results: 2-5 years.'},
    {month:'24+',icon:'👑',title:'Full Bloom',changes:['Final breast size stabilising','Permanent fat distribution','Complete skin changes','Full emotional range'],note:'You are fully you. Maintenance continues.'}
  ],
  masculinising: [
    {month:'0-1',icon:'🌱',title:'Beginning',changes:['Increased energy','Bottom growth starting','Oilier skin','Mood/libido changes'],note:'T works fast. Some changes start within weeks.'},
    {month:'1-3',icon:'🔥',title:'Ignition',changes:['Voice starting to crack/deepen','Increased muscle tone','Acne possible','Body hair beginning','Bottom growth continuing'],note:'Voice changes are often the first thing others notice.'},
    {month:'3-6',icon:'💪',title:'Strengthening',changes:['Voice noticeably deeper','Facial hair starting (peach fuzz)','Muscle development visible','Fat redistributing','Period may stop'],note:'This is a powerful time. Your body is transforming.'},
    {month:'6-12',icon:'⚡',title:'Transformation',changes:['Voice in male range','Facial hair growing in','Significant muscle growth','Body shape changing','Body hair thickening'],note:'Many pass consistently at this stage.'},
    {month:'12-24',icon:'🏔️',title:'Maturing',changes:['Voice settled','Full facial hair pattern emerging','Complete fat redistribution','Body hair at adult levels'],note:'Changes continue for years. Facial hair may take 3-5 years.'},
    {month:'24+',icon:'👑',title:'Prime',changes:['Final voice depth','Full facial hair','Complete body changes','Continued gradual changes'],note:'Maintenance dose. Your body has found its stride.'}
  ]
};

// ══════════════════════════════════════════════════════════════════════
// V6 — MEDICATION INTERACTIONS (Basic offline database)
// ══════════════════════════════════════════════════════════════════════
const MED_INTERACTIONS = [
  {meds:['spiro_100','spiro_50'],avoid:['Potassium supplements','ACE inhibitors','Salt substitutes (KCl)'],caution:['NSAIDs (ibuprofen)','Digoxin'],note:'Spiro raises potassium. Monitor levels every 3 months.'},
  {meds:['cypro_50'],avoid:['Heavy alcohol','Hepatotoxic drugs'],caution:['Antidepressants (may increase sedation)','Valproic acid'],note:'Cypro affects liver. Get LFTs every 3-6 months.'},
  {meds:['progynova_2','progynova_1','estradiol_gel'],avoid:['Smoking (increases clot risk significantly)','Grapefruit juice (affects metabolism)'],caution:['St. John\'s Wort (reduces effectiveness)','Some antibiotics (rifampin)'],note:'Avoid smoking with estrogen. Patches/injections are safer than pills for clot risk.'},
  {meds:['sustanon','nebido','androgel'],avoid:['Blood thinners (warfarin — dose adjustment needed)'],caution:['Insulin (T can change sensitivity)','Corticosteroids'],note:'T can increase red blood cell count. Monitor hematocrit.'},
  {meds:['micronized_p'],avoid:['Heavy alcohol'],caution:['Sedatives (additive drowsiness)','Antifungals (ketoconazole)'],note:'Take at bedtime — causes drowsiness. Rectal route is more effective.'}
];

// ══════════════════════════════════════════════════════════════════════
// V6 — SIDE EFFECTS DATABASE
// ══════════════════════════════════════════════════════════════════════
const SIDE_EFFECTS_DB = [
  {name:'Headache',icon:'🤕',severity:['mild','moderate','severe'],assocMeds:['Estrogen','Anti-androgen','Progesterone']},
  {name:'Nausea',icon:'🤢',severity:['mild','moderate','severe'],assocMeds:['Estrogen','Cyproterone']},
  {name:'Mood Swings',icon:'🎭',severity:['mild','moderate','severe'],assocMeds:['Estrogen','Testosterone','Progesterone']},
  {name:'Fatigue',icon:'😴',severity:['mild','moderate','severe'],assocMeds:['Spironolactone','Cyproterone','Progesterone']},
  {name:'Breast Tenderness',icon:'💗',severity:['mild','moderate','severe'],assocMeds:['Estrogen','Progesterone']},
  {name:'Acne',icon:'😣',severity:['mild','moderate','severe'],assocMeds:['Testosterone']},
  {name:'Hot Flashes',icon:'🔥',severity:['mild','moderate','severe'],assocMeds:['Anti-androgen','GnRH agonist']},
  {name:'Dizziness',icon:'💫',severity:['mild','moderate','severe'],assocMeds:['Spironolactone','Cyproterone']},
  {name:'Weight Change',icon:'⚖️',severity:['mild','moderate','severe'],assocMeds:['Estrogen','Testosterone','Progesterone']},
  {name:'Sleep Changes',icon:'🌙',severity:['mild','moderate','severe'],assocMeds:['Progesterone','Testosterone']},
  {name:'Libido Change',icon:'💕',severity:['mild','moderate','severe'],assocMeds:['Estrogen','Testosterone','Anti-androgen']},
  {name:'Dry Skin',icon:'🏜️',severity:['mild','moderate'],assocMeds:['Spironolactone']},
  {name:'Muscle Cramps',icon:'💪',severity:['mild','moderate'],assocMeds:['Spironolactone']},
  {name:'Irritability',icon:'😤',severity:['mild','moderate','severe'],assocMeds:['Testosterone']}
];

// ══════════════════════════════════════════════════════════════════════
// V6 — MINDFULNESS EXERCISES (10 guided sessions)
// ══════════════════════════════════════════════════════════════════════
const MINDFULNESS_EXERCISES = [
  {id:'m1',name:'Body Scan',icon:'🧘',dur:'5 min',desc:'Progressive relaxation from toes to crown.',steps:['Close your eyes. Take 3 deep breaths.','Focus on your toes. Notice any sensation. Relax them.','Move to feet, ankles, calves. Breathe into each area.','Continue: knees, thighs, hips, belly.','Chest, shoulders, arms, hands.','Neck, jaw, face, top of head.','Notice your whole body as one. Breathe. You are here.']},
  {id:'m2',name:'Gender Affirmation',icon:'🏳️‍⚧️',dur:'5 min',desc:'A meditation specifically for affirming your identity.',steps:['Sit comfortably. Close your eyes.','Say your chosen name silently. Feel it resonate.','Visualize yourself as you truly are. See every detail.','Say: "I am [name]. My pronouns are [pronouns]. I am valid."','Imagine someone who loves you seeing you. Their smile.','Feel the warmth of being fully known, fully accepted.','Carry this feeling with you today.']},
  {id:'m3',name:'Safe Space',icon:'🏠',dur:'5 min',desc:'Create a mental sanctuary you can return to anytime.',steps:['Close your eyes. Breathe deeply.','Imagine a place where you feel completely safe.','Notice: What do you see? Hear? Smell?','You are alone here. No judgment. No expectations.','In this space, you are exactly who you are.','Spend 2 minutes here. Breathe. Rest.','Remember: you can return here anytime.']},
  {id:'m4',name:'Loving Kindness',icon:'💖',dur:'5 min',desc:'Send compassion to yourself and others.',steps:['Sit still. Place hand on your heart.','Say: "May I be safe. May I be happy. May I be healthy."','Feel warmth spreading from your hand.','Now think of someone you love. Send them the same wishes.','Think of the trans community. Send love to all.','Finally: someone who is struggling. Send them strength.','Return to yourself. You are loved.']},
  {id:'m5',name:'Grounding 5-4-3-2-1',icon:'🌍',dur:'3 min',desc:'Quickly ground yourself using your five senses.',steps:['Name 5 things you can SEE right now.','Name 4 things you can TOUCH right now.','Name 3 things you can HEAR right now.','Name 2 things you can SMELL right now.','Name 1 thing you can TASTE right now.','Take 3 deep breaths. You are here. You are present.']},
  {id:'m6',name:'Dysphoria Relief',icon:'💙',dur:'5 min',desc:'Gentle guidance for moments of dysphoria.',steps:['Acknowledge: "I am experiencing dysphoria. It is temporary."','Place both hands on your chest. Feel your heartbeat.','Your heart beats for YOU. It knows who you are.','Breathe in: "I am real." Breathe out: "This will pass."','Name 3 things about yourself that bring euphoria.','Remember a moment you felt at home in yourself.','The dysphoria will lift. You remain.']},
  {id:'m7',name:'Morning Intention',icon:'🌅',dur:'3 min',desc:'Set a positive intention for your day.',steps:['Before getting up, take 5 breaths.','Ask yourself: "What do I need today?"','Set one intention: courage, patience, joy, rest...','Say: "Today I choose [intention]."','Visualize one moment today going well.','Take 3 more breaths. Open your eyes. Begin.']},
  {id:'m8',name:'Anxiety Release',icon:'🌊',dur:'5 min',desc:'Wash away anxiety with breath and visualization.',steps:['Sit. Notice where anxiety lives in your body.','Breathe in cool blue light — it fills that area.','Breathe out dark smoke — the anxiety leaving.','Repeat 10 times. Each breath: lighter.','Imagine standing under a gentle waterfall.','The water washes everything away.','Only peace remains.']},
  {id:'m9',name:'Self-Compassion',icon:'🌸',dur:'5 min',desc:'Practice being gentle with yourself.',steps:['Think of something you\'ve been hard on yourself about.','Now imagine your best friend told you this.','What would you say to THEM? (Probably something kind.)','Say those same words to yourself. Out loud if possible.','Place hand on heart: "I am doing my best."','"My best is enough."','Sit with that truth for 1 minute.']},
  {id:'m10',name:'Gratitude',icon:'🙏',dur:'3 min',desc:'Find 3 things to be grateful for — even on hard days.',steps:['Close your eyes. Take 3 breaths.','Name one thing about your body you\'re grateful for.','Name one person who accepts you.','Name one moment of gender euphoria, no matter how small.','Hold all three in your mind. Feel their warmth.','Say: "Even on hard days, there is good."','Carry this with you.']}
];

// ══════════════════════════════════════════════════════════════════════
// V6 — COMING OUT GUIDE
// ══════════════════════════════════════════════════════════════════════
const COMING_OUT_GUIDE = [
  {step:1,title:'Before You Come Out',icon:'🤔',content:'**Assess your safety first.** Do you have a safe place to stay? Financial independence? A support person? Your safety is more important than any timeline.\\n\\n**You don\'t have to come out to everyone at once.** Start with the person most likely to be supportive.'},
  {step:2,title:'Prepare Yourself',icon:'📝',content:'**Write it down.** A letter, notes, or a text can be easier than face-to-face. It lets you say exactly what you mean without being interrupted.\\n\\n**Practice with someone safe first** — a friend, a therapist, or even a mirror.'},
  {step:3,title:'Choose Your Method',icon:'💬',content:'**Options:** Face-to-face, letter, email, text, phone call, video call.\\n\\n**Each is valid.** Choose what feels safest and most authentic to you. There is no "right" way.'},
  {step:4,title:'The Conversation',icon:'🗣️',content:'**Keep it simple:** "I am [trans/non-binary/etc]. My name is [name] and my pronouns are [pronouns]."\\n\\n**You don\'t owe explanations.** But sharing your feelings can help: "I\'ve felt this way for [time]. This is who I really am."'},
  {step:5,title:'Give Them Time',icon:'⏰',content:'**People may need time to process.** A surprised reaction doesn\'t always mean rejection.\\n\\n**Set boundaries:** "I need you to use my name and pronouns. I understand it takes practice."'},
  {step:6,title:'After Coming Out',icon:'💜',content:'**Celebrate yourself.** You just did something incredibly brave.\\n\\n**Build your support network.** Trans communities, LGBTQ+ groups, affirming therapists.\\n\\n**Remember:** Their reaction is about them. Your identity is about you.'}
];

