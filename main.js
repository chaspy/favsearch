var fruits = ['apple', 'apricot', 'avocado', 'blueberry', 'cherry', 'coconut', 'cranberry', 'dragonfruit', 'durian', 'grape', 'grapefruit', 'guava', 'kiwi fruit', 'lemon', 'lime', 'lychee', 'mango', 'melon', 'watermelon', 'miracle fruit', 'orange', 'bloodorange','clementine','mandarine','tangerine','papaya','passionfruit','peach','pear','persimmon','physalis','plum/prune','pineapple','pomegranate','raspberry','rambutan','star fruit','strawberry'];

$(function() {
  var list = $("#list");
  // id="list"を持つ変数を定義
  var preWord;
  // 入力結果と比較するための変数preWordを設定

  function appendList(word) {
    var item = $('<li class="list">').append(word);
    // class="list"で削除という命令のため、全てのアイテムにclass="list"を追加
    list.append(item);
    // var list = $("#list")のlistの中に、class="list"を持ったitemを追加
  }

  function editElement(element) {
    var result = "^" + element;
    // mapで回ってきた配列の各要素の前に^を付け加える
    return result;
  }

  $("#keyword").on("keyup", function() {
    // id="keyword"のキーが押されて上がった時に発火する。
    var input = $("#keyword").val();
    // 変数inputを設定し、id="keyword"のバリューを中に入れる
    var inputs = input.split(" ").filter(function(e) { return e; });
    // splitを使い空白で切り新しい配列を形成。aスペース3つbの場合、["a", "", "", "b"]となる。 ※ 1 分け方の解説
    // filterでfunction(e)のeに配列がそれぞれ入り、true or falseでtrueのもののみ返す。""はfalseになるため消える。 ※ 2 filterについての解説
    var newInputs = inputs.map(editElement);
    // 後の正規化表現のために、配列の各要素に^を付け加える。(ex)^ap  文字の先頭がapのときマッチ
    var word = newInputs.join("|");
    // 後の正規化表現のために、配列の各要素を|を使って連結。(ex) a|b  aまたはbにマッチ
    // この時点で、最初の入力が a b なら、^a|^b のように加工されており、先頭aもしくは先頭bにマッチ、となる。
    var reg = RegExp(word);
    // 加工されたwordからパターンマッチの正規化オブジェクトを生成して変数regに入れる。

    if (input.length === 0) {
      $(".list").remove();
      // フォームに値がないときに、listを全て削除する。
    }

    if (word != preWord && input.length !== 0) {
      // word != preWordで値が変わっていることを確認（shiftとか押された時対策）
      // input.length !== 0で何か値が入っていることを確認
      $(".list").remove();
      // class = "list"を全て削除し、リストを空にする
      $.each(fruits, function(i, fruit) {
        if (fruit.match(reg)) {
          // 配列fruitsがreg(正規化オブジェクト)とマッチしていたらappendListする
          appendList(fruit);
        }
      });

      if ($(".list").length === 0) {
        // $(".list").length === 0は当てはまるものがないということなので、その処理。
        appendList("No result");
      }
    }
    preWord = word;
    // preWordにwordを入れてpreWordを更新する
  });
});
