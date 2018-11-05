/*!
 * <pkg.name>.js v<pkg.version> (<pkg.homepage>)
 *
 * Copyright 2015 <pkg.author.name> (<pkg.author.url>)
 * Licensed under <pkg.license.type> (<pkg.license.url>)
 */

(function () {
    'use strict';
    var functionName = '_f';

    // フィルター群
    var filters = {
        /*------------------------------------------------------------------
         * 入力制限系（必要の無い文字は削除する）
         *-----------------------------------------------------------------/
         /**
         * タブ文字をnum数のスペースに変換後、改行以外の制御文字を削除
         * 改行文字は\nに変換
         *
         * @param {String} str 変換する文字列
         * @param {Number} num スペースの文字数
         */
        removeCtl: function (str, num) {
            str = filters.tab2space(str, num);
            return str.replace(/[\x00-\x09\x0b-\x1f\x7f-\x9f]/g, '')
                    .replace(/\x0a/g, '\n');
        },
        /**
         * 改行の削除
         *
         * @param {String} str 変換する文字列
         */
        removeNl: function (str) {
            return str.replace(/\n/g, '');
        },
        /**
         * 全角スペースを含めたトリム
         * 「m」フラグを使用すると連続した改行が削除されることへの対策版
         *
         * @param {String} str 変換する文字列
         * @param {Boolean} multipleLines 各行ごとにトリムするかどうか（trueの時のみ各行トリム）
         * @param {Boolean} useBlankLine 空行を使用するかどうか（falseの時は空行削除）
         */
        trim: function (str, multipleLines, useBlankLine) {
            var reg = /^[\s　]+|[　\s]+$/g;
            if (multipleLines === true) {
                if (useBlankLine === false) {
                    str = str.replace(/^[\s　]+|[　\s]+$/gm, '');
                } else {
                    str = str
                            .split('\n')
                            .map(function (line) {
                                return line.replace(reg, '');
                            })
                            .join('\n')
                            .replace(reg, '');
                }
            } else {
                str = str.replace(reg, '');
            }
            return str;
        },
        /**
         * 全角スペースを含めた右トリム
         * 「m」フラグを使用すると連続した改行が削除されることへの対策版
         *
         * @param {String} str 変換する文字列
         * @param {Boolean} multipleLines 各行ごとにトリムするかどうか（trueの時のみ各行トリム）
         * @param {Boolean} useBlankLine 空行を使用するかどうか（falseの時は空行削除）
         */
        rtrim: function (str, multipleLines, useBlankLine) {
            var reg = /[　\s]+$/g;
            if (multipleLines === true) {
                if (useBlankLine === false) {
                    str = str
                            .replace(/[　\s]+$/gm, '')
                            .replace(/^\n+/g, '');
                } else {
                    str = str
                            .split('\n')
                            .map(function (line) {
                                return line.replace(reg, '');
                            })
                            .join('\n')
                            .replace(reg, '');
                }
            } else {
                str = str.replace(reg, '');
            }
            return str;
        },
        /**
         * 全角スペースを含めた左トリム
         * 「m」フラグを使用すると連続した改行が削除されることへの対策版
         *
         * @param {String} str 変換する文字列
         * @param {Boolean} multipleLines 各行ごとにトリムするかどうか（trueの時のみ各行トリム）
         * @param {Boolean} useBlankLine 空行を使用するかどうか（falseの時は空行削除）
         */
        ltrim: function (str, multipleLines, useBlankLine) {
            var reg = /^[\s　]+/g;
            if (multipleLines === true) {
                if (useBlankLine === false) {
                    str = str
                            .split('\n')
                            .map(function (line) {
                                return line.replace(reg, '');
                            })
                            .join('\n')
                            .replace(reg, '')
                            .replace(/[\n\n]+/g, '\n')
                            .replace(/\n+$/g, '');
                } else {
                    var split = str.split('\n');
                    str = split.map(function (line) {
                        return line.replace(reg, '');
                    }).join('\n').replace(reg, '');
                }
            } else {
                str = str.replace(reg, '');
            }
            return str;
        },
        /**
         * 英字のみ（全角半角変換あり）
         *
         * @param {String} str 変換する文字列
         */
        alpha: function (str) {
            return str.replace(/[Ａ-Ｚａ-ｚ]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            }).replace(/[^A-Za-z]/g, '');
        },
        /**
         * 数字のみ（全角半角変換あり）
         *
         * @param {String} str 変換する文字列
         */
        num: function (str) {
            return str.replace(/[０-９]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            }).replace(/[^\d]/g, '');
        },
        /**
         * 英数字のみ（全角半角変換あり）
         *
         * @param {String} str 変換する文字列
         */
        alphaNum: function (str) {
            return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            }).replace(/[^A-Za-z\d]/g, '');
        },
        /**
         * 数字とハイフンのみ（全角半角変換あり）
         * 全角ハイフン、全角ダッシュ、全角マイナス記号、長音符は半角ハイフンに変換
         *
         * @param {String} str 変換する文字列
         */
        numPyphen: function (str) {
            return str.replace(/[０-９]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            }).replace(/[‐－―ー]/g, '-').replace(/[^\d\-]/g, '');
        },
        /**
         * 数字とスラッシュのみ（全角半角変換あり）
         *
         * @param {String} str 変換する文字列
         **/
        numSlash: function (str) {
            return str.replace(/[０-９／]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            }).replace(/[^\d\/]/g, '');
        },
        /**
         * 数字とコロンのみ（全角半角変換あり）
         *
         * @param {String} str 変換する文字列
         **/
        numColon: function (str) {
            return str.replace(/[０-９：]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            }).replace(/[^\d:]/g, '');
        },
        /**
         * ひらがなとスペース・長音符・半角ハイフン・半角数字のみ
         *
         * 半角の濁点・半濁点は全角に変換
         * 数字を半角に変換
         * 全角スペースを半角スペースに変換
         * 全角ハイフン、全角ダッシュ、全角マイナス記号は半角ハイフンに変換
         *
         * @param {String} str 変換する文字列
         **/
        hiragana: function (str) {
            return str
                    .replace(/[０-９]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) - 65248);
                    })
                    .replace(/ﾞ/g, '゛')
                    .replace(/ﾟ/g, '゜')
                    .replace(/　/g, ' ')
                    .replace(/[‐－―]/g, '-')
                    .replace(/[^ぁ-ゔーゝゞゕゖ゛゜ \d\-]/g, '');
        },
        /**
         * カタカナとスペース・長音符・半角ハイフン・半角数字のみ
         *
         * 半角の濁点・半濁点は全角に変換
         * 数字を半角に変換
         * 全角スペースを半角スペースに変換
         * 全角ハイフン、全角ダッシュ、全角マイナス記号は半角ハイフンに変換
         *
         * @param {String} str 変換する文字列
         **/
        katakana: function (str) {
            return str
                    .replace(/[０-９]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) - 65248);
                    })
                    .replace(/ﾞ/g, '゛')
                    .replace(/ﾟ/g, '゜')
                    .replace(/　/g, ' ')
                    .replace(/[‐－―]/g, '-')
                    .replace(/[^ァ-ヴーヽヾヵヶヷヸヹヺ゛゜ \d\-]/g, '');
        },
        /*------------------------------------------------------------------
         * 数字処理系
         *-----------------------------------------------------------------/
         /**
         * 文字列を整数にして返す（parseInt）
         *
         * 全角の数字は半角にする
         * 全角ハイフン、全角ダッシュ、全角マイナス記号、長音符は半角ハイフンに変換
         * 先頭のマイナス以外のハイフンは削除
         * 数字以外の文字は削除
         *
         * 「abcd　－ー１２３かー４５６」→「-123456」
         * 「abc123456def」→「123456」
         * 「A0000123456」→「123456」
         * 「A0000123.456」→「123」
         * 「A0-000123.456」→「123」
         * 「A123-00123.456」→「12300123」
         * 「A-00000123456」→「-123456」
         *
         * @param {String} str 変換する文字列
         */
        toInt: function (str) {
            str = str
                    .replace(/[０-９．]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) - 65248);
                    })
                    .replace(/[‐－―ー]/g, '-')
                    .replace(/[^\-\d\.]/g, '')
                    .replace(/(?!^\-)[^\d\.]/g, '');
            return parseInt(str, 10);
        },
        /**
         * 文字列を浮動小数点にして返す（parseFloat）
         *
         * 全角の数字は半角にする
         * 全角ハイフン、全角ダッシュ、全角マイナス記号、長音符は半角ハイフンに変換
         * 先頭のマイナス以外のハイフンは削除
         * 数字以外の文字は削除
         *
         * 「abcd　－ー１２３かー４．５６」→「-1234.56」
         * 「abc123456def」→「123456」
         * 「12.34.56」→「12.34」
         * 「A0000123456」→「123456」
         * 「A0000123.456」→「123.456」
         * 「A0-000123.456」→「123.456」
         * 「A123-00123.456」→「12300123.456」
         * 「A-00000123456」→「-123456」
         *
         * @param {String} str 変換する文字列
         */
        toFloat: function (str) {
            str = str
                    .replace(/[０-９．]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) - 65248);
                    })
                    .replace(/[‐－―ー]/g, '-')
                    .replace(/[^\-\d\.]/g, '')
                    .replace(/(?!^\-)[^\d\.]/g, '');
            return parseFloat(str);
        },
        /**
         * 数字（文字列）に変換して返す
         *
         * 全角の数字は半角にする
         * 全角ハイフン、全角ダッシュ、全角マイナス記号、長音符は半角ハイフンに変換
         * 先頭のマイナス以外のハイフンは削除
         * 数字以外の文字は削除
         * parseFloatを通したものを小数点以下numで切り捨て
         * NaNの時は0
         *
         * Number.prototype.toFixed()は小数点以下を近似値で表現する為
         *
         * 引数numが指定なし、もしくは0の時
         * 「abcd　－ー１２３かー４．５６」→「-1234.56」
         * 「abc123456def」→「123456」
         * 「12.34.56」→「12.34」
         * 「A0000123456」→「123456」
         * 「A0000123.456」→「123.456」
         * 「A0-000123.456」→「123.456」
         * 「A123-00123.456」→「12300123.456」
         * 「A-00000123456」→「-123456」
         *
         * 引数numが1の時
         * 「abcd　－ー１２３かー４．５６」→「-1234.5」
         * 「abc123456def」→「123456.0」
         * 「12.34.56」→「12.3」
         * 「A0000123456」→「123456.0」
         * 「A0000123.456」→「123.4」
         * 「A0-000123.456」→「123.4」
         * 「A123-00123.456」→「12300123.4」
         * 「A-00000123456」→「-123456.0」
         *
         * 引数numが3の時
         * 「abcd　－ー１２３かー４．５６」→「-1234.560」
         * 「abc123456def」→「123456.000」
         * 「12.34.56」→「12.340」
         * 「A0000123456」→「123456.000」
         * 「A0000123.456」→「123.456」
         * 「A0-000123.456」→「123.456」
         * 「A123-00123.456」→「12300123.456」
         * 「A-00000123456」→「-123456.000」
         *
         * @param {String} str 変換する文字列
         * @param {Number} num 小数点以下の桁数（デフォルトは0「整数」、マイナスの指定は無視）
         * @param {Boolean} format 整数部分をフォーマットするかどうか
         * @param {Boolean} useMinus マイナスを削除するかどうか
         *                           falseの時のみマイナスを削除
         */
        numString: function (str, num, format, useMinus) {
            num = parseInt(num, 10);
            num = isNaN(num) ? 0 : num;
            str = filters.toFloat(str);
            if (isNaN(str)) {
                str = 0;
            }
            if (str < 0 && useMinus === false) {
                str *= -1;
            }
            var split = str.toString().split('.');
            var dec = '';
            if (num > 0) {
                if (split.length > 1) {
                    dec = '.' + (split[1] + new Array(num + 1).join('0'))
                            .slice(0, num);
                } else {
                    dec = '.' + new Array(num + 1).join('0').slice(0, num);
                }
            }
            str = split[0] + dec;
            return format === true ? filters.numFormat(str) : str;
        },
        /**
         * 数字の桁区切り
         *
         * 「12345678」→「12,345,678」
         * 「12345678.123456」→「12,345,678.123456」
         * 「-1234678」→「-12,345,678」
         * 「12,345,678」→「12,345,678」
         * 「12,345,6789」→「12,345,6,789」（桁数を再計算しているわけではないので注意）
         * 「12345678円」→「12,345,678円」
         * 「-12345円」→「-12,345円」
         *
         * @param {String} str 変換する文字列
         */
        numFormat: function (str) {
            var split = str.split('.');
            split[0] = split[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            return split.length === 1 ?
                    split[0] : split[0] + '.' + split[1];
        },
        /**
         * 桁区切りの数字から区切り文字の削除
         *
         * 「12,345,678」→「12345678」
         *
         * @param {String} str 変換する文字列
         */
        removeFigure: function (str) {
            return str.replace(/,/g, '');
        },
        /**
         * 文字列を右からnum文字切り出す（num文字に足りない場合はpadで埋める）
         *
         * 引数numの指定なし、もしくは2「123」→「23」
         * 引数numが5「123」→「00123」
         * 引数numが-10 「123」→「23」
         * 引数numが0（変化なし）「123」→「123」
         * 引数numが5、padがa「123」→「aa123」
         * 引数numが10、padがab「123」→「bababab123」
         *
         * @param {String} str 変換する文字列
         * @param {Number} num 切り出す文字数（指定なしもしくは0より小さいときは2）
         * @param {String} pad 桁数に足りない場合に左側を埋める文字
         *                     デフォルトは0
         */
        padSlice: function (str, num, pad) {
            num = parseInt(num, 10);
            num = isNaN(num) || num < 0 ? 2 : num;
            pad = pad === undefined ? '0' : pad.toString();
            return (new Array(num + 1).join(pad) + str).slice(num * -1);
        },
        /**
         * 文字列の左側を桁数numになるまで埋める（numを超える場合は何もしない）
         *
         * 引数numの指定なし、もしくは2「123」→「123」
         * 引数numが5「123」→「00123」
         * 引数numが-10 「123」→「123」
         * 引数numが0「123」→「123」
         * 引数numが5、padがa「123」→「aa123」
         * 引数numが10、padがab「123」→「abababab123」
         *
         * @param {String} str 変換する文字列
         * @param {Number} num 文字数（指定なしもしくは0より小さいときは2）
         * @param {String} pad 桁数に足りない場合に左側を埋める文字
         *                     デフォルトは0
         */
        padFill: function (str, num, pad) {
            num = parseInt(num, 10);
            num = isNaN(num) || num < 0 ? 2 : num;
            pad = pad === undefined ? '0' : pad.toString();
            while (str.length < num) {
                str = pad + str;
            }
            return str;
        },
        /*------------------------------------------------------------------
         * エスケープ・サニタイズ系
         *-----------------------------------------------------------------/
         /**
         * HTMLエスケープ
         *
         * @param {String} str 変換する文字列
         */
        escapeHTML: function (str) {
            return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
        },
        /**
         * HTMLアンエスケープ
         *
         * @param {String} str 変換する文字列
         */
        unEscapeHTML: function (str) {
            return str
                    .replace(/(&lt;)/g, '<')
                    .replace(/(&gt;)/g, '>')
                    .replace(/(&quot;)/g, '"')
                    .replace(/(&#39;)/g, "'")
                    .replace(/(&amp;)/g, '&');
        },
        /**
         * JavaScriptエスケープ
         *
         * @param {String} str 変換する文字列
         */
        escapeJs: function (str) {
            return str
                    .replace(/\\/g, '\\\\')
                    .replace(/'/g, "\\'")
                    .replace(/"/g, '\\"')
                    .replace(/\//g, '\\/')
                    .replace(/</g, '\\x3c')
                    .replace(/>/g, '\\x3e')
                    .replace(/(0x0D)/g, '\r')
                    .replace(/(0x0A)/g, '\n');
        },
        /**
         * JavaScriptアンエスケープ
         *
         * @param {String} str 変換する文字列
         */
        unEscapeJs: function (str) {
            return str
                    .replace(/\\'/g, "'")
                    .replace(/\\"/g, '"')
                    .replace(/\\\//g, '/')
                    .replace(/\\x3c/g, '<')
                    .replace(/\\x3e/g, '>')
                    .replace(/\\\\/g, '\\');
        },
        /**
         * JavaScript、HTMLエスケープ
         *
         * @param {String} str 変換する文字列
         */
        escapeJsHTML: function (str) {
            str = filters.escapeJs(str);
            return filters.escapeHTML(str);
        },
        /**
         * 外部リンク不可、括弧類のエスケープ
         *
         * @param {String} str 変換する文字列
         */
        noScript: function (str) {
            return str
                    .replace(/(\/\/)/g, '／／')
                    .replace(/\(/g, '（')
                    .replace(/\)/g, '）')
                    .replace(/\[/g, '［')
                    .replace(/\]/g, '］')
                    .replace(/\{/g, '｛')
                    .replace(/\}/g, '｝');
        },
        /**
         * encodeURIで変換
         *
         * @param {String} str 変換する文字列
         */
        encodeURI: function (str) {
            return encodeURI(str);
        },
        /**
         * decodeURIで変換
         *
         * @param {String} str 変換する文字列
         */
        decodeURI: function (str) {
            return decodeURI(str);
        },
        /**
         * encodeURIComponentで変換
         *
         * @param {String} str 変換する文字列
         */
        encodeURIComponent: function (str) {
            return encodeURIComponent(str);
        },
        /**
         * decodeURIComponentで変換
         *
         * @param {String} str 変換する文字列
         */
        decodeURIComponent: function (str) {
            return decodeURIComponent(str);
        },
        /*------------------------------------------------------------------
         * 文字列変換系
         *-----------------------------------------------------------------/
         /**
         * 改行をBRタグに変換
         *
         * @param {String} str 変換する文字列
         */
        nl2br: function (str) {
            return str.replace(/\n/g, '<br>');
        },
        /**
         * BRタグを改行に変換（BRの大文字・小文字の区別なし）
         *
         * @param {String} str 変換する文字列
         */
        br2nl: function (str) {
            return str.replace(/(<br>|<br \/>)/gi, '\n');
        },
        /**
         * タブをnum文字のスペースに変換
         *
         * @param {String} str 変換する文字列
         * @param {Number} num スペースの文字数（デフォルトは4）
         */
        tab2space: function (str, num) {
            num = parseInt(num, 10);
            var space = new Array(isNaN(num) ? 5 : num + 1).join(' ');
            return str.replace(/\t/g, space);
        },
        /**
         * スネークケースからキャメルケースに変換
         *
         * アンダースコア、ハイフン、半角スペースを変換
         * 先頭の区切り文字は削除
         * 変換前にある文字列中の大文字は変換されないので注意
         *
         * 「abc-def」→「abcDef」
         * 「abc-dEF」→「abcDEF」（変換前の大文字はそのまま）
         *
         * @param {String} str 変換する文字列
         * @param {Boolean} upper アッパーキャメルケースにするかどうか
         */
        snake2camel: function (str, upper) {
            str = str
                    .replace(/^[\-_ ]/g, "")
                    .replace(/[\-_ ]./g, function (match) {
                        return match.charAt(1).toUpperCase();
                    });
            return upper === true ?
                    str.replace(/^[a-z]/g, function (match) {
                        return match.toUpperCase();
                    }) : str;
        },
        /**
         * キャメルケースからスネークケースに変換
         *
         * 先頭の連続した大文字は大文字の最後尾とそれ以外に分解される
         * 最後尾の連続した大文字はひとつのまとまりとして変換される
         *
         * ABCDEF → abcdef
         * abcDef → abc-def
         * AbcDef → abc-def
         * DEFClass → def-class（先頭の連続した大文字は分解）
         * classID → class-id（最後尾の連続した大文字はひとつのまとまりとして変換）
         *
         * @param {String} str 変換する文字列
         * @param {String} separator 区切り文字（デフォルトはハイフン）
         */
        camel2snake: function (str, separator) {
            separator = separator === undefined ? "-" : separator;
            return str
                    .replace(/^[A-Z]+$/, function (match) {
                        return match.toLowerCase();
                    })
                    .replace(/^[A-Z]+/, function (match) {
                        if (match.length > 1) {
                            return match.replace(/[A-Z]$/, function (m) {
                                return separator + m.toLowerCase();
                            }).toLowerCase();
                        } else {
                            return match.toLowerCase();
                        }
                    })
                    .replace(/[A-Z]+$/g, function (match) {
                        return separator + match.toLowerCase();
                    })
                    .replace(/[A-Z]/g, function (match) {
                        return separator + match.toLowerCase();
                    });
        },
        /**
         * ひらがなを全角カタカナに変換
         *
         * 以下の文字は結合してカタカナに変換
         * 「う゛」→「ヴ」
         * 「わ゛」→「ヷ」
         * 「ゐ゛」→「ヸ」
         * 「ゑ゛」→「ヹ」
         * 「を゛」→「ヺ」
         * 「ゝ゛」→「ヾ」
         *
         * @param {String} str 変換する文字列
         * @param {Boolean} opt 小文字の「ゕ」「ゖ」を変換するかどうか falseを指定した場合は変換なし
         */
        hira2kana: function (str, opt) {
            str = str
                    .replace(/[ぁ-ゔ]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) + 0x60);
                    })
                    .replace(/ﾞ/g, '゛')
                    .replace(/ﾟ/g, '゜')
                    .replace(/(ウ゛)/g, 'ヴ')
                    .replace(/(ワ゛)/g, 'ヷ')
                    .replace(/(ヰ゛)/g, 'ヸ')
                    .replace(/(ヱ゛)/g, 'ヹ')
                    .replace(/(ヲ゛)/g, 'ヺ')
                    .replace(/(ゝ゛)/g, 'ヾ')
                    .replace(/ゝ/g, 'ヽ')
                    .replace(/ゞ/g, 'ヾ');
            if (opt !== false) {
                str = str.replace(/ゕ/g, 'ヵ').replace(/ゖ/g, 'ヶ');
            }
            return str;
        },
        /**
         * 全角カタカナをひらがなに変換
         *
         * 以下の文字を結合・展開
         * 「ウ゛」→「ゔ」
         * 「ヷ」→「わ゛」
         * 「ヸ」→「ゐ゛」
         * 「ヹ」→「ゑ゛」
         * 「ヺ」→「を゛」
         * 「ヽ゛」→「ゞ」
         *
         * ひらがなに無いカタカナは変換しない
         * 「ㇰ」「ㇱ」「ㇲ」「ㇳ」「ㇴ」「ㇵ」「ㇶ」「ㇷ」
         * 「ㇸ」「ㇹ」「ㇺ」「ㇻ」「ㇼ」「ㇽ」「ㇾ」「ㇿ」
         *
         * @param {String} str 変換する文字列
         * @param {Boolean} opt 小文字の「ヵ」「ヶ」を変換するかどうか falseを指定した場合は変換なし
         */
        kana2hira: function (str, opt) {
            str = str
                    .replace(/[ァ-ヴ]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) - 0x60);
                    })
                    .replace(/ﾞ/g, '゛')
                    .replace(/ﾟ/g, '゜')
                    .replace(/(う゛)/g, 'ゔ')
                    .replace(/ヷ/g, 'わ゛')
                    .replace(/ヸ/g, 'ゐ゛')
                    .replace(/ヹ/g, 'ゑ゛')
                    .replace(/ヺ/g, 'を゛')
                    .replace(/(ヽ゛)/g, 'ゞ')
                    .replace(/ヽ/g, 'ゝ')
                    .replace(/ヾ/g, 'ゞ');
            if (opt !== false) {
                str = str.replace(/ヵ/g, 'ゕ').replace(/ヶ/g, 'ゖ');
            }
            return str;
        },
        /**
         * 半角カタカナを全角カタカナに変換
         *
         * @param {String} str 変換する文字列
         */
        hankana2zenkana: function (str) {
            var kanaMap = {
                'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
                'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
                'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
                'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
                'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
                'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
                'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
                'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
                'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
                'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
                'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
                'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
                'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
                'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
                'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
                'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
                'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
                'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
                '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
            };

            var reg = new RegExp(
                    '(' + Object.keys(kanaMap).join('|') + ')', 'g'
                    );
            return str
                    .replace(reg, function (match) {
                        return kanaMap[match];
                    })
                    .replace(/ﾞ/g, '゛')
                    .replace(/ﾟ/g, '゜');
        },
        /**
         * 全角から半角に置き換え（カタカナは含まない）
         *
         * 全角チルダ、全角波ダッシュ共に半角チルダに変換
         * 全角ハイフン、全角ダッシュ、全角マイナス記号は半角ハイフンに変換
         * 長音符は半角ハイフンに含めない（住所の地名等に使用される為）
         *
         * @mytodo 今は良いがUnicode 8.0で波ダッシュの形が変わるみたいなので、
         * 波ダッシュを変換に含めるべきかどうかは検討が必要
         *
         * @param {String} str 変換する文字列
         * @param {Boolean} tilde チルダ falseを指定した場合は変換なし
         * @param {Boolean} mark 記号 falseを指定した場合は変換なし
         * @param {Boolean} hankana 半角カナ記号 trueを指定した場合のみ変換
         * @param {Boolean} space スペース falseを指定した場合は変換なし
         * @param {Boolean} alpha 英字 falseを指定した場合は変換なし
         * @param {Boolean} num 数字 falseを指定した場合は変換なし
         */
        zen2han: function (str, tilde, mark, hankana, space, alpha, num) {
            if (alpha !== false) {
                str = str.replace(/[Ａ-Ｚａ-ｚ]/g, function (s) {
                    return String.fromCharCode(s.charCodeAt(0) - 65248);
                });
            }
            if (num !== false) {
                str = str.replace(/[０-９]/g, function (s) {
                    return String.fromCharCode(s.charCodeAt(0) - 65248);
                });
            }
            if (mark !== false) {
                var regMark = /[！＂＃＄％＆＇（）＊＋，．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;
                str = str.replace(regMark, function (s) {
                    return String.fromCharCode(s.charCodeAt(0) - 65248);
                }).replace(/[‐－―]/g, '-');
            }
            if (tilde !== false) {
                str = str.replace(/[～〜]/g, '~');
            }
            if (space !== false) {
                str = str.replace(/　/g, ' ');
            }
            if (hankana === true) {
                var map = {
                    '。': '｡', '、': '､', '「': '｢', '」': '｣', '・': '･'
                };
                var regHankana = new RegExp(
                        '(' + Object.keys(map).join('|') + ')', 'g'
                        );
                str = str.replace(regHankana, function (match) {
                    return map[match];
                });
            }
            return str;
        },
        /**
         * 半角から全角に置き換え（カタカナは含まない）
         *
         * チルダは全角チルダに変換
         *
         * @param {String} str 変換する文字列
         * @param {Boolean} tilde チルダ falseを指定した場合は変換なし
         * @param {Boolean} mark 記号 falseを指定した場合は変換なし
         * @param {Boolean} hankana 半角カナ記号 falseを指定した場合は変換なし
         * @param {Boolean} space スペース falseを指定した場合は変換なし
         * @param {Boolean} alpha 英字 falseを指定した場合は変換なし
         * @param {Boolean} num 数字 falseを指定した場合は変換なし
         */
        han2zen: function (str, tilde, mark, hankana, space, alpha, num) {
            if (alpha !== false) {
                str = str.replace(/[A-Za-z]/g, function (s) {
                    return String.fromCharCode(s.charCodeAt(0) + 65248);
                });
            }
            if (num !== false) {
                str = str.replace(/\d/g, function (s) {
                    return String.fromCharCode(s.charCodeAt(0) + 65248);
                });
            }
            if (mark !== false) {
                var regMark = /[!"#\$%&'\(\)\*\+,\-\.\/:;<=>\?@\[\\\]\^_`\{\|\}]/g;
                str = str.replace(regMark, function (s) {
                    return String.fromCharCode(s.charCodeAt(0) + 65248);
                });
            }
            if (tilde !== false) {
                str = str.replace(/~/g, '～');
            }
            if (space !== false) {
                str = str.replace(/ /g, '　');
            }
            if (hankana !== false) {
                var map = {
                    '｡': '。', '､': '、', '｢': '「', '｣': '」', '･': '・'
                };
                var regHankana = new RegExp(
                        '(' + Object.keys(map).join('|') + ')', 'g'
                        );
                str = str.replace(regHankana, function (match) {
                    return map[match];
                });
            }
            return str;
        },
        /**
         * 一文字で表記される文字を複数文字に展開する
         *
         * @param {String} str 変換する文字列
         */
        one2multi: function (str) {
            var map = {
                '㈱': '(株)', '㈲': '(有)', '㈳': '(社)', '㈵': '(特)',
                '㈶': '(財)', '㈻': '(学)', '㈼': '(監)', '㍿': '株式会社'
            };
            var reg = new RegExp('(' + Object.keys(map).join('|') + ')', 'g');
            return str.replace(reg, function (match) {
                return map[match];
            });
        }
    };

    String.prototype[functionName] = function (method) {

        // 引数が空の場合は現在の文字列を返信
        if (arguments.length === 0) {
            return this.valueOf();
        }

        // 返信用の文字列
        var _this = this.valueOf();

        // フィルターの追加関数
        if (method === 'addFilter') {
            var obj = arguments[1];
            Object.keys(obj).map(function (key) {
                filters[key] = obj[key];
            });
            return;
        }

        if (typeof method === 'string') {
            // 文字列の時はフィルターの実行
            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(_this);
            // filtersの中にメソッドが存在すればフィルターの実行
            _this = filters.hasOwnProperty(method) ?
                    filters[method].apply(null, args) : _this;
        } else if (Array.isArray(method)) {
            // 配列の時のは再帰処理
            for (var i = 0, len = method.length; i < len; i++) {
                var m = typeof method[i] === 'string' ? [method[i]] : method[i];
                _this = String.prototype[functionName].apply(_this, m);
            }
        }

        return _this.valueOf();
    };
}());