'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, Undo } from 'lucide-react';

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Your E-commerce Platform',
    logoUrl: '/logo.png',
    primaryColor: '#3B82F6',
    currencySymbol: '$',
    currencyCode: 'USD',
    taxRate: 8.5,
    allowGuestCheckout: true,
    requireEmailVerification: true,
    vendorApplicationRequiresApproval: true,
    showOutOfStockProducts: true,
    productsPerPage: 12,
    maintenanceMode: false,
  });
  const [originalSettings, setOriginalSettings] = useState({ ...settings });
  const [errors, setErrors] = useState({
    siteName: '',
    logoUrl: '',
    primaryColor: '',
    currencySymbol: '',
    currencyCode: '',
    taxRate: '',
    productsPerPage: '',
  });

  // Protect route - redirect if not admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  // Fetch settings on initial load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
          setOriginalSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchSettings();
    }
  }, [status, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setSettings({
      ...settings,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      siteName: '',
      logoUrl: '',
      primaryColor: '',
      currencySymbol: '',
      currencyCode: '',
      taxRate: '',
      productsPerPage: '',
    });

    // Validate form
    let isValid = true;
    const newErrors = { ...errors };

    if (!settings.siteName.trim()) {
      newErrors.siteName = 'Site name is required';
      isValid = false;
    }

    if (
      settings.primaryColor &&
      !/^#[0-9A-F]{6}$/i.test(settings.primaryColor)
    ) {
      newErrors.primaryColor = 'Color must be a valid hex code (e.g., #3B82F6)';
      isValid = false;
    }

    if (!settings.currencySymbol.trim()) {
      newErrors.currencySymbol = 'Currency symbol is required';
      isValid = false;
    }

    if (settings.taxRate < 0 || settings.taxRate > 100) {
      newErrors.taxRate = 'Tax rate must be between 0 and 100';
      isValid = false;
    }

    if (settings.productsPerPage < 4 || settings.productsPerPage > 100) {
      newErrors.productsPerPage = 'Products per page must be between 4 and 100';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Save settings to API
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      // Update original settings after successful save
      setOriginalSettings({ ...settings });

      // Show success message
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetChanges = () => {
    setSettings({ ...originalSettings });

    // Clear any validation errors
    setErrors({
      siteName: '',
      logoUrl: '',
      primaryColor: '',
      currencySymbol: '',
      currencyCode: '',
      taxRate: '',
      productsPerPage: '',
    });
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="ml-2">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={resetChanges}
            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
            disabled={
              JSON.stringify(settings) === JSON.stringify(originalSettings)
            }
          >
            <Undo size={16} className="mr-2" />
            Reset Changes
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            disabled={
              loading ||
              JSON.stringify(settings) === JSON.stringify(originalSettings)
            }
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Save Settings
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings Section */}
            <div className="col-span-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2">
                General Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.siteName
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-md dark:bg-gray-700`}
                />
                {errors.siteName && (
                  <p className="text-red-500 text-sm mt-1">{errors.siteName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="logoUrl"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Logo URL
                </label>
                <input
                  type="text"
                  id="logoUrl"
                  name="logoUrl"
                  value={settings.logoUrl}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.logoUrl
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-md dark:bg-gray-700`}
                  placeholder="/images/logo.png"
                />
                {errors.logoUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.logoUrl}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="primaryColor"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Primary Color
                </label>
                <div className="flex">
                  <input
                    type="color"
                    id="primaryColor"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleChange}
                    className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                    aria-label="Select color visually"
                  />
                  <input
                    type="text"
                    id="primaryColorText"
                    value={settings.primaryColor}
                    onChange={handleChange}
                    name="primaryColor"
                    className={`ml-2 w-full p-2 border ${
                      errors.primaryColor
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md dark:bg-gray-700`}
                    aria-label="Color hex code"
                    placeholder="#RRGGBB"
                  />
                </div>
                {errors.primaryColor && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.primaryColor}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Select a color or enter a hex color code (e.g., #3B82F6)
                </p>
              </div>
            </div>

            <fieldset className="border p-4 rounded-md dark:border-gray-700">
              <legend className="px-2 font-medium text-gray-900 dark:text-white">
                Currency Settings
              </legend>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="currencySymbol"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    id="currencySymbol"
                    name="currencySymbol"
                    value={settings.currencySymbol}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.currencySymbol
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md dark:bg-gray-700`}
                  />
                  {errors.currencySymbol && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currencySymbol}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="currencyCode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Currency Code
                  </label>
                  <select
                    id="currencyCode"
                    name="currencyCode"
                    value={settings.currencyCode}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.currencyCode
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md dark:bg-gray-700`}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                  {errors.currencyCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currencyCode}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="taxRate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Default Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    name="taxRate"
                    value={settings.taxRate}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className={`w-full p-2 border ${
                      errors.taxRate
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md dark:bg-gray-700`}
                  />
                  {errors.taxRate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.taxRate}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Platform Settings Section */}
            <div className="col-span-2 mt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2">
                Platform Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowGuestCheckout"
                  name="allowGuestCheckout"
                  checked={settings.allowGuestCheckout}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="allowGuestCheckout"
                  className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Allow Guest Checkout
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireEmailVerification"
                  name="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="requireEmailVerification"
                  className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Require Email Verification
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="vendorApplicationRequiresApproval"
                  name="vendorApplicationRequiresApproval"
                  checked={settings.vendorApplicationRequiresApproval}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="vendorApplicationRequiresApproval"
                  className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Vendor Applications Require Approval
                </label>
              </div>
            </div>

            <fieldset className="border p-4 rounded-md dark:border-gray-700">
              <legend className="px-2 font-medium text-gray-900 dark:text-white">
                Display Settings
              </legend>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showOutOfStockProducts"
                    name="showOutOfStockProducts"
                    checked={settings.showOutOfStockProducts}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="showOutOfStockProducts"
                    className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Show Out of Stock Products
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="productsPerPage"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Products Per Page
                  </label>
                  <input
                    type="number"
                    id="productsPerPage"
                    name="productsPerPage"
                    value={settings.productsPerPage}
                    onChange={handleChange}
                    min="4"
                    max="100"
                    step="4"
                    className={`w-full p-2 border ${
                      errors.productsPerPage
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md dark:bg-gray-700`}
                  />
                  {errors.productsPerPage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.productsPerPage}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="maintenanceMode"
                    className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Maintenance Mode
                  </label>
                </div>
              </div>
            </fieldset>

            {/* API Settings Section */}
            <div className="col-span-2 mt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2">
                API & Integration Settings
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                API and integration settings can be configured here. This
                section can be expanded to include payment gateway credentials,
                shipping API keys, and other external service integrations.
              </p>
            </div>
          </div>

          {/* Submit buttons at the bottom */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetChanges}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                disabled={
                  JSON.stringify(settings) === JSON.stringify(originalSettings)
                }
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                disabled={
                  loading ||
                  JSON.stringify(settings) === JSON.stringify(originalSettings)
                }
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
