import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import CytoscapeComponent from "react-cytoscapejs";

// 1. 관계 라벨 확장 (시즌 2,3 대응)
const relationLabel = {
  child: "Parent → Child",
  spouse: "Spouse",
  love: "Romantic",
  same: "Same Person (Time/World)",
  kill: "Killed",         // 시즌 2,3 확장을 위한 살인 관계
  ancestor: "Ancestor"    // 복잡한 족보 대응
};

const personNameKo = {
  "Jonas": "요나스",
  "Hannah": "한나",
  "Michael": "미하엘",
  "Ines": "이네스",
  "Adam": "아담",
  "Ulrich": "울리히",
  "Katharina": "카타리나",
  "Martha": "마르타",
  "Magnus": "마그누스",
  "Mikkel": "미켈",
  "Tronte": "트론테",
  "Jana": "야나",
  "Agnes": "아그네스",
  "Mads": "마즈",
  "Charlotte": "샤를로테",
  "Peter": "페터",
  "Franziska": "프란치스카",
  "Elisabeth": "엘리자베트",
  "Helge": "헬게",
  "Bernd": "베른트",
  "Greta": "그레타",
  "Noah (Hanno)": "노아 (한노)",
  "H.G. Tannhaus": "H.G. 탄하우스",
  "Erik Obendorf": "에리크 오벤도르프",
  "Yasin Friese": "야신 프리제",
  "Regina": "레기나",
  "Aleksander": "알렉산더",
  "Bartosz": "바르토시",
  "Claudia": "클라우디아",
  "Egon": "에곤",
  "Doris": "도리스",
  "Silja": "실리야",
  "Martha (Alt)": "마르타 (알트)",
  "Eva": "이브",
  "The Unknown (Cleft Lip)": "언노운 (구순열 남자)",
  "Marek Tannhaus": "마레크 탄하우스",
  "Sonja Tannhaus": "존야 탄하우스"
};

const familyNameKo = {
  Nielsen: "니엘센",
  Kahnwald: "칸발트",
  Doppler: "도플러",
  Tiedemann: "티데만",
  Unknown: "기타"
};

const personDescriptionKo = {
  "Jonas": "칸발트 가문의 소년으로, 빈덴의 시간 순환 중심에 선 핵심 인물.",
  "Hannah": "요나스의 어머니로, 과거와 현재를 가로지르는 선택으로 파문을 만든다.",
  "Michael": "칸발트 가문의 가장이자 요나스의 아버지. 실종 사건의 숨겨진 열쇠를 쥔다.",
  "Ines": "병원 간호사로, 시간의 균열 속에서 한 아이를 보호하고 길러낸다.",
  "Adam": "요나스의 미래 모습으로 알려진 존재. 매듭을 유지하려는 시카 무스의 수장.",
  "Ulrich": "니엘센 가문의 아버지이자 경찰관. 아들의 실종 이후 진실을 집요하게 추적한다.",
  "Katharina": "니엘센 가문의 어머니로, 가족을 지키기 위해 위험한 경계선을 넘는다.",
  "Martha": "니엘센 가문의 딸. 요나스와의 관계가 두 세계의 운명을 잇는 축이 된다.",
  "Magnus": "니엘센 가문의 장남. 친구들의 실종 사건 속에서 빠르게 성장해 간다.",
  "Mikkel": "니엘센 가문의 막내아들. 실종을 계기로 세대와 가문을 뒤흔드는 존재가 된다.",
  "Tronte": "울리히의 아버지로, 오래된 비밀과 죄책감을 품은 니엘센 가문의 기둥.",
  "Jana": "울리히의 어머니. 아들들과 손자 세대를 잇는 니엘센 가문의 정서적 축.",
  "Agnes": "1950년대에 나타난 니엘센 가문의 여성. 정체와 혈통 모두가 의문의 중심에 있다.",
  "Mads": "울리히의 형으로, 빈덴 연쇄 실종의 시작점이 되는 비극적 인물.",
  "Charlotte": "빈덴 경찰서장. 도플러 가문의 핵심이자 출생의 역설과 직면하는 인물.",
  "Peter": "도플러 가문의 가장. 가족을 지키려 하지만 비밀 앞에서 흔들린다.",
  "Franziska": "도플러 가문의 장녀. 실종 사건과 비밀 조직의 흔적을 파고드는 인물.",
  "Elisabeth": "도플러 가문의 막내딸. 침묵 속에서 세계의 붕괴와 재편을 목격한다.",
  "Helge": "도플러 가문의 아들. 어린 시절의 상처와 조종이 사건의 연쇄를 만든다.",
  "Bernd": "원전 건설을 이끈 도플러 가문의 가장. 빈덴 권력 구조의 상징적 인물.",
  "Greta": "헬게의 어머니로, 종교적 불안과 죄의식 속에서 가족을 통제하려 한다.",
  "Noah (Hanno)": "신부의 얼굴을 한 시간여행자. 시카 무스의 계획을 실행하는 핵심 축.",
  "H.G. Tannhaus": "시계공이자 저술가. 시간 장치 이론과 빈덴의 원형 비극을 잇는 인물.",
  "Erik Obendorf": "2019년 실종 청소년으로, 연쇄 사건의 불씨가 되는 첫 희생자 중 하나.",
  "Yasin Friese": "2019년 실종 아동으로, 도플러 가문과도 연결되는 비극의 희생자.",
  "Regina": "티데만 가문의 딸이자 호텔 운영자. 세대 간 갈등과 병마 속에서도 중심을 지킨다.",
  "Aleksander": "레기나의 남편으로, 과거 신분을 감춘 채 빈덴 원전 권력의 중심에 선다.",
  "Bartosz": "티데만 가문의 아들. 친구들과 함께 시간의 진실에 가장 먼저 휘말린다.",
  "Claudia": "티데만 가문의 핵심 인물. 서로 다른 세계의 균형을 뒤집는 전략가.",
  "Egon": "1950~80년대 빈덴 경찰. 세대를 넘는 사건을 끝내 이해하지 못한 비극의 증인.",
  "Doris": "에곤의 아내이자 클라우디아의 어머니. 시대의 규범과 욕망 사이에서 흔들린다.",
  "Silja": "다른 시대에서 건너와 혈통의 매듭을 강화하는 연결 고리 인물.",
  "Martha (Alt)": "이브의 세계에 속한 또 다른 마르타. 두 세계의 매듭을 완성하는 핵심 축.",
  "Eva": "알트 마르타의 미래 모습으로, 매듭의 존속을 설계하는 이브의 세계 지도자.",
  "The Unknown (Cleft Lip)": "세 시기의 같은 인물이 공존하는 존재. 두 세계 혈통의 기원을 상징한다.",
  "Marek Tannhaus": "탄하우스 가문의 아들. 그의 사고가 근원 세계 비극의 직접적 도화선이 된다.",
  "Sonja Tannhaus": "마레크의 아내로, 탄하우스 가문의 비극에 함께 휩쓸리는 인물."
};

