"use client";

import { useTransition } from "react";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { moveProductOrder } from "./[slug]/actions";

export function ReorderButtons({
  productId,
  isFirst,
  isLast,
}: {
  productId: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await moveProductOrder(productId, direction);
    });
  }

  return (
    <div
      className="flex flex-col gap-0.5"
      onClick={(e) => {
        // não dispara o Link pai
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          move("up");
        }}
        disabled={isFirst || pending}
        className="p-1 rounded hover:bg-muted disabled:opacity-20"
        aria-label="Mover pra cima"
      >
        {pending ? <Loader2 className="size-3 animate-spin" /> : <ArrowUp className="size-3.5" />}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          move("down");
        }}
        disabled={isLast || pending}
        className="p-1 rounded hover:bg-muted disabled:opacity-20"
        aria-label="Mover pra baixo"
      >
        <ArrowDown className="size-3.5" />
      </button>
    </div>
  );
}
