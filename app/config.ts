import { Config } from "./config.types";

const config: Config = {
  eventName: "Good Earth Medley",
  locale: "en",
  description: `
    An interactive map of Good Earth Medley.
  `,
  attributions: [
    // Used in the favicon
    "Direction signs icon by [Delapouite](https://delapouite.com/) under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)",
  ],
  theme: {
    background: "white",
    "highlight-background": "rgb(241 245 249)",
    border: "rgb(226 232 240)",
    "primary-text": "rgb(43, 43, 43)",
    "secondary-text": "rgb(100 116 139)",
    accent: "rgb(255,100,100)",
    disabled: "#cbd5e1",
  },
  map: {
    src: "/map.png",
    rooms: [
      {
        "id": "m01",
        "label": "M-01",
        "aliases": [
          "M01",
          "M-01"
        ],
        "description": "\n          Medley M-01\n        ",
        "area": [
          [815, 1480],
          [875, 1460],
          [895, 1520],
          [835, 1540]
        ]
      },
      {
        "id": "m02",
        "label": "M-02",
        "aliases": [
          "M02",
          "M-02"
        ],
        "description": "\n          Medley M-02\n        ",
        "area": [
          [739, 1512],
          [799, 1492],
          [819, 1552],
          [759, 1572]
        ]
      },
      {
        "id": "m03",
        "label": "M-03",
        "aliases": [
          "M03",
          "M-03"
        ],
        "description": "\n          Medley M-03\n        ",
        "area": [
          [644, 1585],
          [704, 1565],
          [724, 1625],
          [664, 1645]
        ]
      },
      {
        "id": "m04",
        "label": "M-04",
        "aliases": [
          "M04",
          "M-04"
        ],
        "description": "\n          Medley M-04\n        ",
        "area": [
          [602, 1517],
          [662, 1497],
          [682, 1557],
          [622, 1577]
        ]
      },
      {
        "id": "m05",
        "label": "M-05",
        "aliases": [
          "M05",
          "M-05"
        ],
        "description": "\n          Medley M-05\n        ",
        "area": [
          [574, 1443],
          [634, 1423],
          [654, 1483],
          [594, 1503]
        ]
      },
      {
        "id": "m06",
        "label": "M-06",
        "aliases": [
          "M06",
          "M-06"
        ],
        "description": "\n          Medley M-06\n        ",
        "area": [
          [535, 1363],
          [595, 1343],
          [615, 1403],
          [555, 1423]
        ]
      },
      {
        "id": "m07",
        "label": "M-07",
        "aliases": [
          "M07",
          "M-07"
        ],
        "description": "\n          Medley M-07\n        ",
        "area": [
          [494, 1288],
          [554, 1268],
          [574, 1328],
          [514, 1348]
        ]
      },
      {
        "id": "m08",
        "label": "M-08",
        "aliases": [
          "M08",
          "M-08"
        ],
        "description": "\n          Medley M-08\n        ",
        "area": [
          [464, 1213],
          [524, 1193],
          [544, 1253],
          [484, 1273]
        ]
      },
      {
        "id": "m09",
        "label": "M-09",
        "aliases": [
          "M09",
          "M-09"
        ],
        "description": "\n          Medley M-09\n        ",
        "area": [
          [432, 1125],
          [492, 1105],
          [512, 1165],
          [452, 1185]
        ]
      },
      {
        "id": "m10",
        "label": "M-10",
        "aliases": [
          "M10",
          "M-10"
        ],
        "description": "\n          Medley M-10\n        ",
        "area": [
          [394, 1052],
          [454, 1032],
          [474, 1092],
          [414, 1112]
        ]
      },
      {
        "id": "m11",
        "label": "M-11",
        "aliases": [
          "M11",
          "M-11"
        ],
        "description": "\n          Medley M-11\n        ",
        "area": [
          [362, 974],
          [422, 954],
          [442, 1014],
          [382, 1034]
        ]
      },
      {
        "id": "m12",
        "label": "M-12",
        "aliases": [
          "M12",
          "M-12"
        ],
        "description": "\n          Medley M-12\n        ",
        "area": [
          [327, 898],
          [387, 878],
          [407, 938],
          [347, 958]
        ]
      },
      {
        "id": "m13",
        "label": "M-13",
        "aliases": [
          "M13",
          "M-13"
        ],
        "description": "\n          Medley M-13\n        ",
        "area": [
          [295, 822],
          [355, 802],
          [375, 862],
          [315, 882]
        ]
      },
      {
        "id": "m14",
        "label": "M-14",
        "aliases": [
          "M14",
          "M-14"
        ],
        "description": "\n          Medley M-14\n        ",
        "area": [
          [258, 741],
          [318, 721],
          [338, 781],
          [278, 801]
        ]
      },
      {
        "id": "m15",
        "label": "M-15",
        "aliases": [
          "M15",
          "M-15"
        ],
        "description": "\n          Medley M-15\n        ",
        "area": [
          [239, 668],
          [299, 648],
          [319, 708],
          [259, 728]
        ]
      },
      {
        "id": "m16",
        "label": "M-16",
        "aliases": [
          "M16",
          "M-16"
        ],
        "description": "\n          Medley M-16\n        ",
        "area": [
          [575, 906],
          [635, 906],
          [635, 991],
          [575, 991],
          [555, 946]
        ]
      },
      {
        "id": "m17",
        "label": "M-17",
        "aliases": [
          "M17",
          "M-17"
        ],
        "description": "\n          Medley M-17\n        ",
        "area": [
          [653, 910],
          [713, 910],
          [713, 995],
          [653, 995]
        ]
      },
      {
        "id": "m18",
        "label": "M-18",
        "aliases": [
          "M18",
          "M-18"
        ],
        "description": "\n          Medley M-18\n        ",
        "area": [
          [731, 912],
          [791, 912],
          [811, 972],
          [751, 997],
          [731, 997]
        ]
      },
      {
        "id": "m19",
        "label": "M-19",
        "aliases": [
          "M19",
          "M-19"
        ],
        "description": "\n          Medley M-19\n        ",
        "area": [
          [824, 913],
          [884, 913],
          [884, 998],
          [824, 998]
        ]
      },
      {
        "id": "m20",
        "label": "M-20",
        "aliases": [
          "M20",
          "M-20"
        ],
        "description": "\n          Medley M-20\n        ",
        "area": [
          [823, 801],
          [883, 801],
          [883, 866],
          [823, 866]
        ]
      },
      {
        "id": "m21",
        "label": "M-21",
        "aliases": [
          "M21",
          "M-21"
        ],
        "description": "\n          Medley M-21\n        ",
        "area": [
          [908, 798],
          [968, 798],
          [968, 863],
          [908, 863]
        ]
      },
      {
        "id": "m22",
        "label": "M-22",
        "aliases": [
          "M22",
          "M-22"
        ],
        "description": "\n          Medley M-22\n        ",
        "area": [
          [994, 791],
          [1054, 791],
          [1054, 876],
          [994, 876]
        ]
      },
      {
        "id": "m23",
        "label": "M-23",
        "aliases": [
          "M23",
          "M-23"
        ],
        "description": "\n          Medley M-23\n        ",
        "area": [
          [1070, 803],
          [1130, 803],
          [1130, 888],
          [1070, 888]
        ]
      },
      {
        "id": "m24",
        "label": "M-24",
        "aliases": [
          "M24",
          "M-24"
        ],
        "description": "\n          Medley M-24\n        ",
        "area": [
          [1053, 908],
          [1113, 908],
          [1113, 993],
          [1053, 993]
        ]
      },
      {
        "id": "m25",
        "label": "M-25",
        "aliases": [
          "M25",
          "M-25"
        ],
        "description": "\n          Medley M-25\n        ",
        "area": [
          [1054, 992],
          [1114, 992],
          [1114, 1077],
          [1054, 1077],
          [1034, 1037]
        ]
      },
      {
        "id": "m26",
        "label": "M-26",
        "aliases": [
          "M26",
          "M-26"
        ],
        "description": "\n          Medley M-26\n        ",
        "area": [
          [975, 1080],
          [1085, 1080],
          [1085, 1165],
          [975, 1165]
        ]
      },
      {
        "id": "m27",
        "label": "M-27",
        "aliases": [
          "M27",
          "M-27"
        ],
        "description": "\n          Medley M-27\n        ",
        "area": [
          [975, 1165],
          [1085, 1165],
          [1085, 1250],
          [975, 1250]
        ]
      },
      {
        "id": "m28",
        "label": "M-28",
        "aliases": [
          "M28",
          "M-28"
        ],
        "description": "\n          Medley M-28\n        ",
        "area": [
          [975, 1250],
          [1085, 1250],
          [1085, 1335],
          [975, 1335]
        ]
      },
      {
        "id": "m29",
        "label": "M-29",
        "aliases": [
          "M29",
          "M-29"
        ],
        "description": "\n          Medley M-29\n        ",
        "area": [
          [975, 1335],
          [1085, 1335],
          [1085, 1420],
          [975, 1420]
        ]
      },
      {
        "id": "main-entry",
        "label": "Main Entry",
        "aliases": [
          "Main Entry",
          "Entry"
        ],
        "description": "\n          Main Entry to Medley\n        ",
        "area": [
          [
            1090,
            1500
          ],
          [
            1170,
            1500
          ],
          [
            1170,
            1570
          ],
          [
            1090,
            1570
          ]
        ]
      }
    ],
  },
};

export default config;
