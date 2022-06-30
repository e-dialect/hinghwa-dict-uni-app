<template>
    <view class="wemark_wrapper">
        <block v-if="type === 'wemark'" v-for="(renderBlock, blockIndex) in parsedData" :key="renderBlock.blockIndex">
            <view :class="'wemark_block_' + renderBlock.type">
                <block v-if="renderBlock.isArray" v-for="(renderInline, inlineIndex) in renderBlock.content" :key="renderInline.inlineIndex">
                    <text
                        :user-select="true"
                        :class="'wemark_inline_' + renderInline.type"
                        v-if="
                            renderInline.type === 'text' ||
                            renderInline.type === 'code' ||
                            renderInline.type === 'strong' ||
                            renderInline.type === 'strong_em' ||
                            renderInline.type === 'deleted' ||
                            renderInline.type === 'em' ||
                            renderInline.type === 'table_th' ||
                            renderInline.type === 'table_td'
                        "
                    >
                        {{ renderInline.content }}
                    </text>

                    <!-- 代码高亮 -->

                    <text :user-select="true" :class="'wemark_inline_code_' + renderInline.type" v-if="renderInline.type && renderBlock.highlight">{{ renderInline.content }}</text>

                    <text :user-select="true" class="wemark_inline_code_text" v-if="!renderInline.type">{{ renderInline }}</text>

                    <navigator class="wemark_inline_link" :url="renderInline.data.href" v-if="renderInline.type === 'link'">
                        {{ renderInline.content }}
                    </navigator>

                    <image mode="widthFix" class="wemark_inline_image" :src="renderInline.src" v-if="renderInline.type === 'image'"></image>
                </block>
                <block v-if="!renderBlock.isArray">
                    <view v-if="renderBlock.type === 'code'">{{ renderBlock.content }}</view>
                    <video v-if="renderBlock.type == 'video'" class="wemark_block_video" :src="renderBlock.src" :poster="renderBlock.poster" controls></video>
                </block>
            </view>
        </block>
        <rich-text class="wemark_wrapper_richtext" v-if="type === 'rich-text'" :nodes="richTextNodes"></rich-text>
    </view>
</template>

<script>
const parser = require('././parser.js');

const getRichTextNodes = require('././richtext.js').getRichTextNodes;

export default {
    data() {
        return {
            parsedData: {},
            richTextNodes: [],

            renderBlock: {
                blockIndex: '',
                type: '',
                isArray: '',
                content: [],
                highlight: '',
                src: '',
                poster: ''
            },

            renderInline: {
                inlineIndex: '',
                type: '',
                content: '',

                data: {
                    href: ''
                },

                src: ''
            }
        };
    },
    props: {
        md: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'wemark'
        },
        link: {
            type: Boolean,
            default: false
        },
        highlight: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        parseMd() {
            if (this.md) {
                var parsedData = parser.parse(this.md, {
                    link: this.link,
                    highlight: this.highlight
                }); // console.log('parsedData:', parsedData);

                if (this.type === 'wemark') {
                    this.setData({
                        parsedData
                    });
                } else {
                    // var inTable = false;
                    var richTextNodes = getRichTextNodes(parsedData); // console.log('richTextNodes:', richTextNodes);

                    this.setData({
                        richTextNodes
                    });
                    /* // 分批更新
        var update = {};
        var batchLength = 1000;
        console.log(batchLength);
        for(var i=0; i<richTextNodes.length; i++){
          update['richTextNodes.' + i] = richTextNodes[i];
          if(i%batchLength === batchLength - 1){
              console.log(update);
              this.setData(update);
              update = {};
          }
        }
        this.setData(update);
        update = {}; */
                }
            }
        }
    },
    watch: {
        md: {
            handler: function () {
                this.parseMd();
            },

            immediate: true
        }
    }
};
</script>
<style>
@import './prism.js.css';

.wemark_wrapper {
    margin: 10px 0;
    font-size: 32rpx;
    line-height: 1.8em;
}
.wemark_block_h1 {
    font-size: 40rpx;
    text-align: center;
    margin-bottom: 1em;
}
.wemark_block_h2 {
    font-size: 40rpx;
    padding-bottom: 0.5em;
    margin-top: 1em;
    margin-bottom: 1em;
    border-bottom: 1px solid #f0f0f0;
}
.wemark_block_h3 {
    font-size: 36rpx;
    margin-top: 1em;
    margin-bottom: 1em;
}
.wemark_block_h4,
.wemark_block_h5,
.wemark_block_h6 {
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 1em;
}
.wemark_block_p {
    margin-top: 1em;
    margin-bottom: 1em;
}
.wemark_block_video {
    margin-top: 1em;
    margin-bottom: 1em;
    width: 100%;
}
.wemark_block_blockquote_p {
    margin-top: 1em;
    margin-bottom: 1em;
    padding: 10px 0 10px 1em;
    font-size: 28rpx;
    background: #f0f0f0;
    border-left: 5px solid #e0e0e0;
}
.wemark_block_ul_li_p::before {
    content: '• ';
}
.wemark_block_ul_li_ul_li_p::before,
.wemark_block_ol_li_ul_li_p::before {
    content: '◦ ';
}
.wemark_block_ul_li_ul_li_p,
.wemark_block_ul_li_ol_li_p,
.wemark_block_ol_li_ul_li_p,
.wemark_block_ol_li_ol_li_p {
    padding-left: 1em;
}
.wemark_block_ul_li_p:last {
    margin-bottom: 1em;
}
.wemark_block_code {
    display: block;
    padding: 10px;
    font-size: 28rpx;
    line-height: 1.5em;
    border: 1px solid #f0f0f0;
    white-space: pre;
    overflow: auto;
}
.wemark_block_table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    /* border-left: 1px solid #e0e0e0; */
    /* border-top: 1px solid #e0e0e0; */
}
.wemark_block_table_tr {
    display: flex;
}
.wemark_wrapper_richtext .wemark_block_table_tr {
    display: table-row;
}
.wemark_inline_table_th,
.wemark_inline_table_td {
    flex: 1;
    padding: 5px;
    font-size: 28rpx;
    word-break: break-all;
    border: 1px solid #e0e0e0;
}
.wemark_wrapper_richtext .wemark_inline_table_th,
.wemark_wrapper_richtext .wemark_inline_table_td {
    display: table-cell;
    /* background:red;
	border-right:1px solid #e0e0e0;
	border-bottom:1px solid #e0e0e0; */
}
/* .wemark_inline_table_td:last{
	border-top:1px solid #e0e0e0;
} */
.wemark_inline_table_th {
    background: #f0f0f0;
    /* border-top:1px solid #e0e0e0; */
}
.wemark_inline_strong {
    font-weight: bold;
    padding: 0 5px;
    word-wrap: break-word;
}
.wemark_inline_em {
    font-style: italic;
    padding: 0 5px;
    word-wrap: break-word;
}
.wemark_inline_strong_em {
    font-style: italic;
    font-weight: bold;
    padding: 0 5px;
    word-wrap: break-word;
}
.wemark_inline_deleted {
    text-decoration: line-through;
    padding: 0 5px;
    word-wrap: break-word;
}
.wemark_inline_image {
    width: 100%;
    height: auto;
}
.wemark_inline_code {
    background: #f0f0f0;
    padding: 3px 5px;
    word-wrap: break-word;
}
.wemark_inline_text {
    word-wrap: break-word;
}
.wemark_inline_link {
    display: inline;
    color: blue;
    word-wrap: break-word;
}
</style>
