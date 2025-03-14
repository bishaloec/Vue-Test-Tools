<template>
  <div class="login-container">
    <h2>ログインテスト</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label for="email">📧 メールアドレス :</label>
        <input v-model="email" id="email" type="email" required />
      </div>
      <div class="input-group">
        <label for="password">🔒 パスワード:</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button type="submit" :disabled="!email || !password">ログイン</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const handleSubmit = async () => {
      errorMessage.value = "";

      // APIリクエストシミュレーション（実際のAPI呼び出しに置き換える）
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (email.value === "test@example.com" && password.value === "password123") {
        alert("✅ ログインが成功しました！");
      } else {
        errorMessage.value = "❌ ログインメールとパスワードは一致しません";
      }
    };

    return {
      email,
      password,
      errorMessage,
      handleSubmit    
    };
  },
};
</script>

<style scoped>
/* Centering container */
.login-container {
  max-width: 350px;
  margin: 50px auto;
  padding: 100px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Title Styling */
h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
}

/* Input group styles */
.input-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: 0.3s;
}

/* Focus effect */
input:focus {
  border-color: #007BFF;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

/* Button Styles */
button {
  width: 100%;
  padding: 10px;
  background: #007BFF;
  border: none;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Error Message */
.error {
  margin-top: 15px;
  color: red;
  font-size: 14px;
  font-weight: bold;
}
</style>
