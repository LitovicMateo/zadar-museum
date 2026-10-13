import React from 'react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { X } from 'lucide-react';

import UploadButtonWrapper from '@/components/UI/UploadButtonWrapper';
import { GalleryMedia } from '@/types/api/Game';
import { GalleryFormValue } from '@/utils/UploadGallery';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // keep in sync with backend upload sizeLimit

type FormWithGallery = { gallery?: GalleryFormValue | null };

type PreviewItem = { key: string; url: string; isVideo: boolean; remove: () => void };

const EMPTY: GalleryFormValue = { existing: [], files: [] };

const PreviewTile: React.FC<Omit<PreviewItem, 'key'>> = ({ url, isVideo, remove }) => (
	<div className="relative mb-4 break-inside-avoid overflow-hidden rounded-sm border border-gray-200 shadow-sm">
		<button
			type="button"
			onClick={remove}
			className="absolute right-2 top-2 z-10 flex rounded-full border border-red-600 bg-white/80 text-red-600"
		>
			<X size={14} />
		</button>
		{isVideo ? (
			<video src={url} muted controls preload="metadata" className="w-full" />
		) : (
			<img src={url} alt="" className="w-full" />
		)}
	</div>
);

const MediaGalleryField: React.FC = () => {
	const { watch, setValue } = useFormContext<FormWithGallery>();
	const value = watch('gallery') ?? EMPTY;
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	const objectUrls = React.useMemo(() => value.files.map((f) => URL.createObjectURL(f)), [value.files]);
	React.useEffect(() => () => objectUrls.forEach((u) => URL.revokeObjectURL(u)), [objectUrls]);

	const update = (next: GalleryFormValue) => setValue('gallery', next, { shouldDirty: true });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const picked = Array.from(e.target.files ?? []);
		e.target.value = '';

		const accepted = picked.filter((f) => f.size <= MAX_FILE_SIZE);
		if (accepted.length < picked.length) {
			toast.error('Files larger than 100MB were skipped');
		}
		if (accepted.length > 0) update({ ...value, files: [...value.files, ...accepted] });
	};

	const items: PreviewItem[] = [
		...value.existing.map((m: GalleryMedia, i) => ({
			key: `existing-${m.id ?? i}`,
			url: m.url,
			isVideo: m.mime?.startsWith('video/') ?? false,
			remove: () => update({ ...value, existing: value.existing.filter((_, idx) => idx !== i) })
		})),
		...value.files.map((f, i) => ({
			key: `new-${f.name}-${i}`,
			url: objectUrls[i],
			isVideo: f.type.startsWith('video/'),
			remove: () => update({ ...value, files: value.files.filter((_, idx) => idx !== i) })
		}))
	];

	return (
		<div className="flex flex-col gap-3">
			<UploadButtonWrapper label={items.length > 0 ? 'Add More Photos / Videos' : 'Upload Photos / Videos'}>
				<input
					ref={inputRef}
					className="hidden"
					type="file"
					accept="image/*,video/*"
					multiple
					onChange={handleChange}
				/>
			</UploadButtonWrapper>
			{items.length > 0 && (
				<div className="columns-2 gap-4 md:columns-3">
					{items.map(({ key, ...tile }) => (
						<PreviewTile key={key} {...tile} />
					))}
				</div>
			)}
		</div>
	);
};

export default MediaGalleryField;
