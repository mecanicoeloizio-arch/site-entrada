import React, { useState, useEffect } from 'react';
import { Lead, ServiceBrand, ServiceItem, SiteConfig, Testimonial } from './types';
import {
  INITIAL_CONFIG,
  INITIAL_LEADS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS
} from './data/initialData';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyAndWhatSection } from './components/WhyAndWhatSection';
import { RoiRiskCalculator } from './components/RoiRiskCalculator';
import { NeedFinder } from './components/NeedFinder';
import { MiniShopping } from './components/MiniShopping';
import { DataTrustWall } from './components/DataTrustWall';
import { SeoLocalBanner } from './components/SeoLocalBanner';
import { CamillaWidget } from './components/CamillaWidget';
import { LeadModal } from './components/LeadModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SystemConfigPage } from './components/SystemConfigPage';
import { Footer } from './components/Footer';

export default function App() {
  // Persistence state
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('hub_site_config');
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('hub_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('hub_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('hub_testimonials');
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  const [apiHealth, setApiHealth] = useState<any>(null);

  // UI state
  const [activeFilter, setActiveFilter] = useState<'todos' | ServiceBrand>('todos');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [leadModal, setLeadModal] = useState<{ isOpen: boolean; serviceTitle: string }>({
    isOpen: false,
    serviceTitle: ''
  });

  // Load from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [health, conf, srvs, lds, tm] = await Promise.all([
          api.getHealth(),
          api.getConfig(),
          api.getServices(),
          api.getLeads(),
          api.getTestimonials()
        ]);

        if (health) setApiHealth(health);
        if (conf) setConfig(conf);
        if (srvs && srvs.length > 0) setServices(srvs);
        if (lds && lds.length > 0) setLeads(lds);
        if (tm && tm.length > 0) setTestimonials(tm);
      } catch {
        // use local cache
      }
    }
    loadData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hub_site_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('hub_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('hub_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('hub_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Sync dynamic CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (config.corPrimaria) root.style.setProperty('--neon-primary', config.corPrimaria);
    if (config.corSecundaria) root.style.setProperty('--neon-secondary', config.corSecundaria);
    if (config.corFundo) root.style.setProperty('--bg-dark', config.corFundo);
    if (config.siteTitulo) document.title = config.siteTitulo;
  }, [config]);

  const handleOpenLeadModal = (serviceTitle: string) => {
    setLeadModal({ isOpen: true, serviceTitle });
  };

  const handleCloseLeadModal = () => {
    setLeadModal({ isOpen: false, serviceTitle: '' });
  };

  const handleSubmitLead = async (newLeadData: Omit<Lead, 'id' | 'dataHora' | 'status'>) => {
    const res = await api.createLead(newLeadData);
    if (res && res.lead) {
      setLeads((prev) => [res.lead, ...prev]);
    } else {
      const newLead: Lead = {
        ...newLeadData,
        id: `lead-${Date.now()}`,
        dataHora: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        status: 'novo'
      };
      setLeads((prev) => [newLead, ...prev]);
    }
  };

  const handleUpdateConfig = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    await api.updateConfig(newConfig);
  };

  const handleUpdateServices = (newServices: ServiceItem[]) => {
    setServices(newServices);
  };

  const handleUpdateLeads = (newLeads: Lead[]) => {
    setLeads(newLeads);
  };

  const handleUpdateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
  };

  const handleResetDefaults = () => {
    if (confirm('Tem certeza de que deseja restaurar as configurações e dados de fábrica?')) {
      setConfig(INITIAL_CONFIG);
      setServices(INITIAL_SERVICES);
      setLeads(INITIAL_LEADS);
      setTestimonials(INITIAL_TESTIMONIALS);
      localStorage.removeItem('hub_site_config');
      localStorage.removeItem('hub_services');
      localStorage.removeItem('hub_leads');
      localStorage.removeItem('hub_testimonials');
    }
  };

  const handleFilterCategory = (brand: ServiceBrand) => {
    setActiveFilter(brand);
  };

  const handleScrollToShopping = () => {
    const el = document.getElementById('shopping');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* If System Configuration & Services Page is active */}
      {isConfigOpen ? (
        <SystemConfigPage
          config={config}
          services={services}
          onUpdateServices={handleUpdateServices}
          onClose={() => setIsConfigOpen(false)}
          onOpenLeadModal={handleOpenLeadModal}
        />
      ) : isAdminOpen ? (
        /* If Admin Dashboard is active */
        <AdminDashboard
          config={config}
          services={services}
          leads={leads}
          testimonials={testimonials}
          apiHealth={apiHealth}
          onUpdateConfig={handleUpdateConfig}
          onUpdateServices={handleUpdateServices}
          onUpdateLeads={handleUpdateLeads}
          onUpdateTestimonials={handleUpdateTestimonials}
          onResetDefaults={handleResetDefaults}
          onCloseAdmin={() => setIsAdminOpen(false)}
          onOpenConfig={() => setIsConfigOpen(true)}
        />
      ) : (
        /* Public Mini Shopping & Hub Experience */
        <>
          <Navbar
            config={config}
            isAdminOpen={isAdminOpen}
            onToggleAdmin={() => setIsAdminOpen(true)}
            onOpenConfig={() => setIsConfigOpen(true)}
            onOpenLeadModal={handleOpenLeadModal}
          />

          <main className="flex-1">
            <Hero
              config={config}
              onExploreShopping={handleScrollToShopping}
              onOpenLeadModal={handleOpenLeadModal}
            />

            {/* Neuromarketing: O Porquê e Pra Quê de Cada Solução */}
            <WhyAndWhatSection
              config={config}
              onOpenLeadModal={handleOpenLeadModal}
              onFilterCategory={handleFilterCategory}
            />

            {/* Calculadora Interativa de Risco vs Economia */}
            <RoiRiskCalculator
              config={config}
              onOpenLeadModal={handleOpenLeadModal}
            />

            <NeedFinder
              config={config}
              onFilterCategory={handleFilterCategory}
              onOpenLeadModal={handleOpenLeadModal}
            />

            <MiniShopping
              services={services}
              config={config}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenLeadModal={handleOpenLeadModal}
            />

            <DataTrustWall testimonials={testimonials} />

            <SeoLocalBanner onOpenLeadModal={handleOpenLeadModal} />
          </main>

          <Footer
            config={config}
            onToggleAdmin={() => setIsAdminOpen(true)}
            onOpenConfig={() => setIsConfigOpen(true)}
            onOpenLeadModal={handleOpenLeadModal}
          />

          {/* Floating Concierge Camilla Widget */}
          <CamillaWidget config={config} onOpenLeadModal={handleOpenLeadModal} />

          {/* Lead Capture Modal with WhatsApp Forwarding */}
          <LeadModal
            isOpen={leadModal.isOpen}
            serviceTitle={leadModal.serviceTitle}
            config={config}
            onClose={handleCloseLeadModal}
            onSubmitLead={handleSubmitLead}
          />
        </>
      )}
    </div>
  );
}
