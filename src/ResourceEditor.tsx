import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Category, Resource } from "./types";

export default function ResourceEditor({
  resource,
  categories,
  onClose,
  onSave
}: {
  resource: Resource;
  open: boolean;
  categories: Category[];
  onClose: () => void;
  onSave: (resource: Resource) => void;
}) {
  const [draft, setDraft] = useState<Resource>(resource);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave({
      ...draft,
      id: draft.id || crypto.randomUUID(),
      image: draft.image || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80"
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] bg-black/60 p-4 backdrop-blur-xl">
      <motion.form
        onSubmit={submit}
        initial={{ y: 24, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 24, scale: 0.98 }}
        className="app-modal mx-auto mt-12 max-w-2xl rounded-[28px] border border-white/14 p-5 shadow-glow"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Resource Editor</div>
            <div className="text-xs text-white/42">Changes sync to the `resources` collection.</div>
          </div>
          <button type="button" onClick={onClose} className="icon-btn"><X size={16} /></button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
          <Field label="URL" value={draft.url} onChange={(url) => setDraft({ ...draft, url })} />
          <label className="space-y-2 text-xs text-white/45">
            Category
            <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Category })} className="field">
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <Field label="Accent" value={draft.accent} onChange={(accent) => setDraft({ ...draft, accent })} />
          <label className="space-y-2 text-xs text-white/45 sm:col-span-2">
            Description
            <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="field min-h-24 resize-none" />
          </label>
          <label className="space-y-2 text-xs text-white/45 sm:col-span-2">
            Thumbnail URL
            <input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} className="field" />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="magnetic-btn">Cancel</button>
          <button className="magnetic-btn primary">Save Resource</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 text-xs text-white/45">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="field" />
    </label>
  );
}
