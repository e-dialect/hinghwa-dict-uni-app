# Embedded Data Provenance / 内嵌资料来源

This file records the repository history and content boundary for the small
Puxian-language and geographic datasets shipped with the application. It does
not turn factual or expressive content into software merely because the data
is represented as JavaScript constants.

| Path | Nature | Source / provenance | Rights status |
| --- | --- | --- | --- |
| `src/services/relative.js` | Puxian kinship labels, dictionary word IDs, and a relationship graph used by the kinship calculator | The relationship graph was compiled by the project itself. It was added to this repository by `zzy2695s` in `1bf8ba3d193d4cb65761331dc44c63d08b2410da` and adapts the earlier e-dialect web implementation [`src/components/Tools/relative.js`](https://github.com/e-dialect/hinghwa-dict-web/blob/b5b589195d680c11aac49669a0372149b8608244/src/components/Tools/relative.js), introduced in `5d085c42b02ab3b147546e07f02462a84d7887d5` and substantially completed in `7f49d7ff08f1da806d38085b14a0e9eab5c860e9`. | Project-original compilation and software structure, as confirmed by the maintainer on 16 September 2026. The root AGPL covers authorized implementation code; underlying kinship terms, dictionary records, and factual relationships are not treated as software solely because they appear in the graph. |
| `src/const/pinyin.js` | Initials, finals, tones, IPA mappings, and short example words for the project's Puxian romanization UI | The phonology scheme and example material were authorized for project use by **莆仙乡音社**. The constants have been present since this repository's initial revision `01d6a7d2dabed16f5c588eec89402938c38acd11`, principally through `sheeplin`; the same project data appeared earlier in [`hinghwa-dict-web/src/views/Pinyin.vue`](https://github.com/e-dialect/hinghwa-dict-web/blob/b5b589195d680c11aac49669a0372149b8608244/src/views/Pinyin.vue). | Authorized community linguistic material, as confirmed by the maintainer on 16 September 2026. The authorization supports its use in this project, but this record does not infer a standalone AGPL data grant or a right to offer the material under alternative commercial terms. Surrounding authorized application code retains its software license. |
| `src/const/sheng-yun-diao.js` | Compact initial/final/tone filter labels and example characters | The phonology scheme and examples were authorized for project use by **莆仙乡音社**. The file has been present since `01d6a7d2dabed16f5c588eec89402938c38acd11`, with later structural changes by `sheeplin`; its predecessor is the matching filter data in [`hinghwa-dict-web/src/views/Tools/Conditions.vue`](https://github.com/e-dialect/hinghwa-dict-web/blob/b5b589195d680c11aac49669a0372149b8608244/src/views/Tools/Conditions.vue). | Authorized community linguistic material under the same confirmed project-use boundary. It is not automatically covered by the root software license or alternative commercial relicensing. |
| `src/const/location.js` | Names of Putian administrative areas used by the profile UI | Public administrative names and factual classifications. They were moved into this file by `sheeplin` in `23fcc29c8d5c581ac29fe7653c63abe417ca779e`; the list previously appeared in [`hinghwa-dict-web/src/components/User/AreaCascader.vue`](https://github.com/e-dialect/hinghwa-dict-web/blob/b5b589195d680c11aac49669a0372149b8608244/src/components/User/AreaCascader.vue). | Public factual names, not a claimed proprietary dataset. They may become outdated; inclusion is not a warranty of current administrative boundaries and does not create a separate database/content license. |

Repository history and organization code search did not identify an external
vendor dataset or a copied long-form narrative behind these four files. Future
changes must nevertheless record any external dictionary, publication,
government dataset, or community source used, together with its date, license
or permission, and required attribution.

---

本文件记录应用内四组莆仙语言与行政区资料的来源链。亲属关系图由项目自行整理；拼音
音系与例字由莆仙乡音社授权项目使用；行政区名属于公开事实性名称。相关路径均可回溯
到 e-dialect 项目贡献者及更早的 `hinghwa-dict-web` 实现，本轮仓库历史与组织代码检索
未发现外部厂商数据集或被复制的长篇叙述。项目使用授权不被扩大解释为独立的 AGPL
数据授权或替代商业重许可权。

后续若依据外部词典、出版物、政府数据或社区资料修改这些路径，必须同时记录来源、
日期、许可证或许可依据以及署名要求。
