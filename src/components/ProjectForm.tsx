import { useState } from 'react';

interface ProjectFormProps {
  submitLabel: string;
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
}

export default function ProjectForm({ submitLabel, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#1B8C3E');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(name, color);
    setName('');
    setColor('#1B8C3E');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Nom du projet"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
      />
      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
        style={{ width: '3rem', height: '3rem', border: 'none', background: 'none', cursor: 'pointer' }}
      />
      <button type="submit" style={{ padding: '0.75rem 1rem', background: '#1B8C3E', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        {submitLabel}
      </button>
      <button type="button" onClick={onCancel} style={{ padding: '0.75rem 1rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Annuler
      </button>
    </form>
  );
}
