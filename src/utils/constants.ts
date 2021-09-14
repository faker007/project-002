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
  campusMedia: (campus?: string): string => {
    return Boolean(campus) ? `/group/${campus}/media` : `/group/:campus/media`;
  },
  campusMembers: (campus?: string): string => {
    return Boolean(campus)
      ? `/group/${campus}/members`
      : `/group/:campus/members`;
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

export const FORUM_HERO_IMGS = [
  "https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/greeenGomdol.jpg?alt=media&token=d877d8d4-a114-41fd-a64b-f2217b2cdf16",
  "https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/pinkGomdol.jpg?alt=media&token=d2f358a4-03a4-4a9d-9cd5-d2f77f55305f",
  "https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/whiteGomdol.jpg?alt=media&token=20f173e5-c4e8-4fc6-8afb-16f86c2d185e",
  "https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/%EC%9A%B0%EB%A6%AC%EB%91%90%EB%A6%AC.webp?alt=media&token=d9d97bb2-b222-4cfe-be86-a9e3e97e0740",
];

export const FORUM_GROUPS: { enName: string; korName: string }[] = [
  {
    enName: "jayugesipan",
    korName: "자유게시판",
  },
  {
    enName: "mentoring-cunceon",
    korName: "멘토링 (춘천)",
  },
  {
    enName: "gwating-cunceon",
    korName: "과팅 (춘천)",
  },
  {
    enName: "miting-cunceon",
    korName: "미팅 (춘천)",
  },
  {
    enName: "somoim-cunceon",
    korName: "소모임 (춘천)",
  },
  {
    enName: "dongari-cunceon",
    korName: "동아리 (춘천)",
  },
  {
    enName: "seuteodi-cunceon",
    korName: "스터디 (춘천)",
  },
  {
    enName: "mentoring-samceog",
    korName: "멘토링 (삼척)",
  },
  {
    enName: "gwating-samceog",
    korName: "과팅 (삼척)",
  },
  {
    enName: "miting-samceog",
    korName: "미팅 (삼척)",
  },
  {
    enName: "somoim-samceog",
    korName: "소모임 (삼척)",
  },
  {
    enName: "dongari-samceog",
    korName: "동아리 (삼척)",
  },
  {
    enName: "seuteodi-samceog",
    korName: "스터디 (삼척)",
  },
  {
    enName: "mentoring-dogye",
    korName: "멘토링 (도계)",
  },
  {
    enName: "gwating-dogye",
    korName: "과팅 (도계)",
  },
  {
    enName: "miting-dogye",
    korName: "미팅 (도계)",
  },
  {
    enName: "somoim-dogye",
    korName: "소모임 (도계)",
  },
  {
    enName: "dongari-dogye",
    korName: "동아리 (도계)",
  },
  {
    enName: "seuteodi-dogye",
    korName: "스터디 (도계)",
  },
];

export const CAMPUS_GROUPS: { enName: string; korName: string }[] = [
  {
    enName: "uiyegwa",
    korName: "의예과",
  },
  {
    enName: "dongmul-eung-yong-gwahaggwa",
    korName: "동물응용과학과",
  },
  {
    enName: "cheolhaggwa",
    korName: "철학과",
  },
  {
    enName: "jeongchioegyohaggwa",
    korName: "정치외교학과",
  },
  {
    enName: "hoegyehaggwa",
    korName: "회계학과",
  },
  {
    enName: "chiwisaenghaggwa",
    korName: "치위생학과",
  },
  {
    enName: "sigpum-yeong-yanghaggwa",
    korName: "식품영양학과",
  },
  {
    enName: "ganhohaggwa-dogye",
    korName: "간호학과 (도계)",
  },
  {
    enName: "gugjemuyeoghaggwa",
    korName: "국제무역학과",
  },
  {
    enName: "suhaggyoyuggwa",
    korName: "수학교육과",
  },
  {
    enName: "jayujeongonghagbu",
    korName: "자유전공학부",
  },
  {
    enName: "milaeyunghabgasanghaggwa",
    korName: "미래융합가상학과",
  },
  {
    enName: "keompyuteogonghaggwa",
    korName: "컴퓨터공학과",
  },
  {
    enName: "jeonjagonghaggwa",
    korName: "전자공학과",
  },
  {
    enName: "jeongijeonjagonghaggwa",
    korName: "전기전자공학과",
  },
  {
    enName: "suhaggwa",
    korName: "수학과",
  },
  {
    enName: "saengmyeong-gwahaggwa",
    korName: "생명과학과",
  },
  {
    enName: "mullihaggwa",
    korName: "물리학과",
  },
  {
    enName: "hwahaggwa",
    korName: "화학과",
  },
  {
    enName: "saenghwahaggwa",
    korName: "생화학과",
  },
  {
    enName: "jijilhaggwa",
    korName: "지질학과",
  },
  {
    enName: "jigumullihaggwa",
    korName: "지구물리학과",
  },
  {
    enName: "sahaggwa",
    korName: "사학과",
  },
  {
    enName: "ilbonhaggwa",
    korName: "일본학과",
  },
  {
    enName: "jung-eojungmunhaggwa",
    korName: "중어중문학과",
  },
  {
    enName: "dog-eodogmunhaggwa",
    korName: "독어독문학과",
  },
  {
    enName: "bul-eobulmunhaggwa",
    korName: "불어불문학과",
  },
  {
    enName: "yeong-eoyeongmunhaggwa",
    korName: "영어영문학과",
  },
  {
    enName: "gug-eogugmunhaggwa",
    korName: "국어국문학과",
  },
  {
    enName: "saengmul-uisojaegonghaggwa",
    korName: "생물의소재공학과",
  },
  {
    enName: "saengmyeong-geongang-gonghaggwa",
    korName: "생명건강공학과",
  },
  {
    enName: "bunjasaengmyeong-gwahaggwa",
    korName: "분자생명과학과",
  },
  {
    enName: "uisaengmyeong-gonghaggwa",
    korName: "의생명공학과",
  },
  {
    enName: "siseutemmyeon-yeoggwahaggwa",
    korName: "시스템면역과학과",
  },
  {
    enName: "yaghaggwa",
    korName: "약학과",
  },
  {
    enName: "suuihaggwa",
    korName: "수의학과",
  },
  {
    enName: "suuiyegwa",
    korName: "수의예과",
  },
  {
    enName: "saengtaejogyeongdijainhaggwa",
    korName: "생태조경디자인학과",
  },
  {
    enName: "jejigonghaggwa",
    korName: "제지공학과",
  },
  {
    enName: "sanlimsojaegonghaggwa",
    korName: "산림소재공학과",
  },
  {
    enName: "sanlimhwangyeongbohohaggwa",
    korName: "산림환경보호학과",
  },
  {
    enName: "sanlimjawonhaggwa",
    korName: "산림자원학과",
  },
  {
    enName: "sanlimgyeong-yeonghaggwa",
    korName: "산림경영학과",
  },
  {
    enName: "sinmunbangsonghaggwa",
    korName: "신문방송학과",
  },
  {
    enName: "sahoehaggwa",
    korName: "사회학과",
  },
  {
    enName: "budongsanhaggwa",
    korName: "부동산학과",
  },
  {
    enName: "munhwainlyuhaggwa",
    korName: "문화인류학과",
  },
  {
    enName: "simlihaggwa",
    korName: "심리학과",
  },
  {
    enName: "haengjeonghaggwa",
    korName: "행정학과",
  },
  {
    enName: "hanmungyoyuggwa",
    korName: "한문교육과",
  },
  {
    enName: "cheyuggyoyuggwa",
    korName: "체육교육과",
  },
  {
    enName: "jiligyoyuggwa",
    korName: "지리교육과",
  },
  {
    enName: "ilbansahoegyoyuggwa",
    korName: "일반사회교육과",
  },
  {
    enName: "yunligyoyuggwa",
    korName: "윤리교육과",
  },
  {
    enName: "yeong-eogyoyuggwa",
    korName: "영어교육과",
  },
  {
    enName: "yeogsagyoyuggwa",
    korName: "역사교육과",
  },
  {
    enName: "gug-eogyoyuggwa",
    korName: "국어교육과",
  },
  {
    enName: "gyoyughaggwa",
    korName: "교육학과",
  },
  {
    enName: "gwahaggyoyughaggwa",
    korName: "과학교육학과",
  },
  {
    enName: "gajeong-gyoyuggwa",
    korName: "가정교육과",
  },
  {
    enName: "yeongsangmunhwahaggwa",
    korName: "영상문화학과",
  },
  {
    enName: "eum-aghaggwa",
    korName: "음악학과",
  },
  {
    enName: "seupocheugwahaggwa",
    korName: "스포츠과학과",
  },
  {
    enName: "misulhaggwa",
    korName: "미술학과",
  },
  {
    enName: "muyonghaggwa",
    korName: "무용학과",
  },
  {
    enName: "dijainhaggwa",
    korName: "디자인학과",
  },
  {
    enName: "saengmulgonghaggwa",
    korName: "생물공학과",
  },
  {
    enName: "hwahaggonghaggwa",
    korName: "화학공학과",
  },
  {
    enName: "san-eobgonghaggwa",
    korName: "산업공학과",
  },
  {
    enName: "eneojijawongonghaggwa",
    korName: "에너지자원공학과",
  },
  {
    enName: "jaelyogonghaggwa",
    korName: "재료공학과",
  },
  {
    enName: "mekateulonigseugonghaggwa",
    korName: "메카트로닉스공학과",
  },
  {
    enName: "gigyeuiyong-gonghaggwa",
    korName: "기계의용공학과",
  },
  {
    enName: "tomoggonghaggwa-1",
    korName: "토목공학과",
  },
  {
    enName: "hwangyeong-gonghaggwa",
    korName: "환경공학과",
  },
  {
    enName: "geonchuggonghaggwa",
    korName: "건축공학과",
  },
  {
    enName: "geonchughaggwa",
    korName: "건축학과",
  },
  {
    enName: "dongmuljawongwahaggwa",
    korName: "동물자원과학과",
  },
  {
    enName: "dongmulsan-eob-yunghabhaggwa",
    korName: "동물산업융합학과",
  },
  {
    enName: "jiyeoggeonseolgonghaggwa",
    korName: "지역건설공학과",
  },
  {
    enName: "ekohwangyeong-gwahaggwa",
    korName: "에코환경과학과",
  },
  {
    enName: "baiojawonhwangyeonghaggwa",
    korName: "바이오자원환경학과",
  },
  {
    enName: "nong-eobjawongyeongjehaggwa",
    korName: "농업자원경제학과",
  },
  {
    enName: "won-yegwahaggwa",
    korName: "원예과학과",
  },
  {
    enName: "eung-yongsaengmulhaggwa",
    korName: "응용생물학과",
  },
  {
    enName: "sigmuljawon-eung-yong-gwahaggwa",
    korName: "식물자원응용과학과",
  },
  {
    enName: "sigpumsaengmyeong-gonghaggwa",
    korName: "식품생명공학과",
  },
  {
    enName: "baiosiseutemgigyegonghaggwa",
    korName: "바이오시스템기계공학과",
  },
  {
    enName: "siseolnong-eobhaggwa",
    korName: "시설농업학과",
  },
  {
    enName: "nongsaengmyeongsan-eobhaggwa",
    korName: "농생명산업학과",
  },
  {
    enName: "gwangwang-gyeong-yeonghaggwa",
    korName: "관광경영학과",
  },
  {
    enName: "jeongbotong-gyehaggwa",
    korName: "정보통계학과",
  },
  {
    enName: "gyeongjehaggwa",
    korName: "경제학과",
  },
  {
    enName: "gyeong-yeonghaggwa",
    korName: "경영학과",
  },
  {
    enName: "ganhohaggwa-1",
    korName: "간호학과",
  },
];
