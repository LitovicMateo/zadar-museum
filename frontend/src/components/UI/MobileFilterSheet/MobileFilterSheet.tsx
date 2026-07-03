import { type ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/UI/Sheet';
import { useIsMobile } from '@/hooks/UseMobile';

type MobileFilterSheetProps = {
	children: ReactNode;
	title: string;
};

/**
 * Renders filter controls inline on desktop. On mobile, collapses them behind a floating
 * "Filters" button (bottom-left, mirroring the bottom-right Edit button) that opens a bottom sheet.
 *
 * The trigger is portalled to <body> so it is anchored to the viewport — identical to the Edit
 * button — regardless of any transformed/blurred ancestor in the tab tree that would otherwise
 * make `position: fixed` resolve against the ancestor and drift the button out of alignment.
 */
const MobileFilterSheet = ({ children, title }: MobileFilterSheetProps) => {
	const isMobile = useIsMobile();
	const [open, setOpen] = useState(false);

	if (!isMobile) return <>{children}</>;

	return (
		<>
			{createPortal(
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-court px-5 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-white/10 transition hover:bg-court/90"
				>
					<SlidersHorizontal size={16} className="text-record" />
					Filters
				</button>,
				document.body
			)}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl border-border bg-card">
					<SheetHeader>
						<SheetTitle className="font-mono text-sm font-medium uppercase tracking-[0.12em]">{title}</SheetTitle>
						<SheetDescription className="sr-only">Adjust the filters for this list</SheetDescription>
					</SheetHeader>
					<div className="flex flex-col gap-4 px-4 pb-8 pt-2">{children}</div>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default MobileFilterSheet;
