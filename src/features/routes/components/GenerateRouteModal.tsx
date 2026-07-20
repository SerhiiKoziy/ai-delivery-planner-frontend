import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Modal } from '../../../components/shared';
import { useDepots } from '../../depots';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { useVehicles } from '../../vehicles';
import { useOptimizeRoutes } from '../api/useOptimizeRoutes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  deliveryIds: string[];
  onGenerated?: () => void;
}

export function GenerateRouteModal({ isOpen, onClose, deliveryIds, onGenerated }: Props) {
  const { data: depots = [], isLoading: depotsLoading } = useDepots();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const optimizeRoutes = useOptimizeRoutes();
  const navigate = useNavigate();

  const [depotId, setDepotId] = useState('');
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [returnToDepot, setReturnToDepot] = useState(true);

  const toggleVehicle = (id: string) => {
    setVehicleIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleClose = () => {
    optimizeRoutes.reset();
    setDepotId('');
    setVehicleIds([]);
    setReturnToDepot(true);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depotId || vehicleIds.length === 0) return;
    optimizeRoutes.mutate({
      delivery_ids: deliveryIds,
      vehicle_ids: vehicleIds,
      depot_id: depotId,
      return_to_depot: returnToDepot,
    });
  };

  const result = optimizeRoutes.data;
  const routes = result?.routes ?? [];
  const unassignedDeliveries = result?.unassigned_deliveries ?? [];
  const skippedNotGeocoded = result?.skipped_not_geocoded ?? [];
  const vehiclesWithoutDriver = result?.vehicles_without_driver ?? [];

  const handleViewRoute = (routeId: string) => {
    onGenerated?.();
    handleClose();
    navigate(`/routes/${routeId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Generate Route"
      footer={
        result ? (
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose} type="button">Cancel</Button>
            <Button
              type="submit"
              form="generate-route-form"
              disabled={optimizeRoutes.isPending || !depotId || vehicleIds.length === 0}
            >
              {optimizeRoutes.isPending ? 'Generating…' : 'Generate'}
            </Button>
          </>
        )
      }
    >
      {result ? (
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-ink">
            {routes.length > 0
              ? `Created ${routes.length} route${routes.length > 1 ? 's' : ''}.`
              : 'No routes were created.'}
          </p>

          {routes.map((route, i) => (
            <div
              key={route.id}
              className="flex items-center justify-between gap-2 bg-panel border border-edge rounded-lg px-3 py-2"
            >
              <span className="text-ink-muted">
                Route {i + 1} — {route.total_distance_km.toFixed(1)} km, {route.stops.length} stops
              </span>
              <Button variant="secondary" onClick={() => handleViewRoute(route.id)}>
                View →
              </Button>
            </div>
          ))}

          {unassignedDeliveries.length > 0 && (
            <div className="text-danger">
              <p className="m-0">
                {unassignedDeliveries.length} deliver
                {unassignedDeliveries.length > 1 ? 'ies' : 'y'} could not be assigned to any
                vehicle:
              </p>
              <ul className="m-0 pl-4">
                {unassignedDeliveries.map((d) => (
                  <li key={d.id}>
                    {d.customer_name || 'Unnamed'}
                    {d.address ? ` — ${d.address}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {skippedNotGeocoded.length > 0 && (
            <div className="text-danger">
              <p className="m-0">
                {skippedNotGeocoded.length} deliver
                {skippedNotGeocoded.length > 1 ? 'ies were' : 'y was'} skipped (address not
                geocoded):
              </p>
              <ul className="m-0 pl-4">
                {skippedNotGeocoded.map((d) => (
                  <li key={d.id}>
                    {d.customer_name || 'Unnamed'}
                    {d.address ? ` — ${d.address}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {vehiclesWithoutDriver.length > 0 && (
            <div className="text-danger">
              <p className="m-0">
                {vehiclesWithoutDriver.length} selected vehicle
                {vehiclesWithoutDriver.length > 1 ? 's have' : ' has'} no driver assigned and
                {vehiclesWithoutDriver.length > 1 ? ' were' : ' was'} skipped:
              </p>
              <ul className="m-0 pl-4">
                {vehiclesWithoutDriver.map((v) => (
                  <li key={v.id}>{v.plate_number || v.id}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          {optimizeRoutes.isError && (
            <div className="form-error">
              {getApiErrorMessage(optimizeRoutes.error, 'Failed to generate route.')}
            </div>
          )}
          <form id="generate-route-form" onSubmit={handleSubmit}>
            <p className="text-sm text-ink-muted mb-3">
              {deliveryIds.length} deliver{deliveryIds.length === 1 ? 'y' : 'ies'} selected.
            </p>

            <div className="field">
              <label htmlFor="gr-depot">Depot *</label>
              <select
                id="gr-depot"
                required
                value={depotId}
                onChange={(e) => setDepotId(e.target.value)}
                disabled={depotsLoading}
              >
                <option value="">
                  {depotsLoading ? 'Loading depots…' : 'Select a depot'}
                </option>
                {depots.map((depot) => (
                  <option key={depot.id} value={depot.id}>{depot.address}</option>
                ))}
              </select>
              {!depotsLoading && depots.length === 0 && (
                <span className="field__error">No depots yet — create one first.</span>
              )}
            </div>

            <div className="field">
              <label>Vehicles *</label>
              {vehiclesLoading ? (
                <p className="text-sm text-ink-muted">Loading vehicles…</p>
              ) : vehicles.length === 0 ? (
                <span className="field__error">No vehicles yet — create one first.</span>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                  {vehicles.map((vehicle) => (
                    <label key={vehicle.id} className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        style={{ width: 'auto' }}
                        checked={vehicleIds.includes(vehicle.id)}
                        onChange={() => toggleVehicle(vehicle.id)}
                      />
                      {vehicle.plate_number}
                      {vehicle.driver_id === null && (
                        <span className="text-xs text-ink-muted">(no driver)</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-ink mt-2">
              <input
                type="checkbox"
                checked={returnToDepot}
                onChange={(e) => setReturnToDepot(e.target.checked)}
              />
              Return to depot after last stop
            </label>
          </form>
        </>
      )}
    </Modal>
  );
}
