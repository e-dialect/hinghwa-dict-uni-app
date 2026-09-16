# Third-Party Notices / 第三方声明

The root AGPL declaration does not replace the following path-level terms.
Dependencies installed through `package.json` and `yarn.lock` also retain their
own published licenses.

| Local path | Upstream and audited reference | License / notice |
| --- | --- | --- |
| `src/colorui/**` | [weilanwl/coloruicss](https://github.com/weilanwl/coloruicss), audited current revision `ce1a7feb765f2d89b56577c5a9df96e214ed23ba`; local header identifies ColorUI for uni-app v2.1.6 | MIT, copyright 2018 weilanwl; full text at `src/colorui/LICENSE.ColorUI`. The bundled/icon-font data within this path is part of the copied ColorUI component and is not project brand artwork. |
| `src/utils/u-parse/**` | [dcloudio/uParse](https://github.com/dcloudio/uParse), audited current revision `21259dceae6a706fe172479324ddcd40f6d677ac`; its files also identify F-loat/mpvue-wxParse, icindy/wxParse, Jxck/html2json, and blowsie/Pure-JavaScript-HTML5-Parser ancestry | MIT, copyright 2016 Di; full text at `src/utils/u-parse/LICENSE.uParse`. |
| `src/polyfill/**`, except the js-base64-derived portion below | [zhangdaren/miniprogram-to-uniapp](https://github.com/zhangdaren/miniprogram-to-uniapp), audited current revision `1edfda5a8f09d3d646a32666ffde5a2f18f35e98`; local file headers identify author Zhang Peng / `375890534@qq.com` | Apache-2.0; upstream notice at `src/polyfill/LICENSE.miniprogram-to-uniapp`, standard text at `LICENSES/Apache-2.0.txt`. |
| js-base64-derived portion of `src/polyfill/base64Binary.js` | [dankogai/js-base64](https://github.com/dankogai/js-base64), audited current revision `4901374f66abfd22a1fdca4d66c3e169ad19958c` | BSD-3-Clause, copyright 2014 Dan Kogai; full text at `src/polyfill/LICENSE.js-base64`. |
| `src/uni_modules/luch-audio/**` | [lei-mu/luch-audio](https://github.com/lei-mu/luch-audio), bundled package version 1.0.5 | MIT, copyright 2022 luch; existing full text at `src/uni_modules/luch-audio/LICENSE.txt`. |
| `scripts/incremental-diff.sh` | File-level declaration, copyright 2022 Charlie Chiang | Apache-2.0; standard text at `LICENSES/Apache-2.0.txt`. |

The local copies may contain conversion or project-specific changes. The fixed
references record provenance and the upstream licenses reviewed in this audit;
they do not assert byte-for-byte identity. None of these paths is included in
an alternative commercial license unless the relevant rightsholder separately
authorizes it.

---

根目录 AGPL 声明不替换上述路径级条款。ColorUI、uParse/wxParse、转换 polyfill、
js-base64 派生代码、`luch-audio` 与部署脚本分别继续适用其 MIT、BSD-3-Clause 或
Apache-2.0 许可证；相应版权声明与完整正文已放回相邻路径。除非相关权利人另行
授权，这些第三方路径均不属于替代商业许可证的范围。
