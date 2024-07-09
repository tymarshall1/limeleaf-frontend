import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChangeEvent, ReactNode, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

function DefaultImgHeader({ children }: { children: ReactNode }) {
  return (
    <legend className="pb-2 text-3xl font-bold text-white border-b-2 border-white/50">
      {children}
    </legend>
  );
}

function DefaultImgSection({ children }: { children: ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

function DefaultImgTitle({ title }: { title: string }) {
  return (
    <>
      <h2 className="text-lg font-medium text-white md:text-xl">{title}</h2>
    </>
  );
}

function DefaultImgContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

function DefaultImg({
  id,
  handleChange,
  selectedBackground,
  imgUrl,
  className,
}: {
  id: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedBackground: string;
  imgUrl: string;
  className?: string;
}) {
  return (
    <>
      <input
        id={id}
        type="radio"
        name="defaultCommunityBg"
        className="appearance-none"
        value={imgUrl}
        onChange={handleChange}
      />
      <label
        className={`${
          selectedBackground === imgUrl
            ? "border-secondary"
            : "border-transparent"
        } border-2 hover:border-secondary rounded hover:cursor-pointer`}
        htmlFor={id}
      >
        <img src={imgUrl} alt={id} className={cn("w-full h-full", className)} />
      </label>
    </>
  );
}

type DefaultImgSelectorProps = {
  children: ReactNode;
  resetDefaultImg: () => void;
  itemHasBeenSelected?: boolean;
};

function DefaultImgSelector({
  children,
  resetDefaultImg,
  itemHasBeenSelected,
}: DefaultImgSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen}>
      <DialogTrigger
        onClick={openDialog}
        className="p-1 text-black rounded bg-secondary hover:bg-white/50 max-w-32 max-h-8"
      >
        Default Images
      </DialogTrigger>

      <DialogContent
        handleClose={closeDialog}
        className="bg-black pt-5 border-2 border-white/50  overflow-y-scroll max-h-[75%] max-w-screen-2xl scrollbar"
      >
        <form action="" className="space-y-3">
          <fieldset className="space-y-3">{children}</fieldset>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                closeDialog();
                resetDefaultImg();
              }}
              type="button"
              className=""
            >
              Cancel
            </Button>
            <Button
              disabled={!itemHasBeenSelected}
              onClick={() => {
                closeDialog();
              }}
              type="button"
            >
              Choose Background
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export {
  DefaultImgSelector,
  DefaultImgHeader,
  DefaultImgSection,
  DefaultImgTitle,
  DefaultImgContainer,
  DefaultImg,
};
