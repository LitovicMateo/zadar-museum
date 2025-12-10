import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    children: React.ReactNode; // filter component
    SearchInput?: React.ReactNode; // optional search input element
    title?: string;
};

const MobileFilters: React.FC<Props> = ({ children, SearchInput, title = 'Filters' }) => {
    const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    if (!isMobile) return <>{children}</>;

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <button
                    className=" !bg-indigo-600 hover:!bg-indigo-700 active:!bg-indigo-800 !text-white px-4 py-1 rounded-[4px] shadow-sm focus:outline-none focus:!ring-2 focus:!ring-indigo-300"
                    onClick={() => setShow(true)}
                    aria-expanded={show}
                >
                    {title}
                </button>
                <div className="flex-1">{SearchInput}</div>
            </div>

            <AnimatePresence>
                {show && (
                    <motion.div className="fixed inset-0 z-50 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="absolute inset-0 bg-black/50" onClick={() => setShow(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} />

                        <motion.div className="relative w-full bg-white rounded-t-xl p-4 max-h-[80vh] overflow-auto mobile-filters-modal" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                            <style>{`.mobile-filters-modal button{background-color:#4f46e5 !important;color:#fff !important;border-radius:4px !important}`}</style>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-medium">{title}</h3>
                                <button className=" !bg-indigo-600 hover:!bg-indigo-700 active:!bg-indigo-800 !text-white px-3 py-1 rounded-[4px] shadow-sm focus:outline-none focus:!ring-2 focus:!ring-indigo-300" onClick={() => setShow(false)} aria-label="Close filters">
                                    Close
                                </button>
                            </div>
                            {children}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileFilters;
