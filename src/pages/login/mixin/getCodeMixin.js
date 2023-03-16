export default {
  data() {
    return {
      email: '',
      isSending: false,
      count: 30,
    };
  },
  watch: {
    isSending(value) {
      if (value) {
        setInterval(() => {
          this.count -= 1;
        }, 1000);
      } else {
        this.count = 30;
      }
    },
  },
  methods: {
    changeSendCodeStatus() {
      this.isSending = true;
      setTimeout(() => {
        this.isSending = false;
      }, this.count * 1000);
    },
  },
};
