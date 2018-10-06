<template>
 <div>
  <p>{{title}}</p>
  <!-- v-model を使ってinput_msgにinputタグで入力した値を都度反映する -->
  <p><input v-model="input_msg"></p>
  <!-- 子コンポーネントのmessageに反映した値をを設定して呼び出す -->
  <hello-child :message="input_msg"/>
 </div>
</template>
 
<script>
import HelloChild from './HelloChild'
export default {
  data: function () {
    return {
      title: 'はろー！わーるど！',
      input_msg: ''
    }
  },
  components: {
    HelloChild
  }
}
</script>
