import { useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import useProjects from '../hooks/useProjects';
import styles from './Dashboard.module.css';

const MemoizedSidebar = memo(Sidebar);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects, columns, loading, error, addProject, renameProject } = useProjects();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const saving = false;

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  // Dans Dashboard, ajoutez ce test temporaire :
  const dangerousName = '<img src=x onerror=alert("HACK")>';

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={user?.name}
        onLogout={() => dispatch(logout())}
      />
      <div className={styles.body}>
        <MemoizedSidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={renameProject}
        />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel={saving ? 'Enregistrement...' : 'Créer'}
                onSubmit={async (name, color) => {
                  await addProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          {error && <div className={styles.error}>{error}</div>}
          {/* Affichez-le dans le JSX : */}
          <p>{dangerousName}</p>
          {/* 
          ❌ NE FAITES JAMAIS ÇA avec des données utilisateur : */}
          <div dangerouslySetInnerHTML={{ __html: dangerousName }} />
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
