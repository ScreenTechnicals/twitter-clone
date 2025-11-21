import { cn } from "@/utils/cn"
import * as React from "react"

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
    ({ className, src, alt, fallback, ...props }, ref) => {
        const [hasError, setHasError] = React.useState(false)

        if (!src || hasError) {
            return (
                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
                        className
                    )}
                >
                    <span className="font-medium uppercase text-muted-foreground">
                        {fallback?.slice(0, 2) || "??"}
                    </span>
                </div>
            )
        }

        return (
            <img
                ref={ref}
                src={src}
                alt={alt}
                className={cn("aspect-square h-10 w-10 rounded-full object-cover", className)}
                onError={() => setHasError(true)}
                {...props}
            />
        )
    }
)
Avatar.displayName = "Avatar"

export { Avatar }
