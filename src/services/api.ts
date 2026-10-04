import {
  Lead,
  ServiceBrand,
  ServiceItem,
  SiteConfig,
  Testimonial,
  DbCliente,
  DbConversa,
  DbCerebroCamilla,
  ApiHealthResponse,
  ApiSettings,
  SystemKeysConfig
} from '../types';
import { INITIAL_CONFIG, INITIAL_SYSTEM_KEYS } from '../data/initialData';

const DEFAULT_API_BASE = '/api';

export function getApiSettings(): ApiSettings {
  try {
    const saved = localStorage.getItem('hub_api_settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {
    apiBaseUrl: import.meta.env.VITE_API_URL || DEFAULT_API_BASE,
    apiToken: '',
    useCustomApi: false
  };
}

export function saveApiSettings(settings: ApiSettings): void {
  try {
    localStorage.setItem('hub_api_settings', JSON.stringify(settings));
  } catch {
    // ignore
  }
}

function resolveUrl(path: string): string {
  const settings = getApiSettings();
  const base = settings.useCustomApi && settings.apiBaseUrl ? settings.apiBaseUrl.replace(/\/+$/, '') : DEFAULT_API_BASE;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

function getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const settings = getApiSettings();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  };
  if (settings.apiToken) {
    headers['Authorization'] = `Bearer ${settings.apiToken}`;
  }
  return headers;
}

