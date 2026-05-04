export function exportToCsv(rows, columns, headers = {}, filename = 'export') {
  if (!rows || rows.length === 0) return;

  // Build header row
  const headerRow = columns
    .map((col) => `"${(headers[col] || col).replace(/"/g, '""')}"`)
    .join(',');

  // Build data rows
  const dataRows = rows.map((row) =>
    columns
      .map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
