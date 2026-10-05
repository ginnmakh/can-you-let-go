export const dialogues = {
  "schema_version": 1,
  "language": "zh-Hant",
  "characters": {
    "tana": {
      "name": "塔納"
    },
    "colin": {
      "name": "柯林"
    }
  },
  "display_rules": {
    "conversation": {
      "placement": "bottom",
      "portrait": "current_speaker_left"
    },
    "colin_solo": {
      "placement": "bottom",
      "portrait": "colin_left"
    },
    "tana_solo_follow": {
      "placement": "above_head",
      "shape": "comic_bubble"
    },
    "night_exit_warning": {
      "placement": "bottom",
      "portrait": "tana_left",
      "explicit_exception": true
    }
  },
  "affection": {
    "initial": 85,
    "maximum": 100,
    "hidden_from_player": true,
    "burn": {
      "delta": -20,
      "applies_to": [
        "tana_related",
        "gift_from_tana"
      ],
      "deduplicate_per_item": true
    },
    "stop_following": {
      "below": 50,
      "wait_at": "campfire"
    },
    "after_burning_next_day_follow_distance_px": {
      "normal": 100,
      "distant_range": [
        250,
        400
      ]
    }
  },
  "gifts": {
    "sampling": {
      "rejection": "random_one_full_dialogue",
      "specific_gift": "use_full_sequence"
    },
    "rejection": {
      "match_tags": [
        "wood",
        "metal",
        "stone",
        "damaged"
      ],
      "accepted": false,
      "affinity_delta": null,
      "counts_toward_achievement": "gift_junk_attempts",
      "pool": [
        {
          "id": "reject_keep",
          "lines": [
            {
              "speaker": "tana",
              "text": "你自己留著。"
            }
          ]
        },
        {
          "id": "reject_use",
          "lines": [
            {
              "speaker": "tana",
              "text": "你是要我用在哪裡？"
            }
          ]
        },
        {
          "id": "reject_inspiration",
          "lines": [
            {
              "speaker": "tana",
              "text": "誰給你的靈感，讓你想送我這些？"
            }
          ]
        }
      ]
    },
    "specific": [
      {
        "id": "gem",
        "match_tags": [
          "gem"
        ],
        "accepted": true,
        "affinity_delta": null,
        "lines": [
          {
            "speaker": "tana",
            "text": "我不討厭閃閃發光的東西。"
          },
          {
            "speaker": "colin",
            "text": "難怪你喜歡我！"
          },
          {
            "speaker": "tana",
            "text": "……"
          }
        ]
      },
      {
        "id": "ring",
        "match_tags": [
          "ring"
        ],
        "accepted": true,
        "affinity_delta": null,
        "records": [
          "ring_accepted_by_tana"
        ],
        "lines": [
          {
            "speaker": "tana",
            "text": "你知道這是什麼意思嗎？"
          },
          {
            "speaker": "colin",
            "text": "知道啊！"
          }
        ]
      },
      {
        "id": "flower_safe",
        "match_tags": [
          "flower_nontoxic"
        ],
        "accepted": true,
        "affinity_delta": null,
        "lines": [
          {
            "speaker": "tana",
            "text": "它很快就會枯萎了。"
          },
          {
            "speaker": "colin",
            "text": "所以要現在送你啊！"
          }
        ]
      },
      {
        "id": "flower_toxic",
        "match_tags": [
          "flower_toxic"
        ],
        "accepted": true,
        "affinity_delta": null,
        "lines": [
          {
            "speaker": "tana",
            "text": "這有毒。"
          },
          {
            "speaker": "colin",
            "text": "對你沒影響吧？"
          },
          {
            "speaker": "tana",
            "text": "對你有。"
          }
        ],
        "max_accepted": 2,
        "limit_lines": [
          {
            "speaker": "tana",
            "text": "我看起來像毒窟嗎？"
          }
        ]
      },
      {
        "id": "book",
        "match_tags": [
          "book"
        ],
        "accepted": true,
        "affinity_delta": null,
        "lines": [
          {
            "speaker": "tana",
            "text": "這本書我以前看過了。"
          },
          {
            "speaker": "colin",
            "text": "啊……好吧。"
          },
          {
            "speaker": "tana",
            "text": "我可以再看一次。"
          },
          {
            "speaker": "colin",
            "text": "為什麼？"
          },
          {
            "speaker": "tana",
            "text": "是你送的。"
          }
        ]
      },
      {
        "id": "name_strip",
        "match_tags": [
          "colin_initial_name_strip"
        ],
        "accepted": true,
        "affinity_delta": null,
        "unlocks": "remember_me",
        "records": [
          "name_strip_held_by_tana"
        ],
        "lines": [
          {
            "speaker": "colin",
            "text": "你也許會丟掉，但我就是想給你。"
          },
          {
            "speaker": "tana",
            "text": "……"
          },
          {
            "speaker": "tana",
            "text": "至少現在，我收著。"
          }
        ]
      },
      {
        "id": "wreath",
        "accepted": true,
        "lines": [
          {
            "speaker": "colin",
            "text": "你戴起來應該會很好看。"
          },
          {
            "speaker": "tana",
            "text": "……我可以稍微配合你。"
          }
        ]
      },
      {
        "id": "score",
        "accepted": true,
        "affinity_delta": 5,
        "lines": [
          {
            "speaker": "tana",
            "text": "為什麼給我？"
          },
          {
            "speaker": "colin",
            "text": "旋律我都記住了！"
          },
          {
            "speaker": "tana",
            "text": "……"
          },
          {
            "speaker": "colin",
            "text": "如果能知道這首曲子在講什麼就好了……"
          }
        ]
      },
      {
        "id": "poetry",
        "accepted": false,
        "affinity_delta": 5,
        "lines": [
          {
            "speaker": "colin",
            "text": "感覺你會喜歡這種艱澀難懂的東西。"
          },
          {
            "speaker": "tana",
            "text": "我對愛情故事沒興趣。"
          },
          {
            "speaker": "colin",
            "text": "嗯？這本詩集在講愛情嗎？"
          },
          {
            "speaker": "tana",
            "text": "……"
          },
          {
            "speaker": "tana",
            "text": "是又怎麼樣？"
          },
          {
            "speaker": "colin",
            "text": "……嘻嘻。"
          }
        ]
      }
    ]
  },
  "interactions": {
    "choice_sampling": {
      "count": 2,
      "without_replacement": true,
      "refresh_on": "new_F_interaction",
      "not_on": "hover_or_choice_change",
      "exclude_unmet_conditions": true
    },
    "exhausted": {
      "pool": [
        {
          "speaker": "tana",
          "text": "……",
          "weight": 3
        },
        {
          "speaker": "tana",
          "text": "你的話還是那麼多。",
          "weight": 1
        },
        {
          "speaker": "tana",
          "text": "為什麼這樣看我？",
          "weight": 1
        },
        {
          "speaker": "tana",
          "text": "繼續吧。",
          "weight": 3
        },
        {
          "speaker": "tana",
          "text": "你以前走路速度有這麼慢嗎？",
          "weight": 1
        },
        {
          "speaker": "tana",
          "text": "人類為什麼需要儀式感？",
          "weight": 1
        },
        {
          "speaker": "tana",
          "text": "別那樣看著我。",
          "weight": 1
        },
        {
          "speaker": "tana",
          "text": "你今天話很多。",
          "weight": 1
        }
      ]
    },
    "tier_precedence": [
      "cold",
      "low",
      "high",
      "neutral"
    ],
    "tiers": [
      {
        "id": "high",
        "condition": {
          "min_inclusive": 85,
          "max_inclusive": 100
        },
        "opening_pool": [
          {
            "speaker": "tana",
            "text": "怎麼了嗎？"
          },
          {
            "speaker": "tana",
            "text": "你想說什麼？"
          }
        ],
        "pool": [
          {
            "id": "high_look",
            "label": "沒事，就想看看你。",
            "affinity_delta": 5,
            "lines": [
              {
                "speaker": "colin",
                "text": "沒事，就想看看你。"
              },
              {
                "speaker": "tana",
                "text": "隨便你。"
              }
            ]
          },
          {
            "id": "high_name",
            "label": "你知道嗎？你從來沒叫過我的名字。",
            "affinity_delta": -5,
            "lines": [
              {
                "speaker": "colin",
                "text": "你知道嗎？你從來沒叫過我的名字。"
              },
              {
                "speaker": "tana",
                "text": "是嗎？"
              },
              {
                "speaker": "colin",
                "text": "嗯。"
              }
            ]
          },
          {
            "id": "high_remember",
            "label": "你會一直記得我嗎？",
            "affinity_delta": 5,
            "lines": [
              {
                "speaker": "colin",
                "text": "你會一直記得我嗎？"
              },
              {
                "speaker": "tana",
                "text": "……不好忘。"
              }
            ]
          },
          {
            "id": "high_nothing",
            "label": "……沒有。",
            "affinity_delta": 0,
            "lines": [
              {
                "speaker": "colin",
                "text": "……"
              },
              {
                "speaker": "colin",
                "text": "沒有。"
              },
              {
                "speaker": "tana",
                "text": "我不會追問。"
              }
            ]
          },
          {
            "id": "high_here",
            "label": "你真的到最後都在這裡。",
            "affinity_delta": 5,
            "lines": [
              {
                "speaker": "colin",
                "text": "你真的到最後都在這裡。"
              },
              {
                "speaker": "tana",
                "text": "因為你在這裡。"
              }
            ]
          },
          {
            "id": "high_live",
            "label": "可以的話，我想繼續活在有你的世界。和你一起。",
            "affinity_delta": 0,
            "lines": [
              {
                "speaker": "colin",
                "text": "可以的話，我想繼續活在有你的世界。和你一起。"
              },
              {
                "speaker": "tana",
                "text": "……"
              },
              {
                "speaker": "colin",
                "text": "開玩笑的啦！"
              },
              {
                "speaker": "tana",
                "text": "不好笑。"
              }
            ]
          },
          {
            "id": "high_more_time",
            "label": "既然你不需要睡覺，那你可以想我的時間就更多了！",
            "affinity_delta": 0,
            "lines": [
              {
                "speaker": "colin",
                "text": "既然你不需要睡覺，那你可以想我的時間就更多了！"
              },
              {
                "speaker": "tana",
                "text": "……"
              },
              {
                "speaker": "tana",
                "text": "我不知道……什麼時候能忘掉你不吃什麼、你喜歡什麼、你害怕什麼、你會為什麼而掉淚、你會因為什麼而笑？"
              },
              {
                "speaker": "colin",
                "text": "……"
              },
              {
                "speaker": "colin",
                "text": "不能一直記得嗎……？"
              }
            ],
            "requires": {
              "min_day": 4
            }
          }
        ]
      },
      {
        "id": "low",
        "condition": {
          "min_inclusive": 61,
          "max_inclusive": 80
        },
        "opening_pool": [
          {
            "speaker": "tana",
            "text": "怎樣？"
          },
          {
            "speaker": "tana",
            "text": "什麼？"
          }
        ],
        "pool": [
          {
            "id": "low_look",
            "label": "只是想看看你。",
            "affinity_delta": 2,
            "lines": [
              {
                "speaker": "colin",
                "text": "只是想看看你。"
              },
              {
                "speaker": "tana",
                "text": "現在製造新的回憶，是不是有點晚？"
              }
            ]
          },
          {
            "id": "low_miss",
            "label": "如果你想念我了怎麼辦？",
            "affinity_delta": -2,
            "lines": [
              {
                "speaker": "colin",
                "text": "如果你想念我了怎麼辦？"
              },
              {
                "speaker": "tana",
                "text": "如果{burned_gift_name}還在的話，我也許會想起你。但現在……沒有了。"
              }
            ],
            "requires": {
              "has_burned_gift_from_tana": true
            },
            "substitutions": {
              "burned_gift_name": "玩家已燒毀且由塔納送給柯林的實際物品名稱"
            }
          },
          {
            "id": "low_remember",
            "label": "你會一直記得我嗎？",
            "affinity_delta": 0,
            "lines": [
              {
                "speaker": "colin",
                "text": "你會一直記得我嗎？"
              },
              {
                "speaker": "tana",
                "text": "你想被記得嗎？"
              },
              {
                "speaker": "colin",
                "text": "……我不知道。"
              },
              {
                "speaker": "tana",
                "text": "我沒辦法回答你自己都不知道的問題。"
              }
            ]
          }
        ]
      },
      {
        "id": "cold",
        "condition": {
          "max_inclusive": 60
        },
        "opening_pool": [
          {
            "speaker": "tana",
            "text": "……"
          },
          {
            "speaker": "tana",
            "text": "（盯著你，但沒有開口說話。）",
            "stage_direction": true
          }
        ],
        "pool": [
          {
            "id": "cold_words",
            "label": "你有什麼話想跟我說嗎？",
            "affinity_delta": 0,
            "lines": [
              {
                "speaker": "colin",
                "text": "你有什麼話想跟我說嗎？"
              },
              {
                "speaker": "tana",
                "text": "沒有。"
              },
              {
                "speaker": "colin",
                "text": "……知道了。"
              }
            ]
          },
          {
            "id": "cold_name",
            "label": "塔納。",
            "affinity_delta": 10,
            "lines": [
              {
                "speaker": "colin",
                "text": "塔納。"
              },
              {
                "speaker": "tana",
                "text": "？"
              },
              {
                "speaker": "colin",
                "text": "塔納！塔納！塔納！"
              },
              {
                "speaker": "tana",
                "text": "你有什麼毛病？"
              },
              {
                "speaker": "colin",
                "text": "就是想叫叫你。"
              }
            ]
          },
          {
            "id": "cold_understand",
            "label": "你到最後還是無法理解我。",
            "affinity_delta": 0,
            "lines": [
              {
                "speaker": "colin",
                "text": "你到最後還是無法理解我。"
              },
              {
                "speaker": "tana",
                "text": "？"
              },
              {
                "speaker": "tana",
                "text": "我知道你喜歡什麼、討厭什麼、為什麼開心、為什麼難過。"
              },
              {
                "speaker": "colin",
                "text": "……你看吧。"
              }
            ]
          }
        ]
      },
      {
        "id": "neutral",
        "condition": {
          "min_inclusive": 81,
          "max_inclusive": 84
        },
        "opening_pool": [],
        "pool": []
      }
    ]
  },
  "following": {
    "only_while": {
      "both_moving": true,
      "tana_following": true
    },
    "do_not_show_if": {
      "tana_waiting_at_camp": true
    },
    "speaker": "tana",
    "placement": "above_head",
    "modes": [
      {
        "id": "high",
        "interval_seconds": 13,
        "pool": [
          {
            "id": "follow_hidden",
            "text": "再往深處找好像會有不錯的東西。",
            "requires": {
              "current_map_has_hidden_good_loot": true
            },
            "weight": 1
          },
          {
            "id": "follow_slow",
            "text": "你不要走太快。",
            "weight": 1
          },
          {
            "id": "follow_sheepdog",
            "text": "你的體力和牧羊犬一樣。",
            "weight": 1
          },
          {
            "id": "follow_unforgettable",
            "text": "你是個……令人難忘的傢伙。",
            "weight": 1
          },
          {
            "id": "follow_carry",
            "text": "不要期待我能替你搬東西。",
            "weight": 1
          },
          {
            "id": "follow_joke",
            "text": "用木棍和鐵棍敲頭，哪個比較痛？……頭比較痛。",
            "weight": 0.1
          },
          {
            "id": "follow_freedom",
            "text": "依照立場不同，自由的定義是不是也不一樣？",
            "weight": 1
          },
          {
            "id": "follow_finally",
            "text": "終於……",
            "weight": 1
          }
        ]
      },
      {
        "id": "low",
        "interval_seconds": 23,
        "pool": [
          {
            "id": "follow_tired",
            "text": "我累了。",
            "weight": 1
          },
          {
            "id": "follow_best",
            "text": "不一定都要最好的。",
            "weight": 1
          },
          {
            "id": "follow_if",
            "text": "……如果——算了。",
            "weight": 1
          },
          {
            "id": "follow_humans",
            "text": "人類就愛弄這些有的沒的。",
            "weight": 1
          },
          {
            "id": "follow_how_long",
            "text": "還要逛多久？",
            "weight": 1
          },
          {
            "id": "follow_freedom_near",
            "text": "自由就在眼前。",
            "weight": 1
          },
          {
            "id": "follow_song",
            "text": "那首歌……你很久沒哼了。",
            "weight": 1
          }
        ]
      }
    ],
    "affinity_delta": 0
  },
  "night_exit_warning": {
    "speaker": "tana",
    "placement": "bottom",
    "selection": "random_one",
    "pool": [
      "天色已晚。",
      "這不是明智的選擇。",
      "黑暗的環境會讓你死得更快。",
      "不要把無謀和勇敢混為一談。"
    ]
  },
  "sleep": {
    "unfinished": "得先完成木工作業才能安心地睡覺。",
    "question": "結束一天？",
    "choices": [
      "是。",
      "再等等。"
    ]
  },
  "soul_extraction": {
    "lines": [
      {
        "speaker": "colin",
        "text": "這之後你會怎樣？"
      },
      {
        "speaker": "tana",
        "text": "我會自由。"
      },
      {
        "speaker": "colin",
        "text": "……這段時間，什麼時刻讓你最開心？"
      },
      {
        "speaker": "tana",
        "text": "……"
      },
      {
        "speaker": "colin",
        "text": "如果你浮現的畫面不是現在，那就算我贏吧。"
      },
      {
        "speaker": "tana",
        "text": "那我輸了什麼？我不理解。"
      },
      {
        "speaker": "colin",
        "text": "總有一天你會理解吧……"
      },
      {
        "speaker": "colin",
        "text": "真想看你那時的表情。"
      }
    ],
    "after_dialogue": {
      "hold_key": "F",
      "seconds": 5,
      "progress_shape": "circle"
    },
    "after_completed": [
      {
        "speaker": "tana",
        "text": "這就是最後一個……"
      }
    ]
  },
  "ending_interactions": {
    "only_relics": {
      "allow_sit": false,
      "lines": [
        {
          "speaker": "tana",
          "text": "這樣就夠了。"
        }
      ]
    },
    "return": {
      "title": "總是回來",
      "choices": [
        {
          "id": "sit",
          "label": "坐下",
          "lines": [],
          "seconds_before_fade": 5
        },
        {
          "id": "pour_wine",
          "label": "把酒撒在墓上",
          "animation": "pour_wine",
          "lines": [
            {
              "speaker": "tana",
              "text": "據說把酒撒在墓上，亡者就會記得回來的路。"
            },
            {
              "speaker": "tana",
              "text": "……但你不喜歡喝酒。"
            }
          ]
        }
      ]
    }
  },
  "pickups": {
    "poetry": [
      {
        "speaker": "colin",
        "text": "這本詩集好像很古老，有些詞我看不太懂。"
      },
      {
        "speaker": "tana",
        "text": "那就別看。"
      },
      {
        "speaker": "colin",
        "text": "昏鐘……為……亡者……而鳴，"
      },
      {
        "speaker": "colin",
        "text": "……愛人……說……那只是……鳥群……歸巢……"
      },
      {
        "speaker": "colin",
        "text": "咦？不覺得唸起來，和我常哼的曲子節奏很配嗎？"
      },
      {
        "speaker": "tana",
        "text": "我說別看。"
      }
    ]
  }
};
