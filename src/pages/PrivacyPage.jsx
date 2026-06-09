import React from 'react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import { usePrivacyStore } from '../store';
import { Shield, Database, Eye, CheckCircle2 } from 'lucide-react';
import './PrivacyPage.css';

export default function PrivacyPage() {
  const { analyticsConsent, toggleAnalytics } = usePrivacyStore();

  return (
    <>
      <Header title="Privacy" showBack />
      <div className="privacy-page-container animate-fadeInUp">
        
        {/* Core Policy Card */}
        <section className="privacy-section">
          <Card className="privacy-hero-card bg-primary-light text-primary-dark border-none flex-col gap-sm">
            <div className="flex align-center gap-md">
              <Shield size={28} />
              <h3 className="font-semibold text-body-lg">Privacy First</h3>
            </div>
            <p className="text-secondary text-small">
              True Angel values your safety and security. All care logs, schedules, and profile settings are stored directly on your phone and never sold or shared.
            </p>
          </Card>
        </section>

        {/* Data storage description */}
        <section className="privacy-section mt-lg">
          <h3 className="text-label mb-sm">Local Storage</h3>
          <Card className="flex-col gap-md">
            <div className="flex gap-md align-start">
              <div className="privacy-icon-bg bg-info-light text-info flex-shrink-0">
                <Database size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-body">SQLite Database</h4>
                <p className="text-caption mt-xs text-secondary">
                  Your medicine intake records and alarm configurations reside in a local database file. No external internet connection is required to retrieve or save your daily updates.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Analytics Toggle */}
        <section className="privacy-section mt-lg">
          <h3 className="text-label mb-sm">Preferences</h3>
          <Card className="flex-col gap-md">
            <div className="flex-between gap-md align-start">
              <div className="flex gap-md align-start">
                <div className="privacy-icon-bg bg-warning-light text-warning-dark flex-shrink-0">
                  <Eye size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-body">Anonymous Usage Data</h4>
                  <p className="text-caption mt-xs text-secondary">
                    Send diagnostics to help the development team optimize response time and device battery usage.
                  </p>
                </div>
              </div>
              <label className="toggle-switch mt-xs">
                <input 
                  type="checkbox" 
                  checked={analyticsConsent} 
                  onChange={toggleAnalytics} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </Card>
        </section>

        {/* Your Rights */}
        <section className="privacy-section mt-lg">
          <h3 className="text-label mb-sm">Your Rights</h3>
          <Card className="flex-col gap-sm">
            <div className="flex align-center gap-sm text-secondary text-body-sm">
              <CheckCircle2 size={16} className="text-success" />
              <span>Full control over your scheduling data</span>
            </div>
            <div className="flex align-center gap-sm text-secondary text-body-sm">
              <CheckCircle2 size={16} className="text-success" />
              <span>No third-party advertisements or trackers</span>
            </div>
            <div className="flex align-center gap-sm text-secondary text-body-sm">
              <CheckCircle2 size={16} className="text-success" />
              <span>Encryption of local storage configurations</span>
            </div>
            <div className="flex align-center gap-sm text-secondary text-body-sm">
              <CheckCircle2 size={16} className="text-success" />
              <span>Zero cloud vendor storage hooks</span>
            </div>
          </Card>
        </section>

      </div>
    </>
  );
}
