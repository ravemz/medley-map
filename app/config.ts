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
    src: "/map.jpg",
    rooms: [
      // A/B Series Houses (sorted numerically)
      {
        "id": "a30b30",
        "label": "A30/B30",
        "aliases": [
          "A-30 (Ground Floor)",
          "B-30 (First Floor)"
        ],
        "description": "\n          A30 (Ground) / B30 (First)\n        ",
        "area": [
          [221, 646],
          [324, 647],
          [323, 565],
          [221, 564]
        ]
      },
      {
        "id": "a31b31",
        "label": "A31/B31",
        "aliases": [
          "A-31 (Ground Floor)",
          "B-31 (First Floor)"
        ],
        "description": "\n          A31 (Ground) / B31 (First)\n        ",
        "area": [
          [223, 488],
          [326, 487],
          [326, 556],
          [224, 557]
        ]
      },
      {
        "id": "a32b32",
        "label": "A32/B32",
        "aliases": [
          "A-32 (Ground Floor)",
          "B-32 (First Floor)"
        ],
        "description": "\n          A32 (Ground) / B32 (First)\n        ",
        "area": [
          [224, 401],
          [325, 400],
          [325, 478],
          [225, 478]
        ]
      },
      {
        "id": "a33b33",
        "label": "A33/B33",
        "aliases": [
          "A-33 (Ground Floor)",
          "B-33 (First Floor)"
        ],
        "description": "\n          A33 (Ground) / B33 (First)\n        ",
        "area": [
          [221, 317],
          [324, 316],
          [325, 390],
          [222, 391]
        ]
      },
      {
        "id": "a34b34",
        "label": "A34/B34",
        "aliases": [
          "A-34 (Ground Floor)",
          "B-34 (First Floor)"
        ],
        "description": "\n          A34 (Ground) / B34 (First)\n        ",
        "area": [
          [220, 233],
          [323, 233],
          [323, 305],
          [221, 306]
        ]
      },
      {
        "id": "a35b35",
        "label": "A35/B35",
        "aliases": [
          "A-35 (Ground Floor)",
          "B-35 (First Floor)"
        ],
        "description": "\n          A35 (Ground) / B35 (First)\n        ",
        "area": [
          [218, 94],
          [280, 92],
          [283, 214],
          [218, 215]
        ]
      },
      {
        "id": "a36b36",
        "label": "A36/B36",
        "aliases": [
          "A-36 (Ground Floor)",
          "B-36 (First Floor)"
        ],
        "description": "\n          A36 (Ground) / B36 (First)\n        ",
        "area": [
          [291, 86],
          [366, 85],
          [368, 167],
          [293, 168]
        ]
      },
      {
        "id": "a37b37",
        "label": "A37/B37",
        "aliases": [
          "A-37 (Ground Floor)",
          "B-37 (First Floor)"
        ],
        "description": "\n          A37 (Ground) / B37 (First)\n        ",
        "area": [
          [375, 83],
          [452, 83],
          [453, 167],
          [376, 168]
        ]
      },
      {
        "id": "a38b38",
        "label": "A38/B38",
        "aliases": [
          "A-38 (Ground Floor)",
          "B-38 (First Floor)"
        ],
        "description": "\n          A38 (Ground) / B38 (First)\n        ",
        "area": [
          [462, 82],
          [536, 82],
          [538, 166],
          [463, 168]
        ]
      },
      {
        "id": "a39b39",
        "label": "A39/B39",
        "aliases": [
          "A-39 (Ground Floor)",
          "B-39 (First Floor)"
        ],
        "description": "\n          A39 (Ground) / B39 (First)\n        ",
        "area": [
          [549, 84],
          [622, 83],
          [623, 165],
          [550, 166]
        ]
      },
      {
        "id": "a40b40",
        "label": "A40/B40",
        "aliases": [
          "A-40 (Ground Floor)",
          "B-40 (First Floor)"
        ],
        "description": "\n          A40 (Ground) / B40 (First)\n        ",
        "area": [
          [633, 82],
          [704, 80],
          [705, 164],
          [634, 164]
        ]
      },
      {
        "id": "a41b41",
        "label": "A41/B41",
        "aliases": [
          "A-41 (Ground Floor)",
          "B-41 (First Floor)"
        ],
        "description": "\n          A41 (Ground) / B41 (First)\n        ",
        "area": [
          [719, 78],
          [793, 77],
          [793, 163],
          [720, 164]
        ]
      },
      {
        "id": "a42b42",
        "label": "A42/B42",
        "aliases": [
          "A-42 (Ground Floor)",
          "B-42 (First Floor)"
        ],
        "description": "\n          A42 (Ground) / B42 (First)\n        ",
        "area": [
          [804, 79],
          [879, 79],
          [880, 163],
          [804, 165]
        ]
      },
      {
        "id": "a43b43",
        "label": "A43/B43",
        "aliases": [
          "A-43 (Ground Floor)",
          "B-43 (First Floor)"
        ],
        "description": "\n          A43 (Ground) / B43 (First)\n        ",
        "area": [
          [885, 81],
          [949, 83],
          [1007, 157],
          [961, 192],
          [929, 160],
          [885, 162]
        ]
      },
      {
        "id": "a44b44",
        "label": "A44/B44",
        "aliases": [
          "A-44 (Ground Floor)",
          "B-44 (First Floor)"
        ],
        "description": "\n          A44 (Ground) / B44 (First)\n        ",
        "area": [
          [950, 256],
          [983, 230],
          [960, 201],
          [1014, 162],
          [1059, 222],
          [975, 290]
        ]
      },
      {
        "id": "a45b45",
        "label": "A45/B45",
        "aliases": [
          "A-45 (Ground Floor)",
          "B-45 (First Floor)"
        ],
        "description": "\n          A45 (Ground) / B45 (First)\n        ",
        "area": [
          [999, 284],
          [1067, 232],
          [1099, 275],
          [1100, 348],
          [1044, 348],
          [1044, 315],
          [1021, 314]
        ]
      },
      {
        "id": "a46b46",
        "label": "A46/B46",
        "aliases": [
          "A-46 (Ground Floor)",
          "B-46 (First Floor)"
        ],
        "description": "\n          A46 (Ground) / B46 (First)\n        ",
        "area": [
          [1022, 356],
          [1103, 357],
          [1103, 432],
          [1022, 431]
        ]
      },
      {
        "id": "a47b47",
        "label": "A47/B47",
        "aliases": [
          "A-47 (Ground Floor)",
          "B-47 (First Floor)"
        ],
        "description": "\n          A47 (Ground) / B47 (First)\n        ",
        "area": [
          [1015, 441],
          [1103, 441],
          [1104, 514],
          [1015, 514]
        ]
      },
      {
        "id": "a48b48",
        "label": "A48/B48",
        "aliases": [
          "A-48 (Ground Floor)",
          "B-48 (First Floor)"
        ],
        "description": "\n          A48 (Ground) / B48 (First)\n        ",
        "area": [
          [1032, 528],
          [1101, 527],
          [1101, 653],
          [1032, 653]
        ]
      },
      {
        "id": "a49b49",
        "label": "A49/B49",
        "aliases": [
          "A-49 (Ground Floor)",
          "B-49 (First Floor)"
        ],
        "description": "\n          A49 (Ground) / B49 (First)\n        ",
        "area": [
          [949, 560],
          [1024, 560],
          [1024, 652],
          [948, 652]
        ]
      },
      {
        "id": "a50b50",
        "label": "A50/B50",
        "aliases": [
          "A-50 (Ground Floor)",
          "B-50 (First Floor)"
        ],
        "description": "\n          A50 (Ground) / B50 (First)\n        ",
        "area": [
          [863, 557],
          [942, 559],
          [942, 661],
          [861, 660]
        ]
      },
      {
        "id": "a51b51",
        "label": "A51/B51",
        "aliases": [
          "A-51 (Ground Floor)",
          "B-51 (First Floor)"
        ],
        "description": "\n          A51 (Ground) / B51 (First)\n        ",
        "area": [
          [731, 749],
          [811, 749],
          [811, 838],
          [732, 838]
        ]
      },
      {
        "id": "a52b52",
        "label": "A52/B52",
        "aliases": [
          "A-52 (Ground Floor)",
          "B-52 (First Floor)"
        ],
        "description": "\n          A52 (Ground) / B52 (First)\n        ",
        "area": [
          [645, 749],
          [723, 750],
          [723, 840],
          [646, 840]
        ]
      },
      {
        "id": "a53b53",
        "label": "A53/B53",
        "aliases": [
          "A-53 (Ground Floor)",
          "B-53 (First Floor)"
        ],
        "description": "\n          A53 (Ground) / B53 (First)\n        ",
        "area": [
          [565, 755],
          [639, 754],
          [640, 838],
          [566, 838]
        ]
      },
      {
        "id": "a54b54",
        "label": "A54/B54",
        "aliases": [
          "A-54 (Ground Floor)",
          "B-54 (First Floor)"
        ],
        "description": "\n          A54 (Ground) / B54 (First)\n        ",
        "area": [
          [484, 757],
          [555, 756],
          [556, 839],
          [485, 839]
        ]
      },
      
      // Apartment Buildings (sorted numerically)
      {
        "id": "a101a501",
        "label": "A101-A501 (Apartment)",
        "aliases": [
          "A101 (Ground)",
          "A201 (Floor 1)",
          "A301 (Floor 2)",
          "A401 (Floor 3)",
          "A501 (Floor 4)"
        ],
        "description": "\n          A101-A501\n        ",
        "area": [
          [596, 670],
          [596, 618],
          [573, 617],
          [574, 568],
          [501, 569],
          [502, 636],
          [529, 636],
          [530, 671]
        ]
      },
      {
        "id": "a102a502",
        "label": "A102-A502 (Apartment)",
        "aliases": [
          "A102 (Ground)",
          "A202 (Floor 1)",
          "A302 (Floor 2)",
          "A402 (Floor 3)",
          "A502 (Floor 4)"
        ],
        "description": "A102-A502 (Apartment)",
        "area": [
          [500, 471],
          [571, 471],
          [571, 561],
          [500, 561]
        ]
      },
      {
        "id": "a103a503",
        "label": "A103-A503 (Apartment)",
        "aliases": [
          "A103 (Ground)",
          "A203 (Floor 1)",
          "A303 (Floor 2)",
          "A403 (Floor 3)",
          "A503 (Floor 4)"
        ],
        "description": "A103-A503 (Apartment)",
        "area": [
          [574, 462],
          [496, 461],
          [496, 363],
          [573, 364]
        ]
      },
      {
        "id": "a104a504",
        "label": "A104-A504 (Apartment)",
        "aliases": [
          "A104 (Ground)",
          "A204 (Floor 1)",
          "A304 (Floor 2)",
          "A404 (Floor 3)",
          "A504 (Floor 4)"
        ],
        "description": "A104-A504 (Apartment)",
        "area": [
          [592, 307],
          [572, 306],
          [573, 358],
          [492, 358],
          [492, 286],
          [532, 286],
          [532, 258],
          [546, 258],
          [593, 259]
        ]
      },
      {
        "id": "b101b501",
        "label": "B101-B501 (Apartment)",
        "aliases": [
          "B101 (Ground)",
          "B201 (First Floor)",
          "B301 (Second Floor)",
          "B401 (Third Floor)",
          "B501 (Fourth Floor)"
        ],
        "description": "B101-B501 (Apartment)",
        "area": [
          [789, 604],
          [766, 605],
          [766, 634],
          [744, 635],
          [744, 671],
          [681, 672],
          [681, 620],
          [705, 619],
          [706, 564],
          [789, 564]
        ]
      },
      {
        "id": "b102b502",
        "label": "B102-B502 (Apartment)",
        "aliases": [
          "B102 (Ground)",
          "B202 (First Floor)",
          "B302 (Second Floor)",
          "B402 (Third Floor)",
          "B502 (Fourth Floor)"
        ],
        "description": "B102-B502 (Apartment)",
        "area": [
          [706, 466],
          [788, 466],
          [788, 558],
          [707, 558]
        ]
      },
      {
        "id": "b103b503",
        "label": "B103-B503 (Apartment)",
        "aliases": [
          "B103 (Ground)",
          "B203 (First Floor)",
          "B303 (Second Floor)",
          "B403 (Third Floor)",
          "B503 (Fourth Floor)"
        ],
        "description": "B103-B503 (Apartment)",
        "area": [
          [706, 455],
          [786, 454],
          [786, 363],
          [706, 364]
        ]
      },
      {
        "id": "b104b504",
        "label": "B104-B504 (Apartment)",
        "aliases": [
          "B104 (Ground)",
          "B204 (First Floor)",
          "B304 (Second Floor)",
          "B404 (Third Floor)",
          "B504 (Fourth Floor)"
        ],
        "description": "B104-B504 (Apartment)",
        "area": [
          [747, 260],
          [748, 285],
          [766, 284],
          [765, 318],
          [793, 317],
          [793, 353],
          [705, 353],
          [706, 307],
          [681, 307],
          [681, 296],
          [682, 260]
        ]
      },
      
      // M-Series Buildings (sorted numerically)
      {
        "id": "m01",
        "label": "M01",
        "aliases": [
          "M-01"
        ],
        "description": "\n          Medley M01\n        ",
        "area": [
          [799, 1469],
          [876, 1439],
          [909, 1512],
          [834, 1546]
        ]
      },
      {
        "id": "m02",
        "label": "M02",
        "aliases": [
          "M-02"
        ],
        "description": "\n          Medley M02\n        ",
        "area": [
          [727, 1510],
          [800, 1478],
          [831, 1550],
          [758, 1582]
        ]
      },
      {
        "id": "m03",
        "label": "M03",
        "aliases": [
          "M-03"
        ],
        "description": "\n          Medley M03\n        ",
        "area": [
          [620, 1599],
          [733, 1550],
          [756, 1604],
          [643, 1654]
        ]
      },
      {
        "id": "m04",
        "label": "M04",
        "aliases": [
          "M-04"
        ],
        "description": "\n          Medley M04\n        ",
        "area": [
          [582, 1525],
          [661, 1489],
          [691, 1560],
          [612, 1596]
        ]
      },
      {
        "id": "m05",
        "label": "M05",
        "aliases": [
          "M-05"
        ],
        "description": "\n          Medley M05\n        ",
        "area": [
          [547, 1446],
          [625, 1412],
          [655, 1480],
          [578, 1514]
        ]
      },
      {
        "id": "m06",
        "label": "M06",
        "aliases": [
          "M-06"
        ],
        "description": "\n          Medley M06\n        ",
        "area": [
          [517, 1367],
          [594, 1333],
          [623, 1400],
          [544, 1434]
        ]
      },
      {
        "id": "m07",
        "label": "M07",
        "aliases": [
          "M-07"
        ],
        "description": "\n          Medley M07\n        ",
        "area": [
          [479, 1289],
          [560, 1254],
          [586, 1324],
          [508, 1359]
        ]
      },
      {
        "id": "m08",
        "label": "M08",
        "aliases": [
          "M-08"
        ],
        "description": "\n          Medley M08\n        ",
        "area": [
          [446, 1211],
          [526, 1174],
          [556, 1249],
          [476, 1282]
        ]
      },
      {
        "id": "m09",
        "label": "M09",
        "aliases": [
          "M-09"
        ],
        "description": "\n          Medley M09\n        ",
        "area": [
          [415, 1135],
          [491, 1102],
          [518, 1170],
          [443, 1203]
        ]
      },
      {
        "id": "m10",
        "label": "M10",
        "aliases": [
          "M-10"
        ],
        "description": "\n          Medley M10\n        ",
        "area": [
          [380, 1054],
          [454, 1021],
          [485, 1097],
          [412, 1127]
        ]
      },
      {
        "id": "m11",
        "label": "M11",
        "aliases": [
          "M-11"
        ],
        "description": "\n          Medley M11\n        ",
        "area": [
          [347, 978],
          [424, 946],
          [452, 1017],
          [377, 1047]
        ]
      },
      {
        "id": "m12",
        "label": "M12",
        "aliases": [
          "M-12"
        ],
        "description": "\n          Medley M12\n        ",
        "area": [
          [312, 901],
          [385, 870],
          [416, 940],
          [343, 971]
        ]
      },
      {
        "id": "m13",
        "label": "M13",
        "aliases": [
          "M-13"
        ],
        "description": "\n          Medley M13\n        ",
        "area": [
          [277, 821],
          [353, 790],
          [384, 863],
          [309, 894]
        ]
      },
      {
        "id": "m14",
        "label": "M14",
        "aliases": [
          "M-14"
        ],
        "description": "\n          Medley M14\n        ",
        "area": [
          [243, 741],
          [322, 725],
          [352, 785],
          [274, 814]
        ]
      },
      {
        "id": "m15",
        "label": "M15",
        "aliases": [
          "M-15"
        ],
        "description": "\n          Medley M15\n        ",
        "area": [
          [240, 653],
          [316, 653],
          [315, 720],
          [237, 736]
        ]
      },
      {
        "id": "m16",
        "label": "M16",
        "aliases": [
          "M-16"
        ],
        "description": "\n          Medley M16\n        ",
        "area": [
          [559, 905],
          [642, 905],
          [642, 997],
          [558, 997]
        ]
      },
      {
        "id": "m17",
        "label": "M17",
        "aliases": [
          "M-17"
        ],
        "description": "\n          Medley M17\n        ",
        "area": [
          [648, 906],
          [725, 905],
          [724, 998],
          [647, 998]
        ]
      },
      {
        "id": "m18",
        "label": "M18",
        "aliases": [
          "M-18"
        ],
        "description": "\n          Medley M18\n        ",
        "area": [
          [729, 906],
          [809, 906],
          [811, 999],
          [728, 999]
        ]
      },
      {
        "id": "m19",
        "label": "M19",
        "aliases": [
          "M-19"
        ],
        "description": "\n          Medley M19\n        ",
        "area": [
          [811, 919],
          [897, 920],
          [897, 1001],
          [812, 1002]
        ]
      },
      {
        "id": "m20",
        "label": "M20",
        "aliases": [
          "M-20"
        ],
        "description": "\n          Medley M20\n        ",
        "area": [
          [814, 801],
          [893, 800],
          [895, 878],
          [814, 878]
        ]
      },
      {
        "id": "m21",
        "label": "M21",
        "aliases": [
          "M-21"
        ],
        "description": "\n          Medley M21\n        ",
        "area": [
          [897, 795],
          [980, 794],
          [981, 872],
          [898, 872]
        ]
      },
      {
        "id": "m22",
        "label": "M22",
        "aliases": [
          "M-22"
        ],
        "description": "\n          Medley M22\n        ",
        "area": [
          [983, 791],
          [1065, 791],
          [1066, 875],
          [984, 876]
        ]
      },
      {
        "id": "m23",
        "label": "M23",
        "aliases": [
          "M-23"
        ],
        "description": "\n          Medley M23\n        ",
        "area": [
          [1071, 785],
          [1125, 785],
          [1124, 900],
          [1069, 900]
        ]
      },
      {
        "id": "m24",
        "label": "M24",
        "aliases": [
          "M-24"
        ],
        "description": "\n          Medley M24\n        ",
        "area": [
          [1031, 912],
          [1128, 912],
          [1126, 993],
          [1032, 990]
        ]
      },
      {
        "id": "m25",
        "label": "M25",
        "aliases": [
          "M-25"
        ],
        "description": "\n          Medley M25\n        ",
        "area": [
          [1034, 992],
          [1127, 996],
          [1127, 1077],
          [1034, 1077]
        ]
      },
      {
        "id": "m26",
        "label": "M26",
        "aliases": [
          "M-26"
        ],
        "description": "\n          Medley M26\n        ",
        "area": [
          [975, 1080],
          [1085, 1080],
          [1085, 1165],
          [975, 1165]
        ]
      },
      {
        "id": "m27",
        "label": "M27",
        "aliases": [
          "M-27"
        ],
        "description": "\n          Medley M27\n        ",
        "area": [
          [975, 1165],
          [1085, 1165],
          [1085, 1250],
          [975, 1250]
        ]
      },
      {
        "id": "m28",
        "label": "M28",
        "aliases": [
          "M-28"
        ],
        "description": "\n          Medley M28\n        ",
        "area": [
          [975, 1250],
          [1085, 1250],
          [1085, 1335],
          [975, 1335]
        ]
      },
      {
        "id": "m29",
        "label": "M29",
        "aliases": [
          "M-29"
        ],
        "description": "\n          Medley M29\n        ",
        "area": [
          [975, 1335],
          [1085, 1335],
          [1085, 1420],
          [975, 1420]
        ]
      },
      {
        "id": "m33",
        "label": "A104-A504",
        "aliases": [
          "A104-A504",
          "M33"
        ],
        "description": "\n          A104-A504\n        ",
        "area": [
          [544, 294],
          [544, 294],
          [544, 294]
        ]
      },
      
      // Special Buildings
      {
        "id": "main-entry",
        "label": "Main Entry",
        "aliases": [
          "Entry"
        ],
        "description": "\n          Main Entry to Medley\n        ",
        "area": [
          [1090, 1500],
          [1170, 1500],
          [1170, 1570],
          [1090, 1570]
        ]
      }
    ],
  },
};

export default config;
