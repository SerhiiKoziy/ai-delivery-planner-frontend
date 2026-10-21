import { useState } from 'react';

import { Button, Card } from '../../../components/shared';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { useDeliveries } from '../../deliveries';
import { useQuantumSummary } from '../../quantum';
import { useVehicles } from '../../vehicles';
import { useCreateTerritoryPlan } from '../api/useCreateTerritoryPlan';
import { SOLVER_LABELS, SOLVERS } from '../constants';
import type { TerritoryBalanceBy, TerritoryPlan, TerritorySolver } from '../types';

const MAX_VEHICLES = 32;

interface Props {
  onCreated?: (plan: TerritoryPlan) => void;
}

export function CreateTerritoryPlanForm({ onCreated }: Props) {
  const { data: deliveries = [], isLoading: deliveriesLoading } = useDeliveries();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const { data: summary } = useQuantumSummary();
  const createPlan = useCreateTerritoryPlan();

  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [solver, setSolver] = useState<TerritorySolver>('quantum_simulator');
  const [balanceBy, setBalanceBy] = useState<TerritoryBalanceBy>('stops');
  const [qaoaReps, setQaoaReps] = useState(2);
  const [shots, setShots] = useState(2048);

  const geocoded = deliveries.filter((d) => d.latitude != null && d.longitude != null);
  const isQuantum = solver !== 'classical';
  const solverAvailable = (s: TerritorySolver) => summary?.solvers[s]?.available ?? true;

  const toggleVehicle = (id: string) => {
    setVehicleIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicleIds.length === 0 || geocoded.length === 0) return;
    createPlan.mutate(
      {
        delivery_ids: geocoded.map((d) => d.id),
        // Keep the vehicles' list order so zone i is the i-th vehicle on screen.
        vehicle_ids: vehicles.filter((v) => vehicleIds.includes(v.id)).map((v) => v.id),
        solver,
        balance_by: balanceBy,
        qaoa_reps: qaoaReps,
        shots,
      },
      { onSuccess: (plan) => onCreated?.(plan) },
    );
  };

  return (
    <Card title="Calculate zones">
      <p className="text-sm text-ink-muted mt-0 mb-4">
        One zone per vehicle, balanced by stops or weight. Each bisection step is solved exactly
        classically; a quantum solver also runs QAOA and its answer is used only when it matches
        the classical optimum, so a plan is never worse than classical.
      </p>

      {createPlan.isError && (
        <div className="form-error">
          {getApiErrorMessage(createPlan.error, 'Failed to calculate territories.')}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4">
          <div className="field">
            <label htmlFor="tp-solver">Solver</label>
            <select
              id="tp-solver"
              value={solver}
              onChange={(e) => setSolver(e.target.value as TerritorySolver)}
            >
              {SOLVERS.map((s) => (
                <option
                  key={s}
                  value={s}
                  disabled={!solverAvailable(s)}
                  title={summary?.solvers[s]?.reason ?? undefined}
                >
                  {SOLVER_LABELS[s]}
                  {solverAvailable(s) ? '' : ' — unavailable'}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="tp-balance">Balance by</label>
            <select
              id="tp-balance"
              value={balanceBy}
              onChange={(e) => setBalanceBy(e.target.value as TerritoryBalanceBy)}
            >
              <option value="stops">Number of stops</option>
              <option value="weight">Weight</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="tp-reps">QAOA layers (p)</label>
            <input
              id="tp-reps"
              type="number"
              min={1}
              max={5}
              value={qaoaReps}
              disabled={!isQuantum}
              onChange={(e) => setQaoaReps(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="tp-shots">Shots</label>
            <input
              id="tp-shots"
              type="number"
              min={100}
              max={20000}
              step={100}
              value={shots}
              disabled={!isQuantum}
              onChange={(e) => setShots(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="field">
          <label>Vehicles (one zone each) *</label>
          {vehiclesLoading ? (
            <p className="text-sm text-ink-muted">Loading vehicles…</p>
          ) : vehicles.length === 0 ? (
            <span className="field__error">No vehicles yet — create one first.</span>
          ) : (
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {vehicles.map((vehicle) => (
                <label key={vehicle.id} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    style={{ width: 'auto' }}
                    checked={vehicleIds.includes(vehicle.id)}
                    disabled={!vehicleIds.includes(vehicle.id) && vehicleIds.length >= MAX_VEHICLES}
                    onChange={() => toggleVehicle(vehicle.id)}
                  />
                  {vehicle.plate_number}
                </label>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm text-ink-muted mb-4">
          {deliveriesLoading
            ? 'Loading deliveries…'
            : `Uses all geocoded deliveries: ${geocoded.length} of ${deliveries.length}.`}
          {solver === 'ibm_quantum' && ' A real QPU run can take minutes while the IBM queue drains.'}
        </p>

        <Button
          type="submit"
          disabled={createPlan.isPending || vehicleIds.length === 0 || geocoded.length === 0}
        >
          {createPlan.isPending ? 'Calculating…' : 'Calculate zones'}
        </Button>
      </form>
    </Card>
  );
}
