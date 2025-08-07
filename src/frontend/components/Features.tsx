export function Features() {
  const features = [
    ['Free to use', 'badge-info'],
    ['Open source', 'badge-success'],
    ['No signup required', 'badge-warning'],
  ] as const;

  return (
    <ul className="flex flex-wrap justify-center gap-3">
      {features.map(([feature, color]) => (
        <li
          className={`badge badge-outline bg-base-100 border-1 p-3 whitespace-nowrap ${color}`}
          key={`${feature}-${color}`}
        >
          <span className="text-neutral">{feature}</span>
        </li>
      ))}
    </ul>
  );
}
