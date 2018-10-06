<template>
 <div>
  <p>{{title}}</p>
  <!-- ここでpropsに設定された値をそのまま表示する -->
  <p>{{message}}</p>
 </div>
</template>
 
<script>
export default {
  data: function () {
    return {
      title: 'はろー！こども！'
    }
  },
  props: ['message']
}
</script>
