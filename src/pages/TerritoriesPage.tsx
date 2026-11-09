import { Link, useNavigate } from 'react-router-dom';

import { useIsAdmin } from '../features/auth';
import { CreateTerritoryPlanForm, TerritoryPlansList } from '../features/territories';

export function TerritoriesPage() {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-ink m-0">Territories</h1>
        {isAdmin && (
          <Link to="/quantum" className="btn btn--secondary">
            ⚛️ Quantum lab
          </Link>
        )}
      </div>

      <CreateTerritoryPlanForm onCreated={(plan) => navigate(`/territories/${plan.id}`)} />

      <h2 className="text-lg font-semibold text-ink m-0">Plans</h2>
      <TerritoryPlansList />
    </div>
  );
}
