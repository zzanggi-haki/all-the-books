export const REGION_ORDER = [
  "서울",
  "경기",
  "인천",
  "강원",
  "충북",
  "충남",
  "대전",
  "세종",
  "경북",
  "경남",
  "대구",
  "부산",
  "울산",
  "전북",
  "전남",
  "광주",
  "제주",
  "기타",
] as const;

export type Region = (typeof REGION_ORDER)[number];

const REGION_PATTERNS: Array<{ region: Region; test: RegExp }> = [
  // 서울 (자치구 + 주요 동/역명 prefix)
  {
    region: "서울",
    test: /^(서울|강남|강북|강서|강동|관악|광진|구로|금천|노원|도봉|동대문|동작|마포|서대문|서초|성동|성북|송파|양천|영등포|용산|은평|종로|중랑|신촌|건대|잠실|이수|합정|홍대|상수|연남|목동|여의도|명동|충무로|을지로|수유|신림|천호|미아|상봉|왕십리|불광|연신내|화곡|등촌|가산|문정|성수|역삼|논현|가로수길|대학로|신논현)/,
  },
  // 경기
  {
    region: "경기",
    test: /^(가평|고양|과천|광명|광교|구리|군포|김포|남양주|동두천|동탄|부천|분당|성남|수원|수지|시흥|안산|안성|안양|양주|양평|여주|오산|용인|의왕|의정부|이천|파주|평촌|평택|포천|하남|화성|일산|영통|중동|범계|화정|정자|미금|서현|산본)/,
  },
  { region: "인천", test: /^인천/ },
  {
    region: "강원",
    test: /^(강릉|동해|삼척|속초|원주|춘천|태백|홍천|영월|평창)/,
  },
  { region: "충북", test: /^(청주|충주|제천|음성|진천)/ },
  { region: "충남", test: /^(천안|공주|아산|서산|논산|당진|홍성|예산|태안)/ },
  { region: "대전", test: /^대전/ },
  { region: "세종", test: /^세종/ },
  {
    region: "경북",
    test: /^(포항|경주|김천|안동|구미|영주|영천|상주|문경|경산|칠곡)/,
  },
  {
    region: "경남",
    test: /^(창원|진주|통영|사천|김해|밀양|거제|양산|마산)/,
  },
  { region: "대구", test: /^대구/ },
  { region: "부산", test: /^(부산|부경대|해운대|서면|센텀|남포|덕천|사상)/ },
  { region: "울산", test: /^울산/ },
  { region: "전북", test: /^(전주|군산|익산|정읍|남원|김제)/ },
  { region: "전남", test: /^(목포|여수|순천|나주|광양)/ },
  { region: "광주", test: /^광주/ },
  { region: "제주", test: /^제주/ },
];

export function inferRegion(storeName: string): Region {
  const name = storeName.trim();
  for (const { region, test } of REGION_PATTERNS) {
    if (test.test(name)) return region;
  }
  return "기타";
}
