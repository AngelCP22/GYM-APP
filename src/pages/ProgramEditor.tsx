import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Dumbbell, Printer } from 'lucide-react';
import { useStore } from '../store';
import { uid } from '../storage';
import type { Exercise, ExerciseCategory, ExerciseSet, TrainingProgram } from '../types';

const CATEGORIES: { key: ExerciseCategory; label: string; color: string }[] = [
  { key: 'warmup', label: 'Calentamiento', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'core', label: 'Core', color: 'bg-red-100 text-red-700' },
  { key: 'lower', label: 'Tren Inferior', color: 'bg-blue-100 text-blue-700' },
  { key: 'push', label: 'Empuje / Pectorales', color: 'bg-purple-100 text-purple-700' },
  { key: 'pull', label: 'Tracción / Espalda', color: 'bg-green-100 text-green-700' },
  { key: 'cardio', label: 'Cardio', color: 'bg-orange-100 text-orange-700' },
  { key: 'stretch', label: 'Estiramiento', color: 'bg-pink-100 text-pink-700' },
];

export default function ProgramEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useStore((s) => s.currentUser)!;
  const users = useStore((s) => s.users);
  const programs = useStore((s) => s.programs);
  const upsertProgram = useStore((s) => s.upsertProgram);
  const deleteProgram = useStore((s) => s.deleteProgram);

  const existing = id ? programs.find((p) => p.id === id) : null;
  const initialClientId = (location.state as any)?.clientId as string | undefined;
  const readOnly = currentUser.role === 'client';

  const [program, setProgram] = useState<TrainingProgram>(() => {
    if (existing) return { ...existing, exercises: [...existing.exercises] };
    return {
      id: uid('p'),
      name: '',
      clientId: initialClientId ?? '',
      trainerId: currentUser.role === 'trainer' ? currentUser.id : '',
      startDate: new Date().toISOString().slice(0, 10),
      frequency: '',
      objective: '',
      evaluation: { resistance: '', strength: '', flexibility: '', notes: '' },
      exercises: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  useEffect(() => {
    if (id && existing) setProgram({ ...existing, exercises: [...existing.exercises] });
  }, [id, existing]);

  const trainers = users.filter((u) => u.role === 'trainer');
  const availableClients = users.filter((u) => {
    if (u.role !== 'client') return false;
    if (currentUser.role === 'trainer') return u.trainerId === currentUser.id;
    return true;
  });

  const addExercise = (category: ExerciseCategory) => {
    const ex: Exercise = {
      id: uid('e'),
      name: '',
      category,
      sets: [{ reps: '', weight: '', rest: '' }],
    };
    setProgram({ ...program, exercises: [...program.exercises, ex] });
  };

  const updateExercise = (exId: string, patch: Partial<Exercise>) => {
    setProgram({
      ...program,
      exercises: program.exercises.map((e) => (e.id === exId ? { ...e, ...patch } : e)),
    });
  };

  const removeExercise = (exId: string) => {
    setProgram({ ...program, exercises: program.exercises.filter((e) => e.id !== exId) });
  };

  const updateSet = (exId: string, setIdx: number, patch: Partial<ExerciseSet>) => {
    const ex = program.exercises.find((e) => e.id === exId);
    if (!ex) return;
    const newSets = ex.sets.map((s, i) => (i === setIdx ? { ...s, ...patch } : s));
    updateExercise(exId, { sets: newSets });
  };

  const addSet = (exId: string) => {
    const ex = program.exercises.find((e) => e.id === exId);
    if (!ex) return;
    updateExercise(exId, { sets: [...ex.sets, { reps: '', weight: '', rest: '' }] });
  };

  const removeSet = (exId: string, setIdx: number) => {
    const ex = program.exercises.find((e) => e.id === exId);
    if (!ex || ex.sets.length <= 1) return;
    updateExercise(exId, { sets: ex.sets.filter((_, i) => i !== setIdx) });
  };

  const handleSave = () => {
    if (!program.name || !program.clientId || !program.trainerId) {
      alert('Completa nombre, cliente y entrenador.');
      return;
    }
    upsertProgram(program);
    navigate('/programas');
  };

  const handleDelete = () => {
    if (existing && confirm('¿Eliminar este programa?')) {
      deleteProgram(existing.id);
      navigate('/programas');
    }
  };

  const grouped = CATEGORIES.map((c) => ({
    ...c,
    exercises: program.exercises.filter((e) => e.category === c.key),
  }));

  const client = users.find((u) => u.id === program.clientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/programas" className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold flex-1">
          {readOnly ? program.name || 'Programa' : existing ? 'Editar programa' : 'Nuevo programa'}
        </h1>
        <button onClick={() => window.print()} className="btn-ghost">
          <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Imprimir</span>
        </button>
        {!readOnly && existing && (
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 className="w-4 h-4" /> Eliminar
          </button>
        )}
        {!readOnly && (
          <button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4" /> Guardar
          </button>
        )}
      </div>

      <div className="card p-6 bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="grid md:grid-cols-2 gap-4">
          <FieldDark label="Nombre del programa" disabled={readOnly}>
            <input
              className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white"
              value={program.name}
              onChange={(e) => setProgram({ ...program, name: e.target.value })}
              disabled={readOnly}
              placeholder="Ej: Plan hipertrofia fase 1"
            />
          </FieldDark>
          <FieldDark label="Cliente" disabled={readOnly}>
            <select
              className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white"
              value={program.clientId}
              onChange={(e) => setProgram({ ...program, clientId: e.target.value })}
              disabled={readOnly}
            >
              <option value="">Selecciona cliente</option>
              {availableClients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FieldDark>
          {currentUser.role === 'admin' && (
            <FieldDark label="Entrenador">
              <select
                className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white"
                value={program.trainerId}
                onChange={(e) => setProgram({ ...program, trainerId: e.target.value })}
                disabled={readOnly}
              >
                <option value="">Selecciona</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </FieldDark>
          )}
          <FieldDark label="Fecha inicio" disabled={readOnly}>
            <input
              type="date"
              className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white"
              value={program.startDate}
              onChange={(e) => setProgram({ ...program, startDate: e.target.value })}
              disabled={readOnly}
            />
          </FieldDark>
          <FieldDark label="Frecuencia" disabled={readOnly}>
            <input
              className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white"
              value={program.frequency ?? ''}
              onChange={(e) => setProgram({ ...program, frequency: e.target.value })}
              disabled={readOnly}
              placeholder="Ej: 4x semana"
            />
          </FieldDark>
          <FieldDark label="Objetivo" disabled={readOnly}>
            <input
              className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white"
              value={program.objective ?? ''}
              onChange={(e) => setProgram({ ...program, objective: e.target.value })}
              disabled={readOnly}
            />
          </FieldDark>
        </div>
        {client && readOnly && (
          <div className="mt-4 pt-4 border-t border-ink-700 text-sm text-neutral-300">
            Programado por tu entrenador
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Evaluación física</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label">Resistencia</label>
            <input
              className="input"
              value={program.evaluation?.resistance ?? ''}
              onChange={(e) => setProgram({ ...program, evaluation: { ...program.evaluation, resistance: e.target.value } })}
              disabled={readOnly}
            />
          </div>
          <div>
            <label className="label">Fuerza</label>
            <input
              className="input"
              value={program.evaluation?.strength ?? ''}
              onChange={(e) => setProgram({ ...program, evaluation: { ...program.evaluation, strength: e.target.value } })}
              disabled={readOnly}
            />
          </div>
          <div>
            <label className="label">Flexibilidad</label>
            <input
              className="input"
              value={program.evaluation?.flexibility ?? ''}
              onChange={(e) => setProgram({ ...program, evaluation: { ...program.evaluation, flexibility: e.target.value } })}
              disabled={readOnly}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Observaciones</label>
          <textarea
            className="input min-h-[70px]"
            value={program.evaluation?.notes ?? ''}
            onChange={(e) => setProgram({ ...program, evaluation: { ...program.evaluation, notes: e.target.value } })}
            disabled={readOnly}
          />
        </div>
      </div>

      {grouped.map((cat) => (
        <div key={cat.key} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${cat.color}`}>
                {cat.label}
              </div>
              <span className="text-sm text-ink-500">{cat.exercises.length} ejercicios</span>
            </div>
            {!readOnly && (
              <button onClick={() => addExercise(cat.key)} className="btn-ghost">
                <Plus className="w-4 h-4" /> Agregar
              </button>
            )}
          </div>

          <div className="space-y-3">
            {cat.exercises.map((ex) => (
              <div key={ex.id} className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <div className="flex items-start gap-2 mb-3">
                  <Dumbbell className="w-5 h-5 text-brand-600 mt-2 flex-shrink-0" />
                  <input
                    className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-2 font-semibold"
                    placeholder="Nombre del ejercicio"
                    value={ex.name}
                    onChange={(e) => updateExercise(ex.id, { name: e.target.value })}
                    disabled={readOnly}
                  />
                  {!readOnly && (
                    <button onClick={() => removeExercise(ex.id)} className="btn-danger p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-ink-500">
                        <th className="text-left pb-2 w-10">#</th>
                        <th className="text-left pb-2">Reps</th>
                        <th className="text-left pb-2">Peso</th>
                        <th className="text-left pb-2">Descanso</th>
                        <th className="text-left pb-2">Notas</th>
                        {!readOnly && <th className="w-10"></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {ex.sets.map((s, i) => (
                        <tr key={i}>
                          <td className="py-1 pr-2 font-bold text-ink-500">{i + 1}</td>
                          <td className="py-1 pr-2">
                            <input
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1.5"
                              value={s.reps ?? ''}
                              onChange={(e) => updateSet(ex.id, i, { reps: e.target.value })}
                              disabled={readOnly}
                              placeholder="12"
                            />
                          </td>
                          <td className="py-1 pr-2">
                            <input
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1.5"
                              value={s.weight ?? ''}
                              onChange={(e) => updateSet(ex.id, i, { weight: e.target.value })}
                              disabled={readOnly}
                              placeholder="20 kg"
                            />
                          </td>
                          <td className="py-1 pr-2">
                            <input
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1.5"
                              value={s.rest ?? ''}
                              onChange={(e) => updateSet(ex.id, i, { rest: e.target.value })}
                              disabled={readOnly}
                              placeholder="60s"
                            />
                          </td>
                          <td className="py-1 pr-2">
                            <input
                              className="w-full bg-white border border-neutral-300 rounded px-2 py-1.5"
                              value={s.notes ?? ''}
                              onChange={(e) => updateSet(ex.id, i, { notes: e.target.value })}
                              disabled={readOnly}
                            />
                          </td>
                          {!readOnly && (
                            <td className="py-1">
                              <button
                                onClick={() => removeSet(ex.id, i)}
                                disabled={ex.sets.length <= 1}
                                className="text-red-500 hover:text-red-700 disabled:opacity-30 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!readOnly && (
                  <button
                    onClick={() => addSet(ex.id)}
                    className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    + Agregar serie
                  </button>
                )}
              </div>
            ))}
            {cat.exercises.length === 0 && (
              <div className="text-center text-ink-500 py-6 text-sm">Sin ejercicios en esta categoría.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldDark({ label, children }: { label: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{label}</label>
      {children}
    </div>
  );
}
