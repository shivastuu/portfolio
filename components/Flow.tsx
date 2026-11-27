// "How it fits together": the project's main pieces as a chain of nodes, with dots travelling along the links.
export default function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="flow" aria-label="How it fits together">
      {steps.map((s, i) => (
        <li key={s} className="flow__node">
          <span className="flow__no mono">{String(i + 1).padStart(2, "0")}</span>
          <span className="flow__label">{s}</span>
        </li>
      ))}
    </ol>
  );
}
