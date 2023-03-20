export default {
  data() {
    return {
      email: '',
      isSending: false,
      count: 30,
      pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
    };
  },
  computed: {
    message() {
      return !this.isSending ? '获取验证码' : `重新获取(${this.count})`;
    },
  },
  watch: {
    isSending(value) {
      if (value) {
        setInterval(() => {
          this.count -= 1;
          if (this.count === 0) {
            this.isSending = false;
            this.count = 30;
          }
        }, 1000);
      }
    },
  },
};
