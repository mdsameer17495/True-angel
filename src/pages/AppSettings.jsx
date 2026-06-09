import React from 'react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import { useSettingsStore } from '../store';
import { Sun, Moon, Type, Eye } from 'lucide-react';
import './AppSettings.css';

export default function AppSettings() {
  const { theme, fontSize, contrast, setTheme, toggleLargeText, toggleHighContrast } = useSettingsStore();

  return (
    <>
      <Header title="App Settings" showBack />
      <div className="settings-container animate-fadeInUp">
        
        {/* Appearance Section */}
        <section className="settings-section">
          <h3 className="text-label mb-sm">Appearance</h3>
          
          <Card className="settings-card flex-col gap-md">
            
            {/* Theme Selector */}
            <div className="settings-item flex-between gap-md">
              <div className="flex gap-sm">
                <div className="settings-icon bg-primary-light text-primary-dark">
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-body">App Theme</h4>
                  <p className="text-caption">Choose between light and dark modes</p>
                </div>
              </div>
              <div className="segmented-control">
                <button 
                  className={`segment-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  Light
                </button>
                <button 
                  className={`segment-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </button>
              </div>
            </div>

            <hr className="settings-divider" />

            {/* Font Size Toggle */}
            <div className="settings-item flex-between gap-md">
              <div className="flex gap-sm">
                <div className="settings-icon bg-info-light text-info">
                  <Type size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-body">Large Text</h4>
                  <p className="text-caption">Increase readability across screens</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={fontSize === 'large'} 
                  onChange={toggleLargeText} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <hr className="settings-divider" />

            {/* High Contrast Toggle */}
            <div className="settings-item flex-between gap-md">
              <div className="flex gap-sm">
                <div className="settings-icon bg-warning-light text-warning-dark">
                  <Eye size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-body">High Contrast</h4>
                  <p className="text-caption">Make UI elements stand out more</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={contrast === 'high'} 
                  onChange={toggleHighContrast} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

          </Card>
        </section>

        {/* System Info Section */}
        <section className="settings-section mt-lg">
          <h3 className="text-label mb-sm">System & Build</h3>
          <Card className="settings-card flex-col gap-md">
            <div className="flex-between">
              <span className="text-secondary">App Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex-between">
              <span className="text-secondary">Environment</span>
              <span className="font-medium">Production (SQLite Local)</span>
            </div>
            <div className="flex-between">
              <span className="text-secondary">Secure Encryption</span>
              <span className="text-success font-medium flex align-center gap-xs">
                Active
              </span>
            </div>
          </Card>
        </section>

      </div>
    </>
  );
}
