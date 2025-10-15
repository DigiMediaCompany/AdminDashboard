import React, { useEffect, useState } from "react";
import {
  getMaquininhaMachines

} from "../../services/maquinhaMachineService";

import type { maquininha_machines } from "../../types/MaquininhaMachines";
import type { Pagination } from "../../types/Common";

const DEFAULT_LIMIT = 20;

const Articles: React.FC = () => {
  const [items, setItems] = useState<maquininha_machines[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);


  const load = async (p = page) => {
    setLoading(true);
    try {
      const res: Pagination<maquininha_machines> = await getMaquininhaMachines(p, DEFAULT_LIMIT);
      setItems(res.data);
      setPage(res.current_page);
      setTotalPages(res.total_pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);


  

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Maquininha Machines</h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Thumbnail</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Slug</th>
              
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.id}</td>
                <td className="p-3">
                  {v.thumbnail ? (
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="h-20 w-32 object-cover rounded border"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="p-3">{v.title}</td>
                <td className="p-3">{v.slug}</td>
                
                
                <td className="p-3 space-x-2">
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td className="p-4" colSpan={6}>{loading ? "Loading..." : "No data"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded"
          disabled={page <= 1}
          onClick={() => {
            const p = Math.max(1, page - 1);
            setPage(p);
            load(p);
          }}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded"
          disabled={page >= totalPages}
          onClick={() => {
            const p = Math.min(totalPages, page + 1);
            setPage(p);
            load(p);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Articles;

