'use client';

import ReactQuill from 'react-quill-new';

export default function RichTextDescriptionClient({ value, className }) {
  return (
    <ReactQuill
      className={className}
      value={value || ''}
      readOnly
      theme="bubble"
      modules={{ toolbar: false }}
    />
  );
}
