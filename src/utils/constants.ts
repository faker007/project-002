export const routes = {
  home: "/",
  campus: "/캠퍼스",
  forum: "/forum",
  message: "/message",
  messageRoom: (id?: string) => {
    return Boolean(id) ? `/messageRoom/${id}` : "/messageRoom/:id";
  },
  faceBook: "https://www.facebook.com/wix",
  twitter: "https://twitter.com/Wix",
  naver: "https://www.naver.com/",
  google: "https://www.google.com/",
  campusDetail: (campus?: string): string => {
    return Boolean(campus)
      ? `/group/${campus}/discussion`
      : `/group/:campus/discussion`;
  },
  campusAbout: (campus?: string): string => {
    return Boolean(campus) ? `/group/${campus}/about` : `/group/:campus/about`;
  },
  forumDetail: (forum?: string): string => {
    return Boolean(forum) ? `/forum/${forum}` : `/forum/:forumGroup`;
  },
  forumCreatePost: (forum?: string): string => {
    return Boolean(forum)
      ? `/forum/${forum}/create-post`
      : `/forum/:forumGroup/create-post`;
  },
  forumCreateQuestion: (forum?: string): string => {
    return Boolean(forum)
      ? `/forum/${forum}/create-question`
      : `/forum/:forumGroup/create-question`;
  },
  forumPostDetail: (forum?: string, id?: string): string => {
    return Boolean(id) && Boolean(forum)
      ? `/forum/${forum}/${id}`
      : `/forum/:forumGroup/:postId`;
  },
};

export const FORUM_GROUPS: { enName: string; korName: string }[] = [
  { enName: "guckjebussiness_en", korName: "국제비즈니스어학부/영어" },
  { enName: "guckjebussiness_jp", korName: "국제비즈니스어학부/일어" },
  { enName: "guckjebussiness_ch", korName: "국제비즈니스어학부/중어" },
  { enName: "guckjebussiness_ru", korName: "국제비즈니스어학부/노어" },
  { enName: "guckjebussiness_fr", korName: "국제비즈니스어학부/불어" },
  {
    enName: "munhwacontenthackbu_munhwacontent",
    korName: "문화컨텐츠학부/문화콘텐츠",
  },
  {
    enName: "munhwacontenthackbu_guckoguckmunhak",
    korName: "문화컨텐츠학부/국어국문학",
  },
  { enName: "munhwacontenthackbu_chulhak", korName: "문화컨텐츠학부/철학" },
  { enName: "adong", korName: "아동학과" },
  { enName: "gonggonginjuckjiwon", korName: "공공인적지원학부" },
  { enName: "gumyuunggyeongje", korName: "금융경제학과" },
  { enName: "gyeongyoung", korName: "경영학부" },
  { enName: "gunsa", korName: "군사학과" },
  { enName: "globalgyeongyoung", korName: "글로벌경영학과" },
  { enName: "software", korName: "소프트웨어학과" },
  { enName: "gumyouungjungbo", korName: "금융정보공학과" },
  { enName: "junjagonghak", korName: "전자공학과" },
  { enName: "computergonghak", korName: "컴퓨터공학과" },
  { enName: "hwahaksangmyong", korName: "화학생명공학과" },
  { enName: "nanoyuunghap", korName: "나노융합공학과" },
  { enName: "sanupgyeongyoungsystem", korName: "산업경영시스템공학과" },
  { enName: "dosigonghak", korName: "도시공학과" },
  { enName: "tomockgunchug", korName: "토목건축공학과" },
  { enName: "design", korName: "디자인학부" },
  { enName: "music", korName: "음악학부" },
  { enName: "musical", korName: "뮤지컬학과" },
  { enName: "silyoungmusic", korName: "실용음악학과" },
  { enName: "muyoungyesul", korName: "무용예술학과" },
  { enName: "gongyeongyesul_youngi", korName: "공연예술학부/연기" },
  { enName: "gongyeongyesul_mudaegisul", korName: "공연예술학부/무대기술" },
  { enName: "gongyeongyesul_modelyoungi", korName: "공연예술학부/모델연기" },
  { enName: "gongyeongyesul_mudaepassion", korName: "공연예술학부/무대패션" },
  { enName: "movie", korName: "영화영상학과" },
  { enName: "hairdesign", korName: "헤어디자인학과" },
  { enName: "makeupdesign", korName: "메이크업디자인학과" },
  { enName: "beauty_makeup", korName: "뷰티테라피&메이크업학과" },
  { enName: "insung", korName: "인성교양대학" },
  { enName: "complex", korName: "융합대학" },
];

export const CAMPUS_GROUPS: { enName: string; korName: string }[] = [
  { enName: "sdr", korName: "SDR" },
  { enName: "workers", korName: "워커스" },
  { enName: "gramy", korName: "그라미" },
  { enName: "cam", korName: "C.A.M" },
  { enName: "ccc", korName: "CCC" },
  { enName: "ivf", korName: "IVF" },
  { enName: "ubf", korName: "UBF" },
  { enName: "catholic_student_council", korName: "카톨릭 학생회" },
  { enName: "zeungsando", korName: "증산도" },
  { enName: "animoon", korName: "애니문" },
  { enName: "bulls", korName: "불스" },
  { enName: "aru", korName: "아루" },
  { enName: "proms", korName: "PROMS" },
  { enName: "minhyeongsa", korName: "민형사" },
  { enName: "younji", korName: "연지" },
  { enName: "matnam", korName: "맛남" },
  { enName: "gongback", korName: "공백" },
  { enName: "sst", korName: "SST" },
  { enName: "buzzerbitter", korName: "버저비터" },
  { enName: "jucksita", korName: "적시타" },
  { enName: "ozz", korName: "오즈" },
  { enName: "doobaquii", korName: "두바퀴" },
  { enName: "seogyeong_cock", korName: "서경콕" },
  { enName: "sniper", korName: "스나이퍼" },
  { enName: "sangmurim", korName: "생무림" },
  { enName: "diffense", korName: "디펜스" },
];