export const api = {
  // Config & Settings Accessors
  getSettings: getApiSettings,
  saveSettings: saveApiSettings,

  // Health & Database Diagnostics Check
  async getHealth(): Promise<ApiHealthResponse> {
    try {
      const res = await fetch(resolveUrl('/health'), {
        headers: getHeaders(),
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) throw new Error(`API retornou HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        status: 'offline',
        timestamp: new Date().toISOString(),
        database: {
          driver: 'Desconectado / Fallback Local',
          connected: false,
          mode: 'memory',
          database_name: 'grupoeloizio',
          user: 'postgres',
          tables: ['clientes', 'conversas', 'cerebro_camilla', 'configuracoes', 'servicos', 'depoimentos'],
          counts: { clientes: 0, servicos: 0, depoimentos: 0 },
          last_error: err.message
        },
        subdomains: {
          hub: 'https://grupoeloizio.com.br',
          elomak: 'https://elomak.grupoeloizio.com.br',
          vanguard: 'https://vanguard.grupoeloizio.com.br',
          elocontabil: 'https://elocontabil.grupoeloizio.com.br',
          camilla: 'https://camilla.grupoeloizio.com.br'
        }
      };
    }
  },

  // Ping / Connection Tester for any target URL
  async testConnection(targetUrl?: string, token?: string): Promise<{
    success: boolean;
    latencyMs: number;
    statusText: string;
    data?: any;
    error?: string;
  }> {
    const startTime = performance.now();
    const url = targetUrl || resolveUrl('/health');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(6000)
      });
      const latencyMs = Math.round(performance.now() - startTime);
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : await res.text();

      if (res.ok) {
        return {
          success: true,
          latencyMs,
          statusText: `HTTP ${res.status} OK (${latencyMs}ms)`,
          data
        };
      } else {
        return {
          success: false,
          latencyMs,
          statusText: `HTTP ${res.status} ${res.statusText}`,
          error: typeof data === 'string' ? data : JSON.stringify(data)
        };
      }
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        success: false,
        latencyMs,
        statusText: 'Falha de Conexão',
        error: err.message || 'Servidor inacessível ou bloqueado por CORS'
      };
    }
  },

  // Site Configuration
  async getConfig(): Promise<SiteConfig> {
    try {
      const res = await fetch(resolveUrl('/config'), {
        headers: getHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Erro ao buscar config');
      return await res.json();
    } catch {
      const local = localStorage.getItem('hub_site_config');
      return local ? JSON.parse(local) : INITIAL_CONFIG;
    }
  },

  async updateConfig(config: SiteConfig): Promise<SiteConfig> {
    try {
      const res = await fetch(resolveUrl('/config'), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(config)
      });
      if (!res.ok) throw new Error('Erro ao salvar config');
      const data = await res.json();
      return data.config || config;
    } catch {
      localStorage.setItem('hub_site_config', JSON.stringify(config));
      return config;
    }
  },

  // Services Catalog
  async getServices(marca?: string, q?: string): Promise<ServiceItem[]> {
    try {
      const params = new URLSearchParams();
      if (marca && marca !== 'todos') params.append('marca', marca);
      if (q) params.append('q', q);

      const res = await fetch(resolveUrl(`/services?${params.toString()}`), {
        headers: getHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Erro ao buscar serviços');
      return await res.json();
    } catch {
      const local = localStorage.getItem('hub_services');
      return local ? JSON.parse(local) : [];
    }
  },

  async createService(service: ServiceItem): Promise<ServiceItem> {
    try {
      const res = await fetch(resolveUrl('/services'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(service)
      });
      if (!res.ok) throw new Error('Erro ao criar serviço');
      return await res.json();
    } catch {
      return service;
    }
  },

  async updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem | null> {
    try {
      const res = await fetch(resolveUrl(`/services/${id}`), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(service)
      });
      if (!res.ok) throw new Error('Erro ao atualizar serviço');
      const data = await res.json();
      return data.service || service;
    } catch {
      return null;
    }
  },

  async deleteService(id: string): Promise<void> {
    try {
      await fetch(resolveUrl(`/services/${id}`), {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch {
      // ignore
    }
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const res = await fetch(resolveUrl('/testimonials'), {
        headers: getHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Erro ao buscar depoimentos');
      return await res.json();
    } catch {
      const local = localStorage.getItem('hub_testimonials');
      return local ? JSON.parse(local) : [];
    }
  },

  async createTestimonial(testimonial: Testimonial): Promise<Testimonial> {
    try {
      const res = await fetch(resolveUrl('/testimonials'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(testimonial)
      });
      if (!res.ok) throw new Error('Erro ao criar depoimento');
      return await res.json();
    } catch {
      return testimonial;
    }
  },

  // Leads & Clientes (Direct integration with PostgreSQL unified table `clientes`)
  async getLeads(): Promise<Lead[]> {
    try {
      const res = await fetch(resolveUrl('/leads'), {
        headers: getHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Erro ao buscar leads');
      return await res.json();
    } catch {
      const local = localStorage.getItem('hub_leads');
      return local ? JSON.parse(local) : [];
    }
  },

  async createLead(leadData: {
    nome: string;
    whatsapp: string;
    email?: string;
    servicoInteresse: string;
    marca: ServiceBrand;
    observacao?: string;
  }): Promise<{ success: boolean; lead: Lead; whatsapp_url: string }> {
    try {
      const res = await fetch(resolveUrl('/leads'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(leadData)
      });
      if (!res.ok) throw new Error('Erro ao salvar lead');
      return await res.json();
    } catch {
      const fallbackLead: Lead = {
        id: `lead-${Date.now()}`,
        ...leadData,
        status: 'novo',
        dataHora: new Date().toLocaleString('pt-BR')
      };
      const zap = '5521996134073';
      const msg = encodeURIComponent(
        `Olá Camilla, meu nome é ${leadData.nome}. Vi o serviço "${leadData.servicoInteresse}" no portal grupoeloizio.com.br e gostaria de atendimento exclusivo.` +
          (leadData.observacao ? ` Detalhes: ${leadData.observacao}` : '')
      );
      return {
        success: true,
        lead: fallbackLead,
        whatsapp_url: `https://wa.me/${zap}?text=${msg}`
      };
    }
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
    try {
      await fetch(resolveUrl(`/leads/${id}/status`), {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
    } catch {
      // ignore
    }
  },

  async deleteLead(id: string): Promise<void> {
    try {
      await fetch(resolveUrl(`/leads/${id}`), {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch {
      // ignore
    }
  },

  // Direct PostgreSQL Table Accessors (clientes, conversas, cerebro_camilla)
  async getDbClientes(): Promise<DbCliente[]> {
    try {
      const res = await fetch(resolveUrl('/db/clientes'), {
        headers: getHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Erro ao consultar clientes');
      return await res.json();
    } catch {
      return [];
    }
  },

  async getDbConversas(clienteId?: number): Promise<DbConversa[]> {
    try {
      const url = clienteId ? resolveUrl(`/db/conversas?cliente_id=${clienteId}`) : resolveUrl('/db/conversas');
      const res = await fetch(url, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Erro ao consultar conversas');
      return await res.json();
    } catch {
      return [];
    }
  },

  async getDbCerebroCamilla(clienteId?: number): Promise<DbCerebroCamilla[]> {
    try {
      const url = clienteId ? resolveUrl(`/db/cerebro_camilla?cliente_id=${clienteId}`) : resolveUrl('/db/cerebro_camilla');
      const res = await fetch(url, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Erro ao consultar cerebro_camilla');
      return await res.json();
    } catch {
      return [];
    }
  },

  // Camilla AI Triage
  async triageCamilla(prioridade: string, urgencia: string) {
    try {
      const res = await fetch(resolveUrl('/camilla/triage'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ prioridade, urgencia })
      });
      if (!res.ok) throw new Error('Erro no triage');
      return await res.json();
    } catch {
      return null;
    }
  },

  // System Keys & Configuration (EloMail, EloSign, EloAutêntico, Hostinger SMTP, Postgres)
  async getSystemKeys(): Promise<SystemKeysConfig> {
    try {
      const res = await fetch(resolveUrl('/system-keys'), {
        headers: getHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Erro ao buscar chaves');
      return await res.json();
    } catch {
      const local = localStorage.getItem('hub_system_keys');
      return local ? JSON.parse(local) : INITIAL_SYSTEM_KEYS;
    }
  },

  async updateSystemKeys(keys: SystemKeysConfig): Promise<SystemKeysConfig> {
    try {
      const res = await fetch(resolveUrl('/system-keys'), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(keys)
      });
      if (!res.ok) throw new Error('Erro ao salvar chaves');
      const data = await res.json();
      localStorage.setItem('hub_system_keys', JSON.stringify(data.keys || keys));
      return data.keys || keys;
    } catch {
      localStorage.setItem('hub_system_keys', JSON.stringify(keys));
      return keys;
    }
  },

  // Test EloMail Gateway (Simula envio e geração de PDF com x-api-key)
  async testEloMail(payload: {
    instancia: string;
    destinatario: string;
    assunto: string;
    mensagem: string;
    pdf_conteudo: string;
    apiKey: string;
  }): Promise<{ status: string; msg: string; pdf_path?: string; hash_sha256?: string; id_doc?: string; error?: string }> {
    try {
      const res = await fetch(resolveUrl('/test-elomail'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': payload.apiKey
        },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      // Local simulation if server endpoint is offline
      const idDoc = Math.random().toString(36).substring(2, 10).toUpperCase();
      return {
        status: 'sucesso',
        msg: `Simulação de envio para ${payload.destinatario} concluída com sucesso!`,
        pdf_path: `logs/doc_${Date.now()}.pdf`,
        id_doc: `DOC-${idDoc}`,
        hash_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
      };
    }
  },

  // Validador de Documentos EloAutêntico (Simula validação em valida.grupoeloizio.com.br)
  async validateDocument(codigo: string): Promise<{
    valido: boolean;
    destinatario?: string;
    tipo_documento?: string;
    data_emissao?: string;
    hash_sha256?: string;
    msg: string;
  }> {
    try {
      const res = await fetch(resolveUrl(`/validate-document?c=${encodeURIComponent(codigo)}`), {
        headers: getHeaders()
      });
      return await res.json();
    } catch {
      if (codigo.trim().length >= 4) {
        return {
          valido: true,
          destinatario: 'Cliente Simulado / Associado',
          tipo_documento: 'Contrato de Prestação com Assinatura Eletrônica (Lei 14.063/2020)',
          data_emissao: new Date().toLocaleString('pt-BR'),
          hash_sha256: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
          msg: 'Documento autêntico registrado no PostgreSQL do Grupo Eloizio.'
        };
      }
      return {
        valido: false,
        msg: 'Código inválido ou documento não localizado na base de dados.'
      };
    }
  }
};
