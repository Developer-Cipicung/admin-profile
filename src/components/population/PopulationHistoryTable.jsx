import { formatDate } from '../../utils/date';

export const PopulationHistoryTable = ({ history, onView, onDelete, latestSnapshotId }) => {
  return (
    <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Snapshot
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Nama Sumber
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              Total Pop
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              Lahir / Masuk
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              Mati / Keluar
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Waktu Tarik
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {history.map((snapshot) => (
            <tr key={snapshot.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {snapshot.month}/{snapshot.year}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {snapshot.source?.name || '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900 text-right">
                {snapshot.current_population}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600 font-medium text-right">
                +{snapshot.birth_total} / +{snapshot.move_in_total}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-red-600 font-medium text-right">
                -{snapshot.death_total} / -{snapshot.move_out_total}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDate(snapshot.imported_at)}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => onView(snapshot)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Lihat
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
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
