export function AdSlot({ label = "Espaço Publicitário" }: { label?: string }) {
  return (
    <div className="w-full h-32 bg-muted rounded flex items-center justify-center border">
      <span className="text-muted-foreground font-bold tracking-widest text-sm uppercase">{label}</span>
    </div>
  );
}
