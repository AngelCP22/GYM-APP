import { useState } from 'react';
import { Save, Palette, Building, RefreshCw, Download, Upload } from 'lucide-react';
import { useStore } from '../store';
import { storage } from '../storage';

const PRESET_COLORS = [
  { name: 'Amarillo (por defecto)', value: '#FACC15' },
  { name: 'Rojo energía', value: '#EF4444' },
  { name: 'Azul acero', value: '#3B82F6' },
  { name: 'Verde fit', value: '#10B981' },
  { name: 'Naranja fuego', value: '#F97316' },
  { name: 'Morado royal', value: '#8B5CF6' },
  { name: 'Rosa power', value: '#EC4899' },
  { name: 'Turquesa', value: '#14B8A6' },
];

export default function Settings() {
  const branding = useStore((s) => s.branding);
  const updateBranding = useStore((s) => s.updateBranding);
  const [form, setForm] = useState(branding);
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm('¿Restablecer toda la información? Esto eliminará usuarios, clientes, mediciones y programas y cargará datos demo.')) {
      storage.reset();
      window.location.reload();
    }
  };

  const handleExport = () => {
    const data = {
      users: storage.getUsers(),
      profiles: storage.getProfiles(),
      measurements: storage.getMeasurements(),
      programs: storage.getPrograms(),
      branding: storage.getBranding(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!confirm('¿Importar estos datos? Se sobreescribirá toda la información actual.')) return;
        if (data.users) storage.setUsers(data.users);
        if (data.profiles) storage.setProfiles(data.profiles);
        if (data.measurements) storage.setMeasurements(data.measurements);
        if (data.programs) storage.setPrograms(data.programs);
        if (data.branding) storage.setBranding(data.branding);
        window.location.reload();
      } catch {
        alert('Archivo inválido');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Ajustes</h1>
        <p className="text-ink-500 mt-1">Personaliza tu gimnasio</p>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Building className="w-5 h-5 text-brand-600" /> Identidad del gimnasio
        </div>
        <div>
          <label className="label">Nombre del gimnasio</label>
          <input
            className="input"
            value={form.gymName}
            onChange={(e) => setForm({ ...form, gymName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Mensaje de bienvenida</label>
          <input
            className="input"
            value={form.welcomeMessage ?? ''}
            onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
          />
        </div>
        <div>
          <label className="label">URL del logo (opcional)</label>
          <input
            className="input"
            value={form.logoUrl ?? ''}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className="pt-5 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-lg font-bold mb-3">
            <Palette className="w-5 h-5 text-brand-600" /> Color principal
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm({ ...form, primaryColor: c.value })}
                className={`h-12 rounded-lg border-2 transition ${
                  form.primaryColor === c.value ? 'border-ink-900 scale-110' : 'border-neutral-200'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
              className="h-10 w-20 rounded border border-neutral-300"
            />
            <input
              className="input flex-1"
              value={form.primaryColor}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          {saved && <span className="text-sm text-green-600 font-semibold">✓ Guardado</span>}
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" /> Guardar cambios
          </button>
        </div>
      </form>

      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-bold">Copia de seguridad</h3>
        <p className="text-sm text-ink-500">
          Exporta un archivo JSON con todos los datos del sistema o impórtalo en otra instancia.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary">
            <Download className="w-4 h-4" /> Exportar datos
          </button>
          <label className="btn-ghost cursor-pointer">
            <Upload className="w-4 h-4" /> Importar datos
            <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      <div className="card p-6 space-y-4 border-red-200">
        <h3 className="text-lg font-bold text-red-700">Zona peligrosa</h3>
        <p className="text-sm text-ink-500">
          Restablece todos los datos y vuelve al estado demo inicial. Esta acción no se puede deshacer.
        </p>
        <button onClick={handleReset} className="btn-danger border border-red-300">
          <RefreshCw className="w-4 h-4" /> Restablecer datos demo
        </button>
      </div>
    </div>
  );
}
