import {
  Baby,
  Dna,
  Globe,
  HeartHandshake,
  Microscope,
  Ribbon,
  Scale,
} from "lucide-react";

// Each cause can be delivered through one or more partner organisations.
// Donations to a cause are split equally between its partners.
export const CHARITY_OPTIONS = [
  {
    value: "period_poverty",
    label: "International period poverty aid",
    icon: Globe,
    summary: "Menstrual products and dignity for people who can't afford them.",
    partners: [
      {
        name: "Days for Girls",
        website: "https://www.daysforgirls.org",
        blurb:
          "Sewing and distributing washable menstrual kits, and teaching menstrual health in schools, so girls don't miss class for lack of a pad.",
      },
      {
        name: "ActionAid",
        website: "https://www.actionaid.org.uk",
        blurb:
          "Works with local partners to end period poverty, from making period products available in schools to campaigning for them to be free and accessible.",
      },
    ],
    about:
      "Period poverty is the lack of access to menstrual products, sanitation and education. It keeps girls out of school and adults out of work, and it exists in every country, not only in low-income ones.",
    impact: [
      "Pads, cups and tampons distributed through local partners",
      "Menstrual health education in schools and community centres",
      "Advocacy that keeps period products affordable and available in public buildings",
    ],
  },
  {
    value: "fertility",
    label: "Fertility research and treatment grants",
    icon: Baby,
    summary: "Treatment grants and research for people trying to conceive.",
    partners: [
      {
        name: "RESOLVE: The National Infertility Association",
        website: "https://resolve.org",
        blurb:
          "Runs peer support groups, a helpline and advocacy that pushes insurers and lawmakers to cover fertility care.",
      },
      {
        name: "Fertility Network UK",
        website: "https://fertilitynetworkuk.org",
        blurb:
          "Free, impartial support and information for anyone in the UK struggling to conceive, including those going through treatment and loss.",
      },
      {
        name: "The Fertility Foundation",
        website: "https://www.fertilityfoundation.org",
        blurb:
          "The UK's infertility charity giving IVF grants to low-income individuals and couples who can't afford private treatment.",
      },
      {
        name: "Tommy's",
        website: "https://www.tommys.org",
        blurb:
          "Funds research into miscarriage, stillbirth and premature birth, and runs midwife-led pregnancy information and clinics.",
      },
    ],
    about:
      "Fertility care is expensive and unevenly accessible, and much of it is not covered by insurance or public health systems. Research into the causes of infertility and more affordable treatment lags behind demand.",
    impact: [
      "Treatment grants for people who can't afford care",
      "Research into the causes of infertility",
      "Support for people navigating treatment and loss",
    ],
  },
  {
    value: "cancer",
    label: "Ovarian and cervical cancer research and support",
    icon: Ribbon,
    summary: "Earlier detection and support for gynaecological cancers.",
    partners: [
      {
        name: "Ovarian Cancer Research Alliance",
        website: "https://ocrahope.org",
        blurb:
          "The largest funder of ovarian cancer research, pairing it with advocacy and support programmes for people in treatment.",
      },
      {
        name: "The Eve Appeal",
        website: "https://eveappeal.org.uk",
        blurb:
          "Funds research into the early detection and prevention of all five gynaecological cancers, and runs awareness work on symptoms.",
      },
      {
        name: "UK Cervical Cancer",
        website: "https://www.ukcervicalcancer.org.uk",
        blurb:
          "Works towards a world free from cervical cancer through awareness of screening and HPV vaccination, and support for those affected.",
      },
      {
        name: "Target Ovarian Cancer",
        website: "https://targetovariancancer.org.uk",
        blurb:
          "Campaigns for faster diagnosis of ovarian cancer in the UK and funds research into better tests and treatments.",
      },
    ],
    about:
      "Ovarian cancer is often found late, when treatment options are narrower. Cervical cancer is largely preventable through screening and vaccination. Both depend on awareness, screening access and research.",
    impact: [
      "Screening and vaccination access programmes",
      "Research into earlier detection",
      "Practical support for people in treatment and recovery",
    ],
  },
  {
    value: "endometriosis",
    label: "Endometriosis research",
    icon: Microscope,
    summary: "Funding research into a condition that takes years to diagnose.",
    partners: [
      {
        name: "Endometriosis Foundation of America",
        website: "https://www.endofound.org",
        blurb:
          "Raises awareness and funds research, and trains clinicians so endometriosis is recognised and treated sooner.",
      },
      {
        name: "Endometriosis UK",
        website: "https://www.endometriosis-uk.org",
        blurb:
          "The UK's leading endometriosis charity, running support groups and campaigning to cut the average diagnosis time.",
      },
    ],
    about:
      "Endometriosis affects roughly one in ten people who menstruate, yet diagnosis still takes an average of seven to eight years. Research into its causes, better diagnostic tools and effective treatments remains chronically underfunded.",
    impact: [
      "Research grants for non-invasive diagnosis",
      "Studies into pain management and treatment options",
      "Awareness campaigns that shorten the path to diagnosis",
    ],
  },
  {
    value: "pmos",
    label: "PMOS (Polyendocrine Metabolic Ovarian Syndrome) research",
    icon: Dna,
    summary: "Research and support for a common hormonal and metabolic condition.",
    partners: [
      {
        name: "Verity",
        website: "https://www.verity-pcos.org.uk",
        blurb:
          "The UK charity for PMOS: evidenced information booklets, expert webinars and peer support for thousands of people living with the condition.",
      },
      {
        name: "PCOS Relief",
        website: "https://www.pcosrelief.org",
        blurb:
          "Provides tailored resources and advice to help people understand a PCOS diagnosis and manage their long-term health.",
      },
    ],
    about:
      "PMOS is a hormonal and metabolic condition affecting a large share of people who menstruate. It sits at the crossroads of reproductive and long-term metabolic health, and is often misunderstood by patients and clinicians alike.",
    impact: [
      "Research into hormonal and metabolic drivers",
      "Better clinical guidance for diagnosis and ongoing care",
      "Patient education and peer support",
    ],
  },
  {
    value: "trans_aid",
    label: "Trans lives matter aid",
    icon: HeartHandshake,
    summary: "Healthcare, safety and dignity for trans people.",
    partners: [
      {
        name: "Trans Lifeline",
        website: "https://translifeline.org",
        blurb:
          "A trans-led peer support and crisis hotline staffed by trans people, plus microgrants for name and gender marker changes.",
      },
      {
        name: "Mermaids",
        website: "https://mermaidsuk.org.uk",
        blurb:
          "Supports trans, non-binary and gender-diverse young people and their families in the UK with helplines, groups and advocacy.",
      },
    ],
    about:
      "Trans people face barriers to healthcare, housing and employment, and the organisations supporting them are often small and underfunded. Direct, practical aid makes an immediate difference.",
    impact: [
      "Access to gender-affirming care and mental health support",
      "Emergency funds for housing, food and safety",
      "Community organisations providing direct help",
    ],
  },
  {
    value: "violence_survivors",
    label: "Sexual and domestic violence survivors aid",
    icon: Scale,
    summary: "Shelter, legal help and counselling for survivors.",
    partners: [
      {
        name: "RAINN",
        website: "https://www.rainn.org",
        blurb:
          "Runs the US National Sexual Assault Hotline and works with police, hospitals and campuses to improve how survivors are treated.",
      },
      {
        name: "Refuge",
        website: "https://refuge.org.uk",
        blurb:
          "Provides safe accommodation and specialist support for women and children escaping domestic abuse, and runs the National Domestic Abuse Helpline.",
      },
      {
        name: "Rape Crisis England & Wales",
        website: "https://rapecrisis.org.uk",
        blurb:
          "Funds a network of rape crisis centres and a 24/7 support line for anyone affected by rape, sexual assault or childhood abuse.",
      },
      {
        name: "Galop",
        website: "https://www.galop.org.uk",
        blurb:
          "The UK's LGBT+ anti-abuse charity, giving advocacy and casework to LGBTQ+ people who have experienced abuse and violence.",
      },
    ],
    about:
      "Survivors of sexual and domestic violence often need shelter, legal support and counselling at the same time, while services are frequently oversubscribed. Funding keeps refuges open and helplines staffed.",
    impact: [
      "Refuge beds and emergency accommodation",
      "Free legal advice and court support",
      "Trauma-informed counselling and helplines",
    ],
  },
];

export const charityByValue = (value) =>
  CHARITY_OPTIONS.find((c) => c.value === value);

export const charityLabel = (value) =>
  charityByValue(value)?.label || value;

// The causes featured on the home page: three a day, rotating daily so a new
// set of charities surfaces each day.
export const featuredCauses = (date = new Date(), count = 3) => {
  const total = CHARITY_OPTIONS.length;
  const dayIndex = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
  );
  const start = (((dayIndex * count) % total) + total) % total;
  return Array.from(
    { length: Math.min(count, total) },
    (_, i) => CHARITY_OPTIONS[(start + i) % total]
  );
};