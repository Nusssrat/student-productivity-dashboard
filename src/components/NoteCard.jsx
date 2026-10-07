import { Pencil, Pin, PinOff, Trash2 } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toneFor } from '../utils/constants';

export default function NoteCard({ note, onPin, onEdit, onDelete }) {
  return (
    <div className="card mb-4 break-inside-avoid">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold leading-snug">{note.title}</h3>
        <button
          type="button"
          className={`icon-btn shrink-0 ${note.pinned ? '!text-brand-600 dark:!text-brand-100' : ''}`}
          onClick={() => onPin(note.id)}
          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
        >
          {note.pinned ? <Pin size={16} fill="currentColor" /> : <PinOff size={16} />}
        </button>
      </div>
      <span className={`badge mt-2 ${toneFor(note.category)}`}>{note.category}</span>
      <p className="muted mt-3 whitespace-pre-wrap text-sm leading-relaxed">{note.body}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="muted text-xs">Updated {formatDistanceToNow(parseISO(note.updatedAt), { addSuffix: true })}</span>
        <div className="flex">
          <button type="button" className="icon-btn" onClick={() => onEdit(note)} aria-label="Edit note"><Pencil size={16} /></button>
          <button type="button" className="icon-btn hover:!text-rose-600" onClick={() => onDelete(note)} aria-label="Delete note"><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
}
