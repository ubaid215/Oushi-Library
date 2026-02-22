export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse flex flex-col gap-4 w-full">
            {/* Header Skeleton */}
            <div className="h-10 bg-[var(--color-dusty-100)] rounded-lg w-[40%] mb-4"></div>

            {/* Body Skeleton - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card p-4 min-h-[200px] flex flex-col gap-3">
                        <div className="h-32 bg-[var(--color-dusty-50)] rounded-md w-full"></div>
                        <div className="h-4 bg-[var(--color-dusty-100)] rounded w-3/4"></div>
                        <div className="h-4 bg-[var(--color-dusty-100)] rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
