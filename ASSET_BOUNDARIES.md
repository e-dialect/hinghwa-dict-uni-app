# Asset and Data Boundaries / 资产与数据边界

The root AGPL declaration covers authorized software code, not every content or
media item used by the application.

| Path or material | Boundary |
| --- | --- |
| `src/services/relative.js`, `src/const/pinyin.js`, `src/const/sheng-yun-diao.js`, and `src/const/location.js` | Embedded Puxian vocabulary, phonology examples, relationship data, and geographic lists. Their inclusion is not a representation that all underlying factual or expressive content is AGPL-licensed; the audited repository lineage and status are recorded in [`DATA_PROVENANCE.md`](./DATA_PROVENANCE.md). |
| `favicon.png` | Project/product identity artwork. No trademark right or endorsement is granted by the code license. |
| `images/branches.webp`, `images/image-20220701012922288.png` | Documentation screenshots. Their inclusion does not create a general media reuse or trademark grant. |
| Runtime dictionary, article, quiz, product, account, and recording content | Content returned by the backend or supplied by users requires its own provenance, consent, privacy basis, and license/permission. |
| Built packages, caches, and platform-generated application artifacts | Generated output is governed by its inputs and included third-party components; the root code license alone does not establish rights in every bundled asset. |

The icon-font and embedded images within `src/colorui/**` and
`src/uni_modules/luch-audio/**` travel with those third-party components and
are governed by their path-level notices in `THIRD_PARTY_NOTICES.md`.

Before adding content, recordings, screenshots, fonts, or design assets, record
the source, rightsholder, license/permission, attribution requirements, and any
privacy constraints. A code CLA does not automatically cover these materials.

---

根目录 AGPL 声明仅覆盖项目有权授权的软件代码。内嵌莆仙词汇、音系例字、亲属关系
数据、行政区划、Logo 与截图不因位于代码仓库而自动取得 AGPL 授权；部署中的词典、
文章、测验、商品、账户与录音内容也必须分别保留来源、权利、同意和隐私依据。
第三方组件内的字体和图片继续适用其路径级声明，代码 CLA 不自动覆盖这些材料。
