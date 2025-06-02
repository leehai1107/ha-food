export default function RootFooter() {
    return (
        <>{/* Footer */}
            <footer className="w-full px-6 py-4 bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} LeeHai. All rights reserved.
                </p>
            </footer>
        </>
    )
}
