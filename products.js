import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'viosa-vue',
      products: [],
      // 判斷是否為新增產品
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  methods: {
    // 確認使用者登入
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          // 驗證通過後取得產品資訊
          this.getProducts();
        })
        //錯誤將跳轉回登入頁面
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },

    getProducts() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url).then((response) => {
        // 取得產品後刷新模板
        this.products = response.data.products;
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        this.getProducts();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    // 按鈕事件
    openModal(isNew, item) {
      if (isNew === 'new') {
        // 建立新產品
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        // 編輯產品
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        // 刪除產品
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
    //確認刪除
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getProducts();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    // 把Token 帶到headers的Authorization裡
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },
}).mount('#app');