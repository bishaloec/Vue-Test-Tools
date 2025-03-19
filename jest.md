## はじめに
**Vue 3** + **Vite** プロジェクトに **Jest** を導入し、コンポーネントの単体テストを自動化する方法を紹介します。本記事では、Jest のセットアップ方法と、ログインフォームコンポーネントをテストする方法を解説します。
Vite では Vitest を使用することも可能ですが、Jest は 豊富なモック機能 や TypeScript との親和性 が高く、既存プロジェクトとの統一性の観点からもよく採用されます。

## ✅ なぜ Jest を使うのか？1

- **豊富な機能:** テスト実行、アサーション、モック、カバレッジ計測など、テストに必要な機能を網羅
- **Vue Test Utils との統合:** Vue 公式の @vue/test-utils を活用可能
- **JSDOM によるブラウザ環境の再現:** Vue コンポーネントのレンダリングや DOM 操作をブラウザなしでテスト
- **モジュールモック:** API 呼び出しや外部依存のモック化が容易
- **CI との統合:** GitHub Actions などの CI/CD に組み込みやすい

## 🛠 Jest のセットアップ
依存パッケージのインストール
まず、**Jest と Vue 3 + Vite + TypeScript** に対応するテスト関連のパッケージをインストールします。
```
npm install --save-dev jest @vue/test-utils @vue/vue3-jest ts-jest babel-jest \
  @babel/preset-env @babel/preset-typescript @types/jest jest-environment-jsdom 
```

## 主要な設定ファイル

### package.json
``` package.json
{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "@vue/test-utils": "^2.4.6",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.6",
    // ...その他の依存関係
  }
}
```

### Jest 設定ファイルの作成
プロジェクトのルートディレクトリに jest.config.cjs を作成し、以下の設定を追加します。
```jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['vue', 'ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(t|j)s?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg|css)$': '<rootDir>/__mocks__/fileMock.js'
  }
};
```
### Babel 設定
Jest はデフォルトで Babel を使用するため、Babel の設定を追加します。
プロジェクトルートに babel.config.js を作成し、以下の内容を記述します。
```babel.config.js
module.exports = {
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
      ]
    }
  }
};
```
### TypeScript 設定
tsconfig.json を以下のように修正します。
```tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowJs": true,
    "jsx": "preserve",
    "types": ["jest", "node"],
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue", "tests/**/*.ts", "__tests__/**/*.ts"]
}
```

## プロジェクト構成
```
project-root/
├─ src/
│ └─ Login.vue
├─ tests/
│ └─ Login.spec.ts
├─ jest.config.cjs
├─ tsconfig.json
├─ babel.config.js
└─ package.json
```

## ログインの概要

対象の Login.vue は、メールアドレスとパスワードを入力してログインするコンポーネントです。
```Login.vue
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
    
      if (email.value === "test@example.com" && password.value === "password12345") {
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
```

## テストケースの実装
1. コンポーネントのレンダリングのテスト
    ```Login.spec.ts
    it("ログインフォームを正しくレンダリング", () => {
        const wrapper = mount(Login);
        expect(wrapper.find("h2").text()).toBe("ログインテスト");
        expect(wrapper.find("label[for='email']").exists()).toBe(true);
        expect(wrapper.find("label[for='password']").exists()).toBe(true);
        expect(wrapper.find("button").text()).toBe("ログイン");
    });
    ```
2. 入力フィールドの更新のテスト
    ```Login.spec.ts
    it("メールとパスワードの入力フィールドを更新", async () => {
        const wrapper = mount(Login);
        const emailInput = wrapper.find("#email");
        const passwordInput = wrapper.find("#password");
    
        await emailInput.setValue("user@example.com");
        await passwordInput.setValue("securepassword");
    
        expect(wrapper.vm.email).toBe("user@example.com");
        expect(wrapper.vm.password).toBe("securepassword");
    });
    ```
3. ログイン失敗テスト
    ```Login.spec.ts
    it("無効なメールとパスワードにエラーが表示", async () => {
        const wrapper = mount(Login);
        await wrapper.find("#email").setValue("wrong@example.com");
        await wrapper.find("#password").setValue("wrongpassword");
        await wrapper.find("form").trigger("submit.prevent");
    
        await new Promise((resolve) => setTimeout(resolve, 600)); // Wait for async function
    
        expect(wrapper.find(".error").exists()).toBe(true);
        expect(wrapper.find(".error").text()).toBe("❌ ログインメールとパスワードは一致しません");
    });
    ```
4. ログイン失敗テスト
    ```Login.spec.ts
    it("ログインは成功", async () => {
        global.alert = jest.fn(); // Mock アラート 関数
    
        const wrapper = mount(Login);
        await wrapper.find("#email").setValue("test@example.com");
        await wrapper.find("#password").setValue("password123");
        await wrapper.find("form").trigger("submit.prevent");
    
        await new Promise((resolve) => setTimeout(resolve, 600));
    
        expect(global.alert).toHaveBeenCalledWith("✅ ログインが成功しました！");
        expect(wrapper.find(".error").exists()).toBe(false);
    });
   ```
## テスト実行
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3951101/0b1f58a1-8285-40d9-9b8e-724c78df3a9d.png)

## まとめ
Jest の設定は初めての方にとって少しハードルが高いかもしれませんが、一度理解してしまえば強力なツールとなります。特に Vue3 と TypeScript の組み合わせは、現代的なフロントエンド開発において必須のスキルです。Jest を使用することで、Vue 3 + Vite + TypeScript のプロジェクトにおいて、コンポーネントの単体テストを効率的に実施できます。
本記事を参考に、ぜひ **Jest** を導入し、堅牢な Vue アプリケーションを開発してみてください！ 🚀🔥

https://jestjs.io/ja/docs/getting-started

