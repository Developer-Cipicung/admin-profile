import { Card, CardBody } from '../common/Card';
import { formatDate } from '../../utils/date';

export const PopulationHistoryCard = ({ snapshot, onView, onDelete, latestSnapshotId }) => {
  const netGrowth = snapshot.birth_total + snapshot.move_in_total - snapshot.death_total - snapshot.move_out_total;

  return (
    <Card className="mb-4">
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 truncate">Snapshot {snapshot.month}/{snapshot.year}</h3>
            <p className="text-sm text-gray-500 truncate mt-1">{snapshot.source?.name || 'Unknown Source'}</p>
          </div>
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            netGrowth > 0 ? 'bg-green-100 text-green-800' : netGrowth < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {netGrowth > 0 ? '+' : ''}{netGrowth} Net
          </span>
        </div>
        
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total Population:</span>
            <span className="font-bold text-gray-900">{snapshot.current_population}</span>
          </div>
          <div className="flex justify-between">
            <span>Births / Move In:</span>
            <span className="font-medium text-green-600">+{snapshot.birth_total} / +{snapshot.move_in_total}</span>
          </div>
          <div className="flex justify-between">
            <span>Deaths / Move Out:</span>
            <span className="font-medium text-red-600">-{snapshot.death_total} / -{snapshot.move_out_total}</span>
          </div>
          <div className="flex justify-between">
            <span>Imported At:</span>
            <span className="font-medium text-gray-900">{formatDate(snapshot.imported_at)}</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-4 border-t pt-4">
          <button
            onClick={() => onView(snapshot)}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            View
          </button>
          <button
            onClick={() => onDelete(snapshot)}
            disabled={snapshot.id === latestSnapshotId}
            className={`font-medium ${
              snapshot.id === latestSnapshotId 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-red-600 hover:text-red-900'
            }`}
            title={snapshot.id === latestSnapshotId ? "The latest snapshot cannot be deleted" : "Delete snapshot"}
          >
            Delete
          </button>
        </div>
      </CardBody>
    </Card>
  );
};
