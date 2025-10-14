import React, { useEffect, useState } from "react";
import {
  getUsagagVideos,
  createUsagagVideo,
  updateUsagagVideo,
  deleteUsagagVideo,
  uploadToR2,
  deleteFile,
} from "../../services/usagagVideoService";
import type { UsagagVideo } from "../../types/UsagagVideo";
import type { Pagination } from "../../types/Common";

const DEFAULT_LIMIT = 20;

const Videos: React.FC = () => {
  const [items, setItems] = useState<UsagagVideo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<UsagagVideo | null>(null);
  const [form, setForm] = useState<Partial<UsagagVideo>>({
    title: "",
    thumbnail: "",
    video: "",
  });
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const slugify = (str: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const load = async (p = page) => {
    setLoading(true);
    try {
      const res: Pagination<UsagagVideo> = await getUsagagVideos(p, DEFAULT_LIMIT);
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

  const resetForm = () => {
    setEditing(null);
    setForm({ title: "", thumbnail: "", video: "" });
    setThumbFile(null);
    setVideoFile(null);
  };

  const startEdit = (v: UsagagVideo) => {
    setEditing(v);
    setForm({ title: v.title, thumbnail: v.thumbnail, video: v.video });
  };


  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    if (name === "thumbnail") setThumbFile(files[0]);
    if (name === "video") setVideoFile(files[0]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (!form.title) {
        setErrorMsg("Please input title.");
        return;
      }

      const rawTitle = form.title.trim();
      let slugVal = slugify(rawTitle) || `v-${Date.now()}`;

      let thumbnailUrl = form.thumbnail;
      let videoUrl = form.video;

      if (thumbFile) {
        thumbnailUrl = await uploadToR2(thumbFile);
      }
      if (videoFile) {
        videoUrl = await uploadToR2(videoFile);
      }

      if (!thumbnailUrl || !videoUrl) {
        setErrorMsg("Missing thumbnail or video.");
        return;
      }

      const payload = {
        title: rawTitle,
        slug: slugVal,
        thumbnail: thumbnailUrl,
        video: videoUrl,
      };

      if (editing) {
        if (thumbFile && editing.thumbnail && editing.thumbnail !== thumbnailUrl) {
          await deleteFile(extractFilename(editing.thumbnail));
        }
        if (videoFile && editing.video && editing.video !== videoUrl) {
          await deleteFile(extractFilename(editing.video));
        }
        await updateUsagagVideo(editing.id, payload);
      } else {
        await createUsagagVideo(payload as any);
      }

      resetForm();
      await load(1);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || err.message || "Failed");
    }
  };
  const extractFilename = (url: string) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      return u.pathname.replace(/^\/+/, "").replace(/^files\//, "");
    } catch {
      return url;
    }
  };
  
  const remove = async (id: number) => {
    if (!confirm("Delete this item?")) return;

    const v = items.find((x) => x.id === id);
    if (v) {
      if (v.thumbnail) await deleteFile(extractFilename(v.thumbnail));
      if (v.video) await deleteFile(extractFilename(v.video));
    }

    await deleteUsagagVideo(id);
    
    await load(1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Usagag Videos</h1>
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white"
          onClick={resetForm}
        >
          New
        </button>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            name="title"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Thumbnail file</label>
          <input type="file" name="thumbnail" accept="image/*" onChange={onChangeFile} />
          {thumbFile && (
            <img
              src={URL.createObjectURL(thumbFile)}
              alt="thumb preview"
              className="h-24 w-40 mt-2 object-cover rounded border"
            />
          )}
          {form.thumbnail && !thumbFile && (
            <img src={form.thumbnail} className="h-24 w-40 mt-2 object-cover rounded border" />
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Video file</label>
          <input type="file" name="video" accept="video/*" onChange={onChangeFile} />
          {videoFile && (
            <video className="h-28 w-48 bg-black rounded mt-2" src={URL.createObjectURL(videoFile)} controls />
          )}
          {form.video && !videoFile && (
            <video className="h-28 w-48 bg-black rounded mt-2" src={form.video} controls />
          )}
        </div>

        <div className="md:col-span-2 flex gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
            disabled={loading}
          >
            {editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button type="button" className="px-4 py-2 rounded border" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
        {errorMsg && (
          <div className="md:col-span-2 text-sm text-red-600 whitespace-pre-line">{errorMsg}</div>
        )}
      </form>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Thumbnail</th>
              <th className="text-left p-3">Video</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.id}</td>
                <td className="p-3">{v.title}</td>
                <td className="p-3">{v.slug}</td>
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
                <td className="p-3">
                  {v.video ? (
                    <video className="h-24 w-40 bg-black rounded" src={v.video} controls />
                  ) : (
                    <span className="text-gray-400">No video</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button className="px-2 py-1 border rounded" onClick={() => startEdit(v)}>
                    Edit
                  </button>
                  <button className="px-2 py-1 border rounded text-red-600" onClick={() => remove(v.id)}>
                    Delete
                  </button>
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

export default Videos;

