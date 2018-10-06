<template>
 <div>
  <p>{{title}}</p>
  <!-- 子コンポーネントのmessageを設定して呼び出す -->
  <hello-child message='メッセージだよ'/>
 </div>
</template>
 
<script>
import HelloChild from './HelloChild'
export default {
  data: function () {
    return {
      title: 'はろー！わーるど！'
    }
  },
  components: {
    HelloChild
  }
}
</script>
