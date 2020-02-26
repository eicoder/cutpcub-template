import '@/styles/index.scss';
import './index.scss';

new Vue({
  el: '#app',
  data: {
    visible: false
  },
  methods: {
    show: function () {
      this.visible = true;
    }
  }
});
