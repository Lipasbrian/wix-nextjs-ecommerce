"use client"; // Required for client-side interactivity

export default function LoginPage() {
  return (
    <div className="login-container bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome back!
      </h1>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Sign in
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}