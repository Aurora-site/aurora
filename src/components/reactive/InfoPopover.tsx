import * as Popover from "@radix-ui/react-popover";

interface InfoPopoverProps {
  message: React.ReactNode;
}

export const InfoPopover = ({ message }: InfoPopoverProps) => (
  <Popover.Root>
    {/* ───── Trigger ───── */}
    <Popover.Trigger asChild>
      <button
        type="button"
        aria-label="Подсказка"
        className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#ebeded] hover:bg-gray-300"
      >
        <span className="text-[14px] font-bold text-black">?</span>
      </button>
    </Popover.Trigger>

    {/* ───── Content ───── */}
    <Popover.Portal>
      <Popover.Content
        side="top"
        align="center"
        sideOffset={4}
        collisionPadding={16}
        className="z-50 max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto rounded-md bg-[#ebeded] p-3 text-[16px] text-black"
      >
        {message}

        <Popover.Arrow className="fill-[#ebeded]" />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);
