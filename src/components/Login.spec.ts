import { mount } from "@vue/test-utils";
import Login from "./Login.vue";

describe("Login.vue", () => {
  test("ログインフォームを正しくレンダリング", () => {
    const wrapper = mount(Login);
    expect(wrapper.find("h2").text()).toBe("ログインテスト");
    expect(wrapper.find("label[for='email']").exists()).toBe(true);
    expect(wrapper.find("label[for='password']").exists()).toBe(true);
    expect(wrapper.find("button").text()).toBe("ログイン");
  });

  it("メールとパスワードの入力フィールドを更新", async () => {
    const wrapper = mount(Login);
    const emailInput = wrapper.find("#email");
    const passwordInput = wrapper.find("#password");

    await emailInput.setValue("user@example.com");
    await passwordInput.setValue("securepassword");

    expect(wrapper.vm.email).toBe("user@example.com");
    expect(wrapper.vm.password).toBe("securepassword");
  });

  it("無効なメールとパスワードにエラーが表示", async () => {
    const wrapper = mount(Login);
    await wrapper.find("#email").setValue("wrong@example.com");
    await wrapper.find("#password").setValue("wrongpassword");
    await wrapper.find("form").trigger("submit.prevent");

    await new Promise((resolve) => setTimeout(resolve, 600)); // Wait for async function

    expect(wrapper.find(".error").exists()).toBe(true);
    expect(wrapper.find(".error").text()).toBe("❌ ログインメールとパスワードは一致しません");
  });

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
});
