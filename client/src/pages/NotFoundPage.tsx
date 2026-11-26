import { Link } from "react-router";
import { Button } from "@/components";

export const NotFoundPage = () => {
    return (
        <div className="flex min-h-svh w-full flex-col items-center justify-center gap-3 bg-zinc-200 text-center">
            <h1 className="text-4xl font-semibold text-zinc-950">Page Not Found</h1>
            <Button>
                <Link to="/">Go to home</Link>
            </Button>
        </div>
    )
}