const getPersonNameKo = (name) => personNameKo[name] || name;
const getFamilyNameKo = (family) => familyNameKo[family] || family;
const getPersonDescriptionKo = (name, family, year) =>
  personDescriptionKo[name] || `${getFamilyNameKo(family)} 가문의 인물. 기준 시점은 ${year}년.`;

// 2. 확장 가능한 데이터 스키마 적용
// - id 체계 정립: 이름_세계관_연도 (예: jonas_A_2019)
// - seasons: 해당 노드/엣지가 스포일러 없이 노출되는 시즌 배열
// - world: A(아담의 세계), B(이브의 세계), Origin(근원 세계)
const initialElements = [
  // ==========================================
  // 1. 아담의 세계 (World A) - 캐릭터 노드
  // ==========================================

  {
    data: {
      id: "jonas_A_2019", "label": "Jonas", "family": "Kahnwald", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/5/5b/2x06_0007_JonasHappy.jpg/revision/latest/scale-to-width-down/1000?cb=20190823235854", "imagesByYear": { "1888": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=stranger_jonas&backgroundColor=b45309", "seasons": [3] }, "2019": "https://static.wikia.nocookie.net/dark-netflix/images/5/5b/2x06_0007_JonasHappy.jpg/revision/latest/scale-to-width-down/1000?cb=20190823235854", "2052": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=jonas_2052&backgroundColor=3f3f46", "seasons": [2, 3] } }
    }
  },
  {
    data: {
      id: "hannah_A_2019", "label": "Hannah", "family": "Kahnwald", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/8/82/Closeup_-_Hannah.jpg/revision/latest?cb=20171227115300", "imagesByYear": { "1954": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=hannah_1954&backgroundColor=dc2626", "seasons": [2, 3] }, "1986": "https://static.wikia.nocookie.net/dark-netflix/images/8/80/DARK_1x09_HannahKahnwald1986.png/revision/latest/scale-to-width-down/1000?cb=20200819052616", "2019": "https://static.wikia.nocookie.net/dark-netflix/images/8/82/Closeup_-_Hannah.jpg/revision/latest?cb=20171227115300" }
    }
  },
  {
    data: {
      id: "michael_A_2019", "label": "Michael", "family": "Kahnwald", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/1/10/Adult_Mikkel%E2%80%93Profile.png/revision/latest/scale-to-width-down/1000?cb=20220218103453", "imagesByYear": { "2019": "https://static.wikia.nocookie.net/dark-netflix/images/1/10/Adult_Mikkel%E2%80%93Profile.png/revision/latest/scale-to-width-down/1000?cb=20220218103453" }
    }
  },
  {
    data: {
      id: "ines_A_1986", "label": "Ines", "family": "Kahnwald", "year": "1986", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/8/82/Closeup_-_Ines_1986.jpg/revision/latest?cb=20171227124102", "imagesByYear": { "1953": "https://static.wikia.nocookie.net/dark-netflix/images/8/8c/Closeup_-_Ines_1953.jpg/revision/latest?cb=20171227124110", "1986": "https://static.wikia.nocookie.net/dark-netflix/images/8/82/Closeup_-_Ines_1986.jpg/revision/latest?cb=20171227124102", "2019": "https://static.wikia.nocookie.net/dark-netflix/images/d/d2/Closeup_-_Ines.jpg/revision/latest?cb=20171227115301" }
    }
  },
  {
    data: {
      id: "adam_A_1921", "label": "Adam", "family": "Kahnwald", "year": "1921", "world": "A", "seasons": [2, 3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=adam_1921", "imagesByYear": { "1921": "https://api.dicebear.com/7.x/avataaars/svg?seed=adam_1921" }
    }
  },
  {
    data: {
      id: "ulrich_A_2019", "label": "Ulrich", "family": "Nielsen", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/a/a9/Adult_Ulrich_Nielsen%E2%80%93Profile.png/revision/latest/scale-to-width-down/1000?cb=20220221073746", "imagesByYear": { "1986": "https://static.wikia.nocookie.net/dark-netflix/images/4/44/DARK_1x09_UlrichNielsen1986.png/revision/latest/scale-to-width-down/1000?cb=20200819053721", "1987": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/2/2f/Old_man_Ulrich_in_1987.jpg/revision/latest/scale-to-width-down/1000?cb=20201215012037", "seasons": [3] }, "2019": "https://static.wikia.nocookie.net/dark-netflix/images/a/a9/Adult_Ulrich_Nielsen%E2%80%93Profile.png/revision/latest/scale-to-width-down/1000?cb=20220221073746" }
    }
  },
  {
    data: {
      id: "katharina_A_2019", "label": "Katharina", "family": "Nielsen", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/6/6c/Portal_%E2%80%93_Katharina.jpg/revision/latest?cb=20171203142251", "imagesByYear": { "1986": "https://static.wikia.nocookie.net/dark-netflix/images/9/98/1x07_0039_KatharinaBruised.jpg/revision/latest/scale-to-width-down/1000?cb=20190810224509", "1987": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=katharina_1987&backgroundColor=1d4ed8", "seasons": [3] }, "2019": "https://static.wikia.nocookie.net/dark-netflix/images/6/6c/Portal_%E2%80%93_Katharina.jpg/revision/latest?cb=20171203142251" }
    }
  },
  {
    data: {
      id: "martha_A_2019", "label": "Martha", "family": "Nielsen", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/1/15/Martha_Nielsen_%28Adam%27s_World%29%E2%80%93Profile.png/revision/latest/scale-to-width-down/1000?cb=20220218140819", "imagesByYear": { "2019": "https://static.wikia.nocookie.net/dark-netflix/images/1/15/Martha_Nielsen_%28Adam%27s_World%29%E2%80%93Profile.png/revision/latest/scale-to-width-down/1000?cb=20220218140819" }
    }
  },
  {
    data: {
      id: "magnus_A_2019", "label": "Magnus", "family": "Nielsen", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/3/34/Closeup_-_Magnus.jpg/revision/latest?cb=20171227115303", "imagesByYear": { "1888": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=magnus_1888&backgroundColor=1d4ed8", "seasons": [3] }, "1921": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/6/66/Magnus_in_1921_2.jpg/revision/latest/scale-to-width-down/1000?cb=20201215090217", "seasons": [2, 3] }, "2019": "https://static.wikia.nocookie.net/dark-netflix/images/3/34/Closeup_-_Magnus.jpg/revision/latest?cb=20171227115303" }
    }
  },
  {
    data: {
      id: "mikkel_A_2019", "label": "Mikkel", "family": "Nielsen", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/d/d6/Young_Mikkel_Nielsen_%28Adam%27s_World%29%E2%80%93Profile.png/revision/latest/scale-to-width-down/1000?cb=20220218103444", "imagesByYear": { "1986": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/d/d6/Young_Mikkel_Nielsen_%28Adam%27s_World%29%E2%80%93Profile.png/revision/latest/scale-to-width-down/1000?cb=20220218103444", "seasons": [1, 2, 3] },  }
    }
  },
  {
    data: {
      id: "tronte_A_2019", "label": "Tronte", "family": "Nielsen", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/9/97/Closeup_-_Tronte.jpg/revision/latest?cb=20171227115421", "imagesByYear": { "1953": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/b/b9/DARK_1x09_TronteNielsen1953.png/revision/latest/scale-to-width-down/1000?cb=20200819093008", "seasons": [1, 2, 3] }, "1986": "https://static.wikia.nocookie.net/dark-netflix/images/a/a8/DARK_1x09_TronteNielsen1986.png/revision/latest/scale-to-width-down/1000?cb=20200819093040", "2019": "https://static.wikia.nocookie.net/dark-netflix/images/9/97/Closeup_-_Tronte.jpg/revision/latest?cb=20171227115421" }
    }
  },
  {
    data: {
      id: "jana_A_2019", "label": "Jana", "family": "Nielsen", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/f/f2/Closeup_-_Jana.jpg/revision/latest?cb=20171227115302", "imagesByYear": { "1953": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/2/2c/DARK_1x09_JanaNielsen1953.png/revision/latest/scale-to-width-down/1000?cb=20200819092543", "seasons": [1, 2, 3] }, "1986": "https://static.wikia.nocookie.net/dark-netflix/images/1/1e/DARK_1x09_JanaNielsen1986.png/revision/latest/scale-to-width-down/1000?cb=20200819092636", "2019": "https://static.wikia.nocookie.net/dark-netflix/images/f/f2/Closeup_-_Jana.jpg/revision/latest?cb=20171227115302" }
    }
  },
  {
    data: {
      id: "agnes_A_1953", "label": "Agnes", "family": "Nielsen", "year": "1953", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/e/e0/DARK_1x09_AgnesNielsen.png/revision/latest/scale-to-width-down/1000?cb=20200819072912", "imagesByYear": { "1921": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/e/e8/Agnes_nielsen_1921.png/revision/latest?cb=20190701113843", "seasons": [2, 3] }, "1953": "https://static.wikia.nocookie.net/dark-netflix/images/e/e0/DARK_1x09_AgnesNielsen.png/revision/latest/scale-to-width-down/1000?cb=20200819072912" }
    }
  },
  {
    data: {
      id: "mads_A_1986", "label": "Mads", "family": "Nielsen", "year": "1986", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/8/8c/Mads_Nielsen_photo_at_his_1987_funeral.jpg/revision/latest?cb=20201231005148", "imagesByYear": { "1986": "https://static.wikia.nocookie.net/dark-netflix/images/8/8c/Mads_Nielsen_photo_at_his_1987_funeral.jpg/revision/latest?cb=20201231005148" }
    }
  },
  {
    data: {
      id: "charlotte_A_2019", "label": "Charlotte", "family": "Doppler", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/1/11/Closeup_-_Charlotte.jpg/revision/latest?cb=20171227115258", "imagesByYear": { "1986": "https://static.wikia.nocookie.net/dark-netflix/images/2/27/DARK_1x09_CharlotteDoppler1986.png/revision/latest/scale-to-width-down/1000?cb=20200819074312", "2019": "https://static.wikia.nocookie.net/dark-netflix/images/1/11/Closeup_-_Charlotte.jpg/revision/latest?cb=20171227115258", "2053": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=charlotte_2053&backgroundColor=d97706", "seasons": [2, 3] } }
    }
  },
  {
    data: {
      id: "peter_A_2019", "label": "Peter", "family": "Doppler", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/b/bf/Closeup_-_Peter.jpg/revision/latest?cb=20171227115305", "imagesByYear": { "1987": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/0/07/Peter_in_1987_2.jpg/revision/latest/scale-to-width-down/1000?cb=20201215075144", "seasons": [3] }, "2019": "https://static.wikia.nocookie.net/dark-netflix/images/b/bf/Closeup_-_Peter.jpg/revision/latest?cb=20171227115305" }
    }
  },
  {
    data: {
      id: "franziska_A_2019", "label": "Franziska", "family": "Doppler", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/5/56/Franziska_2019.png/revision/latest/scale-to-width-down/1000?cb=20200629220136", "imagesByYear": { "1888": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=franziska_1888&backgroundColor=d97706", "seasons": [3] }, "1921": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/2/25/Franziska_in_1921.jpg/revision/latest/scale-to-width-down/1000?cb=20201215094040", "seasons": [2, 3] }, "2019": "https://static.wikia.nocookie.net/dark-netflix/images/5/56/Franziska_2019.png/revision/latest/scale-to-width-down/1000?cb=20200629220136" }
    }
  },
  {
    data: {
      id: "elisabeth_A_2019", "label": "Elisabeth", "family": "Doppler", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/f/fb/Elisabeth_in_2020.jpg/revision/latest?cb=20201215091929", "imagesByYear": { "2019": "https://static.wikia.nocookie.net/dark-netflix/images/f/fb/Elisabeth_in_2020.jpg/revision/latest?cb=20201215091929", "2053": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/a/a4/Elisabeth_Doppler_future2052.jpg/revision/latest?cb=20190622191036", "seasons": [2, 3] } }
    }
  },
  {
    data: {
      id: "helge_A_1986", "label": "Helge", "family": "Doppler", "year": "1986", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/5/5a/Closeup_-_Helge.jpg/revision/latest?cb=20171227115301", "imagesByYear": { "1953": "https://static.wikia.nocookie.net/dark-netflix/images/7/77/DARK_1x09_HelgeDoppler1953.png/revision/latest/scale-to-width-down/1000?cb=20200819080430", "1986": "https://static.wikia.nocookie.net/dark-netflix/images/7/74/DARK_1x09_HelgeDoppler1986.png/revision/latest/scale-to-width-down/1000?cb=20200819085625", "2019": "https://static.wikia.nocookie.net/dark-netflix/images/5/5a/Closeup_-_Helge.jpg/revision/latest?cb=20171227115301" }
    }
  },
  {
    data: {
      id: "bernd_A_1953", "label": "Bernd", "family": "Doppler", "year": "1953", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/a/ad/Closeup_-_Bernd.jpg/revision/latest?cb=20171227115741", "imagesByYear": { "1953": "https://static.wikia.nocookie.net/dark-netflix/images/c/c2/DARK_1x09_BerndDoppler1953.png/revision/latest/scale-to-width-down/1000?cb=20200819073646", "1986": "https://api.dicebear.com/7.x/avataaars/svg?seed=bernd_1986" }
    }
  },
  {
    data: {
      id: "greta_A_1953", "label": "Greta", "family": "Doppler", "year": "1953", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/e/e2/DARK_1x09_GretaDoppler1953.png/revision/latest/scale-to-width-down/1000?cb=20200819093740"
    }
  },

  {
    data: {
      id: "noah_A_1986", "label": "Noah (Hanno)", "family": "Doppler", "year": "1986", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/f/f9/OlderNoah.png/revision/latest?cb=20230323164240", "imagesByYear": { "1888": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=noah_1888&backgroundColor=d97706", "seasons": [3] }, "1921": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=noah_1921&backgroundColor=d97706", "seasons": [2, 3] }, "1986": "https://static.wikia.nocookie.net/dark-netflix/images/d/db/YoungNoah.jpg/revision/latest?cb=20230322200439" }
    }
  },
  {
    data: {
      id: "tannhaus_A_1986", "label": "H.G. Tannhaus", "family": "Unknown", "year": "1986", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/c/cc/Closeup_-_Tannhaus.jpg/revision/latest?cb=20171227115306", "imagesByYear": { "1953": "https://static.wikia.nocookie.net/dark-netflix/images/8/8f/DARK_1x09_H.G.Tannhaus1953.png/revision/latest/scale-to-width-down/1000?cb=20200819090111", "1986": "https://static.wikia.nocookie.net/dark-netflix/images/c/cc/Closeup_-_Tannhaus.jpg/revision/latest?cb=20171227115306" }
    }
  },
  {
    data: {
      id: "erik_A_2019", "label": "Erik Obendorf", "family": "Unknown", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=erik_obendorf_2019&backgroundColor=6b7280", "imagesByYear": { "2019": "https://api.dicebear.com/7.x/avataaars/svg?seed=erik_obendorf_2019&backgroundColor=6b7280" }
    }
  },
  {
    data: {
      id: "yasin_A_2019", "label": "Yasin Friese", "family": "Unknown", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=yasin_friese_2019&backgroundColor=6b7280", "imagesByYear": { "2019": "https://api.dicebear.com/7.x/avataaars/svg?seed=yasin_friese_2019&backgroundColor=6b7280" }
    }
  },
  {
    data: {
      id: "regina_A_2019", "label": "Regina", "family": "Tiedemann", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/c/c3/Regina_2019.png/revision/latest/scale-to-width-down/1000?cb=20200629192734", "imagesByYear": { "1986": "https://static.wikia.nocookie.net/dark-netflix/images/9/91/Regina_1986.png/revision/latest/scale-to-width-down/1000?cb=20200629192722", "2019": "https://static.wikia.nocookie.net/dark-netflix/images/c/c3/Regina_2019.png/revision/latest/scale-to-width-down/1000?cb=20200629192734" }
    }
  },
  {
    data: {
      id: "aleksander_A_2019", "label": "Aleksander", "family": "Tiedemann", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/1/11/Aleksander_2019.png/revision/latest/scale-to-width-down/1000?cb=20200629192348", "imagesByYear": { "1986": "https://static.wikia.nocookie.net/dark-netflix/images/2/27/Aleksander_1986.png/revision/latest/scale-to-width-down/1000?cb=20200629192327", "2019": "https://static.wikia.nocookie.net/dark-netflix/images/1/11/Aleksander_2019.png/revision/latest/scale-to-width-down/1000?cb=20200629192348" }
    }
  },
  {
    data: {
      id: "bartosz_A_2019", "label": "Bartosz", "family": "Tiedemann", "year": "2019", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/3/3a/Closeup_-_Bartosz.jpg/revision/latest?cb=20171227115258", "imagesByYear": { "1888": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=bartosz_1888&backgroundColor=a855f7", "seasons": [2, 3] }, "2019": "https://static.wikia.nocookie.net/dark-netflix/images/3/3a/Closeup_-_Bartosz.jpg/revision/latest?cb=20171227115258" }
    }
  },
  {
    data: {
      id: "claudia_A_1986", "label": "Claudia", "family": "Tiedemann", "year": "1986", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/1/18/Claudia_2019.png/revision/latest/scale-to-width-down/1000?cb=20200629193350", "imagesByYear": { "1953": "https://static.wikia.nocookie.net/dark-netflix/images/f/f6/Claudia_1953.png/revision/latest/scale-to-width-down/1000?cb=20200629193301", "1986": "https://static.wikia.nocookie.net/dark-netflix/images/1/12/Claudia_1986.png/revision/latest/scale-to-width-down/1000?cb=20200629193332", "1987": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=claudia_1987", "seasons": [2, 3] }, "2019": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/1/18/Claudia_2019.png/revision/latest/scale-to-width-down/1000?cb=20200629193350", "seasons": [1, 2, 3] } }
    }
  },
  {
    data: {
      id: "egon_A_1953", "label": "Egon", "family": "Tiedemann", "year": "1953", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/c/c4/Egon_1986.png/revision/latest/scale-to-width-down/1000?cb=20200629215452", "imagesByYear": { "1953": "https://static.wikia.nocookie.net/dark-netflix/images/2/2c/Egon_1953.png/revision/latest/scale-to-width-down/1000?cb=20200629215502", "1986": "https://static.wikia.nocookie.net/dark-netflix/images/c/c4/Egon_1986.png/revision/latest/scale-to-width-down/1000?cb=20200629215452" }
    }
  },
  {
    data: {
      id: "doris_A_1953", "label": "Doris", "family": "Tiedemann", "year": "1953", "world": "A", "seasons": [1, 2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/3/37/DARK_1x09_DorisTiedemann.png/revision/latest/scale-to-width-down/1000?cb=20200819093647", "imagesByYear": { "1953": "https://static.wikia.nocookie.net/dark-netflix/images/3/37/DARK_1x09_DorisTiedemann.png/revision/latest/scale-to-width-down/1000?cb=20200819093647" }
    }
  },
  {
    data: {
      id: "silja_A_1888", "label": "Silja", "family": "Tiedemann", "year": "1888", "world": "A", "seasons": [2, 3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/0/08/Silija.jpg/revision/latest/scale-to-width-down/1000?cb=20190624183655", "imagesByYear": { "1888": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=silja_1888", "seasons": [3] }, "2053": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=silja_2053", "seasons": [2, 3] } }
    }
  },
  {
    data: {
      id: "martha_B_2019", "label": "Martha (Alt)", "family": "Nielsen", "year": "2019", "world": "B", "seasons": [2, 3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=martha_B_2019", "imagesByYear": { "1888": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=martha_B_1888&backgroundColor=14b8a6", "seasons": [3], "world": "B" }, "2019": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=martha_B_2019&backgroundColor=14b8a6", "seasons": [2, 3], "world": "B" } }
    }
  },
  {
    data: {
      id: "eva_B_2052", "label": "Eva", "family": "Nielsen", "year": "2052", "world": "B", "seasons": [3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=eva_2052", "imagesByYear": { "2052": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=eva_2052&backgroundColor=14b8a6", "seasons": [3], "world": "B" } }
    }
  },
  {
    data: {
      id: "unknown_B_1888", "label": "The Unknown (Cleft Lip)", "family": "Unknown", "year": "1888", "world": "B", "seasons": [3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown_1888", "imagesByYear": { "1888": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown_1888&backgroundColor=14b8a6", "seasons": [3], "world": "B" }, "1986": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown_1986&backgroundColor=14b8a6", "seasons": [3], "world": "B" }, "2019": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown_2019&backgroundColor=14b8a6", "seasons": [3], "world": "B" } }
    }
  },
  {
    data: {
      id: "tannhaus_O_1971", "label": "H.G. Tannhaus", "family": "Unknown", "year": "1971", "world": "Origin", "seasons": [3], "image": "https://static.wikia.nocookie.net/dark-netflix/images/c/c9/H.G._Tannhaus_1971.png/revision/latest/scale-to-width-down/1000?cb=20200728145729", "imagesByYear": { "1953": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/8/8f/DARK_1x09_H.G.Tannhaus1953.png/revision/latest/scale-to-width-down/1000?cb=20200819090111", "seasons": [3], "world": "Origin" }, "1986": { "image": "https://static.wikia.nocookie.net/dark-netflix/images/c/cc/Closeup_-_Tannhaus.jpg/revision/latest?cb=20171227115306", "seasons": [3], "world": "Origin" }, "2019": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=tannhaus_2019&backgroundColor=6b7280", "seasons": [3], "world": "Origin" } }
    }
  },
  {
    data: {
      id: "marek_O_1971", "label": "Marek Tannhaus", "family": "Unknown", "year": "1971", "world": "Origin", "seasons": [3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=marek_1971", "imagesByYear": { "1971": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=marek_1971&backgroundColor=6b7280", "seasons": [3], "world": "Origin" } }
    }
  },
  {
    data: {
      id: "sonja_O_1971", "label": "Sonja Tannhaus", "family": "Unknown", "year": "1971", "world": "Origin", "seasons": [3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=sonja_1971", "imagesByYear": { "1971": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=sonja_1971&backgroundColor=6b7280", "seasons": [3], "world": "Origin" } }
    }
  },
  {
    data: {
      id: "regina_O_2019", "label": "Regina", "family": "Tiedemann", "year": "2019", "world": "Origin", "seasons": [3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=regina_2019", "imagesByYear": { "2019": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=regina_O_2019&backgroundColor=6b7280", "seasons": [3], "world": "Origin" } }
    }
  },
  {
    data: {
      id: "katharina_O_2019", "label": "Katharina", "family": "Nielsen", "year": "2019", "world": "Origin", "seasons": [3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=katharina_2019", "imagesByYear": { "2019": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=katharina_O_2019&backgroundColor=6b7280", "seasons": [3], "world": "Origin" } }
    }
  },
  {
    data: {
      id: "hannah_O_2019", "label": "Hannah", "family": "Kahnwald", "year": "2019", "world": "Origin", "seasons": [3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=hannah_2019", "imagesByYear": { "2019": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=hannah_O_2019&backgroundColor=6b7280", "seasons": [3], "world": "Origin" } }
    }
  },
  {
    data: {
      id: "peter_O_2019", "label": "Peter", "family": "Doppler", "year": "2019", "world": "Origin", "seasons": [3], "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=peter_2019", "imagesByYear": { "2019": { "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=peter_O_2019&backgroundColor=6b7280", "seasons": [3], "world": "Origin" } }
    }
  },
  // ==========================================
  // 4. 관계 (Edges) - 가족관계, 연인, 동일인물
  // ==========================================
  { data: { source: "hannah_A_2019", target: "jonas_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "hannah_A_2019", target: "michael_A_2019", type: "spouse", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "ines_A_1986", target: "michael_A_2019", type: "child", seasons: [1, 2, 3], years: ["1986", "2019"] } }, // 입양
  { data: { source: "michael_A_2019", target: "jonas_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },

  { data: { source: "ulrich_A_2019", target: "katharina_A_2019", type: "spouse", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "ulrich_A_2019", target: "magnus_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "ulrich_A_2019", target: "martha_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "ulrich_A_2019", target: "mikkel_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "tronte_A_2019", target: "ulrich_A_2019", type: "child", seasons: [1, 2, 3], years: ["1986", "2019"] } },
  { data: { source: "jana_A_2019", target: "ulrich_A_2019", type: "child", seasons: [1, 2, 3], years: ["1986", "2019"] } },
  { data: { source: "tronte_A_2019", target: "mads_A_1986", type: "child", seasons: [1, 2, 3], years: ["1986", "2019"] } },
  { data: { source: "jana_A_2019", target: "mads_A_1986", type: "child", seasons: [1, 2, 3], years: ["1986", "2019"] } },
  { data: { source: "tronte_A_2019", target: "jana_A_2019", type: "spouse", seasons: [1, 2, 3], years: ["1986", "2019"] } },

  { data: { source: "peter_A_2019", target: "charlotte_A_2019", type: "spouse", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "peter_A_2019", target: "franziska_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "peter_A_2019", target: "elisabeth_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "charlotte_A_2019", target: "franziska_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "charlotte_A_2019", target: "elisabeth_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "bernd_A_1953", target: "greta_A_1953", type: "spouse", seasons: [1, 2, 3], years: ["1953"] } },
  { data: { source: "bernd_A_1953", target: "helge_A_1986", type: "child", seasons: [1, 2, 3], years: ["1953", "1986", "2019"] } },
  { data: { source: "greta_A_1953", target: "helge_A_1986", type: "child", seasons: [1, 2, 3], years: ["1953", "1986", "2019"] } },
  { data: { source: "helge_A_1986", target: "peter_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },

  { data: { source: "regina_A_2019", target: "aleksander_A_2019", type: "spouse", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "regina_A_2019", target: "bartosz_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "aleksander_A_2019", target: "bartosz_A_2019", type: "child", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "egon_A_1953", target: "doris_A_1953", type: "spouse", seasons: [1, 2, 3], years: ["1953"] } },
  { data: { source: "egon_A_1953", target: "claudia_A_1986", type: "child", seasons: [1, 2, 3], years: ["1986", "2019"] } },
  { data: { source: "doris_A_1953", target: "claudia_A_1986", type: "child", seasons: [1, 2, 3], years: ["1986", "2019"] } },

  { data: { source: "jonas_A_2019", target: "martha_A_2019", type: "love", seasons: [1, 2, 3], years: ["2019"] } },
  { data: { source: "ulrich_A_2019", target: "hannah_A_2019", type: "love", seasons: [1, 2, 3], years: ["2019"] } }, // 불륜

  // [시즌 1: 스포일러 관계]
  { data: { source: "mikkel_A_2019", target: "michael_A_2019", type: "same", seasons: [1, 2, 3], years: ["1986", "2019"] } }, // 미켈 = 미하엘

  // [시즌 2: 충격적인 족보 꼬임 및 동일인물 스포일러]
  { data: { source: "jonas_A_2019", target: "adam_A_1921", type: "same", seasons: [2, 3] } }, // 요나스 = 아담
  { data: { source: "noah_A_1986", target: "elisabeth_A_2019", type: "love", seasons: [2, 3] } },
  { data: { source: "noah_A_1986", target: "charlotte_A_2019", type: "child", seasons: [2, 3] } }, // 노아+엘리자베스 = 샤를로테
  { data: { source: "elisabeth_A_2019", target: "charlotte_A_2019", type: "child", seasons: [2, 3] } }, // 패러독스: 엄마이자 딸
  { data: { source: "egon_A_1953", target: "hannah_A_2019", type: "love", seasons: [2, 3] } }, // 에곤+한나
  { data: { source: "hannah_A_2019", target: "silja_A_1888", type: "child", seasons: [2, 3] } },
  { data: { source: "egon_A_1953", target: "silja_A_1888", type: "child", seasons: [2, 3] } },

  // [시즌 3: 세계의 기원과 매듭의 완성]
  { data: { source: "martha_B_2019", target: "eva_B_2052", type: "same", seasons: [3] } }, // 마르타(Alt) = 이브
  { data: { source: "jonas_A_2019", target: "martha_B_2019", type: "love", seasons: [3] } }, // 아담과 이브의 세계 결합
  { data: { source: "jonas_A_2019", target: "unknown_B_1888", type: "child", seasons: [3] } }, // 요나스+마르타(Alt) = 언노운
  { data: { source: "martha_B_2019", target: "unknown_B_1888", type: "child", seasons: [3] } },

  { data: { source: "unknown_B_1888", target: "agnes_A_1953", type: "love", seasons: [3] } }, // 언노운+아그네스 = 트론테
  { data: { source: "unknown_B_1888", target: "tronte_A_2019", type: "child", seasons: [3] } },
  { data: { source: "agnes_A_1953", target: "tronte_A_2019", type: "child", seasons: [1, 2, 3] } },

  { data: { source: "bartosz_A_2019", target: "silja_A_1888", type: "love", seasons: [3] } }, // 바르토스+실리야 = 노아, 아그네스
  { data: { source: "bartosz_A_2019", target: "noah_A_1986", type: "child", seasons: [3] } },
  { data: { source: "bartosz_A_2019", target: "agnes_A_1953", type: "child", seasons: [3] } },
  { data: { source: "silja_A_1888", target: "noah_A_1986", type: "child", seasons: [3] } },
  { data: { source: "silja_A_1888", target: "agnes_A_1953", type: "child", seasons: [3] } },

  { data: { source: "bernd_A_1953", target: "claudia_A_1986", type: "love", seasons: [3] } }, // 베른트+클라우디아 = 레지나
  { data: { source: "bernd_A_1953", target: "regina_A_2019", type: "child", seasons: [3] } },
  { data: { source: "claudia_A_1986", target: "regina_A_2019", type: "child", seasons: [3] } },

  // [근원 세계 (Origin World) - 비극의 시작점]
  { data: { source: "tannhaus_O_1971", target: "marek_O_1971", type: "child", seasons: [3] } },
  { data: { source: "marek_O_1971", target: "sonja_O_1971", type: "spouse", seasons: [3] } },
  { data: { source: "katharina_O_2019", target: "hannah_O_2019", type: "love", seasons: [3] } } // 근원 세계의 우정/연대
];

export default function App() {
  const cyRef = useRef(null);

  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null); // { label, family, availableVersions: [...] }
  const [selectedPersonYear, setSelectedPersonYear] = useState(null);

  // 시즌별 가능한 월드 및 연도 정의
  const seasonConfig = {
    1: { worlds: ["A"], years: ["2019", "1986", "1953"] },
    2: { worlds: ["A", "B"], years: ["2019", "1986", "1953", "1921", "1888"] },
    3: { worlds: ["A", "B", "Origin"], years: ["2052", "2019", "1986", "1953", "1921", "1888", "1971"] }
  };

  // 확장된 필터 상태
  const [seasonFilter, setSeasonFilter] = useState(1); // 기본값을 시즌 1로 하여 스포일러 방지
  const [yearFilter, setYearFilter] = useState("all");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [worldFilter, setWorldFilter] = useState("A"); // A, B, Origin, all

  // 시즌 변경 시 월드, 연도 자동 초기화
  const handleSeasonChange = (season) => {
    setSeasonFilter(season);
    const config = seasonConfig[season];
    // 시즌에 맞는 기본 월드 설정
    setWorldFilter(config.worlds.includes(worldFilter) ? worldFilter : config.worlds[0]);
    setYearFilter("all");
  };

  // 시즌에 맞는 가능한 월드 목록
  const availableWorlds = seasonConfig[seasonFilter].worlds;
  // 시즌에 맞는 가능한 연도 목록
  const availableYears = seasonConfig[seasonFilter].years;

  // 노드 필터링 로직 강화
  const filteredNodes = useMemo(() => {
    return initialElements.filter((el) => {
      if (el.data.source) return false; // 엣지 제외 (label 유무보다 명시적)

      const seasonMatch = el.data.seasons.includes(seasonFilter);
      const yearImageVal = el.data.imagesByYear && el.data.imagesByYear[yearFilter];

      let hasValidYearImage = false;
      if (yearImageVal) {
        const vSeasons = (typeof yearImageVal === "object" && yearImageVal.seasons)
          ? yearImageVal.seasons
          : el.data.seasons;
        hasValidYearImage = vSeasons.includes(seasonFilter);
      }

      const yearMatch = yearFilter === "all" || el.data.year === yearFilter || hasValidYearImage;
      const familyMatch = familyFilter === "all" || el.data.family === familyFilter;
      const worldMatch = worldFilter === "all" || el.data.world === worldFilter;

      // Update displayYear property if specific year is matched
      if (yearMatch && yearFilter !== "all" && hasValidYearImage) {
        el.data.displayYear = yearFilter;
      } else if (yearFilter === "all") {
        el.data.displayYear = null; // Revert to original
      }

      return seasonMatch && yearMatch && familyMatch && worldMatch;
    });
  }, [seasonFilter, yearFilter, familyFilter, worldFilter]);

  const nodeIds = new Set(filteredNodes.map((n) => n.data.id));

  // 엣지 필터링 (양쪽 노드가 존재하는지 + 해당 시즌에 밝혀진 관계인지 확인)
  const filteredEdges = useMemo(() => {
    return initialElements.filter((el) => {
      if (!el.data.source) return false; // 노드 제외
      const seasonMatch = !el.data.seasons || el.data.seasons.includes(seasonFilter);
      const yearMatch = yearFilter === "all"
        || !el.data.years
        || el.data.years.includes(yearFilter);
      return nodeIds.has(el.data.source) && nodeIds.has(el.data.target) && seasonMatch && yearMatch;
    });
  }, [filteredNodes, seasonFilter, yearFilter]);

  const filteredElements = useMemo(() => [...filteredNodes, ...filteredEdges], [filteredNodes, filteredEdges]);

  // 레이아웃 재적용
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(filteredElements);
    });

    cy.layout({
      name: "cose",
      animate: true
    }).run();

  }, [filteredElements]);

  // 스타일 시트
  const stylesheet = [
    { selector: 'edge', style: { 'overlay-padding': 6, 'label': '', 'text-background-opacity': 0 } },
    { selector: '.faded', style: { opacity: 0.15 } },
    { selector: '.highlighted', style: { opacity: 1, 'z-index': 999 } },
    {
      selector: "node",
      style: {
        label: (ele) => getPersonNameKo(ele.data("label")),
        "font-size": (ele) => {
          const degree = ele.degree();
          return 8 + Math.min(degree * 0.5, 4); // 8~12px 범위
        },
        "text-wrap": "wrap",
        "text-max-width": (ele) => {
          const degree = ele.degree();
          return 50 + degree * 2; // 반응형 text-max-width
        },
        "text-outline-width": 2,
        "text-outline-color": "#000",
        color: "#fff",
        width: (ele) => {
          const degree = ele.degree();
          return 50 + Math.min(degree * 5, 40); // 50~90px 범위
        },
        height: (ele) => {
          const degree = ele.degree();
          return 50 + Math.min(degree * 5, 40); // 50~90px 범위
        },
        "background-fit": "cover",
        "background-clip": "node",
        "background-position": "center",
        "background-image": (ele) => {
          const displayYear = ele.data("displayYear");
          const imagesByYear = ele.data("imagesByYear");
          if (displayYear && imagesByYear && imagesByYear[displayYear]) {
            const val = imagesByYear[displayYear];
            return typeof val === "object" ? (val.image || val.url) : val;
          }
          return ele.data("image");
        },
        "background-color": "#333",
        "border-width": (ele) => {
          const degree = ele.degree();
          return 2 + Math.min(degree * 0.3, 2); // 2~4px 범위
        },
        // 가문별 테두리 색상 차별화
        "border-color": (ele) => {
          const family = ele.data("family");
          if (family === "Kahnwald") return "#dc2626"; // 빨강
          if (family === "Nielsen") return "#3b82f6"; // 파랑
          if (family === "Doppler") return "#f59e0b"; // 노랑/골드
          if (family === "Tiedemann") return "#a855f7"; // 보라
          return "#6b7280"; // 회색 (Unknown)
        }
      }
    },
    { selector: 'edge[type="child"]', style: { width: 2, "line-color": "#9ca3af", "target-arrow-shape": "triangle", "curve-style": "bezier" } },
    { selector: 'edge[type="spouse"]', style: { width: 2, "line-color": "#fbbf24", "line-style": "dashed" } },
    { selector: 'edge[type="love"]', style: { width: 2, "line-color": "#ec4899" } },
    { selector: 'edge[type="same"]', style: { width: 4, "line-color": "#ef4444", "line-style": "dotted" } }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden relative bg-zinc-900 text-white">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-zinc-800 p-2.5 rounded-lg border border-zinc-700 text-yellow-500 shadow-xl"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Dim overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        w-80 max-w-[85vw] bg-zinc-900/95 md:bg-zinc-900 backdrop-blur-xl border-r border-zinc-700 p-5 space-y-6 overflow-y-auto custom-scrollbar
        md:relative md:translate-x-0 md:w-72 shadow-2xl md:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-xl text-yellow-500 tracking-tight">Dark Family Tree</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Season (Spoiler Control)</label>
          <select className="w-full bg-zinc-800 p-2 rounded" value={seasonFilter} onChange={(e) => handleSeasonChange(parseInt(e.target.value))}>
            <option value={1}>Season 1</option>
            <option value={2}>Season 2</option>
            <option value={3}>Season 3</option>
          </select>
        </div>

        {seasonFilter !== 1 && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold">World</label>
            <select className="w-full bg-zinc-800 p-2 rounded" value={worldFilter} onChange={(e) => setWorldFilter(e.target.value)}>
              <option value="all">All Worlds</option>
              {availableWorlds.includes("A") && <option value="A">Adam's World (A)</option>}
              {availableWorlds.includes("B") && <option value="B">Eve's World (B)</option>}
              {availableWorlds.includes("Origin") && <option value="Origin">Origin World</option>}
            </select>
          </div>
        )}
        {seasonFilter === 1 && (
          <div className="p-3 bg-zinc-800 rounded text-sm text-zinc-400">
            <span className="font-semibold text-white">World:</span> Adam's World (A)
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Time Period</label>
          <select className="w-full bg-zinc-800 p-2 rounded" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="all">All Times</option>
            {availableYears.includes("2052") && <option value="2052">2052</option>}
            {availableYears.includes("2019") && <option value="2019">2019</option>}
            {availableYears.includes("1986") && <option value="1986">1986</option>}
            {availableYears.includes("1953") && <option value="1953">1953</option>}
            {availableYears.includes("1921") && <option value="1921">1921</option>}
            {availableYears.includes("1888") && <option value="1888">1888</option>}
            {availableYears.includes("1971") && <option value="1971">1971</option>}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Family</label>
          <select className="w-full bg-zinc-800 p-2 rounded" value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value)}>
            <option value="all">모든 가문</option>
            <option value="Nielsen">니엘센</option>
            <option value="Kahnwald">칸발트</option>
            <option value="Doppler">도플러</option>
            <option value="Tiedemann">티데만</option>
          </select>
        </div>

        {selectedPerson && (
          <div className="mt-8 p-4 bg-zinc-800/80 rounded-xl border border-zinc-700 shadow-xl backdrop-blur-sm">
            <h3 className="font-bold text-xl text-yellow-500 mb-1">{selectedPerson.label}</h3>
            <p className="text-sm text-zinc-400 mb-1">{selectedPerson.family} 가문</p>
            <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{selectedPerson.description}</p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {selectedPerson.availableVersions
                .filter(v => v.seasons.includes(seasonFilter))
                .map((version) => {
                  const isSelected = selectedPersonYear === version.year;
                  return (
                    <div
                      key={`${version.id}-${version.year}`}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 ${isSelected
                        ? "bg-yellow-500/10 border-yellow-500/50 border shadow-md"
                        : "bg-zinc-900/50 border border-transparent hover:bg-zinc-700 hover:border-zinc-600"
                        }`}
                      onClick={() => {
                        setSelectedPersonYear(version.year);
                        const targetNode = cyRef.current.getElementById(version.id);
                        if (targetNode && targetNode.length > 0) {
                          // Change the node image explicitly
                          targetNode.data("displayYear", version.year);

                          setSelectedNode(targetNode);
                          targetNode.select();

                          // Focus/Highlight animation
                          cyRef.current.elements().removeClass("highlighted").removeClass("faded");
                          cyRef.current.elements().addClass("faded");
                          targetNode.removeClass("faded").addClass("highlighted");

                          targetNode.connectedEdges().removeClass("faded").addClass("highlighted");
                          targetNode.connectedEdges().connectedNodes().removeClass("faded").addClass("highlighted");

                          setTimeout(() => {
                            cyRef.current.elements().removeClass("faded").removeClass("highlighted");
                          }, 2000);
                        }
                      }}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={version.image}
                          alt={`${selectedPerson.label} ${version.year}`}
                          className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-zinc-600 object-cover shadow-inner"
                        />
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-zinc-900"></div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`font-bold truncate ${isSelected ? 'text-yellow-400' : 'text-zinc-200'}`}>
                          {version.year}
                        </p>
                        <p className="text-xs text-zinc-400 font-medium tracking-wider truncate">
                          WORLD {version.world}
                        </p>
                      </div>
                    </div>
                  );
                })}

              {selectedPerson.availableVersions.filter(v => v.seasons.includes(seasonFilter)).length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-4">No available versions in this season.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1">
        <CytoscapeComponent
          elements={filteredElements}
          stylesheet={stylesheet}
          style={{ width: "100%", height: "100%" }}
          cy={(cy) => {
            //if (cyRef.current) return; 
            cyRef.current = cy;

            cy.on("tap", "node", (evt) => {
              const node = evt.target;
              setSelectedNode(node);

              // 같은 이름의 모든 노드 찾기 대신, imagesByYear 데이터 활용
              const rawLabel = node.data("label");
              const rawFamily = node.data("family");

              const imagesByYear = node.data("imagesByYear") || {};
              const defaultYear = node.data("year");

              const availableVersions = [];
              if (Object.keys(imagesByYear).length > 0) {
                for (const [yr, val] of Object.entries(imagesByYear)) {
                  let vImage = val;
                  let vSeasons = node.data("seasons");
                  let vWorld = node.data("world");

                  if (typeof val === "object" && val !== null) {
                    vImage = val.image || val.url || "";
                    if (val.seasons) vSeasons = val.seasons;
                    if (val.world) vWorld = val.world;
                  }

                  availableVersions.push({
                    id: node.id(),
                    year: yr,
                    world: vWorld,
                    image: vImage,
                    seasons: vSeasons
                  });
                }
              } else {
                availableVersions.push({
                  id: node.id(),
                  year: defaultYear,
                  world: node.data("world"),
                  image: node.data("image"),
                  seasons: node.data("seasons")
                });
              }
              // 연도 역순 정렬
              availableVersions.sort((a, b) => parseInt(b.year) - parseInt(a.year));

              setSelectedPerson({
                label: getPersonNameKo(rawLabel),
                family: getFamilyNameKo(rawFamily),
                description: getPersonDescriptionKo(rawLabel, rawFamily, node.data("year")),
                availableVersions
              });
              setSelectedPersonYear(availableVersions[0]?.year);

              if (window.innerWidth < 768) {
                setSidebarOpen(true);
              }
            });

            cy.on("mouseover", "edge", (evt) => {
              const edge = evt.target;
              const source = getPersonNameKo(edge.source().data("label"));
              const target = getPersonNameKo(edge.target().data("label"));
              const type = edge.data("type");

              setTooltip({
                visible: true,
                x: evt.originalEvent.clientX,
                y: evt.originalEvent.clientY,
                text: `${source} → ${target} (${relationLabel[type] || type})`
              });

              cy.elements().addClass("faded");
              edge.removeClass("faded").addClass("highlighted");
              edge.source().removeClass("faded").addClass("highlighted");
              edge.target().removeClass("faded").addClass("highlighted");
            });

            cy.on("mousemove", (evt) => {
              const el = document.getElementById("tooltip-portal");
              if (!el) return;
              el.style.left = evt.originalEvent.clientX + 12 + "px";
              el.style.top = evt.originalEvent.clientY + 12 + "px";
            });

            cy.on("mouseout", "edge", () => {
              setTooltip({ visible: false, x: 0, y: 0, text: "" });
              cy.elements().removeClass("faded");
              cy.elements().removeClass("highlighted");
            });
          }}
        />
      </div>

      {tooltip.visible && createPortal(
        <div
          id="tooltip-portal"
          style={{ position: 'fixed', top: tooltip.y + 12, left: tooltip.x + 12, zIndex: 9999 }}
          className="pointer-events-none text-sm font-medium bg-black/90 border border-zinc-700 text-white px-3 py-1.5 rounded shadow-lg"
        >
          {tooltip.text}
        </div>,
        document.body
      )}
    </div>
  );
}