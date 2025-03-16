<template>
    <div class="login-container">
      <h1>Login</h1>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            @blur="validateEmail"
          />
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            @blur="validatePassword"
          />
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
          <p v-if="passwordWarning" class="warning-message">{{ passwordWarning }}</p>
        </div>
        
        <div v-if="loginError" class="error-message">
          {{ loginError }}
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoginDisabled || isLoading"
          class="login-button"
        >
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { useAuthService } from '../services/auth'
  
  export default defineComponent({
    name: 'LoginComponent',
    setup() {
      const email = ref('')
      const password = ref('')
      const emailError = ref('')
      const passwordError = ref('')
      const passwordWarning = ref('')
      const loginError = ref('')
      const successMessage = ref('')
      const isLoading = ref(false)
      
      const authService = useAuthService()
      
      const validateEmail = () => {
        emailError.value = ''
        
        if (!email.value) {
          emailError.value = 'Email is required'
          return false
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.value)) {
          emailError.value = 'Please enter a valid email address'
          return false
        }
        
        return true
      }
      
      const validatePassword = () => {
        passwordError.value = ''
        passwordWarning.value = ''
        
        if (!password.value) {
          passwordError.value = 'Password is required'
          return false
        }
        
        // Check password strength
        if (password.value.length < 8) {
          passwordWarning.value = 'Password should be at least 8 characters long'
        } else if (!/[A-Z]/.test(password.value)) {
          passwordWarning.value = 'Password should contain at least one uppercase letter'
        } else if (!/[0-9]/.test(password.value)) {
          passwordWarning.value = 'Password should contain at least one number'
        }
        
        return true
      }
      
      const isLoginDisabled = computed(() => {
        return !email.value || !password.value || !!emailError.value || !!passwordError.value
      })
      
      const handleLogin = async () => {
        // Reset previous errors
        loginError.value = ''
        successMessage.value = ''
        
        // Validate form
        const isEmailValid = validateEmail()
        const isPasswordValid = validatePassword()
        
        if (!isEmailValid || !isPasswordValid) {
          return
        }
        
        try {
          isLoading.value = true
          const result = await authService.login(email.value, password.value)
          
          if (result.success) {
            successMessage.value = 'Login successful'
            // In a real app, you might redirect here or update the auth state
          } else {
            loginError.value = result.message || 'Login failed. Please check your credentials.'
          }
        } catch (error) {
          loginError.value = 'An unexpected error occurred. Please try again.'
          console.error('Login error:', error)
        } finally {
          isLoading.value = false
        }
      }
      
      return {
        email,
        password,
        emailError,
        passwordError,
        passwordWarning,
        loginError,
        successMessage,
        isLoading,
        isLoginDisabled,
        validateEmail,
        validatePassword,
        handleLogin
      }
    }
  })
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .error-message {
    color: #d9534f;
    font-size: 14px;
    margin-top: 5px;
  }
  
  .warning-message {
    color: #f0ad4e;
    font-size: 14px;
    margin-top: 5px;
  }
  
  .success-message {
    color: #5cb85c;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #dff0d8;
    border-radius: 4px;
  }
  
  .login-button {
    padding: 10px 15px;
    background-color: #337ab7;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .login-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>
  