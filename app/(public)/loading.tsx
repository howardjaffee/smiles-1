import { Container } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <Container className="py-24">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-24 rounded bg-ink-100" />
        <div className="h-8 w-2/3 rounded bg-ink-100" />
        <div className="h-4 w-full max-w-md rounded bg-ink-100" />
      </div>
    </Container>
  );
}
