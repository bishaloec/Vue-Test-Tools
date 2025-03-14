Vue 3 + Vite + TypeScript に Jest を導入し、Login.vue をテストする方法
## はじめ
Vue 3 + Vite プロジェクトに Jest を導入し、コンポーネントの単体テストを自動化する方法を紹介します。
Vite では Vitest を使用することも可能ですが、Jest は 豊富なモック機能 や TypeScript との親和性 が高く、
既存プロジェクトとの統一性の観点からもよく採用されます。

✅ なぜ Jest を使うのか？

豊富な機能: テスト実行、アサーション、モック、カバレッジ計測など、テストに必要な機能を網羅
Vue Test Utils との統合: Vue 公式の @vue/test-utils を活用可能
JSDOM によるブラウザ環境の再現: Vue コンポーネントのレンダリングや DOM 操作をブラウザなしでテスト
モジュールモック: API 呼び出しや外部依存のモック化が容易
CI との統合: GitHub Actions などの CI/CD に組み込みやすい
本記事では、Jest のセットアップ方法と、ログインフォームコンポーネント (Login.vue) をテストする方法を解説します。

🛠 Jest のセットアップ
1️⃣ 依存パッケージのインストール
まず、Jest と Vue 3 + Vite + TypeScript に対応するテスト関連のパッケージをインストールします。

bash
Copy
Edit
npm install --save-dev jest @vue/test-utils @vue/vue3-jest ts-jest babel-jest \
  @babel/preset-env @babel/preset-typescript @types/jest jest-environment-jsdom flush-promises
各パッケージの役割
パッケージ名	説明
jest	Jest テストフレームワーク本体
@vue/test-utils	Vue 3 用のテストユーティリティ
@vue/vue3-jest	Vue 3 用の .vue ファイルを Jest で処理するためのトランスフォーマ
ts-jest	TypeScript のコードを Jest で実行するためのプリセット
babel-jest	Babel を用いたコードの変換をサポート
@babel/preset-env	最新の JavaScript 構文をトランスパイル
@babel/preset-typescript	TypeScript の構文を Babel で解釈するためのプリセット
@types/jest	Jest の型定義（TypeScript で Jest の API を使うため）
jest-environment-jsdom	Jest の実行環境として JSDOM を使用するためのライブラリ
flush-promises	Vue コンポーネントの非同期処理のテストを行う際に便利なユーティリティ
2️⃣ Jest 設定ファイルの作成 (jest.config.cjs)
プロジェクトのルートディレクトリに jest.config.cjs を作成し、以下の設定を追加します。

js
Copy
Edit
// jest.config.cjs
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
3️⃣ Babel 設定 (babel.config.js)
Jest はデフォルトで Babel を使用するため、Babel の設定を追加します。
プロジェクトルートに babel.config.js を作成し、以下の内容を記述します。

js
Copy
Edit
// babel.config.js
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
4️⃣ TypeScript 設定 (tsconfig.json)
tsconfig.json を以下のように修正します。

json
Copy
Edit
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
5️⃣ Vue シングルファイルコンポーネント (.vue) の型設定
TypeScript で .vue ファイルを正しく認識させるために vue-shim.d.ts を作成します。

ts
Copy
Edit
// vue-shim.d.ts
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
🚀 Login.vue の概要
対象の Login.vue は、メールアドレスとパスワードを入力してログインするコンポーネントです。

vue
Copy
Edit
<template>
  <form @submit.prevent="login">
    <input id="email" v-model="email" type="email" placeholder="Email" />
    <input id="password" v-model="password" type="password" placeholder="Password" />
    <p v-if="error">{{ error }}</p>
    <button type="submit">ログイン</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  if (!email.value || !password.value) {
    error.value = "メールアドレスとパスワードを入力してください";
    return;
  }
  try {
    // 認証APIを呼び出す（ここではモック）
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert("✅ ログイン成功");
  } catch {
    error.value = "ログインに失敗しました";
  }
};
</script>
🔍 Jest を用いたテストの記述 (Login.spec.ts)
✅ コンポーネントのレンダリングのテスト
ts
Copy
Edit
import { mount } from "@vue/test-utils";
import Login from "@/components/Login.vue";

test("ログインフォームが正しくレンダリングされる", () => {
  const wrapper = mount(Login);
  expect(wrapper.find("#email").exists()).toBe(true);
  expect(wrapper.find("#password").exists()).toBe(true);
  expect(wrapper.find("button").text()).toBe("ログイン");
});
✅ 正しい認証情報でのログイン成功のテスト
ts
Copy
Edit
test("正しいメールアドレスとパスワードでログインすると、成功アラートが表示される", async () => {
  global.alert = jest.fn();
  const wrapper = mount(Login);
  await wrapper.find("#email").setValue("test@example.com");
  await wrapper.find("#password").setValue("password123");
  await wrapper.find("form").trigger("submit.prevent");

  expect(global.alert).toHaveBeenCalledWith("✅ ログイン成功");
});

## まとめ
Jest を使用することで、Vue 3 + Vite + TypeScript のプロジェクトにおいて、コンポーネントの単体テストを効率的に実施できます。
本記事を参考に、ぜひ Jest を導入し、堅牢な Vue アプリケーションを開発してみてください！ 🚀🔥